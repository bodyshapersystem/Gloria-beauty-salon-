"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronRight, CircleDollarSign, Clock3, Plus, Sparkles, TrendingUp, UserRoundCheck, UsersRound } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Appt={id:string;client_name:string;start_at:string;status:string;price_cents:number|null;service:{name:string}|null;staff:{name:string}|null};
type Metric={client_id:string;segment:string;lifetime_spend:number;completed_visits:number;last_visit:string|null};

const statusLabels:Record<string,string>={pending:"Pendiente",confirmed:"Confirmada",in_progress:"En curso",completed:"Completada",cancelled:"Cancelada",no_show:"No se presentó"};

export default function HubHome(){
  const [today,setToday]=useState<Appt[]>([]);const [month,setMonth]=useState<Appt[]>([]);const [metrics,setMetrics]=useState<Metric[]>([]);const [ordersValue,setOrdersValue]=useState(0);const [clients,setClients]=useState(0);const [loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{
    const now=new Date();const startDay=new Date(now);startDay.setHours(0,0,0,0);const endDay=new Date(startDay);endDay.setDate(endDay.getDate()+1);const startMonth=new Date(now.getFullYear(),now.getMonth(),1);const endMonth=new Date(now.getFullYear(),now.getMonth()+1,1);
    const [{data:t},{data:m},{data:v},{data:o},{count:c}]=await Promise.all([
      supabase.from("appointments").select("id,client_name,start_at,status,price_cents,service:service_id(name),staff:staff_id(name)").gte("start_at",startDay.toISOString()).lt("start_at",endDay.toISOString()).neq("status","cancelled").order("start_at"),
      supabase.from("appointments").select("id,client_name,start_at,status,price_cents,service:service_id(name),staff:staff_id(name)").gte("start_at",startMonth.toISOString()).lt("start_at",endMonth.toISOString()),
      supabase.from("client_value_metrics").select("client_id,segment,lifetime_spend,completed_visits,last_visit"),
      supabase.from("orders").select("total_cents").gte("created_at",startMonth.toISOString()).lt("created_at",endMonth.toISOString()),
      supabase.from("client_profiles").select("id",{count:"exact",head:true}),
    ]);
    setToday(((t as unknown) as Appt[])||[]);setMonth(((m as unknown) as Appt[])||[]);setMetrics(((v as unknown) as Metric[])||[]);setOrdersValue((((o as unknown) as {total_cents:number}[])||[]).reduce((n,x)=>n+(x.total_cents||0),0));setClients(c||0);setLoading(false);
  })()},[]);

  const completed=month.filter(x=>x.status==="completed");const recordedAppointmentRevenue=completed.reduce((n,x)=>n+(x.price_cents||0),0);const vip=metrics.filter(x=>x.segment==="vip").length;const atRisk=metrics.filter(x=>x.segment==="at_risk").length;const upcoming=today.filter(x=>["pending","confirmed","in_progress"].includes(x.status));const next=upcoming[0]||null;
  const topService=useMemo(()=>{const map=new Map<string,number>();month.filter(x=>x.status!=="cancelled").forEach(x=>{const name=x.service?.name;if(name)map.set(name,(map.get(name)||0)+1)});return [...map.entries()].sort((a,b)=>b[1]-a[1])[0]||null},[month]);
  const completedPct=month.length?Math.round((completed.length/month.length)*100):0;

  if(loading)return <div className="py-20 text-center"><p className="font-serif text-[30px]">Preparando tu día...</p><p className="mt-2 text-[11px] text-taupe">Cargando Gloria Hub</p></div>;

  return <div>
    <section className="relative overflow-hidden rounded-[30px] border border-champagne/25 bg-[linear-gradient(135deg,#F3E7DF_0%,#F8F5EF_48%,#EFE4D9_100%)] px-5 py-6 md:px-8 md:py-8">
      <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-white/60 bg-white/25"/><div className="absolute right-10 bottom-[-70px] h-44 w-44 rounded-full border border-mocha/10"/>
      <div className="relative flex flex-col xl:flex-row xl:items-end xl:justify-between gap-7">
        <div><p className="text-[9px] uppercase tracking-[0.28em] text-mocha">Hoy en Gloria</p><h1 className="mt-3 font-serif text-[46px] md:text-[64px] leading-[.92]">Todo lo que necesitas,<br/><span className="italic text-mocha">aquí mismo.</span></h1><p className="mt-4 max-w-[560px] text-[12px] md:text-[13px] leading-relaxed text-taupe">Empieza por hoy. Reserva una clienta, revisa la agenda o entra directo a lo que necesites.</p></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-2 xl:w-[420px]">
          <Quick href="/hub/calendar?new=1" icon={Plus} label="Nueva cita" dark/><Quick href="/hub/calendar" icon={CalendarDays} label="Ver calendario"/><Quick href="/hub/clients" icon={UsersRound} label="Buscar clienta"/><Quick href="/hub/appointments" icon={Clock3} label="Administrar citas"/>
        </div>
      </div>
    </section>

    <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard icon={CalendarDays} label="Hoy" value={String(upcoming.length)} sub={upcoming.length===1?"cita en la agenda":"citas en la agenda"}/>
      <MetricCard icon={UsersRound} label="Clientas" value={String(clients)} sub="perfiles en Gloria Access"/>
      <MetricCard icon={UserRoundCheck} label="Completadas" value={`${completedPct}%`} sub={`${completed.length} de ${month.length} reservas este mes`}/>
      <MetricCard icon={CircleDollarSign} label="Registrado este mes" value={money(recordedAppointmentRevenue+ordersValue)} sub="citas + shop, montos registrados"/>
    </div>

    <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_.85fr]">
      <section className="rounded-[28px] border border-champagne/25 bg-white/55 p-5 md:p-6">
        <div className="flex items-center justify-between gap-4"><div><p className="text-[8px] uppercase tracking-[0.22em] text-mocha">Tu día</p><h2 className="mt-2 font-serif text-[34px] leading-none">El flujo de hoy</h2></div><Link href="/hub/calendar" className="rounded-full border border-champagne/40 px-4 py-2 text-[9px] uppercase tracking-[0.12em] text-mocha">Calendario completo</Link></div>
        {next&&<div className="mt-5 rounded-[22px] bg-espresso p-5 text-ivory"><div className="flex items-start justify-between gap-4"><div><p className="text-[8px] uppercase tracking-[0.18em] text-champagne">Sigue · {time(next.start_at)}</p><p className="mt-2 font-serif text-[30px] leading-none">{next.client_name}</p><p className="mt-2 text-[11px] text-ivory/70">{next.service?.name||"Cita"} · {next.staff?.name||"Equipo"}</p></div><Status value={next.status}/></div><Link href="/hub/appointments" className="mt-5 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-champagne">Ver cita <ChevronRight size={14}/></Link></div>}
        <div className="mt-3 space-y-2">{upcoming.length?upcoming.slice(next?1:0,6).map(a=><Link key={a.id} href="/hub/appointments" className="group flex items-center gap-3 rounded-[18px] border border-champagne/20 bg-ivory/45 px-4 py-3 transition hover:bg-blush/20"><div className="grid h-11 w-14 place-items-center rounded-[13px] bg-white/70 text-[11px] font-medium text-mocha">{time(a.start_at)}</div><div className="min-w-0 flex-1"><p className="font-serif text-[21px] leading-none truncate">{a.client_name}</p><p className="mt-1 text-[10px] text-taupe truncate">{a.service?.name||"Cita"} · {a.staff?.name||"Equipo"}</p></div><Status value={a.status}/><ChevronRight size={15} className="text-taupe group-hover:text-mocha"/></Link>):<EmptyAgenda/>}</div>
      </section>

      <div className="space-y-5">
        <section className="rounded-[28px] border border-champagne/25 bg-white/55 p-5 md:p-6"><div className="flex items-center gap-2 text-mocha"><Sparkles size={16}/><p className="text-[8px] uppercase tracking-[0.2em]">Necesita tu atención</p></div><div className="mt-5 space-y-2"><Attention value={atRisk} label="Clientas en riesgo" note="Perfecto para un toque personal de rebooking" href="/hub/clients"/><Attention value={vip} label="Clientas VIP" note="Tus relaciones de más valor" href="/hub/clients"/><Attention value={topService?.[1]||0} label={topService?topService[0]:"Servicio top"} note="El servicio más reservado este mes" href="/hub/appointments"/></div></section>
        <section className="rounded-[28px] bg-[linear-gradient(145deg,#6B4F43,#2E2724)] p-6 text-ivory"><TrendingUp size={18} className="text-champagne"/><p className="mt-4 text-[8px] uppercase tracking-[0.2em] text-champagne">Este mes</p><p className="mt-2 font-serif text-[36px] leading-none">{month.length} reservas</p><div className="mt-5 grid grid-cols-2 gap-2"><MiniStat label="Completadas" value={completed.length}/><MiniStat label="Canceladas" value={month.filter(x=>x.status==="cancelled").length}/><MiniStat label="No show" value={month.filter(x=>x.status==="no_show").length}/><MiniStat label="Activas" value={month.filter(x=>["pending","confirmed","in_progress"].includes(x.status)).length}/></div></section>
      </div>
    </div>
  </div>
}

function Quick({href,icon:Icon,label,dark=false}:{href:string;icon:any;label:string;dark?:boolean}){return <Link href={href} className={`group flex min-h-[82px] flex-col justify-between rounded-[18px] border p-4 transition hover:-translate-y-0.5 ${dark?"border-espresso bg-espresso text-ivory":"border-champagne/30 bg-white/60 text-espresso"}`}><Icon size={18} className={dark?"text-champagne":"text-mocha"}/><div className="flex items-end justify-between gap-2"><span className="text-[11px] leading-tight">{label}</span><ChevronRight size={14} className="opacity-60 group-hover:translate-x-0.5 transition"/></div></Link>}
function MetricCard({icon:Icon,label,value,sub}:{icon:any;label:string;value:string;sub:string}){return <div className="rounded-[22px] border border-champagne/25 bg-white/50 p-5"><div className="flex items-center justify-between"><span className="grid h-9 w-9 place-items-center rounded-[11px] bg-blush/40 text-mocha"><Icon size={16}/></span><span className="text-[8px] uppercase tracking-[0.18em] text-taupe">{label}</span></div><p className="mt-5 font-serif text-[34px] leading-none">{value}</p><p className="mt-2 text-[10px] leading-relaxed text-taupe">{sub}</p></div>}
function Attention({value,label,note,href}:{value:number;label:string;note:string;href:string}){return <Link href={href} className="group flex items-center gap-3 rounded-[16px] border border-champagne/20 bg-ivory/40 px-3 py-3"><span className="grid h-10 w-10 place-items-center rounded-[12px] bg-blush/40 font-serif text-[21px] text-mocha">{value}</span><span className="min-w-0 flex-1"><span className="block text-[12px]">{label}</span><span className="mt-0.5 block text-[9px] text-taupe">{note}</span></span><ChevronRight size={14} className="text-taupe group-hover:text-mocha"/></Link>}
function MiniStat({label,value}:{label:string;value:number}){return <div className="rounded-[14px] border border-ivory/10 bg-white/5 p-3"><p className="text-[8px] uppercase tracking-[0.14em] text-ivory/55">{label}</p><p className="mt-1 font-serif text-[24px] text-champagne">{value}</p></div>}
function EmptyAgenda(){return <div className="rounded-[20px] border border-dashed border-champagne/45 px-5 py-8 text-center"><p className="font-serif text-[27px]">Tu día está libre.</p><p className="mt-2 text-[10px] text-taupe">No hay citas activas programadas para hoy.</p><Link href="/hub/calendar?new=1" className="mt-4 inline-flex items-center gap-2 rounded-full bg-espresso px-4 py-2.5 text-[9px] uppercase tracking-[0.12em] text-ivory"><Plus size={13}/> Agregar cita</Link></div>}
function Status({value}:{value:string}){return <span className="inline-flex w-fit rounded-full border border-champagne/30 bg-ivory/10 px-2.5 py-1 text-[8px] uppercase tracking-[0.09em] text-current">{statusLabels[value]||value}</span>}
function money(c:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format((c||0)/100)}
function time(v:string){return new Date(v).toLocaleTimeString("es-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}
