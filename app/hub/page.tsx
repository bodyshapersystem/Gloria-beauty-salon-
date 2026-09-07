"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronRight, Plus, Sparkles, TrendingUp, UsersRound } from "lucide-react";
import { GloriaDashboardCover } from "@/components/ui/GloriaDashboardCover";
import { gloriaWineCardArt } from "@/lib/ui/gloriaArt";
import { supabase } from "@/lib/supabase/client";

type Appt={id:string;client_name:string;start_at:string;status:string;price_cents:number|null;service:{name:string}|null;staff:{name:string}|null};
type Metric={client_id:string;segment:string;lifetime_spend:number;completed_visits:number;last_visit:string|null};
const statusLabels:Record<string,string>={pending:"Pendiente",confirmed:"Confirmada",in_progress:"En curso",completed:"Completada",cancelled:"Cancelada",no_show:"No show"};

export default function HubHome(){
  const [today,setToday]=useState<Appt[]>([]);const [month,setMonth]=useState<Appt[]>([]);const [metrics,setMetrics]=useState<Metric[]>([]);const [ordersValue,setOrdersValue]=useState(0);const [clients,setClients]=useState(0);const [loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{const now=new Date();const startDay=new Date(now);startDay.setHours(0,0,0,0);const endDay=new Date(startDay);endDay.setDate(endDay.getDate()+1);const startMonth=new Date(now.getFullYear(),now.getMonth(),1);const endMonth=new Date(now.getFullYear(),now.getMonth()+1,1);const [{data:t},{data:m},{data:v},{data:o},{count:c}]=await Promise.all([
    supabase.from("appointments").select("id,client_name,start_at,status,price_cents,service:service_id(name),staff:staff_id(name)").gte("start_at",startDay.toISOString()).lt("start_at",endDay.toISOString()).neq("status","cancelled").order("start_at"),
    supabase.from("appointments").select("id,client_name,start_at,status,price_cents,service:service_id(name),staff:staff_id(name)").gte("start_at",startMonth.toISOString()).lt("start_at",endMonth.toISOString()),
    supabase.from("client_value_metrics").select("client_id,segment,lifetime_spend,completed_visits,last_visit"),
    supabase.from("orders").select("total_cents").gte("created_at",startMonth.toISOString()).lt("created_at",endMonth.toISOString()),
    supabase.from("client_profiles").select("id",{count:"exact",head:true})
  ]);setToday(((t as unknown) as Appt[])||[]);setMonth(((m as unknown) as Appt[])||[]);setMetrics(((v as unknown) as Metric[])||[]);setOrdersValue((((o as unknown) as {total_cents:number}[])||[]).reduce((n,x)=>n+(x.total_cents||0),0));setClients(c||0);setLoading(false)})()},[]);
  const completed=month.filter(x=>x.status==="completed");const revenue=completed.reduce((n,x)=>n+(x.price_cents||0),0)+ordersValue;const upcoming=today.filter(x=>["pending","confirmed","in_progress"].includes(x.status));const next=upcoming[0]||null;const vip=metrics.filter(x=>x.segment==="vip").length;const atRisk=metrics.filter(x=>x.segment==="at_risk").length;const topService=useMemo(()=>{const map=new Map<string,number>();month.filter(x=>x.status!=="cancelled").forEach(x=>{const n=x.service?.name;if(n)map.set(n,(map.get(n)||0)+1)});return [...map.entries()].sort((a,b)=>b[1]-a[1])[0]||null},[month]);
  if(loading)return <div className="py-20 text-center"><p className="font-serif text-[30px]">Preparando Gloria Hub...</p></div>;

  return <div className="pb-5">
    <GloriaDashboardCover role="HUB" name="Gloria" tagline={["Tu salón.","Tu equipo.","Más belleza."]} metricValue={String(upcoming.length)} metricLabel="Citas hoy" metricHref="/hub/calendar" shortcuts={[
      {label:"Citas",href:"/hub/calendar",icon:<CalendarDays size={19}/>},
      {label:"Clientes",href:"/hub/clients",icon:<UsersRound size={19}/>},
      {label:"Equipo",href:"/hub/team",icon:<Sparkles size={19}/>},
      {label:"Ingresos",href:"/hub/progress",icon:<TrendingUp size={19}/>}
    ]}/>

    <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4"><Stat value={String(upcoming.length)} label="Citas hoy"/><Stat value={String(clients)} label="Clientas"/><Stat value={money(revenue)} label="Generado este mes" wine/><Stat value={topService?.[0]||"—"} label="Servicio top"/></div>

    <div className="mt-5 grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
      <section className="rounded-[28px] border border-[#DED0C6] bg-[#FCF9F5] p-5 md:p-6"><div className="flex items-center justify-between"><div><p className="text-[8px] uppercase tracking-[.2em] text-mocha">Hoy</p><h2 className="mt-1 font-serif text-[34px]">El flujo del salón</h2></div><Link href="/hub/calendar" className="rounded-full border border-[#D8C8BC] px-4 py-2 text-[8px] uppercase tracking-[.12em] text-mocha">Ver calendario</Link></div>{next&&<WineAppointment a={next}/>}<div className="mt-3 space-y-2">{upcoming.slice(next?1:0,6).map(a=><Link key={a.id} href="/hub/appointments" className="flex items-center gap-3 rounded-[18px] border border-[#E4D7CD] bg-[#F8F1EB] px-4 py-3"><div className="grid h-11 w-14 place-items-center rounded-[13px] bg-white text-[10px] text-mocha">{time(a.start_at)}</div><div className="min-w-0 flex-1"><p className="truncate font-serif text-[20px]">{a.client_name}</p><p className="mt-1 truncate text-[9px] text-taupe">{a.service?.name||"Cita"} · {a.staff?.name||"Equipo"}</p></div><span className="rounded-full bg-[#E9DFD7] px-2.5 py-1 text-[7px] text-mocha">{statusLabels[a.status]||a.status}</span></Link>)}{upcoming.length===0&&<div className="rounded-[20px] border border-dashed border-[#D8C8BC] px-5 py-8 text-center"><p className="font-serif text-[27px]">Tu día está libre.</p><Link href="/hub/calendar?new=1" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#4A352B] px-4 py-2.5 text-[8px] uppercase tracking-[.12em] text-white"><Plus size={13}/> Agregar cita</Link></div>}</div></section>

      <div className="space-y-5"><section className="rounded-[28px] border border-[#D8C4C0] bg-[#EAD7D2] p-6"><p className="text-[8px] uppercase tracking-[.2em] text-[#7B3C48]">Necesita tu atención</p><div className="mt-5 space-y-3"><Alert value={atRisk} label="Clientas para rebooking"/><Alert value={vip} label="Clientas VIP"/><Alert value={month.filter(x=>x.status==="cancelled").length} label="Cancelaciones este mes"/></div></section><section className="relative overflow-hidden rounded-[28px] p-6 text-white shadow-[0_15px_34px_rgba(80,33,40,.15)]" style={{backgroundImage:`linear-gradient(rgba(70,20,27,.18),rgba(70,20,27,.18)),url("${gloriaWineCardArt}")`,backgroundSize:"cover",backgroundPosition:"center"}}><p className="text-[8px] uppercase tracking-[.22em] text-white/70">Este mes</p><p className="mt-2 font-serif text-[42px]">{money(revenue)}</p><p className="mt-1 text-[9px] text-white/65">generado</p><div className="mt-5 grid grid-cols-2 gap-2"><Mini label="Reservas" value={String(month.length)}/><Mini label="Completadas" value={String(completed.length)}/><Mini label="Activas" value={String(month.filter(x=>["pending","confirmed","in_progress"].includes(x.status)).length)}/><Mini label="No show" value={String(month.filter(x=>x.status==="no_show").length)}/></div></section></div>
    </div>
  </div>
}
function WineAppointment({a}:{a:Appt}){return <div className="relative mt-5 overflow-hidden rounded-[23px] p-5 text-white" style={{backgroundImage:`linear-gradient(rgba(67,18,25,.22),rgba(67,18,25,.22)),url("${gloriaWineCardArt}")`,backgroundSize:"cover",backgroundPosition:"center"}}><p className="text-[8px] uppercase tracking-[.2em] text-white/70">Sigue · {time(a.start_at)}</p><p className="mt-2 font-serif text-[31px]">{a.client_name}</p><p className="mt-1 text-[9px] text-white/70">{a.service?.name||"Cita"} · {a.staff?.name||"Equipo"}</p></div>}
function Stat({value,label,wine=false}:{value:string;label:string;wine?:boolean}){return <div className={`rounded-[21px] border p-4 ${wine?"border-[#7B3C48]/20 bg-[#6F3642] text-white":"border-[#DDCFC4] bg-[#F4E9E0] text-[#4A352B]"}`}><p className="font-serif text-[28px] leading-none">{value}</p><p className="mt-2 text-[8px] uppercase tracking-[.12em] opacity-65">{label}</p></div>}
function Alert({value,label}:{value:number;label:string}){return <Link href="/hub/clients" className="flex items-center gap-3 rounded-[16px] bg-white/55 px-4 py-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#7B3C48] font-serif text-[20px] text-white">{value}</span><span className="flex-1 text-[10px] text-mocha">{label}</span><ChevronRight size={14}/></Link>}
function Mini({label,value}:{label:string;value:string}){return <div className="rounded-[14px] border border-white/12 bg-black/8 p-3"><p className="text-[7px] uppercase tracking-[.12em] text-white/55">{label}</p><p className="mt-1 font-serif text-[23px]">{value}</p></div>}
function money(c:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format((c||0)/100)}
function time(v:string){return new Date(v).toLocaleTimeString("es-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}
