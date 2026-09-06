"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LockKeyhole, Sparkles } from "lucide-react";
import { useAccess } from "@/components/access/AccessShell";
import { supabase } from "@/lib/supabase/client";

type Memory = { id:string; category:string; title:string; summary:string|null; details:Record<string,unknown>; approved_photo_urls:string[]; created_at:string };
type FirstAppointment = { start_at:string; service:{name:string}|null; staff:{name:string}|null };

export default function BeautyProfilePage(){
  const {profile}=useAccess();
  const [memory,setMemory]=useState<Memory[]>([]);
  const [first,setFirst]=useState<FirstAppointment|null>(null);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{if(!profile)return;(async()=>{
    const [{data:m},{data:a}]=await Promise.all([
      supabase.from("client_memory").select("id,category,title,summary,details,approved_photo_urls,created_at").eq("client_id",profile.id).eq("client_visible",true).order("created_at",{ascending:false}),
      supabase.from("appointments").select("start_at,service:service_id(name),staff:staff_id(name)").eq("client_id",profile.id).in("status",["confirmed","in_progress","completed"]).order("start_at",{ascending:true}).limit(1).maybeSingle()
    ]);
    setMemory((m as Memory[])||[]); setFirst((a as FirstAppointment|null)||null); setLoading(false);
  })()},[profile?.id]);
  if(!profile)return null;
  return <div><p className="text-[10px] uppercase tracking-[0.3em] text-mocha">Gloria Access</p><h1 className="mt-2 font-serif text-[42px] md:text-[56px] leading-none">My Beauty Profile</h1><p className="mt-3 text-[14px] text-taupe">Tu beauty story, construida con visitas reales.</p>
    {loading?<p className="mt-10 text-sm text-taupe">Cargando...</p>:profile.beauty_state==="no_appointment_history"?<Locked/>:profile.beauty_state==="appointment_confirmed"||memory.length===0?<Started first={first}/>:<Active memory={memory}/>} </div>
}
function Locked(){return <section className="mt-10 rounded-[30px] border border-champagne/30 bg-white/50 p-8 md:p-10 text-center"><div className="mx-auto h-12 w-12 rounded-full border border-champagne/45 flex items-center justify-center text-mocha"><LockKeyhole size={20}/></div><h2 className="mt-5 font-serif text-[38px] leading-none">Your beauty profile starts here</h2><p className="mt-4 max-w-[560px] mx-auto text-[13px] leading-relaxed text-taupe">After your first Gloria Beauty Salon visit, your looks, preferences and beauty history will begin to live here.</p><Link href="/reservar" className="mt-7 inline-flex rounded-full bg-espresso px-6 py-3 text-[10px] uppercase tracking-[0.17em] text-ivory">Book an appointment</Link></section>}
function Started({first}:{first:FirstAppointment|null}){return <section className="mt-10 rounded-[30px] border border-champagne/30 bg-gradient-to-br from-white/60 to-blush/30 p-8 md:p-10"><Sparkles className="text-mocha"/><p className="mt-5 text-[10px] uppercase tracking-[0.25em] text-mocha">Your beauty journey has started</p><h2 className="mt-3 font-serif text-[38px] leading-none">Your first chapter is on the calendar.</h2>{first&&<div className="mt-6 border-l border-champagne pl-5"><p className="font-serif text-[26px]">{first.service?.name||"Appointment"}</p><p className="mt-1 text-[13px] text-taupe">{first.staff?.name||"Gloria Beauty Salon"} · {new Date(first.start_at).toLocaleDateString("es-US",{month:"long",day:"numeric",year:"numeric"})}</p></div>}<p className="mt-6 max-w-[620px] text-[13px] leading-relaxed text-taupe">After your visit, your service details and personalized beauty memory can appear here once your stylist saves client-visible notes.</p></section>}
function Active({memory}:{memory:Memory[]}){return <div className="mt-10"><div className="rounded-[30px] bg-espresso text-ivory p-8"><p className="text-[10px] uppercase tracking-[0.28em] text-champagne">Your beauty story</p><h2 className="mt-3 font-serif text-[40px] leading-none">Looks worth remembering.</h2><p className="mt-4 max-w-[600px] text-[13px] text-ivory/70">Only client-visible memory approved from real salon visits appears here.</p></div><div className="mt-5 grid gap-4 md:grid-cols-2">{memory.map(m=><article key={m.id} className="rounded-[24px] border border-champagne/30 bg-white/45 p-6"><p className="text-[9px] uppercase tracking-[0.22em] text-mocha">{m.category}</p><h3 className="mt-2 font-serif text-[30px] leading-none">{m.title}</h3>{m.summary&&<p className="mt-3 text-[13px] leading-relaxed text-taupe">{m.summary}</p>}<div className="mt-5 flex gap-2"><Link href="/reservar" className="rounded-full bg-espresso px-4 py-2.5 text-[9px] uppercase tracking-[0.14em] text-ivory">Book this again</Link></div></article>)}</div></div>}
