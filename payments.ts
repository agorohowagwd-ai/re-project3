import { getEducationOffer } from '@/lib/education';

export type PayStatus = 'paid' | 'cancelled' | 'pending';

/** Ask Sber directly what happened to the order. Never trust callback parameters. */
export async function verifySberOrder(orderId: string, expectedRub: number): Promise<PayStatus | null> {
  const userName = process.env.SBER_USERNAME;
  const password = process.env.SBER_PASSWORD;
  if (!userName || !password) return null;
  const response = await fetch('https://ecom.sberbank.ru/ecomm/gw/partner/api/v1/getOrderStatusExtended.do', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName, password, orderId }),
  });
  const data = await response.json();
  const code = Number(data.orderStatus);
  if (code === 2) {
    // amount is in kopecks; refuse to mark paid if it does not match what we registered
    if (Number(data.amount) !== expectedRub * 100) return 'pending';
    return 'paid';
  }
  if (code === 3 || code === 4 || code === 6) return 'cancelled';
  return 'pending';
}

/** Idempotent: marks the request paid and grants education access. */
export async function applyPaid(supabase: any, payment: any) {
  await supabase.from('payments').update({ status: 'paid' }).eq('id', payment.id);
  if (payment.request_id) {
    await supabase.from('requests').update({ status: 'paid' }).eq('id', payment.request_id).eq('user_id', payment.user_id);
  }
  if (payment.product_type === 'education' && payment.product_slug && getEducationOffer(payment.product_slug)) {
    await supabase.from('education_access').upsert(
      { user_id: payment.user_id, product_slug: payment.product_slug, payment_id: payment.id },
      { onConflict: 'user_id,product_slug', ignoreDuplicates: true },
    );
  }
}

export const isManual = (orderId?: string | null) => !!orderId && orderId.startsWith('manual-');
