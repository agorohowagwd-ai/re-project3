import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/supabase-server';
import { getUserRole } from '@/lib/auth-role';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { supabase, user } = await requireUser(request);
    const role = await getUserRole(supabase, user.id);
    const [requestsResult, visualsResult, paymentsResult, messagesResult, educationAccessResult] = await Promise.all([
      supabase.from('requests').select('id,service_id,service_title,price,status,name,email,phone,message,payload,created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('visualizations').select('id,source_name,style,messages,result_path,created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('payments').select('id,order_id,request_id,amount,description,status,created_at').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('messages').select('id,user_id,request_id,body,sender_role,created_at').eq('user_id', user.id).order('created_at', { ascending: true }),
      supabase.from('education_access').select('product_slug,granted_at,payment_id').eq('user_id', user.id).order('granted_at', { ascending: false }),
    ]);
    if (requestsResult.error) throw requestsResult.error;
    if (visualsResult.error) throw visualsResult.error;
    if (paymentsResult.error) throw paymentsResult.error;
    if (messagesResult.error) throw messagesResult.error;
    if (educationAccessResult.error) throw educationAccessResult.error;

    const visualizations = await Promise.all((visualsResult.data || []).map(async (item) => {
      const signed = await supabase.storage.from('reproject-assets').createSignedUrl(item.result_path, 60 * 60 * 24 * 7);
      return { ...item, image: signed.data?.signedUrl || '' };
    }));

    return NextResponse.json({ user: { id: user.id, email: user.email }, role, requests: requestsResult.data || [], visualizations, payments: paymentsResult.data || [], messages: messagesResult.data || [], educationAccess: educationAccessResult.data || [] });
  } catch (error) {
    const message = error instanceof Error && error.message === 'UNAUTHORIZED' ? 'UNAUTHORIZED' : error instanceof Error ? error.message : 'Не удалось загрузить кабинет.';
    return NextResponse.json({ error: message }, { status: message === 'UNAUTHORIZED' ? 401 : 500 });
  }
}
