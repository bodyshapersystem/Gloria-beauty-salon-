"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, DollarSign, Wallet } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Appointment={id:string;staff_id:string;service_id:string|null;service_category:string|null;status:string;start_at:string;price_cents:number|null};
type StaffInfo={id:string;name:string;photo_url:string|null;salon_percentage:number};
type Rule={staff_id:string;scope_type:"category"|"service";category:string|null;service_id:string|null;salon_percentage:number};
type Tip={staff_id:string;week_start:string;tip_cents:number};

export default function CorteSemanalPage(){
  const [allowed,setAllowed]=useState<boolean|null>(null);
  const [weekOffset,setWeekOffset]=useState(0);
  const [items,setItems]=useState<Appointment[]>([]);
  const [staff,setStaff]=useState<StaffInfo[]>([]);
  const [rules,setRules]=useState<Rule[]>([]);
  const [tips,setTips]=useState<Record<string,number>>({});
  const [draft,setDraft]=useState<Record<string,string>>({});
  const [saving,setSaving]=useState<string|null>(null);
  const [loading,setLoading]=useState(true);

  const week=useMemo(()=>weekRange(weekOffset),[weekOffset]);
  const isToday=useMemo(()=>{const d=new Date().toLocaleDateString("en-US",{weekday:"long",timeZone:"America/New_York"});return d==="Saturday"},[]);

  useEffect(()=>{(async()=>{
    const {data:{session}}=await supabase.auth.getSession();
    if(!session){setAllowed(false);setLoading(false);return;}
    const {data:profile}=await supabase.from("user_profiles").select("role").eq("auth_user_id",session.user.id).eq("active",true).maybeSingle();
    const ok=profile?.role==="owner"||profile?.role==="admin";
    setAllowed(ok);
    if(!ok){setLoading(false);return;}
  })()},[]);

  async function load(){
    setLoading(true);
    const weekStartStr=week.start.toISOString().slice(0,10);
    const [{data:s},{data:r},{data:a},{data:t}]=await Promise.all([
      supabase.from("staff").select("id,name,photo_url,salon_percentage").eq("active",true).order("name"),
      supabase.from("staff_commission_rules").select("staff_id,scope_type,category,service_id,salon_percentage"),
      supabase.from("appointments").select("id,staff_id,service_id,service_category,status,start_at,price_cents").gte("start_at",week.start.toISOString()).lt("start_at",week.end.toISOString()),
      supabase.from("weekly_tips").select("staff_id,week_start,tip_cents").eq("week_start",weekStartStr),
    ]);
    setStaff((((s as unknown) as StaffInfo[])||[]).map(x=>({...x,salon_percentage:Number(x.salon_percentage||0)})));
    setRules((((r as unknown) as Rule[])||[]).map(x=>({...x,salon_percentage:Number(x.salon_percentage||0)})));
    setItems(((a as unknown) as Appointment[])||[]);
    const tipMap:Record<string,number>={};
    (((t as unknown) as Tip[])||[]).forEach(x=>{tipMap[x.staff_id]=x.tip_cents});
    setTips(tipMap);
    setLoading(false);
  }
  useEffect(()=>{if(allowed)load()},[allowed,weekOffset]);

  const rows=useMemo(()=>staff.map(s=>{
    const completed=items.filter(x=>x.staff_id===s.id&&x.status==="completed");
    const revenue=completed.reduce((n,x)=>n+(x.price_cents||0),0);
    const salonCut=completed.reduce((sum,a)=>sum+Math.round((a.price_cents||0)*(effectivePct(s,a,rules)/100)),0);
    const commission=revenue-salonCut;
    const tipCents=tips[s.id]??0;
    return {staff:s,completedCount:completed.length,revenue,commission,tipCents,total:commission+tipCents};
  }).filter(r=>r.completedCount>0||tips[r.staff.id]!==undefined),[staff,items,rules,tips]);

  const grandTotal=useMemo(()=>rows.reduce((n,r)=>n+r.total,0),[rows]);
  const grandRevenue=useMemo(()=>rows.reduce((n,r)=>n+r.revenue,0),[rows]);

  function tipValue(staffId:string){return draft[staffId]!==undefined?draft[staffId]:(tips[staffId]!==undefined?String(tips[staffId]/100):"")}

  async function saveTip(staffId:string){
    const raw=tipValue(staffId).trim();
    const cents=raw===""?0:Math.round(Number(raw)*100);
    if(!Number.isFinite(cents)||cents<0)return;
    setSaving(staffId);
    const weekStartStr=week.start.toISOString().slice(0,10);
    const {error}=await supabase.rpc("hub_set_weekly_tip",{p_staff_id:staffId,p_week_start:weekStartStr,p_tip_cents:cents});
    setSaving(null);
    if(!error){setTips(prev=>({...prev,[staffId]:cents}));setDraft(prev=>{const next={...prev};delete next[staffId];return next})}
  }

  if(allowed===false)return <div className="py-16 text-center"><p className="font-serif text-[30px]">Esta sección es solo para dueña/admin.</p></div>;
  if(loading||allowed===null)return <div className="py-16 text-center"><p className="font-serif text-[30px]">Preparando el corte...</p></div>;

  return <div className="pb-8">
    <div className="flex items-start justify-between gap-4">
      <div><p className="text-[9px] uppercase tracking-[.22em] text-mocha">Gloria Hub · Cierre semanal</p><h1 className="mt-1 font-serif text-[34px] md:text-[48px] leading-none">Corte de la semana</h1><p className="mt-2 text-[11px] text-taupe">Comisión de cada profesional + propina semanal (manual), todo junto.</p></div>
      <Wallet size={26} className="text-[#7B3C48] shrink-0 mt-1"/>
    </div>

    {isToday&&weekOffset===0&&<div className="mt-5 rounded-[20px] bg-[#6F3642] px-5 py-4 text-white"><p className="font-serif text-[20px] leading-none">Hoy es tu día de corte 🎉</p><p className="mt-1.5 text-[10px] text-white/75">Confirma la propina de cada quien antes de cerrar la semana.</p></div>}

    <div className="mt-5 flex items-center justify-between rounded-[18px] border border-[#DACBBF] bg-white/60 px-4 py-3">
      <button onClick={()=>setWeekOffset(v=>v-1)} className="grid h-9 w-9 place-items-center rounded-full border border-champagne/35"><ChevronLeft size={16}/></button>
      <p className="font-serif text-[18px]">{weekLabel(week)}</p>
      <button onClick={()=>setWeekOffset(v=>Math.min(0,v+1))} disabled={weekOffset===0} className="grid h-9 w-9 place-items-center rounded-full border border-champagne/35 disabled:opacity-30"><ChevronRight size={16}/></button>
    </div>

    <div className="mt-5 grid grid-cols-2 gap-3">
      <div className="rounded-[20px] border border-[#DACBBF] bg-white/50 p-4"><p className="text-[8px] uppercase tracking-[.16em] text-taupe">Ingresos de la semana</p><p className="mt-2 font-serif text-[28px]">{money(grandRevenue)}</p></div>
      <div className="rounded-[20px] bg-[#4A352B] p-4 text-ivory"><p className="text-[8px] uppercase tracking-[.16em] text-champagne">A pagar (comisión + propina)</p><p className="mt-2 font-serif text-[28px]">{money(grandTotal)}</p></div>
    </div>

    <div className="mt-5 space-y-3">
      {rows.length===0?<p className="rounded-[18px] border border-dashed border-champagne/40 bg-white/40 px-5 py-8 text-center text-[12px] text-taupe">Sin actividad esta semana.</p>:rows.map(r=><div key={r.staff.id} className="rounded-[22px] border border-[#DACBBF] bg-white/65 p-4 md:p-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-[#EADFD7]">{r.staff.photo_url?<img src={r.staff.photo_url} alt={r.staff.name} className="h-full w-full object-cover"/>:<div className="grid h-full place-items-center font-serif text-[17px]">{r.staff.name[0]}</div>}</div>
          <div className="min-w-0 flex-1"><p className="font-serif text-[22px] leading-none">{r.staff.name}</p><p className="mt-1 text-[9px] text-taupe">{r.completedCount} servicios · {money(r.revenue)} generado</p></div>
          <div className="text-right shrink-0"><p className="text-[8px] uppercase tracking-[.12em] text-taupe">Comisión</p><p className="font-serif text-[20px] leading-none">{money(r.commission)}</p></div>
        </div>
        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2 items-end border-t border-[#E7DBD2] pt-4">
          <label className="block"><span className="mb-1 block text-[8px] uppercase tracking-[.12em] text-taupe">Propina de la semana ($)</span><input inputMode="decimal" value={tipValue(r.staff.id)} onChange={e=>setDraft(prev=>({...prev,[r.staff.id]:e.target.value}))} placeholder="0.00" className="w-full rounded-[13px] border border-[#D8C8BC] bg-white px-3.5 py-2.5 text-[13px] outline-none"/></label>
          <button onClick={()=>saveTip(r.staff.id)} disabled={saving===r.staff.id} className="rounded-[13px] bg-[#4A352B] px-4 py-2.5 text-[9px] uppercase tracking-[.1em] text-ivory disabled:opacity-50">{saving===r.staff.id?"Guardando...":"Guardar"}</button>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-[14px] bg-[#F4E8E2] px-4 py-3"><span className="inline-flex items-center gap-1.5 text-[10px] text-[#8A5A50]"><DollarSign size={13}/> Total a pagar</span><span className="font-serif text-[22px] text-[#6F3642]">{money(r.total)}</span></div>
      </div>)}
    </div>
    <p className="mt-5 text-[9px] leading-relaxed text-taupe">La propina se registra a mano porque no pasa por el sistema (efectivo, Venmo, etc). Puedes editarla cualquier día si hace falta corregir algo.</p>
  </div>
}

function weekRange(offset:number){const now=new Date();const start=new Date(now);const day=(start.getDay()+6)%7;start.setDate(start.getDate()-day+offset*7);start.setHours(0,0,0,0);const end=new Date(start);end.setDate(end.getDate()+7);return {start,end}}
function weekLabel(week:{start:Date;end:Date}){const last=new Date(week.end);last.setDate(last.getDate()-1);const sameMonth=week.start.getMonth()===last.getMonth();const startStr=week.start.toLocaleDateString("es-US",{month:"short",day:"numeric"});const endStr=last.toLocaleDateString("es-US",sameMonth?{day:"numeric"}:{month:"short",day:"numeric"});return `${startStr} – ${endStr}`}
function effectivePct(staff:StaffInfo,a:Appointment,rules:Rule[]){const sr=rules.find(r=>r.staff_id===staff.id&&r.scope_type==="service"&&r.service_id===a.service_id);if(sr)return Number(sr.salon_percentage||0);const cat=a.service_category||null;const cr=rules.find(r=>r.staff_id===staff.id&&r.scope_type==="category"&&r.category===cat);if(cr)return Number(cr.salon_percentage||0);return Number(staff.salon_percentage||0)}
function money(cents:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format((cents||0)/100)}
