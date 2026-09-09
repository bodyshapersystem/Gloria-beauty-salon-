"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronUp, PackageCheck } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Order={id:string;client_id:string;status:string;total_cents:number;created_at:string;client:{first_name:string;last_name:string;email:string|null;phone:string|null}|null};
type OrderItem={id:string;order_id:string;product_name:string;quantity:number;unit_price_cents:number};
const statusLabels:Record<string,string>={pending:"Pendiente",paid:"Pagado",ready:"Listo para retiro",completed:"Entregado",cancelled:"Cancelado"};

export default function OrdersPage(){
  const [items,setItems]=useState<Order[]>([]);const [orderItems,setOrderItems]=useState<OrderItem[]>([]);const [loading,setLoading]=useState(true);const [expanded,setExpanded]=useState<string|null>(null);
  useEffect(()=>{(async()=>{const [{data:o},{data:oi}]=await Promise.all([
    supabase.from("orders").select("id,client_id,status,total_cents,created_at,client:client_id(first_name,last_name,email,phone)").order("created_at",{ascending:false}),
    supabase.from("order_items").select("id,order_id,product_name,quantity,unit_price_cents")
  ]);setItems(((o as unknown) as Order[])||[]);setOrderItems((oi as OrderItem[])||[]);setLoading(false)})()},[]);
  const total=useMemo(()=>items.reduce((n,o)=>n+(o.total_cents||0),0),[items]);
  return <div><div className="flex items-end justify-between gap-5"><div><p className="text-[10px] uppercase tracking-[0.28em] text-mocha">Gloria Hub</p><h1 className="mt-2 font-serif text-[48px] md:text-[58px] leading-none">Pedidos</h1><p className="mt-3 text-[13px] text-taupe">Pedidos del shop conectados al perfil de cada clienta de Gloria.</p></div><PackageCheck className="text-mocha"/></div><div className="mt-7 grid gap-3 sm:grid-cols-2"><Stat label="Pedidos" value={String(items.length)}/><Stat label="Valor total" value={money(total)}/></div><section className="mt-6 overflow-hidden rounded-[22px] border border-champagne/30 bg-white/40">{loading?<p className="p-7 text-[12px] text-taupe">Cargando pedidos...</p>:items.length===0?<div className="p-9"><p className="font-serif text-[30px]">Tu vitrina de belleza está esperando.</p><p className="mt-2 text-[12px] text-taupe">Los pedidos aparecerán aquí cuando una clienta agregue productos al carrito y confirme desde el Shop.</p></div>:items.map(o=>{const its=orderItems.filter(x=>x.order_id===o.id);const isOpen=expanded===o.id;return <div key={o.id} className="border-b last:border-0 border-champagne/20">
    <button onClick={()=>setExpanded(isOpen?null:o.id)} className="w-full text-left grid gap-2 p-4 md:grid-cols-[1fr_1fr_1fr_120px_24px] md:items-center hover:bg-white/50">
      <div><p className="text-[13px] font-medium">{o.client?`${o.client.first_name} ${o.client.last_name}`:"Clienta"}</p><p className="mt-1 text-[10px] text-taupe">{o.client?.phone||o.client?.email||"—"}</p></div>
      <p className="text-[11px] text-taupe">{new Date(o.created_at).toLocaleDateString("es-US",{month:"short",day:"numeric",year:"numeric"})}</p>
      <span className="w-fit rounded-full border border-champagne/35 px-3 py-1 text-[9px] uppercase tracking-[0.12em] text-mocha">{statusLabels[o.status]||o.status}</span>
      <p className="font-serif text-[20px] text-right">{money(o.total_cents)}</p>
      <span className="justify-self-end text-mocha">{isOpen?<ChevronUp size={16}/>:<ChevronDown size={16}/>}</span>
    </button>
    {isOpen&&<div className="bg-blush/25 px-4 pb-4"><div className="rounded-[14px] bg-ivory/70 divide-y divide-champagne/20">{its.length===0?<p className="p-3 text-[11px] text-taupe">Sin detalle de productos.</p>:its.map(it=><div key={it.id} className="flex items-center justify-between px-4 py-2.5"><span className="text-[12px]">{it.quantity}× {it.product_name}</span><span className="text-[12px] text-mocha">{money(it.unit_price_cents*it.quantity)}</span></div>)}</div></div>}
  </div>})}</section></div>
}
function Stat({label,value}:{label:string;value:string}){return <div className="rounded-[20px] border border-champagne/30 bg-white/40 p-5"><p className="text-[9px] uppercase tracking-[0.16em] text-taupe">{label}</p><p className="mt-2 font-serif text-[34px]">{value}</p></div>}
function money(cents:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"}).format((cents||0)/100)}
