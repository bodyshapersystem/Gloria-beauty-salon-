"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Eye, EyeOff, LockKeyhole, Sparkles } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { supabase } from "@/lib/supabase/client";

type Invite={email:string;staff_name:string;valid:boolean};

export default function TeamActivatePage(){return <Suspense fallback={<Shell><p className="text-[12px] text-taupe">Preparando tu invitación…</p></Shell>}><Activate/></Suspense>}

function Activate(){
  const params=useSearchParams();const router=useRouter();const token=params.get("token")||"";
  const [invite,setInvite]=useState<Invite|null>(null);const [loading,setLoading]=useState(true);const [password,setPassword]=useState("");const [confirm,setConfirm]=useState("");const [show,setShow]=useState(false);const [busy,setBusy]=useState(false);const [message,setMessage]=useState<string|null>(null);const [done,setDone]=useState(false);

  useEffect(()=>{(async()=>{
    if(!token){setMessage("Esta invitación no es válida.");setLoading(false);return;}
    const {data,error}=await supabase.rpc("team_invitation_details",{p_token:token});
    const row=Array.isArray(data)?data[0]:data;
    if(error||!row||!row.valid){setMessage("Esta invitación expiró o ya fue utilizada.");setLoading(false);return;}
    setInvite(row as Invite);
    const {data:{session}}=await supabase.auth.getSession();
    if(session){const {error:claimError}=await supabase.rpc("claim_team_invitation",{p_token:token});if(!claimError){setDone(true);setTimeout(()=>router.replace("/hub/my-agenda"),1200)}}
    setLoading(false);
  })()},[token,router]);

  async function submit(e:FormEvent){e.preventDefault();if(!invite)return;if(password.length<8){setMessage("Tu contraseña debe tener al menos 8 caracteres.");return;}if(password!==confirm){setMessage("Las contraseñas no coinciden.");return;}setBusy(true);setMessage(null);
    const redirect=`${window.location.origin}/team/activate?token=${encodeURIComponent(token)}`;
    const {data,error}=await supabase.auth.signUp({email:invite.email,password,options:{emailRedirectTo:redirect}});
    if(error){setBusy(false);setMessage(error.message);return;}
    if(data.session){const {error:claimError}=await supabase.rpc("claim_team_invitation",{p_token:token});setBusy(false);if(claimError){setMessage(claimError.message);return;}setDone(true);setTimeout(()=>router.replace("/hub/my-agenda"),1200);return;}
    setBusy(false);setDone(true);setMessage("Revisa tu email para confirmar tu cuenta. Luego volverás directo a Gloria Team.");
  }

  return <Shell>{loading?<p className="text-[12px] text-taupe">Preparando tu invitación…</p>:done?<div className="text-center"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#EEE2D8] text-mocha"><Check size={27}/></div><h1 className="mt-5 font-serif text-[42px]">¡Ya casi estás dentro!</h1><p className="mt-3 text-[12px] leading-relaxed text-taupe">{message||"Tu Gloria Team está listo."}</p></div>:invite?<form onSubmit={submit}><p className="text-[9px] uppercase tracking-[.24em] text-mocha">Gloria Team</p><h1 className="mt-2 font-serif text-[46px] leading-[.95]">Hola, {invite.staff_name}</h1><p className="mt-4 text-[12px] leading-relaxed text-taupe">Crea tu contraseña para activar tu espacio dentro de Gloria Beauty Salon.</p><div className="mt-7 space-y-3"><label className="block"><span className="mb-1.5 block text-[8px] uppercase tracking-[.15em] text-taupe">Email</span><div className="rounded-[16px] border border-[#D8C8BC] bg-[#F6EFE8] px-4 py-4 text-[12px] text-mocha">{invite.email}</div></label><label className="block"><span className="mb-1.5 block text-[8px] uppercase tracking-[.15em] text-taupe">Contraseña</span><div className="flex items-center rounded-[16px] border border-[#D8C8BC] bg-white px-4"><LockKeyhole size={15} className="text-taupe"/><input type={show?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-transparent px-3 py-4 text-[13px] outline-none"/><button type="button" onClick={()=>setShow(v=>!v)} className="text-taupe">{show?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></label><label className="block"><span className="mb-1.5 block text-[8px] uppercase tracking-[.15em] text-taupe">Confirmar contraseña</span><input type={show?"text":"password"} value={confirm} onChange={e=>setConfirm(e.target.value)} className="w-full rounded-[16px] border border-[#D8C8BC] bg-white px-4 py-4 text-[13px] outline-none"/></label></div>{message&&<p className="mt-4 text-[10px] leading-relaxed text-[#8B3F4B]">{message}</p>}<button disabled={busy} className="mt-6 w-full rounded-full bg-[#4A352B] px-5 py-4 text-[9px] uppercase tracking-[.14em] text-ivory disabled:opacity-50">{busy?"Activando…":"Activar mi cuenta"}</button><p className="mt-5 text-center font-serif italic text-[18px] text-mocha">Sigamos creciendo juntas ✨</p></form>:<p className="text-[12px] text-taupe">{message||"No pudimos abrir esta invitación."}</p>}</Shell>
}

function Shell({children}:{children:React.ReactNode}){return <main className="min-h-screen bg-[#EFEAE4] px-4 py-8 md:py-12"><section className="relative mx-auto min-h-[720px] max-w-[520px] overflow-hidden rounded-[30px] border border-[#D9C8BC] bg-[#FBF7F2] p-6 shadow-[0_24px_70px_rgba(52,38,31,.12)] md:p-9"><span className="pointer-events-none absolute -right-20 -top-10 h-72 w-44 rotate-[22deg] rounded-[50%] bg-[linear-gradient(145deg,rgba(255,255,255,.75),rgba(123,60,72,.17),rgba(235,213,201,.65))] blur-xl"/><div className="relative z-10"><div className="mb-10 text-center"><Logo className="mx-auto h-[72px] w-auto"/><div className="mt-2 inline-flex items-center gap-2 text-[8px] uppercase tracking-[.28em] text-taupe"><Sparkles size={11}/> Beauty in a team</div></div>{children}</div></section></main>}
