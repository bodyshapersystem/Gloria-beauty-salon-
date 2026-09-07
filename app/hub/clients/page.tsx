"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Download, Plus, Search, Upload, UserPlus, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Client={id:string;first_name:string;last_name:string;email:string|null;phone:string|null;birthday:string|null;access_status:string;beauty_state:string;created_at:string};
type Role="owner"|"admin"|"staff"|null;
type ImportRow={first_name:string;last_name:string;email:string;phone:string;birthday:string};
const accessLabels:Record<string,string>={invited:"Invitada",active:"Activa",inactive:"Sin Access",disabled:"Deshabilitada"};
const beautyLabels:Record<string,string>={no_appointment_history:"Sin historial",appointment_confirmed:"Cita confirmada",beauty_profile_active:"Beauty Profile activo"};

export default function HubClients(){
  const [clients,setClients]=useState<Client[]>([]);
  const [q,setQ]=useState("");
  const [loading,setLoading]=useState(true);
  const [role,setRole]=useState<Role>(null);
  const [addOpen,setAddOpen]=useState(false);
  const [importOpen,setImportOpen]=useState(false);
  const [importRows,setImportRows]=useState<ImportRow[]>([]);
  const [importName,setImportName]=useState("");
  const [message,setMessage]=useState<string|null>(null);
  const fileRef=useRef<HTMLInputElement>(null);

  async function load(){
    setLoading(true);
    const {data:{session}}=await supabase.auth.getSession();
    const [{data:c},{data:u}]=await Promise.all([
      supabase.from("client_profiles").select("id,first_name,last_name,email,phone,birthday,access_status,beauty_state,created_at").order("updated_at",{ascending:false}),
      session?supabase.from("user_profiles").select("role").eq("auth_user_id",session.user.id).eq("active",true).maybeSingle():Promise.resolve({data:null} as any)
    ]);
    setClients((c as Client[])||[]);
    setRole((u?.role as Role)||null);
    setLoading(false);
  }
  useEffect(()=>{load()},[]);

  const isAdmin=role==="owner"||role==="admin";
  const filtered=useMemo(()=>clients.filter(c=>`${c.first_name} ${c.last_name} ${c.email||""} ${c.phone||""}`.toLowerCase().includes(q.toLowerCase())),[clients,q]);

  function exportCsv(){
    const rows=[["First Name","Last Name","Email","Phone","Birthday","Access Status","Beauty State"],...clients.map(c=>[c.first_name,c.last_name,c.email||"",c.phone||"",c.birthday||"",c.access_status,c.beauty_state])];
    const csv=rows.map(r=>r.map(csvCell).join(",")).join("\n");
    const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});
    const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`gloria-clients-${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(url);
  }

  async function onFile(e:ChangeEvent<HTMLInputElement>){
    const file=e.target.files?.[0];if(!file)return;setMessage(null);
    const text=await file.text();
    const parsed=parseCsv(text);
    if(parsed.length<2){setMessage("No pudimos leer ese CSV.");return;}
    const headers=parsed[0].map(normalizeHeader);
    const rows=parsed.slice(1).map(cols=>mapImportRow(headers,cols)).filter(r=>r.first_name);
    setImportRows(rows);setImportName(file.name);setImportOpen(true);e.target.value="";
  }

  async function importClients(){
    setMessage(null);
    if(!importRows.length)return;
    const {data,error}=await supabase.rpc("hub_import_clients",{p_clients:importRows});
    if(error){setMessage(error.message);return;}
    const result=(data||{}) as {inserted?:number;updated?:number;skipped?:number};
    setMessage(`Importación lista: ${result.inserted||0} nuevas · ${result.updated||0} actualizadas · ${result.skipped||0} omitidas.`);
    setImportOpen(false);setImportRows([]);await load();
  }

  return <div>
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div><p className="text-[9px] uppercase tracking-[0.26em] text-mocha">Relaciones</p><h1 className="mt-1 font-serif text-[40px] md:text-[54px] leading-none">Clientas</h1><p className="mt-2 max-w-[620px] text-[12px] leading-relaxed text-taupe">Cada clienta, con su historial y Beauty Profile en un solo lugar.</p></div>
      {isAdmin&&<div className="grid grid-cols-3 gap-2 sm:flex"><button onClick={()=>setAddOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-[#4A352B] px-4 py-3 text-[8px] uppercase tracking-[0.11em] text-ivory"><UserPlus size={14}/> <span className="hidden sm:inline">Agregar</span><span className="sm:hidden">Nueva</span></button><button onClick={()=>fileRef.current?.click()} className="inline-flex items-center justify-center gap-2 rounded-full border border-mocha/25 bg-white/65 px-4 py-3 text-[8px] uppercase tracking-[0.11em] text-mocha"><Upload size={14}/> Importar</button><button onClick={exportCsv} className="inline-flex items-center justify-center gap-2 rounded-full border border-mocha/25 bg-white/65 px-4 py-3 text-[8px] uppercase tracking-[0.11em] text-mocha"><Download size={14}/> Exportar</button><input ref={fileRef} onChange={onFile} type="file" accept=".csv,text/csv" className="hidden"/></div>}
    </div>

    {isAdmin&&<div className="mt-5 rounded-[20px] border border-champagne/30 bg-[#EFE5DC]/60 p-4"><div className="flex items-start gap-3"><Upload size={17} className="mt-0.5 text-mocha"/><div><p className="font-serif text-[20px]">¿Vienes de Vagaro?</p><p className="mt-1 text-[10px] leading-relaxed text-taupe">Exporta tus clientes desde Vagaro en formato CSV y toca <b className="font-medium text-mocha">Importar</b>. Gloria detectará nombre, apellido, email, teléfono y cumpleaños cuando estén disponibles.</p></div></div></div>}

    <div className="mt-5 flex items-center gap-3 rounded-[18px] border border-champagne/30 bg-white/65 px-4 py-3.5 shadow-[0_6px_20px_rgba(52,38,31,.03)]"><Search size={17} className="text-mocha"/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar por nombre, teléfono o email" className="w-full bg-transparent text-[12px] outline-none placeholder:text-taupe/65"/><span className="text-[9px] text-taupe">{filtered.length}</span></div>

    {message&&<p className="mt-4 rounded-[16px] bg-blush/35 px-4 py-3 text-[11px] text-mocha">{message}</p>}

    {loading?<p className="mt-8 text-[12px] text-taupe">Cargando clientas…</p>:filtered.length===0?<div className="mt-6 rounded-[24px] border border-dashed border-champagne/40 bg-white/45 p-8 text-center"><UserPlus size={23} className="mx-auto text-champagne"/><p className="mt-4 font-serif text-[27px]">Todavía no hay clientas aquí.</p>{isAdmin&&<button onClick={()=>setAddOpen(true)} className="mt-4 rounded-full bg-[#4A352B] px-5 py-3 text-[9px] uppercase tracking-[0.12em] text-ivory">Agregar primera clienta</button>}</div>:<>
      <div className="md:hidden mt-5 space-y-2">{filtered.map(c=><ClientCard key={c.id} c={c}/>)}</div>
      <div className="hidden md:block mt-5 overflow-hidden rounded-[22px] border border-champagne/30 bg-white/60 shadow-[0_8px_30px_rgba(52,38,31,.04)]"><div className="grid grid-cols-[1.15fr_1fr_.75fr_.85fr_36px] gap-4 border-b border-champagne/25 px-5 py-3 text-[8px] uppercase tracking-[0.17em] text-taupe"><span>Clienta</span><span>Contacto</span><span>Access</span><span>Beauty Profile</span><span/></div>{filtered.map(c=><Link href={`/hub/clients/${c.id}`} key={c.id} className="grid grid-cols-[1.15fr_1fr_.75fr_.85fr_36px] items-center gap-4 border-b last:border-0 border-champagne/20 px-5 py-4 hover:bg-[#FBF8F3]"><div><p className="font-serif text-[22px] leading-none">{c.first_name||"Clienta"} {c.last_name}</p><p className="mt-1 text-[9px] text-taupe">Desde {new Date(c.created_at).toLocaleDateString("es-US",{month:"short",year:"numeric"})}</p></div><div className="text-[10px] text-taupe"><p>{c.phone||"Sin teléfono"}</p><p className="mt-1 truncate">{c.email||"Sin email"}</p></div><span className="w-fit rounded-full bg-[#EFE5DC] px-2.5 py-1 text-[8px] text-mocha">{accessLabels[c.access_status]||c.access_status}</span><span className="text-[9px] text-taupe">{beautyLabels[c.beauty_state]||c.beauty_state}</span><span className="text-[20px] text-champagne">›</span></Link>)}</div>
    </>}

    {addOpen&&<AddClientModal onClose={()=>setAddOpen(false)} onSaved={async()=>{setAddOpen(false);setMessage("Clienta agregada correctamente.");await load()}}/>}
    {importOpen&&<div className="fixed inset-0 z-[90] bg-espresso/35 flex items-end sm:items-center justify-center p-0 sm:p-5" onClick={()=>setImportOpen(false)}><div className="w-full sm:max-w-[520px] rounded-t-[28px] sm:rounded-[28px] bg-[#FBF8F3] p-6" onClick={e=>e.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-[8px] uppercase tracking-[0.2em] text-mocha">Importar CSV</p><h2 className="mt-2 font-serif text-[32px]">{importRows.length} clientas detectadas</h2><p className="mt-2 text-[10px] text-taupe">{importName}</p></div><button onClick={()=>setImportOpen(false)} className="grid h-10 w-10 place-items-center rounded-full border border-champagne/35"><X size={19}/></button></div><div className="mt-5 max-h-[260px] overflow-y-auto rounded-[18px] border border-champagne/30 bg-white/65 divide-y divide-champagne/20">{importRows.slice(0,25).map((r,i)=><div key={i} className="px-4 py-3"><p className="font-serif text-[19px]">{r.first_name} {r.last_name}</p><p className="mt-1 text-[9px] text-taupe">{r.phone||r.email||"Sin contacto"}</p></div>)}</div>{importRows.length>25&&<p className="mt-2 text-[9px] text-taupe">+ {importRows.length-25} más</p>}<p className="mt-4 text-[10px] leading-relaxed text-taupe">Si ya existe una clienta con el mismo email o teléfono, actualizaremos sus datos en vez de duplicarla.</p><button onClick={importClients} className="mt-5 w-full rounded-full bg-[#4A352B] px-5 py-3.5 text-[9px] uppercase tracking-[0.13em] text-ivory">Importar clientas</button></div></div>}
  </div>
}

function ClientCard({c}:{c:Client}){return <Link href={`/hub/clients/${c.id}`} className="block rounded-[20px] border border-champagne/30 bg-white/70 p-4 shadow-[0_6px_20px_rgba(52,38,31,.035)]"><div className="flex items-start justify-between gap-3"><div><p className="font-serif text-[24px] leading-none">{c.first_name} {c.last_name}</p><p className="mt-2 text-[10px] text-taupe">{c.phone||"Sin teléfono"}</p><p className="mt-1 text-[9px] text-taupe">{c.email||"Sin email"}</p></div><span className="text-[24px] text-champagne">›</span></div><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-[#EFE5DC] px-2.5 py-1 text-[8px] text-mocha">{accessLabels[c.access_status]||c.access_status}</span><span className="rounded-full bg-blush/35 px-2.5 py-1 text-[8px] text-mocha">{beautyLabels[c.beauty_state]||c.beauty_state}</span></div></Link>}

function AddClientModal({onClose,onSaved}:{onClose:()=>void;onSaved:()=>void}){
  const [first,setFirst]=useState("");const [last,setLast]=useState("");const [email,setEmail]=useState("");const [phone,setPhone]=useState("");const [birthday,setBirthday]=useState("");const [saving,setSaving]=useState(false);const [error,setError]=useState<string|null>(null);
  async function save(){if(!first.trim())return;setSaving(true);setError(null);const {error:e}=await supabase.rpc("hub_create_client",{p_first_name:first.trim(),p_last_name:last.trim(),p_email:email.trim()||null,p_phone:phone.trim()||null,p_birthday:birthday||null});setSaving(false);if(e){setError(e.message);return;}onSaved()}
  return <div className="fixed inset-0 z-[90] bg-espresso/35 flex items-end sm:items-center justify-center p-0 sm:p-5" onClick={onClose}><div className="w-full sm:max-w-[520px] rounded-t-[28px] sm:rounded-[28px] bg-[#FBF8F3] p-6" onClick={e=>e.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-[8px] uppercase tracking-[0.2em] text-mocha">Nueva clienta</p><h2 className="mt-2 font-serif text-[34px]">Agregar a Gloria</h2></div><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-champagne/35"><X size={19}/></button></div><div className="mt-5 grid grid-cols-2 gap-3"><Field label="Nombre" value={first} set={setFirst} required/><Field label="Apellido" value={last} set={setLast}/><div className="col-span-2"><Field label="Teléfono" value={phone} set={setPhone} type="tel"/></div><div className="col-span-2"><Field label="Email" value={email} set={setEmail} type="email"/></div><div className="col-span-2"><Field label="Cumpleaños" value={birthday} set={setBirthday} type="date"/></div></div>{error&&<p className="mt-4 text-[10px] text-red-700">{error}</p>}<button disabled={saving||!first.trim()} onClick={save} className="mt-5 w-full rounded-full bg-[#4A352B] px-5 py-3.5 text-[9px] uppercase tracking-[0.13em] text-ivory disabled:opacity-40">{saving?"Guardando…":"Guardar clienta"}</button></div></div>}
function Field({label,value,set,type="text",required=false}:{label:string;value:string;set:(v:string)=>void;type?:string;required?:boolean}){return <label className="block"><span className="mb-1.5 block text-[8px] uppercase tracking-[0.15em] text-taupe">{label}{required?" *":""}</span><input type={type} value={value} onChange={e=>set(e.target.value)} className="w-full rounded-[14px] border border-champagne/35 bg-white/70 px-3.5 py-3 text-[12px] outline-none focus:border-mocha/50"/></label>}
function csvCell(v:string){return `"${String(v??"").replaceAll('"','""')}"`}
function normalizeHeader(v:string){return v.toLowerCase().trim().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"")}
function mapImportRow(headers:string[],cols:string[]):ImportRow{const get=(aliases:string[])=>{for(const a of aliases){const i=headers.indexOf(a);if(i>=0)return (cols[i]||"").trim()}return ""};return {first_name:get(["first_name","firstname","first","client_first_name"]),last_name:get(["last_name","lastname","last","client_last_name"]),email:get(["email","email_address","client_email"]),phone:get(["phone","mobile","mobile_phone","cell","cell_phone","phone_number"]),birthday:normalizeDate(get(["birthday","birth_date","date_of_birth","dob"]))}}
function normalizeDate(v:string){if(!v)return "";const d=new Date(v);if(!Number.isNaN(+d))return d.toISOString().slice(0,10);const m=v.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/);if(!m)return "";let y=Number(m[3]);if(y<100)y+=y>40?1900:2000;return `${y}-${String(Number(m[1])).padStart(2,"0")}-${String(Number(m[2])).padStart(2,"0")}`}
function parseCsv(text:string){const rows:string[][]=[];let row:string[]=[];let cell="";let quoted=false;for(let i=0;i<text.length;i++){const ch=text[i];if(ch==='"'){if(quoted&&text[i+1]==='"'){cell+='"';i++}else quoted=!quoted}else if(ch===","&&!quoted){row.push(cell);cell=""}else if((ch==="\n"||ch==="\r")&&!quoted){if(ch==="\r"&&text[i+1]==="\n")i++;row.push(cell);if(row.some(x=>x.trim()))rows.push(row);row=[];cell=""}else cell+=ch}row.push(cell);if(row.some(x=>x.trim()))rows.push(row);return rows}
