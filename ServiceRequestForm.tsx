'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Service } from '@/lib/services';
import { getSupabaseBrowser } from '@/lib/supabase-browser';
import PaymentPanel from '@/components/PaymentPanel';

export default function ServiceRequestForm({ service }: { service: Service }) {
  const router = useRouter(); const [sent, setSent] = useState(false); const [requestId,setRequestId]=useState(''); const [loading,setLoading]=useState(false); const [error,setError]=useState('');
  const [form, setForm] = useState({name:'',email:'',phone:'',message:''}); const isDesign = service.kind === 'design';
  useEffect(()=>{try{const raw=sessionStorage.getItem('reproject_pending_request');const pending=raw?JSON.parse(raw):null;if(pending?.serviceId===service.id&&pending.form)setForm(pending.form);}catch{}},[service.id]);
  async function submit(e: React.FormEvent) { e.preventDefault(); setLoading(true); setError(''); try { const supabase=getSupabaseBrowser(); const {data:auth}=await supabase.auth.getSession(); if(!auth.session){sessionStorage.setItem('reproject_pending_request',JSON.stringify({serviceId:service.id,form}));router.push(`/login?next=/service/${service.id}`);return;} const response=await fetch('/api/requests',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${auth.session.access_token}`},body:JSON.stringify({serviceId:service.id,serviceTitle:service.title,price:service.price,...form})}); const data=await response.json(); if(!response.ok)throw new Error(data.error||'Не удалось отправить заявку'); sessionStorage.removeItem('reproject_pending_request');setRequestId(data.id||'');setSent(true);}catch(e){setError(e instanceof Error?e.message:'Не удалось отправить заявку.')}finally{setLoading(false)} }
  if (sent) return <div className="successBox"><small>REQUEST / CREATED</small><h3>Заявка принята.</h3><p>{isDesign ? 'Следующий шаг — заполнить подробный бриф. После оплаты проект появится в личном кабинете, где можно будет работать вместе с дизайнером.' : 'Заявка сохранена. После оплаты мы начинаем работу над пространством; все материалы и дальнейшая коммуникация будут собраны в личном кабинете.'}</p>{isDesign && <Link className="dark" href="/service/design/brief">Заполнить бриф ↗</Link>}{!isDesign && service.price.match(/\d[\d ]*/)?.[0] && <PaymentPanel amount={Number(service.price.match(/\d[\d ]*/)?.[0].replace(/ /g,''))} description={`re:project — ${service.title}`} requestId={requestId} />}<Link className="outline" href="/account">Перейти в кабинет ↗</Link></div>;
  return <form className="requestForm" onSubmit={submit}>
    <label>Имя<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required placeholder="Как к вам обращаться"/></label>
    <label>E-mail<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required placeholder="name@example.com"/></label>
    <label>Телефон<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} placeholder="+7 ..."/></label>
    <label>{isDesign ? 'Коротко о задаче' : 'Сообщение'}<textarea rows={5} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder={isDesign?'Расскажите о помещении, площади и желаемом результате':'Ваш вопрос или задача'}/></label>
    <label className="check"><input type="checkbox" required/> <span>Согласен(а) на обработку данных и <a href="/legal/contract" target="_blank" rel="noreferrer" style={{textDecoration:'underline'}}>условия оказания услуги (договор)</a>.</span></label>
    {error&&<div className="formError">{error}</div>}<button className="dark" type="submit" disabled={loading}>{loading?'Отправляем…':'Создать заявку ↗'}</button>
  </form>;
}
