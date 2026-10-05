'use client';
import { useState } from 'react';
import QRCode from 'qrcode';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

type Props = { amount?: number; description?: string; requestId?: string; productType?: string; productSlug?: string; onPaid?: () => void };

export default function PaymentPanel({ amount = 2000, description = 're:project — услуга', requestId, productType, productSlug, onPaid }: Props) {
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [data, setData] = useState<any>(null);
  const [qr, setQr] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function token() {
    const { data: auth } = await getSupabaseBrowser().auth.getSession();
    return auth.session?.access_token || '';
  }

  async function create() {
    setLoading(true); setError('');
    try {
      const t = await token();
      if (!t) { setError('Сначала войдите в аккаунт.'); return; }
      const r = await fetch('/api/payment', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` }, body: JSON.stringify({ description, requestId, productType, productSlug }) });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Не удалось создать платёж');
      setData(j);
      const link = j.deepLink || j.formUrl;
      if (link) setQr(await QRCode.toDataURL(link, { width: 340, margin: 1 }));
      if (j.mode === 'owned') onPaid?.();
    } catch (e) { setError(e instanceof Error ? e.message : 'Ошибка оплаты'); }
    finally { setLoading(false); }
  }

  async function check() {
    if (!data?.orderId) return;
    setChecking(true); setError(''); setNotice('');
    try {
      const r = await fetch(`/api/payment/status?orderId=${encodeURIComponent(data.orderId)}`, { headers: { Authorization: `Bearer ${await token()}` } });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || 'Не удалось проверить оплату');
      setData((v: any) => ({ ...v, status: j.status }));
      if (j.status === 'paid') onPaid?.();
      else if (j.status === 'pending') setNotice(data.mode === 'manual' ? 'Перевод ещё не подтверждён. Обычно это занимает до рабочего дня — доступ откроется автоматически.' : 'Оплата ещё не поступила.');
      else setError(`Статус платежа: ${j.status}`);
    } catch (e) { setError(e instanceof Error ? e.message : 'Не удалось проверить оплату'); }
    finally { setChecking(false); }
  }

  if (data?.mode === 'owned') return <div className="paymentPanel"><div className="successBox"><small>ACCESS / ACTIVE</small><h3>Уже оплачено.</h3><p>Откройте личный кабинет — материалы и проекты доступны там.</p></div></div>;

  return <div className="paymentPanel">
    <div className="paymentTop"><div><small>ОПЛАТА</small><strong>{amount.toLocaleString('ru-RU')} ₽</strong></div>{!data && <button className="dark" onClick={create} disabled={loading}>{loading ? 'Создаём платёж…' : 'Перейти к оплате '}</button>}</div>
    {error && <div className="formError">{error}</div>}
    {data?.mode === 'sber' && <div className="paymentQr"><img src={qr} alt="QR для оплаты" /><div><small>SBERPAY / СБП</small><h3>Оплатите заказ.</h3><p>После оплаты нажмите кнопку проверки статуса. Доступ откроется автоматически.</p>{data.formUrl && <a className="outline" href={data.formUrl} target="_blank" rel="noreferrer">Открыть платёжную страницу </a>}<button className="dark paymentCheck" onClick={check} disabled={checking}>{checking ? 'Проверяем…' : data.status === 'paid' ? 'Оплата подтверждена' : 'Я оплатил(а) — проверить '}</button></div></div>}
    {data?.mode === 'manual' && <div className="manualPay"><small>ПЕРЕВОД ПО НОМЕРУ · СБЕРБАНК</small><h3>Переведите {Number(data.amount).toLocaleString('ru-RU')} ₽ по указанным реквизитам.</h3><div className="payRow"><span>Номер телефона</span><b>{data.phone}</b></div><div className="payRow"><span>Сумма</span><b>{Number(data.amount).toLocaleString('ru-RU')} ₽</b></div><div className="payRow"><span>Комментарий к переводу</span><b>{data.code}</b></div><p>Обязательно укажите комментарий — по нему мы найдём ваш платёж. После проверки перевода доступ откроется в личном кабинете.</p><button className="dark paymentCheck" onClick={check} disabled={checking}>{checking ? 'Проверяем…' : data.status === 'paid' ? 'Оплата подтверждена' : 'Я оплатил(а) — проверить '}</button></div>}
    {notice && <div className="paymentNotice">{notice}</div>}
  </div>;
}
