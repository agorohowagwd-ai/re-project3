'use client';
import { useState } from 'react';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

// Plain <a href> cannot send the login token, so downloads go through fetch + Blob.
export default function DownloadButton({ product, file }: { product: string; file: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function download() {
    setBusy(true); setError('');
    try {
      const { data } = await getSupabaseBrowser().auth.getSession();
      if (!data.session) throw new Error('Войдите в аккаунт, чтобы скачать файл.');
      const res = await fetch(`/api/education/download?product=${encodeURIComponent(product)}&file=${encodeURIComponent(file)}`, {
        headers: { Authorization: `Bearer ${data.session.access_token}` },
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'Не удалось скачать файл.');
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement('a');
      a.href = url; a.download = file; document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch (e) { setError(e instanceof Error ? e.message : 'Не удалось скачать файл.'); }
    finally { setBusy(false); }
  }
  return <div className="downloadItem"><button type="button" className="downloadBtn" onClick={download} disabled={busy}>{busy ? 'Загружаем…' : `${file} ↓`}</button>{error && <div className="formError">{error}</div>}</div>;
}
