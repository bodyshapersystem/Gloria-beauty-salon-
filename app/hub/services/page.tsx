"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronRight, MoreHorizontal, Plus, Search, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Service={id:string;name:string;category:string;duration_minutes:number;price_label:string;active:boolean};

const meta:Record<string,{label:string;subtitle:string;bg:string}>={
  hair:{label:"Hair",subtitle:"Color, secado, corte, tratamientos y extensiones",bg:"linear-gradient(135deg,#6B4F43,#3E2C27)"},
  color:{label:"Color & Tintes",subtitle:"Balayage, highlights, raíces y tintes",bg:"linear-gradient(135deg,#7A3D48,#4B2D33)"},
  blowdry:{label:"Secado & Estilismo",subtitle:"Blowouts, ondas, peinados y braids",bg:"linear-gradient(135deg,#A98273,#6B4F43)"},
  cut:{label:"Corte",subtitle:"Dama, caballero y niños",bg:"linear-gradient(135deg,#59433A,#302521)"},
  treatment:{label:"Tratamientos",subtitle:"Botox, keratina e hidratación",bg:"linear-gradient(135deg,#D9C4B4,#AE8D77)"},
  extensions:{label:"Extensiones",subtitle:"Largo, volumen y color match",bg:"linear-gradient(135deg,#8D665B,#5A4039)"},
  nails:{label:"Nails",subtitle:"Manicure, pedicure y diseños",bg:"linear-gradient(135deg,#E7C9C8,#B77F84)"},
  lashes:{label:"Pestañas",subtitle:"Classic, Greek, Hybrid y Mega",bg:"linear-gradient(135deg,#6E5564,#3E3138)"},
  brows:{label:"Cejas & Wax",subtitle:"Cejas, henna y depilación",bg:"linear-gradient(135deg,#CBAA8E,#9B7455)"},
  makeup:{label:"Maquillaje",subtitle:"Social, eventos y glam",bg:"linear-gradient(135deg,#C9909C,#8A5B69)"},
  tanning:{label:"Spray Tan",subtitle:"Regular y Express",bg:"linear-gradient(135deg,#C59662,#8F633E)"}
};

const order=["color","blowdry","cut","treatment","extensions","nails","lashes","brows","makeup","tanning","hair"];

function normalizeCategory(s:Service){
  const n=s.name.toLowerCase();
  const c=s.category.toLowerCase();
  if(["nails","lashes","brows","makeup","tanning"].includes(c)) return c;
  if(n.includes("balayage")||n.includes("highlight")||n.includes("root")||n.includes("tinte")||n.includes("color")) return "color";
  if(n.includes("blow")||n.includes("secado")||n.includes("braid")||n.includes("peinado")||n.includes("style")) return "blowdry";
  if(n.includes("cut")||n.includes("corte")) return "cut";
  if(n.includes("botox")||n.includes("keratin")||n.includes("tratamiento")) return "treatment";
  if(n.includes("extension")) return "extensions";
  return c==="hair"?"hair":c;
}

export default function ServicesPage(){
  const [items,setItems]=useState<Service[]>([]);
  const [selected,setSelected]=useState<string|null>(null);
  const [editing,setEditing]=useState<Service|null>(null);
  const [creating,setCreating]=useState(false);
  const [q,setQ]=useState("");
  const [message,setMessage]=useState<string|null>(null);

  async function load(){
    const {data}=await supabase.from("services").select("id,name,category,duration_minutes,price_label,active").order("name");
    setItems((data as Service[])||[]);
  }
  useEffect(()=>{load()},[]);

  const groups=useMemo(()=>{
    const m=new Map<string,Service[]>();
    items.forEach(s=>{const k=normalizeCategory(s);if(!m.has(k))m.set(k,[]);m.get(k)!.push(s)});
    return [...m.entries()].sort((a,b)=>order.indexOf(a[0])-order.indexOf(b[0]));
  },[items]);

  const visibleGroups=groups.filter(([k,list])=>{
    if(!q.trim())return true;
    const needle=q.toLowerCase();
    return (meta[k]?.label||k).toLowerCase().includes(needle)||list.some(s=>s.name.toLowerCase().includes(needle));
  });

  return <div className="pb-8">
    <section className="relative overflow-hidden rounded-[30px] border border-[#D9C8BC] p-6 md:p-8" style={{backgroundImage:"radial-gradient(circle at 82% 18%,rgba(255,255,255,.85),transparent 28%),linear-gradient(135deg,#FAF5EF,#E8D5CC 58%,#D3B7AA)"}}>
      <div className="absolute -right-12 -bottom-16 h-48 w-64 rounded-[50%] bg-[#7B3C48]/14 blur-3xl"/>
      <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div><p className="text-[9px] uppercase tracking-[.26em] text-mocha">Gloria Hub</p><h1 className="mt-2 font-serif text-[48px] md:text-[60px] leading-none">Servicios</h1><p className="mt-3 max-w-[540px] text-[11px] leading-relaxed text-taupe">Tu catálogo, organizado como una carta editorial. Entra por categoría y edita solo lo que necesitas.</p></div>
        <button onClick={()=>setCreating(true)} className="inline-flex items-center gap-2 self-start rounded-full bg-[#4A352B] px-5 py-3 text-[9px] uppercase tracking-[.13em] text-ivory"><Plus size={14}/> Agregar servicio</button>
      </div>
    </section>

    <label className="mt-5 flex items-center gap-2 rounded-[18px] border border-[#DCCFC5] bg-white/70 px-4 py-3"><Search size={16} className="text-taupe"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar servicio o categoría..." className="w-full bg-transparent text-[12px] outline-none"/></label>
    {message&&<p className="mt-3 rounded-[14px] bg-[#EFE3DB] px-4 py-3 text-[10px] text-mocha">{message}</p>}

    <div className="mt-5 space-y-3">
      {visibleGroups.map(([key,list])=>{
        const m=meta[key]||{label:human(key),subtitle:"Servicios",bg:"linear-gradient(135deg,#6B4F43,#3E2C27)"};
        const open=selected===key;
        return <section key={key} className="overflow-hidden rounded-[24px] border border-[#DCCFC5] bg-white/60 shadow-[0_10px_28px_rgba(52,38,31,.04)]">
          <button onClick={()=>setSelected(open?null:key)} className="relative flex min-h-[105px] w-full items-center gap-4 overflow-hidden p-5 text-left" style={{backgroundImage:m.bg}}>
            <span className="absolute right-[-20px] top-[-28px] h-32 w-32 rounded-full bg-white/12 blur-xl"/>
            <div className="relative flex-1 text-white"><p className="font-serif text-[30px] leading-none">{m.label}</p><p className="mt-2 text-[9px] text-white/65">{m.subtitle}</p><p className="mt-3 text-[8px] uppercase tracking-[.18em] text-white/50">{list.length} servicios</p></div>
            <span className="relative grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white"><ChevronRight size={17} className={open?"rotate-90 transition":"transition"}/></span>
          </button>

          {open&&<div className="divide-y divide-[#E9DDD4]">
            {list.map(s=><div key={s.id} className="flex items-center gap-3 px-4 py-4 md:px-5">
              <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate font-serif text-[21px]">{s.name}</p><span className={`rounded-full px-2 py-1 text-[7px] uppercase tracking-[.08em] ${s.active?"bg-[#DFE8D9] text-[#4A6045]":"bg-[#EEE6E1] text-taupe"}`}>{s.active?"Activo":"Inactivo"}</span></div><p className="mt-1 text-[9px] text-taupe">{s.price_label} · {s.duration_minutes} min</p></div>
              <button onClick={()=>setEditing(s)} className="grid h-10 w-10 place-items-center rounded-full border border-[#D8C8BC] bg-[#FBF8F3] text-mocha"><MoreHorizontal size={17}/></button>
            </div>)}
          </div>}
        </section>
      })}
    </div>

    {editing&&<EditService service={editing} onClose={()=>setEditing(null)} onSaved={async(msg)=>{setEditing(null);setMessage(msg);await load()}}/>}
    {creating&&<CreateService onClose={()=>setCreating(false)} onSaved={async(msg)=>{setCreating(false);setMessage(msg);await load()}}/>}
  </div>
}

function EditService({service,onClose,onSaved}:{service:Service;onClose:()=>void;onSaved:(m:string)=>void}){
  const [name,setName]=useState(service.name);const [category,setCategory]=useState(service.category);const [duration,setDuration]=useState(String(service.duration_minutes));const [price,setPrice]=useState(service.price_label);const [active,setActive]=useState(service.active);const [saving,setSaving]=useState(false);const [error,setError]=useState<string|null>(null);
  async function save(){setSaving(true);setError(null);const {error:e}=await supabase.rpc("hub_update_service_full",{p_service_id:service.id,p_name:name,p_category:category,p_duration_minutes:Number(duration),p_price_label:price,p_active:active});setSaving(false);if(e){setError(e.message);return;}onSaved(`${name} guardado.`)}
  async function archive(){setSaving(true);const {error:e}=await supabase.rpc("hub_archive_service",{p_service_id:service.id});setSaving(false);if(e){setError(e.message);return;}onSaved(`${name} desactivado.`)}
  return <Sheet title="Editar servicio" onClose={onClose}><ServiceFields name={name} setName={setName} category={category} setCategory={setCategory} duration={duration} setDuration={setDuration} price={price} setPrice={setPrice} active={active} setActive={setActive}/>{error&&<p className="mt-4 text-[10px] text-red-700">{error}</p>}<button onClick={save} disabled={saving} className="mt-6 w-full rounded-full bg-[#4A352B] px-5 py-4 text-[9px] uppercase tracking-[.13em] text-ivory">{saving?"Guardando…":"Guardar cambios"}</button><button onClick={archive} disabled={saving} className="mt-3 w-full rounded-full border border-red-200 px-5 py-3.5 text-[9px] uppercase tracking-[.12em] text-red-700">Desactivar servicio</button></Sheet>
}

function CreateService({onClose,onSaved}:{onClose:()=>void;onSaved:(m:string)=>void}){
  const [name,setName]=useState("");const [category,setCategory]=useState("hair");const [duration,setDuration]=useState("30");const [price,setPrice]=useState("$0");const [active,setActive]=useState(true);const [saving,setSaving]=useState(false);const [error,setError]=useState<string|null>(null);
  async function save(){setSaving(true);setError(null);const {error:e}=await supabase.rpc("hub_create_service",{p_name:name,p_category:category,p_duration_minutes:Number(duration),p_price_label:price,p_active:active});setSaving(false);if(e){setError(e.message);return;}onSaved(`${name} creado.`)}
  return <Sheet title="Agregar servicio" onClose={onClose}><ServiceFields name={name} setName={setName} category={category} setCategory={setCategory} duration={duration} setDuration={setDuration} price={price} setPrice={setPrice} active={active} setActive={setActive}/>{error&&<p className="mt-4 text-[10px] text-red-700">{error}</p>}<button onClick={save} disabled={saving||!name.trim()} className="mt-6 w-full rounded-full bg-[#4A352B] px-5 py-4 text-[9px] uppercase tracking-[.13em] text-ivory disabled:opacity-40">{saving?"Creando…":"Crear servicio"}</button></Sheet>
}

function ServiceFields({name,setName,category,setCategory,duration,setDuration,price,setPrice,active,setActive}:{name:string;setName:(v:string)=>void;category:string;setCategory:(v:string)=>void;duration:string;setDuration:(v:string)=>void;price:string;setPrice:(v:string)=>void;active:boolean;setActive:(v:boolean)=>void}){
  return <div className="grid gap-4"><Field label="Nombre del servicio" value={name} set={setName}/><label><span className="mb-1.5 block text-[8px] uppercase tracking-[.15em] text-taupe">Categoría</span><select value={category} onChange={e=>setCategory(e.target.value)} className="w-full rounded-[15px] border border-[#D8C8BC] bg-white px-4 py-3.5 text-[12px]"><option value="hair">Hair</option><option value="nails">Nails</option><option value="lashes">Lashes</option><option value="brows">Brows</option><option value="makeup">Makeup</option><option value="tanning">Tanning</option></select></label><div className="grid grid-cols-2 gap-3"><Field label="Duración (min)" value={duration} set={setDuration} type="number"/><Field label="Precio" value={price} set={setPrice}/></div><label className="flex items-center justify-between rounded-[16px] border border-[#D8C8BC] bg-white px-4 py-3"><div><p className="text-[10px] font-medium">Servicio activo</p><p className="mt-1 text-[8px] text-taupe">Visible y reservable</p></div><input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)}/></label></div>
}

function Sheet({title,onClose,children}:{title:string;onClose:()=>void;children:React.ReactNode}){return <div className="fixed inset-0 z-[100] flex justify-end bg-[#2E2724]/45 backdrop-blur-[2px]" onClick={onClose}><aside className="h-full w-full max-w-[520px] overflow-y-auto bg-[#FBF8F3] p-6" onClick={e=>e.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-[8px] uppercase tracking-[.22em] text-mocha">Gloria Hub</p><h2 className="mt-2 font-serif text-[36px]">{title}</h2></div><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-[#D8C8BC]"><X size={18}/></button></div><div className="mt-7">{children}</div></aside></div>}
function Field({label,value,set,type="text"}:{label:string;value:string;set:(v:string)=>void;type?:string}){return <label><span className="mb-1.5 block text-[8px] uppercase tracking-[.15em] text-taupe">{label}</span><input type={type} value={value} onChange={e=>set(e.target.value)} className="w-full rounded-[15px] border border-[#D8C8BC] bg-white px-4 py-3.5 text-[12px] outline-none"/></label>}
function human(v:string){return v.replaceAll("_"," ").replace(/\b\w/g,c=>c.toUpperCase())}
