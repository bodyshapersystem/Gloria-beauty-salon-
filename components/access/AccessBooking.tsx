"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Check, ChevronLeft, Loader2 } from "lucide-react";
import { useAccess } from "@/components/access/AccessShell";
import { supabase } from "@/lib/supabase/client";

type Service={id:string;category:string;name:string;duration_minutes:number;price_label:string};
type Staff={id:string;name:string;role:string;photo_url:string|null};
type Slot={slot_start:string;staff_id:string;staff_name:string};

const labels:Record<string,string>={hair:"Hair",nails:"Nails",brows:"Brows",lashes:"Lashes",tanning:"Tanning",makeup:"Makeup"};

export function AccessBooking(){
  const {profile}=useAccess(); const params=useSearchParams();
  const [step,setStep]=useState(1); const [services,setServices]=useState<Service[]>([]); const [service,setService]=useState<Service|null>(null);
  const [staff,setStaff]=useState<Staff[]>([]); const [staffOption,setStaffOption]=useState<Staff|"any"|null>(null);
  const [date,setDate]=useState(()=>new Date().toISOString().slice(0,10)); const [slots,setSlots]=useState<Slot[]>([]); const [slot,setSlot]=useState<Slot|null>(null);
  const [loading,setLoading]=useState(true); const [busy,setBusy]=useState(false); const [message,setMessage]=useState<string|null>(null); const [confirmedId,setConfirmedId]=useState<string|null>(null);

  useEffect(()=>{(async()=>{const {data}=await supabase.from("services").select("id,category,name,duration_minutes,price_label").eq("active",true).order("category").order("name");const list=(data as Service[])||[];setServices(list);const serviceParam=params.get("service");if(serviceParam){const hit=list.find(x=>x.id===serviceParam);if(hit){setService(hit);setStep(2)}}setLoading(false)})()},[]);
  useEffect(()=>{if(!service)return;(async()=>{const {data}=await supabase.from("staff_services").select("staff:staff_id(id,name,role,photo_url)").eq("service_id",service.id);const list=((data as any[])||[]).map(x=>x.staff).filter(Boolean) as Staff[];setStaff(list);const staffParam=params.get("staff");if(staffParam){const hit=list.find(x=>x.id===staffParam);if(hit){setStaffOption(hit);setStep(3)}}})()},[service?.id]);
  useEffect(()=>{if(!service||!staffOption||!date)return;setBusy(true);setSlots([]);setSlot(null);(async()=>{if(staffOption==="any"){const {data}=await supabase.rpc("get_first_available_slots",{p_service_id:service.id,p_date:date});setSlots(((data||[]) as any[]).map(x=>({slot_start:x.slot_start,staff_id:x.staff_id,staff_name:x.staff_name})))}else{const {data}=await supabase.rpc("get_available_slots",{p_staff_id:staffOption.id,p_service_id:service.id,p_date:date});setSlots(((data||[]) as any[]).map(x=>({slot_start:x.slot_start,staff_id:staffOption.id,staff_name:staffOption.name}))) }setBusy(false)})()},[service?.id,staffOption,date]);

  const grouped=useMemo(()=>{const m=new Map<string,Service[]>();services.forEach(s=>{if(!m.has(s.category))m.set(s.category,[]);m.get(s.category)!.push(s)});return Array.from(m.entries())},[services]);

  async function confirm(){if(!profile||!service||!slot)return;setBusy(true);setMessage(null);const {data,error}=await supabase.rpc("create_public_appointment",{p_service_id:service.id,p_staff_id:slot.staff_id,p_start_at:slot.slot_start,p_client_name:`${profile.first_name} ${profile.last_name}`.trim(),p_client_phone:profile.phone||profile.whatsapp||"",p_client_email:profile.email||null,p_notes_client:params.get("memory")?"I'd like my last look again.":null,p_source:"gloria_access"});setBusy(false);if(error){setMessage("Ese horario ya no está disponible. Elige otro.");setStep(3);setSlot(null);return;}setConfirmedId(data as string)}

  if(!profile)return null;
  if(confirmedId&&service&&slot)return <div className="max-w-[620px] mx-auto text-center py-10"><div className="mx-auto h-14 w-14 rounded-full bg-espresso text-ivory flex items-center justify-center"><Check size={25}/></div><p className="mt-6 text-[10px] uppercase tracking-[0.24em] text-mocha">Gloria Access</p><h1 className="mt-2 font-serif text-[42px] leading-none">Tu cita está confirmada ✨</h1><p className="mt-4 text-[13px] leading-relaxed text-taupe">{service.name} con {slot.staff_name}<br/>{formatDate(slot.slot_start)} · {formatTime(slot.slot_start)}</p><div className="mt-7 flex justify-center gap-2"><a href={`/access/appointments/${confirmedId}`} className="rounded-full bg-espresso px-5 py-3 text-[9px] uppercase tracking-[0.14em] text-ivory">View appointment</a><a href="https://maps.google.com/?q=1130+SW+8th+St+Miami+FL+33130" target="_blank" rel="noreferrer" className="rounded-full border border-mocha/30 px-5 py-3 text-[9px] uppercase tracking-[0.14em] text-mocha">Directions</a></div></div>;

  return <div className="max-w-[760px] mx-auto"><p className="text-[10px] uppercase tracking-[0.28em] text-mocha">Gloria Access · Book</p><h1 className="mt-2 font-serif text-[44px] md:text-[54px] leading-none">Reserva tu próxima cita.</h1><p className="mt-3 text-[13px] text-taupe">Tu información ya está guardada. Solo elige lo que quieres reservar.</p>
    <div className="mt-8 flex flex-wrap gap-2 text-[9px] uppercase tracking-[0.13em] text-taupe">{["Service","Professional","Date & Time","Review"].map((x,i)=><span key={x} className={step===i+1?"text-espresso font-semibold":""}>{i+1}. {x}</span>)}</div>
    {message&&<p className="mt-5 text-[12px] text-red-700">{message}</p>}
    {loading?<div className="py-16 flex justify-center text-taupe"><Loader2 className="animate-spin"/></div>:<div className="mt-8">
      {step===1&&grouped.map(([cat,list])=><section key={cat} className="mb-8"><p className="text-[9px] uppercase tracking-[0.2em] text-mocha mb-3">{labels[cat]||cat}</p><div className="divide-y divide-champagne/25 border-y border-champagne/25">{list.map(s=><button key={s.id} onClick={()=>{setService(s);setStep(2)}} className="w-full flex items-center justify-between gap-4 py-4 text-left"><div><p className="text-[14px]">{s.name}</p><p className="text-[11px] text-taupe mt-1">{duration(s.duration_minutes)}</p></div><p className="font-serif italic text-[17px] text-mocha">{s.price_label}</p></button>)}</div></section>)}
      {step===2&&service&&<><Back onClick={()=>setStep(1)}>Change service</Back><p className="text-[13px] text-mocha mb-5">{service.name} · {duration(service.duration_minutes)}</p><div className="grid grid-cols-2 md:grid-cols-3 gap-3"><button onClick={()=>{setStaffOption("any");setStep(3)}} className="rounded-[20px] border border-champagne/30 bg-white/40 p-5 text-left"><p className="font-serif text-[25px]">Primera disponible</p><p className="mt-2 text-[11px] text-taupe">El horario compatible más próximo.</p></button>{staff.map(s=><button key={s.id} onClick={()=>{setStaffOption(s);setStep(3)}} className="rounded-[20px] border border-champagne/30 bg-white/40 p-5 text-left"><p className="font-serif text-[25px]">{s.name}</p><p className="mt-2 text-[11px] text-taupe">{s.role}</p></button>)}</div></>}
      {step===3&&service&&staffOption&&<><Back onClick={()=>setStep(2)}>Change professional</Back><label className="block max-w-[240px]"><span className="text-[9px] uppercase tracking-[0.16em] text-taupe">Date</span><input type="date" min={new Date().toISOString().slice(0,10)} value={date} onChange={e=>setDate(e.target.value)} className="mt-2 w-full rounded-xl border border-taupe/25 bg-white/45 px-3 py-3 text-[12px]"/></label><div className="mt-5">{busy?<Loader2 className="animate-spin text-taupe"/>:slots.length===0?<p className="text-[12px] text-taupe">No hay horarios disponibles ese día.</p>:<div className="grid grid-cols-3 md:grid-cols-4 gap-2">{slots.map(s=><button key={`${s.staff_id}-${s.slot_start}`} onClick={()=>{setSlot(s);setStep(4)}} className="rounded-xl border border-champagne/30 bg-white/45 py-3 text-[12px]">{formatTime(s.slot_start)}</button>)}</div>}</div></>}
      {step===4&&service&&slot&&<><Back onClick={()=>setStep(3)}>Change time</Back><div className="rounded-[28px] border border-champagne/30 bg-gradient-to-br from-white/60 to-blush/25 p-7"><p className="text-[9px] uppercase tracking-[0.2em] text-mocha">Review</p><h2 className="mt-3 font-serif text-[34px]">{service.name}</h2><div className="mt-5 space-y-2 text-[12px]"><Row l="Professional" v={slot.staff_name}/><Row l="Date" v={formatDate(slot.slot_start)}/><Row l="Time" v={formatTime(slot.slot_start)}/><Row l="Duration" v={duration(service.duration_minutes)}/><Row l="Price" v={service.price_label}/><Row l="Location" v="1130 SW 8th St, Miami"/></div><button disabled={busy} onClick={confirm} className="mt-7 rounded-full bg-espresso px-6 py-3 text-[10px] uppercase tracking-[0.15em] text-ivory disabled:opacity-50">{busy?"Confirming...":"Confirm appointment"}</button></div></>}
    </div>}
  </div>
}

function Back({children,onClick}:{children:React.ReactNode;onClick:()=>void}){return <button onClick={onClick} className="mb-5 inline-flex items-center gap-1 text-[11px] text-taupe"><ChevronLeft size={14}/>{children}</button>}
function Row({l,v}:{l:string;v:string}){return <div className="flex justify-between gap-4"><span className="text-taupe">{l}</span><span className="text-right">{v}</span></div>}
function duration(m:number){const h=Math.floor(m/60),r=m%60;return h?(r?`${h}h ${r}min`:`${h}h`):`${m} min`}
function formatDate(v:string){return new Date(v).toLocaleDateString("es-US",{weekday:"long",month:"long",day:"numeric",year:"numeric",timeZone:"America/New_York"})}
function formatTime(v:string){return new Date(v).toLocaleTimeString("es-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}
