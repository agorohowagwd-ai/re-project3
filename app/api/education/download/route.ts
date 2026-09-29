import {NextRequest,NextResponse} from 'next/server';
import {promises as fs} from 'fs';
import path from 'path';
import {requireUser} from '@/lib/supabase-server';
import {getEducationOffer} from '@/lib/education';

const mime:Record<string,string>={docx:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',xlsx:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',pdf:'application/pdf'};
export const runtime='nodejs';

export async function GET(request:NextRequest){
 try{
  const {supabase,user}=await requireUser(request);
  const slug=new URL(request.url).searchParams.get('product');
  const file=new URL(request.url).searchParams.get('file');
  if(!slug||!file)return NextResponse.json({error:'Не указан материал.'},{status:400});
  const offer=getEducationOffer(slug);
  if(!offer||!offer.files.includes(file))return NextResponse.json({error:'Файл не найден.'},{status:404});
  const accessSlugs = slug;
  const {data:access}=await supabase.from('education_access').select('id').eq('user_id',user.id).eq('product_slug',accessSlugs).maybeSingle();
  if(!access)return NextResponse.json({error:'Сначала оплатите материал.'},{status:403});
  const safe=path.basename(file);
  const ext=path.extname(safe).slice(1).toLowerCase();
  if(!mime[ext])return NextResponse.json({error:'Недопустимый тип файла.'},{status:400});
  const bytes=await fs.readFile(path.join(process.cwd(),'content','education',safe));
  return new NextResponse(bytes,{status:200,headers:{'Content-Type':mime[ext],'Content-Disposition':`attachment; filename="${encodeURIComponent(safe)}"`,'Cache-Control':'private, no-store'}});
 }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Не удалось скачать файл.'},{status:500})}
}
