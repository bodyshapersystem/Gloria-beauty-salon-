"use client";

import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { supabase } from "@/lib/supabase/client";

export default function HubLoginPage(){
  const router=useRouter();
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const [showPassword,setShowPassword]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [checkingSession,setCheckingSession]=useState(true);

  useEffect(()=>{let active=true;(async()=>{
    const {data:{session}}=await supabase.auth.getSession();
    if(!active)return;
    if(!session){setCheckingSession(false);return;}
    const {data:profile,error:profileError}=await supabase.from("user_profiles").select("role,staff_id,active").eq("auth_user_id",session.user.id).maybeSingle();
    if(!active)return;
    if(profileError){setCheckingSession(false);setError("No pudimos validar tu sesión. Intenta de nuevo en unos segundos.");return;}
    if(profile?.active&&["owner","admin","manager","staff"].includes(profile.role)){
      router.replace(profile.role==="staff"?"/hub/my-agenda":"/hub");router.refresh();return;
    }
    setCheckingSession(false);
  })();return()=>{active=false}},[router]);

  async function submit(e:FormEvent){
    e.preventDefault();setLoading(true);setError(null);
    const {data,error:authError}=await supabase.auth.signInWithPassword({email:email.trim(),password});
    if(authError||!data.user){setLoading(false);setError("No pudimos iniciar sesión. Revisa tu email y contraseña.");return;}
    const {data:profile}=await supabase.from("user_profiles").select("role,staff_id,active").eq("auth_user_id",data.user.id).maybeSingle();
    if(!profile||!profile.active||!["owner","admin","staff"].includes(profile.role)){
      await supabase.auth.signOut();setLoading(false);setError("Esta cuenta no tiene acceso a Gloria Hub.");return;
    }
    router.replace(profile.role==="staff"?"/hub/my-agenda":"/hub");router.refresh();
  }

  if(checkingSession)return <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center"><div className="text-center"><Logo className="h-[76px] w-auto mx-auto"/><p className="mt-5 text-[9px] uppercase tracking-[.28em] text-taupe">Abriendo Gloria Hub…</p></div></div>;

  return <div className="min-h-screen bg-[#F7F3ED] px-5 py-10 flex items-center justify-center">
    <div className="w-full max-w-[510px] overflow-hidden rounded-[30px] border border-[#D9C7B9] bg-[#FBF8F3] shadow-[0_28px_80px_rgba(52,38,31,.12)]">
      <div className="relative px-7 py-9 md:px-10 md:py-11 bg-[radial-gradient(circle_at_85%_15%,rgba(123,60,72,.18),transparent_27%),linear-gradient(145deg,#F8EFE7,#E8D4C8)]">
        <Logo className="h-[76px] w-auto mx-auto"/>
        <div className="mt-7 text-center"><p className="text-[9px] uppercase tracking-[.32em] text-mocha">Gloria Hub · Team</p><h1 className="mt-3 font-serif text-[43px] leading-[.95] text-espresso">Welcome back</h1><p className="mt-4 text-[12px] leading-relaxed text-taupe">Agenda, clientas, servicios y progreso. Todo en un solo lugar.</p></div>
      </div>
      <form onSubmit={submit} className="px-7 py-7 md:px-10 md:py-9 space-y-4">
        <label className="block"><span className="mb-2 block text-[9px] uppercase tracking-[.16em] text-taupe">Email</span><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-[14px] border border-[#DCCCBF] bg-white/80 px-4 py-3.5 text-[14px] outline-none focus:border-mocha"/></label>
        <label className="block"><div className="mb-2 flex items-center justify-between gap-3"><span className="block text-[9px] uppercase tracking-[.16em] text-taupe">Contraseña</span><Link href="/hub-forgot-password" className="text-[10px] text-[#7B3C48] underline underline-offset-4">¿La olvidaste?</Link></div><div className="relative"><input type={showPassword?"text":"password"} required value={password} onChange={e=>setPassword(e.target.value)} className="w-full rounded-[14px] border border-[#DCCCBF] bg-white/80 px-4 py-3.5 pr-12 text-[14px] outline-none focus:border-mocha"/><button type="button" onClick={()=>setShowPassword(v=>!v)} className="absolute right-3 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full text-taupe hover:bg-[#EFE4DB]" aria-label={showPassword?"Ocultar contraseña":"Mostrar contraseña"}>{showPassword?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>
        {error&&<p className="rounded-[14px] bg-[#EAD6D1]/55 px-4 py-3 text-[11px] text-mocha">{error}</p>}
        <button disabled={loading} className="w-full rounded-full bg-[#4A352B] px-5 py-4 text-[9px] uppercase tracking-[.16em] text-ivory disabled:opacity-50">{loading?"Entrando…":"Entrar a Gloria Hub"}</button>
        <div className="pt-2 text-center"><Link href="/access/login" className="text-[10px] text-taupe underline underline-offset-4">Soy clienta · Gloria Access</Link></div>
      </form>
    </div>
  </div>
}
