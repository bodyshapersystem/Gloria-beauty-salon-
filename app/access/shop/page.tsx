"use client";

import Image from "next/image";
import { useAccess } from "@/components/access/AccessShell";
import { products } from "@/lib/data/products";

export default function AccessShopPage(){
  const {profile}=useAccess();
  if(!profile)return null;
  const personalized=profile.beauty_state==="beauty_profile_active";
  return <div>
    <p className="text-[10px] uppercase tracking-[0.3em] text-mocha">Gloria Access</p><h1 className="mt-2 font-serif text-[42px] md:text-[56px] leading-none">Shop</h1>
    <p className="mt-3 text-[14px] text-taupe">{personalized?"Your routine, professional care and Gloria's edit.":"Explore professional beauty care curated by Gloria."}</p>
    <section className="mt-10 rounded-[28px] border border-champagne/30 bg-white/50 p-7 md:p-8">
      <p className="text-[9px] uppercase tracking-[0.24em] text-mocha">{personalized?"Your Routine":"Recommended by Gloria"}</p>
      <h2 className="mt-2 font-serif text-[34px] leading-none">{personalized?"Built from your real beauty history.":"Professional essentials, no guessing."}</h2>
      <p className="mt-3 max-w-[620px] text-[13px] leading-relaxed text-taupe">{personalized?"As staff recommendations and client-visible memory are added, products can be matched to your services and preferences.":"We won't label anything as personalized until your Beauty Profile has real salon history."}</p>
    </section>
    <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{products.map(p=><article key={p.slug} className="rounded-[22px] border border-champagne/25 bg-white/45 overflow-hidden"><div className="aspect-square bg-blush/20 relative">{p.photo?<Image src={p.photo} alt={p.name} fill className="object-cover"/>:<div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] text-taupe">Image coming soon</div>}</div><div className="p-4"><p className="text-[8px] uppercase tracking-[0.2em] text-taupe">{p.brand}</p><h3 className="mt-1 font-serif text-[23px] leading-none">{p.name}</h3><p className="mt-2 text-[11px] text-taupe">{p.size}</p>{p.price!==null&&<p className="mt-3 text-[13px] font-semibold text-mocha">${p.price}</p>}<button className="mt-4 w-full rounded-full border border-mocha/30 py-2.5 text-[9px] uppercase tracking-[0.14em] text-mocha">View Product</button></div></article>)}</div>
  </div>
}
