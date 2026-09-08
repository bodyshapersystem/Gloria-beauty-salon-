"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Check, ChevronLeft, Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Service={id:string;slug:string;category:string;name:string;duration_minutes:number;price_label:string};
type Staff={id:string;slug:string;name:string;role:string;photo_url:string|null};
type Slot={slot_start:string;staff_id:string;staff_name:string};
type Assignment={staff_id:string;service_id:string};

const labels:Record<string,string>={hair:"Hair",nails:"Nails",brows:"Brows + Wax",lashes:"Lashes",tanning:"Tanning",makeup:"Makeup"};

function isInstantService(s:Service){
  const n=s.name.toLowerCase();
  return s.category==="brows" || n.includes("wax") || n.includes("blowdry") || n.includes("secado");
}

export function BookingWidgetV2(){
  const [step,setStep]=useState(1);
  const [services,setServices]=useState<Service[]>([]);
  const [allStaff,setAllStaff]=useState<Staff[]>([]);
  const [assignments,setAssignments]=useState<Assignment[]>([]);
  const [service,setService]=useState<Service|null>(null);
  const [staff,setStaff]=useState<Staff[]>([]);
  const [staffChoice,setStaffChoice]=useState<Staff|"any"|null>(null);
  const [preferredStaffSlug,setPreferredStaffSlug]=useState<string|null>(null);
  const [preferredCategory,setPreferredCategory]=useState<string|null>(null);
  const [date,setDate]=useState(today());
  const [preferredTime,setPreferredTime]=useState("");
  const [slots,setSlots]=useState<Slot[]>([]);
  const [slot,setSlot]=useState<Slot|null>(null);
  const [name,setName]=useState("");
  const [phone,setPhone]=useState("");
  const [email,setEmail]=useState("");
  const [notes,setNotes]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [confirmed,setConfirmed]=useState(false);
  const [inquirySent,setInquirySent]=useState(false);

  useEffect(()=>{(async()=>{
    const [{data:s},{data:t},{data:a}]=await Promise.all([
      supabase.from("services").select("id,slug,category,name,duration_minutes,price_label").eq("active",true).order("category").order("name"),
      supabase.from("staff").select("id,slug,name,role,photo_url").eq("active",true).order("name"),
      supabase.from("staff_services").select("staff_id,service_id")
    ]);
    setServices((s as Service[])||[]);setAllStaff((t as Staff[])||[]);setAssignments((a as Assignment[])||[]);
    if(typeof window!=="undefined"){const params=new URLSearchParams(window.location.search);setPreferredStaffSlug(params.get("staff"));setPreferredCategory(params.get("category"));}
  })()},[]);

  const visibleServices=useMemo(()=>{
    let rows=services;
    if(preferredCategory){
      const cats=preferredCategory.split(",").map(x=>x.trim()).filter(Boolean);
      rows=rows.filter(s=>cats.includes(s.category));
    }
    if(!preferredStaffSlug)return rows;
    const person=allStaff.find(s=>s.slug===preferredStaffSlug);
    if(!person)return rows;
    const ids=new Set(assignments.filter(a=>a.staff_id===person.id).map(a=>a.service_id));
    return rows.filter(s=>ids.has(s.id));
  },[services,allStaff,assignments,preferredStaffSlug,preferredCategory]);

  useEffect(()=>{if(!service)return;const rows=allStaff.filter(s=>assignments.some(a=>a.staff_id===s.id&&a.service_id===service.id));setStaff(rows);const preferred=preferredStaffSlug?rows.find(s=>s.slug===preferredStaffSlug):null;if(preferred)setStaffChoice(preferred)},[service?.id,allStaff,assignments,preferredStaffSlug]);

  useEffect(()=>{if(!service||!staffChoice||!date||!isInstantService(service))return;setLoading(true);setSlots([]);setSlot(null);(async()=>{let rows:Slot[]=[];if(staffChoice==="any"){const {data}=await supabase.rpc("get_first_available_slots",{p_service_id:service.id,p_date:date});rows=((data||[]) as any[]).map(x=>({slot_start:x.slot_start,staff_id:x.staff_id,staff_name:x.staff_name}));}else{const {data}=await supabase.rpc("get_available_slots",{p_staff_id:staffChoice.id,p_service_id:service.id,p_date:date});rows=((data||[]) as any[]).map(x=>({slot_start:x.slot_start,staff_id:staffChoice.id,staff_name:staffChoice.name}));}setSlots(staffChoice==="any"?Array.from(new Map(rows.map(x=>[x.slot_start,x])).values()):rows);setLoading(false)})()},[service?.id,staffChoice,date]);

  const grouped=useMemo(()=>{const m=new Map<string,Service[]>();visibleServices.forEach(s=>{if(!m.has(s.category))m.set(s.category,[]);m.get(s.category)!.push(s)});return Array.from(m.entries())},[visibleServices]);
  const inquiryMode=Boolean(service&&!isInstantService(service));

  async function confirm(){if(!service||!slot||!name.trim()||!phone.trim())return;setLoading(true);setError(null);const {error}=await supabase.rpc("create_public_appointment",{p_service_id:service.id,p_staff_id:slot.staff_id,p_start_at:slot.slot_start,p_client_name:name.trim(),p_client_phone:phone.trim(),p_client_email:email.trim()||null,p_notes_client:notes.trim()||null,p_source:"public_booking"});setLoading(false);if(error){setError("Ese horario ya no está disponible. Elige otro, por favor.");setStep(3);setSlot(null);return;}setConfirmed(true);if(email.trim()){fetch("/api/send-confirmation",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({clientName:name.trim(),clientEmail:email.trim(),serviceId:service.id,staffId:slot.staff_id,startAt:slot.slot_start})}).catch(()=>{})}}

  async function submitInquiry(){if(!service||!name.trim()||!phone.trim())return;setLoading(true);setError(null);const selectedStaff=staffChoice&&staffChoice!=="any"?staffChoice:null;const {error}=await supabase.rpc("submit_public_booking_inquiry",{p_service_id:service.id,p_staff_id:selectedStaff?.id||null,p_client_name:name.trim(),p_client_phone:phone.trim(),p_client_email:email.trim()||null,p_preferred_date:date||null,p_preferred_time:preferredTime.trim()||null,p_notes:notes.trim()||null});setLoading(false);if(error){setError("No pudimos enviar tu solicitud. Inténtalo nuevamente.");return;}setInquirySent(true)}

  if(confirmed&&service&&slot)return <Success title="Tu cita está confirmada ✨"><p className="mt-4 text-[14px] text-mocha">{service.name} con {slot.staff_name}<br/>{fmtDate(slot.slot_start)} · {fmtTime(slot.slot_start)}</p><p className="mt-6 text-[12px] text-taupe">Gloria Beauty Salon · 1130 SW 8th St, Miami</p></Success>;
  if(inquirySent&&service)return <Success title="Recibimos tu solicitud ✨"><p className="mt-4 text-[14px] leading-relaxed text-mocha">Tu solicitud de <strong>{service.name}</strong> fue enviada al team. La especialista revisará disponibilidad y recibirás un email cuando sea aprobada.</p><p className="mt-6 text-[12px] text-taupe">Todavía no está confirmada hasta que el team la apruebe.</p></Success>;

  return <div className="max-w-[720px] mx-auto">
    <div className="mb-7 rounded-[18px] border border-[#DCCFC5] bg-[#F7EFE9] p-4"><div className="flex gap-3"><Sparkles size={17} className="mt-0.5 shrink-0 text-[#7B3C48]"/><p className="text-[11px] leading-relaxed text-mocha"><strong>Reserva inmediata:</strong> secados, cejas y wax. <strong>Otros servicios:</strong> se envían como solicitud y son confirmados por nuestro team según disponibilidad.</p></div></div>
    <div className="flex flex-wrap gap-2 mb-9 text-[10px] uppercase tracking-[0.13em] text-taupe">{["Servicio","Profesional","Fecha","Datos"].map((x,i)=><span key={x} className={step===i+1?"text-espresso font-semibold":step>i+1?"text-mocha":"text-taupe/45"}>{i+1}. {x}{i<3?"  —  ":""}</span>)}</div>

    {step===1&&<div className="space-y-8">{preferredStaffSlug&&<p className="text-[11px] text-taupe">Mostrando servicios disponibles con <strong className="text-mocha">{allStaff.find(s=>s.slug===preferredStaffSlug)?.name||"esta profesional"}</strong>.</p>}{preferredCategory&&<p className="text-[11px] text-taupe">Mostrando la categoría seleccionada. <button onClick={()=>setPreferredCategory(null)} className="font-semibold text-mocha underline underline-offset-2">Ver todos los servicios</button></p>}{grouped.map(([cat,list])=><section key={cat}><p className="mb-3 text-[10px] uppercase tracking-[0.18em] text-mocha">{labels[cat]||cat}</p><div className="border-y border-champagne/30 divide-y divide-champagne/20">{list.map(s=><button key={s.id} onClick={()=>{setService(s);setStaffChoice(null);setStep(2)}} className="w-full flex items-center justify-between gap-4 py-4 text-left hover:bg-blush/25"><div><p className="text-[14px]">{s.name}</p><p className="mt-1 text-[11px] text-taupe">{duration(s.duration_minutes)} · {isInstantService(s)?"Reserva inmediata":"Solicitud sujeta a confirmación"}</p></div><p className="font-serif italic text-[17px] text-mocha">{s.price_label}</p></button>)}</div></section>)}</div>}

    {step===2&&service&&<div><button onClick={()=>setStep(1)} className="flex items-center gap-1 text-[12px] text-taupe"><ChevronLeft size={14}/> Cambiar servicio</button><div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">{!preferredStaffSlug&&<button onClick={()=>{setStaffChoice("any");setStep(3)}} className="border border-champagne/35 p-5 text-center hover:border-mocha"><div className="mx-auto h-16 w-16 rounded-full bg-blush flex items-center justify-center text-[10px] text-mocha">ANY</div><p className="mt-3 text-[13px]">Primera disponible</p></button>}{staff.map(s=><button key={s.id} onClick={()=>{setStaffChoice(s);setStep(3)}} className="border border-champagne/35 p-5 text-center hover:border-mocha"><div className="relative mx-auto h-16 w-16 overflow-hidden rounded-full bg-blush">{s.photo_url&&<Image src={s.photo_url} alt={s.name} fill className="object-cover"/>}</div><p className="mt-3 text-[13px]">{s.name}</p><p className="mt-1 text-[10px] text-taupe">{s.role}</p></button>)}</div></div>}

    {step===3&&service&&staffChoice&&<div><button onClick={()=>setStep(2)} className="flex items-center gap-1 text-[12px] text-taupe"><ChevronLeft size={14}/> Cambiar profesional</button><label className="mt-6 block max-w-[260px]"><span className="block mb-2 text-[9px] uppercase tracking-[0.16em] text-taupe">{inquiryMode?"Fecha preferida":"Fecha"}</span><input type="date" min={today()} value={date} onChange={e=>setDate(e.target.value)} className="w-full border border-champagne/40 bg-ivory px-4 py-3 text-[13px]"/></label>{inquiryMode?<div className="mt-5"><label className="block max-w-[320px]"><span className="block mb-2 text-[9px] uppercase tracking-[0.16em] text-taupe">Hora o rango preferido</span><input value={preferredTime} onChange={e=>setPreferredTime(e.target.value)} placeholder="Ej. 2:00–4:00 PM" className="w-full border border-champagne/40 bg-ivory px-4 py-3 text-[13px]"/></label><button onClick={()=>setStep(4)} className="mt-6 rounded-full bg-espresso px-6 py-3.5 text-[10px] uppercase tracking-[0.16em] text-ivory">Continuar</button></div>:loading?<div className="py-10 flex justify-center text-taupe"><Loader2 className="animate-spin"/></div>:slots.length===0?<p className="py-8 text-[13px] text-taupe">No hay horarios disponibles ese día.</p>:<div className="mt-6 grid grid-cols-3 md:grid-cols-4 gap-2">{slots.map(s=><button key={`${s.staff_id}-${s.slot_start}`} onClick={()=>{setSlot(s);setStep(4)}} className="border border-champagne/35 py-3 text-[12px] hover:bg-blush/30 hover:border-mocha">{fmtTime(s.slot_start)}</button>)}</div>}</div>}

    {step===4&&service&&staffChoice&&<div><button onClick={()=>setStep(3)} className="flex items-center gap-1 text-[12px] text-taupe"><ChevronLeft size={14}/> Cambiar fecha</button><div className="mt-6 rounded-[20px] bg-blush/35 p-5"><p className="font-serif text-[28px]">{service.name}</p><p className="mt-2 text-[13px] text-mocha">{inquiryMode?"Solicitud sujeta a confirmación":`con ${slot?.staff_name||"Team"} · ${slot?fmtDate(slot.slot_start):""} · ${slot?fmtTime(slot.slot_start):""}`}</p><p className="mt-1 text-[11px] text-taupe">{duration(service.duration_minutes)} · {service.price_label}</p></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><Field label="Nombre" value={name} onChange={setName}/><Field label="Teléfono" value={phone} onChange={setPhone}/><Field label="Email" value={email} onChange={setEmail}/><Field label="Notas / detalles" value={notes} onChange={setNotes}/></div>{error&&<p className="mt-4 text-[12px] text-red-700">{error}</p>}<button onClick={inquiryMode?submitInquiry:confirm} disabled={loading||!name.trim()||!phone.trim()||(!inquiryMode&&!slot)} className="mt-6 rounded-full bg-espresso px-6 py-3.5 text-[10px] uppercase tracking-[0.16em] text-ivory disabled:opacity-40">{loading?"Procesando...":inquiryMode?"Enviar solicitud":"Confirmar cita"}</button></div>}
  </div>
}

function Success({title,children}:{title:string;children:React.ReactNode}){return <div className="max-w-[560px] mx-auto text-center py-10"><div className="w-14 h-14 rounded-full bg-espresso text-ivory flex items-center justify-center mx-auto"><Check size={25}/></div><h2 className="mt-6 font-serif text-[38px] leading-none">{title}</h2>{children}</div>}
function Field({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}){return <label><span className="mb-2 block text-[9px] uppercase tracking-[0.14em] text-taupe">{label}</span><input value={value} onChange={e=>onChange(e.target.value)} className="w-full rounded-xl border border-champagne/35 bg-white/40 px-4 py-3 text-[13px] outline-none"/></label>}
function today(){return new Date().toLocaleDateString("en-CA",{timeZone:"America/New_York"})}
function fmtDate(v:string){return new Date(v).toLocaleDateString("es-US",{weekday:"long",day:"numeric",month:"long",timeZone:"America/New_York"})}
function fmtTime(v:string){return new Date(v).toLocaleTimeString("es-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}
function duration(m:number){if(m<60)return `${m} min`;const h=Math.floor(m/60),r=m%60;return r?`${h}h ${r}min`:`${h}h`}
