import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-server';
import { applyPaid, isManual, verifySberOrder } from '@/lib/payments';

export const runtime = 'nodejs';

async function readParams(request: NextRequest): Promise<Record<string, any>> {
  if (request.method === 'GET') return Object.fromEntries(new URL(request.url).searchParams);
  const type = request.headers.get('content-type') || '';
  if (type.includes('application/json')) return await request.json().catch(() => ({}));
  const form = await request.formData().catch(() => null);
  return form ? Object.fromEntries(form.entries()) : {};
}

// The callback only tells us WHICH order to re-check. The real status always comes from Sber.
async function handle(request: NextRequest) {
  try {
    const params = await readParams(request);
    const orderId = String(params.mdOrder || params.orderId || params.orderID || params.order_id || '');
    if (!orderId || isManual(orderId)) return NextResponse.json({ ok: false }, { status: 400 });

    const supabase = getSupabaseAdmin();
    const { data: payment } = await supabase.from('payments').select('*').eq('order_id', orderId).maybeSingle();
    if (!payment) return NextResponse.json({ ok: false }, { status: 404 });
    if (payment.status === 'paid') return NextResponse.json({ ok: true, status: 'paid' });

    const status = await verifySberOrder(orderId, payment.amount);
    if (!status) return NextResponse.json({ ok: false, error: 'Sber not configured' }, { status: 503 });
    if (status === 'paid') await applyPaid(supabase, payment);
    else await supabase.from('payments').update({ status }).eq('id', payment.id);
    return NextResponse.json({ ok: true, status });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : 'callback error' }, { status: 500 });
  }
}
export async function POST(request: NextRequest) { return handle(request); }
export async function GET(request: NextRequest) { return handle(request); }
