"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Plus, Sparkles, UserRound, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { NewAppointmentSheet } from "@/components/hub/NewAppointmentSheet";
import { MeTimeSheet, type MeTimeBlock } from "@/components/hub/MeTimeSheet";

type View="day"|"week"|"month";
type Staff={id:string;name:string;photo_url:string|null};
type Appointment={id:string;client_name:string;start_at:string;end_at:string;status:string;service_id:string;staff_id:string;service_name:string|null;staff_name:string|null};
type HubUser={role:"owner"|"admin"|"staff";staff_id:string|null};

const statusLabels:Record<string,string>={pending:"Pendiente",confirmed:"Confirmada",in_progress:"En curso",completed:"Completada",cancelled:"Cancelada",no_show:"No show"};

export default function HubCalendarPage(){
  const router=useRouter();
  const searchParams=useSearchParams();
  const [view,setView]=useState<View>("week");
  const [selectedDate,setSelectedDate]=useState(startOfDay(new Date()));
  const [appointments,setAppointments]=useState<Appointment[]>([]);
  const [blocks,setBlocks]=useState<MeTimeBlock[]>([]);
  const [staff,setStaff]=useState<Staff[]>([]);
  const [user,setUser]=useState<HubUser|null>(null);
  const [selected,setSelected]=useState<Appointment|null>(null);
  const [selectedBlock,setSelectedBlock]=useState<MeTimeBlock|null>(null);
  const [meTimeOpen,setMeTimeOpen]=useState(false);
  const [loading,setLoading]=useState(true);
  const newOpen=searchParams.get("new")==="1";

  async function load(){
    setLoading(true);
    const rangeStart=new Date(selectedDate);rangeStart.setDate(rangeStart.getDate()-40);
    const rangeEnd=new Date(selectedDate);rangeEnd.setDate(rangeEnd.getDate()+40);rangeEnd.setHours(23,59,59,999);
    const {data:{session}}=await supabase.auth.getSession();
    const [{data:u},{data:s},{data:a,error},{data:b}]=await Promise.all([
      session?supabase.from("user_profiles").select("role,staff_id").eq("auth_user_id",session.user.id).eq("active",true).maybeSingle():Promise.resolve({data:null} as any),
      supabase.from("staff").select("id,name,photo_url").eq("active",true).order("name"),
      supabase.rpc("team_calendar_appointments",{p_start:rangeStart.toISOString(),p_end:rangeEnd.toISOString()}),
      supabase.from("staff_blocks").select("id,staff_id,start_at,end_at,reason").gte("start_at",rangeStart.toISOString()).lte("start_at",rangeEnd.toISOString()).order("start_at")
    ]);
    if(!error)setAppointments(((a as unknown) as Appointment[])||[]);
    const staffRows=((s as unknown) as Staff[])||[];
    setStaff(staffRows);
    const staffMap=new Map(staffRows.map(x=>[x.id,x.name]));
    setBlocks((((b as unknown) as MeTimeBlock[])||[]).map(x=>({...x,staff_name:staffMap.get(x.staff_id)||null})));
    setUser((u as HubUser)||null);
    setLoading(false);
  }

  useEffect(()=>{load()},[selectedDate]);

  const canCreate=Boolean(user&&["owner","admin","staff"].includes(user.role));
  const week=useMemo(()=>weekDays(selectedDate),[selectedDate]);
  const dayItems=useMemo(()=>appointments.filter(a=>sameDayNY(a.start_at,selectedDate)).sort((a,b)=>+new Date(a.start_at)-+new Date(b.start_at)),[appointments,selectedDate]);
  const dayBlocks=useMemo(()=>blocks.filter(b=>sameDayNY(b.start_at,selectedDate)).sort((a,b)=>+new Date(a.start_at)-+new Date(b.start_at)),[blocks,selectedDate]);
  const monthDays=useMemo(()=>monthGrid(selectedDate),[selectedDate]);

  function openNewMeTime(){setSelectedBlock(null);setMeTimeOpen(true)}
  function openEditMeTime(b:MeTimeBlock){setSelectedBlock(b);setMeTimeOpen(true)}

  return <div>
    <div className="flex items-start justify-between gap-4">
      <div><p className="text-[9px] uppercase tracking-[0.25em] text-mocha">Agenda del salón</p><h1 className="mt-1 font-serif text-[40px] md:text-[54px] leading-none">Calendario</h1><p className="mt-2 text-[12px] text-taupe">Citas + Me Time, todo el equipo en un solo lugar.</p></div>
      {canCreate&&<div className="hidden sm:flex items-center gap-2"><button onClick={openNewMeTime} className="inline-flex items-center gap-2 rounded-full border border-[#6F3642]/25 bg-[#F2E4DC] px-4 py-3 text-[9px] uppercase tracking-[0.13em] text-[#6F3642]"><Sparkles size={14}/> Me Time</button><Link href="/hub/calendar?new=1" className="inline-flex items-center gap-2 rounded-full bg-[#6F3642] px-4 py-3 text-[9px] uppercase tracking-[0.13em] text-white shadow-sm"><Plus size={14}/> Nueva cita</Link></div>}
    </div>

    <div className="mt-5 rounded-[22px] border border-champagne/30 bg-white/65 p-3 shadow-[0_8px_30px_rgba(52,38,31,.04)]">
      <div className="flex items-center justify-between gap-3">
        <button onClick={()=>shiftDate(selectedDate,view,-1,setSelectedDate)} className="grid h-10 w-10 place-items-center rounded-full border border-champagne/35"><ChevronLeft size={17}/></button>
        <button onClick={()=>setSelectedDate(startOfDay(new Date()))} className="min-w-0 text-center"><p className="font-serif text-[21px] capitalize md:text-[24px]">{headerDate(selectedDate,view)}</p><p className="mt-1 text-[8px] uppercase tracking-[0.16em] text-mocha">Volver a hoy</p></button>
        <button onClick={()=>shiftDate(selectedDate,view,1,setSelectedDate)} className="grid h-10 w-10 place-items-center rounded-full border border-champagne/35"><ChevronRight size={17}/></button>
      </div>
      <div className="mt-3 grid grid-cols-3 rounded-full bg-[#F3ECE5] p-1">{(["day","week","month"] as View[]).map(v=><button key={v} onClick={()=>setView(v)} className={`rounded-full py-2 text-[9px] uppercase tracking-[0.12em] ${view===v?"bg-[#6F3642] text-white shadow-sm":"text-taupe"}`}>{v==="day"?"Día":v==="week"?"Semana":"Mes"}</button>)}</div>
    </div>

    {view==="week"&&<div className="mt-4 grid grid-cols-6 gap-1.5">{week.map(d=>{const active=sameDate(d,selectedDate);const count=appointments.filter(a=>sameDayNY(a.start_at,d)).length+blocks.filter(b=>sameDayNY(b.start_at,d)).length;return <button key={d.toISOString()} onClick={()=>setSelectedDate(d)} className={`rounded-[16px] border px-1 py-2.5 text-center ${active?"border-[#6F3642] bg-[#6F3642] text-white":"border-champagne/30 bg-white/55 text-taupe"}`}><p className="text-[7px] uppercase tracking-[0.12em]">{d.toLocaleDateString("es-US",{weekday:"short"}).replace(".","")}</p><p className="mt-1 font-serif text-[20px] leading-none">{d.getDate()}</p><span className={`mt-2 inline-block h-1.5 w-1.5 rounded-full ${count?active?"bg-white":"bg-mocha":"bg-transparent"}`}/></button>})}</div>}

    {loading?<div className="mt-8 rounded-[22px] border border-champagne/25 bg-white/50 p-8 text-[12px] text-taupe">Organizando la agenda…</div>:view==="month"?<MonthView days={monthDays} appointments={appointments} blocks={blocks} selectedDate={selectedDate} onSelect={setSelectedDate} onOpen={setSelected} onOpenBlock={openEditMeTime}/>:<>
      <div className="mt-5 flex items-center justify-between"><div><p className="text-[8px] uppercase tracking-[0.2em] text-mocha">{dayItems.length} citas · {dayBlocks.length} Me Time</p><h2 className="mt-1 font-serif text-[28px] capitalize">{selectedDate.toLocaleDateString("es-US",{weekday:"long",month:"long",day:"numeric"})}</h2></div>{canCreate&&<div className="flex items-center gap-2"><button onClick={openNewMeTime} className="grid h-12 w-12 place-items-center rounded-full border border-[#6F3642]/25 bg-[#F2E4DC] text-[#6F3642]"><Sparkles size={19}/></button><Link href="/hub/calendar?new=1" className="grid h-12 w-12 place-items-center rounded-full bg-[#6F3642] text-white shadow-[0_8px_20px_rgba(111,54,66,.22)]"><Plus size={21}/></Link></div>}</div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {dayItems.map(a=><AppointmentCard key={a.id} a={a} onOpen={()=>setSelected(a)}/>)}
        {dayBlocks.map(b=><MeTimeCard key={b.id} b={b} onOpen={()=>openEditMeTime(b)}/>)}
        {dayItems.length===0&&dayBlocks.length===0&&<div className="rounded-[22px] border border-dashed border-champagne/40 bg-white/40 p-8"><p className="font-serif text-[27px]">Tu día está libre.</p><p className="mt-2 text-[10px] text-taupe">Agrega una cita o reserva un Me Time.</p></div>}
      </div>

      <div className="mt-6 overflow-x-auto rounded-[24px] border border-champagne/30 bg-white/60"><div className="min-w-[720px] grid" style={{gridTemplateColumns:`repeat(${Math.max(staff.length,1)},minmax(190px,1fr))`}}>{staff.map(s=>{
        const staffAppts=dayItems.filter(a=>a.staff_id===s.id);
        const staffBlocks=dayBlocks.filter(b=>b.staff_id===s.id);
        return <div key={s.id} className="border-r border-champagne/20 p-4 last:border-r-0"><div className="flex items-center gap-2"><div className="grid h-9 w-9 place-items-center rounded-full bg-blush/50 text-mocha"><UserRound size={15}/></div><div><p className="font-serif text-[19px]">{s.name}</p><p className="text-[8px] text-taupe">{staffAppts.length} citas · {staffBlocks.length} blocks</p></div></div><div className="mt-3 space-y-2">{staffAppts.map(a=><button key={a.id} onClick={()=>setSelected(a)} className="w-full rounded-[15px] border border-[#7B3C48]/20 bg-[#F2DDD6] p-3 text-left"><p className="text-[8px] text-mocha">{fmtTime(a.start_at)}</p><p className="mt-1 font-serif text-[18px] truncate">{a.client_name}</p><p className="mt-1 text-[8px] text-taupe truncate">{a.service_name||"Cita"}</p></button>)}{staffBlocks.map(b=><button key={b.id} onClick={()=>openEditMeTime(b)} className="w-full rounded-[15px] border border-[#B99C8A]/35 bg-[#E8DDD4] p-3 text-left"><p className="text-[8px] text-mocha">{fmtTime(b.start_at)} – {fmtTime(b.end_at)}</p><p className="mt-1 font-serif text-[18px] truncate">Me Time</p><p className="mt-1 text-[8px] text-taupe truncate">{b.reason||"Personal"}</p></button>)}</div></div>
      })}</div></div>
    </>}

    <NewAppointmentSheet open={newOpen} onClose={()=>router.replace("/hub/calendar")} onCreated={load}/>
    <MeTimeSheet open={meTimeOpen} onClose={()=>{setMeTimeOpen(false);setSelectedBlock(null)}} onSaved={load} staff={staff} user={user} selectedDate={selectedDate} editing={selectedBlock}/>

    {selected&&<div className="fixed inset-0 z-[90] flex justify-end bg-espresso/35" onClick={()=>setSelected(null)}><aside className="h-full w-full max-w-[430px] overflow-y-auto bg-[#FBF8F3] p-6" onClick={e=>e.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-[8px] uppercase tracking-[0.2em] text-mocha">Cita</p><h2 className="mt-2 font-serif text-[36px] leading-none">{selected.client_name}</h2><span className="mt-3 inline-flex rounded-full bg-[#EAD6D1] px-3 py-1.5 text-[8px] uppercase tracking-[0.1em] text-[#6F3642]">{statusLabels[selected.status]||selected.status}</span></div><button onClick={()=>setSelected(null)} className="grid h-10 w-10 place-items-center rounded-full border border-champagne/35"><X size={19}/></button></div><div className="mt-7 space-y-4 rounded-[20px] border border-champagne/30 bg-white/65 p-5"><Row icon={<CalendarDays size={16}/>} label="Fecha" value={new Date(selected.start_at).toLocaleDateString("es-US",{weekday:"long",month:"short",day:"numeric",timeZone:"America/New_York"})}/><Row icon={<Clock3 size={16}/>} label="Hora" value={`${fmtTime(selected.start_at)} – ${fmtTime(selected.end_at)}`}/><Row icon={<UserRound size={16}/>} label="Profesional" value={selected.staff_name||"Equipo"}/><div className="border-t border-champagne/25 pt-4"><p className="text-[9px] uppercase tracking-[0.16em] text-taupe">Servicio</p><p className="mt-2 font-serif text-[25px]">{selected.service_name||"Cita"}</p></div></div><Link href="/hub/clients" className="mt-5 flex items-center justify-center rounded-full border border-[#6F3642]/25 px-5 py-3.5 text-[9px] uppercase tracking-[0.13em] text-[#6F3642]">Ver clientas</Link></aside></div>}
  </div>
}

function AppointmentCard({a,onOpen}:{a:Appointment;onOpen:()=>void}){return <button onClick={onOpen} className="w-full rounded-[20px] border border-[#7B3C48]/20 bg-[linear-gradient(135deg,#7B3C48,#4B2530)] p-4 text-left text-white shadow-[0_8px_22px_rgba(74,29,36,.10)]"><div className="flex gap-4"><div className="w-[62px] shrink-0"><p className="font-serif text-[20px]">{fmtTime(a.start_at)}</p><p className="mt-1 text-[8px] text-white/60">{minutes(a)} min</p></div><div className="min-w-0 flex-1 border-l border-white/15 pl-4"><p className="font-serif text-[23px] leading-none truncate">{a.client_name}</p><p className="mt-2 text-[10px] text-white/80">{a.service_name||"Cita"}</p><p className="mt-1 text-[9px] text-white/55">con {a.staff_name||"Equipo"}</p></div></div></button>}
function MeTimeCard({b,onOpen}:{b:MeTimeBlock;onOpen:()=>void}){return <button onClick={onOpen} className="w-full rounded-[20px] border border-[#B99C8A]/35 bg-[linear-gradient(135deg,#EEE5DD,#E2D4C9)] p-4 text-left text-[#4A352B] shadow-[0_8px_22px_rgba(74,53,43,.06)]"><div className="flex gap-4"><div className="w-[70px] shrink-0"><p className="font-serif text-[19px]">{fmtTime(b.start_at)}</p><p className="mt-1 text-[8px] text-taupe">{Math.round((+new Date(b.end_at)-+new Date(b.start_at))/60000)} min</p></div><div className="min-w-0 flex-1 border-l border-[#B99C8A]/30 pl-4"><div className="flex items-center gap-2"><Sparkles size={14}/><p className="font-serif text-[23px] leading-none">Me Time</p></div><p className="mt-2 text-[10px] text-mocha">{b.reason||"Espacio personal"}</p><p className="mt-1 text-[9px] text-taupe">{b.staff_name||"Equipo"}</p></div></div></button>}
function MonthView({days,appointments,blocks,selectedDate,onSelect,onOpen,onOpenBlock}:{days:Date[];appointments:Appointment[];blocks:MeTimeBlock[];selectedDate:Date;onSelect:(d:Date)=>void;onOpen:(a:Appointment)=>void;onOpenBlock:(b:MeTimeBlock)=>void}){return <div className="mt-5 grid grid-cols-7 overflow-hidden rounded-[22px] border border-champagne/30 bg-white/60">{["L","M","M","J","V","S","D"].map((x,i)=><div key={i} className="border-b border-champagne/25 py-2 text-center text-[8px] text-taupe">{x}</div>)}{days.map(d=>{const list=appointments.filter(a=>sameDayNY(a.start_at,d));const bList=blocks.filter(b=>sameDayNY(b.start_at,d));const sameMonth=d.getMonth()===selectedDate.getMonth();return <button key={d.toISOString()} onClick={()=>onSelect(startOfDay(d))} className={`min-h-[86px] border-r border-b border-champagne/20 p-2 text-left ${sameMonth?"":"opacity-35"}`}><span className={`grid h-7 w-7 place-items-center rounded-full text-[9px] ${sameDate(d,selectedDate)?"bg-[#6F3642] text-white":""}`}>{d.getDate()}</span><div className="mt-1 space-y-1">{list.slice(0,1).map(a=><span key={a.id} onClick={e=>{e.stopPropagation();onOpen(a)}} className="block truncate rounded bg-blush/50 px-1.5 py-1 text-[7px] text-mocha">{fmtTime(a.start_at)} {a.client_name}</span>)}{bList.slice(0,1).map(b=><span key={b.id} onClick={e=>{e.stopPropagation();onOpenBlock(b)}} className="block truncate rounded bg-[#E8DDD4] px-1.5 py-1 text-[7px] text-mocha">Me Time · {fmtTime(b.start_at)}</span>)}</div></button>})}</div>}
function Row({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){return <div className="flex items-start gap-3"><span className="mt-0.5 text-mocha">{icon}</span><div><p className="text-[8px] uppercase tracking-[0.14em] text-taupe">{label}</p><p className="mt-1 text-[11px] text-mocha">{value}</p></div></div>}
function startOfDay(d:Date){const x=new Date(d);x.setHours(0,0,0,0);return x}
function weekDays(d:Date){const x=startOfDay(d);const day=x.getDay();const delta=day===0?-6:1-day;x.setDate(x.getDate()+delta);return Array.from({length:6},(_,i)=>{const y=new Date(x);y.setDate(x.getDate()+i);return y})}
function monthGrid(d:Date){const first=new Date(d.getFullYear(),d.getMonth(),1);const day=first.getDay();const delta=day===0?-6:1-day;first.setDate(first.getDate()+delta);return Array.from({length:42},(_,i)=>{const x=new Date(first);x.setDate(first.getDate()+i);return x})}
function shiftDate(d:Date,view:View,dir:number,setter:(d:Date)=>void){const x=new Date(d);x.setDate(x.getDate()+dir*(view==="month"?30:view==="week"?7:1));setter(startOfDay(x))}
function sameDate(a:Date,b:Date){return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate()}
function sameDayNY(v:string,d:Date){const p=new Date(v).toLocaleDateString("en-CA",{timeZone:"America/New_York"});return p===d.toLocaleDateString("en-CA")}
function headerDate(d:Date,view:View){return view==="month"?d.toLocaleDateString("es-US",{month:"long",year:"numeric"}):d.toLocaleDateString("es-US",{month:"long",day:"numeric",year:"numeric"})}
function fmtTime(v:string){return new Date(v).toLocaleTimeString("es-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}
function minutes(a:Appointment){return Math.round((+new Date(a.end_at)-+new Date(a.start_at))/60000)}
