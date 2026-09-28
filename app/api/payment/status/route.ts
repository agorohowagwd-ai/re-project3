import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabase-server';
import { applyPaid, isManual, verifySberOrder } from '@/lib/payments';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { supabase, user } = await requireUser(request);
    const orderId = new URL(request.url).searchParams.get('orderId');
    if (!orderId) return NextResponse.json({ error: 'Нет номера заказа.' }, { status: 400 });
    const { data: payment } = await supabase.from('payments').select('*').eq('order_id', orderId).eq('user_id', user.id).maybeSingle();
    if (!payment) return NextResponse.json({ error: 'Платёж не найден.' }, { status: 404 });
    const done = { productSlug: payment.product_slug || null };
    if (payment.status === 'paid' || isManual(payment.order_id)) return NextResponse.json({ status: payment.status, ...done });

    const status = await verifySberOrder(orderId, payment.amount);
    if (!status) return NextResponse.json({ status: payment.status, ...done });
    if (status === 'paid') await applyPaid(supabase, payment);
    else await supabase.from('payments').update({ status }).eq('id', payment.id);
    return NextResponse.json({ status, ...done });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Не удалось проверить платёж.';
    return NextResponse.json({ error: message }, { status: message === 'UNAUTHORIZED' ? 401 : 500 });
  }
}
