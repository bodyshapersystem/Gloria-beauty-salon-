"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Scissors, TrendingUp, UserRound, UsersRound } from "lucide-react";
import { GloriaDashboardCover } from "@/components/ui/GloriaDashboardCover";
import { supabase } from "@/lib/supabase/client";

type Appointment={id:string;client_name:string;client_phone:string;start_at:string;end_at:string;status:string;service:{name:string;category:string}|null};
type Staff={id:string;name:string;photo_url:string|null};
const statusLabels:Record<string,string>={pending:"Pendiente",confirmed:"Confirmada",in_progress:"En curso",completed:"Completada",cancelled:"Cancelada",no_show:"No se presentó"};

export default function MyAgendaPage(){
  const [items,setItems]=useState<Appointment[]>([]);const [staff,setStaff]=useState<Staff|null>(null);const [loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{const {data:{session}}=await supabase.auth.getSession();let staffId:string|null=null;if(session){const {data:p}=await supabase.from("user_profiles").select("staff_id").eq("auth_user_id",session.user.id).maybeSingle();staffId=p?.staff_id||null;if(staffId){const {data:s}=await supabase.from("staff").select("id,name,photo_url").eq("id",staffId).maybeSingle();setStaff((s as Staff|null)||null)}}const start=new Date();start.setHours(0,0,0,0);const end=new Date(start);end.setDate(end.getDate()+1);let q=supabase.from("appointments").select("id,client_name,client_phone,start_at,end_at,status,service:service_id(name,category)").gte("start_at",start.toISOString()).lt("start_at",end.toISOString()).order("start_at");if(staffId)q=q.eq("staff_id",staffId);const {data}=await q;setItems(((data as unknown) as Appointment[])||[]);setLoading(false)})()},[]);
  const active=useMemo(()=>items.filter(x=>!["cancelled","no_show"].includes(x.status)),[items]);const name=staff?.name||"Team";

  return <div className="pb-5">
    <GloriaDashboardCover role="TEAM" name={name} tagline={["Tu talento","hace la diferencia."]} metricValue={loading?"…":String(active.length)} metricLabel="Citas hoy" metricHref="/hub/my-agenda" shortcuts={[
      {label:"Mis Citas",href:"/hub/my-agenda",icon:<CalendarDays size={19}/>},
      {label:"Mis Clientes",href:"/hub/clients",icon:<UsersRound size={19}/>},
      {label:"Calendario",href:"/hub/calendar",icon:<Scissors size={19}/>},
      {label:"Progreso",href:"/hub/progress",icon:<TrendingUp size={19}/>}
    ]}/>

    <section className="mt-6 overflow-hidden rounded-[26px] border border-[#E0D2C8] bg-white/60 shadow-[0_10px_30px_rgba(52,38,31,.04)]"><div className="flex items-end justify-between border-b border-[#E9DDD4] px-5 py-4"><div><p className="text-[8px] uppercase tracking-[.2em] text-mocha">Tu agenda de hoy</p><h2 className="mt-1 font-serif text-[30px]">Tus clientas</h2></div><Link href="/hub/calendar" className="text-[8px] uppercase tracking-[.12em] text-taupe">Ver todas →</Link></div>{loading?<p className="p-7 text-[12px] text-taupe">Cargando tu día...</p>:items.length===0?<div className="p-8"><h3 className="font-serif text-[28px]">No hay citas hoy.</h3><p className="mt-2 text-[10px] text-taupe">Tus citas asignadas aparecerán aquí automáticamente.</p></div>:items.map(a=><article key={a.id} className="flex flex-col gap-4 border-b border-[#E9DDD4] p-5 last:border-0 md:flex-row md:items-center md:justify-between"><div className="flex gap-4"><div className="w-[76px] shrink-0"><p className="font-serif text-[22px]">{time(a.start_at)}</p><p className="mt-1 text-[9px] text-taupe">{minutes(a.start_at,a.end_at)} min</p></div><div><div className="flex items-center gap-2"><UserRound size={14} className="text-mocha"/><p className="text-[12px] font-medium">{a.client_name}</p></div><p className="mt-1 font-serif text-[19px] text-mocha">{a.service?.name||"Servicio"}</p><span className="mt-2 inline-flex rounded-full bg-[#EFE2DC] px-2.5 py-1 text-[7px] uppercase tracking-[.08em] text-[#7B4A44]">{statusLabels[a.status]||a.status}</span></div></div><div className="flex flex-wrap gap-2">{["confirmed","in_progress"].includes(a.status)&&<Link href={`/hub/appointments/${a.id}/complete`} className="rounded-full bg-[#4A352B] px-4 py-2.5 text-[8px] uppercase tracking-[.12em] text-ivory">Completar visita</Link>}<a href={`tel:${a.client_phone}`} className="rounded-full border border-[#BDAA9D] px-4 py-2.5 text-[8px] uppercase tracking-[.12em] text-mocha">Llamar</a></div></article>)}</section>
  </div>
}
function time(v:string){return new Date(v).toLocaleTimeString("es-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}
function minutes(a:string,b:string){return Math.round((+new Date(b)-+new Date(a))/60000)}
