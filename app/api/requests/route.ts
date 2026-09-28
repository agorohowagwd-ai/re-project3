import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabase-server';
import { getService } from '@/lib/services';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await requireUser(request);
    const body = await request.json();
    const serviceId = String(body.serviceId || '').trim();
    const serviceTitle = String(body.serviceTitle || '').trim();
    const EXTRA_PRICES: Record<string, string> = { architecture: '200 000 ₽', 'apartment-project': 'По согласованию', 'house-project': 'По согласованию' };
    const price = getService(serviceId)?.price ?? EXTRA_PRICES[serviceId];
    if (!price || !serviceTitle) return NextResponse.json({ error: 'Неизвестная услуга.' }, { status: 400 });

    const row = {
      user_id: user.id,
      service_id: serviceId,
      service_title: serviceTitle,
      price, // price is ALWAYS taken from the server-side catalog, never from the client
      name: body.name ? String(body.name) : null,
      email: body.email ? String(body.email) : user.email || null,
      phone: body.phone ? String(body.phone) : null,
      message: body.message ? String(body.message) : null,
      payload: body.payload && typeof body.payload === 'object' ? (({ sourcePath, generations, lastGeneratedAt, ...safe }: any) => safe)(body.payload) : {},
    };
    const { data, error } = await supabase.from('requests').insert(row).select('id,created_at,status').single();
    if (error) throw error;
    return NextResponse.json({ id: data.id, request: data });
  } catch (error) {
    const message = error instanceof Error && error.message === 'UNAUTHORIZED' ? 'Войдите в аккаунт, чтобы отправить заявку.' : error instanceof Error ? error.message : 'Не удалось отправить заявку.';
    return NextResponse.json({ error: message }, { status: message.startsWith('Войдите') ? 401 : 500 });
  }
}
