"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CalendarDays, ChevronRight, Mail, Pencil, Phone, Plus, ShoppingBag, Sparkles, X } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Client={id:string;first_name:string;last_name:string;email:string|null;phone:string|null;birthday:string|null;access_status:string;beauty_state:string;created_at:string};
type Memory={id:string;category:string;title:string;summary:string|null;details:Record<string,unknown>;products_used:unknown;maintenance_notes:string|null;client_visible:boolean;updated_at:string;appointment_id:string|null;service_id:string|null;staff_id:string|null};
type Appt={id:string;start_at:string;status:string;service:{name:string}|null;staff:{name:string}|null};
type Metrics={segment:string;completed_visits:number;last_visit:string|null;days_since_last_visit:number|null};
type Tab="overview"|"beauty"|"appointments"|"products"|"activity";

const familyMeta:Record<string,{label:string;eyebrow:string}>={
  color:{label:"Hair Color",eyebrow:"Color + formula"},blowdry:{label:"Blowdry",eyebrow:"Her signature finish"},cut:{label:"Cut",eyebrow:"Shape + length"},treatment:{label:"Treatments",eyebrow:"Hair health"},styling:{label:"Styling",eyebrow:"Looks worth repeating"},extensions:{label:"Extensions",eyebrow:"Length + color match"},nails:{label:"Nails",eyebrow:"Shape + shade"},lashes:{label:"Lashes",eyebrow:"Map + curl"},brows:{label:"Brows",eyebrow:"Shape + tint"},makeup:{label:"Makeup",eyebrow:"Her best tones"},tanning:{label:"Glow",eyebrow:"Her perfect tone"},hair:{label:"Hair",eyebrow:"Hair memory"},general:{label:"Beauty Notes",eyebrow:"Personal details"}
};
const tabLabels:Record<Tab,string>={overview:"Resumen",beauty:"My Beauty Profile",appointments:"Citas",products:"Productos",activity:"Actividad"};

export default function HubClientDetail(){
  const params=useParams<{id:string}>();const id=params.id;
  const [client,setClient]=useState<Client|null>(null);const [memory,setMemory]=useState<Memory[]>([]);const [appointments,setAppointments]=useState<Appt[]>([]);const [metrics,setMetrics]=useState<Metrics|null>(null);const [tab,setTab]=useState<Tab>("overview");const [editOpen,setEditOpen]=useState(false);const [memoryOpen,setMemoryOpen]=useState(false);const [reload,setReload]=useState(0);
  useEffect(()=>{if(!id)return;(async()=>{const [{data:c},{data:m},{data:a},{data:v}]=await Promise.all([
    supabase.from("client_profiles").select("id,first_name,last_name,email,phone,birthday,access_status,beauty_state,created_at").eq("id",id).single(),
    supabase.from("client_memory").select("id,category,title,summary,details,products_used,maintenance_notes,client_visible,updated_at,appointment_id,service_id,staff_id").eq("client_id",id).order("updated_at",{ascending:false}),
    supabase.from("appointments").select("id,start_at,status,service:service_id(name),staff:staff_id(name)").eq("client_id",id).order("start_at",{ascending:false}).limit(30),
    supabase.from("client_value_metrics").select("segment,completed_visits,last_visit,days_since_last_visit").eq("client_id",id).maybeSingle(),
  ]);setClient(c as Client);setMemory((m as Memory[])||[]);setAppointments(((a as unknown) as Appt[])||[]);setMetrics((v as Metrics|null)||null)})()},[id,reload]);
  const families=useMemo(()=>{const map=new Map<string,Memory[]>();memory.forEach(m=>{const family=String(m.details?.service_family||m.category||"general");if(!map.has(family))map.set(family,[]);map.get(family)!.push(m)});return [...map.entries()]},[memory]);
  const latest=appointments[0]||null;const upcoming=appointments.find(a=>["pending","confirmed","in_progress"].includes(a.status)&&new Date(a.start_at)>=new Date())||null;
  if(!client)return <p className="text-[12px] text-taupe">Cargando clienta…</p>;

  return <div className="pb-10">
    <section className="overflow-hidden rounded-[28px] bg-[#34261F] text-ivory shadow-[0_18px_50px_rgba(52,38,31,.12)]">
      <div className="grid gap-6 p-6 md:p-8 lg:grid-cols-[1fr_auto] lg:items-end"><div><div className="flex items-center gap-3"><p className="text-[9px] uppercase tracking-[.28em] text-champagne">Client Beauty Passport</p><button onClick={()=>setEditOpen(true)} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[.06] px-3 py-1.5 text-[8px] uppercase tracking-[.1em] text-ivory/80"><Pencil size={11}/>Editar</button></div><h1 className="mt-2 font-serif text-[44px] md:text-[58px] leading-none">{client.first_name} {client.last_name}</h1><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-ivory/65">{client.phone&&<span className="inline-flex items-center gap-1.5"><Phone size={13}/>{client.phone}</span>}{client.email&&<span className="inline-flex items-center gap-1.5"><Mail size={13}/>{client.email}</span>}</div></div><div className="grid grid-cols-2 gap-2 sm:flex"><MiniStat label="Visitas" value={String(metrics?.completed_visits||0)}/><MiniStat label="Status" value={segment(metrics?.segment)}/></div></div>
      <div className="border-t border-white/10 bg-white/[.04] px-6 py-4 md:px-8"><p className="font-serif italic text-[17px] text-champagne">“La próxima visita empieza recordando la anterior.”</p></div>
    </section>

    <div className="mt-5 flex gap-2 overflow-x-auto pb-1">{(Object.keys(tabLabels) as Tab[]).map(t=><button key={t} onClick={()=>setTab(t)} className={`shrink-0 rounded-full px-4 py-2.5 text-[10px] ${tab===t?"bg-[#4A352B] text-ivory":"border border-champagne/35 bg-white/60 text-taupe"}`}>{tabLabels[t]}</button>)}</div>

    {tab==="overview"&&<div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_.85fr]"><section className="rounded-[24px] border border-champagne/30 bg-white/75 p-5 md:p-6"><p className="text-[9px] uppercase tracking-[.22em] text-mocha">Beauty at a glance</p><h2 className="mt-2 font-serif text-[34px]">Lo que ya sabemos de ella</h2>{families.length?<div className="mt-5 grid gap-3 sm:grid-cols-2">{families.slice(0,6).map(([family,items])=><button key={family} onClick={()=>setTab("beauty")} className="group rounded-[18px] border border-champagne/25 bg-[#FBF8F3] p-4 text-left"><p className="text-[8px] uppercase tracking-[.18em] text-mocha">{familyMeta[family]?.eyebrow||"Beauty memory"}</p><div className="mt-2 flex items-end justify-between gap-3"><div><p className="font-serif text-[24px] leading-none">{familyMeta[family]?.label||human(family)}</p><p className="mt-2 text-[11px] text-taupe line-clamp-1">{items[0].title}</p></div><ChevronRight size={16} className="text-mocha transition-transform group-hover:translate-x-1"/></div></button>)}</div>:<Empty text="Su Beauty Profile se irá formando cuando el team complete sus visitas."/>}</section><div className="space-y-4"><InfoCard icon={CalendarDays} eyebrow={upcoming?"Próxima cita":"Agenda"} title={upcoming?upcoming.service?.name||"Appointment":"Sin próxima cita"} text={upcoming?`${date(upcoming.start_at)} · ${upcoming.staff?.name||"Team"}`:"Puedes reservarle una cita desde Calendar."} href="/hub/calendar" action={upcoming?"Ver calendario":"Crear cita"}/><InfoCard icon={Sparkles} eyebrow="Última visita" title={latest?.service?.name||"Sin historial"} text={latest?`${date(latest.start_at)} · ${latest.staff?.name||"Team"}`:"Todavía no hay visitas registradas."}/></div></div>}

    {tab==="beauty"&&<section className="mt-6"><div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"><div className="max-w-[720px]"><p className="text-[9px] uppercase tracking-[.22em] text-mocha">My Beauty Profile</p><h2 className="mt-2 font-serif text-[40px] leading-none">Todo lo que hace que su servicio sea realmente suyo.</h2><p className="mt-3 text-[12px] leading-relaxed text-taupe">Gloria puede completar datos que ya conoce y cada especialista puede seguir actualizando su área en cada visita.</p></div><button onClick={()=>setMemoryOpen(true)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#4A352B] px-5 py-3 text-[9px] uppercase tracking-[.12em] text-ivory"><Plus size={14}/>Agregar al perfil</button></div>{families.length?<div className="mt-6 grid gap-4 xl:grid-cols-2">{families.map(([family,items])=><BeautySection key={family} family={family} items={items}/>)}</div>:<Empty text="Todavía no hay detalles guardados. Se crearán desde Guardar + Completar al finalizar una cita."/>}</section>}

    {tab==="appointments"&&<section className="mt-6 rounded-[24px] border border-champagne/30 bg-white/70 p-5 md:p-6"><div className="flex items-center justify-between"><div><p className="text-[9px] uppercase tracking-[.2em] text-mocha">Historial</p><h2 className="mt-1 font-serif text-[32px]">Citas</h2></div><Link href="/hub/calendar?new=1" className="rounded-full bg-[#4A352B] px-4 py-2.5 text-[9px] text-ivory">+ Nueva cita</Link></div><div className="mt-5 divide-y divide-champagne/20">{appointments.length?appointments.map(a=><div key={a.id} className="flex items-center gap-4 py-4"><div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-blush/45 text-mocha"><CalendarDays size={17}/></div><div className="min-w-0 flex-1"><p className="font-serif text-[21px] truncate">{a.service?.name||"Appointment"}</p><p className="mt-1 text-[10px] text-taupe">{date(a.start_at)} · {a.staff?.name||"Team"}</p></div><span className="text-[9px] text-taupe">{human(a.status)}</span></div>):<Empty text="Sin citas todavía."/>}</div></section>}

    {tab==="products"&&<section className="mt-6"><p className="text-[9px] uppercase tracking-[.22em] text-mocha">Products used on her</p><h2 className="mt-2 font-serif text-[38px]">Su rutina real</h2><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{uniqueProducts(memory).length?uniqueProducts(memory).map((p,i)=><div key={`${p.type}-${p.name}-${i}`} className="rounded-[20px] border border-champagne/30 bg-white/70 p-5"><ShoppingBag size={17} className="text-mocha"/><p className="mt-4 text-[8px] uppercase tracking-[.18em] text-taupe">{human(p.type)}</p><p className="mt-1 font-serif text-[24px]">{p.name}</p></div>):<Empty text="Todavía no hay productos registrados para ella."/>}</div></section>}

    {tab==="activity"&&<section className="mt-6 rounded-[24px] border border-champagne/30 bg-white/70 p-6"><p className="text-[9px] uppercase tracking-[.2em] text-mocha">Activity</p><h2 className="mt-2 font-serif text-[34px]">Beauty memory timeline</h2><div className="mt-5 space-y-4">{memory.map(m=><div key={m.id} className="flex gap-4"><span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-mocha"/><div><p className="font-serif text-[20px]">{m.title}</p><p className="mt-1 text-[10px] text-taupe">{date(m.updated_at)} · {familyMeta[String(m.details?.service_family||m.category)]?.label||human(m.category)}</p></div></div>)}</div></section>}
    {editOpen&&<EditClient client={client} onClose={()=>setEditOpen(false)} onSaved={()=>{setEditOpen(false);setReload(v=>v+1)}}/>}
    {memoryOpen&&<ManualBeautyMemory clientId={client.id} onClose={()=>setMemoryOpen(false)} onSaved={()=>{setMemoryOpen(false);setReload(v=>v+1);setTab("beauty")}}/>}
  </div>
}

function BeautySection({family,items}:{family:string;items:Memory[]}){const m=items[0];const details=Object.entries(m.details||{}).filter(([k,v])=>k!=="service_family"&&v!==null&&v!=="");return <article className="overflow-hidden rounded-[24px] border border-champagne/30 bg-white/75 shadow-[0_8px_30px_rgba(52,38,31,.04)]"><div className="bg-[#EFE4DC]/55 p-5"><p className="text-[8px] uppercase tracking-[.2em] text-mocha">{familyMeta[family]?.eyebrow||"Beauty memory"}</p><div className="mt-1 flex items-end justify-between gap-3"><h3 className="font-serif text-[32px] leading-none">{familyMeta[family]?.label||human(family)}</h3><span className="text-[9px] text-taupe">Actualizado {shortDate(m.updated_at)}</span></div>{m.summary&&<p className="mt-3 text-[12px] leading-relaxed text-taupe">{m.summary}</p>}</div><div className="p-5"><dl className="grid grid-cols-2 gap-x-5 gap-y-4">{details.slice(0,10).map(([k,v])=><div key={k}><dt className="text-[8px] uppercase tracking-[.14em] text-taupe">{human(k)}</dt><dd className="mt-1 text-[12px] font-medium">{formatValue(v)}</dd></div>)}</dl>{m.maintenance_notes&&<div className="mt-5 rounded-[16px] bg-[#FBF8F3] p-4"><p className="text-[8px] uppercase tracking-[.16em] text-mocha">Mantenimiento</p><p className="mt-2 text-[11px] leading-relaxed text-taupe">{m.maintenance_notes}</p></div>}{items.length>1&&<p className="mt-4 text-[9px] text-taupe">+ {items.length-1} visitas anteriores guardadas</p>}</div></article>}
function InfoCard({icon:Icon,eyebrow,title,text,href,action}:{icon:any;eyebrow:string;title:string;text:string;href?:string;action?:string}){return <div className="rounded-[24px] border border-champagne/30 bg-white/75 p-5"><Icon size={18} className="text-mocha"/><p className="mt-4 text-[8px] uppercase tracking-[.18em] text-taupe">{eyebrow}</p><p className="mt-1 font-serif text-[27px] leading-none">{title}</p><p className="mt-3 text-[11px] leading-relaxed text-taupe">{text}</p>{href&&<Link href={href} className="mt-4 inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[.13em] text-mocha">{action}<ArrowRight size={14}/></Link>}</div>}
function MiniStat({label,value}:{label:string;value:string}){return <div className="min-w-[110px] rounded-[16px] border border-white/12 bg-white/[.06] px-4 py-3"><p className="text-[8px] uppercase tracking-[.17em] text-ivory/45">{label}</p><p className="mt-1 font-serif text-[21px] capitalize text-champagne">{value}</p></div>}
function Empty({text}:{text:string}){return <div className="mt-5 rounded-[18px] border border-dashed border-champagne/40 bg-[#FBF8F3] p-5 text-[11px] text-taupe">{text}</div>}
function uniqueProducts(memory:Memory[]){const out:{type:string;name:string}[]=[];const seen=new Set<string>();memory.forEach(m=>{const raw=m.products_used;if(Array.isArray(raw))raw.forEach((x:any)=>{const type=typeof x==="object"?String(x.type||"product"):"product";const name=typeof x==="object"?String(x.name||""):String(x||"");const key=`${type}|${name}`.toLowerCase();if(name&&!seen.has(key)){seen.add(key);out.push({type,name})}})});return out}
function segment(v?:string){if(!v)return "Nueva";return ({new:"Nueva",regular:"Regular",loyal:"Fiel",vip:"VIP",at_risk:"En riesgo"} as Record<string,string>)[v]||human(v)}
function human(v:string){return v.replaceAll("_"," ").replace(/\b\w/g,c=>c.toUpperCase())}
function date(v:string){return new Date(v).toLocaleDateString("es-US",{month:"short",day:"numeric",year:"numeric",timeZone:"America/New_York"})}
function shortDate(v:string){return new Date(v).toLocaleDateString("es-US",{month:"short",day:"numeric",timeZone:"America/New_York"})}
function formatValue(v:unknown){if(Array.isArray(v))return v.join(", ");if(typeof v==="boolean")return v?"Sí":"No";if(v===null||v===undefined)return "—";return String(v)}

const manualFields:Record<string,{label:string;key:string;placeholder:string}[]>={
  color:[
    {key:"current_color",label:"Color actual",placeholder:"Castaño / Rubio / Cobrizo..."},
    {key:"tone",label:"Tono",placeholder:"Beige miel / neutro / ceniza"},
    {key:"formula",label:"Fórmula",placeholder:"Fórmula que Gloria conoce"},
    {key:"developer",label:"Oxidante",placeholder:"10 / 20 / 30 vol"},
    {key:"toner",label:"Matizador",placeholder:"Marca / tono"},
    {key:"technique",label:"Técnica",placeholder:"Balayage / raíces / highlights"}
  ],
  blowdry:[
    {key:"finish",label:"Gusto de secado",placeholder:"Ondas / liso / volumen"},
    {key:"ends",label:"Puntas",placeholder:"Hacia arriba / adentro / rectas"},
    {key:"part",label:"Partido",placeholder:"Centro / lado"},
    {key:"volume",label:"Volumen",placeholder:"Natural / alto / poco"}
  ],
  cut:[
    {key:"length",label:"Largo",placeholder:"Hombros / largo / corto"},
    {key:"layers",label:"Capas",placeholder:"Sin capas / suaves / marcadas"},
    {key:"face_frame",label:"Face frame",placeholder:"Sí / no / largo"}
  ],
  treatment:[
    {key:"treatment_type",label:"Tratamiento",placeholder:"Botox / Keratina / hidratación"},
    {key:"brand",label:"Producto / marca",placeholder:"TRUSS..."},
    {key:"result",label:"Resultado preferido",placeholder:"Liso / control frizz / hidratación"}
  ],
  extensions:[
    {key:"extension_type",label:"Tipo",placeholder:"Tape / keratin / weft"},
    {key:"length",label:"Largo",placeholder:"18 / 20 / 22 pulgadas"},
    {key:"color",label:"Color",placeholder:"Número / descripción"},
    {key:"amount",label:"Cantidad",placeholder:"Paquetes / gramos"}
  ],
  nails:[
    {key:"technique",label:"Técnica",placeholder:"Gel / DIP / Aprés / acrylic"},
    {key:"shape",label:"Forma",placeholder:"Almond / square / coffin"},
    {key:"length",label:"Largo",placeholder:"Corto / medio / largo"},
    {key:"shade",label:"Color",placeholder:"OPI Bubble Bath / rojo..."},
    {key:"finish",label:"Acabado",placeholder:"Natural / chrome / french"}
  ],
  lashes:[
    {key:"lash_type",label:"Tipo",placeholder:"Classic / Hybrid / Greek / Mega"},
    {key:"effect",label:"Efecto",placeholder:"Cat eye / doll / natural"},
    {key:"curl",label:"Curl",placeholder:"C / CC / D"},
    {key:"mapping",label:"Mapping / números",placeholder:"8-9-10-11-12"},
    {key:"density",label:"Densidad",placeholder:"Natural / medium / full"}
  ],
  brows:[
    {key:"shape",label:"Shape",placeholder:"Soft arch / straight / defined"},
    {key:"thickness",label:"Grosor",placeholder:"Natural / definido"},
    {key:"tint",label:"Color / Henna",placeholder:"Brown / dark brown..."},
    {key:"wax_preference",label:"Preferencia",placeholder:"Wax / tweeze / henna"}
  ],
  makeup:[
    {key:"foundation",label:"Base / tono",placeholder:"Tono + undertone"},
    {key:"finish",label:"Acabado",placeholder:"Natural / soft glam"},
    {key:"lips",label:"Labios",placeholder:"Nude / rose / red"},
    {key:"eyes",label:"Ojos",placeholder:"Natural / smoky / liner"}
  ],
  tanning:[
    {key:"type",label:"Tipo",placeholder:"Express / Regular"},
    {key:"tone",label:"Tono",placeholder:"Warm / neutral"},
    {key:"intensity",label:"Intensidad",placeholder:"Light / medium / dark"}
  ]
};

function EditClient({client,onClose,onSaved}:{client:Client;onClose:()=>void;onSaved:()=>void}){
  const [first,setFirst]=useState(client.first_name);const [last,setLast]=useState(client.last_name);const [email,setEmail]=useState(client.email||"");const [phone,setPhone]=useState(client.phone||"");const [birthday,setBirthday]=useState(client.birthday||"");const [saving,setSaving]=useState(false);const [error,setError]=useState<string|null>(null);
  async function save(){setSaving(true);setError(null);const {error:e}=await supabase.rpc("hub_update_client_profile",{p_client_id:client.id,p_first_name:first,p_last_name:last,p_email:email||null,p_phone:phone||null,p_birthday:birthday||null});setSaving(false);if(e){setError(e.message);return;}onSaved()}
  return <Modal title="Editar clienta" eyebrow="Client Profile" onClose={onClose}><div className="grid gap-3 sm:grid-cols-2"><Input label="Nombre" value={first} set={setFirst}/><Input label="Apellido" value={last} set={setLast}/><Input label="Email" value={email} set={setEmail} type="email"/><Input label="Teléfono" value={phone} set={setPhone} type="tel"/><div className="sm:col-span-2"><Input label="Cumpleaños" value={birthday} set={setBirthday} type="date"/></div></div>{error&&<p className="mt-4 text-[10px] text-red-700">{error}</p>}<button onClick={save} disabled={saving||!first.trim()} className="mt-6 w-full rounded-full bg-[#4A352B] px-5 py-4 text-[9px] uppercase tracking-[.13em] text-ivory disabled:opacity-40">{saving?"Guardando…":"Guardar cambios"}</button></Modal>
}

function ManualBeautyMemory({clientId,onClose,onSaved}:{clientId:string;onClose:()=>void;onSaved:()=>void}){
  const [family,setFamily]=useState("color");const [values,setValues]=useState<Record<string,string>>({});const [summary,setSummary]=useState("");const [maintenance,setMaintenance]=useState("");const [products,setProducts]=useState({shampoo:"",conditioner:"",toner:"",treatment:"",styling:""});const [visible,setVisible]=useState(true);const [saving,setSaving]=useState(false);const [error,setError]=useState<string|null>(null);
  useEffect(()=>setValues({}),[family]);
  async function save(){setSaving(true);setError(null);const details={service_family:family,...Object.fromEntries(Object.entries(values).filter(([,v])=>v.trim()).map(([k,v])=>[k,v.trim()]))};const productList=Object.entries(products).filter(([,v])=>v.trim()).map(([type,name])=>({type,name:name.trim()}));const title=familyMeta[family]?.label||human(family);const {error:e}=await supabase.rpc("hub_add_client_memory",{p_client_id:clientId,p_category:familyToCategory(family),p_title:title,p_summary:summary||null,p_details:details,p_client_visible:visible,p_maintenance_notes:maintenance||null,p_products_used:productList});setSaving(false);if(e){setError(e.message);return;}onSaved()}
  return <Modal title="Agregar al Beauty Profile" eyebrow="Personal Beauty Memory" onClose={onClose}><div className="grid grid-cols-2 gap-2 sm:grid-cols-3">{Object.keys(manualFields).map(x=><button type="button" key={x} onClick={()=>setFamily(x)} className={`rounded-[14px] border px-3 py-3 text-[9px] ${family===x?"border-mocha bg-[#4A352B] text-ivory":"border-champagne/30 bg-white/70 text-mocha"}`}>{familyMeta[x]?.label||human(x)}</button>)}</div><div className="mt-5 grid gap-3 sm:grid-cols-2">{manualFields[family].map(f=><Input key={f.key} label={f.label} value={values[f.key]||""} set={v=>setValues(x=>({...x,[f.key]:v}))} placeholder={f.placeholder}/>)}</div><div className="mt-5 grid gap-3"><TextInput label="Resumen bonito para la clienta" value={summary} set={setSummary} placeholder="Ej. Prefiere ondas suaves y tonos beige neutrales."/><TextInput label="Mantenimiento" value={maintenance} set={setMaintenance} placeholder="Ej. Refrescar cada 10–12 semanas."/></div><div className="mt-6"><p className="text-[8px] uppercase tracking-[.18em] text-taupe">Productos usados en ella</p><div className="mt-3 grid gap-3 sm:grid-cols-2">{Object.keys(products).map(k=><Input key={k} label={human(k)} value={(products as any)[k]} set={v=>setProducts(x=>({...x,[k]:v}))} placeholder="Marca / producto"/>)}</div></div><label className="mt-5 flex items-center gap-2 text-[10px] text-mocha"><input type="checkbox" checked={visible} onChange={e=>setVisible(e.target.checked)}/> Visible para la clienta en Gloria Access</label>{error&&<p className="mt-4 text-[10px] text-red-700">{error}</p>}<button onClick={save} disabled={saving} className="mt-6 w-full rounded-full bg-[#4A352B] px-5 py-4 text-[9px] uppercase tracking-[.13em] text-ivory disabled:opacity-40">{saving?"Guardando…":"Guardar en Beauty Profile"}</button></Modal>
}
function Modal({title,eyebrow,onClose,children}:{title:string;eyebrow:string;onClose:()=>void;children:React.ReactNode}){return <div className="fixed inset-0 z-[100] bg-espresso/45 flex justify-end" onClick={onClose}><aside className="h-full w-full max-w-[590px] overflow-y-auto bg-[#FBF8F3] p-6" onClick={e=>e.stopPropagation()}><div className="flex items-start justify-between"><div><p className="text-[8px] uppercase tracking-[.22em] text-mocha">{eyebrow}</p><h2 className="mt-2 font-serif text-[36px] leading-none">{title}</h2></div><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full border border-champagne/35"><X size={18}/></button></div><div className="mt-6">{children}</div></aside></div>}
function Input({label,value,set,type="text",placeholder=""}:{label:string;value:string;set:(v:string)=>void;type?:string;placeholder?:string}){return <label><span className="mb-1.5 block text-[8px] uppercase tracking-[.15em] text-taupe">{label}</span><input type={type} value={value} onChange={e=>set(e.target.value)} placeholder={placeholder} className="w-full rounded-[14px] border border-champagne/35 bg-white/75 px-3.5 py-3 text-[12px] outline-none"/></label>}
function TextInput({label,value,set,placeholder}:{label:string;value:string;set:(v:string)=>void;placeholder:string}){return <label><span className="mb-1.5 block text-[8px] uppercase tracking-[.15em] text-taupe">{label}</span><textarea rows={2} value={value} onChange={e=>set(e.target.value)} placeholder={placeholder} className="w-full rounded-[14px] border border-champagne/35 bg-white/75 px-3.5 py-3 text-[12px] outline-none"/></label>}
function familyToCategory(f:string){if(["color","blowdry","cut","treatment","styling","extensions"].includes(f))return "hair";return f}
