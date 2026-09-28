import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabase-server';
import { getEducationOffer } from '@/lib/education';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await requireUser(request);
    const body = await request.json();
    const requestId = body.requestId ? String(body.requestId) : null;
    const productSlug = body.productSlug ? String(body.productSlug) : null;
    const productType = body.productType ? String(body.productType) : null;
    let amount = 0;
    let description = 're:project';
    if (!requestId && productType !== 'education') return NextResponse.json({ error: 'Укажите заявку или материал для оплаты.' }, { status: 400 });

    if (requestId) {
      const { data: requestRow } = await supabase.from('requests').select('id,user_id,service_id,service_title,price,status').eq('id', requestId).eq('user_id', user.id).maybeSingle();
      if (!requestRow) return NextResponse.json({ error: 'Заявка не найдена.' }, { status: 404 });
      if (requestRow.status === 'paid') return NextResponse.json({ mode: 'owned', requestId, status: 'paid' });
      const digits = String(requestRow.price || '').replace(/[^0-9]/g, '');
      if (digits) amount = Number(digits);
      description = `re:project — ${requestRow.service_title}`.slice(0, 99);
    }

    if (productType === 'education') {
      if (!productSlug) return NextResponse.json({ error: 'Не указан продукт.' }, { status: 400 });
      const offer = getEducationOffer(productSlug);
      if (!offer) return NextResponse.json({ error: 'Продукт не найден.' }, { status: 404 });
      amount = offer.amount;
      description = `re:project education — ${offer.title}`.slice(0, 99);
      const { data: existing } = await supabase.from('education_access').select('id').eq('user_id', user.id).eq('product_slug', productSlug).maybeSingle();
      if (existing) return NextResponse.json({ mode: 'owned', productSlug, status: 'paid' });
    }

    const username = process.env.SBER_USERNAME;
    const password = process.env.SBER_PASSWORD;
    const returnUrl = process.env.SBER_RETURN_URL || `${new URL(request.url).origin}/account`;
    const callbackUrl = process.env.SBER_CALLBACK_URL || `${new URL(request.url).origin}/api/payment/callback`;
    if (!Number.isFinite(amount) || amount < 100) return NextResponse.json({ error: 'Некорректная сумма.' }, { status: 400 });

    if (!username || !password) {
      // No acquiring credentials yet -> manual transfer to the owner's Sber phone number, confirmed by the owner in /admin
      const phone = process.env.MANUAL_PAY_PHONE || '+7 977 916-65-65';
      let q = supabase.from('payments').select('id,order_id,amount,metadata').eq('user_id', user.id).eq('status', 'pending').like('order_id', 'manual-%');
      q = requestId ? q.eq('request_id', requestId) : q.eq('product_slug', productSlug as string);
      const { data: existing } = await q.order('created_at', { ascending: false }).limit(1).maybeSingle();
      if (existing) return NextResponse.json({ mode: 'manual', phone, code: existing.metadata?.code, orderId: existing.order_id, amount: existing.amount, status: 'pending' });
      const code = `RP-${crypto.randomUUID().slice(0, 6).toUpperCase()}`;
      const orderId = `manual-${crypto.randomUUID().slice(0, 12)}`;
      const ins = await supabase.from('payments').insert({
        user_id: user.id, request_id: requestId, order_id: orderId, amount, description, status: 'pending',
        product_type: productType, product_slug: productSlug, metadata: { manual: true, code, ...(productSlug ? { productSlug, productType } : {}) },
      }).select('id').single();
      if (ins.error) throw ins.error;
      return NextResponse.json({ mode: 'manual', phone, code, orderId, amount, status: 'pending', paymentId: ins.data.id });
    }

    const orderNumber = `rp-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    const response = await fetch('https://ecom.sberbank.ru/ecomm/gw/partner/api/v1/register.do', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userName: username, password, orderNumber, amount: amount * 100, returnUrl, description,
        dynamicCallbackUrl: callbackUrl, features: 'FORCE_SSL',
        jsonParams: { 'sberpay.backurl': returnUrl },
      }),
    });
    const data = await response.json();
    if (!response.ok || data.errorCode !== '0') return NextResponse.json({ error: data.errorMessage || 'Сбер не создал заказ.' }, { status: 502 });

    const paymentInsert = await supabase.from('payments').insert({
      user_id: user.id, request_id: requestId, order_id: data.orderId, amount, description, status: 'pending',
      product_type: productType, product_slug: productSlug, metadata: productSlug ? { productSlug, productType } : {},
    }).select('id').single();
    if (paymentInsert.error) throw paymentInsert.error;

    return NextResponse.json({ mode: 'sber', formUrl: data.formUrl, deepLink: data.externalParams?.sbolDeepLink || '', orderId: data.orderId, amount, status: 'pending', paymentId: paymentInsert.data.id, productSlug });
  } catch (error) {
    const message = error instanceof Error && error.message === 'UNAUTHORIZED' ? 'Войдите в аккаунт, чтобы оплатить.' : error instanceof Error ? error.message : 'Не удалось создать платёж.';
    return NextResponse.json({ error: message }, { status: message.startsWith('Войдите') ? 401 : 500 });
  }
}
