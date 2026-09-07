"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CalendarDays, CheckCircle2, ChevronRight, Clock3, Scissors, TrendingUp, UserRound, UsersRound } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { supabase } from "@/lib/supabase/client";

type Appointment={id:string;client_name:string;client_phone:string;start_at:string;end_at:string;status:string;service:{name:string;category:string}|null};
type Staff={id:string;name:string;photo_url:string|null};

const statusLabels:Record<string,string>={pending:"Pendiente",confirmed:"Confirmada",in_progress:"En curso",completed:"Completada",cancelled:"Cancelada",no_show:"No se presentó"};

export default function MyAgendaPage(){
  const [items,setItems]=useState<Appointment[]>([]);
  const [staff,setStaff]=useState<Staff|null>(null);
  const [loading,setLoading]=useState(true);

  useEffect(()=>{(async()=>{
    const {data:{session}}=await supabase.auth.getSession();
    let staffId:string|null=null;
    if(session){
      const {data:p}=await supabase.from("user_profiles").select("staff_id").eq("auth_user_id",session.user.id).maybeSingle();
      staffId=p?.staff_id||null;
      if(staffId){
        const {data:s}=await supabase.from("staff").select("id,name,photo_url").eq("id",staffId).maybeSingle();
        setStaff((s as Staff|null)||null);
      }
    }
    const start=new Date();start.setHours(0,0,0,0);const end=new Date(start);end.setDate(end.getDate()+1);
    let q=supabase.from("appointments").select("id,client_name,client_phone,start_at,end_at,status,service:service_id(name,category)").gte("start_at",start.toISOString()).lt("start_at",end.toISOString()).order("start_at");
    if(staffId)q=q.eq("staff_id",staffId);
    const {data}=await q;
    setItems(((data as unknown) as Appointment[])||[]);
    setLoading(false);
  })()},[]);

  const active=useMemo(()=>items.filter(x=>!["cancelled","no_show"].includes(x.status)),[items]);
  const next=active.find(x=>["pending","confirmed","in_progress"].includes(x.status))||null;
  const name=staff?.name||"Team";

  return <div className="pb-5">
    <section className="relative overflow-hidden rounded-[30px] border border-[#D7C4B7] min-h-[545px] px-5 py-6 md:min-h-[500px] md:px-9 md:py-8 shadow-[0_20px_55px_rgba(73,46,40,.10)]" style={{backgroundImage:teamCreamWineBg}}>
      <TeamMarble/>
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div><Logo className="h-[70px] w-auto"/><p className="-mt-1 ml-3 text-[8px] uppercase tracking-[.34em] text-[#5A352E]">Team</p></div>
          {staff?.photo_url?<img src={staff.photo_url} alt={name} className="h-11 w-11 rounded-full border-2 border-white/60 object-cover shadow-sm"/>:<span className="grid h-11 w-11 place-items-center rounded-full border border-[#8A6558]/20 bg-white/35 font-serif text-[18px] text-[#5B342D]">{name.charAt(0)}</span>}
        </div>

        <div className="mt-10 md:mt-12">
          <h1 className="font-serif text-[49px] md:text-[70px] leading-[.88] text-[#4A2824]">Hola,<br/>{name}</h1>
          <p className="mt-5 max-w-[320px] text-[9px] md:text-[10px] uppercase tracking-[.34em] leading-[1.8] text-[#5D3831]">Tu talento<br/>hace la diferencia.</p>
          <p className="mt-7 text-[10px] text-[#6E5148]">{todayLabel()}</p>
        </div>

        <div className="mt-5 flex items-center gap-4 rounded-[22px] border border-white/65 bg-[#FCF8F3]/82 p-4 shadow-[0_10px_28px_rgba(70,45,39,.08)] backdrop-blur-sm md:max-w-[520px]">
          <div className="min-w-[70px] border-r border-[#DCCBC0] pr-4"><p className="font-serif text-[36px] leading-none text-[#6D3938]">{active.length}</p><p className="mt-1 text-[8px] text-taupe">Citas hoy</p></div>
          <div className="min-w-0 flex-1">{next?<><p className="text-[8px] uppercase tracking-[.16em] text-taupe">Próxima cita · {time(next.start_at)}</p><p className="mt-1 truncate font-serif text-[20px]">{next.client_name}</p><p className="mt-1 truncate text-[9px] text-taupe">{next.service?.name||"Servicio"}</p></>:<><p className="font-serif text-[20px]">Tu agenda está libre</p><p className="mt-1 text-[9px] text-taupe">No hay citas activas por ahora.</p></>}</div><ChevronRight size={17} className="text-mocha"/>
        </div>

        <div className="mt-4 grid grid-cols-4 gap-2 md:max-w-[560px]">
          <TeamGlassShortcut href="/hub/my-agenda" icon={<CalendarDays size={18}/>} label="Mis Citas"/>
          <TeamGlassShortcut href="/hub/clients" icon={<UsersRound size={18}/>} label="Mis Clientes"/>
          <TeamGlassShortcut href="/hub/calendar" icon={<Scissors size={18}/>} label="Servicios"/>
          <TeamGlassShortcut href="/hub/progress" icon={<TrendingUp size={18}/>} label="Progreso"/>
        </div>
      </div>
    </section>

    <section className="mt-6 overflow-hidden rounded-[26px] border border-[#E0D2C8] bg-white/55 shadow-[0_10px_30px_rgba(52,38,31,.04)]">
      <div className="flex items-end justify-between border-b border-[#E9DDD4] px-5 py-4"><div><p className="text-[8px] uppercase tracking-[.2em] text-mocha">Tu agenda de hoy</p><h2 className="mt-1 font-serif text-[30px]">Tus clientas</h2></div><Link href="/hub/calendar" className="text-[8px] uppercase tracking-[.12em] text-taupe">Ver todas →</Link></div>
      {loading?<p className="p-7 text-[12px] text-taupe">Cargando tu día...</p>:items.length===0?<div className="p-8"><h3 className="font-serif text-[28px]">No hay citas hoy.</h3><p className="mt-2 text-[10px] text-taupe">Tus citas asignadas aparecerán aquí automáticamente.</p></div>:items.map(a=><article key={a.id} className="flex flex-col gap-4 border-b border-[#E9DDD4] p-5 last:border-0 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4"><div className="w-[76px] shrink-0"><p className="font-serif text-[22px]">{time(a.start_at)}</p><p className="mt-1 text-[9px] text-taupe">{minutes(a.start_at,a.end_at)} min</p></div><div><div className="flex items-center gap-2"><UserRound size={14} className="text-mocha"/><p className="text-[12px] font-medium">{a.client_name}</p></div><p className="mt-1 font-serif text-[19px] text-mocha">{a.service?.name||"Servicio"}</p><span className="mt-2 inline-flex rounded-full bg-[#EFE2DC] px-2.5 py-1 text-[7px] uppercase tracking-[.08em] text-[#7B4A44]">{statusLabels[a.status]||a.status}</span></div></div>
        <div className="flex flex-wrap gap-2">{["confirmed","in_progress"].includes(a.status)&&<Link href={"/hub/appointments/"+a.id+"/complete"} className="rounded-full bg-[#4A352B] px-4 py-2.5 text-[8px] uppercase tracking-[.12em] text-ivory">Completar visita</Link>}<a href={"tel:"+a.client_phone} className="rounded-full border border-[#BDAA9D] px-4 py-2.5 text-[8px] uppercase tracking-[.12em] text-mocha">Llamar</a></div>
      </article>)}
    </section>
  </div>
}

const teamCreamWineBg="radial-gradient(circle at 14% 12%,rgba(255,255,255,.94),transparent 28%),radial-gradient(ellipse at 88% 28%,rgba(115,54,61,.32),transparent 24%),radial-gradient(ellipse at 72% 64%,rgba(84,39,42,.34),transparent 27%),linear-gradient(145deg,#F8F0E7 0%,#E6CEC2 48%,#C9A69A 100%)";
function TeamMarble(){return <><span className="pointer-events-none absolute right-[-8%] top-[3%] h-[82%] w-[48%] rotate-[8deg] rounded-[58%_42%_62%_38%/43%_60%_40%_57%] border-[18px] border-white/25 bg-[linear-gradient(145deg,rgba(255,255,255,.42),rgba(108,46,51,.40),rgba(243,221,207,.48))] shadow-[inset_18px_0_30px_rgba(255,255,255,.26)] blur-[.2px]"/><span className="pointer-events-none absolute right-[10%] top-[8%] h-[78%] w-[12%] rotate-[22deg] rounded-[50%] bg-white/30 blur-xl"/><span className="pointer-events-none absolute right-[-3%] bottom-[-12%] h-[42%] w-[54%] rounded-[60%] bg-[#6E3038]/30 blur-3xl"/></>}
function TeamGlassShortcut({href,icon,label}:{href:string;icon:React.ReactNode;label:string}){return <Link href={href} className="flex min-h-[94px] flex-col items-center justify-center gap-2 rounded-[19px] border border-white/70 bg-[#FCF8F3]/78 text-[#5A352E] shadow-[0_8px_22px_rgba(73,46,40,.06)] backdrop-blur-sm"><span>{icon}</span><span className="text-center text-[8px] leading-tight">{label}</span></Link>}
function todayLabel(){return new Date().toLocaleDateString("es-US",{weekday:"long",day:"numeric",month:"long",timeZone:"America/New_York"})}
function time(v:string){return new Date(v).toLocaleTimeString("es-US",{hour:"numeric",minute:"2-digit",timeZone:"America/New_York"})}
function minutes(a:string,b:string){return Math.round((+new Date(b)-+new Date(a))/60000)}
