import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabase-server';
import { getUserRole } from '@/lib/auth-role';
import { applyPaid, isManual } from '@/lib/payments';

export const runtime = 'nodejs';

// Owner confirms (or rejects) a manual transfer to the Sber phone number.
export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await requireUser(request);
    if ((await getUserRole(supabase, user.id)) !== 'admin') return NextResponse.json({ error: 'Только для владельца.' }, { status: 403 });
    const body = await request.json();
    const paymentId = String(body.paymentId || '');
    const action = String(body.action || '');
    const { data: payment } = await supabase.from('payments').select('*').eq('id', paymentId).maybeSingle();
    if (!payment) return NextResponse.json({ error: 'Платёж не найден.' }, { status: 404 });
    if (!isManual(payment.order_id)) return NextResponse.json({ error: 'Этот платёж подтверждается автоматически через Сбер.' }, { status: 400 });
    if (action === 'confirm') { await applyPaid(supabase, payment); return NextResponse.json({ ok: true, status: 'paid' }); }
    if (action === 'reject') {
      if (payment.status === 'paid') return NextResponse.json({ error: 'Платёж уже подтверждён.' }, { status: 400 });
      await supabase.from('payments').update({ status: 'cancelled' }).eq('id', payment.id);
      return NextResponse.json({ ok: true, status: 'cancelled' });
    }
    return NextResponse.json({ error: 'Неизвестное действие.' }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Ошибка.';
    return NextResponse.json({ error: message }, { status: message === 'UNAUTHORIZED' ? 401 : 500 });
  }
}
