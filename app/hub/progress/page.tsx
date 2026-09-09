"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarCheck2, ChevronRight, DollarSign, Pencil, Sparkles, TrendingUp, UsersRound, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Appointment={id:string;staff_id:string;service_id:string|null;service_category:string|null;status:string;start_at:string;price_cents:number|null;client_name:string;service:{name:string;category:string}|null};
type StaffInfo={id:string;name:string;photo_url:string|null;salon_percentage:number};
type Profile={role:"owner"|"admin"|"staff";staff_id:string|null};
type Rule={staff_id:string;scope_type:"category"|"service";category:string|null;service_id:string|null;salon_percentage:number};

type Period="week"|"month"|"year";

const wine="#6F3642";
const mocha="#4A352B";

export default function ProgressPage(){
  const [items,setItems]=useState<Appointment[]>([]);
  const [staff,setStaff]=useState<StaffInfo|null>(null);
  const [profile,setProfile]=useState<Profile|null>(null);
  const [allStaff,setAllStaff]=useState<StaffInfo[]>([]);
  const [rules,setRules]=useState<Rule[]>([]);
  const [period,setPeriod]=useState<Period>("week");
  const [loading,setLoading]=useState(true);
  const [agreementOpen,setAgreementOpen]=useState(false);

  async function load(){
    setLoading(true);
    const {data:{session}}=await supabase.auth.getSession();
    if(!session){setLoading(false);return;}
    const {data:profileRow}=await supabase.from("user_profiles").select("role,staff_id").eq("auth_user_id",session.user.id).eq("active",true).maybeSingle();
    const prof=(profileRow as Profile)||null;
    setProfile(prof);
    if(prof){
      const [{data:s},{data:r},{data:a}]=await Promise.all([
        supabase.from("staff").select("id,name,photo_url,salon_percentage").eq("active",true).order("name"),
        supabase.from("staff_commission_rules").select("staff_id,scope_type,category,service_id,salon_percentage"),
        supabase.from("appointments").select("id,staff_id,service_id,service_category,status,start_at,price_cents,client_name,service:service_id(name,category)").gte("start_at",new Date(new Date().getFullYear()-1,0,1).toISOString()).order("start_at",{ascending:false})
      ]);
      const staffRows=(((s as unknown) as StaffInfo[])||[]).map(x=>({...x,salon_percentage:Number(x.salon_percentage||0)}));
      const ruleRows=(((r as unknown) as Rule[])||[]).map(x=>({...x,salon_percentage:Number(x.salon_percentage||0)}));
      const appts=(((a as unknown) as Appointment[])||[]);
      setAllStaff(staffRows);
      setRules(ruleRows);
      const staffId=prof.staff_id;
      setStaff(staffId?staffRows.find(x=>x.id===staffId)||null:null);
      setItems(prof.role==="staff"&&staffId?appts.filter(x=>x.staff_id===staffId):appts);
    }
    setLoading(false);
  }
  useEffect(()=>{load()},[]);

  const range=useMemo(()=>periodRange(period),[period]);
  const current=useMemo(()=>items.filter(x=>{const d=new Date(x.start_at);return d>=range.start&&d<range.end}),[items,range]);
  const previous=useMemo(()=>items.filter(x=>{const d=new Date(x.start_at);return d>=range.prevStart&&d<range.start}),[items,range]);

  const stats=useMemo(()=>compute(current,allStaff,rules),[current,allStaff,rules]);
  const prevStats=useMemo(()=>compute(previous,allStaff,rules),[previous,allStaff,rules]);
  const delta=prevStats.revenue?Math.round(((stats.revenue-prevStats.revenue)/prevStats.revenue)*100):0;
  const byStaff=useMemo(()=>allStaff.map(s=>({staff:s,stats:compute(current.filter(x=>x.staff_id===s.id),allStaff,rules)})).filter(x=>x.stats.completed.length>0||x.stats.cancelled>0||x.stats.noShow>0).sort((a,b)=>b.stats.revenue-a.stats.revenue),[current,allStaff,rules]);

  if(loading)return <div className="py-20 text-center"><p className="font-serif text-[30px]">Preparando tu semana...</p></div>;
  if(!profile)return <div className="py-20 text-center"><p className="font-serif text-[30px]">No encontramos tu perfil.</p></div>;
  const isSalon=profile.role==="owner"||profile.role==="admin";

  return <div className="pb-5">
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 overflow-hidden rounded-full bg-[#EADFD7]">
          {staff?.photo_url?<img src={staff.photo_url} alt={staff.name} className="h-full w-full object-cover"/>:<div className="grid h-full place-items-center font-serif text-[22px]">{isSalon?"G":staff?.name?.[0]||"T"}</div>}
        </div>
        <div><p className="text-[9px] uppercase tracking-[.22em] text-mocha">{isSalon?"Gloria Hub":"Gloria Team"} · Progress</p><h1 className="mt-1 font-serif text-[34px] md:text-[48px] leading-none">{isSalon?"El pulso del salón":`Hola, ${staff?.name||"Team"}`}</h1></div>
      </div>
      {!isSalon&&staff&&<button onClick={()=>setAgreementOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-[#D8C5B5] bg-white/70 px-4 py-2.5 text-[9px] text-mocha"><Pencil size={13}/> Mi acuerdo</button>}
    </div>

    <div className="mt-5 inline-flex rounded-full bg-[#EDE4DC] p-1">
      {(["week","month","year"] as Period[]).map(p=><button key={p} onClick={()=>setPeriod(p)} className={`rounded-full px-4 py-2 text-[9px] transition ${period===p?"bg-[#4A352B] text-ivory shadow-sm":"text-taupe"}`}>{p==="week"?"Semana":p==="month"?"Mes":"Año"}</button>)}
    </div>

    <section className="mt-5 relative overflow-hidden rounded-[28px] border border-[#7D4A4F]/25 p-6 md:p-7 text-white shadow-[0_18px_45px_rgba(83,38,46,.18)]" style={{backgroundImage:"radial-gradient(circle at 18% 15%, rgba(255,225,218,.28), transparent 30%), radial-gradient(circle at 85% 80%, rgba(255,255,255,.10), transparent 28%), repeating-radial-gradient(ellipse at 20% 30%, rgba(255,255,255,.055) 0 1px, transparent 2px 11px), linear-gradient(135deg,#7B3C48 0%,#5B2936 44%,#3F2B2B 100%)"}}>
      <div className="absolute -right-8 -bottom-14 h-40 w-56 rotate-[-16deg] rounded-[48%] bg-[#D9A7A6]/20 blur-2xl"/>
      <p className="relative text-[9px] uppercase tracking-[.24em] text-[#EFD9D5]">{isSalon?"Resumen del salón":"Tu corte"}</p>
      <div className="relative mt-4 grid gap-5 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-serif text-[52px] md:text-[64px] leading-none">{money(stats.revenue)}</p>
          <p className="mt-2 text-[10px] text-white/65">generado en servicios completados</p>
        </div>
        <div className="rounded-[20px] border border-white/12 bg-black/10 px-5 py-4 md:min-w-[250px]">
          <Row label={isSalon?"Para el salón":"Para Gloria / salón"} value={money(stats.salonCut)} light/>
          <div className="my-3 h-px bg-white/12"/>
          <Row label={isSalon?"Para el team":"Para ti"} value={money(stats.staffCut)} strong light/>
        </div>
      </div>
      <div className="relative mt-5 flex flex-wrap gap-2">
        <span className="rounded-full bg-white/10 px-3 py-1.5 text-[8px] text-[#F7E8E5]">{delta>=0?"+":""}{delta}% vs. período anterior</span>
        <span className="rounded-full bg-white/10 px-3 py-1.5 text-[8px] text-[#F7E8E5]">{stats.clients} clientas</span>
        <span className="rounded-full bg-white/10 px-3 py-1.5 text-[8px] text-[#F7E8E5]">{stats.completed.length} servicios</span>
      </div>
    </section>

    {isSalon&&<section className="mt-5 rounded-[28px] border border-[#DACBBF] bg-[#FCF9F5] p-5 md:p-6 shadow-[0_12px_34px_rgba(52,38,31,.05)]">
      <div className="flex items-center justify-between"><div><p className="text-[8px] uppercase tracking-[.2em] text-mocha">Por profesional</p><h2 className="mt-1 font-serif text-[30px]">Cada quien, por separado</h2></div><UsersRound size={18} className="text-[#7B3C48]"/></div>
      {byStaff.length===0?<p className="mt-5 text-[11px] text-taupe">Sin actividad de ningún profesional en este período.</p>:<div className="mt-5 divide-y divide-[#E4D9D0]">{byStaff.map(({staff:s,stats:st})=><div key={s.id} className="flex items-center gap-3 py-3.5"><div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#EADFD7]">{s.photo_url?<img src={s.photo_url} alt={s.name} className="h-full w-full object-cover"/>:<div className="grid h-full place-items-center font-serif text-[15px]">{s.name[0]}</div>}</div><div className="min-w-0 flex-1"><p className="font-serif text-[20px] leading-none truncate">{s.name}</p><p className="mt-1 text-[9px] text-taupe">{st.completed.length} servicios · {st.clients} clientas</p></div><div className="text-right shrink-0"><p className="font-serif text-[19px] leading-none">{money(st.revenue)}</p><p className="mt-1 text-[8px] text-taupe">para ella: {money(st.staffCut)}</p></div></div>)}</div>}
      <p className="mt-4 text-[9px] text-taupe leading-relaxed">Cada monto es exclusivamente lo que generó y le corresponde a esa profesional — no se mezcla con el resto del equipo.</p>
    </section>}

    <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
      <PrettyStat value={String(stats.clients)} label="Clientas" tone="nude"/>
      <PrettyStat value={String(stats.completed.length)} label="Servicios" tone="dust"/>
      <PrettyStat value={money(stats.avg)} label="Ticket promedio" tone="cream"/>
      <PrettyStat value={stats.top?.name||"—"} label="Más vendido" tone="wine" small/>
    </div>

    <div className="mt-5 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
      <section className="rounded-[28px] border border-[#DACBBF] bg-[#FCF9F5] p-5 md:p-6 shadow-[0_12px_34px_rgba(52,38,31,.05)]">
        <div className="flex items-center justify-between"><div><p className="text-[8px] uppercase tracking-[.2em] text-mocha">Mis ingresos</p><h2 className="mt-1 font-serif text-[32px]">Por día</h2></div><TrendingUp size={18} className="text-[#7B3C48]"/></div>
        <div className="mt-6 flex h-[170px] items-end gap-2">
          {stats.daily.map((d,i)=><div key={d.label} className="flex flex-1 flex-col items-center gap-2"><span className="text-[8px] text-taupe">{d.value?money(d.value):""}</span><div className="w-full max-w-[46px] rounded-t-[10px] bg-[linear-gradient(180deg,#B98188,#7A3D48)]" style={{height:`${Math.max(8,(d.value/stats.maxDaily)*120)}px`,opacity:d.value?1:.18}}/><span className="text-[8px] uppercase text-taupe">{d.label}</span></div>)}
        </div>
        <div className="mt-6 border-t border-[#E4D9D0] pt-4 space-y-3">
          {stats.byService.slice(0,5).map(s=><div key={s.name} className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-[12px] bg-[#F1E3E0] text-[#7A3D48]"><Sparkles size={14}/></span><div className="min-w-0 flex-1"><p className="truncate font-serif text-[18px]">{s.name}</p><p className="text-[8px] text-taupe">{s.count} servicios</p></div><p className="text-[11px] font-medium text-mocha">{money(s.value)}</p></div>)}
        </div>
      </section>

      <div className="space-y-5">
        <section className="relative overflow-hidden rounded-[28px] border border-[#DCCFC5] bg-[#F4E8E2] p-6">
          <div className="absolute right-[-30px] top-[-30px] h-36 w-36 rounded-full bg-white/55 blur-xl"/>
          <p className="relative text-[8px] uppercase tracking-[.2em] text-[#8A5A50]">Mi desempeño</p>
          <p className="relative mt-2 font-serif text-[42px] leading-none">{delta>=0?"+":""}{delta}%</p>
          <p className="relative mt-1 text-[9px] text-taupe">vs. período anterior</p>
          <div className="relative mt-5 grid grid-cols-2 gap-2"><Mini label="Completadas" value={String(stats.completed.length)}/><Mini label="Canceladas" value={String(stats.cancelled)}/><Mini label="No shows" value={String(stats.noShow)}/><Mini label="Clientas" value={String(stats.clients)}/></div>
        </section>

        <section className="relative overflow-hidden rounded-[28px] border border-[#D7C7BA] bg-[#F6EFE9] p-6" style={{backgroundImage:"radial-gradient(circle at 100% 0%,rgba(255,255,255,.8),transparent 38%),linear-gradient(135deg,#F8F2EC,#E8D4CC)"}}>
          <p className="font-serif italic text-[30px] leading-[1.05] text-[#563A32]">Disciplina hoy,<br/>resultados siempre.</p>
          <p className="mt-4 text-[9px] uppercase tracking-[.22em] text-taupe">Beauty lives here.</p>
        </section>
      </div>
    </div>

    {agreementOpen&&staff&&<AgreementModal staff={staff} onClose={()=>setAgreementOpen(false)} onSaved={async()=>{setAgreementOpen(false);await load()}}/>}
  </div>
}

function AgreementModal({staff,onClose,onSaved}:{staff:StaffInfo;onClose:()=>void;onSaved:()=>void}){
  const [pct,setPct]=useState(String(staff.salon_percentage));
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState<string|null>(null);
  async function save(){
    const n=Number(pct);
    if(!Number.isFinite(n)||n<0||n>100){setError("Ingresa un porcentaje entre 0 y 100.");return;}
    setSaving(true);setError(null);
    const {error:e}=await supabase.rpc("staff_update_own_agreement",{p_salon_percentage:n});
    setSaving(false);
    if(e){setError(e.message);return;}
    onSaved();
  }
  return <div className="fixed inset-0 z-[120] flex items-end justify-center bg-[#2E2724]/45 backdrop-blur-[2px] md:items-center" onClick={onClose}>
    <div className="w-full max-w-[520px] rounded-t-[30px] bg-[#FBF8F3] p-6 md:rounded-[30px]" onClick={e=>e.stopPropagation()}>
      <div className="flex items-start justify-between"><div><p className="text-[8px] uppercase tracking-[.2em] text-mocha">Mi acuerdo</p><h3 className="mt-2 font-serif text-[34px]">Configura tu corte</h3><p className="mt-2 text-[10px] leading-relaxed text-taupe">Este porcentaje se usa para calcular automáticamente cuánto corresponde a Gloria Beauty Salon y cuánto queda para ti.</p></div><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-[#DCCBC0]"><X size={18}/></button></div>
      <label className="mt-6 block"><span className="text-[8px] uppercase tracking-[.16em] text-taupe">Porcentaje para Gloria</span><div className="mt-2 flex items-center rounded-[18px] border border-[#D9C8BB] bg-white px-4"><input inputMode="decimal" value={pct} onChange={e=>setPct(e.target.value)} className="w-full bg-transparent py-4 text-[22px] font-serif outline-none"/><span className="text-[13px] text-mocha">%</span></div></label>
      <div className="mt-5 rounded-[20px] bg-[#F1E3DE] p-4"><p className="text-[8px] uppercase tracking-[.16em] text-[#8A5A50]">Ejemplo</p><Row label="Si generas" value="$1,000"/><Row label={`Para Gloria (${pct||0}%)`} value={`− $${Math.round(1000*(Number(pct||0)/100))}`}/><Row label="Para ti" value={`$${Math.round(1000*(1-Number(pct||0)/100))}`} strong/></div>
      {error&&<p className="mt-4 text-[10px] text-red-700">{error}</p>}
      <button onClick={save} disabled={saving} className="mt-6 w-full rounded-full bg-[#4A352B] px-5 py-4 text-[9px] uppercase tracking-[.14em] text-ivory disabled:opacity-50">{saving?"Guardando…":"Guardar acuerdo"}</button>
    </div>
  </div>
}

function compute(items:Appointment[],staffRows:StaffInfo[],rules:Rule[]){
  const completed=items.filter(x=>x.status==="completed");
  const revenue=completed.reduce((s,x)=>s+(x.price_cents||0),0);
  const salonCut=completed.reduce((sum,a)=>{const st=staffRows.find(s=>s.id===a.staff_id);if(!st)return sum;return sum+Math.round((a.price_cents||0)*(effectivePct(st,a,rules)/100))},0);
  const clients=new Set(completed.map(x=>x.client_name.trim().toLowerCase()).filter(Boolean)).size;
  const avg=completed.length?Math.round(revenue/completed.length):0;
  const map=new Map<string,{count:number,value:number}>();
  completed.forEach(x=>{const n=x.service?.name||"Servicio";const v=map.get(n)||{count:0,value:0};v.count++;v.value+=x.price_cents||0;map.set(n,v)});
  const byService=[...map.entries()].map(([name,v])=>({name,...v})).sort((a,b)=>b.value-a.value);
  const dailyBase=[{label:"L",day:1},{label:"M",day:2},{label:"X",day:3},{label:"J",day:4},{label:"V",day:5},{label:"S",day:6},{label:"D",day:0}];
  const daily=dailyBase.map(d=>({label:d.label,value:completed.filter(x=>new Date(x.start_at).getDay()===d.day).reduce((s,x)=>s+(x.price_cents||0),0)}));
  return {completed,revenue,clients,avg,top:byService[0],byService,daily,maxDaily:Math.max(1,...daily.map(x=>x.value)),salonCut,staffCut:revenue-salonCut,cancelled:items.filter(x=>x.status==="cancelled").length,noShow:items.filter(x=>x.status==="no_show").length};
}
function periodRange(period:Period){const now=new Date();if(period==="week"){const start=new Date(now);const day=(start.getDay()+6)%7;start.setDate(start.getDate()-day);start.setHours(0,0,0,0);const end=new Date(start);end.setDate(end.getDate()+7);const prevStart=new Date(start);prevStart.setDate(prevStart.getDate()-7);return{start,end,prevStart}}if(period==="month"){const start=new Date(now.getFullYear(),now.getMonth(),1);const end=new Date(now.getFullYear(),now.getMonth()+1,1);const prevStart=new Date(now.getFullYear(),now.getMonth()-1,1);return{start,end,prevStart}}const start=new Date(now.getFullYear(),0,1);const end=new Date(now.getFullYear()+1,0,1);const prevStart=new Date(now.getFullYear()-1,0,1);return{start,end,prevStart}}
function PrettyStat({value,label,tone,small=false}:{value:string;label:string;tone:"nude"|"dust"|"cream"|"wine";small?:boolean}){const cls={nude:"bg-[#EEE0D5]",dust:"bg-[#E8D0CF]",cream:"bg-[#F5ECE3]",wine:"bg-[#6F3642] text-white"}[tone];return <div className={`relative overflow-hidden rounded-[22px] border border-white/35 p-4 shadow-[0_8px_24px_rgba(52,38,31,.04)] ${cls}`}><span className="absolute -right-8 -bottom-8 h-20 w-24 rounded-full bg-white/20 blur-xl"/><p className={`relative font-serif leading-none ${small?"text-[18px]":"text-[30px]"}`}>{value}</p><p className="relative mt-2 text-[8px] uppercase tracking-[.14em] opacity-65">{label}</p></div>}
function Mini({label,value}:{label:string;value:string}){return <div className="rounded-[16px] border border-white/45 bg-white/45 p-3"><p className="text-[8px] uppercase tracking-[.12em] text-taupe">{label}</p><p className="mt-1 font-serif text-[24px]">{value}</p></div>}
function Row({label,value,strong=false,light=false}:{label:string;value:string;strong?:boolean;light?:boolean}){return <div className="mt-2 flex items-center justify-between gap-4"><span className={`text-[10px] ${light?"text-white/65":"text-taupe"}`}>{label}</span><span className={`${strong?"font-serif text-[24px]":"text-[12px] font-medium"} ${light?"text-white":""}`}>{value}</span></div>}
function money(cents:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format((cents||0)/100)}
function fmtPct(n:number){return Number.isInteger(Number(n))?String(Number(n)):Number(n).toFixed(1)}

function effectivePct(staff:StaffInfo,a:Appointment,rules:Rule[]){const sr=rules.find(r=>r.staff_id===staff.id&&r.scope_type==="service"&&r.service_id===a.service_id);if(sr)return Number(sr.salon_percentage||0);const cat=a.service_category||a.service?.category||null;const cr=rules.find(r=>r.staff_id===staff.id&&r.scope_type==="category"&&r.category===cat);if(cr)return Number(cr.salon_percentage||0);return Number(staff.salon_percentage||0)}
