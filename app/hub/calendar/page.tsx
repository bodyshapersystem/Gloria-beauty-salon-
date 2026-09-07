"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Plus, UserRound, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type View="day"|"week"|"month";
type Staff={id:string;name:string;photo_url:string|null};
type Appointment={id:string;client_name:string;start_at:string;end_at:string;status:string;service_id:string;staff_id:string;service_name:string|null;staff_name:string|null};
type HubUser={role:"owner"|"admin"|"staff"};

const statusLabels:Record<string,string>={pending:"Pendiente",confirmed:"Confirmada",in_progress:"En curso",completed:"Completada",cancelled:"Cancelada",no_show:"No show"};
const HOURS=[9,10,11,12,13,14,15,16,17];

export default function HubCalendarPage(){
  const [view,setView]=useState<View>("week");
  const [selectedDate,setSelectedDate]=useState(startOfDay(new Date()));
  const [appointments,setAppointments]=useState<Appointment[]>([]);
  const [staff,setStaff]=useState<Staff[]>([]);
  const [user,setUser]=useState<HubUser|null>(null);
  const [selected,setSelected]=useState<Appointment|null>(null);
  const [loading,setLoading]=useState(true);

  async function load(){
    setLoading(true);
    const rangeStart=new Date(selectedDate);rangeStart.setDate(rangeStart.getDate()-40);
    const rangeEnd=new Date(selectedDate);rangeEnd.setDate(rangeEnd.getDate()+40);rangeEnd.setHours(23,59,59,999);
    const {data:{session}}=await supabase.auth.getSession();
    const [{data:u},{data:s},{data:a,error}]=await Promise.all([
      session?supabase.from("user_profiles").select("role").eq("auth_user_id",session.user.id).eq("active",true).maybeSingle():Promise.resolve({data:null} as any),
      supabase.from("staff").select("id,name,photo_url").eq("active",true).order("name"),
      supabase.rpc("team_calendar_appointments",{p_start:rangeStart.toISOString(),p_end:rangeEnd.toISOString()})
    ]);
    if(!error)setAppointments(((a as unknown) as Appointment[])||[]);
    setStaff(((s as unknown) as Staff[])||[]);
    setUser((u as HubUser)||null);
    setLoading(false);
  }
  useEffect(()=>{load()},[selectedDate]);

  const isAdmin=user?.role==="owner"||user?.role==="admin";
  const week=useMemo(()=>weekDays(selectedDate),[selectedDate]);
  const dayItems=useMemo(()=>appointments.filter(a=>sameDayNY(a.start_at,selectedDate)).sort(sortTime),[appointments,selectedDate]);
  const monthDays=useMemo(()=>monthGrid(selectedDate),[selectedDate]);

  return <div>
    <div className="flex items-start justify-between gap-4">
      <div><p className="text-[9px] uppercase tracking-[0.25em] text-mocha">Agenda del salón</p><h1 className="mt-1 font-serif text-[40px] md:text-[54px] leading-none">Calendario</h1><p className="mt-2 text-[12px] text-taupe">Todo el equipo, en un solo lugar.</p></div>
      {isAdmin&&<Link href="/hub/appointments" className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#4A352B] px-4 py-3 text-[9px] uppercase tracking-[0.13em] text-ivory"><Plus size={14}/> Nueva cita</Link>}
    </div>

    <div className="mt-5 rounded-[22px] border border-champagne/30 bg-white/65 p-3 shadow-[0_8px_30px_rgba(52,38,31,.04)]">
      <div className="flex items-center justify-between gap-3">
        <button onClick={()=>shiftDate(selectedDate,view,-1,setSelectedDate)} className="grid h-10 w-10 place-items-center rounded-full border border-champagne/35"><ChevronLeft size={17}/></button>
        <button onClick={()=>setSelectedDate(startOfDay(new Date()))} className="min-w-0 text-center"><p className="font-serif text-[21px] md:text-[24px] capitalize">{headerDate(selectedDate,view)}</p><p className="mt-1 text-[8px] uppercase tracking-[0.16em] text-mocha">Toca para volver a hoy</p></button>
        <button onClick={()=>shiftDate(selectedDate,view,1,setSelectedDate)} className="grid h-10 w-10 place-items-center rounded-full border border-champagne/35"><ChevronRight size={17}/></button>
      </div>
      <div className="mt-3 grid grid-cols-3 rounded-full bg-[#F3ECE5] p-1">{(["day","week","month"] as View[]).map(v=><button key={v} onClick={()=>setView(v)} className={`rounded-full py-2 text-[9px] uppercase tracking-[0.12em] ${view===v?"bg-[#4A352B] text-ivory shadow-sm":"text-taupe"}`}>{v==="day"?"Día":v==="week"?"Semana":"Mes"}</button>)}</div>
    </div>

    {view==="week"&&<div className="mt-4 grid grid-cols-6 gap-1.5">{week.map(d=>{const active=sameDate(d,selectedDate);const count=appointments.filter(a=>sameDayNY(a.start_at,d)).length;return <button key={d.toISOString()} onClick={()=>setSelectedDate(d)} className={`rounded-[16px] border px-1 py-2.5 text-center ${active?"border-[#4A352B] bg-[#4A352B] text-ivory":"border-champagne/30 bg-white/55 text-taupe"}`}><p className="text-[7px] uppercase tracking-[0.12em]">{d.toLocaleDateString("es-US",{weekday:"short"}).replace(".","")}</p><p className="mt-1 font-serif text-[20px] leading-none">{d.getDate()}</p><span className={`mt-2 inline-block h-1.5 w-1.5 rounded-full ${count?active?"bg-champagne":"bg-mocha":"bg-transparent"}`}/></button>})}</div>}

    {loading?<div className="mt-8 rounded-[22px] border border-champagne/25 bg-white/50 p-8 text-[12px] text-taupe">Organizando la agenda…</div>:view==="month"?<MonthView days={monthDays} appointments={appointments} selectedDate={selectedDate} onSelect={setSelectedDate} onOpen={setSelected}/>:<>
      <div className="md:hidden mt-5">
        <div className="flex items-center justify-between"><div><p className="text-[8px] uppercase tracking-[0.2em] text-mocha">{dayItems.length} citas</p><h2 className="mt-1 font-serif text-[28px]">{selectedDate.toLocaleDateString("es-US",{weekday:"long"})}</h2></div>{isAdmin&&<Link href="/hub/appointments" className="grid h-11 w-11 place-items-center rounded-full bg-[#4A352B] text-ivory"><Plus size={20}/></Link>}</div>
        <div className="mt-4 space-y-2">{dayItems.length?dayItems.map(a=><MobileAppointment key={a.id} a={a} onOpen={()=>setSelected(a)}/>):<EmptyDay/>}</div>
      </div>

      <div className="hidden md:block mt-5 overflow-x-auto rounded-[24px] border border-champagne/30 bg-white/65 shadow-[0_12px_34px_rgba(52,38,31,.05)]">
        <div className="min-w-[980px]">
          <div className="grid border-b border-champagne/30" style={{gridTemplateColumns:`78px repeat(${Math.max(staff.length,1)},minmax(165px,1fr))`}}>
            <div className="p-3 text-[8px] uppercase tracking-[0.15em] text-taupe">Hora</div>
            {staff.map(s=><div key={s.id} className="border-l border-champagne/20 p-3"><div className="flex items-center gap-2"><div className="grid h-8 w-8 place-items-center rounded-full bg-blush/45 text-mocha"><UserRound size={14}/></div><div><p className="font-serif text-[18px] leading-none">{s.name}</p><p className="mt-1 text-[8px] text-taupe">{dayItems.filter(a=>a.staff_id===s.id).length} citas</p></div></div></div>)}
          </div>
          <div className="grid" style={{gridTemplateColumns:`78px repeat(${Math.max(staff.length,1)},minmax(165px,1fr))`}}>
            <div className="relative h-[576px] border-r border-champagne/20">{HOURS.slice(0,-1).map((h,i)=><div key={h} className="absolute inset-x-0 text-right pr-3 text-[9px] text-taupe" style={{top:i*72-5}}>{formatHour(h)}</div>)}</div>
            {staff.map(s=><div key={s.id} className="relative h-[576px] border-r last:border-r-0 border-champagne/20 bg-[linear-gradient(to_bottom,transparent_71px,rgba(212,184,150,.22)_72px)] bg-[length:100%_72px]">{dayItems.filter(a=>a.staff_id===s.id).map(a=><PositionedAppointment key={a.id} a={a} onOpen={()=>setSelected(a)}/>)}</div>)}
          </div>
        </div>
      </div>
    </>}

    {selected&&<div className="fixed inset-0 z-[90] bg-espresso/35 flex justify-end" onClick={()=>setSelected(null)}><aside className="h-full w-full max-w-[430px] bg-[#FBF8F3] p-6 overflow-y-auto" onClick={e=>e.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-[8px] uppercase tracking-[0.2em] text-mocha">Cita</p><h2 className="mt-2 font-serif text-[36px] leading-none">{selected.client_name}</h2><span className="mt-3 inline-flex rounded-full bg-[#DCE7D7] px-3 py-1.5 text-[8px] uppercase tracking-[0.1em] text-[#496047]">{statusLabels[selected.status]||selected.status}</span></div><button onClick={()=>setSelected(null)} className="grid h-10 w-10 place-items-center rounded-full border border-champagne/35"><X size={19}/></button></div><div className="mt-7 rounded-[20px] border border-champagne/30 bg-white/65 p-5 space-y-4"><Row icon={<CalendarDays size={16}/>} label="Fecha" value={new Date(selected.start_at).toLocaleDateString("es-US",{weekday:"long",month:"short",day:"numeric",timeZone:"America/New_York"})}/><Row icon={<Clock3 size={16}/>} label="Hora" value={`${fmtTime(selected.start_at)} – ${fmtTime(selected.end_at)}`}/><Row icon={<UserRound size={16}/>} label="Profesional" value={selected.staff_name||"Equipo"}/><div className="border-t border-champagne/25 pt-4"><p className="text-[9px] uppercase tracking-[0.16em] text-taupe">Servicio</p><p className="mt-2 font-serif text-[25px]">{selected.service_name||"Cita"}</p></div></div><Link href={isAdmin?"/hub/appointments":"/hub/my-agenda"} className="mt-5 flex items-center justify-center rounded-full bg-[#4A352B] px-5 py-3.5 text-[9px] uppercase tracking-[0.13em] text-ivory">{isAdmin?"Gestionar cita":"Ir a mis citas"}</Link></aside></div>}
  </div>
}

function MobileAppointment({a,onOpen}:{a:Appointment;onOpen:()=>void}){return <button onClick={onOpen} className="w-full rounded-[20px] border border-champagne/30 bg-white/70 p-4 text-left shadow-[0_6px_20px_rgba(52,38,31,.04)]"><div className="flex gap-4"><div className="w-[58px] shrink-0"><p className="font-serif text-[20px] text-mocha">{fmtTime(a.start_at)}</p><p className="mt-1 text-[8px] text-taupe">{minutes(a)} min</p></div><div className="min-w-0 flex-1 border-l border-champagne/30 pl-4"><div className="flex items-start justify-between gap-2"><div><p className="font-serif text-[23px] leading-none truncate">{a.client_name}</p><p className="mt-2 text-[10px] text-mocha">{a.service_name||"Cita"}</p><p className="mt-1 text-[9px] text-taupe">con {a.staff_name||"Equipo"}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-[7px] uppercase tracking-[0.08em] ${a.status==="pending"?"bg-[#F5E2CE] text-[#835C39]":"bg-[#DCE7D7] text-[#496047]"}`}>{statusLabels[a.status]||a.status}</span></div></div></div></button>}
function PositionedAppointment({a,onOpen}:{a:Appointment;onOpen:()=>void}){const start=nyMinutes(a.start_at);const end=nyMinutes(a.end_at);const top=Math.max(0,(start-540)/60*72);const height=Math.max(48,(end-start)/60*72-6);return <button onClick={onOpen} className="absolute left-2 right-2 rounded-[12px] border border-[#D8BFB2] bg-[#F2DDD6] p-2.5 text-left overflow-hidden shadow-[0_4px_12px_rgba(90,60,48,.08)] hover:-translate-y-0.5 transition-transform" style={{top,height}}><p className="text-[8px] text-mocha">{fmtTime(a.start_at)} – {fmtTime(a.end_at)}</p><p className="mt-1 font-serif text-[17px] leading-none truncate">{a.client_name}</p><p className="mt-1 text-[8px] text-taupe truncate">{a.service_name||"Cita"}</p><span className="mt-2 inline-flex rounded-full bg-white/60 px-2 py-1 text-[7px] text-[#496047]">{statusLabels[a.status]||a.status}</span></button>}
function MonthView({days,appointments,selectedDate,onSelect,onOpen}:{days:Date[];appointments:Appointment[];selectedDate:Date;onSelect:(d:Date)=>void;onOpen:(a:Appointment)=>void}){return <div className="mt-5 grid grid-cols-7 overflow-hidden rounded-[22px] border border-champagne/30 bg-white/60">{["L","M","M","J","V","S","D"].map((x,i)=><div key={i} className="border-b border-champagne/25 py-2 text-center text-[8px] text-taupe">{x}</div>)}{days.map(d=>{const list=appointments.filter(a=>sameDayNY(a.start_at,d));const sameMonth=d.getMonth()===selectedDate.getMonth();return <button key={d.toISOString()} onClick={()=>{onSelect(startOfDay(d))}} className={`min-h-[86px] border-r border-b border-champagne/20 p-2 text-left ${sameMonth?"":"opacity-35"}`}><span className={`grid h-7 w-7 place-items-center rounded-full text-[9px] ${sameDate(d,selectedDate)?"bg-[#4A352B] text-ivory":""}`}>{d.getDate()}</span><div className="mt-1 space-y-1">{list.slice(0,2).map(a=><span key={a.id} onClick={e=>{e.stopPropagation();onOpen(a)}} className="block rounded bg-blush/45 px-1.5 py-1 text-[7px] truncate">{fmtTime(a.start_at)} {a.client_name}</span>)}{list.length>2&&<span className="text-[7px] text-mocha">+{list.length-2}</span>}</div></button>})}</div>}
function EmptyDay(){return <div className="rounded-[22px] border border-dashed border-champagne/40 bg-white/45 p-8 text-center"><CalendarDays size={24} className="mx-auto text-champagne"/><p className="mt-4 font-serif text-[27px]">Agenda libre.</p><p className="mt-2 text-[11px] text-taupe">No hay citas para este día.</p></div>}
function Row({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){return <div className="flex items-start gap-3"><span className="mt-0.5 text-mocha">{icon}</span><div><p className="text-[8px] uppercase tracking-[0.14em] text-taupe">{label}</p><p className="mt-1 text-[12px] capitalize">{value}</p></div></div>}
function startOfDay(d:Date){const x=new Date(d);x.setHours(0,0,0,0);return x}
function weekDays(d:Date){const x=startOfDay(d);const dow=x.getDay();x.setDate(x.getDate()+(dow===0?-6:1-dow));return Array.from({length:6},(_,i)=>{const y=new Date(x);y.setDate(x.getDate()+i);return y})}
function monthGrid(d:Date){const first=new Date(d.getFullYear(),d.getMonth(),1);const dow=first.getDay();const start=new Date(first);start.setDate(first.getDate()+(dow===0?-6:1-dow));return Array.from({length:42},(_,i)=>{const x=new Date(start);x.setDate(start.getDate()+i);return x})}
function shiftDate(d:Date,view:View,n:number,setter:(d:Date)=>void){const x=new Date(d);if(view==="month")x.setMonth(x.getMonth()+n);else if(view==="week")x.setDate(x.getDate()+7*n);else x.setDate(x.getDate()+n);setter(startOfDay(x))}
function headerDate(d:Date,view:View){if(view==="month")return d.toLocaleDateString("es-US",{month:"long",year:"numeric"});if(view==="week"){const w=weekDays(d);return `${w[0].toLocaleDateString("es-US",{month:"short",day:"numeric"})} – ${w[5].toLocaleDateString("es-US",{month:"short",day:"numeric"})}`;}return d.toLocaleDateString("es-US",{weekday:"long",month:"short",day:"numeric"})}
function sameDate(a:Date,b:Date){return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate()}
function sameDayNY(v:string,d:Date){const parts=new Intl.DateTimeFormat("en-CA",{timeZone:"America/New_York",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(new Date(v));const y=Number(parts.find(x=>x.type==="year")?.value);const m=Number(parts.find(x=>x.type==="month")?.value)-1;const day=Number(parts.find(x=>x.type==="day")?.value);return y===d.getFullYear()&&m===d.getMonth()&&day===d.getDate()}
function nyMinutes(v:string){const parts=new Intl.DateTimeFormat("en-US",{timeZone:"America/New_York",hour12:false,hour:"2-digit",minute:"2-digit"}).formatToParts(new Date(v));return Number(parts.find(x=>x.type==="hour")?.value)*60+Number(parts.find(x=>x.type==="minute")?.value)}
function sortTime(a:Appointment,b:Appointment){return +new Date(a.start_at)-+new Date(b.start_at)}
function fmtTime(v:string){return new Date(v).toLocaleTimeString("es-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}
function minutes(a:Appointment){return Math.max(0,Math.round((+new Date(a.end_at)-+new Date(a.start_at))/60000))}
function formatHour(h:number){return new Date(2020,0,1,h).toLocaleTimeString("en-US",{hour:"numeric"})}
