"use client";

import { useEffect, useMemo, useState } from "react";
import { PackageCheck } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Order={id:string;client_id:string;status:string;total_cents:number;created_at:string;client:{first_name:string;last_name:string;email:string|null}|null};
export default function OrdersPage(){
  const [items,setItems]=useState<Order[]>([]);const [loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{const {data}=await supabase.from("orders").select("id,client_id,status,total_cents,created_at,client:client_id(first_name,last_name,email)").order("created_at",{ascending:false});setItems(((data as unknown) as Order[])||[]);setLoading(false)})()},[]);
  const total=useMemo(()=>items.reduce((n,o)=>n+(o.total_cents||0),0),[items]);
  return <div><div className="flex items-end justify-between gap-5"><div><p className="text-[10px] uppercase tracking-[0.28em] text-mocha">Gloria Hub</p><h1 className="mt-2 font-serif text-[48px] md:text-[58px] leading-none">Pedidos</h1><p className="mt-3 text-[13px] text-taupe">Pedidos del shop conectados al perfil de cada clienta de Gloria.</p></div><PackageCheck className="text-mocha"/></div><div className="mt-7 grid gap-3 sm:grid-cols-2"><Stat label="Pedidos" value={String(items.length)}/><Stat label="Valor total" value={money(total)}/></div><section className="mt-6 overflow-hidden rounded-[22px] border border-champagne/30 bg-white/40">{loading?<p className="p-7 text-[12px] text-taupe">Cargando pedidos...</p>:items.length===0?<div className="p-9"><p className="font-serif text-[30px]">Tu vitrina de belleza está esperando.</p><p className="mt-2 text-[12px] text-taupe">Los pedidos aparecerán aquí cuando el checkout de Gloria Shop esté activo.</p></div>:items.map(o=><div key={o.id} className="grid gap-2 border-b last:border-0 border-champagne/20 p-4 md:grid-cols-[1fr_1fr_1fr_120px] md:items-center"><div><p className="text-[13px] font-medium">{o.client?`${o.client.first_name} ${o.client.last_name}`:"Clienta"}</p><p className="mt-1 text-[10px] text-taupe">{o.client?.email||"—"}</p></div><p className="text-[11px] text-taupe">{new Date(o.created_at).toLocaleDateString("es-US",{month:"short",day:"numeric",year:"numeric"})}</p><span className="w-fit rounded-full border border-champagne/35 px-3 py-1 text-[9px] uppercase tracking-[0.12em] text-mocha">{o.status}</span><p className="font-serif text-[20px] text-right">{money(o.total_cents)}</p></div>)}</section></div>
}
function Stat({label,value}:{label:string;value:string}){return <div className="rounded-[20px] border border-champagne/30 bg-white/40 p-5"><p className="text-[9px] uppercase tracking-[0.16em] text-taupe">{label}</p><p className="mt-2 font-serif text-[34px]">{value}</p></div>}
function money(cents:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format((cents||0)/100)}
