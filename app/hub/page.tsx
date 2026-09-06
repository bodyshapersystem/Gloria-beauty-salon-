"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronRight, DollarSign, Sparkles, TrendingUp, UserRoundCheck, UsersRound } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Appt={id:string;client_name:string;start_at:string;status:string;price_cents:number|null;service:{name:string}|null;staff:{name:string}|null};
type Metric={client_id:string;segment:string;lifetime_spend:number;completed_visits:number;last_visit:string|null};

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
    setToday((t as Appt[])||[]);setMonth((m as Appt[])||[]);setMetrics((v as Metric[])||[]);setOrdersValue(((o as {total_cents:number}[])||[]).reduce((n,x)=>n+(x.total_cents||0),0));setClients(c||0);setLoading(false);
  })()},[]);
  const completed=month.filter(x=>x.status==="completed");const recordedAppointmentRevenue=completed.reduce((n,x)=>n+(x.price_cents||0),0);const vip=metrics.filter(x=>x.segment==="vip").length;const atRisk=metrics.filter(x=>x.segment==="at_risk").length;const upcoming=today.filter(x=>["pending","confirmed","in_progress"].includes(x.status));
  const topService=useMemo(()=>{const map=new Map<string,number>();month.filter(x=>x.status!=="cancelled").forEach(x=>{const name=x.service?.name;if(name)map.set(name,(map.get(name)||0)+1)});return [...map.entries()].sort((a,b)=>b[1]-a[1])[0]||null},[month]);
  const pulse=[
    {label:"Today",value:String(upcoming.length),sub:"active appointments",icon:CalendarDays},
    {label:"Clients",value:String(clients),sub:"client profiles",icon:UsersRound},
    {label:"Completed this month",value:String(completed.length),sub:"finished visits",icon:UserRoundCheck},
    {label:"Recorded revenue",value:money(recordedAppointmentRevenue+ordersValue),sub:"appointments + shop with recorded totals",icon:DollarSign},
  ];
  return <div><div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5"><div><p className="text-[9px] uppercase tracking-[0.28em] text-mocha">Gloria Hub · Business Pulse</p><h1 className="mt-2 font-serif text-[46px] md:text-[60px] leading-none">Good to see you.</h1><p className="mt-3 max-w-[640px] text-[13px] leading-relaxed text-taupe">A real-time view of appointments, clients and opportunities. Missing financial values are never estimated.</p></div><Link href="/hub/calendar" className="rounded-full bg-espresso px-5 py-3 text-[9px] uppercase tracking-[0.14em] text-ivory">Open calendar</Link></div>
    {loading?<p className="mt-10 text-[12px] text-taupe">Loading Business Pulse...</p>:<>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{pulse.map(({label,value,sub,icon:Icon})=><div key={label} className="rounded-[22px] border border-champagne/30 bg-white/45 p-5"><Icon size={18} className="text-mocha"/><p className="mt-5 text-[9px] uppercase tracking-[0.18em] text-taupe">{label}</p><p className="mt-1 font-serif text-[36px] leading-none">{value}</p><p className="mt-2 text-[10px] text-taupe">{sub}</p></div>)}</div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1.45fr_.8fr]">
        <section className="rounded-[26px] border border-champagne/30 bg-white/40 p-6"><div className="flex items-center justify-between gap-4"><div><p className="text-[9px] uppercase tracking-[0.2em] text-mocha">Hoy</p><h2 className="mt-2 font-serif text-[34px] leading-none">Today’s agenda</h2></div><Link href="/hub/appointments" className="text-[9px] uppercase tracking-[0.13em] text-mocha">All appointments</Link></div><div className="mt-5 divide-y divide-champagne/20">{upcoming.length?upcoming.map(a=><Link key={a.id} href="/hub/appointments" className="flex items-center gap-4 py-4"><div className="w-[72px] text-[11px] text-mocha">{time(a.start_at)}</div><div className="min-w-0 flex-1"><p className="font-serif text-[23px] leading-none truncate">{a.client_name}</p><p className="mt-1 text-[10px] text-taupe truncate">{a.service?.name||"Appointment"} · {a.staff?.name||"Team"}</p></div><span className="rounded-full border border-champagne/35 px-2.5 py-1 text-[8px] uppercase tracking-[0.1em] text-mocha">{a.status.replaceAll("_"," ")}</span></Link>):<div className="py-8"><p className="font-serif text-[27px]">No appointments today.</p><p className="mt-2 text-[11px] text-taupe">The calendar is clear.</p></div>}</div></section>
        <div className="space-y-5"><section className="rounded-[26px] bg-espresso p-6 text-ivory"><div className="flex items-center gap-2 text-champagne"><Sparkles size={17}/><p className="text-[9px] uppercase tracking-[0.2em]">Opportunities</p></div><div className="mt-5 space-y-4"><Opportunity value={vip} label="VIP clients" href="/hub/clients"/><Opportunity value={atRisk} label="At-risk clients" href="/hub/clients"/><Opportunity value={topService?.[1]||0} label={topService?`bookings · ${topService[0]}`:"Top service not available"} href="/hub/appointments"/></div></section><section className="rounded-[26px] border border-champagne/30 bg-white/40 p-6"><TrendingUp size={18} className="text-mocha"/><p className="mt-4 text-[9px] uppercase tracking-[0.18em] text-taupe">This month</p><p className="mt-2 font-serif text-[32px]">{month.length} bookings</p><p className="mt-2 text-[11px] leading-relaxed text-taupe">{month.filter(x=>x.status==="cancelled").length} cancelled · {month.filter(x=>x.status==="no_show").length} no-show</p></section></div>
      </div>
    </>}
  </div>
}
function Opportunity({value,label,href}:{value:number;label:string;href:string}){return <Link href={href} className="flex items-center gap-3 border-b last:border-0 border-ivory/15 pb-4 last:pb-0"><span className="font-serif text-[31px] text-champagne">{value}</span><span className="flex-1 text-[11px] text-ivory/70">{label}</span><ChevronRight size={16} className="text-champagne"/></Link>}
function money(c:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format((c||0)/100)}
function time(v:string){return new Date(v).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}
