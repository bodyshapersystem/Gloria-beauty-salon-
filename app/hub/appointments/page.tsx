"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, ChevronRight, Filter, Pencil, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Appointment={id:string;client_name:string;client_phone:string;client_email:string|null;notes_internal?:string|null;start_at:string;end_at:string;status:string;source:string;service_category:string|null;booking_duration:number|null;price_cents:number|null;pricing_type:string|null;cancellation_fee_cents:number|null;cancellation_fee_reason:string|null;reschedule_count:number;service_id:string;staff_id:string;service:{name:string;price_label:string;category:string}|null;staff:{name:string}|null};
type Staff={id:string;name:string};
type Service={id:string;name:string;category:string};
type View="today"|"upcoming"|"history";
const viewLabels:Record<View,string>={today:"Hoy",upcoming:"Próximas",history:"Historial"};
const statuses=["all","pending","confirmed","in_progress","completed","cancelled","no_show"];
const statusLabels:Record<string,string>={all:"Todos los estados",pending:"Pendiente",confirmed:"Confirmada",in_progress:"En curso",completed:"Completada",cancelled:"Cancelada",no_show:"No se presentó"};
const sourceLabels:Record<string,string>={all:"Todos los orígenes",public_booking:"Reserva pública",gloria_access:"Gloria Access",gloria_hub:"Gloria Hub",staff_created:"Creada por staff",manual_admin:"Manual (admin)"};

export default function HubAppointmentsPage(){
  const [items,setItems]=useState<Appointment[]>([]);const [loading,setLoading]=useState(true);const [ownStaffId,setOwnStaffId]=useState<string|null>(null);const [role,setRole]=useState<string|null>(null);const [staff,setStaff]=useState<Staff[]>([]);const [services,setServices]=useState<Service[]>([]);const [query,setQuery]=useState("");const [status,setStatus]=useState("all");const [staffId,setStaffId]=useState("all");const [serviceId,setServiceId]=useState("all");const [source,setSource]=useState("all");const [selected,setSelected]=useState<Appointment|null>(null);const [actionMessage,setActionMessage]=useState<string|null>(null);const [view,setView]=useState<View>("today");const [filtersOpen,setFiltersOpen]=useState(false);
  const [mode,setMode]=useState<"view"|"edit"|"reschedule">("view");

  async function load(){setLoading(true);const {data:{session}}=await supabase.auth.getSession();const {data:profile}=session?await supabase.from("user_profiles").select("role,staff_id").eq("auth_user_id",session.user.id).eq("active",true).maybeSingle():{data:null} as any;setRole(profile?.role||null);const staffOnly=profile?.role==="staff"?profile?.staff_id||null:null;setOwnStaffId(staffOnly);let apptQuery=supabase.from("appointments").select("id,client_name,client_phone,client_email,notes_internal,start_at,end_at,status,source,service_category,booking_duration,price_cents,pricing_type,cancellation_fee_cents,cancellation_fee_reason,reschedule_count,service_id,staff_id,service:service_id(name,price_label,category),staff:staff_id(name)").order("start_at",{ascending:true});if(staffOnly)apptQuery=apptQuery.eq("staff_id",staffOnly);const [{data:a},{data:st},{data:sv}]=await Promise.all([apptQuery,supabase.from("staff").select("id,name").eq("active",true).order("name"),supabase.from("services").select("id,name,category").eq("active",true).order("name")]);setItems(((a as unknown) as Appointment[])||[]);setStaff(((st as unknown) as Staff[])||[]);setServices(((sv as unknown) as Service[])||[]);setLoading(false)}
  useEffect(()=>{load()},[]);

  const filtered=useMemo(()=>{const todayStart=new Date();todayStart.setHours(0,0,0,0);const tomorrow=new Date(todayStart);tomorrow.setDate(tomorrow.getDate()+1);return items.filter(a=>{const start=new Date(a.start_at);const byView=view==="today"?(start>=todayStart&&start<tomorrow):view==="upcoming"?(start>=tomorrow&&!["completed","cancelled","no_show"].includes(a.status)):(start<todayStart||["completed","cancelled","no_show"].includes(a.status));const q=query.trim().toLowerCase();const matchesQ=!q||a.client_name.toLowerCase().includes(q)||(a.client_phone||"").toLowerCase().includes(q)||(a.client_email||"").toLowerCase().includes(q);return byView&&matchesQ&&(status==="all"||a.status===status)&&(staffId==="all"||a.staff?.name===staff.find(s=>s.id===staffId)?.name)&&(serviceId==="all"||a.service?.name===services.find(s=>s.id===serviceId)?.name)&&(source==="all"||a.source===source)}).sort((a,b)=>view==="history"?+new Date(b.start_at)-+new Date(a.start_at):+new Date(a.start_at)-+new Date(b.start_at))},[items,query,status,staffId,serviceId,source,staff,services,view]);

  const counts=useMemo(()=>{const todayStart=new Date();todayStart.setHours(0,0,0,0);const tomorrow=new Date(todayStart);tomorrow.setDate(tomorrow.getDate()+1);return {today:items.filter(a=>{const d=new Date(a.start_at);return d>=todayStart&&d<tomorrow&&a.status!=="cancelled"}).length,upcoming:items.filter(a=>new Date(a.start_at)>=tomorrow&&!["completed","cancelled","no_show"].includes(a.status)).length,history:items.filter(a=>new Date(a.start_at)<todayStart||["completed","cancelled","no_show"].includes(a.status)).length}},[items]);

  const activeFilters=[status!=="all",staffId!=="all",serviceId!=="all",source!=="all"].filter(Boolean).length;
  async function resendConfirmation(a:Appointment){
    setActionMessage(null);
    if(!a.client_email){setActionMessage("Esta clienta no tiene email guardado.");return;}
    try{
      const staffRow=staff.find(s=>s.name===a.staff?.name);
      const serviceRow=services.find(s=>s.name===a.service?.name);
      if(!staffRow||!serviceRow){setActionMessage("No pudimos identificar servicio o profesional para reenviar.");return;}
      const response=await fetch("/api/send-confirmation",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        clientName:a.client_name,
        clientEmail:a.client_email,
        serviceId:serviceRow.id,
        staffId:staffRow.id,
        startAt:a.start_at
      })});
      const result=await response.json();
      setActionMessage(result?.ok?"Confirmación reenviada.":"No se pudo reenviar la confirmación.");
    }catch{setActionMessage("No se pudo reenviar la confirmación.");}
  }

  function openAppointment(a:Appointment){setSelected(a);setMode("view");setActionMessage(null)}
  function closePanel(){setSelected(null);setMode("view")}
  async function changeStatus(id:string,next:string){setActionMessage(null);const reason=next==="cancelled"?window.prompt("Motivo de la cancelación (opcional)")||null:null;if(["cancelled","no_show"].includes(next)&&!window.confirm(`¿Marcar esta cita como ${(statusLabels[next]||next).toLowerCase()}?`))return;const {error}=await supabase.rpc("hub_update_appointment_status",{p_appointment_id:id,p_status:next,p_reason:reason});if(error){setActionMessage(error.message);return;}await load();setSelected(v=>v?.id===id?{...v,status:next}:v)}
  async function deleteAppointment(id:string){if(!window.confirm("¿Eliminar esta cita para siempre? Esto no se puede deshacer — no queda ningún registro."))return;setActionMessage(null);const {error}=await supabase.rpc("hub_delete_appointment",{p_appointment_id:id});if(error){setActionMessage(error.message);return;}setSelected(null);await load()}
  function clearFilters(){setStatus("all");setStaffId("all");setServiceId("all");setSource("all")}

  return <div>
    <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-5"><div><p className="text-[9px] uppercase tracking-[0.26em] text-mocha">Reservas del día</p><h1 className="mt-2 font-serif text-[44px] md:text-[58px] leading-none">Citas</h1><p className="mt-3 text-[12px] text-taupe">Mira primero lo que importa. Abre los detalles solo cuando los necesites.</p></div><div className="flex flex-wrap gap-2"><Link href="/hub/calendar" className="inline-flex items-center gap-2 rounded-full border border-champagne/40 bg-white/55 px-4 py-2.5 text-[9px] uppercase tracking-[0.12em] text-mocha"><CalendarDays size={15}/> Calendario</Link><Link href="/hub/calendar?new=1" className="inline-flex items-center gap-2 rounded-full bg-espresso px-4 py-2.5 text-[9px] uppercase tracking-[0.12em] text-ivory"><Plus size={14}/> Nueva cita</Link></div></div>

    <section className="mt-7 rounded-[25px] border border-champagne/25 bg-white/50 p-3 md:p-4">
      <div className="flex flex-col lg:flex-row gap-3 lg:items-center">
        <div className="grid grid-cols-3 gap-1 rounded-[16px] bg-ivory/80 p-1 lg:w-[420px]">{(["today","upcoming","history"] as View[]).map(v=><button key={v} onClick={()=>setView(v)} className={`rounded-[12px] px-3 py-2.5 text-[10px] transition ${view===v?"bg-espresso text-ivory shadow-sm":"text-taupe hover:text-espresso"}`}><span className="block">{viewLabels[v]}</span><span className={`mt-0.5 block font-serif text-[18px] ${view===v?"text-champagne":"text-mocha"}`}>{counts[v]}</span></button>)}</div>
        <label className="relative flex-1"><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-taupe" size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar clienta, teléfono o email" className="w-full rounded-[15px] border border-champagne/30 bg-ivory/60 pl-10 pr-4 py-3.5 text-[12px] outline-none focus:border-mocha/35"/></label>
        <button onClick={()=>setFiltersOpen(v=>!v)} className={`inline-flex items-center justify-center gap-2 rounded-[15px] border px-4 py-3.5 text-[10px] ${filtersOpen||activeFilters?"border-mocha/25 bg-blush/25 text-mocha":"border-champagne/30 bg-ivory/55 text-taupe"}`}><Filter size={15}/> Filtros{activeFilters>0&&<span className="grid h-5 min-w-5 place-items-center rounded-full bg-mocha px-1 text-[8px] text-ivory">{activeFilters}</span>}</button>
      </div>
      {filtersOpen&&<div className="mt-3 rounded-[18px] border border-champagne/20 bg-ivory/45 p-4"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-mocha"><SlidersHorizontal size={15}/><p className="text-[8px] uppercase tracking-[0.2em]">Filtros avanzados</p></div>{activeFilters>0&&<button onClick={clearFilters} className="text-[9px] text-mocha underline underline-offset-4">Limpiar todo</button>}</div><div className="mt-3 grid gap-2 md:grid-cols-2 xl:grid-cols-4"><Select value={status} onChange={setStatus} options={statuses.map(x=>[x,statusLabels[x]])}/>{!ownStaffId&&<Select value={staffId} onChange={setStaffId} options={[["all","Todas las profesionales"],...staff.map(s=>[s.id,s.name])]}/>}<Select value={serviceId} onChange={setServiceId} options={[["all","Todos los servicios"],...services.map(s=>[s.id,s.name])]}/><Select value={source} onChange={setSource} options={[["all","Todos los orígenes"],["public_booking","Reserva pública"],["gloria_access","Gloria Access"],["gloria_hub","Gloria Hub"],["staff_created","Creada por staff"],["manual_admin","Manual (admin)"]]}/></div></div>}
    </section>

    {actionMessage&&<p className="mt-4 rounded-[15px] bg-red-50 px-4 py-3 text-[11px] text-red-700">{actionMessage}</p>}

    <section className="mt-5 space-y-2">{loading?<div className="rounded-[22px] border border-champagne/25 bg-white/45 p-8 text-center text-[12px] text-taupe">Cargando citas...</div>:filtered.length===0?<Empty view={view}/>:filtered.map(a=><button key={a.id} onClick={()=>openAppointment(a)} className="group w-full text-left rounded-[20px] border border-champagne/25 bg-white/50 p-3.5 md:p-4 transition hover:-translate-y-[1px] hover:bg-white/75 hover:shadow-[0_8px_24px_rgba(46,39,36,.05)]"><div className="flex items-center gap-3 md:gap-4"><div className="grid h-14 w-16 md:h-16 md:w-20 shrink-0 place-items-center rounded-[15px] bg-[linear-gradient(145deg,#F0E3DA,#FAF7F2)]"><span className="text-center"><span className="block text-[9px] uppercase tracking-[0.12em] text-taupe">{shortDate(a.start_at)}</span><span className="mt-1 block font-serif text-[19px] text-mocha">{formatTime(a.start_at)}</span></span></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className="font-serif text-[22px] md:text-[25px] leading-none truncate">{a.client_name}</p><Status value={a.status}/></div><p className="mt-1.5 text-[10px] md:text-[11px] text-taupe truncate">{a.service?.name||"Cita"} · {a.staff?.name||"Equipo"}</p><div className="mt-2 hidden sm:flex items-center gap-3 text-[9px] text-taupe"><span>{minutesBetween(a.start_at,a.end_at)} min</span><span>•</span><span>{sourceLabels[a.source]||a.source}</span>{a.price_cents!=null&&<><span>•</span><span>{money(a.price_cents)}</span></>}</div></div><div className="hidden md:block text-right"><p className="text-[9px] uppercase tracking-[0.14em] text-taupe">Abrir</p><ChevronRight size={18} className="mt-2 ml-auto text-mocha transition group-hover:translate-x-0.5"/></div></div></button>)}</section>

    {selected&&<div className="fixed inset-0 z-[80] bg-espresso/35 backdrop-blur-[2px] flex justify-end" onClick={closePanel}><aside className="h-full w-full max-w-[540px] bg-ivory p-5 md:p-7 overflow-y-auto" onClick={e=>e.stopPropagation()}>
      <div className="flex items-start justify-between gap-4"><div><p className="text-[8px] uppercase tracking-[0.22em] text-mocha">Cita</p><h2 className="mt-2 font-serif text-[38px] leading-none">{selected.client_name}</h2><p className="mt-2 text-[11px] text-taupe">{selected.service?.name||"Cita"} · {selected.staff?.name||"Equipo"}</p></div><button onClick={closePanel} className="grid h-10 w-10 place-items-center rounded-full border border-champagne/35 bg-white/50 text-taupe"><X size={18}/></button></div>

      <div className="mt-6 rounded-[22px] bg-espresso p-5 text-ivory"><div className="flex items-center justify-between gap-4"><div><p className="text-[8px] uppercase tracking-[0.16em] text-champagne">{formatDate(selected.start_at)}</p><p className="mt-2 font-serif text-[30px] leading-none">{formatTime(selected.start_at)} – {formatTime(selected.end_at)}</p></div><Status value={selected.status}/></div><p className="mt-3 text-[10px] text-ivory/65">{minutesBetween(selected.start_at,selected.end_at)} min · {sourceLabels[selected.source]||selected.source}{selected.reschedule_count>0?` · Reprogramada ${selected.reschedule_count}×`:""}</p></div>

      {!!selected.cancellation_fee_cents&&<div className="mt-4 rounded-[16px] bg-red-50 border border-red-200 px-4 py-3"><p className="text-[11.5px] text-red-800">{selected.cancellation_fee_reason==="reschedule_limit_reached"?`Se canceló sola al intentar reprogramar por segunda vez. Cargo pendiente: ${money(selected.cancellation_fee_cents)}.`:`Cancelación tardía (menos de 24h) — cargo pendiente: ${money(selected.cancellation_fee_cents)}.`}</p></div>}

      {mode==="view"&&<div className="mt-6 space-y-5">
        <Detail title="Clienta"><Line label="Teléfono" value={selected.client_phone}/><Line label="Email" value={selected.client_email||"—"}/>{selected.notes_internal&&<Line label="Notas" value={selected.notes_internal}/>}</Detail>
        <Detail title="Reserva"><Line label="Servicio" value={selected.service?.name||"—"}/><Line label="Profesional" value={selected.staff?.name||"—"}/>{selected.price_cents!=null&&<Line label="Precio registrado" value={money(selected.price_cents)}/>}</Detail>
        <Detail title="¿Qué quieres hacer?"><div className="grid grid-cols-2 gap-2">
          <Action soft onClick={()=>setMode("edit")}><span className="inline-flex items-center gap-1.5"><Pencil size={12}/>Editar</span></Action>
          {["pending","confirmed"].includes(selected.status)&&<Action soft onClick={()=>setMode("reschedule")}>Reprogramar</Action>}
          {selected.status==="pending"&&<Action onClick={()=>changeStatus(selected.id,"confirmed")}>Confirmar</Action>}
          {selected.status==="confirmed"&&<Action onClick={()=>changeStatus(selected.id,"in_progress")}>Iniciar visita</Action>}
          {["confirmed","in_progress"].includes(selected.status)&&<Link href={`/hub/appointments/${selected.id}/complete`} className="rounded-[14px] bg-espresso px-4 py-3 text-center text-[9px] uppercase tracking-[0.11em] text-ivory">Completar + Memoria</Link>}
          <Action soft onClick={()=>resendConfirmation(selected)}>Reenviar confirmación</Action>
          {["pending","confirmed"].includes(selected.status)&&<Action soft onClick={()=>changeStatus(selected.id,"cancelled")}>Cancelar</Action>}
          {["pending","confirmed"].includes(selected.status)&&<Action soft onClick={()=>changeStatus(selected.id,"no_show")}>No se presentó</Action>}
          {(role==="owner"||role==="admin")&&<button onClick={()=>deleteAppointment(selected.id)} className="rounded-[14px] border border-red-300 bg-red-50 px-4 py-3 text-center text-[9px] uppercase tracking-[0.11em] text-red-700">Eliminar cita</button>}
        </div></Detail>
      </div>}

      {mode==="edit"&&<EditAppointmentForm appt={selected} onCancel={()=>setMode("view")} onSaved={async()=>{setMode("view");await load();setActionMessage("Cita actualizada.")}}/>}
      {mode==="reschedule"&&<RescheduleForm appt={selected} services={services} onCancel={()=>setMode("view")} onDone={async(outcome)=>{setMode("view");await load();setActionMessage(outcome==="cancelled_reschedule_limit"?"Ya se había usado la única reprogramación permitida — esta cita se canceló y aplica el cargo de la política.":"Cita reprogramada.");closePanel()}}/>}
    </aside></div>}
  </div>
}

function EditAppointmentForm({appt,onCancel,onSaved}:{appt:Appointment;onCancel:()=>void;onSaved:()=>void}){
  const [name,setName]=useState(appt.client_name);const [phone,setPhone]=useState(appt.client_phone);const [email,setEmail]=useState(appt.client_email||"");const [notes,setNotes]=useState(appt.notes_internal||"");const [saving,setSaving]=useState(false);const [error,setError]=useState<string|null>(null);
  async function save(){if(!name.trim()||!phone.trim())return;setSaving(true);setError(null);const {error:e}=await supabase.rpc("hub_update_appointment_details",{p_appointment_id:appt.id,p_client_name:name.trim(),p_client_phone:phone.trim(),p_client_email:email.trim()||null,p_notes_internal:notes.trim()||null});setSaving(false);if(e){setError(e.message);return;}onSaved()}
  return <div className="mt-6 space-y-4">
    <Detail title="Editar datos de la cita">
      <label className="block"><span className="block text-[9px] uppercase tracking-[0.12em] text-taupe mb-1.5">Nombre</span><input value={name} onChange={e=>setName(e.target.value)} className="w-full rounded-xl border border-taupe/25 bg-ivory px-3 py-2.5 text-[13px]"/></label>
      <label className="block"><span className="block text-[9px] uppercase tracking-[0.12em] text-taupe mb-1.5">Teléfono</span><input value={phone} onChange={e=>setPhone(e.target.value)} className="w-full rounded-xl border border-taupe/25 bg-ivory px-3 py-2.5 text-[13px]"/></label>
      <label className="block"><span className="block text-[9px] uppercase tracking-[0.12em] text-taupe mb-1.5">Email</span><input value={email} onChange={e=>setEmail(e.target.value)} className="w-full rounded-xl border border-taupe/25 bg-ivory px-3 py-2.5 text-[13px]"/></label>
      <label className="block"><span className="block text-[9px] uppercase tracking-[0.12em] text-taupe mb-1.5">Notas internas</span><textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={3} className="w-full rounded-xl border border-taupe/25 bg-ivory px-3 py-2.5 text-[13px]"/></label>
    </Detail>
    {error&&<p className="text-[11px] text-red-700">{error}</p>}
    <div className="grid grid-cols-2 gap-2"><button onClick={onCancel} className="rounded-[14px] border border-champagne/35 bg-white/50 px-4 py-3 text-[9px] uppercase tracking-[0.11em] text-mocha">Cancelar edición</button><button disabled={saving||!name.trim()||!phone.trim()} onClick={save} className="rounded-[14px] bg-espresso px-4 py-3 text-[9px] uppercase tracking-[0.11em] text-ivory disabled:opacity-50">{saving?"Guardando...":"Guardar cambios"}</button></div>
  </div>
}

function RescheduleForm({appt,services,onCancel,onDone}:{appt:Appointment;services:Service[];onCancel:()=>void;onDone:(outcome:string)=>void}){
  const [eligibleStaff,setEligibleStaff]=useState<{id:string;name:string}[]>([]);const [staffId,setStaffId]=useState(appt.staff_id);const [date,setDate]=useState(()=>new Date(appt.start_at).toLocaleDateString("en-CA",{timeZone:"America/New_York"}));const [slots,setSlots]=useState<string[]>([]);const [slot,setSlot]=useState("");const [loadingSlots,setLoadingSlots]=useState(true);const [saving,setSaving]=useState(false);const [error,setError]=useState<string|null>(null);
  useEffect(()=>{(async()=>{const {data}=await supabase.from("staff_services").select("staff:staff_id(id,name)").eq("service_id",appt.service_id);setEligibleStaff((((data as any[])||[]).map(x=>x.staff).filter(Boolean)))})()},[appt.service_id]);
  useEffect(()=>{if(!staffId||!date)return;setLoadingSlots(true);setSlots([]);setSlot("");(async()=>{const {data}=await supabase.rpc("get_available_slots",{p_staff_id:staffId,p_service_id:appt.service_id,p_date:date});setSlots(((data||[]) as {slot_start:string}[]).map(x=>x.slot_start));setLoadingSlots(false)})()},[staffId,date,appt.service_id]);
  async function confirm(){if(!slot)return;setSaving(true);setError(null);const {data,error:e}=await supabase.rpc("hub_reschedule_appointment",{p_appointment_id:appt.id,p_staff_id:staffId,p_start_at:slot});setSaving(false);if(e){setError(e.message);return;}onDone(String(data))}
  return <div className="mt-6 space-y-4">
    <Detail title="Nuevo horario">
      <label className="block"><span className="block text-[9px] uppercase tracking-[0.12em] text-taupe mb-1.5">Profesional</span><select value={staffId} onChange={e=>setStaffId(e.target.value)} className="w-full rounded-xl border border-taupe/25 bg-ivory px-3 py-2.5 text-[13px]">{eligibleStaff.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
      <label className="block"><span className="block text-[9px] uppercase tracking-[0.12em] text-taupe mb-1.5">Fecha</span><input type="date" min={new Date().toISOString().slice(0,10)} value={date} onChange={e=>setDate(e.target.value)} className="w-full rounded-xl border border-taupe/25 bg-ivory px-3 py-2.5 text-[13px]"/></label>
      <div><span className="block text-[9px] uppercase tracking-[0.12em] text-taupe mb-2">Horarios disponibles</span>{loadingSlots?<p className="text-[12px] text-taupe">Cargando...</p>:slots.length===0?<p className="text-[12px] text-taupe">Sin horarios ese día.</p>:<div className="grid grid-cols-3 gap-2">{slots.map(s=><button key={s} onClick={()=>setSlot(s)} className={`rounded-xl border py-2.5 text-[12px] ${slot===s?"border-espresso bg-espresso text-ivory":"border-champagne/30 bg-white/50"}`}>{new Date(s).toLocaleTimeString("es-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}</button>)}</div>}</div>
    </Detail>
    {error&&<p className="text-[11px] text-red-700">{error}</p>}
    <div className="grid grid-cols-2 gap-2"><button onClick={onCancel} className="rounded-[14px] border border-champagne/35 bg-white/50 px-4 py-3 text-[9px] uppercase tracking-[0.11em] text-mocha">Volver</button><button disabled={!slot||saving} onClick={confirm} className="rounded-[14px] bg-espresso px-4 py-3 text-[9px] uppercase tracking-[0.11em] text-ivory disabled:opacity-50">{saving?"Guardando...":"Confirmar reprogramación"}</button></div>
  </div>
}

function Select({value,onChange,options}:{value:string;onChange:(v:string)=>void;options:string[][]}){return <select value={value} onChange={e=>onChange(e.target.value)} className="rounded-[13px] border border-champagne/25 bg-white/65 px-3 py-3 text-[11px] outline-none">{options.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select>}
function Status({value}:{value:string}){return <span className="inline-flex w-fit rounded-full border border-champagne/35 bg-ivory/15 px-2.5 py-1 text-[8px] uppercase tracking-[0.08em] text-current">{statusLabels[value]||value}</span>}
function Detail({title,children}:{title:string;children:React.ReactNode}){return <section className="rounded-[20px] border border-champagne/25 bg-white/45 p-4"><p className="text-[8px] uppercase tracking-[0.2em] text-mocha">{title}</p><div className="mt-3 space-y-2.5">{children}</div></section>}
function Line({label,value}:{label:string;value:string}){return <div className="flex justify-between gap-4 text-[11px]"><span className="text-taupe">{label}</span><span className="text-right">{value}</span></div>}
function Action({children,onClick,soft=false}:{children:React.ReactNode;onClick:()=>void;soft?:boolean}){return <button onClick={onClick} className={`rounded-[14px] px-4 py-3 text-[9px] uppercase tracking-[0.11em] ${soft?"border border-champagne/35 bg-white/50 text-mocha":"bg-espresso text-ivory"}`}>{children}</button>}
function Empty({view}:{view:View}){return <div className="rounded-[22px] border border-dashed border-champagne/45 bg-white/35 px-5 py-12 text-center"><p className="font-serif text-[29px]">{view==="today"?"Nada en la lista de hoy.":view==="upcoming"?"No hay próximas citas.":"Todavía no hay historial de citas."}</p><p className="mt-2 text-[10px] text-taupe">{view==="history"?"Las citas completadas, canceladas y pasadas aparecerán aquí.":"Puedes crear una nueva cita cuando quieras."}</p>{view!=="history"&&<Link href="/hub/calendar?new=1" className="mt-4 inline-flex items-center gap-2 rounded-full bg-espresso px-4 py-2.5 text-[9px] uppercase tracking-[0.12em] text-ivory"><Plus size={13}/> Nueva cita</Link>}</div>}
function formatDate(v:string){return new Date(v).toLocaleDateString("es-US",{month:"long",day:"numeric",year:"numeric",timeZone:"America/New_York"})}
function shortDate(v:string){return new Date(v).toLocaleDateString("es-US",{month:"short",day:"numeric",timeZone:"America/New_York"})}
function formatTime(v:string){return new Date(v).toLocaleTimeString("es-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}
function minutesBetween(a:string,b:string){return Math.round((+new Date(b)-+new Date(a))/60000)}
function money(c:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format((c||0)/100)}
