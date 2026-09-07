"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ImagePlus, Mail, Pencil, Phone, Power, Scissors, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Staff={id:string;name:string;role:string;photo_url:string|null;email:string|null;phone:string|null;active:boolean;salon_percentage:number};
type Service={id:string;name:string;category:string};
type Assignment={staff_id:string;service_id:string};
type Appointment={id:string;staff_id:string;start_at:string;client_name:string;service_name:string|null;status:string;price_cents:number|null};

export default function TeamPage(){
  const [staff,setStaff]=useState<Staff[]>([]);
  const [services,setServices]=useState<Service[]>([]);
  const [assignments,setAssignments]=useState<Assignment[]>([]);
  const [today,setToday]=useState<Appointment[]>([]);
  const [editing,setEditing]=useState<Staff|null>(null);
  const [message,setMessage]=useState<string|null>(null);

  async function load(){
    const now=new Date();const start=new Date(now);start.setHours(0,0,0,0);const end=new Date(start);end.setDate(end.getDate()+1);const weekStart=new Date(now);const wd=(weekStart.getDay()+6)%7;weekStart.setDate(weekStart.getDate()-wd);weekStart.setHours(0,0,0,0);
    const [{data:s},{data:sv},{data:a},{data:t}]=await Promise.all([
      supabase.from("staff").select("id,name,role,photo_url,email,phone,active,salon_percentage").order("name"),
      supabase.from("services").select("id,name,category").eq("active",true).order("category").order("name"),
      supabase.from("staff_services").select("staff_id,service_id"),
      supabase.from("appointments").select("id,staff_id,start_at,client_name,status,price_cents,service:service_id(name)").gte("start_at",weekStart.toISOString()).order("start_at")
    ]);
    setStaff((s as Staff[])||[]);
    setServices((sv as Service[])||[]);
    setAssignments((a as Assignment[])||[]);
    setToday(((t as any[])||[]).map(x=>({id:x.id,staff_id:x.staff_id,start_at:x.start_at,client_name:x.client_name,status:x.status,price_cents:x.price_cents,service_name:Array.isArray(x.service)?x.service[0]?.name:x.service?.name||null})));
  }
  useEffect(()=>{load()},[]);

  const stats=useMemo(()=>staff.map(s=>({
    staff:s,
    services:services.filter(v=>assignments.some(a=>a.staff_id===s.id&&a.service_id===v.id)),
    appointments:today.filter(a=>a.staff_id===s.id),
    todayAppointments:today.filter(a=>a.staff_id===s.id&&new Date(a.start_at)>=new Date(new Date().setHours(0,0,0,0))&&new Date(a.start_at)<new Date(new Date().setHours(24,0,0,0))),
    completed:today.filter(a=>a.staff_id===s.id&&a.status==="completed")
  })),[staff,services,assignments,today]);

  async function toggle(s:Staff){
    setMessage(null);
    const {error}=await supabase.rpc("hub_update_staff_active",{p_staff_id:s.id,p_active:!s.active});
    if(error){setMessage(error.message);return;}
    await load();
  }

  const teamRevenue=stats.reduce((sum,x)=>sum+x.completed.reduce((n,a)=>n+(a.price_cents||0),0),0);const teamClients=new Set(stats.flatMap(x=>x.completed.map(a=>a.client_name.toLowerCase().trim()))).size;const teamServices=stats.reduce((sum,x)=>sum+x.completed.length,0);const salonShare=stats.reduce((sum,x)=>{const rev=x.completed.reduce((n,a)=>n+(a.price_cents||0),0);return sum+Math.round(rev*(Number(x.staff.salon_percentage||0)/100))},0);

  return <div>
    <section className="relative overflow-hidden rounded-[30px] border border-[#D8C9BC] p-6 md:p-8" style={{backgroundImage:"radial-gradient(circle at 85% 20%,rgba(255,255,255,.85),transparent 30%),linear-gradient(135deg,#F7EFE8 0%,#E9D6CF 55%,#D7BDB2 100%)"}}><div className="absolute -right-10 -bottom-16 h-48 w-56 rounded-[48%] bg-[#7B3C48]/12 blur-2xl"/><div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-[9px] uppercase tracking-[0.26em] text-mocha">Gloria Hub · Equipo</p><h1 className="mt-2 font-serif text-[46px] md:text-[60px] leading-[.92]">Un equipo que<br/><span className="italic text-[#7B3C48]">hace la diferencia.</span></h1><p className="mt-4 max-w-[520px] text-[11px] leading-relaxed text-taupe">Rendimiento, agenda y cortes semanales en un solo lugar.</p></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[520px]"><TeamStat label="Generado" value={money(teamRevenue)}/><TeamStat label="Clientas" value={String(teamClients)}/><TeamStat label="Servicios" value={String(teamServices)}/><TeamStat label="Para el salón" value={money(salonShare)} wine/></div></div></section>
    {message&&<p className="mt-4 rounded-[14px] bg-blush/35 px-4 py-3 text-[11px] text-mocha">{message}</p>}

    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {stats.map(({staff:s,services:ss,appointments,todayAppointments,completed})=>{const revenue=completed.reduce((n,a)=>n+(a.price_cents||0),0);const cut=Math.round(revenue*(Number(s.salon_percentage||0)/100));const mine=revenue-cut;return <article key={s.id} className="group overflow-hidden rounded-[26px] border border-champagne/25 bg-white/75 shadow-[0_10px_30px_rgba(52,38,31,.04)]">
        <div className="relative h-[210px] bg-[#EADFD7]">
          {s.photo_url?<img src={s.photo_url} alt={s.name} className="absolute inset-0 h-full w-full object-cover object-center"/>:<div className="grid h-full place-items-center font-serif text-[64px] text-mocha/35">{s.name.charAt(0)}</div>}
          <div className="absolute inset-0 bg-gradient-to-t from-[#34261F]/70 via-transparent to-transparent"/>
          <div className="absolute bottom-4 left-4 right-4 text-ivory"><p className="text-[8px] uppercase tracking-[.2em] text-champagne">{s.role}</p><h2 className="mt-1 font-serif text-[32px] leading-none">{s.name}</h2></div>
          <button onClick={()=>setEditing(s)} className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-[#FBF8F3]/90 text-mocha shadow-sm" aria-label={`Editar ${s.name}`}><Pencil size={16}/></button>
        </div>

        <div className="p-5">
          <div className="flex flex-wrap gap-2">
            {s.email&&<span className="inline-flex items-center gap-1.5 rounded-full bg-[#F2E7DF] px-3 py-1.5 text-[8px] text-mocha"><Mail size={11}/>{s.email}</span>}
            {s.phone&&<span className="inline-flex items-center gap-1.5 rounded-full bg-[#F2E7DF] px-3 py-1.5 text-[8px] text-mocha"><Phone size={11}/>{s.phone}</span>}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-[17px] bg-[#F5ECE6] p-4"><CalendarDays size={15} className="text-mocha"/><p className="mt-3 font-serif text-[28px]">{todayAppointments.length}</p><p className="text-[9px] text-taupe">citas hoy</p></div><div className="rounded-[17px] bg-[#EAD5D4] p-4"><Scissors size={15} className="text-[#7B3C48]"/><p className="mt-3 font-serif text-[28px]">{completed.length}</p><p className="text-[9px] text-taupe">completadas esta semana</p></div></div><div className="mt-3 relative overflow-hidden rounded-[19px] p-4 text-white" style={{backgroundImage:"radial-gradient(circle at 80% 20%,rgba(255,255,255,.18),transparent 28%),linear-gradient(135deg,#783B47,#4B2E31)"}}><p className="text-[8px] uppercase tracking-[.18em] text-[#E9D2D0]">Corte semanal</p><div className="mt-3 grid grid-cols-3 gap-2"><Cut label="Generado" value={money(revenue)}/><Cut label={`Salón ${fmtPct(s.salon_percentage)}%`} value={money(cut)}/><Cut label="Para ella" value={money(mine)} strong/></div></div>

          <div className="mt-4">
            <p className="text-[8px] uppercase tracking-[.18em] text-taupe">Especialidades</p>
            <p className="mt-2 text-[10px] leading-relaxed text-mocha">{ss.length?ss.slice(0,5).map(x=>x.name).join(" · "):"Sin servicios asignados"}{ss.length>5?` · +${ss.length-5}`:""}</p>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-champagne/20 pt-4">
            <span className={`rounded-full px-3 py-1.5 text-[8px] uppercase tracking-[.1em] ${s.active?"bg-[#DFE8D9] text-[#4A6045]":"bg-[#EEE6E1] text-taupe"}`}>{s.active?"Activa":"Inactiva"}</span>
            <button onClick={()=>toggle(s)} className="inline-flex items-center gap-1.5 text-[9px] text-mocha"><Power size={13}/>{s.active?"Desactivar":"Activar"}</button>
          </div>
        </div>
      </article>})}
    </div>

    {editing&&<EditTeamMember staff={editing} services={services} selectedIds={assignments.filter(a=>a.staff_id===editing.id).map(a=>a.service_id)} onClose={()=>setEditing(null)} onSaved={async()=>{setEditing(null);setMessage("Perfil del equipo actualizado.");await load()}}/>}
  </div>
}

function EditTeamMember({staff,services,selectedIds,onClose,onSaved}:{staff:Staff;services:Service[];selectedIds:string[];onClose:()=>void;onSaved:()=>void}){
  const [name,setName]=useState(staff.name);
  const [role,setRole]=useState(staff.role);
  const [email,setEmail]=useState(staff.email||"");
  const [phone,setPhone]=useState(staff.phone||"");
  const [photo,setPhoto]=useState(staff.photo_url||"");
  const [photoFile,setPhotoFile]=useState<File|null>(null);
  const [preview,setPreview]=useState(staff.photo_url||"");
  const [zoom,setZoom]=useState(1);
  const [positionY,setPositionY]=useState(50);
  const [active,setActive]=useState(staff.active);const [salonPct,setSalonPct]=useState(String(staff.salon_percentage));
  const [ids,setIds]=useState<string[]>(selectedIds);
  const [saving,setSaving]=useState(false);
  const [error,setError]=useState<string|null>(null);

  function flip(id:string){setIds(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id])}

  function choosePhoto(file?:File){
    if(!file)return;
    if(!file.type.startsWith("image/")){setError("Selecciona una imagen.");return;}
    if(file.size>5*1024*1024){setError("La foto debe pesar menos de 5 MB.");return;}
    setError(null);
    setPhotoFile(file);
    setZoom(1);
    setPositionY(50);
    const url=URL.createObjectURL(file);
    setPreview(url);
  }

  async function cropPhoto(file:File){
    const src=URL.createObjectURL(file);
    try{
      const img=await new Promise<HTMLImageElement>((resolve,reject)=>{const el=new window.Image();el.onload=()=>resolve(el);el.onerror=reject;el.src=src});
      const canvas=document.createElement("canvas");canvas.width=900;canvas.height=900;
      const ctx=canvas.getContext("2d");if(!ctx)throw new Error("No se pudo preparar la foto.");
      const base=Math.max(canvas.width/img.width,canvas.height/img.height);
      const scale=base*zoom;
      const dw=img.width*scale,dh=img.height*scale;
      const x=(canvas.width-dw)/2;
      const overflow=Math.max(0,dh-canvas.height);
      const y=-(overflow*(positionY/100));
      ctx.drawImage(img,x,y,dw,dh);
      return await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error("No se pudo recortar la foto.")),"image/jpeg",.9));
    } finally {URL.revokeObjectURL(src)}
  }

  async function uploadPhoto(){
    if(!photoFile)return photo||null;
    const blob=await cropPhoto(photoFile);
    const path=`${staff.id}/profile-${Date.now()}.jpg`;
    const {error}=await supabase.storage.from("staff-photos").upload(path,blob,{contentType:"image/jpeg",upsert:false});
    if(error)throw error;
    const {data}=supabase.storage.from("staff-photos").getPublicUrl(path);
    return data.publicUrl;
  }

  async function save(){
    setSaving(true);setError(null);
    try{
      const uploaded=await uploadPhoto();
      const {error:e1}=await supabase.rpc("hub_update_staff_profile",{p_staff_id:staff.id,p_name:name,p_role:role,p_email:email||null,p_phone:phone||null,p_photo_url:uploaded,p_active:active});
      if(e1)throw e1;
      const {error:e2}=await supabase.rpc("hub_set_staff_services",{p_staff_id:staff.id,p_service_ids:ids});
      if(e2)throw e2;
      const {error:e3}=await supabase.rpc("hub_update_staff_agreement",{p_staff_id:staff.id,p_salon_percentage:Number(salonPct||0)});if(e3)throw e3;
      onSaved();
    }catch(e:any){setError(e?.message||"No pudimos guardar los cambios.");}
    finally{setSaving(false)}
  }

  const grouped=useMemo(()=>Array.from(new Set(services.map(s=>s.category))).map(cat=>[cat,services.filter(s=>s.category===cat)] as const),[services]);

  return <div className="fixed inset-0 z-[100] bg-espresso/45 flex justify-end" onClick={onClose}><aside className="h-full w-full max-w-[560px] overflow-y-auto bg-[#FBF8F3] p-6" onClick={e=>e.stopPropagation()}>
    <div className="flex items-start justify-between"><div><p className="text-[8px] uppercase tracking-[.22em] text-mocha">Editar equipo</p><h2 className="mt-2 font-serif text-[36px]">{staff.name}</h2></div><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-champagne/35"><X size={18}/></button></div>

    <section className="mt-6 rounded-[22px] border border-champagne/30 bg-white/65 p-4">
      <div className="flex items-center justify-between gap-3"><div><p className="text-[8px] uppercase tracking-[.18em] text-taupe">Foto de perfil</p><p className="mt-1 font-serif text-[22px]">Encuadre</p></div><label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#4A352B] px-4 py-2.5 text-[8px] uppercase tracking-[.11em] text-ivory"><ImagePlus size={13}/>Adjuntar foto<input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e=>choosePhoto(e.target.files?.[0])}/></label></div>
      <div className="mt-4 mx-auto relative aspect-square w-full max-w-[300px] overflow-hidden rounded-[24px] bg-[#EADFD7]">
        {preview?<img src={preview} alt="Preview" className="absolute inset-0 h-full w-full object-cover" style={{transform:`scale(${zoom})`,objectPosition:`50% ${positionY}%`}}/>:<div className="grid h-full place-items-center font-serif text-[60px] text-mocha/30">{name.charAt(0)}</div>}
        <div className="pointer-events-none absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/45"/>
      </div>
      {preview&&<div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label><span className="mb-1.5 block text-[8px] uppercase tracking-[.14em] text-taupe">Zoom</span><input type="range" min="1" max="1.8" step=".02" value={zoom} onChange={e=>setZoom(Number(e.target.value))} className="w-full accent-[#6B4F43]"/></label>
        <label><span className="mb-1.5 block text-[8px] uppercase tracking-[.14em] text-taupe">Subir / bajar encuadre</span><input type="range" min="0" max="100" step="1" value={positionY} onChange={e=>setPositionY(Number(e.target.value))} className="w-full accent-[#6B4F43]"/></label>
      </div>}
      <p className="mt-3 text-[9px] leading-relaxed text-taupe">La foto se guarda cuadrada y centrada para que no se corte mal en las tarjetas.</p>
    </section>

    <div className="mt-6 grid gap-3 sm:grid-cols-2"><Field label="Nombre" value={name} set={setName}/><Field label="Especialidad / Rol" value={role} set={setRole}/><Field label="Email" value={email} set={setEmail} type="email"/><Field label="Teléfono" value={phone} set={setPhone} type="tel"/><Field label="Porcentaje para el salón" value={salonPct} set={setSalonPct} type="number"/></div>
    <label className="mt-4 flex items-center gap-2 text-[11px] text-mocha"><input type="checkbox" checked={active} onChange={e=>setActive(e.target.checked)}/> Profesional activa</label>
    <div className="mt-6"><p className="text-[8px] uppercase tracking-[.18em] text-taupe">Servicios que puede realizar</p><div className="mt-3 space-y-4">{grouped.map(([cat,list])=><div key={cat}><p className="font-serif text-[20px] capitalize">{cat}</p><div className="mt-2 flex flex-wrap gap-2">{list.map(s=><button type="button" key={s.id} onClick={()=>flip(s.id)} className={`rounded-full border px-3 py-2 text-[8px] ${ids.includes(s.id)?"border-mocha bg-[#4A352B] text-ivory":"border-champagne/35 bg-white/70 text-mocha"}`}>{s.name}</button>)}</div></div>)}</div></div>
    {error&&<p className="mt-4 text-[10px] text-red-700">{error}</p>}
    <button disabled={saving||!name.trim()||!role.trim()} onClick={save} className="mt-7 w-full rounded-full bg-[#4A352B] px-5 py-4 text-[9px] uppercase tracking-[.14em] text-ivory disabled:opacity-40">{saving?"Guardando…":"Guardar cambios"}</button>
  </aside></div>
}

function Field({label,value,set,type="text"}:{label:string;value:string;set:(v:string)=>void;type?:string}){return <label><span className="mb-1.5 block text-[8px] uppercase tracking-[.15em] text-taupe">{label}</span><input type={type} value={value} onChange={e=>set(e.target.value)} className="w-full rounded-[14px] border border-champagne/35 bg-white/75 px-3.5 py-3 text-[12px] outline-none"/></label>}

function TeamStat({label,value,wine=false}:{label:string;value:string;wine?:boolean}){return <div className={`rounded-[20px] border border-white/45 p-4 shadow-[0_8px_22px_rgba(52,38,31,.05)] ${wine?"bg-[#6F3642] text-white":"bg-white/58"}`}><p className="font-serif text-[26px] leading-none">{value}</p><p className={`mt-2 text-[8px] uppercase tracking-[.13em] ${wine?"text-white/65":"text-taupe"}`}>{label}</p></div>}
function Cut({label,value,strong=false}:{label:string;value:string;strong?:boolean}){return <div><p className="text-[7px] uppercase tracking-[.1em] text-white/55">{label}</p><p className={`mt-1 ${strong?"font-serif text-[20px]":"text-[11px] font-medium"}`}>{value}</p></div>}
function money(cents:number){return new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumFractionDigits:0}).format((cents||0)/100)}
function fmtPct(n:number){return Number.isInteger(Number(n))?String(Number(n)):Number(n).toFixed(1)}
