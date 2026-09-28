import { NextRequest, NextResponse } from 'next/server';
import { requireUser, getSupabaseAdmin } from '@/lib/supabase-server';
import { getUserRole } from '@/lib/auth-role';

export const runtime = 'nodejs';
export const maxDuration = 120;

// ADMIN ONLY. Clients never call OpenAI: they upload a photo + brief, the owner presses "Generate" in /admin.
export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'AI не подключён: добавьте OPENAI_API_KEY в Vercel.' }, { status: 503 });
  try {
    const { supabase, user } = await requireUser(request);
    if ((await getUserRole(supabase, user.id)) !== 'admin') return NextResponse.json({ error: 'Генерацию запускает только администратор.' }, { status: 403 });

    const body = await request.json();
    const requestId = String(body.requestId || '');
    const extra = String(body.extra || '').trim().slice(0, 1000);
    const { data: row } = await supabase.from('requests').select('id,user_id,service_id,status,payload').eq('id', requestId).maybeSingle();
    if (!row) return NextResponse.json({ error: 'Заявка не найдена.' }, { status: 404 });
    if (row.service_id !== 'visual') return NextResponse.json({ error: 'Это не заявка на AI-визуализацию.' }, { status: 400 });
    if (row.status !== 'paid' && !body.force) return NextResponse.json({ error: 'Заявка не оплачена.', code: 'UNPAID' }, { status: 402 });

    const payload = row.payload || {};
    const sourcePath = String(payload.sourcePath || '');
    if (!sourcePath.startsWith(`${row.user_id}/sources/`)) return NextResponse.json({ error: 'Клиент ещё не загрузил исходное фото.' }, { status: 400 });
    const style = String(payload.style || 'Minimalism');
    const messages: { text?: string }[] = Array.isArray(payload.messages) ? payload.messages : [];
    if (!messages.length) return NextResponse.json({ error: 'В заявке нет описания задачи.' }, { status: 400 });

    const admin = getSupabaseAdmin();
    const download = await admin.storage.from('reproject-assets').download(sourcePath);
    if (download.error || !download.data) throw new Error('Не удалось прочитать исходное фото.');

    const brief = messages.map((m, i) => `${i + 1}. ${String(m.text || '').trim()}`).filter(Boolean).join('\n');
    const prompt = `
Edit the provided real interior photograph into a photorealistic architectural interior visualization.

SOURCE PRESERVATION — critical:
- Keep the exact room identity, camera position, perspective, proportions and architectural geometry.
- Preserve windows, doors, openings, ceiling height, floor geometry and fixed structural elements unless explicitly requested otherwise.
- Keep the composition recognizable as the same room.
- Do not invent a different room or change the camera angle.

DESIGN DIRECTION: ${style}

USER BRIEF:
${brief}
${extra ? `\nADDITIONAL DESIGNER NOTES:\n${extra}\n` : ''}
RESULT:
Create a realistic, professionally designed interior visualization with believable materials, natural lighting, accurate scale and coherent construction details. Only make changes requested by the user and those necessary to express the selected style. Do not add people, text, logos, watermarks or unrelated decorative objects.
`;

    const form = new FormData();
    form.append('model', 'gpt-image-2');
    form.append('image[]', download.data, 'interior.jpg');
    form.append('prompt', prompt);
    form.append('quality', 'medium');
    form.append('output_format', 'jpeg');
    form.append('output_compression', '88');
    form.append('size', 'auto');

    const response = await fetch('https://api.openai.com/v1/images/edits', { method: 'POST', headers: { Authorization: `Bearer ${apiKey}` }, body: form });
    const data = await response.json();
    if (!response.ok) return NextResponse.json({ error: data?.error?.message || 'OpenAI API вернул ошибку.' }, { status: response.status });
    const base64 = data?.data?.[0]?.b64_json;
    if (!base64) return NextResponse.json({ error: 'AI не вернул изображение. Попробуйте ещё раз.' }, { status: 502 });

    // Result is stored in the CLIENT's folder so the existing account page shows it.
    const path = `${row.user_id}/${crypto.randomUUID()}.jpg`;
    const upload = await admin.storage.from('reproject-assets').upload(path, Buffer.from(base64, 'base64'), { contentType: 'image/jpeg', upsert: false });
    if (upload.error) throw new Error(`Не удалось сохранить визуализацию: ${upload.error.message}`);
    const insert = await admin.from('visualizations').insert({ user_id: row.user_id, source_name: payload.fileName || 'interior.jpg', style, messages, result_path: path }).select('id,user_id,source_name,style,messages,result_path,created_at').single();
    if (insert.error) throw new Error(`Не удалось сохранить проект: ${insert.error.message}`);

    await admin.from('requests').update({ payload: { ...payload, generations: (Number(payload.generations) || 0) + 1, lastGeneratedAt: new Date().toISOString() } }).eq('id', row.id);
    await admin.from('messages').insert({ user_id: row.user_id, request_id: row.id, body: 'Готов новый AI-вариант вашего пространства — он в разделе «Мои проекты».', sender_role: 'admin' });

    const signed = await admin.storage.from('reproject-assets').createSignedUrl(path, 60 * 60 * 24);
    return NextResponse.json({ visualization: { ...insert.data, image: signed.data?.signedUrl || '' }, generations: (Number(payload.generations) || 0) + 1 });
  } catch (error) {
    console.error('re:project generation error', error);
    const message = error instanceof Error && error.message === 'UNAUTHORIZED' ? 'Войдите в аккаунт.' : error instanceof Error ? error.message : 'Не удалось выполнить генерацию.';
    return NextResponse.json({ error: message }, { status: message.startsWith('Войдите') ? 401 : 500 });
  }
}
