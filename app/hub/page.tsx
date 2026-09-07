"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronRight, CircleDollarSign, Clock3, Plus, Sparkles, TrendingUp, UsersRound } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Appt={id:string;client_name:string;start_at:string;status:string;price_cents:number|null;service:{name:string}|null;staff:{name:string}|null};
type Metric={client_id:string;segment:string;lifetime_spend:number;completed_visits:number;last_visit:string|null};

const statusLabels:Record<string,string>={pending:"Pendiente",confirmed:"Confirmada",in_progress:"En curso",completed:"Completada",cancelled:"Cancelada",no_show:"No show"};

export default function HubHome(){
  const [today,setToday]=useState<Appt[]>([]);
  const [month,setMonth]=useState<Appt[]>([]);
  const [metrics,setMetrics]=useState<Metric[]>([]);
  const [ordersValue,setOrdersValue]=useState(0);
  const [clients,setClients]=useState(0);
  const [loading,setLoading]=useState(true);

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

  const completed=month.filter(x=>x.status==="completed");
  const revenue=completed.reduce((n,x)=>n+(x.price_cents||0),0)+ordersValue;
  const upcoming=today.filter(x=>["pending","confirmed","in_progress"].includes(x.status));
  const next=upcoming[0]||null;
  const vip=metrics.filter(x=>x.segment==="vip").length;
  const atRisk=metrics.filter(x=>x.segment==="at_risk").length;
  const topService=useMemo(()=>{const map=new Map<string,number>();month.filter(x=>x.status!=="cancelled").forEach(x=>{const name=x.service?.name;if(name)map.set(name,(map.get(name)||0)+1)});return [...map.entries()].sort((a,b)=>b[1]-a[1])[0]||null},[month]);

  if(loading)return <div className="py-20 text-center"><p className="font-serif text-[30px]">Preparando Gloria Hub...</p></div>;

  return <div className="pb-4">
    <section className="relative overflow-hidden rounded-[30px] border border-[#D9C8BC] min-h-[260px] p-6 md:p-8" style={{backgroundImage:"radial-gradient(circle at 78% 12%,rgba(255,255,255,.88),transparent 27%),radial-gradient(circle at 18% 90%,rgba(123,60,72,.12),transparent 35%),linear-gradient(135deg,#FAF5EF 0%,#E8D7CF 58%,#D9C0B5 100%)"}}>
      <div className="absolute -right-12 bottom-[-60px] h-48 w-72 rotate-[-18deg] rounded-[50%] bg-[#7B3C48]/15 blur-3xl"/>
      <div className="relative grid gap-8 xl:grid-cols-[1fr_430px] xl:items-end">
        <div>
          <p className="text-[9px] uppercase tracking-[.28em] text-mocha">Gloria Hub</p>
          <h1 className="mt-3 font-serif text-[50px] md:text-[68px] leading-[.9]">Hola, Gloria.<br/><span className="italic text-[#7B3C48]">Tu salón, más simple.</span></h1>
          <p className="mt-4 max-w-[520px] text-[11px] leading-relaxed text-taupe">Agenda, clientas, equipo y números importantes, todo en un solo lugar.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <HeroCard href="/hub/calendar?new=1" label="Nueva cita" icon={<Plus size={18}/>} tone="wine"/>
          <HeroCard href="/hub/calendar" label="Calendario" icon={<CalendarDays size={18}/>} tone="mocha"/>
          <HeroCard href="/hub/clients" label="Clientas" icon={<UsersRound size={18}/>} tone="dust"/>
          <HeroCard href="/hub/team" label="Equipo" icon={<Sparkles size={18}/>} tone="nude"/>
        </div>
      </div>
    </section>

    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
      <StatCard value={String(upcoming.length)} label="Citas hoy" tone="cream"/>
      <StatCard value={String(clients)} label="Clientas" tone="dust"/>
      <StatCard value={money(revenue)} label="Generado este mes" tone="wine"/>
      <StatCard value={topService?.[0]||"—"} label="Servicio top" tone="mocha" small/>
    </div>

    <div className="mt-5 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
      <section className="rounded-[28px] border border-[#DED0C6] bg-[#FCF9F5] p-5 md:p-6 shadow-[0_12px_34px_rgba(52,38,31,.05)]">
        <div className="flex items-center justify-between gap-3">
          <div><p className="text-[8px] uppercase tracking-[.2em] text-mocha">Hoy</p><h2 className="mt-1 font-serif text-[34px]">El flujo del salón</h2></div>
          <Link href="/hub/calendar" className="rounded-full border border-[#D8C8BC] px-4 py-2 text-[8px] uppercase tracking-[.12em] text-mocha">Ver calendario</Link>
        </div>

        {next&&<div className="mt-5 relative overflow-hidden rounded-[24px] p-5 text-white" style={{backgroundImage:"radial-gradient(circle at 82% 18%,rgba(255,220,216,.18),transparent 28%),repeating-radial-gradient(ellipse at 30% 40%,rgba(255,255,255,.045) 0 1px,transparent 2px 10px),linear-gradient(135deg,#7A3C47,#4A2C2F)"}}>
          <p className="text-[8px] uppercase tracking-[.2em] text-[#EFD8D5]">Sigue · {time(next.start_at)}</p>
          <div className="mt-3 flex items-end justify-between gap-4"><div><p className="font-serif text-[32px]">{next.client_name}</p><p className="mt-1 text-[10px] text-white/70">{next.service?.name||"Cita"} · {next.staff?.name||"Equipo"}</p></div><Status value={next.status}/></div>
        </div>}

        <div className="mt-3 space-y-2">
          {upcoming.length?upcoming.slice(next?1:0,6).map(a=><Link key={a.id} href="/hub/appointments" className="group flex items-center gap-3 rounded-[18px] border border-[#E4D7CD] bg-[#F8F1EB] px-4 py-3 hover:bg-[#F2E4DE]">
            <div className="grid h-11 w-14 place-items-center rounded-[13px] bg-white/85 text-[10px] font-medium text-mocha">{time(a.start_at)}</div>
            <div className="min-w-0 flex-1"><p className="font-serif text-[20px] truncate">{a.client_name}</p><p className="mt-1 text-[9px] text-taupe truncate">{a.service?.name||"Cita"} · {a.staff?.name||"Equipo"}</p></div>
            <Status value={a.status}/><ChevronRight size={14} className="text-taupe"/>
          </Link>):<div className="rounded-[20px] border border-dashed border-[#D8C8BC] px-5 py-8 text-center"><p className="font-serif text-[27px]">Tu día está libre.</p><Link href="/hub/calendar?new=1" className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#4A352B] px-4 py-2.5 text-[8px] uppercase tracking-[.12em] text-white"><Plus size={13}/> Agregar cita</Link></div>}
        </div>
      </section>

      <div className="space-y-5">
        <section className="relative overflow-hidden rounded-[28px] border border-[#D9C7BB] bg-[#EAD7D2] p-6">
          <div className="absolute -right-10 -top-8 h-32 w-32 rounded-full bg-white/55 blur-xl"/>
          <p className="relative text-[8px] uppercase tracking-[.2em] text-[#7B3C48]">Necesita tu atención</p>
          <div className="relative mt-5 space-y-3"><Alert value={atRisk} label="Clientas para rebooking"/><Alert value={vip} label="Clientas VIP"/><Alert value={month.filter(x=>x.status==="cancelled").length} label="Cancelaciones este mes"/></div>
        </section>

        <section className="relative overflow-hidden rounded-[28px] p-6 text-white" style={{backgroundImage:"radial-gradient(circle at 25% 20%,rgba(255,236,225,.14),transparent 28%),repeating-radial-gradient(ellipse at 70% 50%,rgba(255,255,255,.04) 0 1px,transparent 2px 12px),linear-gradient(135deg,#5B4036,#2F2522)"}}>
          <TrendingUp size={18} className="text-[#E4C6B5]"/>
          <p className="mt-4 text-[8px] uppercase tracking-[.2em] text-[#E4C6B5]">Este mes</p>
          <p className="mt-2 font-serif text-[40px]">{month.length} reservas</p>
          <div className="mt-5 grid grid-cols-2 gap-2"><Mini label="Completadas" value={String(completed.length)}/><Mini label="Activas" value={String(month.filter(x=>["pending","confirmed","in_progress"].includes(x.status)).length)}/><Mini label="Canceladas" value={String(month.filter(x=>x.status==="cancelled").length)}/><Mini label="No show" value={String(month.filter(x=>x.status==="no_show").length)}/></div>
        </section>
      </div>
    </div>
  </div>
}

function HeroCard({href,label,icon,tone}:{href:string;label:string;icon:React.ReactNode;tone:"wine"|"mocha"|"dust"|"nude"}){const style={wine:"linear-gradient(135deg,#783A47,#4B2830)",mocha:"linear-gradient(135deg,#6B4F43,#34261F)",dust:"radial-gradient(circle at 75% 20%,rgba(255,255,255,.8),transparent 28%),linear-gradient(135deg,#EBCFD0,#D7B5B9)",nude:"radial-gradient(circle at 70% 20%,rgba(255,255,255,.95),transparent 28%),linear-gradient(135deg,#F4E8DD,#DFC7B7)"}[tone];const dark=tone==="wine"||tone==="mocha";return <Link href={href} className={`relative min-h-[112px] overflow-hidden rounded-[22px] border border-white/35 p-4 shadow-[0_10px_24px_rgba(52,38,31,.07)] ${dark?"text-white":"text-[#4A352B]"}`} style={{backgroundImage:style}}><span className="relative grid h-9 w-9 place-items-center rounded-full bg-white/15">{icon}</span><p className="relative mt-6 font-serif text-[22px]">{label}</p></Link>}
function StatCard({value,label,tone,small=false}:{value:string;label:string;tone:"cream"|"dust"|"wine"|"mocha";small?:boolean}){const styles={cream:"linear-gradient(135deg,#F8F1EA,#EEDFD5)",dust:"linear-gradient(135deg,#EFD8D5,#D8B8BA)",wine:"linear-gradient(135deg,#7B3C48,#512D35)",mocha:"linear-gradient(135deg,#6B4F43,#3D2C27)"};const dark=tone==="wine"||tone==="mocha";return <div className={`rounded-[22px] border border-white/35 p-4 shadow-[0_8px_24px_rgba(52,38,31,.05)] ${dark?"text-white":"text-[#4A352B]"}`} style={{backgroundImage:styles[tone]}}><p className={`font-serif leading-none ${small?"text-[18px]":"text-[30px]"}`}>{value}</p><p className="mt-2 text-[8px] uppercase tracking-[.14em] opacity-65">{label}</p></div>}
function Alert({value,label}:{value:number;label:string}){return <Link href="/hub/clients" className="flex items-center gap-3 rounded-[16px] bg-white/55 px-4 py-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#7B3C48] font-serif text-[20px] text-white">{value}</span><span className="flex-1 text-[10px] text-mocha">{label}</span><ChevronRight size={14} className="text-taupe"/></Link>}
function Mini({label,value}:{label:string;value:string}){return <div className="rounded-[14px] border border-white/10 bg-white/5 p-3"><p className="text-[7px] uppercase tracking-[.12em] text-white/55">{label}</p><p className="mt-1 font-serif text-[24px]">{value}</p></div>}
function Status({value}:{value:string}){return <span className="rounded-full border border-current/20 bg-white/10 px-2.5 py-1 text-[7px] uppercase tracking-[.08em]">{statusLabels[value]||value}</span>}
function money(c:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format((c||0)/100)}
function time(v:string){return new Date(v).toLocaleTimeString("es-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}
