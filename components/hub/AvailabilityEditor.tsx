"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Check, Clock3 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type DayRow={day_of_week:number;start_time:string;end_time:string};
const DAYS=[
  {day:1,label:"Lunes",note:"VIP / opcional"},
  {day:2,label:"Martes"},{day:3,label:"Miércoles"},{day:4,label:"Jueves"},{day:5,label:"Viernes"},{day:6,label:"Sábado"}
];

export function AvailabilityEditor(){
  const [rows,setRows]=useState<DayRow[]>([]);const [loading,setLoading]=useState(true);const [saving,setSaving]=useState(false);const [message,setMessage]=useState<string|null>(null);const [error,setError]=useState<string|null>(null);
  useEffect(()=>{(async()=>{const {data,error}=await supabase.rpc("team_my_schedule");if(!error)setRows(((data as DayRow[])||[]).map(r=>({...r,start_time:r.start_time.slice(0,5),end_time:r.end_time.slice(0,5)})));setLoading(false)})()},[]);
  const byDay=useMemo(()=>new Map(rows.map(r=>[r.day_of_week,r])),[rows]);
  function toggle(day:number){setMessage(null);setRows(v=>v.some(r=>r.day_of_week===day)?v.filter(r=>r.day_of_week!==day):[...v,{day_of_week:day,start_time:"09:00",end_time:"17:00"}].sort((a,b)=>a.day_of_week-b.day_of_week))}
  function setTime(day:number,key:"start_time"|"end_time",value:string){setRows(v=>v.map(r=>r.day_of_week===day?{...r,[key]:value}:r))}
  async function save(){setSaving(true);setMessage(null);setError(null);const payload=rows.map(r=>({day_of_week:r.day_of_week,start_time:r.start_time,end_time:r.end_time}));const {error}=await supabase.rpc("team_set_my_schedule",{p_schedule:payload});setSaving(false);if(error){setError(error.message);return;}setMessage("Disponibilidad actualizada ✨")}
  return <section className="mt-6 overflow-hidden rounded-[24px] border border-[#DCCFC5] bg-white/55">
    <div className="border-b border-[#E6D9CF] p-5 md:p-6"><div className="flex items-center gap-2 text-[#6F3642]"><CalendarClock size={18}/><p className="text-[9px] uppercase tracking-[.2em]">Mi disponibilidad</p></div><h2 className="mt-2 font-serif text-[32px]">¿Cuándo estás disponible?</h2><p className="mt-2 max-w-[560px] text-[11px] leading-relaxed text-taupe">Activa o desactiva cada día y ajusta tus horas. El lunes queda disponible para citas VIP cuando tú decidas abrirlo.</p></div>
    <div className="p-4 md:p-6">{loading?<p className="text-[11px] text-taupe">Cargando horario…</p>:<div className="space-y-2">{DAYS.map(d=>{const row=byDay.get(d.day);const enabled=Boolean(row);return <div key={d.day} className={`rounded-[18px] border p-4 ${enabled?"border-[#7B3C48]/25 bg-[#FBF4F1]":"border-[#E5D9D0] bg-[#FAF8F5]"}`}><div className="flex items-center justify-between gap-3"><button onClick={()=>toggle(d.day)} className="flex items-center gap-3 text-left"><span className={`grid h-6 w-6 place-items-center rounded-full border ${enabled?"border-[#6F3642] bg-[#6F3642] text-white":"border-[#CDBDB1] bg-white text-transparent"}`}><Check size={13}/></span><span><span className="font-serif text-[21px] leading-none">{d.label}</span>{d.note&&<span className="ml-2 rounded-full bg-[#EAD6D1] px-2 py-1 text-[7px] uppercase tracking-[.1em] text-[#6F3642]">{d.note}</span>}</span></button><span className="text-[8px] uppercase tracking-[.12em] text-taupe">{enabled?"Disponible":"Off"}</span></div>{enabled&&row&&<div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3"><label><span className="mb-1 block text-[7px] uppercase tracking-[.12em] text-taupe">Desde</span><input type="time" value={row.start_time} onChange={e=>setTime(d.day,"start_time",e.target.value)} className="w-full rounded-[13px] border border-[#D9CBC0] bg-white px-3 py-3 text-[12px]"/></label><Clock3 size={14} className="mt-4 text-taupe"/><label><span className="mb-1 block text-[7px] uppercase tracking-[.12em] text-taupe">Hasta</span><input type="time" value={row.end_time} onChange={e=>setTime(d.day,"end_time",e.target.value)} className="w-full rounded-[13px] border border-[#D9CBC0] bg-white px-3 py-3 text-[12px]"/></label></div>}</div>})}</div>}
      {error&&<p className="mt-4 text-[10px] text-red-700">{error}</p>}{message&&<p className="mt-4 text-[10px] text-[#6F3642]">{message}</p>}<button onClick={save} disabled={saving||loading} className="mt-5 w-full rounded-full bg-[#6F3642] px-5 py-4 text-[9px] uppercase tracking-[.14em] text-white disabled:opacity-40">{saving?"Guardando…":"Guardar disponibilidad"}</button>
    </div>
  </section>
}
