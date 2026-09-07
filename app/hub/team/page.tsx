"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CalendarDays, Mail, Pencil, Phone, Power, Scissors, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Staff={id:string;name:string;role:string;photo_url:string|null;email:string|null;phone:string|null;active:boolean};
type Service={id:string;name:string;category:string};
type Assignment={staff_id:string;service_id:string};
type Appointment={id:string;staff_id:string;start_at:string;client_name:string;service_name:string|null};

export default function TeamPage(){
  const [staff,setStaff]=useState<Staff[]>([]);
  const [services,setServices]=useState<Service[]>([]);
  const [assignments,setAssignments]=useState<Assignment[]>([]);
  const [today,setToday]=useState<Appointment[]>([]);
  const [editing,setEditing]=useState<Staff|null>(null);
  const [message,setMessage]=useState<string|null>(null);

  async function load(){
    const start=new Date();start.setHours(0,0,0,0);const end=new Date(start);end.setDate(end.getDate()+1);
    const [{data:s},{data:sv},{data:a},{data:t}]=await Promise.all([
      supabase.from("staff").select("id,name,role,photo_url,email,phone,active").order("name"),
      supabase.from("services").select("id,name,category").eq("active",true).order("category").order("name"),
      supabase.from("staff_services").select("staff_id,service_id"),
      supabase.from("appointments").select("id,staff_id,start_at,client_name,service:service_id(name)").gte("start_at",start.toISOString()).lt("start_at",end.toISOString()).in("status",["pending","confirmed","in_progress"]).order("start_at")
    ]);
    setStaff((s as Staff[])||[]);
    setServices((sv as Service[])||[]);
    setAssignments((a as Assignment[])||[]);
    setToday(((t as any[])||[]).map(x=>({id:x.id,staff_id:x.staff_id,start_at:x.start_at,client_name:x.client_name,service_name:Array.isArray(x.service)?x.service[0]?.name:x.service?.name||null})));
  }
  useEffect(()=>{load()},[]);

  const stats=useMemo(()=>staff.map(s=>({
    staff:s,
    services:services.filter(v=>assignments.some(a=>a.staff_id===s.id&&a.service_id===v.id)),
    appointments:today.filter(a=>a.staff_id===s.id)
  })),[staff,services,assignments,today]);

  async function toggle(s:Staff){
    setMessage(null);
    const {error}=await supabase.rpc("hub_update_staff_active",{p_staff_id:s.id,p_active:!s.active});
    if(error){setMessage(error.message);return;}
    await load();
  }

  return <div>
    <div className="flex items-end justify-between gap-4">
      <div><p className="text-[9px] uppercase tracking-[0.26em] text-mocha">Gloria Hub</p><h1 className="mt-1 font-serif text-[42px] md:text-[54px] leading-none">Equipo</h1><p className="mt-2 text-[12px] text-taupe">El equipo, sus especialidades y su agenda de hoy.</p></div>
    </div>
    {message&&<p className="mt-4 rounded-[14px] bg-blush/35 px-4 py-3 text-[11px] text-mocha">{message}</p>}

    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stats.map(({staff:s,services:ss,appointments})=><article key={s.id} className="group overflow-hidden rounded-[26px] border border-champagne/25 bg-white/75 shadow-[0_10px_30px_rgba(52,38,31,.04)]">
        <div className="relative h-[210px] bg-[#EADFD7]">
          {s.photo_url?<Image src={s.photo_url} alt={s.name} fill className="object-cover object-top"/>:<div className="grid h-full place-items-center font-serif text-[64px] text-mocha/35">{s.name.charAt(0)}</div>}
          <div className="absolute inset-0 bg-gradient-to-t from-[#34261F]/70 via-transparent to-transparent"/>
          <div className="absolute bottom-4 left-4 right-4 text-ivory"><p className="text-[8px] uppercase tracking-[.2em] text-champagne">{s.role}</p><h2 className="mt-1 font-serif text-[32px] leading-none">{s.name}</h2></div>
          <button onClick={()=>setEditing(s)} className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-[#FBF8F3]/90 text-mocha shadow-sm" aria-label={`Editar ${s.name}`}><Pencil size={16}/></button>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {s.email&&<span className="inline-flex items-center gap-1.5 rounded-full bg-[#F2E7DF] px-3 py-1.5 text-[8px] text-mocha"><Mail size={11}/>{s.email}</span>}
            {s.phone&&<span className="inline-flex items-center gap-1.5 rounded-full bg-[#F2E7DF] px-3 py-1.5 text-[8px] text-mocha"><Phone size={11}/>{s.phone}</span>}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-[17px] bg-[#F9F4EF] p-4"><CalendarDays size={15} className="text-mocha"/><p className="mt-3 font-serif text-[28px]">{appointments.length}</p><p className="text-[9px] text-taupe">citas hoy</p></div>
            <div className="rounded-[17px] bg-blush/30 p-4"><Scissors size={15} className="text-mocha"/><p className="mt-3 font-serif text-[28px]">{ss.length}</p><p className="text-[9px] text-taupe">servicios</p></div>
          </div>

          <div className="mt-4">
            <p className="text-[8px] uppercase tracking-[.18em] text-taupe">Especialidades</p>
            <p className="mt-2 text-[10px] leading-relaxed text-mocha">{ss.length?ss.slice(0,5).map(x=>x.name).join(" · "):"Sin servicios asignados"}{ss.length>5?` · +${ss.length-5}`:""}</p>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-champagne/20 pt-4">
            <span className={`rounded-full px-3 py-1.5 text-[8px] uppercase tracking-[.1em] ${s.active?"bg-[#DFE8D9] text-[#4A6045]":"bg-[#EEE6E1] text-taupe"}`}>{s.active?"Activa":"Inactiva"}</span>
            <button onClick={()=>toggle(s)} className="inline-flex items-center gap-1.5 text-[9px] text-mocha"><Power size={13}/>{s.active?"Desactivar":"Activar"}</button>
          </div>
        </div>
      </article>)}
    </div>

    {editing&&<EditTeamMember staff={editing} services={services} selectedIds={assignments.filter(a=>a.staff_id===editing.id).map(a=>a.service_id)} onClose={()=>setEditing(null)} onSaved={async()=>{setEditing(null);setMessage("Perfil del equipo actualizado.");await load()}}/>}
  </div>
}

function EditTeamMember({staff,services,selectedIds,onClose,onSaved}:{staff:Staff;services:Service[];selectedIds:string[];onClose:()=>void;onSaved:()=>void}){
  const [name,setName]=useState(staff.name);const [role,setRole]=useState(staff.role);const [email,setEmail]=useState(staff.email||"");const [phone,setPhone]=useState(staff.phone||"");const [photo,setPhoto]=useState(staff.photo_url||"");const [active,setActive]=useState(staff.active);const [ids,setIds]=useState<string[]>(selectedIds);const [saving,setSaving]=useState(false);const [error,setError]=useState<string|null>(null);
  function flip(id:string){setIds(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id])}
  async function save(){setSaving(true);setError(null);const {error:e1}=await supabase.rpc("hub_update_staff_profile",{p_staff_id:staff.id,p_name:name,p_role:role,p_email:email||null,p_phone:phone||null,p_photo_url:photo||null,p_active:active});if(e1){setSaving(false);setError(e1.message);return;}const {error:e2}=await supabase.rpc("hub_set_staff_services",{p_staff_id:staff.id,p_service_ids:ids});setSaving(false);if(e2){setError(e2.message);return;}onSaved()}
  const grouped=useMemo(()=>Array.from(new Set(services.map(s=>s.category))).map(cat=>[cat,services.filter(s=>s.category===cat)] as const),[services]);
  return <div className="fixed inset-0 z-[100] bg-espresso/45 flex justify-end" onClick={onClose}><aside className="h-full w-full max-w-[560px] overflow-y-auto bg-[#FBF8F3] p-6" onClick={e=>e.stopPropagation()}>
    <div className="flex items-start justify-between"><div><p className="text-[8px] uppercase tracking-[.22em] text-mocha">Editar equipo</p><h2 className="mt-2 font-serif text-[36px]">{staff.name}</h2></div><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-champagne/35"><X size={18}/></button></div>
    <div className="mt-6 grid gap-3 sm:grid-cols-2"><Field label="Nombre" value={name} set={setName}/><Field label="Especialidad / Rol" value={role} set={setRole}/><Field label="Email" value={email} set={setEmail} type="email"/><Field label="Teléfono" value={phone} set={setPhone} type="tel"/><div className="sm:col-span-2"><Field label="Foto (ruta o URL)" value={photo} set={setPhoto}/></div></div>
    <label className="mt-4 flex items-center gap-2 text-[11px] text-mocha"><input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)}/> Profesional activa</label>
    <div className="mt-6"><p className="text-[8px] uppercase tracking-[.18em] text-taupe">Servicios que puede realizar</p><div className="mt-3 space-y-4">{grouped.map(([cat,list])=><div key={cat}><p className="font-serif text-[20px] capitalize">{cat}</p><div className="mt-2 flex flex-wrap gap-2">{list.map(s=><button type="button" key={s.id} onClick={()=>flip(s.id)} className={`rounded-full border px-3 py-2 text-[8px] ${ids.includes(s.id)?"border-mocha bg-[#4A352B] text-ivory":"border-champagne/35 bg-white/70 text-mocha"}`}>{s.name}</button>)}</div></div>)}</div></div>
    {error&&<p className="mt-4 text-[10px] text-red-700">{error}</p>}
    <button disabled={saving||!name.trim()||!role.trim()} onClick={save} className="mt-7 w-full rounded-full bg-[#4A352B] px-5 py-4 text-[9px] uppercase tracking-[.14em] text-ivory disabled:opacity-40">{saving?"Guardando…":"Guardar cambios"}</button>
  </aside></div>
}
function Field({label,value,set,type="text"}:{label:string;value:string;set:(v:string)=>void;type?:string}){return <label><span className="mb-1.5 block text-[8px] uppercase tracking-[.15em] text-taupe">{label}</span><input type={type} value={value} onChange={e=>set(e.target.value)} className="w-full rounded-[14px] border border-champagne/35 bg-white/75 px-3.5 py-3 text-[12px] outline-none"/></label>}
