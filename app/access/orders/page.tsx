"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { useAccess } from "@/components/access/AccessShell";
import { supabase } from "@/lib/supabase/client";

type Order = { id:string; status:string; total_cents:number|null; created_at:string };

export default function OrdersPage(){
  const {profile}=useAccess();
  const [orders,setOrders]=useState<Order[]>([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{if(!profile)return;(async()=>{const {data}=await supabase.from("orders").select("id,status,total_cents,created_at").eq("client_id",profile.id).order("created_at",{ascending:false});setOrders((data||[]) as Order[]);setLoading(false)})()},[profile?.id]);
  if(!profile)return null;
  return <div><p className="text-[10px] uppercase tracking-[0.3em] text-mocha">Gloria Access · Shop</p><h1 className="mt-2 font-serif text-[44px] md:text-[58px] leading-none">My Orders</h1><p className="mt-3 text-[14px] text-taupe">Your Gloria Beauty Salon purchases in one place.</p>{loading?<p className="mt-10 text-[12px] text-taupe">Loading orders…</p>:orders.length===0?<section className="mt-10 rounded-[30px] border border-champagne/30 bg-white/40 px-6 py-14 text-center"><Package className="mx-auto text-mocha" strokeWidth={1.3}/><h2 className="mt-5 font-serif text-[30px]">Your beauty shelf is waiting.</h2><p className="mt-2 text-[12px] text-taupe">No orders yet.</p><Link href="/access/shop" className="mt-6 inline-flex rounded-full bg-espresso px-6 py-3 text-[9px] uppercase tracking-[0.16em] text-ivory">Explore Shop</Link></section>:<div className="mt-9 space-y-3">{orders.map(o=><article key={o.id} className="rounded-[22px] border border-champagne/30 bg-white/40 px-5 py-5 flex items-center justify-between gap-4"><div><p className="text-[9px] uppercase tracking-[0.16em] text-mocha">Order</p><p className="mt-1 text-[13px]">{new Date(o.created_at).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</p><p className="mt-1 text-[11px] capitalize text-taupe">{o.status}</p></div><p className="font-serif text-[22px]">{o.total_cents==null?"—":`$${(o.total_cents/100).toFixed(2)}`}</p></article>)}</div>}</div>
}
