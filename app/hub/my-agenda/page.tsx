"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, UserRound } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Appointment={id:string;client_name:string;client_phone:string;start_at:string;end_at:string;status:string;service:{name:string;category:string}|null};

export default function MyAgendaPage(){
  const [items,setItems]=useState<Appointment[]>([]);const [loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{const start=new Date();start.setHours(0,0,0,0);const end=new Date(start);end.setDate(end.getDate()+1);const {data}=await supabase.from("appointments").select("id,client_name,client_phone,start_at,end_at,status,service:service_id(name,category)").gte("start_at",start.toISOString()).lt("start_at",end.toISOString()).order("start_at");setItems((data as Appointment[])||[]);setLoading(false)})()},[]);
  const active=useMemo(()=>items.filter(x=>!["cancelled","no_show"].includes(x.status)),[items]);
  return <div><p className="text-[10px] uppercase tracking-[0.28em] text-mocha">Gloria Team</p><h1 className="mt-2 font-serif text-[48px] md:text-[58px] leading-none">My Agenda</h1><p className="mt-3 text-[13px] text-taupe">Your assigned clients, today. Only the information you need to deliver the service appears here.</p>
    <div className="mt-8 grid gap-4 md:grid-cols-3"><Metric icon={<CalendarDays size={18}/>} label="Today" value={String(active.length)}/><Metric icon={<Clock3 size={18}/>} label="In progress" value={String(active.filter(x=>x.status==="in_progress").length)}/><Metric icon={<CheckCircle2 size={18}/>} label="Completed" value={String(items.filter(x=>x.status==="completed").length)}/></div>
    <section className="mt-7 overflow-hidden rounded-[26px] border border-champagne/30 bg-white/40">{loading?<p className="p-7 text-[12px] text-taupe">Loading your day...</p>:items.length===0?<div className="p-8"><h2 className="font-serif text-[32px]">No appointments today.</h2><p className="mt-2 text-[12px] text-taupe">Your assigned appointments will appear here automatically.</p></div>:items.map(a=><article key={a.id} className="border-b last:border-0 border-champagne/20 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"><div className="flex gap-4"><div className="w-[76px] shrink-0"><p className="font-serif text-[23px]">{time(a.start_at)}</p><p className="mt-1 text-[10px] text-taupe">{minutes(a.start_at,a.end_at)} min</p></div><div><div className="flex items-center gap-2"><UserRound size={15} className="text-mocha"/><p className="text-[13px] font-medium">{a.client_name}</p></div><p className="mt-1 text-[12px] text-mocha">{a.service?.name||"Service"}</p><p className="mt-1 text-[10px] uppercase tracking-[0.11em] text-taupe">{human(a.status)}</p></div></div><div className="flex flex-wrap gap-2">{["confirmed","in_progress"].includes(a.status)&&<Link href={`/hub/appointments/${a.id}/complete`} className="rounded-full bg-espresso px-4 py-2.5 text-[9px] uppercase tracking-[0.13em] text-ivory">Complete visit</Link>}<a href={`tel:${a.client_phone}`} className="rounded-full border border-mocha/30 px-4 py-2.5 text-[9px] uppercase tracking-[0.13em] text-mocha">Call client</a></div></article>)}</section>
  </div>
}
function Metric({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){return <div className="rounded-[22px] border border-champagne/30 bg-white/45 p-5"><div className="text-mocha">{icon}</div><p className="mt-4 text-[9px] uppercase tracking-[0.16em] text-taupe">{label}</p><p className="mt-1 font-serif text-[34px]">{value}</p></div>}
function time(v:string){return new Date(v).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}
function minutes(a:string,b:string){return Math.round((+new Date(b)-+new Date(a))/60000)}
function human(v:string){return v.replaceAll("_"," ").replace(/\b\w/g,c=>c.toUpperCase())}
