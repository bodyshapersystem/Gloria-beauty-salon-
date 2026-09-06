"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Plus } from "lucide-react";
import { useAccess } from "@/components/access/AccessShell";
import { supabase } from "@/lib/supabase/client";

type Appointment = { id:string; service_id:string; staff_id:string; start_at:string; end_at:string; status:string; source:string; service:{name:string;price_label:string}|null; staff:{name:string}|null };

export default function AccessAppointmentsPage(){
  const {profile}=useAccess();
  const [items,setItems]=useState<Appointment[]>([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{ if(!profile)return; (async()=>{ const {data}=await supabase.from("appointments").select("id,service_id,staff_id,start_at,end_at,status,source,service:service_id(name,price_label),staff:staff_id(name)").eq("client_id",profile.id).order("start_at",{ascending:false}); setItems(((data as unknown) as Appointment[])||[]); setLoading(false); })(); },[profile?.id]);
  const now=Date.now();
  const upcoming=useMemo(()=>items.filter(x=>new Date(x.start_at).getTime()>=now && !["cancelled","completed","no_show"].includes(x.status)).sort((a,b)=>+new Date(a.start_at)-+new Date(b.start_at)),[items,now]);
  const past=useMemo(()=>items.filter(x=>new Date(x.start_at).getTime()<now || ["completed","cancelled","no_show"].includes(x.status)),[items,now]);
  return <div>
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5"><div><p className="text-[10px] uppercase tracking-[0.3em] text-mocha">Gloria Access</p><h1 className="mt-2 font-serif text-[42px] md:text-[56px] leading-none">Mis citas</h1><p className="mt-3 text-[14px] text-taupe">Tu agenda Gloria, pasada y futura, en un solo lugar.</p></div><Link href="/access/book" className="inline-flex items-center justify-center gap-2 rounded-full bg-espresso px-5 py-3 text-[10px] uppercase tracking-[0.14em] text-ivory"><Plus size={15}/> Reservar</Link></div>
    {loading?<p className="mt-10 text-sm text-taupe">Cargando...</p>:items.length===0?<Empty/>:<>
      <Section title="Próximas">{upcoming.length?upcoming.map(a=><Card key={a.id} a={a} past={false}/>):<div className="rounded-[22px] border border-champagne/25 bg-white/35 p-6"><p className="text-sm text-taupe">No tienes próximas citas.</p><Link href="/access/book" className="mt-4 inline-flex text-[10px] uppercase tracking-[0.14em] text-mocha">Reservar una cita →</Link></div>}</Section>
      <Section title="Anteriores">{past.length?past.map(a=><Card key={a.id} a={a} past/>):<p className="text-sm text-taupe">No past appointments yet.</p>}</Section>
    </>}
  </div>;
}
function Section({title,children}:{title:string;children:React.ReactNode}){return <section className="mt-10"><div className="flex items-center gap-4 mb-4"><h2 className="text-[10px] uppercase tracking-[0.28em] text-mocha">{title}</h2><span className="h-px flex-1 bg-champagne/40"/></div><div className="space-y-3">{children}</div></section>}
function Card({a,past}:{a:Appointment;past:boolean}){const bookAgain=`/access/book?service=${encodeURIComponent(a.service_id)}&staff=${encodeURIComponent(a.staff_id)}`;return <article className="rounded-[22px] border border-champagne/30 bg-white/45 p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5"><div><p className="text-[9px] uppercase tracking-[0.2em] text-taupe">{formatDate(a.start_at)}</p><h3 className="mt-2 font-serif text-[28px] leading-none">{a.service?.name||"Appointment"}</h3><p className="mt-2 text-[13px] text-mocha">{a.staff?.name||"Gloria Beauty Salon"} · {formatTime(a.start_at)}</p><p className="mt-2 text-[11px] text-taupe">{human(a.status)}{a.service?.price_label?` · ${a.service.price_label}`:""}</p></div><div className="flex flex-wrap gap-2">{past?<><Link href={bookAgain} className="rounded-full bg-espresso px-4 py-2.5 text-[9px] uppercase tracking-[0.14em] text-ivory">Book Again</Link><Link href={bookAgain} className="rounded-full border border-mocha/30 px-4 py-2.5 text-[9px] uppercase tracking-[0.14em] text-mocha">Same Professional</Link></>:<><Link href={`/access/appointments/${a.id}`} className="rounded-full bg-espresso px-4 py-2.5 text-[9px] uppercase tracking-[0.14em] text-ivory">View Details</Link><Link href={`/access/appointments/${a.id}/reschedule`} className="rounded-full border border-mocha/30 px-4 py-2.5 text-[9px] uppercase tracking-[0.14em] text-mocha">Reschedule</Link></>}</div></article>}
function Empty(){return <div className="mt-10 rounded-[28px] border border-champagne/30 bg-white/50 p-8 text-center"><CalendarDays className="mx-auto text-mocha"/><h2 className="mt-4 font-serif text-[34px]">No appointments yet.</h2><p className="mt-3 text-sm text-taupe">Tu beauty calendar empieza con tu primera reserva.</p><Link href="/access/book" className="mt-6 inline-flex rounded-full bg-espresso px-6 py-3 text-[10px] uppercase tracking-[0.16em] text-ivory">Book your first appointment</Link></div>}
function human(v:string){return v.replaceAll("_"," ").replace(/\b\w/g,c=>c.toUpperCase())}
function formatDate(v:string){return new Date(v).toLocaleDateString("es-US",{weekday:"long",month:"long",day:"numeric",year:"numeric",timeZone:"America/New_York"})} function formatTime(v:string){return new Date(v).toLocaleTimeString("es-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}
