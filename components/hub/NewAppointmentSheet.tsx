"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, ChevronRight, Clock3, Search, UserRound, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Client={id:string;first_name:string;last_name:string;email:string|null;phone:string|null};
type Service={id:string;name:string;category:string;duration_minutes:number;price_label:string};
type Staff={id:string;name:string};
type Assignment={staff_id:string;service_id:string};
type Slot={slot_start:string};

export function NewAppointmentSheet({open,onClose,onCreated}:{open:boolean;onClose:()=>void;onCreated:()=>void}){
  const [clients,setClients]=useState<Client[]>([]);
  const [services,setServices]=useState<Service[]>([]);
  const [staff,setStaff]=useState<Staff[]>([]);
  const [assignments,setAssignments]=useState<Assignment[]>([]);
  const [clientId,setClientId]=useState("");
  const [serviceId,setServiceId]=useState("");
  const [staffId,setStaffId]=useState("");
  const [date,setDate]=useState(new Date().toLocaleDateString("en-CA",{timeZone:"America/New_York"}));
  const [slots,setSlots]=useState<Slot[]>([]);
  const [slot,setSlot]=useState("");
  const [notes,setNotes]=useState("");
  const [q,setQ]=useState("");
  const [loading,setLoading]=useState(false);
  const [loadingSlots,setLoadingSlots]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [done,setDone]=useState(false);

  useEffect(()=>{if(!open)return;(async()=>{
    const [{data:c},{data:s},{data:t},{data:a}]=await Promise.all([
      supabase.from("client_profiles").select("id,first_name,last_name,email,phone").order("first_name"),
      supabase.from("services").select("id,name,category,duration_minutes,price_label").eq("active",true).order("category").order("name"),
      supabase.from("staff").select("id,name").eq("active",true).order("name"),
      supabase.from("staff_services").select("staff_id,service_id")
    ]);
    setClients((c as Client[])||[]);setServices((s as Service[])||[]);setStaff((t as Staff[])||[]);setAssignments((a as Assignment[])||[]);
  })()},[open]);

  useEffect(()=>{setStaffId("");setSlot("");setSlots([])},[serviceId]);
  useEffect(()=>{setSlot("");if(!serviceId||!staffId||!date){setSlots([]);return;}(async()=>{
    setLoadingSlots(true);setError(null);
    const {data,error}=await supabase.rpc("get_available_slots",{p_staff_id:staffId,p_service_id:serviceId,p_date:date});
    setLoadingSlots(false);
    if(error){setError(error.message);setSlots([]);return;}
    setSlots(((data as Slot[])||[]));
  })()},[serviceId,staffId,date]);

  const compatibleStaff=useMemo(()=>staff.filter(s=>assignments.some(a=>a.staff_id===s.id&&a.service_id===serviceId)),[staff,assignments,serviceId]);
  const filteredClients=useMemo(()=>{const needle=q.trim().toLowerCase();if(!needle)return clients.slice(0,8);return clients.filter(c=>`${c.first_name} ${c.last_name} ${c.email||""} ${c.phone||""}`.toLowerCase().includes(needle)).slice(0,8)},[clients,q]);
  const client=clients.find(c=>c.id===clientId)||null;
  const service=services.find(s=>s.id===serviceId)||null;
  const professional=staff.find(s=>s.id===staffId)||null;

  async function create(){
    if(!client||!serviceId||!staffId||!slot)return;
    setLoading(true);setError(null);
    const {error}=await supabase.rpc("hub_create_appointment",{
      p_service_id:serviceId,p_staff_id:staffId,p_start_at:slot,
      p_client_name:`${client.first_name} ${client.last_name}`.trim(),
      p_client_phone:client.phone||"",p_client_email:client.email||null,
      p_notes_internal:notes.trim()||null,p_source:"gloria_hub"
    });
    setLoading(false);
    if(error){setError(error.message);return;}
    setDone(true);
    setTimeout(()=>{setDone(false);setClientId("");setServiceId("");setStaffId("");setSlot("");setNotes("");onCreated();onClose()},650);
  }

  if(!open)return null;
  return <div className="fixed inset-0 z-[100] bg-espresso/45 backdrop-blur-[2px] flex justify-end" onClick={onClose}>
    <aside className="h-full w-full max-w-[520px] overflow-y-auto bg-[#FBF8F3] p-5 sm:p-7" onClick={e=>e.stopPropagation()}>
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-[8px] uppercase tracking-[0.22em] text-mocha">Nueva cita</p><h2 className="mt-2 font-serif text-[38px] leading-none">Agenda una experiencia</h2><p className="mt-3 text-[11px] text-taupe">Clienta → servicio → profesional → fecha → hora.</p></div>
        <button onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-champagne/35"><X size={19}/></button>
      </div>

      {done?<div className="mt-10 rounded-[24px] bg-espresso p-8 text-center text-ivory"><Check className="mx-auto text-champagne"/><h3 className="mt-4 font-serif text-[32px]">Cita confirmada</h3></div>:<>
        <Step n="01" title="Clienta">
          {client?<button onClick={()=>setClientId("")} className="w-full rounded-[18px] border border-mocha/20 bg-[#F1E6DE] p-4 text-left"><p className="font-serif text-[23px]">{client.first_name} {client.last_name}</p><p className="mt-1 text-[9px] text-taupe">{client.phone||client.email||"Sin contacto"}</p></button>:<>
            <label className="flex items-center gap-2 rounded-[15px] border border-champagne/35 bg-white/75 px-3.5 py-3"><Search size={15} className="text-mocha"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar clienta" className="w-full bg-transparent text-[12px] outline-none"/></label>
            <div className="mt-2 overflow-hidden rounded-[17px] border border-champagne/25 bg-white/60 divide-y divide-champagne/20">{filteredClients.map(c=><button key={c.id} onClick={()=>setClientId(c.id)} className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-[#F8F0EA]"><div><p className="font-serif text-[19px]">{c.first_name} {c.last_name}</p><p className="mt-1 text-[8px] text-taupe">{c.phone||c.email||"Sin contacto"}</p></div><ChevronRight size={15} className="text-champagne"/></button>)}</div>
          </>}
        </Step>

        <Step n="02" title="Servicio">
          <select value={serviceId} onChange={e=>setServiceId(e.target.value)} className="w-full rounded-[15px] border border-champagne/35 bg-white/75 px-4 py-3.5 text-[12px] outline-none">
            <option value="">Seleccionar servicio</option>{services.map(s=><option key={s.id} value={s.id}>{s.name} · {s.duration_minutes} min · {s.price_label}</option>)}
          </select>
        </Step>

        <Step n="03" title="Profesional">
          {!serviceId?<Hint>Selecciona primero un servicio.</Hint>:<div className="grid grid-cols-2 gap-2">{compatibleStaff.map(s=><button key={s.id} onClick={()=>setStaffId(s.id)} className={`rounded-[17px] border p-4 text-left ${staffId===s.id?"border-mocha/35 bg-[#EFE1D8]":"border-champagne/30 bg-white/65"}`}><UserRound size={16} className="text-mocha"/><p className="mt-3 font-serif text-[20px]">{s.name}</p></button>)}</div>}
        </Step>

        <Step n="04" title="Fecha y hora">
          <div className="grid gap-3">
            <label><span className="mb-1.5 block text-[8px] uppercase tracking-[0.16em] text-taupe">Fecha</span><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full rounded-[15px] border border-champagne/35 bg-white/75 px-4 py-3.5 text-[12px]"/></label>
            {!staffId?<Hint>Selecciona una profesional para ver horarios.</Hint>:loadingSlots?<Hint>Buscando horarios disponibles…</Hint>:slots.length===0?<Hint>No hay horarios disponibles para esa fecha.</Hint>:<div className="grid grid-cols-3 gap-2">{slots.map(s=><button key={s.slot_start} onClick={()=>setSlot(s.slot_start)} className={`rounded-[14px] border px-3 py-3 text-[11px] ${slot===s.slot_start?"border-mocha bg-[#4A352B] text-ivory":"border-champagne/30 bg-white/70 text-mocha"}`}>{fmtTime(s.slot_start)}</button>)}</div>}
          </div>
        </Step>

        <Step n="05" title="Confirmar">
          <div className="rounded-[20px] border border-champagne/30 bg-white/65 p-4 space-y-3">
            <Summary icon={<CalendarDays size={15}/>} label="Servicio" value={service?.name||"—"}/>
            <Summary icon={<UserRound size={15}/>} label="Profesional" value={professional?.name||"—"}/>
            <Summary icon={<Clock3 size={15}/>} label="Horario" value={slot?`${new Date(slot).toLocaleDateString("es-US",{month:"short",day:"numeric",timeZone:"America/New_York"})} · ${fmtTime(slot)}`:"—"}/>
          </div>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} placeholder="Nota interna opcional" className="mt-3 w-full rounded-[15px] border border-champagne/35 bg-white/75 px-4 py-3 text-[11px] outline-none"/>
        </Step>

        {error&&<p className="mt-4 rounded-[15px] bg-red-50 px-4 py-3 text-[10px] text-red-700">{error}</p>}
        <button disabled={loading||!clientId||!serviceId||!staffId||!slot} onClick={create} className="mt-6 w-full rounded-full bg-[#4A352B] px-5 py-4 text-[9px] uppercase tracking-[0.14em] text-ivory disabled:opacity-35">{loading?"Confirmando…":"Confirmar cita"}</button>
      </>}
    </aside>
  </div>
}

function Step({n,title,children}:{n:string;title:string;children:React.ReactNode}){return <section className="mt-6"><div className="mb-3 flex items-center gap-3"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#EAD6D1] text-[8px] text-mocha">{n}</span><p className="font-serif text-[23px]">{title}</p><span className="h-px flex-1 bg-champagne/30"/></div>{children}</section>}
function Hint({children}:{children:React.ReactNode}){return <p className="rounded-[15px] border border-dashed border-champagne/35 bg-white/45 px-4 py-4 text-[10px] text-taupe">{children}</p>}
function Summary({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){return <div className="flex items-center gap-3"><span className="text-mocha">{icon}</span><div><p className="text-[8px] uppercase tracking-[0.14em] text-taupe">{label}</p><p className="mt-1 text-[11px]">{value}</p></div></div>}
function fmtTime(v:string){return new Date(v).toLocaleTimeString("es-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}
