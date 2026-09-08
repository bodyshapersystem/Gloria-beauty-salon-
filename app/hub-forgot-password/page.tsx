"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { supabase } from "@/lib/supabase/client";

export default function HubForgotPasswordPage(){
  const [email,setEmail]=useState("");
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState<string|null>(null);
  const [error,setError]=useState<string|null>(null);

  async function submit(e:FormEvent){
    e.preventDefault();setLoading(true);setError(null);setMessage(null);
    const redirectTo="https://gloriabeautysalonmiami.com/hub-reset-password";
    const {error}=await supabase.auth.resetPasswordForEmail(email.trim(),{redirectTo});
    setLoading(false);
    if(error){setError("No pudimos enviar el enlace. Intenta nuevamente.");return;}
    setMessage("Te enviamos un enlace para crear una contraseña nueva.");
  }

  return <div className="min-h-screen bg-[#F7F3ED] px-5 py-10 flex items-center justify-center">
    <div className="w-full max-w-[510px] overflow-hidden rounded-[30px] border border-[#D9C7B9] bg-[#FBF8F3] shadow-[0_28px_80px_rgba(52,38,31,.12)]">
      <div className="relative px-7 py-9 md:px-10 md:py-11 bg-[radial-gradient(circle_at_85%_15%,rgba(123,60,72,.18),transparent_27%),linear-gradient(145deg,#F8EFE7,#E8D4C8)]">
        <Logo className="h-[76px] w-auto mx-auto"/>
        <div className="mt-7 text-center"><p className="text-[9px] uppercase tracking-[.32em] text-mocha">Gloria Hub · Team</p><h1 className="mt-3 font-serif text-[42px] leading-[.95] text-espresso">Nueva contraseña</h1><p className="mt-4 text-[12px] leading-relaxed text-taupe">Escribe tu email y te enviaremos un enlace seguro para cambiarla.</p></div>
      </div>
      <form onSubmit={submit} className="px-7 py-7 md:px-10 md:py-9 space-y-4">
        <label className="block"><span className="mb-2 block text-[9px] uppercase tracking-[.16em] text-taupe">Email</span><div className="relative"><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-[14px] border border-[#DCCCBF] bg-white/80 px-4 py-3.5 pr-11 text-[14px] outline-none focus:border-mocha"/><Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe"/></div></label>
        {message&&<p className="rounded-[14px] bg-[#E6EFE7] px-4 py-3 text-[11px] text-[#4D6A52]">{message}</p>}
        {error&&<p className="rounded-[14px] bg-[#EAD6D1]/55 px-4 py-3 text-[11px] text-mocha">{error}</p>}
        <button disabled={loading} className="w-full rounded-full bg-[#4A352B] px-5 py-4 text-[9px] uppercase tracking-[.16em] text-ivory disabled:opacity-50">{loading?"Enviando…":"Enviar enlace"}</button>
        <div className="pt-2 text-center"><Link href="/hub-login" className="text-[10px] text-taupe underline underline-offset-4">Volver al login</Link></div>
      </form>
    </div>
  </div>
}
