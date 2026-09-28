import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabase-server';

export const runtime = 'nodejs';
const MAX_CHARS = 4_000_000; // Vercel serverless request body limit is ~4.5 MB

// Client uploads the SOURCE photo for an AI request. No AI is called here, so it costs nothing.
export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await requireUser(request);
    const body = await request.json();
    const requestId = String(body.requestId || '');
    const image = String(body.image || '');
    const match = image.match(/^data:image\/(jpeg|jpg|png|webp);base64,(.+)$/i);
    if (!requestId || !match) return NextResponse.json({ error: 'Некорректные данные.' }, { status: 400 });
    if (image.length > MAX_CHARS) return NextResponse.json({ error: 'Фото слишком большое. Загрузите файл меньшего размера.' }, { status: 413 });

    const { data: row } = await supabase.from('requests').select('id,service_id,payload').eq('id', requestId).eq('user_id', user.id).maybeSingle();
    if (!row) return NextResponse.json({ error: 'Заявка не найдена.' }, { status: 404 });
    if (row.service_id !== 'visual') return NextResponse.json({ error: 'Эта заявка не относится к AI-визуализации.' }, { status: 400 });

    const path = `${user.id}/sources/${requestId}.jpg`;
    const bytes = Buffer.from(match[2], 'base64');
    const upload = await supabase.storage.from('reproject-assets').upload(path, bytes, { contentType: `image/${match[1].toLowerCase().replace('jpg', 'jpeg')}`, upsert: true });
    if (upload.error) throw new Error(`Не удалось сохранить фото: ${upload.error.message}`);
    const payload = { ...(row.payload || {}), sourcePath: path };
    const update = await supabase.from('requests').update({ payload }).eq('id', requestId);
    if (update.error) throw update.error;
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error && error.message === 'UNAUTHORIZED' ? 'Войдите в аккаунт.' : error instanceof Error ? error.message : 'Не удалось сохранить фото.';
    return NextResponse.json({ error: message }, { status: message.startsWith('Войдите') ? 401 : 500 });
  }
}
