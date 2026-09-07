"use client";

import { useEffect, useMemo, useState } from "react";
import { Save } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Service={id:string;name:string;category:string;duration_minutes:number;price_label:string;active:boolean};
export default function ServicesPage(){
  const [items,setItems]=useState<Service[]>([]);const [message,setMessage]=useState<string|null>(null);
  async function load(){const {data}=await supabase.from("services").select("id,name,category,duration_minutes,price_label,active").order("category").order("name");setItems((data as Service[])||[])}
  useEffect(()=>{load()},[]);
  const groups=useMemo(()=>{const m=new Map<string,Service[]>();items.forEach(s=>{if(!m.has(s.category))m.set(s.category,[]);m.get(s.category)!.push(s)});return Array.from(m.entries())},[items]);
  function patch(id:string,changes:Partial<Service>){setItems(prev=>prev.map(x=>x.id===id?{...x,...changes}:x))}
  async function save(s:Service){setMessage(null);const {error}=await supabase.rpc("hub_update_service",{p_service_id:s.id,p_active:s.active,p_duration_minutes:s.duration_minutes,p_price_label:s.price_label});setMessage(error?error.message:`${s.name} guardado.`)}
  return <div><p className="text-[10px] uppercase tracking-[0.28em] text-mocha">Gloria Hub</p><h1 className="mt-2 font-serif text-[48px] md:text-[58px] leading-none">Servicios</h1><p className="mt-3 text-[13px] text-taupe">Administra el catálogo de servicios que usa Gloria On Demand y la disponibilidad de citas.</p>{message&&<p className="mt-4 text-[12px] text-mocha">{message}</p>}<div className="mt-8 space-y-7">{groups.map(([category,list])=><section key={category}><p className="mb-3 text-[9px] uppercase tracking-[0.2em] text-mocha">{category}</p><div className="overflow-hidden rounded-[22px] border border-champagne/30 bg-white/40">{list.map(s=><div key={s.id} className="grid gap-3 border-b last:border-0 border-champagne/20 p-4 md:grid-cols-[1fr_110px_150px_100px_auto] md:items-center"><div><p className="text-[13px] font-medium">{s.name}</p><p className="mt-1 text-[10px] text-taupe">{s.active?"Visible y reservable":"Inactivo"}</p></div><input type="number" min={5} value={s.duration_minutes} onChange={e=>patch(s.id,{duration_minutes:Number(e.target.value)})} className="rounded-xl border border-taupe/25 bg-ivory px-3 py-2.5 text-[12px]"/><input value={s.price_label} onChange={e=>patch(s.id,{price_label:e.target.value})} className="rounded-xl border border-taupe/25 bg-ivory px-3 py-2.5 text-[12px]"/><label className="flex items-center gap-2 text-[11px] text-taupe"><input type="checkbox" checked={s.active} onChange={e=>patch(s.id,{active:e.target.checked})}/> Activo</label><button onClick={()=>save(s)} className="inline-flex items-center justify-center gap-2 rounded-full bg-espresso px-4 py-2.5 text-[9px] uppercase tracking-[0.12em] text-ivory"><Save size={13}/>Guardar</button></div>)}</div></section>)}</div></div>
}
