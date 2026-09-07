"use client";

import { useEffect, useMemo, useState } from "react";
import { Clock3, Sparkles, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Staff={id:string;name:string};
type HubUser={role:"owner"|"admin"|"staff";staff_id:string|null};
export type MeTimeBlock={id:string;staff_id:string;start_at:string;end_at:string;reason:string|null;staff_name?:string|null};

export function MeTimeSheet({
  open,onClose,onSaved,staff,user,selectedDate,editing
}:{
  open:boolean;
  onClose:()=>void;
  onSaved:()=>void;
  staff:Staff[];
  user:HubUser|null;
  selectedDate:Date;
  editing:MeTimeBlock|null;
}){
  const defaultDate=useMemo(()=>selectedDate.toLocaleDateString("en-CA"),[selectedDate]);
  const [staffId,setStaffId]=useState("");
  const [date,setDate]=useState(defaultDate);
  const [start,setStart]=useState("12:00");
  const [end,setEnd]=useState("13:00");
  const [reason,setReason]=useState("");
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState("");

  useEffect(()=>{
    if(!open)return;
    if(editing){
      setStaffId(editing.staff_id);
      setDate(new Date(editing.start_at).toLocaleDateString("en-CA",{timeZone:"America/New_York"}));
      setStart(toTimeInput(editing.start_at));
      setEnd(toTimeInput(editing.end_at));
      setReason(editing.reason||"");
    }else{
      setStaffId(user?.role==="staff"?(user.staff_id||""):(staff[0]?.id||""));
      setDate(defaultDate);
      setStart("12:00");
      setEnd("13:00");
      setReason("");
    }
    setError("");
  },[open,editing,user,staff,defaultDate]);

  async function save(){
    setError("");
    if(!staffId||!date||!start||!end){setError("Completa profesional, fecha y horario.");return;}
    const startAt=new Date(`${date}T${start}:00`);
    const endAt=new Date(`${date}T${end}:00`);
    if(!(endAt>startAt)){setError("La hora final debe ser después de la inicial.");return;}
    setSaving(true);
    const {data:{session}}=await supabase.auth.getSession();

    const {data:conflictingAppointments}=await supabase
      .from("appointments")
      .select("id")
      .eq("staff_id",staffId)
      .neq("status","cancelled")
      .lt("start_at",endAt.toISOString())
      .gt("end_at",startAt.toISOString())
      .limit(1);

    const blocksQuery=supabase
      .from("staff_blocks")
      .select("id")
      .eq("staff_id",staffId)
      .lt("start_at",endAt.toISOString())
      .gt("end_at",startAt.toISOString());
    if(editing)blocksQuery.neq("id",editing.id);
    const {data:conflictingBlocks}=await blocksQuery.limit(1);

    if((conflictingAppointments?.length||0)>0||(conflictingBlocks?.length||0)>0){
      setSaving(false);
      setError("Ese horario ya tiene una cita o un bloqueo.");
      return;
    }

    const payload={
      staff_id:staffId,
      start_at:startAt.toISOString(),
      end_at:endAt.toISOString(),
      reason:reason.trim()||null,
      created_by:session?.user.id||null
    };
    const result=editing
      ?await supabase.from("staff_blocks").update(payload).eq("id",editing.id)
      :await supabase.from("staff_blocks").insert(payload);
    setSaving(false);
    if(result.error){setError(result.error.message);return;}
    onSaved();onClose();
  }

  async function remove(){
    if(!editing)return;
    setSaving(true);
    const {error}=await supabase.from("staff_blocks").delete().eq("id",editing.id);
    setSaving(false);
    if(error){setError(error.message);return;}
    onSaved();onClose();
  }

  if(!open)return null;
  const visibleStaff=user?.role==="staff"?staff.filter(s=>s.id===user.staff_id):staff;

  return <div className="fixed inset-0 z-[100] bg-espresso/35 backdrop-blur-[2px] flex justify-end" onClick={onClose}>
    <aside className="h-full w-full max-w-[440px] overflow-y-auto bg-[#FBF8F3] shadow-[-24px_0_60px_rgba(52,38,31,.13)]" onClick={e=>e.stopPropagation()}>
      <div className="relative overflow-hidden bg-[linear-gradient(145deg,#F4E6DB,#E5CEC0)] px-6 py-7">
        <div className="pointer-events-none absolute -right-16 -top-14 h-48 w-48 rounded-full border-[18px] border-white/25"/>
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#7B3C48]/15 bg-white/45 px-3 py-1.5 text-[8px] uppercase tracking-[.18em] text-[#6F3642]"><Sparkles size={12}/> Personal block</span>
            <h2 className="mt-4 font-serif text-[43px] leading-none text-espresso">Me Time</h2>
            <p className="mt-3 max-w-[300px] text-[11px] leading-relaxed text-taupe">Reserva un espacio para ti. No aparecerá como servicio y ese horario quedará bloqueado.</p>
          </div>
          <button onClick={onClose} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#8B6F60]/25 bg-white/55"><X size={19}/></button>
        </div>
      </div>

      <div className="space-y-5 p-6">
        <label className="block"><span className="mb-2 block text-[8px] uppercase tracking-[.16em] text-taupe">Para quién</span>
          <select disabled={user?.role==="staff"} value={staffId} onChange={e=>setStaffId(e.target.value)} className="w-full rounded-[15px] border border-[#DCCCBF] bg-white/80 px-4 py-3.5 text-[13px] outline-none">
            {visibleStaff.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </label>

        <label className="block"><span className="mb-2 block text-[8px] uppercase tracking-[.16em] text-taupe">Fecha</span>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="w-full rounded-[15px] border border-[#DCCCBF] bg-white/80 px-4 py-3.5 text-[13px] outline-none"/>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label><span className="mb-2 block text-[8px] uppercase tracking-[.16em] text-taupe">Desde</span><input type="time" value={start} onChange={e=>setStart(e.target.value)} className="w-full rounded-[15px] border border-[#DCCCBF] bg-white/80 px-4 py-3.5 text-[13px] outline-none"/></label>
          <label><span className="mb-2 block text-[8px] uppercase tracking-[.16em] text-taupe">Hasta</span><input type="time" value={end} onChange={e=>setEnd(e.target.value)} className="w-full rounded-[15px] border border-[#DCCCBF] bg-white/80 px-4 py-3.5 text-[13px] outline-none"/></label>
        </div>

        <label className="block"><span className="mb-2 block text-[8px] uppercase tracking-[.16em] text-taupe">¿Qué es? · opcional</span>
          <input value={reason} onChange={e=>setReason(e.target.value)} placeholder="Dentista, manicure, almuerzo…" className="w-full rounded-[15px] border border-[#DCCCBF] bg-white/80 px-4 py-3.5 text-[13px] outline-none placeholder:text-taupe/55"/>
        </label>

        <div className="rounded-[18px] border border-[#D9C5BA] bg-[#F2E4DC] p-4">
          <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#6F3642] text-white"><Clock3 size={17}/></span><div><p className="font-serif text-[20px]">Me Time</p><p className="mt-0.5 text-[9px] text-taupe">{reason.trim()||"Tu espacio personal"}</p></div></div>
        </div>

        {error&&<p className="rounded-[14px] bg-[#F7E3E0] px-4 py-3 text-[10px] text-[#7B3C48]">{error}</p>}

        <button disabled={saving} onClick={save} className="w-full rounded-full bg-[#4A352B] px-5 py-4 text-[9px] uppercase tracking-[.16em] text-white disabled:opacity-50">{saving?"Guardando…":editing?"Guardar cambios":"Bloquear este espacio"}</button>

        {editing&&<button disabled={saving} onClick={remove} className="flex w-full items-center justify-center gap-2 rounded-full border border-[#7B3C48]/20 px-5 py-3.5 text-[9px] uppercase tracking-[.13em] text-[#7B3C48]"><Trash2 size={14}/> Eliminar Me Time</button>}
      </div>
    </aside>
  </div>
}

function toTimeInput(v:string){return new Date(v).toLocaleTimeString("en-GB",{hour:"2-digit",minute:"2-digit",hour12:false,timeZone:"America/New_York"})}
