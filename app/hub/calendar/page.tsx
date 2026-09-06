"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Appointment={id:string;client_name:string;start_at:string;end_at:string;status:string;service:{name:string}|null;staff:{id:string;name:string}|null;service_id:string;staff_id:string};
type Staff={id:string;name:string};
type Service={id:string;name:string;duration_minutes:number};

type View="day"|"week"|"month";

export default function HubCalendarPage(){
  const params=useSearchParams();
  const rescheduleId=params.get("appointment");
  const [view,setView]=useState<View>("week");
  const [anchor,setAnchor]=useState(new Date());
  const [appointments,setAppointments]=useState<Appointment[]>([]);
  const [staff,setStaff]=useState<Staff[]>([]);
  const [services,setServices]=useState<Service[]>([]);
  const [selected,setSelected]=useState<Appointment|null>(null);
  const [slotModal,setSlotModal]=useState<{staffId:string;date:string;time:string}|null>(null);
  const [form,setForm]=useState({client_name:"",client_phone:"",client_email:"",service_id:"",staff_id:"",date:"",time:"",notes:""});
  const [slots,setSlots]=useState<string[]>([]); const [loadingSlots,setLoadingSlots]=useState(false); const [message,setMessage]=useState<string|null>(null);

  async function load(){
    const [{data:a},{data:s},{data:sv}]=await Promise.all([
      supabase.from("appointments").select("id,client_name,start_at,end_at,status,service_id,staff_id,service:service_id(name),staff:staff_id(id,name)").neq("status","cancelled").order("start_at"),
      supabase.from("staff").select("id,name").eq("active",true).order("name"),
      supabase.from("services").select("id,name,duration_minutes").eq("active",true).order("name"),
    ]);
    const items=(a as Appointment[])||[]; setAppointments(items); setStaff((s as Staff[])||[]); setServices((sv as Service[])||[]);
    if(rescheduleId){const found=items.find(x=>x.id===rescheduleId)||null;setSelected(found);if(found)setForm(v=>({...v,service_id:found.service_id,staff_id:found.staff_id,date:localDate(found.start_at),time:localTimeInput(found.start_at)}));}
  }
  useEffect(()=>{load()},[]);

  const range=useMemo(()=>getRange(anchor,view),[anchor,view]);
  const visible=useMemo(()=>appointments.filter(a=>{const d=new Date(a.start_at);return d>=range.start&&d<range.end}),[appointments,range]);
  const days=useMemo(()=>daysBetween(range.start,range.end),[range]);

  useEffect(()=>{
    if(!form.service_id||!form.staff_id||!form.date)return;
    setLoadingSlots(true); setSlots([]);
    (async()=>{const {data}=await supabase.rpc("get_available_slots",{p_staff_id:form.staff_id,p_service_id:form.service_id,p_date:form.date});setSlots(((data||[]) as {slot_start:string}[]).map(x=>x.slot_start));setLoadingSlots(false)})();
  },[form.service_id,form.staff_id,form.date]);

  async function createAppointment(){
    setMessage(null);
    if(!form.client_name||!form.client_phone||!form.service_id||!form.staff_id||!form.date||!form.time){setMessage("Complete the required fields.");return;}
    const matching=slots.find(s=>localTimeInput(s)===form.time);
    if(!matching){setMessage("That time is no longer available.");return;}
    const service=services.find(s=>s.id===form.service_id)!;
    const {error}=await supabase.from("appointments").insert({staff_id:form.staff_id,service_id:form.service_id,client_name:form.client_name,client_phone:form.client_phone,client_email:form.client_email||null,start_at:matching,end_at:new Date(new Date(matching).getTime()+service.duration_minutes*60000).toISOString(),booking_duration:service.duration_minutes,status:"confirmed",notes_internal:form.notes||null,source:"gloria_hub"});
    if(error){setMessage(error.message);return;} setSlotModal(null);setForm({client_name:"",client_phone:"",client_email:"",service_id:"",staff_id:"",date:"",time:"",notes:""});await load();
  }

  async function reschedule(){
    if(!selected||!form.staff_id||!form.date||!form.time)return;
    const matching=slots.find(s=>localTimeInput(s)===form.time);
    if(!matching){setMessage("Choose an available time.");return;}
    const {error}=await supabase.rpc("hub_reschedule_appointment",{p_appointment_id:selected.id,p_staff_id:form.staff_id,p_start_at:matching});
    if(error){setMessage(error.message);return;} setSelected(null);setMessage(null);await load();
  }

  return <div>
    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5"><div><p className="text-[10px] uppercase tracking-[0.28em] text-mocha">Gloria Hub</p><h1 className="mt-2 font-serif text-[46px] md:text-[58px] leading-none">Calendar</h1><p className="mt-3 text-[13px] text-taupe">See the salon rhythm at a glance.</p></div><button onClick={()=>setSlotModal({staffId:staff[0]?.id||"",date:todayInput(),time:"09:00"})} className="inline-flex items-center gap-2 rounded-full bg-espresso px-5 py-3 text-[10px] uppercase tracking-[0.14em] text-ivory"><Plus size={15}/> Nueva Cita</button></div>

    <div className="mt-7 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><button onClick={()=>setAnchor(moveAnchor(anchor,view,-1))} className="h-10 w-10 rounded-full border border-champagne/35 flex items-center justify-center"><ChevronLeft size={17}/></button><button onClick={()=>setAnchor(new Date())} className="rounded-full border border-champagne/35 px-4 py-2.5 text-[9px] uppercase tracking-[0.13em]">Today</button><button onClick={()=>setAnchor(moveAnchor(anchor,view,1))} className="h-10 w-10 rounded-full border border-champagne/35 flex items-center justify-center"><ChevronRight size={17}/></button><p className="ml-2 font-serif text-[25px]">{rangeLabel(range.start,view)}</p></div><div className="flex rounded-full border border-champagne/35 p-1">{(["day","week","month"] as View[]).map(v=><button key={v} onClick={()=>setView(v)} className={`rounded-full px-4 py-2 text-[9px] uppercase tracking-[0.12em] ${view===v?"bg-espresso text-ivory":"text-taupe"}`}>{v}</button>)}</div></div>

    <div className="mt-6 hidden md:block overflow-x-auto rounded-[24px] border border-champagne/30 bg-white/35">
      {view!=="month"?<div className="min-w-[950px]"><div className="grid" style={{gridTemplateColumns:`90px repeat(${staff.length}, minmax(160px,1fr))`}}><div className="border-b border-r border-champagne/25 p-3 text-[9px] uppercase text-taupe">Time</div>{staff.map(s=><div key={s.id} className="border-b border-r last:border-r-0 border-champagne/25 p-3 text-center"><p className="font-serif text-[22px]">{s.name}</p></div>)}</div>{hours().map(h=><div key={h} className="grid min-h-[82px]" style={{gridTemplateColumns:`90px repeat(${staff.length}, minmax(160px,1fr))`}}><div className="border-r border-b border-champagne/20 p-3 text-[10px] text-taupe">{hourLabel(h)}</div>{staff.map(s=><div key={s.id} onClick={()=>{const d=view==="day"?days[0]:days[0];setSlotModal({staffId:s.id,date:dateInput(d),time:`${String(h).padStart(2,"0")}:00`});setForm(v=>({...v,staff_id:s.id,date:dateInput(d),time:`${String(h).padStart(2,"0")}:00`}))}} className="relative border-r last:border-r-0 border-b border-champagne/20 p-1 cursor-pointer hover:bg-blush/20">{visible.filter(a=>a.staff_id===s.id&&new Date(a.start_at).getHours()===h&&(view==="day"?sameDay(new Date(a.start_at),days[0]):sameDay(new Date(a.start_at),days[0]))).map(a=><EventCard key={a.id} a={a} onClick={(e)=>{e.stopPropagation();setSelected(a);setForm(v=>({...v,service_id:a.service_id,staff_id:a.staff_id,date:localDate(a.start_at),time:localTimeInput(a.start_at)}))}}/>)}</div>)}</div>)}</div>:<MonthGrid days={days} appointments={visible} onPick={(d)=>{setView("day");setAnchor(d)}}/>}
    </div>

    <div className="md:hidden mt-6 space-y-5">{days.slice(0,view==="month"?31:7).map(d=>{const dayItems=visible.filter(a=>sameDay(new Date(a.start_at),d));return <section key={d.toISOString()}><div className="flex items-center justify-between"><div><p className="text-[9px] uppercase tracking-[0.18em] text-mocha">{d.toLocaleDateString("en-US",{weekday:"long",timeZone:"America/New_York"})}</p><h2 className="font-serif text-[28px]">{d.toLocaleDateString("en-US",{month:"short",day:"numeric",timeZone:"America/New_York"})}</h2></div><button onClick={()=>{setSlotModal({staffId:staff[0]?.id||"",date:dateInput(d),time:"09:00"});setForm(v=>({...v,date:dateInput(d),staff_id:staff[0]?.id||""}))}} className="text-[9px] uppercase tracking-[0.12em] text-mocha">+ Add</button></div><div className="mt-3 space-y-2">{dayItems.length?dayItems.map(a=><button key={a.id} onClick={()=>{setSelected(a);setForm(v=>({...v,service_id:a.service_id,staff_id:a.staff_id,date:localDate(a.start_at),time:localTimeInput(a.start_at)}))}} className="w-full rounded-[18px] border border-champagne/30 bg-white/45 p-4 text-left"><p className="text-[10px] text-taupe">{formatTime(a.start_at)} · {a.staff?.name}</p><p className="mt-1 font-serif text-[24px]">{a.client_name}</p><p className="mt-1 text-[11px] text-mocha">{a.service?.name} · {human(a.status)}</p></button>):<p className="text-[12px] text-taupe">No appointments.</p>}</div></section>})}</div>

    {(slotModal||selected)&&<div className="fixed inset-0 z-[90] bg-espresso/35 flex items-end md:items-center justify-center p-0 md:p-6" onClick={()=>{setSlotModal(null);setSelected(null)}}><div className="w-full md:max-w-[560px] rounded-t-[28px] md:rounded-[28px] bg-ivory p-6 md:p-8 max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}><p className="text-[9px] uppercase tracking-[0.22em] text-mocha">{selected?"Reschedule Appointment":"New Appointment"}</p><h2 className="mt-2 font-serif text-[36px] leading-none">{selected?selected.client_name:"Create a booking"}</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{!selected&&<><Field label="Client name" value={form.client_name} onChange={v=>setForm(x=>({...x,client_name:v}))}/><Field label="Phone" value={form.client_phone} onChange={v=>setForm(x=>({...x,client_phone:v}))}/><Field label="Email" value={form.client_email} onChange={v=>setForm(x=>({...x,client_email:v}))}/></>}<Select label="Service" value={form.service_id} onChange={v=>setForm(x=>({...x,service_id:v,time:""}))} options={[["","Select service"],...services.map(s=>[s.id,s.name])]}/><Select label="Professional" value={form.staff_id} onChange={v=>setForm(x=>({...x,staff_id:v,time:""}))} options={[["","Select professional"],...staff.map(s=>[s.id,s.name])]}/><Field label="Date" type="date" value={form.date} onChange={v=>setForm(x=>({...x,date:v,time:""}))}/><Select label="Available time" value={form.time} onChange={v=>setForm(x=>({...x,time:v}))} options={[["",loadingSlots?"Loading...":"Select time"],...slots.map(s=>[localTimeInput(s),formatTime(s)])]}/>{!selected&&<div className="sm:col-span-2"><Field label="Internal notes" value={form.notes} onChange={v=>setForm(x=>({...x,notes:v}))}/></div>}</div>{message&&<p className="mt-4 text-[12px] text-red-700">{message}</p>}<div className="mt-6 flex gap-2"><button onClick={selected?reschedule:createAppointment} className="rounded-full bg-espresso px-5 py-3 text-[9px] uppercase tracking-[0.14em] text-ivory">{selected?"Confirm Reschedule":"Confirm Appointment"}</button><button onClick={()=>{setSlotModal(null);setSelected(null)}} className="rounded-full border border-mocha/30 px-5 py-3 text-[9px] uppercase tracking-[0.14em] text-mocha">Cancel</button></div></div></div>}
  </div>
}

function EventCard({a,onClick}:{a:Appointment;onClick:(e:React.MouseEvent)=>void}){return <button onClick={onClick} className="w-full rounded-[10px] border border-champagne/35 bg-blush/35 p-2 text-left"><p className="text-[9px] text-taupe">{formatTime(a.start_at)}</p><p className="mt-1 text-[11px] font-medium truncate">{a.client_name}</p><p className="text-[9px] text-mocha truncate">{a.service?.name}</p></button>}
function MonthGrid({days,appointments,onPick}:{days:Date[];appointments:Appointment[];onPick:(d:Date)=>void}){return <div className="grid grid-cols-7 min-w-[800px]">{days.map(d=>{const items=appointments.filter(a=>sameDay(new Date(a.start_at),d));return <button key={d.toISOString()} onClick={()=>onPick(d)} className="min-h-[130px] border-r border-b border-champagne/20 p-3 text-left hover:bg-blush/20"><p className="text-[10px] text-taupe">{d.getDate()}</p><div className="mt-2 space-y-1">{items.slice(0,3).map(a=><div key={a.id} className="rounded bg-white/60 px-2 py-1 text-[9px] truncate">{formatTime(a.start_at)} {a.client_name}</div>)}{items.length>3&&<p className="text-[9px] text-mocha">+{items.length-3} more</p>}</div></button>})}</div>}
function Field({label,value,onChange,type="text"}:{label:string;value:string;onChange:(v:string)=>void;type?:string}){return <label><span className="mb-2 block text-[9px] uppercase tracking-[0.14em] text-taupe">{label}</span><input type={type} value={value} onChange={e=>onChange(e.target.value)} className="w-full rounded-xl border border-taupe/25 bg-white/50 px-3 py-3 text-[12px] outline-none"/></label>}
function Select({label,value,onChange,options}:{label:string;value:string;onChange:(v:string)=>void;options:string[][]}){return <label><span className="mb-2 block text-[9px] uppercase tracking-[0.14em] text-taupe">{label}</span><select value={value} onChange={e=>onChange(e.target.value)} className="w-full rounded-xl border border-taupe/25 bg-white/50 px-3 py-3 text-[12px] outline-none">{options.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>}
function getRange(anchor:Date,view:View){const d=new Date(anchor);if(view==="day"){const s=startOfDay(d);return{start:s,end:addDays(s,1)}}if(view==="week"){const s=startOfWeek(d);return{start:s,end:addDays(s,7)}}const s=new Date(d.getFullYear(),d.getMonth(),1);return{start:startOfWeek(s),end:addDays(startOfWeek(new Date(d.getFullYear(),d.getMonth()+1,0)),7)}}
function moveAnchor(d:Date,view:View,n:number){const x=new Date(d);if(view==="day")x.setDate(x.getDate()+n);else if(view==="week")x.setDate(x.getDate()+7*n);else x.setMonth(x.getMonth()+n);return x}
function startOfDay(d:Date){return new Date(d.getFullYear(),d.getMonth(),d.getDate())} function startOfWeek(d:Date){const x=startOfDay(d);const day=x.getDay();x.setDate(x.getDate()-day);return x} function addDays(d:Date,n:number){const x=new Date(d);x.setDate(x.getDate()+n);return x} function daysBetween(a:Date,b:Date){const arr:Date[]=[];for(let d=new Date(a);d<b;d=addDays(d,1))arr.push(new Date(d));return arr} function sameDay(a:Date,b:Date){return a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth()&&a.getDate()===b.getDate()} function hours(){return Array.from({length:9},(_,i)=>i+9)} function hourLabel(h:number){return new Date(2000,0,1,h).toLocaleTimeString("en-US",{hour:"numeric"})} function formatTime(v:string){return new Date(v).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})} function localTimeInput(v:string){return new Date(v).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"America/New_York"})} function localDate(v:string){const d=new Date(v);return new Intl.DateTimeFormat("en-CA",{timeZone:"America/New_York",year:"numeric",month:"2-digit",day:"2-digit"}).format(d)} function dateInput(d:Date){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`} function todayInput(){return dateInput(new Date())} function rangeLabel(d:Date,view:View){return view==="month"?d.toLocaleDateString("en-US",{month:"long",year:"numeric"}):d.toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})} function human(v:string){return v.replaceAll("_"," ").replace(/\b\w/g,c=>c.toUpperCase())}
