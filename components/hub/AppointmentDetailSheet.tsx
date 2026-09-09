"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Save, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Appointment={
  id:string;client_id:string|null;client_name:string;client_phone:string|null;client_email:string|null;
  start_at:string;end_at:string;status:string;source:string|null;notes_internal:string|null;
  price_cents:number|null;deposit_cents:number|null;service:{name:string;price_label:string|null}|null;
  staff:{name:string}|null;client:{client_type:string|null}|null;
};
type Service={id:string;name:string;category:string;duration_minutes:number;price_label:string|null};

const statusLabels:Record<string,string>={pending:"Pendiente",confirmed:"Confirmada",in_progress:"En curso",completed:"Completada",cancelled:"Cancelada",no_show:"No se presentó"};
const clientTypeLabels:Record<string,string>={new:"Nueva",regular:"Regular",ambassador:"Ambassador",vip:"VIP Client",team:"Team"};

export function AppointmentDetailSheet({appointmentId,onClose,onSaved}:{appointmentId:string;onClose:()=>void;onSaved:()=>void}){
  const [appointment,setAppointment]=useState<Appointment|null>(null);
  const [services,setServices]=useState<Service[]>([]);
  const [clientName,setClientName]=useState("");
  const [clientPhone,setClientPhone]=useState("");
  const [clientEmail,setClientEmail]=useState("");
  const [notes,setNotes]=useState("");
  const [total,setTotal]=useState("");
  const [depositPaid,setDepositPaid]=useState(false);
  const [deposit,setDeposit]=useState("");
  const [extraServiceId,setExtraServiceId]=useState("");
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState<string|null>(null);

  async function load(){
    setMessage(null);
    const [{data:a,error},{data:s}]=await Promise.all([
      supabase.from("appointments").select("id,client_id,client_name,client_phone,client_email,start_at,end_at,status,source,notes_internal,price_cents,deposit_cents,service:service_id(name,price_label),staff:staff_id(name),client:client_id(client_type)").eq("id",appointmentId).single(),
      supabase.from("services").select("id,name,category,duration_minutes,price_label").eq("active",true).order("category").order("name")
    ]);
    if(error){setMessage(error.message);return;}
    const raw=((a as unknown) as any);
    const item={...raw,service:firstRelation(raw.service),staff:firstRelation(raw.staff),client:firstRelation(raw.client)} as Appointment;
    setAppointment(item);setServices(((s as unknown) as Service[])||[]);
    setClientName(item.client_name||"");setClientPhone(item.client_phone||"");setClientEmail(item.client_email||"");
    setNotes(item.notes_internal||"");setTotal(centsToInput(item.price_cents));setDepositPaid(Boolean(item.deposit_cents&&item.deposit_cents>0));setDeposit(centsToInput(item.deposit_cents));
  }

  useEffect(()=>{load()},[appointmentId]);

  const extraService=useMemo(()=>services.find(s=>s.id===extraServiceId)||null,[services,extraServiceId]);
  const clientType=appointment?.client?.client_type||"regular";
  const depositCents=depositPaid?inputToCents(deposit):0;
  const totalCents=inputToCents(total);
  const balance=Math.max(0,totalCents-depositCents);

  async function save(){
    if(!appointment)return;
    setSaving(true);setMessage(null);
    const {error}=await supabase.rpc("hub_update_appointment_details",{
      p_appointment_id:appointment.id,
      p_client_name:clientName.trim(),
      p_client_phone:clientPhone.trim(),
      p_client_email:clientEmail.trim()||null,
      p_notes_internal:notes.trim()||null,
      p_price_cents:totalCents,
      p_deposit_cents:depositCents
    });
    setSaving(false);
    if(error){setMessage(error.message);return;}
    setMessage("Cita actualizada.");
    await load();onSaved();
  }

  async function addExtra(){
    if(!appointment||!extraService)return;
    const extraPrice=parsePrice(extraService.price_label);
    const nextTotal=(appointment.price_cents||0)+extraPrice;
    const stamp=new Date().toLocaleString("es-US",{timeZone:"America/New_York"});
    const nextNotes=[notes,`Servicio agregado rapido (${stamp}): ${extraService.name}${extraService.price_label?` · ${extraService.price_label}`:""}`].filter(Boolean).join("\n");
    setSaving(true);setMessage(null);
    const {error}=await supabase.rpc("hub_update_appointment_details",{
      p_appointment_id:appointment.id,
      p_client_name:appointment.client_name,
      p_client_phone:appointment.client_phone||"",
      p_client_email:appointment.client_email||null,
      p_notes_internal:nextNotes,
      p_price_cents:nextTotal,
      p_deposit_cents:appointment.deposit_cents||0
    });
    setSaving(false);
    if(error){setMessage(error.message);return;}
    setExtraServiceId("");setMessage("Servicio extra agregado a la cita.");
    await load();onSaved();
  }

  async function changeStatus(next:string){
    if(!appointment)return;
    const reason=next==="cancelled"?window.prompt("Motivo de la cancelación (opcional)")||null:null;
    if(["cancelled","no_show"].includes(next)&&!window.confirm(`¿Marcar esta cita como ${(statusLabels[next]||next).toLowerCase()}?`))return;
    const {error}=await supabase.rpc("hub_update_appointment_status",{p_appointment_id:appointment.id,p_status:next,p_reason:reason});
    if(error){setMessage(error.message);return;}
    await load();onSaved();
  }

  async function deleteAppointment(){
    if(!appointment||!window.confirm("¿Eliminar esta cita? Esta acción la quita del calendario."))return;
    const {error}=await supabase.rpc("hub_delete_appointment",{p_appointment_id:appointment.id});
    if(error){setMessage(error.message);return;}
    onSaved();onClose();
  }

  return <div className="fixed inset-0 z-[90] flex justify-end bg-espresso/35 backdrop-blur-[2px]" onClick={onClose}>
    <aside className="h-full w-full max-w-[540px] overflow-y-auto bg-[#FBF8F3] p-5 md:p-7" onClick={e=>e.stopPropagation()}>
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-[8px] uppercase tracking-[0.22em] text-mocha">Cita</p><h2 className="mt-2 font-serif text-[38px] leading-none">{appointment?.client_name||"Cargando..."}</h2><div className="mt-3 flex flex-wrap gap-2">{appointment&&<Badge>{statusLabels[appointment.status]||appointment.status}</Badge>}{appointment&&<Badge tone={clientType==="team"?"team":clientType==="ambassador"?"ambassador":"default"}>{clientTypeLabels[clientType]||clientType}</Badge>}</div></div>
        <button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-champagne/35 bg-white/55"><X size={18}/></button>
      </div>

      {!appointment?<p className="mt-8 text-[12px] text-taupe">Abriendo detalle de la cita...</p>:<>
        <div className="mt-6 rounded-[22px] bg-espresso p-5 text-ivory">
          <p className="text-[8px] uppercase tracking-[0.16em] text-champagne">{formatDate(appointment.start_at)}</p>
          <p className="mt-2 font-serif text-[30px] leading-none">{formatTime(appointment.start_at)} - {formatTime(appointment.end_at)}</p>
          <p className="mt-3 text-[10px] text-ivory/65">{appointment.service?.name||"Cita"} con {appointment.staff?.name||"Equipo"}</p>
        </div>

        <Section title="Editar cita">
          <Field label="Clienta" value={clientName} set={setClientName}/>
          <Field label="Teléfono" value={clientPhone} set={setClientPhone}/>
          <Field label="Email" value={clientEmail} set={setClientEmail}/>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Monto total" value={total} set={setTotal} inputMode="decimal" prefix="$"/>
            <label className="block"><span className="mb-1.5 block text-[8px] uppercase tracking-[.14em] text-taupe">Depósito</span><select value={depositPaid?"yes":"no"} onChange={e=>setDepositPaid(e.target.value==="yes")} className="w-full rounded-[15px] border border-[#D8C8BC] bg-white px-4 py-3.5 text-[12px] outline-none"><option value="no">No pagó depósito</option><option value="yes">Sí pagó depósito</option></select></label>
          </div>
          {depositPaid&&<Field label="Monto depósito" value={deposit} set={setDeposit} inputMode="decimal" prefix="$"/>}
          <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={4} placeholder="Notas internas" className="w-full rounded-[15px] border border-[#D8C8BC] bg-white px-4 py-3.5 text-[12px] outline-none"/>
          <div className="rounded-[18px] border border-champagne/25 bg-[#F8F1EA] p-4">
            <Line label="Total" value={money(totalCents)}/><Line label="Depósito" value={depositPaid?money(depositCents):"No pagado"}/><Line label="Balance" value={money(balance)}/>
          </div>
          <button onClick={save} disabled={saving} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-espresso px-5 py-4 text-[9px] uppercase tracking-[0.14em] text-ivory disabled:opacity-50"><Save size={14}/>{saving?"Guardando...":"Guardar cambios"}</button>
        </Section>

        <Section title="Agregar más a la cita">
          <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
            <select value={extraServiceId} onChange={e=>setExtraServiceId(e.target.value)} className="rounded-[15px] border border-[#D8C8BC] bg-white px-4 py-3.5 text-[12px] outline-none"><option value="">Seleccionar servicio extra</option>{services.map(s=><option key={s.id} value={s.id}>{s.name}{s.price_label?` · ${s.price_label}`:""}</option>)}</select>
            <button onClick={addExtra} disabled={!extraServiceId||saving} className="inline-flex items-center justify-center gap-2 rounded-[15px] bg-[#6F3642] px-4 py-3 text-[9px] uppercase tracking-[0.12em] text-white disabled:opacity-40"><Plus size={14}/>Agregar</button>
          </div>
          <p className="text-[9px] leading-relaxed text-taupe">Esto suma el precio al total y deja el servicio extra registrado en notas internas.</p>
        </Section>

        <Section title="Acciones">
          <div className="grid grid-cols-2 gap-2">
            {appointment.status==="pending"&&<Action onClick={()=>changeStatus("confirmed")}>Confirmar</Action>}
            {appointment.status==="confirmed"&&<Action onClick={()=>changeStatus("in_progress")}>Iniciar visita</Action>}
            {["confirmed","in_progress"].includes(appointment.status)&&<Link href={`/hub/appointments/${appointment.id}/complete`} className="rounded-[14px] bg-espresso px-4 py-3 text-center text-[9px] uppercase tracking-[0.11em] text-ivory">Completar + progreso</Link>}
            <Link href="/hub/calendar?new=1" className="rounded-[14px] border border-mocha/25 bg-white/55 px-4 py-3 text-center text-[9px] uppercase tracking-[0.11em] text-mocha">Nueva cita</Link>
            {["pending","confirmed"].includes(appointment.status)&&<Action soft onClick={()=>changeStatus("cancelled")}>Cancelar</Action>}
            {["pending","confirmed"].includes(appointment.status)&&<Action soft onClick={()=>changeStatus("no_show")}>No se presentó</Action>}
            <button onClick={deleteAppointment} className="col-span-2 inline-flex items-center justify-center gap-2 rounded-[14px] border border-[#7B3C48]/25 bg-white/55 px-4 py-3 text-[9px] uppercase tracking-[0.11em] text-[#7B3C48]"><Trash2 size={14}/>Eliminar cita</button>
          </div>
        </Section>
      </>}
      {message&&<p className="mt-4 rounded-[15px] bg-[#EAD6D1]/45 px-4 py-3 text-[11px] text-mocha">{message}</p>}
    </aside>
  </div>
}

function Section({title,children}:{title:string;children:React.ReactNode}){return <section className="mt-5 rounded-[22px] border border-champagne/25 bg-white/55 p-4"><p className="text-[8px] uppercase tracking-[0.2em] text-mocha">{title}</p><div className="mt-4 space-y-3">{children}</div></section>}
function Field({label,value,set,inputMode,prefix}:{label:string;value:string;set:(v:string)=>void;inputMode?:"decimal";prefix?:string}){return <label className="block"><span className="mb-1.5 block text-[8px] uppercase tracking-[.14em] text-taupe">{label}</span><div className="relative">{prefix&&<span className="absolute left-4 top-1/2 -translate-y-1/2 text-[12px] text-taupe">{prefix}</span>}<input inputMode={inputMode} value={value} onChange={e=>set(e.target.value)} className={`w-full rounded-[15px] border border-[#D8C8BC] bg-white px-4 py-3.5 text-[12px] outline-none ${prefix?"pl-8":""}`}/></div></label>}
function Badge({children,tone="default"}:{children:React.ReactNode;tone?:"default"|"team"|"ambassador"}){const cls=tone==="team"?"bg-[#34261F] text-white":tone==="ambassador"?"bg-[#F5E3B3] text-[#6F3642]":"bg-[#EAD6D1] text-[#6F3642]";return <span className={`inline-flex rounded-full px-3 py-1.5 text-[8px] uppercase tracking-[0.1em] ${cls}`}>{children}</span>}
function Line({label,value}:{label:string;value:string}){return <div className="flex justify-between gap-4 text-[11px]"><span className="text-taupe">{label}</span><span className="font-medium text-mocha">{value}</span></div>}
function Action({children,onClick,soft=false}:{children:React.ReactNode;onClick:()=>void;soft?:boolean}){return <button onClick={onClick} className={`rounded-[14px] px-4 py-3 text-[9px] uppercase tracking-[0.11em] ${soft?"border border-champagne/35 bg-white/50 text-mocha":"bg-espresso text-ivory"}`}>{children}</button>}
function inputToCents(v:string){return Math.max(0,Math.round(Number(String(v).replace(/[^0-9.]/g,"")||0)*100))}
function centsToInput(v:number|null|undefined){return v?String((v/100).toFixed(2)).replace(/\.00$/,""):""}
function parsePrice(v:string|null|undefined){const match=(v||"").match(/\$([0-9]+(?:\.[0-9]{1,2})?)/);return match?Math.round(Number(match[1])*100):0}
function firstRelation<T>(v:T|T[]|null|undefined){return Array.isArray(v)?(v[0]||null):(v||null)}
function money(c:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format((c||0)/100)}
function formatDate(v:string){return new Date(v).toLocaleDateString("es-US",{weekday:"long",month:"long",day:"numeric",year:"numeric",timeZone:"America/New_York"})}
function formatTime(v:string){return new Date(v).toLocaleTimeString("es-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}