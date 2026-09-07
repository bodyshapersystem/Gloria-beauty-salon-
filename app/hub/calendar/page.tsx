"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type View="day"|"week"|"month";
type Staff={id:string;name:string};
type Appointment={id:string;client_name:string;start_at:string;end_at:string;status:string;service_id:string;staff_id:string;service:{name:string}|null;staff:{name:string}|null};

const viewLabels:Record<View,string>={day:"Día",week:"Semana",month:"Mes"};
const statusLabels:Record<string,string>={pending:"Pendiente",confirmed:"Confirmada",in_progress:"En curso",completed:"Completada",cancelled:"Cancelada",no_show:"No se presentó"};

export default function HubCalendarPage(){
  const [view,setView]=useState<View>("week");
  const [anchor,setAnchor]=useState(new Date());
  const [appointments,setAppointments]=useState<Appointment[]>([]);
  const [staff,setStaff]=useState<Staff[]>([]);
  const [loading,setLoading]=useState(true);

  async function load(){
    setLoading(true);
    const [{data:a},{data:s}]=await Promise.all([
      supabase.from("appointments").select("id,client_name,start_at,end_at,status,service_id,staff_id,service:service_id(name),staff:staff_id(name)").neq("status","cancelled").order("start_at"),
      supabase.from("staff").select("id,name").eq("active",true).order("name")
    ]);
    setAppointments(((a as unknown) as Appointment[])||[]);
    setStaff(((s as unknown) as Staff[])||[]);
    setLoading(false);
  }
  useEffect(()=>{load()},[]);

  const days=useMemo(()=>viewDays(anchor,view),[anchor,view]);
  const visible=useMemo(()=>appointments.filter(a=>days.some(d=>sameDay(new Date(a.start_at),d))),[appointments,days]);

  return <div>
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
      <div><p className="text-[10px] uppercase tracking-[0.28em] text-mocha">Gloria Hub</p><h1 className="mt-2 font-serif text-[46px] md:text-[58px] leading-none">Calendario</h1><p className="mt-3 text-[13px] text-taupe">Mira el ritmo del salón por día, semana o mes.</p></div>
      <Link href="/hub/appointments" className="inline-flex items-center gap-2 rounded-full bg-espresso px-5 py-3 text-[10px] uppercase tracking-[0.14em] text-ivory"><Plus size={15}/> Nueva Cita</Link>
    </div>

    <div className="mt-7 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-2"><button onClick={()=>setAnchor(move(anchor,view,-1))} className="h-10 w-10 rounded-full border border-champagne/35 flex items-center justify-center"><ChevronLeft size={17}/></button><button onClick={()=>setAnchor(new Date())} className="rounded-full border border-champagne/35 px-4 py-2.5 text-[9px] uppercase tracking-[0.13em]">Hoy</button><button onClick={()=>setAnchor(move(anchor,view,1))} className="h-10 w-10 rounded-full border border-champagne/35 flex items-center justify-center"><ChevronRight size={17}/></button><p className="ml-2 font-serif text-[24px]">{label(anchor,view)}</p></div>
      <div className="flex rounded-full border border-champagne/35 p-1">{(["day","week","month"] as View[]).map(v=><button key={v} onClick={()=>setView(v)} className={`rounded-full px-4 py-2 text-[9px] uppercase tracking-[0.12em] ${view===v?"bg-espresso text-ivory":"text-taupe"}`}>{viewLabels[v]}</button>)}</div>
    </div>

    {loading?<p className="mt-8 text-[13px] text-taupe">Cargando calendario...</p>:view==="month"?<Month days={days} items={visible}/>:<>
      <div className="hidden md:block mt-6 overflow-x-auto rounded-[24px] border border-champagne/30 bg-white/35">
        <div className="min-w-[900px] grid" style={{gridTemplateColumns:`130px repeat(${Math.max(staff.length,1)},minmax(150px,1fr))`}}>
          <div className="border-b border-r border-champagne/25 p-4 text-[9px] uppercase tracking-[0.14em] text-taupe">{view==="day"?fmtDay(days[0]):"Profesional"}</div>
          {staff.map(s=><div key={s.id} className="border-b border-r last:border-r-0 border-champagne/25 p-4 text-center"><p className="font-serif text-[22px]">{s.name}</p></div>)}
          <div className="border-r border-champagne/20 p-4 text-[10px] text-taupe">Agenda</div>
          {staff.map(s=><div key={s.id} className="border-r last:border-r-0 border-champagne/20 p-3 min-h-[540px]"><div className="space-y-2">{visible.filter(a=>a.staff_id===s.id).sort(sortTime).map(a=><AppointmentCard key={a.id} a={a}/>)}</div></div>)}
        </div>
      </div>
      <div className="md:hidden mt-6 space-y-6">{days.map(d=><section key={d.toISOString()}><p className="text-[9px] uppercase tracking-[0.18em] text-mocha">{fmtDay(d)}</p><div className="mt-3 space-y-2">{visible.filter(a=>sameDay(new Date(a.start_at),d)).sort(sortTime).map(a=><AppointmentCard key={a.id} a={a}/>)}{visible.filter(a=>sameDay(new Date(a.start_at),d)).length===0&&<p className="text-[12px] text-taupe">Sin citas.</p>}</div></section>)}</div>
    </>}
  </div>
}

function AppointmentCard({a}:{a:Appointment}){return <Link href={`/hub/appointments?appointment=${a.id}`} className="block rounded-[16px] border border-champagne/30 bg-blush/25 p-4"><p className="text-[9px] text-taupe">{fmtTime(a.start_at)} · {statusLabels[a.status]||a.status}</p><p className="mt-1 font-serif text-[23px] leading-none">{a.client_name}</p><p className="mt-2 text-[11px] text-mocha">{a.service?.name||"Cita"} · {a.staff?.name||""}</p></Link>}
function Month({days,items}:{days:Date[];items:Appointment[]}){return <div className="mt-6 grid grid-cols-2 md:grid-cols-7 overflow-hidden rounded-[24px] border border-champagne/30 bg-white/35">{days.map(d=>{const list=items.filter(a=>sameDay(new Date(a.start_at),d));return <div key={d.toISOString()} className="min-h-[130px] border-r border-b border-champagne/20 p-3"><p className="text-[10px] text-taupe">{d.getDate()}</p><div className="mt-2 space-y-1">{list.slice(0,3).map(a=><p key={a.id} className="rounded bg-ivory px-2 py-1 text-[9px] truncate">{fmtTime(a.start_at)} {a.client_name}</p>)}{list.length>3&&<p className="text-[9px] text-mocha">+{list.length-3} más</p>}</div></div>})}</div>}
function viewDays(anchor:Date,view:View){if(view==="day")return [new Date(anchor)];if(view==="week"){const start=new Date(anchor);const dow=start.getDay();const shift=dow===0?-6:1-dow;start.setDate(start.getDate()+shift);start.setHours(0,0,0,0);return Array.from({length:6},(_,i)=>{const d=new Date(start);d.setDate(start.getDate()+i);return d})}const last=new Date(anchor.getFullYear(),anchor.getMonth()+1,0);return Array.from({length:last.getDate()},(_,i)=>new Date(anchor.getFullYear(),anchor.getMonth(),i+1))}
function move(d:Date,view:View,n:number){const x=new Date(d);if(view==="day")x.setDate(x.getDate()+n);else if(view==="week")x.setDate(x.getDate()+7*n);else x.setMonth(x.getMonth()+n);return x}
function label(d:Date,view:View){return view==="month"?d.toLocaleDateString("es-US",{month:"long",year:"numeric"}):d.toLocaleDateString("es-US",{month:"long",day:"numeric",year:"numeric"})}
function sameDay(a:Date,b:Date){return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate()}
function sortTime(a:Appointment,b:Appointment){return +new Date(a.start_at)-+new Date(b.start_at)}
function fmtTime(v:string){return new Date(v).toLocaleTimeString("es-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}
function fmtDay(d:Date){return d.toLocaleDateString("es-US",{weekday:"long",month:"short",day:"numeric"})}
