"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Power, Scissors, UserRound } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Staff={id:string;name:string;role:string;photo_url:string|null;active:boolean};
type Assignment={staff_id:string;service:{name:string;category:string}|null};
type Appointment={id:string;staff_id:string;start_at:string;client_name:string;service:{name:string}|null};

export default function TeamPage(){
  const [staff,setStaff]=useState<Staff[]>([]);const [assignments,setAssignments]=useState<Assignment[]>([]);const [today,setToday]=useState<Appointment[]>([]);const [message,setMessage]=useState<string|null>(null);
  async function load(){const start=new Date();start.setHours(0,0,0,0);const end=new Date(start);end.setDate(end.getDate()+1);const [{data:s},{data:a},{data:t}]=await Promise.all([
    supabase.from("staff").select("id,name,role,photo_url,active").order("name"),
    supabase.from("staff_services").select("staff_id,service:service_id(name,category)"),
    supabase.from("appointments").select("id,staff_id,start_at,client_name,service:service_id(name)").gte("start_at",start.toISOString()).lt("start_at",end.toISOString()).in("status",["pending","confirmed","in_progress"]).order("start_at")
  ]);setStaff((s as Staff[])||[]);setAssignments((a as Assignment[])||[]);setToday((t as Appointment[])||[])}
  useEffect(()=>{load()},[]);
  const stats=useMemo(()=>staff.map(s=>({staff:s,services:assignments.filter(a=>a.staff_id===s.id),appointments:today.filter(a=>a.staff_id===s.id)})),[staff,assignments,today]);
  async function toggle(s:Staff){setMessage(null);const {error}=await supabase.rpc("hub_update_staff_active",{p_staff_id:s.id,p_active:!s.active});if(error){setMessage(error.message);return;}await load()}
  return <div><p className="text-[10px] uppercase tracking-[0.28em] text-mocha">Gloria Hub</p><h1 className="mt-2 font-serif text-[48px] md:text-[58px] leading-none">Team</h1><p className="mt-3 text-[13px] text-taupe">See who is active, what each professional performs and today’s workload.</p>{message&&<p className="mt-4 text-[12px] text-red-700">{message}</p>}<div className="mt-8 grid gap-4 lg:grid-cols-2">{stats.map(({staff:s,services,appointments})=><article key={s.id} className="rounded-[26px] border border-champagne/30 bg-white/45 p-6"><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-4"><div className="h-14 w-14 rounded-full bg-blush/60 flex items-center justify-center text-mocha"><UserRound size={24}/></div><div><h2 className="font-serif text-[31px] leading-none">{s.name}</h2><p className="mt-2 text-[11px] text-taupe">{s.role}</p></div></div><button onClick={()=>toggle(s)} className={`rounded-full border px-3 py-2 text-[9px] uppercase tracking-[0.12em] ${s.active?"border-mocha/30 text-mocha":"border-taupe/25 text-taupe"}`}><Power size={13} className="inline mr-1"/>{s.active?"Active":"Inactive"}</button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-[18px] border border-champagne/20 p-4"><div className="flex items-center gap-2 text-mocha"><Scissors size={15}/><span className="text-[9px] uppercase tracking-[0.16em]">Services</span></div><p className="mt-3 text-[12px] leading-relaxed text-taupe">{services.length?services.map(x=>x.service?.name).filter(Boolean).join(" · "):"No services assigned"}</p></div><div className="rounded-[18px] border border-champagne/20 p-4"><div className="flex items-center gap-2 text-mocha"><CalendarDays size={15}/><span className="text-[9px] uppercase tracking-[0.16em]">Today</span></div><p className="mt-3 font-serif text-[28px]">{appointments.length}</p><p className="text-[11px] text-taupe">appointments</p></div></div></article>)}</div></div>
}
