import { NextRequest, NextResponse } from 'next/server';
import { requireUser, getSupabaseAdmin } from '@/lib/supabase-server';
import { requireStaff } from '@/lib/auth-role';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  try {
    const { user } = await requireUser(request);
    const admin = getSupabaseAdmin();
    const { data: staffProfile, error: staffProfileError } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (staffProfileError) throw staffProfileError;
    const role = staffProfile?.role;
    if (role !== 'admin' && role !== 'designer') throw new Error('FORBIDDEN');
    const [{data:authUsers,error:authUsersError}, profiles, requests, payments, visuals, messages, educationAccess] = await Promise.all([admin.auth.admin.listUsers({page:1,perPage:1000}),
      admin.from('profiles').select('id,name,role,created_at').order('created_at',{ascending:false}),
      admin.from('requests').select('id,user_id,service_id,service_title,price,status,name,email,phone,message,payload,created_at').order('created_at',{ascending:false}),
      admin.from('payments').select('id,user_id,request_id,order_id,amount,description,status,product_slug,metadata,created_at').order('created_at',{ascending:false}),
      admin.from('visualizations').select('id,user_id,source_name,style,messages,result_path,created_at').order('created_at',{ascending:false}),
      admin.from('messages').select('id,user_id,request_id,body,sender_role,created_at').order('created_at',{ascending:true}),
      admin.from('education_access').select('id,user_id,product_slug,payment_id,granted_at').order('granted_at',{ascending:false}),
    ]);
    if(authUsersError) throw authUsersError; for (const result of [profiles,requests,payments,visuals,messages,educationAccess]) if(result.error) throw result.error; const emailById=new Map((authUsers?.users||[]).map(item=>[item.id,item.email||''])); const profileRows=(profiles.data||[]).map(item=>({...item,email:emailById.get(item.id)||''}));
    const visualizations=await Promise.all((visuals.data||[]).map(async item=>{const signed=await admin.storage.from('reproject-assets').createSignedUrl(item.result_path,86400);return {...item,image:signed.data?.signedUrl||''}}));
    const requestRows=await Promise.all((requests.data||[]).map(async (item:any)=>{const sp=item.payload?.sourcePath;if(!sp)return item;const s=await admin.storage.from('reproject-assets').createSignedUrl(sp,86400);return {...item,sourceImage:s.data?.signedUrl||''}}));
    return NextResponse.json({role,profiles:profileRows,requests:requestRows,payments:payments.data||[],visualizations,messages:messages.data||[],educationAccess:educationAccess.data||[]});
  } catch(error){const message=error instanceof Error?error.message:'Не удалось загрузить кабинет дизайнера.';return NextResponse.json({error:message},{status:message==='UNAUTHORIZED'?401:message==='FORBIDDEN'?403:500});}
}
