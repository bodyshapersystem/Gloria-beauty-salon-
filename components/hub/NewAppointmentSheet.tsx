"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Check, ChevronRight, Clock3, Pencil, Plus, Search, UserRound, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Client={id:string;first_name:string;last_name:string;email:string|null;phone:string|null};
type Service={id:string;name:string;category:string;duration_minutes:number;price_label:string};
type Staff={id:string;name:string};
type Assignment={staff_id:string;service_id:string};
type Slot={slot_start:string};

const categoryMeta:Record<string,{label:string;soft:string;active:string;dot:string}> = {
  hair:{label:"Hair",soft:"bg-[#F4E8E1] border-[#E3C9BC]",active:"bg-[#6B4F43] text-ivory border-[#6B4F43]",dot:"bg-[#6B4F43]"},
  nails:{label:"Nails",soft:"bg-[#F7E4E2] border-[#E9C6C1]",active:"bg-[#B97870] text-white border-[#B97870]",dot:"bg-[#B97870]"},
  lashes:{label:"Lashes",soft:"bg-[#EEE6F1] border-[#D7C6DD]",active:"bg-[#7E687F] text-white border-[#7E687F]",dot:"bg-[#7E687F]"},
  brows:{label:"Brows + Wax",soft:"bg-[#F2E7DA] border-[#DFC9AE]",active:"bg-[#9B7455] text-white border-[#9B7455]",dot:"bg-[#9B7455]"},
  makeup:{label:"Makeup",soft:"bg-[#F7E7EC] border-[#E6C8D1]",active:"bg-[#A56678] text-white border-[#A56678]",dot:"bg-[#A56678]"},
  tanning:{label:"Glow",soft:"bg-[#F5E6D7] border-[#E4C8A6]",active:"bg-[#B77B49] text-white border-[#B77B49]",dot:"bg-[#B77B49]"}
};
const categoryOrder=["hair","nails","lashes","brows","makeup","tanning"];

const hairSubgroups=["Corte","Color","Secado","Tratamiento","Estilismo"];
function hairSubgroup(name:string){
  const n=name.toLowerCase();
  if(n.includes("haircut")||n.includes("corte")) return "Corte";
  if(n.includes("balayage")||n.includes("color")||n.includes("highlight")||n.includes("tinte")) return "Color";
  if(n.includes("blowdry")||n.includes("secado")) return "Secado";
  if(n.includes("keratin")||n.includes("botox")||n.includes("tratamiento")) return "Tratamiento";
  if(n.includes("braid")||n.includes("extension")||n.includes("trenza")) return "Estilismo";
  return "Otros";
}
const nailsSubgroups=["Regular","Gel","Acrílico y otros"];
function nailsSubgroup(name:string){
  const n=name.toLowerCase();
  if(n.includes("gel")) return "Gel";
  if(n.includes("regular")) return "Regular";
  return "Acrílico y otros";
}
function subgroupOf(category:string,name:string){
  if(category==="hair")return hairSubgroup(name);
  if(category==="nails")return nailsSubgroup(name);
  return null;
}
function subgroupOrder(category:string){
  if(category==="hair")return hairSubgroups;
  if(category==="nails")return nailsSubgroups;
  return [];
}

export function NewAppointmentSheet({open,onClose,onCreated}:{open:boolean;onClose:()=>void;onCreated:()=>void}){
  const [clients,setClients]=useState<Client[]>([]);
  const [services,setServices]=useState<Service[]>([]);
  const [staff,setStaff]=useState<Staff[]>([]);
  const [assignments,setAssignments]=useState<Assignment[]>([]);
  const [step,setStep]=useState(1);
  const [clientId,setClientId]=useState("");
  const [category,setCategory]=useState("hair");
  const [serviceIds,setServiceIds]=useState<string[]>([]);
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

  const [addingClient,setAddingClient]=useState(false);
  const [editingClient,setEditingClient]=useState(false);

  async function loadClients(){const {data}=await supabase.from("client_profiles").select("id,first_name,last_name,email,phone").order("first_name");setClients((data as Client[])||[])}

  useEffect(()=>{if(!open)return;(async()=>{
    const [{data:s},{data:t},{data:a}]=await Promise.all([
      supabase.from("services").select("id,name,category,duration_minutes,price_label").eq("active",true).order("category").order("name"),
      supabase.from("staff").select("id,name").eq("active",true).order("name"),
      supabase.from("staff_services").select("staff_id,service_id")
    ]);
    await loadClients();
    setServices((s as Service[])||[]);setStaff((t as Staff[])||[]);setAssignments((a as Assignment[])||[]);
  })()},[open]);

  useEffect(()=>{setStaffId("");setSlot("");setSlots([])},[serviceIds.join(",")]);
  useEffect(()=>{setSlot("");if(serviceIds.length===0||!staffId||!date){setSlots([]);return;}(async()=>{
    setLoadingSlots(true);setError(null);
    const {data,error}=await supabase.rpc("get_available_slots",{p_staff_id:staffId,p_service_id:serviceIds[0],p_date:date});
    setLoadingSlots(false);
    if(error){setError(error.message);setSlots([]);return;}
    setSlots(((data as Slot[])||[]));
  })()},[serviceIds.join(","),staffId,date]);

  function toggleService(id:string){setServiceIds(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id])}
  function selectClient(id:string){setClientId(id);setStep(2)}
  function selectStaff(id:string){setStaffId(id);setStep(4)}
  function selectSlot(s:string){setSlot(s);setStep(5)}

  const selectedServices=useMemo(()=>serviceIds.map(id=>services.find(s=>s.id===id)).filter(Boolean) as Service[],[serviceIds,services]);
  const totalDuration=useMemo(()=>selectedServices.reduce((n,s)=>n+s.duration_minutes,0),[selectedServices]);
  const compatibleStaff=useMemo(()=>{if(serviceIds.length===0)return [];return staff.filter(s=>serviceIds.every(id=>assignments.some(a=>a.staff_id===s.id&&a.service_id===id)))},[staff,assignments,serviceIds]);
  const categoryServices=useMemo(()=>services.filter(s=>s.category===category),[services,category]);
  const filteredClients=useMemo(()=>{const needle=q.trim().toLowerCase();if(!needle)return clients.slice(0,8);return clients.filter(c=>`${c.first_name} ${c.last_name} ${c.email||""} ${c.phone||""}`.toLowerCase().includes(needle)).slice(0,8)},[clients,q]);
  const client=clients.find(c=>c.id===clientId)||null;
  const professional=staff.find(s=>s.id===staffId)||null;

  async function create(){
    if(!client||serviceIds.length===0||!staffId||!slot)return;
    setLoading(true);setError(null);
    let cursor=slot;
    const createdIds:string[]=[];
    for(const svc of selectedServices){
      const {data:newId,error:e}=await supabase.rpc("hub_create_appointment",{
        p_service_id:svc.id,p_staff_id:staffId,p_start_at:cursor,
        p_client_name:`${client.first_name} ${client.last_name}`.trim(),
        p_client_phone:client.phone||"",p_client_email:client.email||null,
        p_notes_internal:selectedServices.length>1?`${notes.trim()?notes.trim()+" — ":""}Parte de una visita con ${selectedServices.length} servicios.`:(notes.trim()||null),
        p_source:"gloria_hub"
      });
      if(e){setLoading(false);setError(createdIds.length>0?`Se agendó parte de la visita, pero "${svc.name}" no se pudo agendar: ${e.message}`:e.message);return;}
      createdIds.push(newId as unknown as string);
      cursor=new Date(new Date(cursor).getTime()+svc.duration_minutes*60000).toISOString();
    }
    if(client.email){
      try{
        const response=await fetch("/api/send-confirmation",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
          clientName:`${client.first_name} ${client.last_name}`.trim(),
          clientEmail:client.email,
          serviceId:selectedServices[0].id,
          staffId,
          startAt:slot
        })});
        const emailResult=await response.json();
        if(!emailResult?.ok) setError("La cita se guardó, pero el correo de confirmación no pudo enviarse.");
      }catch{setError("La cita se guardó, pero el correo de confirmación no pudo enviarse.");}
    }
    setLoading(false);
    setDone(true);
    setTimeout(()=>{setDone(false);setStep(1);setClientId("");setCategory("hair");setServiceIds([]);setStaffId("");setSlot("");setNotes("");onCreated();onClose()},650);
  }

  function reset(){setStep(1);setClientId("");setCategory("hair");setServiceIds([]);setStaffId("");setSlot("");setNotes("");setDone(false);setError(null);onClose()}

  if(!open)return null;
  return <div className="fixed inset-0 z-[100] bg-espresso/45 backdrop-blur-[2px] flex justify-end" onClick={reset}>
    <aside className="h-full w-full max-w-[520px] overflow-y-auto bg-[#FBF8F3] p-5 sm:p-7" onClick={e=>e.stopPropagation()}>
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-[8px] uppercase tracking-[0.22em] text-mocha">Nueva cita</p><h2 className="mt-2 font-serif text-[38px] leading-none">Agenda una experiencia</h2></div>
        <button onClick={reset} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-champagne/35"><X size={19}/></button>
      </div>

      {done?<div className="mt-10 rounded-[24px] bg-espresso p-8 text-center text-ivory"><Check className="mx-auto text-champagne"/><h3 className="mt-4 font-serif text-[32px]">Cita confirmada</h3></div>:<>

        {/* Step 1 — Clienta */}
        {step>1&&client?<CompletedRow n="01" title="Clienta" value={`${client.first_name} ${client.last_name}`} onEdit={()=>setStep(1)}/>:<Step n="01" title="Clienta">
          {client?<div className="flex items-center gap-2"><div className="flex-1 rounded-[18px] border border-mocha/20 bg-[#F1E6DE] p-4"><p className="font-serif text-[23px]">{client.first_name} {client.last_name}</p><p className="mt-1 text-[9px] text-taupe">{client.phone||client.email||"Sin contacto"}</p></div><button onClick={()=>setEditingClient(true)} aria-label="Editar clienta" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-mocha/25 bg-white/70 text-mocha"><Pencil size={15}/></button><button onClick={()=>setClientId("")} aria-label="Cambiar clienta" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-champagne/35 text-taupe"><X size={15}/></button></div><button onClick={()=>setStep(2)} className="mt-3 w-full rounded-full bg-[#4A352B] px-5 py-3.5 text-[9px] uppercase tracking-[.14em] text-ivory">Continuar</button></div>:<>
            <label className="flex items-center gap-2 rounded-[15px] border border-champagne/35 bg-white/75 px-3.5 py-3"><Search size={15} className="text-mocha"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar clienta" className="w-full bg-transparent text-[12px] outline-none"/></label>
            <div className="mt-2 overflow-hidden rounded-[17px] border border-champagne/25 bg-white/60 divide-y divide-champagne/20">{filteredClients.map(c=><button key={c.id} onClick={()=>selectClient(c.id)} className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-[#F8F0EA]"><div><p className="font-serif text-[19px]">{c.first_name} {c.last_name}</p><p className="mt-1 text-[8px] text-taupe">{c.phone||c.email||"Sin contacto"}</p></div><ChevronRight size={15} className="text-champagne"/></button>)}{filteredClients.length===0&&<p className="px-4 py-4 text-[11px] text-taupe">Ninguna clienta coincide.</p>}</div>
            <button onClick={()=>setAddingClient(true)} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[15px] border border-dashed border-mocha/35 bg-white/40 px-4 py-3.5 text-[10px] uppercase tracking-[.12em] text-mocha"><Plus size={14}/> Agregar clienta nueva</button>
          </>}
        </Step>}

        {/* Step 2 — Servicio(s) */}
        {step>2&&selectedServices.length>0?<CompletedRow n="02" title="Servicio(s)" value={selectedServices.map(s=>s.name).join(" + ")} onEdit={()=>setStep(2)}/>:step>=2&&<Step n="02" title="Servicio(s)">
          <div>
            <p className="mb-2 text-[8px] uppercase tracking-[0.16em] text-taupe">Categoría</p>
            <div className="grid grid-cols-3 gap-2">
              {categoryOrder.filter(cat=>services.some(s=>s.category===cat)).map(cat=>{
                const meta=categoryMeta[cat]||categoryMeta.hair;
                const active=category===cat;
                return <button key={cat} onClick={()=>setCategory(cat)} className={`rounded-[16px] border px-3 py-3 text-left transition-all ${active?meta.active:meta.soft}`}>
                  <span className={`mb-2 block h-2 w-2 rounded-full ${active?"bg-white/80":meta.dot}`}/>
                  <span className="block font-serif text-[17px] leading-none">{meta.label}</span>
                </button>
              })}
            </div>
          </div>
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between"><p className="text-[8px] uppercase tracking-[0.16em] text-taupe">{categoryMeta[category]?.label||"Servicios"}</p>{selectedServices.length>0&&<p className="text-[8px] uppercase tracking-[0.14em] text-mocha">{selectedServices.length} seleccionado{selectedServices.length>1?"s":""}</p>}</div>
            {subgroupOrder(category).length>0?<div className="space-y-5">
              {subgroupOrder(category).map(group=>{
                const groupServices=categoryServices.filter(s=>subgroupOf(category,s.name)===group);
                if(groupServices.length===0)return null;
                return <div key={group}>
                  <p className="mb-2 text-[9px] uppercase tracking-[.14em] text-[#8A5A50]">{group}</p>
                  <div className="space-y-2">{groupServices.map(s=>{
                    const selected=serviceIds.includes(s.id);
                    const meta=categoryMeta[category]||categoryMeta.hair;
                    return <button key={s.id} onClick={()=>toggleService(s.id)} className={`w-full rounded-[17px] border p-4 text-left transition-all ${selected?`${meta.active} shadow-[0_8px_20px_rgba(52,38,31,.08)]`:"border-champagne/25 bg-white/72 hover:bg-white"}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div><p className="font-serif text-[21px] leading-none">{s.name}</p><p className={`mt-2 text-[9px] ${selected?"text-white/70":"text-taupe"}`}>{s.duration_minutes} min · {s.price_label}</p></div>
                        <span className={`grid h-8 w-8 place-items-center rounded-full border ${selected?"border-white/60 bg-white/15":"border-champagne/30 bg-[#FBF8F3] text-mocha"}`}>{selected?<Check size={14}/>:<ChevronRight size={14}/>}</span>
                      </div>
                    </button>
                  })}</div>
                </div>
              })}
            </div>:<div className="space-y-2">
              {categoryServices.map(s=>{
                const selected=serviceIds.includes(s.id);
                const meta=categoryMeta[category]||categoryMeta.hair;
                return <button key={s.id} onClick={()=>toggleService(s.id)} className={`w-full rounded-[17px] border p-4 text-left transition-all ${selected?`${meta.active} shadow-[0_8px_20px_rgba(52,38,31,.08)]`:"border-champagne/25 bg-white/72 hover:bg-white"}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div><p className="font-serif text-[21px] leading-none">{s.name}</p><p className={`mt-2 text-[9px] ${selected?"text-white/70":"text-taupe"}`}>{s.duration_minutes} min · {s.price_label}</p></div>
                    <span className={`grid h-8 w-8 place-items-center rounded-full border ${selected?"border-white/60 bg-white/15":"border-champagne/30 bg-[#FBF8F3] text-mocha"}`}>{selected?<Check size={14}/>:<ChevronRight size={14}/>}</span>
                  </div>
                </button>
              })}
            </div>}
            {selectedServices.length>1&&<p className="mt-3 text-[9px] leading-relaxed text-taupe">Se agendarán uno después del otro con la misma profesional, {totalDuration} min en total.</p>}
          </div>
          <button disabled={selectedServices.length===0} onClick={()=>setStep(3)} className="mt-4 w-full rounded-full bg-[#4A352B] px-5 py-3.5 text-[9px] uppercase tracking-[.14em] text-ivory disabled:opacity-35">Continuar</button>
        </Step>}

        {/* Step 3 — Profesional */}
        {step>3&&professional?<CompletedRow n="03" title="Profesional" value={professional.name} onEdit={()=>setStep(3)}/>:step>=3&&<Step n="03" title="Profesional">
          {compatibleStaff.length===0?<Hint>Ninguna profesional hace todos los servicios elegidos juntos. Intenta agendarlos por separado.</Hint>:<div className="grid grid-cols-2 gap-2">{compatibleStaff.map(s=><button key={s.id} onClick={()=>selectStaff(s.id)} className={`rounded-[17px] border p-4 text-left ${staffId===s.id?"border-mocha/35 bg-[#EFE1D8]":"border-champagne/30 bg-white/65"}`}><UserRound size={16} className="text-mocha"/><p className="mt-3 font-serif text-[20px]">{s.name}</p></button>)}</div>}
        </Step>}

        {/* Step 4 — Fecha y hora */}
        {step>4&&slot?<CompletedRow n="04" title="Fecha y hora" value={`${new Date(slot).toLocaleDateString("es-US",{month:"short",day:"numeric",timeZone:"America/New_York"})} · ${fmtTime(slot)}`} onEdit={()=>setStep(4)}/>:step>=4&&<Step n="04" title="Fecha y hora">
          <div className="grid gap-3">
            <label><span className="mb-1.5 block text-[8px] uppercase tracking-[0.16em] text-taupe">Fecha</span><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full rounded-[15px] border border-champagne/35 bg-white/75 px-4 py-3.5 text-[12px]"/></label>
            {loadingSlots?<Hint>Buscando horarios disponibles…</Hint>:slots.length===0?<Hint>No hay horarios disponibles para esa fecha.</Hint>:<div className="grid grid-cols-3 gap-2">{slots.map(s=><button key={s.slot_start} onClick={()=>selectSlot(s.slot_start)} className={`rounded-[14px] border px-3 py-3 text-[11px] ${slot===s.slot_start?"border-mocha bg-[#4A352B] text-ivory":"border-champagne/30 bg-white/70 text-mocha"}`}>{fmtTime(s.slot_start)}</button>)}</div>}
          </div>
        </Step>}

        {/* Step 5 — Confirmar */}
        {step>=5&&<Step n="05" title="Confirmar">
          <div className="rounded-[20px] border border-champagne/30 bg-white/65 p-4 space-y-3">
            <Summary icon={<CalendarDays size={15}/>} label="Servicio(s)" value={selectedServices.map(s=>s.name).join(" + ")||"—"}/>
            <Summary icon={<UserRound size={15}/>} label="Profesional" value={professional?.name||"—"}/>
            <Summary icon={<Clock3 size={15}/>} label="Horario" value={slot?`${new Date(slot).toLocaleDateString("es-US",{month:"short",day:"numeric",timeZone:"America/New_York"})} · ${fmtTime(slot)}${totalDuration?` · ${totalDuration} min`:""}`:"—"}/>
          </div>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} placeholder="Nota interna opcional" className="mt-3 w-full rounded-[15px] border border-champagne/35 bg-white/75 px-4 py-3 text-[11px] outline-none"/>
          {error&&<p className="mt-4 rounded-[15px] bg-red-50 px-4 py-3 text-[10px] text-red-700">{error}</p>}
          <button disabled={loading||!clientId||serviceIds.length===0||!staffId||!slot} onClick={create} className="mt-4 w-full rounded-full bg-[#4A352B] px-5 py-4 text-[9px] uppercase tracking-[0.14em] text-ivory disabled:opacity-35">{loading?"Confirmando…":selectedServices.length>1?`Confirmar ${selectedServices.length} servicios`:"Confirmar cita"}</button>
        </Step>}
      </>}
    </aside>

    {addingClient&&<AddClientModal onClose={()=>setAddingClient(false)} onSaved={async(id)=>{setAddingClient(false);await loadClients();selectClient(id)}}/>}
    {editingClient&&client&&<AddClientModal client={client} onClose={()=>setEditingClient(false)} onSaved={async()=>{setEditingClient(false);await loadClients()}}/>}
  </div>
}

function Step({n,title,children}:{n:string;title:string;children:React.ReactNode}){return <section className="mt-6"><div className="mb-3 flex items-center gap-3"><span className="grid h-7 w-7 place-items-center rounded-full bg-[#EAD6D1] text-[8px] text-mocha">{n}</span><p className="font-serif text-[23px]">{title}</p><span className="h-px flex-1 bg-champagne/30"/></div>{children}</section>}
function CompletedRow({n,title,value,onEdit}:{n:string;title:string;value:string;onEdit:()=>void}){return <button onClick={onEdit} className="mt-3 flex w-full items-center gap-3 rounded-[16px] border border-champagne/25 bg-white/55 px-4 py-3 text-left"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#EAD6D1] text-[8px] text-mocha"><Check size={12}/></span><div className="min-w-0 flex-1"><p className="text-[8px] uppercase tracking-[.12em] text-taupe">{title}</p><p className="mt-0.5 truncate font-serif text-[17px] leading-none">{value}</p></div><Pencil size={13} className="shrink-0 text-mocha"/></button>}
function Hint({children}:{children:React.ReactNode}){return <p className="rounded-[15px] border border-dashed border-champagne/35 bg-white/45 px-4 py-4 text-[10px] text-taupe">{children}</p>}
function Summary({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){return <div className="flex items-center gap-3"><span className="text-mocha">{icon}</span><div><p className="text-[8px] uppercase tracking-[0.14em] text-taupe">{label}</p><p className="mt-1 text-[11px]">{value}</p></div></div>}
function fmtTime(v:string){return new Date(v).toLocaleTimeString("es-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}

function AddClientModal({client,onClose,onSaved}:{client?:Client;onClose:()=>void;onSaved:(id:string)=>void}){
  const [first,setFirst]=useState(client?.first_name||"");
  const [last,setLast]=useState(client?.last_name||"");
  const [phone,setPhone]=useState(client?.phone||"");
  const [email,setEmail]=useState(client?.email||"");
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState<string|null>(null);
  async function save(){
    if(!first.trim())return;
    setSaving(true);setError(null);
    if(client){
      const {error:e}=await supabase.rpc("hub_update_client_profile",{p_client_id:client.id,p_first_name:first.trim(),p_last_name:last.trim(),p_email:email.trim()||null,p_phone:phone.trim()||null});
      setSaving(false);
      if(e){setError(e.message);return;}
      onSaved(client.id);
    }else{
      const {data:newId,error:e}=await supabase.rpc("hub_create_client",{p_first_name:first.trim(),p_last_name:last.trim(),p_email:email.trim()||null,p_phone:phone.trim()||null});
      setSaving(false);
      if(e){setError(e.message);return;}
      onSaved(newId as unknown as string);
    }
  }
  return <div className="fixed inset-0 z-[110] flex items-end justify-center bg-espresso/45 backdrop-blur-[2px] md:items-center" onClick={onClose}>
    <div className="w-full max-w-[460px] rounded-t-[28px] bg-[#FBF8F3] p-6 md:rounded-[28px]" onClick={e=>e.stopPropagation()}>
      <div className="flex items-start justify-between"><h3 className="font-serif text-[30px]">{client?"Editar clienta":"Clienta nueva"}</h3><button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-full border border-champagne/35"><X size={16}/></button></div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <label className="col-span-1"><span className="mb-1.5 block text-[8px] uppercase tracking-[.12em] text-taupe">Nombre</span><input value={first} onChange={e=>setFirst(e.target.value)} className="w-full rounded-[14px] border border-champagne/35 bg-white/80 px-3.5 py-3 text-[13px] outline-none"/></label>
        <label className="col-span-1"><span className="mb-1.5 block text-[8px] uppercase tracking-[.12em] text-taupe">Apellido</span><input value={last} onChange={e=>setLast(e.target.value)} className="w-full rounded-[14px] border border-champagne/35 bg-white/80 px-3.5 py-3 text-[13px] outline-none"/></label>
        <label className="col-span-2"><span className="mb-1.5 block text-[8px] uppercase tracking-[.12em] text-taupe">Teléfono</span><input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full rounded-[14px] border border-champagne/35 bg-white/80 px-3.5 py-3 text-[13px] outline-none"/></label>
        <label className="col-span-2"><span className="mb-1.5 block text-[8px] uppercase tracking-[.12em] text-taupe">Email</span><input value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-[14px] border border-champagne/35 bg-white/80 px-3.5 py-3 text-[13px] outline-none"/></label>
      </div>
      {error&&<p className="mt-3 text-[10px] text-red-700">{error}</p>}
      <button disabled={saving||!first.trim()} onClick={save} className="mt-5 w-full rounded-full bg-[#4A352B] px-5 py-3.5 text-[9px] uppercase tracking-[.13em] text-ivory disabled:opacity-50">{saving?"Guardando…":"Guardar"}</button>
    </div>
  </div>
}
