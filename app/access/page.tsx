"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronRight, ShoppingBag, Sparkles, UserRound } from "lucide-react";
import { useAccess } from "@/components/access/AccessShell";
import { GloriaDashboardCover } from "@/components/ui/GloriaDashboardCover";
import { supabase } from "@/lib/supabase/client";

type Appointment={id:string;start_at:string;end_at:string;status:string;service:{name:string;duration_minutes:number}|null;staff:{name:string}|null};

export default function AccessHomePage(){
  const {profile}=useAccess();const [next,setNext]=useState<Appointment|null>(null);const [loading,setLoading]=useState(true);
  useEffect(()=>{if(!profile)return;(async()=>{const {data}=await supabase.from("appointments").select("id,start_at,end_at,status,service:service_id(name,duration_minutes),staff:staff_id(name)").eq("client_id",profile.id).in("status",["confirmed","pending"]).gte("start_at",new Date().toISOString()).order("start_at",{ascending:true}).limit(1).maybeSingle();setNext((data as Appointment|null)||null);setLoading(false)})()},[profile?.id]);
  if(!profile)return null;

  return <div className="pb-5">
    <GloriaDashboardCover role="ACCESS" name={profile.first_name||"Beauty"} tagline={["Tu belleza,","en un solo lugar."]} metricValue={loading?"…":next?new Date(next.start_at).toLocaleDateString("en-US",{day:"2-digit",timeZone:"America/New_York"}):"+"} metricLabel={next?`${next.service?.name||"Próxima cita"} · ${formatTime(next.start_at)}`:"Reserva tu próxima cita"} metricHref={next?`/access/appointments/${next.id}`:"/access/book"} shortcuts={[
      {label:"Mis Citas",href:"/access/appointments",icon:<CalendarDays size={19}/>},
      {label:"Mi Perfil",href:"/access/beauty-profile",icon:<Sparkles size={19}/>},
      {label:"Tienda",href:"/access/shop",icon:<ShoppingBag size={19}/>},
      {label:"Cuenta",href:"/access/profile",icon:<UserRound size={19}/>},
    ]}/>

    <section className="mt-6"><p className="text-[8px] uppercase tracking-[.2em] text-mocha">Curated for you</p><h2 className="mt-1 font-serif text-[32px]">Tu experiencia Gloria</h2><div className="mt-4 grid gap-3 md:grid-cols-3">
      <WineCard href="/access/beauty-profile" title="My Beauty Profile" sub="Tu beauty memory, viva e interactiva."/>
      <SoftCard href="/access/appointments" title="Tu beauty calendar" sub="Citas, rebooking y tus momentos favoritos."/>
      <SoftCard href="/access/shop" title="Gloria's Edit" sub="Cuidado profesional seleccionado para ti."/>
    </div></section>
  </div>
}
function WineCard({href,title,sub}:{href:string;title:string;sub:string}){return <Link href={href} className="relative min-h-[165px] overflow-hidden rounded-[23px] border border-white/20 p-5 text-white shadow-[0_12px_30px_rgba(92,43,50,.16)]" style={{backgroundImage:wineBackground}}><span className="pointer-events-none absolute -right-8 -top-10 h-32 w-40 rotate-[12deg] rounded-[58%_42%_64%_36%/48%_58%_42%_52%] bg-white/10 blur-[2px]"/><span className="pointer-events-none absolute -right-12 bottom-[-22%] h-28 w-44 rounded-[55%] bg-[#D99A9E]/20 blur-2xl"/><p className="relative font-serif text-[27px] leading-none">{title}</p><p className="relative mt-3 max-w-[220px] text-[9px] leading-relaxed text-white/75">{sub}</p><span className="absolute bottom-5 right-5 grid h-9 w-9 place-items-center rounded-full border border-white/30 bg-white/10"><ChevronRight size={15}/></span></Link>}
function SoftCard({href,title,sub}:{href:string;title:string;sub:string}){return <Link href={href} className="relative min-h-[165px] overflow-hidden rounded-[23px] border border-[#DDCDC1] bg-[linear-gradient(135deg,#F5E9DF,#DEC7BA)] p-5 text-[#4A352B] shadow-[0_10px_26px_rgba(52,38,31,.05)]"><p className="font-serif text-[27px] leading-none">{title}</p><p className="mt-3 max-w-[220px] text-[9px] leading-relaxed text-taupe">{sub}</p><span className="absolute bottom-5 right-5 grid h-9 w-9 place-items-center rounded-full bg-white/60"><ChevronRight size={15}/></span></Link>}
const wineBackground="radial-gradient(circle at 18% 16%,rgba(255,215,218,.18),transparent 22%),radial-gradient(ellipse at 84% 18%,rgba(255,242,236,.14),transparent 26%),radial-gradient(ellipse at 70% 92%,rgba(196,115,125,.20),transparent 36%),linear-gradient(145deg,#7B3C48 0%,#602F39 45%,#45222B 100%)";
function formatTime(v:string){return new Date(v).toLocaleTimeString("es-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}
