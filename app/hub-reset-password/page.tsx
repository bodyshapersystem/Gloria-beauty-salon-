"use client";

import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { supabase } from "@/lib/supabase/client";

export default function HubResetPasswordPage(){
  const router=useRouter();
  const [password,setPassword]=useState("");
  const [confirm,setConfirm]=useState("");
  const [showPassword,setShowPassword]=useState(false);
  const [showConfirm,setShowConfirm]=useState(false);
  const [ready,setReady]=useState(false);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);

  useEffect(()=>{
    let mounted=true;
    supabase.auth.getSession().then(({data})=>{if(mounted)setReady(Boolean(data.session))});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((event,session)=>{if(event==="PASSWORD_RECOVERY"||session)setReady(true)});
    return()=>{mounted=false;subscription.unsubscribe()};
  },[]);

  async function submit(e:FormEvent){
    e.preventDefault();setError(null);
    if(password.length<8){setError("Usa al menos 8 caracteres.");return;}
    if(password!==confirm){setError("Las contraseñas no coinciden.");return;}
    setLoading(true);
    const {error}=await supabase.auth.updateUser({password});
    setLoading(false);
    if(error){setError("No pudimos actualizar la contraseña. Abre nuevamente el enlace del correo.");return;}
    await supabase.auth.signOut();
    router.replace("/hub-login");
  }

  return <div className="min-h-screen bg-[#F7F3ED] px-5 py-10 flex items-center justify-center">
    <div className="w-full max-w-[510px] overflow-hidden rounded-[30px] border border-[#D9C7B9] bg-[#FBF8F3] shadow-[0_28px_80px_rgba(52,38,31,.12)]">
      <div className="relative px-7 py-9 md:px-10 md:py-11 bg-[radial-gradient(circle_at_85%_15%,rgba(123,60,72,.18),transparent_27%),linear-gradient(145deg,#F8EFE7,#E8D4C8)]">
        <Logo className="h-[76px] w-auto mx-auto"/>
        <div className="mt-7 text-center"><p className="text-[9px] uppercase tracking-[.32em] text-mocha">Gloria Hub · Team</p><h1 className="mt-3 font-serif text-[42px] leading-[.95] text-espresso">Crea tu nueva contraseña</h1></div>
      </div>
      <form onSubmit={submit} className="px-7 py-7 md:px-10 md:py-9 space-y-4">
        {!ready&&<p className="rounded-[14px] bg-[#F1E6DD] px-4 py-3 text-[11px] text-mocha">Abre esta página desde el enlace de recuperación que te enviamos por email.</p>}
        <Password label="Nueva contraseña" value={password} set={setPassword} show={showPassword} setShow={setShowPassword}/>
        <Password label="Confirmar contraseña" value={confirm} set={setConfirm} show={showConfirm} setShow={setShowConfirm}/>
        {error&&<p className="rounded-[14px] bg-[#EAD6D1]/55 px-4 py-3 text-[11px] text-mocha">{error}</p>}
        <button disabled={loading||!ready} className="w-full rounded-full bg-[#4A352B] px-5 py-4 text-[9px] uppercase tracking-[.16em] text-ivory disabled:opacity-50">{loading?"Guardando…":"Guardar nueva contraseña"}</button>
      </form>
    </div>
  </div>
}

function Password({label,value,set,show,setShow}:{label:string;value:string;set:(v:string)=>void;show:boolean;setShow:(v:boolean)=>void}){
  return <label className="block"><span className="mb-2 block text-[9px] uppercase tracking-[.16em] text-taupe">{label}</span><div className="relative"><input type={show?"text":"password"} required value={value} onChange={e=>set(e.target.value)} className="w-full rounded-[14px] border border-[#DCCCBF] bg-white/80 px-4 py-3.5 pr-12 text-[14px] outline-none focus:border-mocha"/><button type="button" onClick={()=>setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-full text-taupe hover:bg-[#EFE4DB]" aria-label={show?"Ocultar contraseña":"Mostrar contraseña"}>{show?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></label>
}
