'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getSupabaseBrowser } from '@/lib/supabase-browser';

export default function Login(){
  const [email,setEmail]=useState(''); const [pass,setPass]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false); const router=useRouter();
  async function submit(e:React.FormEvent){e.preventDefault();setLoading(true);setError('');try{const supabase=getSupabaseBrowser();const {error}=await supabase.auth.signInWithPassword({email,password:pass});if(error)throw error;const {data:sessionData}=await supabase.auth.getSession();const profile=await fetch('/api/account',{headers:{Authorization:`Bearer ${sessionData.session?.access_token||''}`}});const profileJson=profile.ok?await profile.json():null;const next=new URLSearchParams(window.location.search).get('next'); router.push(next || (profileJson?.role==='admin'||profileJson?.role==='designer'?'/admin':'/account'));}catch(e){setError(e instanceof Error?e.message:'Не удалось войти.');}finally{setLoading(false)}}
  return <main className="auth"><Link href="/" className="brand">re:project</Link><div className="authBox"><div className="eyebrow">ACCOUNT / 02</div><h1>Войти в<br/><em>кабинет.</em></h1><form onSubmit={submit}><label>E-MAIL<input value={email} onChange={e=>setEmail(e.target.value)} type="email" required placeholder="you@example.com"/></label><label>ПАРОЛЬ<input value={pass} onChange={e=>setPass(e.target.value)} type="password" required placeholder="Минимум 6 символов"/></label>{error&&<div className="formError">{error}</div>}<button className="dark" disabled={loading}>{loading?'Входим…':'Войти ↗'}</button></form><p>Нет аккаунта? <Link href="/register">Зарегистрироваться</Link></p></div></main>
}
