"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronRight, ShoppingBag, Sparkles, UserRound } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { useAccess } from "@/components/access/AccessShell";
import { supabase } from "@/lib/supabase/client";

type Appointment={id:string;start_at:string;end_at:string;status:string;service:{name:string;duration_minutes:number}|null;staff:{name:string}|null};

export default function AccessHomePage(){
  const {profile}=useAccess();
  const [next,setNext]=useState<Appointment|null>(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{if(!profile)return;(async()=>{
    const {data}=await supabase.from("appointments")
      .select("id,start_at,end_at,status,service:service_id(name,duration_minutes),staff:staff_id(name)")
      .eq("client_id",profile.id).in("status",["confirmed","pending"])
      .gte("start_at",new Date().toISOString()).order("start_at",{ascending:true}).limit(1).maybeSingle();
    setNext((data as Appointment|null)||null);setLoading(false);
  })()},[profile?.id]);

  if(!profile)return null;
  const noHistory=profile.beauty_state==="no_appointment_history"&&!next;

  return <div className="pb-5">
    <section className="relative overflow-hidden rounded-[30px] border border-[#D9C6BA] min-h-[545px] px-5 py-6 md:min-h-[500px] md:px-9 md:py-8 shadow-[0_20px_55px_rgba(73,46,40,.10)]" style={{backgroundImage:creamWineBg}}>
      <Marble/>
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div><Logo className="h-[70px] w-auto"/><p className="-mt-1 ml-3 text-[8px] uppercase tracking-[.34em] text-[#5A352E]">Access</p></div>
          <span className="grid h-10 w-10 place-items-center rounded-full border border-[#8A6558]/20 bg-white/30 text-[#5B342D]"><Sparkles size={17}/></span>
        </div>

        <div className="mt-10 md:mt-12">
          <h1 className="font-serif text-[49px] md:text-[70px] leading-[.88] text-[#4A2824]">Hola,<br/>{profile.first_name||"Beauty"}</h1>
          <p className="mt-5 max-w-[280px] text-[9px] md:text-[10px] uppercase tracking-[.34em] leading-[1.8] text-[#5D3831]">Tu belleza,<br/>en un solo lugar.</p>
          <p className="mt-7 text-[10px] text-[#6E5148]">{todayLabel()}</p>
        </div>

        <div className="mt-5">
          {loading?<div className="h-[105px] animate-pulse rounded-[20px] bg-white/40"/>:next?<Link href={"/access/appointments/"+next.id} className="group flex items-center gap-4 rounded-[22px] border border-white/65 bg-[#FCF8F3]/80 p-4 shadow-[0_10px_28px_rgba(70,45,39,.08)] backdrop-blur-sm">
            <div className="min-w-[54px] border-r border-[#DCCBC0] pr-4"><p className="font-serif text-[32px] leading-none text-[#6D3938]">{new Date(next.start_at).toLocaleDateString("en-US",{day:"2-digit",timeZone:"America/New_York"})}</p><p className="mt-1 text-[8px] uppercase tracking-[.12em] text-taupe">{new Date(next.start_at).toLocaleDateString("en-US",{month:"short",timeZone:"America/New_York"})}</p></div>
            <div className="min-w-0 flex-1"><p className="text-[8px] uppercase tracking-[.16em] text-taupe">Próxima cita</p><p className="mt-1 font-serif text-[20px] truncate">{next.service?.name||"Appointment"}</p><p className="mt-1 text-[9px] text-taupe">{formatTime(next.start_at)} · con {next.staff?.name||"Gloria"}</p></div><ChevronRight size={17} className="text-mocha transition group-hover:translate-x-1"/>
          </Link>:<Link href="/access/book" className="group flex items-center justify-between rounded-[22px] border border-white/65 bg-[#FCF8F3]/80 p-5 shadow-[0_10px_28px_rgba(70,45,39,.08)] backdrop-blur-sm"><div><p className="text-[8px] uppercase tracking-[.16em] text-taupe">Tu próxima cita</p><p className="mt-1 font-serif text-[24px]">{noHistory?"Tu beauty story empieza aquí":"Reserva tu próximo momento"}</p></div><ChevronRight size={18} className="text-mocha"/></Link>}
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2">
          <GlassShortcut href="/access/appointments" icon={<CalendarDays size={18}/>} label="Mis Citas"/>
          <GlassShortcut href="/access/beauty-profile" icon={<Sparkles size={18}/>} label="Beauty"/>
          <GlassShortcut href="/access/shop" icon={<ShoppingBag size={18}/>} label="Tienda"/>
          <GlassShortcut href="/access/profile" icon={<UserRound size={18}/>} label="Mi Perfil"/>
        </div>
      </div>
    </section>

    <section className="mt-6">
      <div className="flex items-end justify-between"><div><p className="text-[8px] uppercase tracking-[.2em] text-mocha">Curated for you</p><h2 className="mt-1 font-serif text-[32px]">Tu experiencia Gloria</h2></div></div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <EditorialCard href="/access/beauty-profile" title="My Beauty Profile" sub={profile.beauty_state==="beauty_profile_active"?"Tu beauty memory, viva.":"Se irá construyendo contigo."} tone="wine"/>
        <EditorialCard href="/access/appointments" title="Tu beauty calendar" sub="Citas, rebooking y tus looks favoritos." tone="dust"/>
        <EditorialCard href="/access/shop" title="Gloria's Edit" sub="Cuidado profesional seleccionado para ti." tone="nude"/>
      </div>
    </section>
  </div>
}

const creamWineBg="radial-gradient(circle at 14% 12%,rgba(255,255,255,.94),transparent 28%),radial-gradient(ellipse at 88% 28%,rgba(115,54,61,.32),transparent 24%),radial-gradient(ellipse at 72% 64%,rgba(84,39,42,.34),transparent 27%),linear-gradient(145deg,#F8F0E7 0%,#E6CEC2 48%,#C9A69A 100%)";
function Marble(){return <><span className="pointer-events-none absolute right-[-8%] top-[3%] h-[82%] w-[48%] rotate-[8deg] rounded-[58%_42%_62%_38%/43%_60%_40%_57%] border-[18px] border-white/25 bg-[linear-gradient(145deg,rgba(255,255,255,.42),rgba(108,46,51,.40),rgba(243,221,207,.48))] shadow-[inset_18px_0_30px_rgba(255,255,255,.26)] blur-[.2px]"/><span className="pointer-events-none absolute right-[10%] top-[8%] h-[78%] w-[12%] rotate-[22deg] rounded-[50%] bg-white/30 blur-xl"/><span className="pointer-events-none absolute right-[-3%] bottom-[-12%] h-[42%] w-[54%] rounded-[60%] bg-[#6E3038]/30 blur-3xl"/></>}
function GlassShortcut({href,icon,label}:{href:string;icon:React.ReactNode;label:string}){return <Link href={href} className="flex min-h-[94px] flex-col items-center justify-center gap-2 rounded-[19px] border border-white/70 bg-[#FCF8F3]/78 text-[#5A352E] shadow-[0_8px_22px_rgba(73,46,40,.06)] backdrop-blur-sm"><span>{icon}</span><span className="text-center text-[8px] leading-tight">{label}</span></Link>}
function EditorialCard({href,title,sub,tone}:{href:string;title:string;sub:string;tone:"wine"|"dust"|"nude"}){const bg={wine:"radial-gradient(circle at 82% 18%,rgba(255,230,222,.18),transparent 28%),linear-gradient(135deg,#70333E,#42272C)",dust:"linear-gradient(135deg,#E7CBC9,#CDA8A8)",nude:"linear-gradient(135deg,#F2E5D9,#D9BEAE)"}[tone];const dark=tone==="wine";return <Link href={href} className={`relative min-h-[150px] overflow-hidden rounded-[23px] border border-white/35 p-5 shadow-[0_10px_26px_rgba(52,38,31,.06)] ${dark?"text-white":"text-[#4A352B]"}`} style={{backgroundImage:bg}}><span className="absolute -right-8 -bottom-8 h-24 w-32 rounded-[50%] bg-white/15 blur-xl"/><p className="relative font-serif text-[25px] leading-none">{title}</p><p className="relative mt-3 max-w-[210px] text-[9px] leading-relaxed opacity-70">{sub}</p><span className="relative mt-5 inline-flex items-center gap-1 text-[8px] uppercase tracking-[.12em]">Explorar <ChevronRight size={12}/></span></Link>}
function formatTime(v:string){return new Date(v).toLocaleTimeString("es-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}
function todayLabel(){return new Date().toLocaleDateString("es-US",{weekday:"long",day:"numeric",month:"long",timeZone:"America/New_York"})}
