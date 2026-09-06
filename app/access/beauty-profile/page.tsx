"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LockKeyhole, ShoppingBag, Sparkles } from "lucide-react";
import { useAccess } from "@/components/access/AccessShell";
import { supabase } from "@/lib/supabase/client";

type Memory = {
  id:string;
  category:string;
  title:string;
  summary:string|null;
  details:Record<string,unknown>;
  approved_photo_urls:string[];
  created_at:string;
  service_id:string|null;
  staff_id:string|null;
  appointment_id:string|null;
};
type FirstAppointment = { start_at:string; service:{name:string}|null; staff:{name:string}|null };
type Recommendation = { id:string; type:string; category:string; title:string; description:string|null; reason:string|null; recommended_service_id:string|null; recommended_product_slug:string|null; partner_key:string|null };
type ProductRecommendation = { id:string; product_slug:string; reason:string|null };
type Photo = { id:string; image_url:string; caption:string|null; photo_type:string; taken_at:string };

const categoryLabels:Record<string,string>={hair:"My Hair",nails:"My Nails",brows:"My Brows",lashes:"My Lashes",tanning:"My Glow",makeup:"My Makeup",general:"My Beauty"};

export default function BeautyProfilePage(){
  const {profile}=useAccess();
  const [memory,setMemory]=useState<Memory[]>([]);
  const [first,setFirst]=useState<FirstAppointment|null>(null);
  const [recommendations,setRecommendations]=useState<Recommendation[]>([]);
  const [productRecommendations,setProductRecommendations]=useState<ProductRecommendation[]>([]);
  const [photos,setPhotos]=useState<Photo[]>([]);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{if(!profile)return;(async()=>{
    const baseQueries:any[]=[
      supabase.from("client_memory").select("id,category,title,summary,details,approved_photo_urls,created_at,service_id,staff_id,appointment_id").eq("client_id",profile.id).eq("client_visible",true).order("created_at",{ascending:false}),
      supabase.from("appointments").select("start_at,service:service_id(name),staff:staff_id(name)").eq("client_id",profile.id).in("status",["confirmed","in_progress","completed"]).order("start_at",{ascending:true}).limit(1).maybeSingle(),
      supabase.from("client_photos").select("id,image_url,caption,photo_type,taken_at").eq("client_id",profile.id).eq("visibility","client_visible").order("taken_at",{ascending:false}),
    ];
    if(profile.beauty_intelligence_enabled){
      baseQueries.push(supabase.from("beauty_recommendations").select("id,type,category,title,description,reason,recommended_service_id,recommended_product_slug,partner_key").eq("client_id",profile.id).eq("client_visible",true).in("status",["approved","published","accepted"]).order("created_at",{ascending:false}).limit(8));
    }
    if(profile.product_recommendations_enabled){
      baseQueries.push(supabase.from("client_product_recommendations").select("id,product_slug,reason").eq("client_id",profile.id).eq("client_visible",true).in("status",["approved","published","accepted"]).order("created_at",{ascending:false}).limit(8));
    }
    const results=await Promise.all(baseQueries);
    setMemory((results[0].data as Memory[])||[]);
    setFirst((results[1].data as FirstAppointment|null)||null);
    setPhotos((results[2].data as Photo[])||[]);
    let idx=3;
    if(profile.beauty_intelligence_enabled){setRecommendations((results[idx]?.data as Recommendation[])||[]);idx++;}
    if(profile.product_recommendations_enabled){setProductRecommendations((results[idx]?.data as ProductRecommendation[])||[]);}
    setLoading(false);
  })()},[profile?.id,profile?.beauty_intelligence_enabled,profile?.product_recommendations_enabled]);

  const grouped=useMemo(()=>{
    const map=new Map<string,Memory[]>();
    memory.forEach((m)=>{if(!map.has(m.category))map.set(m.category,[]);map.get(m.category)!.push(m)});
    return Array.from(map.entries());
  },[memory]);

  if(!profile)return null;

  return <div className="pb-10">
    <p className="text-[10px] uppercase tracking-[0.3em] text-mocha">Gloria Access</p>
    <h1 className="mt-2 font-serif text-[42px] md:text-[56px] leading-none">My Beauty Profile</h1>
    <p className="mt-3 text-[14px] text-taupe">Your beauty memory, built from real visits and only what your salon team has approved for you.</p>
    {loading?<p className="mt-10 text-sm text-taupe">Cargando...</p>:profile.beauty_state==="no_appointment_history"?<Locked/>:profile.beauty_state==="appointment_confirmed"||memory.length===0?<Started first={first}/>:<Active memory={memory} grouped={grouped} photos={photos} recommendations={recommendations} productRecommendations={productRecommendations} clientId={profile.id} partnerEnabled={profile.partner_recommendations_enabled}/>} 
  </div>
}

function Locked(){return <section className="mt-10 rounded-[30px] border border-champagne/30 bg-white/50 p-8 md:p-10 text-center"><div className="mx-auto h-12 w-12 rounded-full border border-champagne/45 flex items-center justify-center text-mocha"><LockKeyhole size={20}/></div><h2 className="mt-5 font-serif text-[38px] leading-none">Your beauty profile starts here</h2><p className="mt-4 max-w-[560px] mx-auto text-[13px] leading-relaxed text-taupe">After your first Gloria Beauty Salon visit, your looks, preferences and beauty history will begin to live here.</p><Link href="/reservar" className="mt-7 inline-flex rounded-full bg-espresso px-6 py-3 text-[10px] uppercase tracking-[0.17em] text-ivory">Book an appointment</Link></section>}

function Started({first}:{first:FirstAppointment|null}){return <section className="mt-10 rounded-[30px] border border-champagne/30 bg-gradient-to-br from-white/60 to-blush/30 p-8 md:p-10"><Sparkles className="text-mocha"/><p className="mt-5 text-[10px] uppercase tracking-[0.25em] text-mocha">Your beauty journey has started</p><h2 className="mt-3 font-serif text-[38px] leading-none">Your first chapter is on the calendar.</h2>{first&&<div className="mt-6 border-l border-champagne pl-5"><p className="font-serif text-[26px]">{first.service?.name||"Appointment"}</p><p className="mt-1 text-[13px] text-taupe">{first.staff?.name||"Gloria Beauty Salon"} · {new Date(first.start_at).toLocaleDateString("es-US",{month:"long",day:"numeric",year:"numeric"})}</p></div>}<p className="mt-6 max-w-[620px] text-[13px] leading-relaxed text-taupe">After your visit, your service details and personalized beauty memory can appear here once your stylist saves client-visible memory.</p></section>}

function Active({memory,grouped,photos,recommendations,productRecommendations,clientId,partnerEnabled}:{memory:Memory[];grouped:[string,Memory[]][];photos:Photo[];recommendations:Recommendation[];productRecommendations:ProductRecommendation[];clientId:string;partnerEnabled:boolean}){
  return <div className="mt-10 space-y-8">
    <section className="rounded-[30px] bg-espresso text-ivory p-8 md:p-10"><p className="text-[10px] uppercase tracking-[0.28em] text-champagne">Your Beauty Memory</p><h2 className="mt-3 font-serif text-[40px] md:text-[48px] leading-none">Looks worth remembering.</h2><p className="mt-4 max-w-[650px] text-[13px] leading-relaxed text-ivory/70">Your profile grows with completed visits, approved service details, products and looks you actually chose.</p></section>

    {grouped.map(([category,items])=><section key={category}><div className="flex items-center justify-between gap-4"><div><p className="text-[9px] uppercase tracking-[0.24em] text-mocha">{categoryLabels[category]||"My Beauty"}</p><h2 className="mt-1 font-serif text-[34px] leading-none">{items[0]?.title||"Your latest look"}</h2></div><span className="text-[10px] text-taupe">{items.length} saved</span></div><div className="mt-4 grid gap-4 md:grid-cols-2">{items.slice(0,4).map(m=><MemoryCard key={m.id} memory={m}/>)}</div></section>)}

    {photos.length>0&&<section><p className="text-[9px] uppercase tracking-[0.24em] text-mocha">My Looks</p><h2 className="mt-2 font-serif text-[34px] leading-none">Your approved visit photos</h2><div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">{photos.slice(0,8).map((p)=><figure key={p.id} className="overflow-hidden rounded-[20px] border border-champagne/25 bg-white/40"><div className="relative aspect-[4/5]"><Image src={p.image_url} alt={p.caption||"Gloria Beauty Salon result"} fill className="object-cover"/></div>{p.caption&&<figcaption className="p-3 text-[11px] text-taupe">{p.caption}</figcaption>}</figure>)}</div></section>}

    {recommendations.length>0&&<section><div className="flex items-end justify-between gap-4"><div><p className="text-[9px] uppercase tracking-[0.24em] text-mocha">Beauty Intelligence</p><h2 className="mt-2 font-serif text-[36px] leading-none">For You</h2></div><p className="hidden md:block max-w-[360px] text-right text-[11px] leading-relaxed text-taupe">Ideas based on your real Gloria history. Explore them with your stylist before making a change.</p></div><div className="mt-4 grid gap-4 md:grid-cols-3">{recommendations.map((r)=><RecommendationCard key={r.id} r={r} clientId={clientId} partnerEnabled={partnerEnabled}/>)}</div></section>}

    {productRecommendations.length>0&&<section className="rounded-[30px] border border-champagne/30 bg-white/45 p-7 md:p-8"><div className="flex items-center gap-3 text-mocha"><ShoppingBag size={20}/><p className="text-[9px] uppercase tracking-[0.24em]">Your Routine</p></div><h2 className="mt-3 font-serif text-[36px] leading-none">Products recommended for your actual services.</h2><div className="mt-6 grid gap-3 md:grid-cols-2">{productRecommendations.map((p)=><Link key={p.id} href={`/access/shop?product=${encodeURIComponent(p.product_slug)}`} className="group flex items-center justify-between gap-4 border-b border-champagne/20 pb-3"><div><p className="text-[13px] font-medium">{humanize(p.product_slug)}</p>{p.reason&&<p className="mt-1 text-[11px] text-taupe">{p.reason}</p>}</div><ArrowRight size={17} className="text-mocha transition-transform group-hover:translate-x-1"/></Link>)}</div><Link href="/access/shop" className="mt-6 inline-flex rounded-full bg-espresso px-5 py-3 text-[9px] uppercase tracking-[0.15em] text-ivory">Shop your routine</Link></section>}
  </div>
}

function MemoryCard({memory}:{memory:Memory}){
  const visibleDetails=Object.entries(memory.details||{}).slice(0,6);
  const bookingHref=`/reservar${memory.service_id?`?service=${encodeURIComponent(memory.service_id)}${memory.staff_id?`&staff=${encodeURIComponent(memory.staff_id)}`:""}&memory=${encodeURIComponent(memory.id)}`:""}`;
  return <article className="rounded-[24px] border border-champagne/30 bg-white/45 p-6"><p className="text-[9px] uppercase tracking-[0.22em] text-mocha">{categoryLabels[memory.category]||memory.category}</p><h3 className="mt-2 font-serif text-[30px] leading-none">{memory.title}</h3>{memory.summary&&<p className="mt-3 text-[13px] leading-relaxed text-taupe">{memory.summary}</p>}{visibleDetails.length>0&&<dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3">{visibleDetails.map(([key,value])=><div key={key}><dt className="text-[8px] uppercase tracking-[0.13em] text-taupe">{humanize(key)}</dt><dd className="mt-1 text-[12px] text-espresso">{formatValue(value)}</dd></div>)}</dl>}<div className="mt-6 flex flex-wrap gap-2"><Link href={bookingHref} className="rounded-full bg-espresso px-4 py-2.5 text-[9px] uppercase tracking-[0.14em] text-ivory">Book this again</Link><Link href={`/reservar${memory.service_id?`?service=${encodeURIComponent(memory.service_id)}`:""}`} className="rounded-full border border-mocha/30 px-4 py-2.5 text-[9px] uppercase tracking-[0.14em] text-mocha">Try a new look</Link></div></article>
}

function RecommendationCard({r,clientId,partnerEnabled}:{r:Recommendation;clientId:string;partnerEnabled:boolean}){
  const isPartner=r.type==="partner"&&r.partner_key==="body_shaper_system";
  if(isPartner&&!partnerEnabled)return null;
  async function record(){await supabase.from("beauty_recommendation_outcomes").insert({recommendation_id:r.id,client_id:clientId,outcome:"viewed"})}
  async function partnerClick(){if(!isPartner)return;await supabase.from("partner_referral_events").insert({client_id:clientId,partner_key:"body_shaper_system",source:"gloria_access",campaign_key:"beauty_profile"})}
  const href=isPartner?"https://www.bodyshapersystem.com/systems?ref=gloria":r.recommended_product_slug?`/access/shop?product=${encodeURIComponent(r.recommended_product_slug)}`:r.recommended_service_id?`/reservar?service=${encodeURIComponent(r.recommended_service_id)}`:"/reservar";
  const label=r.type==="keep_my_vibe"?"Keep My Vibe":r.type==="refresh_me"?"Refresh Me":r.type==="surprise_me"?"Surprise Me":isPartner?"Complete Your Beauty Routine":"For You";
  return <article className="rounded-[24px] border border-champagne/30 bg-gradient-to-br from-white/65 to-blush/25 p-6"><p className="text-[9px] uppercase tracking-[0.22em] text-mocha">{label}</p><h3 className="mt-3 font-serif text-[29px] leading-none">{r.title}</h3>{r.description&&<p className="mt-3 text-[12px] leading-relaxed text-taupe">{r.description}</p>}<p className="mt-4 text-[10px] italic leading-relaxed text-taupe">Based on your usual preferences. Ask your stylist if this idea is right for you.</p><Link href={href} target={isPartner?"_blank":undefined} onClick={()=>{record();partnerClick()}} className="mt-5 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.14em] text-mocha">{isPartner?"Explore Body Shaper System":"Explore this look"}<ArrowRight size={15}/></Link></article>
}

function humanize(value:string){return value.replace(/^truss-/,'').replace(/-/g,' ').replace(/_/g,' ').replace(/\b\w/g,(c)=>c.toUpperCase())}
function formatValue(value:unknown){if(value===null||value===undefined)return "—";if(typeof value==="string"||typeof value==="number"||typeof value==="boolean")return String(value);if(Array.isArray(value))return value.join(", ");return "Saved"}
