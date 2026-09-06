"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useAccess } from "@/components/access/AccessShell";
import { supabase } from "@/lib/supabase/client";
import { products } from "@/lib/data/products";

type Favorite = { id:string; product_slug:string; created_at:string };

export default function FavoritesPage(){
  const {profile}=useAccess();
  const [favorites,setFavorites]=useState<Favorite[]>([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{if(!profile)return;(async()=>{const {data}=await supabase.from("client_favorites").select("id,product_slug,created_at").eq("client_id",profile.id).order("created_at",{ascending:false});setFavorites((data||[]) as Favorite[]);setLoading(false)})()},[profile?.id]);
  const items=useMemo(()=>favorites.map(f=>({favorite:f,product:products.find(p=>p.slug===f.product_slug)})).filter(x=>x.product),[favorites]);
  if(!profile)return null;
  async function remove(id:string){const {error}=await supabase.from("client_favorites").delete().eq("id",id);if(!error)setFavorites(v=>v.filter(f=>f.id!==id))}
  return <div><p className="text-[10px] uppercase tracking-[0.3em] text-mocha">Gloria Access · Shop</p><h1 className="mt-2 font-serif text-[44px] md:text-[58px] leading-none">Favorites</h1><p className="mt-3 text-[14px] text-taupe">Products you saved for later.</p>{loading?<p className="mt-10 text-[12px] text-taupe">Loading favorites…</p>:items.length===0?<section className="mt-10 rounded-[30px] border border-champagne/30 bg-white/40 px-6 py-14 text-center"><Heart className="mx-auto text-mocha" strokeWidth={1.3}/><h2 className="mt-5 font-serif text-[30px]">No favorites yet.</h2><p className="mt-2 text-[12px] text-taupe">Save products you want to come back to.</p><Link href="/access/shop" className="mt-6 inline-flex rounded-full bg-espresso px-6 py-3 text-[9px] uppercase tracking-[0.16em] text-ivory">Explore Shop</Link></section>:<div className="mt-9 grid sm:grid-cols-2 gap-4">{items.map(({favorite,product})=><article key={favorite.id} className="rounded-[24px] border border-champagne/30 bg-white/40 p-5"><p className="text-[9px] uppercase tracking-[0.18em] text-mocha">{product!.brand}</p><h2 className="mt-2 font-serif text-[24px]">{product!.name}</h2><p className="mt-2 text-[11px] text-taupe">{product!.size}</p><div className="mt-5 flex items-center justify-between gap-4"><span className="font-serif text-[20px]">{product!.price==null?"—":`$${product!.price}`}</span><button onClick={()=>remove(favorite.id)} className="text-[9px] uppercase tracking-[0.14em] text-mocha">Remove</button></div></article>)}</div>}</div>
}
