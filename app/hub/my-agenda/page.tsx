"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, Scissors, TrendingUp, UserRound, UsersRound } from "lucide-react";
import { AppointmentDetailSheet } from "@/components/hub/AppointmentDetailSheet";
import { GloriaDashboardCover } from "@/components/ui/GloriaDashboardCover";
import { supabase } from "@/lib/supabase/client";

type Appointment={id:string;client_name:string;client_phone:string;start_at:string;end_at:string;status:string;price_cents:number|null;service:{name:string;category:string}|null;client:{client_type:string}|null};
type Staff={id:string;name:string;photo_url:string|null;role:string|null};
const statusLabels:Record<string,string>={pending:"Pendiente",confirmed:"Confirmada",in_progress:"En curso",completed:"Completada",cancelled:"Cancelada",no_show:"No se presentó"};

export default function MyAgendaPage(){
  const [items,setItems]=useState<Appointment[]>([]);const [staff,setStaff]=useState<Staff|null>(null);const [loading,setLoading]=useState(true);const [selectedId,setSelectedId]=useState<string|null>(null);
  useEffect(()=>{(async()=>{const {data:{session}}=await supabase.auth.getSession();let staffId:string|null=null;if(session){const {data:p}=await supabase.from("user_profiles").select("staff_id").eq("auth_user_id",session.user.id).maybeSingle();staffId=p?.staff_id||null;if(staffId){const {data:s}=await supabase.from("staff").select("id,name,photo_url,role").eq("id",staffId).maybeSingle();setStaff((s as Staff|null)||null)}}const start=new Date();start.setHours(0,0,0,0);const end=new Date(start);end.setDate(end.getDate()+1);let q=supabase.from("appointments").select("id,client_name,client_phone,start_at,end_at,status,price_cents,service:service_id(name,category),client:client_id(client_type)").gte("start_at",start.toISOString()).lt("start_at",end.toISOString()).order("start_at");if(staffId)q=q.eq("staff_id",staffId);const {data}=await q;setItems(((data as unknown) as Appointment[])||[]);setLoading(false)})()},[]);
  const active=useMemo(()=>items.filter(x=>!["cancelled","no_show"].includes(x.status)),[items]);
  const completed=useMemo(()=>items.filter(x=>x.status==="completed"),[items]);
  const needsReview=useMemo(()=>items.filter(x=>["pending","confirmed","in_progress"].includes(x.status)&&new Date(x.end_at)<=new Date()),[items]);
  const [reviewBusy,setReviewBusy]=useState<string|null>(null);
  async function quickMark(id:string,status:"completed"|"no_show"){setReviewBusy(id);await supabase.rpc("hub_update_appointment_status",{p_appointment_id:id,p_status:status});setItems(prev=>prev.map(x=>x.id===id?{...x,status}:x));setReviewBusy(null)}
  const revenue=useMemo(()=>completed.filter(x=>x.client?.client_type!=="team").reduce((n,x)=>n+(x.price_cents||0),0),[completed]);
  const clients=useMemo(()=>new Set(active.filter(x=>x.client?.client_type!=="team").map(x=>x.client_name.trim().toLowerCase())).size,[active]);
  const attendance=active.length?Math.round((completed.length/active.length)*100):100;
  const name=staff?.name||"Team";
  const message=professionMessage(name,staff?.role||"");
  const heroPhoto=name.trim().toLowerCase().startsWith("diana")
    ? "/images/gloria/team/diana-hero.jpg"
    : staff?.photo_url;

  return <div className="pb-5">
    <GloriaDashboardCover role="HUB - TEAM" name={name} photoUrl={heroPhoto} professionMessage={message} tagline={["Same girls.","Higher standards."]} businessMetrics={[
      {label:"Citas hoy",value:loading?"…":String(active.length)},
      {label:"Ingresos hoy",value:money(revenue)},
      {label:"Clientas",value:String(clients)},
      {label:"Asistencia",value:String(attendance)+"%"}
    ]} metricValue={loading?"…":String(active.length)} metricLabel="Citas hoy" metricHref="/hub/my-agenda" shortcuts={[
      {label:"Mis Citas",href:"/hub/my-agenda",icon:<CalendarDays size={19}/>},
      {label:"Mis Clientes",href:"/hub/clients",icon:<UsersRound size={19}/>},
      {label:"Calendario",href:"/hub/calendar",icon:<Scissors size={19}/>},
      {label:"Progreso",href:"/hub/progress",icon:<TrendingUp size={19}/>}
    ]}/>

    {needsReview.length>0&&<section className="mt-6 rounded-[24px] border border-[#B4443F]/30 bg-[#FBEFED] p-5"><div className="flex items-center justify-between"><div><p className="text-[8px] uppercase tracking-[.18em] text-[#B4443F]">Confirma tu día</p><h2 className="mt-1 font-serif text-[26px]">{needsReview.length} cita{needsReview.length>1?"s":""} por confirmar</h2></div></div><div className="mt-4 space-y-2">{needsReview.map(a=><div key={a.id} className="flex items-center gap-3 rounded-[16px] bg-white/70 px-4 py-3"><div className="min-w-0 flex-1"><p className="font-serif text-[18px] leading-none truncate">{a.client_name}</p><p className="mt-1 text-[9px] text-taupe truncate">{time(a.start_at)} · {a.service?.name||"Servicio"}</p></div><button disabled={reviewBusy===a.id} onClick={()=>quickMark(a.id,"completed")} className="rounded-full bg-[#4A352B] px-3.5 py-2 text-[8px] uppercase tracking-[.1em] text-ivory disabled:opacity-50">Asistió</button><button disabled={reviewBusy===a.id} onClick={()=>quickMark(a.id,"no_show")} className="rounded-full border border-[#BDAA9D] px-3.5 py-2 text-[8px] uppercase tracking-[.1em] text-mocha disabled:opacity-50">No vino</button></div>)}</div><p className="mt-3 text-[9px] leading-relaxed text-[#8A5A50]">Si no las confirmas, el sistema las marca como completadas automáticamente al día siguiente.</p></section>}

    <section className="mt-6 overflow-hidden rounded-[26px] border border-[#E0D2C8] bg-white/60 shadow-[0_10px_30px_rgba(52,38,31,.04)]"><div className="flex items-end justify-between border-b border-[#E9DDD4] px-5 py-4"><div><p className="text-[8px] uppercase tracking-[.2em] text-mocha">Tu agenda de hoy</p><h2 className="mt-1 font-serif text-[30px]">Tus clientas</h2></div><Link href="/hub/calendar" className="text-[8px] uppercase tracking-[.12em] text-taupe">Ver todas →</Link></div>{loading?<p className="p-7 text-[12px] text-taupe">Cargando tu día...</p>:items.length===0?<div className="p-8"><h3 className="font-serif text-[28px]">No hay citas hoy.</h3><p className="mt-2 text-[10px] text-taupe">Tus citas asignadas aparecerán aquí automáticamente.</p></div>:items.map(a=><article key={a.id} onClick={()=>setSelectedId(a.id)} className="flex cursor-pointer flex-col gap-4 border-b border-[#E9DDD4] p-5 transition hover:bg-white/55 last:border-0 md:flex-row md:items-center md:justify-between"><div className="flex gap-4"><div className="w-[76px] shrink-0"><p className="font-serif text-[22px]">{time(a.start_at)}</p><p className="mt-1 text-[9px] text-taupe">{minutes(a.start_at,a.end_at)} min</p></div><div><div className="flex flex-wrap items-center gap-2"><UserRound size={14} className="text-mocha"/><p className="text-[12px] font-medium">{a.client_name}</p>{a.client?.client_type&&<span className="rounded-full bg-[#F5E8E2] px-2 py-0.5 text-[7px] uppercase tracking-[.08em] text-[#7B3C48]">{clientLabel(a.client.client_type)}</span>}</div><p className="mt-1 font-serif text-[19px] text-mocha">{a.service?.name||"Servicio"}</p><span className="mt-2 inline-flex rounded-full bg-[#EFE2DC] px-2.5 py-1 text-[7px] uppercase tracking-[.08em] text-[#7B4A44]">{statusLabels[a.status]||a.status}</span></div></div><div className="flex flex-wrap gap-2">{["confirmed","in_progress"].includes(a.status)&&<Link href={`/hub/appointments/${a.id}/complete`} onClick={e=>e.stopPropagation()} className="rounded-full bg-[#4A352B] px-4 py-2.5 text-[8px] uppercase tracking-[.12em] text-ivory">Completar visita</Link>}<a href={`tel:${a.client_phone}`} onClick={e=>e.stopPropagation()} className="rounded-full border border-[#BDAA9D] px-4 py-2.5 text-[8px] uppercase tracking-[.12em] text-mocha">Llamar</a></div></article>)}</section>
    {selectedId&&<AppointmentDetailSheet appointmentId={selectedId} onClose={()=>setSelectedId(null)} onSaved={()=>location.reload()}/>}
  </div>
}
function time(v:string){return new Date(v).toLocaleTimeString("es-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}
function minutes(a:string,b:string){return Math.round((+new Date(b)-+new Date(a))/60000)}

function professionMessage(name:string,role:string){
  const key=(name+" "+role).toLowerCase();
  if(key.includes("caro")||key.includes("lash"))return "Lashes change everything.";
  if(key.includes("diana")||key.includes("nail")||key.includes("brow")||key.includes("makeup"))return "Beauty is in the details.";
  if(key.includes("emmy")||key.includes("tan"))return "Sun-kissed confidence, every day.";
  if(key.includes("nudis")||key.includes("hair")||key.includes("color"))return "Great hair changes everything.";
  return "Beauty creates confidence.";
}
function money(c:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format((c||0)/100)}
function clientLabel(value:string){return ({new:"Nueva",regular:"Regular",ambassador:"Ambassador",vip:"VIP Client",team:"Team"} as Record<string,string>)[value]||value}
