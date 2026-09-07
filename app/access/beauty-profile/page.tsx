"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { useAccess } from "@/components/access/AccessShell";
import { BeautyProfileMap } from "@/components/beauty/BeautyProfileMap";
import { supabase } from "@/lib/supabase/client";

type Memory={id:string;category:string;title:string;summary:string|null;details:Record<string,unknown>;products_used:unknown;maintenance_notes:string|null;approved_photo_urls:string[];created_at:string;updated_at:string;service_id:string|null;staff_id:string|null;appointment_id:string|null};
type Photo={id:string;image_url:string;caption:string|null;photo_type:string;taken_at:string};
type ProductRecommendation={id:string;product_slug:string;reason:string|null};

const familyMeta:Record<string,{label:string;tagline:string}>={
  color:{label:"My Hair Color",tagline:"Color + formula"},blowdry:{label:"My Blowdry",tagline:"My signature finish"},cut:{label:"My Cut",tagline:"Shape + length"},treatment:{label:"My Treatments",tagline:"Hair health"},styling:{label:"My Styling",tagline:"Looks worth repeating"},extensions:{label:"My Extensions",tagline:"Length + color match"},nails:{label:"My Nails",tagline:"Shape + shade"},lashes:{label:"My Lashes",tagline:"Map + curl"},brows:{label:"My Brows",tagline:"Shape + tint"},makeup:{label:"My Makeup",tagline:"My best tones"},tanning:{label:"My Glow",tagline:"My perfect tone"},hair:{label:"My Hair",tagline:"Hair memory"},general:{label:"My Beauty",tagline:"Personal details"}
};

export default function BeautyProfilePage(){
  const {profile}=useAccess();
  const [memory,setMemory]=useState<Memory[]>([]);
  const [photos,setPhotos]=useState<Photo[]>([]);
  const [products,setProducts]=useState<ProductRecommendation[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{if(!profile)return;(async()=>{
    const queries:any[]=[
      supabase.from("client_memory").select("id,category,title,summary,details,products_used,maintenance_notes,approved_photo_urls,created_at,updated_at,service_id,staff_id,appointment_id").eq("client_id",profile.id).eq("client_visible",true).order("updated_at",{ascending:false}),
      supabase.from("client_photos").select("id,image_url,caption,photo_type,taken_at").eq("client_id",profile.id).eq("visibility","client_visible").order("taken_at",{ascending:false})
    ];
    if(profile.product_recommendations_enabled)queries.push(supabase.from("client_product_recommendations").select("id,product_slug,reason").eq("client_id",profile.id).eq("client_visible",true).in("status",["approved","published","accepted"]).order("created_at",{ascending:false}).limit(8));
    const r=await Promise.all(queries);
    setMemory((r[0].data as Memory[])||[]);
    setPhotos((r[1].data as Photo[])||[]);
    if(profile.product_recommendations_enabled)setProducts((r[2]?.data as ProductRecommendation[])||[]);
    setLoading(false);
  })()},[profile?.id,profile?.product_recommendations_enabled]);

  const families=useMemo(()=>{const map=new Map<string,Memory[]>();memory.forEach(m=>{const family=String(m.details?.service_family||m.category||"general");if(!map.has(family))map.set(family,[]);map.get(family)!.push(m)});return [...map.entries()]},[memory]);
  if(!profile)return null;

  return <div className="pb-12">
    <section className="relative overflow-hidden rounded-[28px] bg-[#6F3642] text-ivory shadow-[0_18px_50px_rgba(82,42,47,.15)]">
      <div className="absolute inset-0 opacity-35" style={{backgroundImage:"radial-gradient(circle at 85% 20%,rgba(255,225,218,.28),transparent 28%),repeating-radial-gradient(ellipse at 30% 40%,rgba(255,255,255,.05) 0 1px,transparent 2px 11px)"}}/>
      <div className="relative p-6 md:p-9"><p className="text-[9px] uppercase tracking-[.28em] text-[#F0D6D1]">Gloria Access</p><h1 className="mt-2 font-serif text-[43px] md:text-[56px] leading-none">My Beauty Profile</h1><p className="mt-4 max-w-[650px] text-[12px] leading-relaxed text-white/70">Tu cabello, color, secado, cejas, pestañas y uñas. Un perfil visual que se va haciendo más tú con cada visita.</p></div>
    </section>

    {loading?<p className="mt-8 text-[12px] text-taupe">Preparando tu Beauty Profile…</p>:<>
      <section className="mt-7"><div className="mb-5"><p className="text-[9px] uppercase tracking-[.22em] text-mocha">Your Beauty Map</p><h2 className="mt-1 font-serif text-[36px] leading-none">Tu look, construido detalle por detalle.</h2><p className="mt-3 max-w-[650px] text-[11px] leading-relaxed text-taupe">Toca Cabello, Cejas, Pestañas o Uñas. Los puntos vino indican que ya hay información real guardada.</p></div><BeautyProfileMap memory={memory} mode="client"/></section>

      {memory.length===0?<section className="mt-5 rounded-[24px] border border-[#DCCFC5] bg-white/60 p-6 text-center"><Sparkles size={18} className="mx-auto text-mocha"/><h3 className="mt-3 font-serif text-[30px]">Tu perfil empieza aquí.</h3><p className="mt-2 text-[10px] text-taupe">El team irá completándolo a medida que conozca tus preferencias reales.</p></section>:<section className="mt-8"><p className="text-[9px] uppercase tracking-[.22em] text-mocha">Beauty Memory</p><h2 className="mt-1 font-serif text-[32px]">Tus detalles guardados</h2><div className="mt-4 grid gap-4 lg:grid-cols-2">{families.map(([family,items])=><BeautyCard key={family} family={family} items={items}/>)}</div></section>}

      {photos.length>0&&<section className="mt-9"><p className="text-[9px] uppercase tracking-[.22em] text-mocha">My Looks</p><h2 className="mt-2 font-serif text-[34px]">Resultados que vale la pena recordar.</h2><div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">{photos.slice(0,8).map(p=><figure key={p.id} className="overflow-hidden rounded-[20px] border border-champagne/25 bg-white/60"><div className="relative aspect-[4/5]"><Image src={p.image_url} alt={p.caption||"Gloria Beauty Salon result"} fill className="object-cover"/></div>{p.caption&&<figcaption className="p-3 text-[11px] text-taupe">{p.caption}</figcaption>}</figure>)}</div></section>}

      {(uniqueProducts(memory).length>0||products.length>0)&&<section className="mt-9 rounded-[26px] border border-champagne/30 bg-[#EFE4DC]/45 p-6 md:p-8"><div className="flex items-center gap-2 text-mocha"><ShoppingBag size={18}/><p className="text-[9px] uppercase tracking-[.2em]">My Routine</p></div><h2 className="mt-2 font-serif text-[35px] leading-none">Los productos que conocemos de ti.</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{uniqueProducts(memory).map((p,i)=><div key={`${p.type}-${p.name}-${i}`} className="rounded-[17px] bg-white/70 p-4"><p className="text-[8px] uppercase tracking-[.16em] text-taupe">{human(p.type)}</p><p className="mt-1 font-serif text-[22px]">{p.name}</p></div>)}{products.map(p=><Link key={p.id} href={`/access/shop?product=${encodeURIComponent(p.product_slug)}`} className="rounded-[17px] bg-white/70 p-4"><p className="text-[8px] uppercase tracking-[.16em] text-mocha">Recommended for you</p><p className="mt-1 font-serif text-[22px]">{human(p.product_slug.replace(/^truss-/,""))}</p>{p.reason&&<p className="mt-2 text-[10px] text-taupe">{p.reason}</p>}</Link>)}</div></section>}
    </>}
  </div>
}

function BeautyCard({family,items}:{family:string;items:Memory[]}){const m=items[0];const details=Object.entries(m.details||{}).filter(([k,v])=>k!=="service_family"&&v!==null&&v!=="");const href=`/access/book${m.service_id?`?service=${encodeURIComponent(m.service_id)}${m.staff_id?`&staff=${encodeURIComponent(m.staff_id)}`:""}&memory=${encodeURIComponent(m.id)}`:""}`;return <article className="overflow-hidden rounded-[22px] border border-[#DED0C5] bg-white/70"><div className="bg-[#F0E3DD] p-5"><p className="text-[8px] uppercase tracking-[.18em] text-mocha">{familyMeta[family]?.tagline||"Beauty memory"}</p><h3 className="mt-1 font-serif text-[29px]">{familyMeta[family]?.label||human(family)}</h3></div><div className="p-5"><dl className="grid grid-cols-2 gap-4">{details.slice(0,10).map(([k,v])=><div key={k}><dt className="text-[7px] uppercase tracking-[.13em] text-taupe">{human(k)}</dt><dd className="mt-1 text-[11px] font-medium">{formatValue(v)}</dd></div>)}</dl>{m.maintenance_notes&&<p className="mt-4 rounded-[14px] bg-[#FBF8F3] p-3 text-[10px] text-taupe">{m.maintenance_notes}</p>}<Link href={href} className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#4A352B] px-4 py-2.5 text-[8px] uppercase tracking-[.11em] text-ivory">Book this again <ArrowRight size={13}/></Link></div></article>}
function uniqueProducts(memory:Memory[]){const out:{type:string;name:string}[]=[];const seen=new Set<string>();memory.forEach(m=>{if(Array.isArray(m.products_used))m.products_used.forEach((x:any)=>{const type=typeof x==="object"?String(x.type||"product"):"product";const name=typeof x==="object"?String(x.name||""):String(x||"");const key=`${type}|${name}`.toLowerCase();if(name&&!seen.has(key)){seen.add(key);out.push({type,name})}})});return out}
function human(v:string){return v.replaceAll("_"," ").replaceAll("-"," ").replace(/\b\w/g,c=>c.toUpperCase())}
function formatValue(v:unknown){if(Array.isArray(v))return v.join(", ");if(v===null||v===undefined)return "—";return String(v)}
