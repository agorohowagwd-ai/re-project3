'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

function LoginContent(){
  const [email,setEmail]=useState('');
  const [code,setCode]=useState('');
  const [sent,setSent]=useState(false);
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  const router=useRouter();
  const searchParams=useSearchParams();

  async function sendCode(e:React.FormEvent){
    e.preventDefault();
    setLoading(true); setError('');
    try{
      const supabase=getSupabaseBrowser();
      const {error}=await supabase.auth.signInWithOtp({
        email,
        options:{shouldCreateUser:false}
      });
      if(error) throw error;
      setSent(true);
    }catch(e){
      setError(e instanceof Error ? e.message : 'Не удалось отправить код.');
    }finally{setLoading(false)}
  }

  async function verifyCode(e:React.FormEvent){
    e.preventDefault();
    setLoading(true); setError('');
    try{
      const supabase=getSupabaseBrowser();
      const {error}=await supabase.auth.verifyOtp({email,token:code,type:'email'});
      if(error) throw error;
      const {data:sessionData}=await supabase.auth.getSession();
      const profile=await fetch('/api/account',{headers:{Authorization:`Bearer ${sessionData.session?.access_token||''}`}});
      const profileJson=profile.ok?await profile.json():null;
      const next=searchParams.get('next');
      const destination = profileJson?.role==='admin'||profileJson?.role==='designer' ? '/admin' : (next || '/account');
      router.push(destination);
    }catch(e){
      setError(e instanceof Error ? e.message : 'Неверный или просроченный код.');
    }finally{setLoading(false)}
  }

  return <main className="auth"><Link href="/" className="brand">re:project</Link><div className="authBox">
    <div className="eyebrow">ACCOUNT / 02</div>
    <h1>Войти в<br/><em>кабинет.</em></h1>
    {!sent ? <form onSubmit={sendCode}>
      <label>E-MAIL<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required placeholder="you@example.com"/></label>
      {error&&<div className="formError">{error}</div>}
      <button className="dark" disabled={loading}>{loading?'Отправляем…':'Получить код ↗'}</button>
    </form> : <form onSubmit={verifyCode}>
      <label>КОД ИЗ ПИСЬМА<input value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,'').slice(0,8))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{8}" required placeholder="00000000"/></label>
      <p>Код отправлен на <strong>{email}</strong>.</p>
      {error&&<div className="formError">{error}</div>}
      <button className="dark" disabled={loading}>{loading?'Проверяем…':'Войти ↗'}</button>
      <button type="button" className="textButton" onClick={()=>{setSent(false);setCode('');setError('')}}>Изменить e-mail</button>
    </form>}
    <p>Нет аккаунта? <Link href="/register">Зарегистрироваться</Link></p>
  </div></main>
}
export default function Login(){
  return <Suspense fallback={<main className="auth"><div className="authBox"><p>Загрузка…</p></div></main>}><LoginContent/></Suspense>;
}
