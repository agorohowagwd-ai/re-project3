import { NextRequest, NextResponse } from 'next/server';
import { requireUser, getSupabaseAdmin } from '@/lib/supabase-server';
import { getUserRole } from '@/lib/auth-role';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const { supabase, user } = await requireUser(request);
    const body = await request.json();
    const text = String(body.body || '').trim().slice(0, 5000);
    const requestId = body.requestId ? String(body.requestId) : null;
    const targetUserId = body.targetUserId ? String(body.targetUserId) : null;
    if (!text) return NextResponse.json({ error: 'Сообщение пустое.' }, { status: 400 });

    const role = await getUserRole(supabase, user.id);
    let ownerId = user.id;
    if (role === 'client') {
      if (!requestId) return NextResponse.json({ error: 'Выберите проект.' }, { status: 400 });
      const { data } = await supabase.from('requests').select('id').eq('id', requestId).eq('user_id', user.id).maybeSingle();
      if (!data) return NextResponse.json({ error: 'Проект не найден.' }, { status: 404 });
    } else {
      if (!targetUserId) return NextResponse.json({ error: 'Не указан клиент.' }, { status: 400 });
      ownerId = targetUserId;
      if (requestId) {
        const { data } = await supabase.from('requests').select('id').eq('id', requestId).eq('user_id', targetUserId).maybeSingle();
        if (!data) return NextResponse.json({ error: 'Проект не найден.' }, { status: 404 });
      }
    }
    const writer = role === 'client' ? supabase : getSupabaseAdmin();
    const { data, error } = await writer.from('messages').insert({ user_id: ownerId, request_id: requestId, body: text, sender_role: role }).select().single();
    if (error) throw error;
    return NextResponse.json({ message: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Не удалось отправить сообщение.';
    return NextResponse.json({ error: message }, { status: message === 'UNAUTHORIZED' ? 401 : 500 });
  }
}
