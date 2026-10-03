'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';
import Link from 'next/link';
import {getSupabaseBrowser} from '@/lib/supabase-browser';

export default function Register(){
  const [email,setEmail]=useState('');
  const [name,setName]=useState('');
  const [code,setCode]=useState('');
  const [sent,setSent]=useState(false);
  const [error,setError]=useState('');
  const [loading,setLoading]=useState(false);
  const router=useRouter();

  async function sendCode(e:React.FormEvent){
    e.preventDefault(); setLoading(true); setError('');
    try{
      const supabase=getSupabaseBrowser();
      const {error}=await supabase.auth.signInWithOtp({
        email,
        options:{shouldCreateUser:true,data:{name}}
      });
      if(error) throw error;
      setSent(true);
    }catch(e){
      setError(e instanceof Error?e.message:'Не удалось отправить код.');
    }finally{setLoading(false)}
  }

  async function verifyCode(e:React.FormEvent){
    e.preventDefault(); setLoading(true); setError('');
    try{
      const supabase=getSupabaseBrowser();
      const {error}=await supabase.auth.verifyOtp({email,token:code,type:'email'});
      if(error) throw error;
      router.push('/account');
    }catch(e){
      setError(e instanceof Error?e.message:'Неверный или просроченный код.');
    }finally{setLoading(false)}
  }

  return <main className="auth"><Link href="/" className="brand">re:project</Link><div className="authBox">
    <div className="eyebrow">ACCOUNT / 01</div>
    <h1>Создать<br/><em>аккаунт.</em></h1>
    {!sent ? <form onSubmit={sendCode}>
      <label>ИМЯ<input value={name} onChange={e=>setName(e.target.value)} required placeholder="Ваше имя"/></label>
      <label>E-MAIL<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required placeholder="you@example.com"/></label>
      {error&&<div className="formError">{error}</div>}
      <button className="dark" disabled={loading}>{loading?'Отправляем…':'Получить код ↗'}</button>
    </form> : <form onSubmit={verifyCode}>
      <label>КОД ИЗ ПИСЬМА<input value={code} onChange={e=>setCode(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required placeholder="000000"/></label>
      <p>Код отправлен на <strong>{email}</strong>.</p>
      {error&&<div className="formError">{error}</div>}
      <button className="dark" disabled={loading}>{loading?'Проверяем…':'Создать аккаунт ↗'}</button>
      <button type="button" className="textButton" onClick={()=>{setSent(false);setCode('');setError('')}}>Изменить e-mail</button>
    </form>}
    {!sent&&<p>Уже зарегистрированы? <Link href="/login">Войти</Link></p>}
  </div></main>
}