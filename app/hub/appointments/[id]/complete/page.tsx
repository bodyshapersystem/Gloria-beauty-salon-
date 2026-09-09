"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, ChevronLeft, Eye, EyeOff, Save, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Appointment={id:string;client_name:string;client_phone:string;client_email:string|null;status:string;start_at:string;service_id:string;staff_id:string;client_id:string;service:{name:string;category:string}|null;staff:{name:string}|null};
type Field={key:string;label:string;placeholder?:string;type?:"text"|"select";options?:string[]};
type Section={title:string;subtitle:string;fields:Field[]};
type ServiceOption={id:string;name:string;category:string;duration_minutes:number;price_label:string};
type StaffOption={id:string;name:string};

const configs:Record<string,Section[]>={
  color:[
    {title:"Color de hoy",subtitle:"La fórmula que queremos poder recrear.",fields:[
      {key:"color_result",label:"Resultado / tono",placeholder:"Beige miel, chocolate frío, copper..."},
      {key:"technique",label:"Técnica",type:"select",options:["Root color","Full color","Partial highlights","Full highlights","Balayage","Toner / gloss","Correction","Other"]},
      {key:"formula",label:"Fórmula",placeholder:"Marca + tonos + mezcla"},
      {key:"developer",label:"Oxidante",placeholder:"10 vol / 20 vol / proporción"},
      {key:"toner",label:"Matizador / gloss",placeholder:"Tono y tiempo"},
      {key:"processing_time",label:"Tiempo de proceso",placeholder:"Ej. 35 min"},
    ]},
    {title:"Preferencias",subtitle:"Detalles que hacen que el resultado se sienta como ella.",fields:[
      {key:"warmth_preference",label:"Temperatura favorita",type:"select",options:["Frío","Neutro","Cálido","Depende del look"]},
      {key:"brightness",label:"Nivel de luminosidad",type:"select",options:["Natural","Medio","Muy luminoso"]},
      {key:"face_frame",label:"Face frame",placeholder:"Suave / marcado / no quiere"},
    ]},
  ],
  blowdry:[
    {title:"Su secado ideal",subtitle:"Cómo le gusta salir del salón.",fields:[
      {key:"finish",label:"Acabado favorito",type:"select",options:["Liso","Ondas suaves","Ondas marcadas","Volumen","Puntas hacia arriba","Puntas hacia adentro"]},
      {key:"part",label:"Partido",type:"select",options:["Centro","Derecha","Izquierda","Sin preferencia"]},
      {key:"volume",label:"Volumen",type:"select",options:["Bajo","Natural","Alto"]},
      {key:"brush_size",label:"Cepillo / técnica",placeholder:"Grande, mediano, round brush..."},
      {key:"heat_notes",label:"Notas de calor",placeholder:"Sensibilidad, temperatura preferida..."},
    ]},
  ],
  treatment:[
    {title:"Tratamiento",subtitle:"Qué usamos y cómo respondió el cabello.",fields:[
      {key:"treatment_type",label:"Tratamiento",type:"select",options:["Hair Botox","Keratin","Hydration","Repair","Protein","Other"]},
      {key:"brand",label:"Marca / línea",placeholder:"TRUSS..."},
      {key:"formula",label:"Producto / fórmula",placeholder:"Nombre exacto del producto"},
      {key:"processing_time",label:"Tiempo de proceso",placeholder:"Ej. 45 min"},
      {key:"result",label:"Resultado",placeholder:"Más brillo, menos frizz, fibra sellada..."},
    ]},
  ],
  cut:[
    {title:"Su corte",subtitle:"La forma exacta que le funciona.",fields:[
      {key:"length",label:"Largo",placeholder:"Clavícula / medio / largo..."},
      {key:"shape",label:"Forma",placeholder:"Recto, U, V, bob..."},
      {key:"layers",label:"Capas",type:"select",options:["Sin capas","Suaves","Medias","Marcadas"]},
      {key:"face_frame",label:"Marco del rostro",placeholder:"Dónde comienza / qué tan marcado"},
      {key:"bangs",label:"Flequillo",placeholder:"Curtain bangs / recto / no usa"},
    ]},
  ],
  styling:[
    {title:"Estilismo",subtitle:"El look que podemos repetir.",fields:[
      {key:"style",label:"Peinado",type:"select",options:["Braids","Waves","Updo","Half-up","Sleek","Ponytail","Other"]},
      {key:"finish",label:"Acabado",placeholder:"Pulido, messy, soft glam..."},
      {key:"part",label:"Partido",placeholder:"Centro / lateral"},
      {key:"hold",label:"Fijación",type:"select",options:["Ligera","Media","Alta"]},
    ]},
  ],
  extensions:[
    {title:"Extensiones",subtitle:"Todo lo necesario para mantener el match perfecto.",fields:[
      {key:"extension_type",label:"Tipo",type:"select",options:["Tape-in","Weft","Keratin bond","Clip-in","Other"]},
      {key:"length",label:"Largo",placeholder:"18 in / 20 in / 22 in"},
      {key:"color",label:"Color / mezcla",placeholder:"Número, tono o combinación"},
      {key:"quantity",label:"Cantidad",placeholder:"Gramos / paquetes / tapes"},
      {key:"placement",label:"Distribución",placeholder:"Laterales, nuca, full head..."},
      {key:"maintenance_interval",label:"Mantenimiento",placeholder:"Ej. cada 6–8 semanas"},
    ]},
  ],
  nails:[
    {title:"Su manicure",subtitle:"Pequeños detalles que hacen que se sienta ella.",fields:[
      {key:"service_type",label:"Técnica",type:"select",options:["Regular","Gel","DIP","Aprés","Polygel","Acrylic"]},
      {key:"shape",label:"Forma",type:"select",options:["Square","Squoval","Round","Oval","Almond","Coffin","Stiletto"]},
      {key:"length",label:"Largo",type:"select",options:["Extra short","Short","Medium","Long","XL"]},
      {key:"color",label:"Color",placeholder:"Marca + nombre / código"},
      {key:"finish",label:"Acabado",type:"select",options:["Solid","French","Chrome","Cat eye","Glitter","Nail art","Natural"]},
      {key:"design_notes",label:"Diseño",placeholder:"Detalles que quiera repetir"},
    ]},
  ],
  lashes:[
    {title:"Mapa de pestañas",subtitle:"Para recrear su mirada sin empezar de cero.",fields:[
      {key:"lash_type",label:"Tipo",type:"select",options:["Classic","Greek","Hybrid","Mega Volume"]},
      {key:"effect",label:"Efecto",type:"select",options:["Natural","Cat eye","Doll eye","Wispy","Open eye","Squirrel"]},
      {key:"curl",label:"Curl",type:"select",options:["B","C","CC","D","L","M","Mixed"]},
      {key:"length_map",label:"Largos / mapping",placeholder:"8-9-10-11-12..."},
      {key:"density",label:"Densidad",type:"select",options:["Soft","Medium","Full","Extra full"]},
      {key:"adhesive_notes",label:"Notas",placeholder:"Sensibilidad, retención, ajustes..."},
    ]},
  ],
  brows:[
    {title:"Sus cejas",subtitle:"Forma y tono que favorecen su rostro.",fields:[
      {key:"shape",label:"Shape",type:"select",options:["Soft arch","Defined arch","Straight","Rounded","Natural cleanup"]},
      {key:"thickness",label:"Grosor",type:"select",options:["Natural","Medium","Defined"]},
      {key:"tint_color",label:"Color / Henna",placeholder:"Marca + tono"},
      {key:"waxing",label:"Depilación",type:"select",options:["Wax","Tweezers","Threading","Combination"]},
      {key:"mapping_notes",label:"Mapping",placeholder:"Puntos o ajustes a recordar"},
    ]},
  ],
  tanning:[{title:"Su glow",subtitle:"El tono que mejor le funciona.",fields:[{key:"type",label:"Tipo",type:"select",options:["Regular","Express"]},{key:"tone",label:"Tono",placeholder:"Natural / golden / bronze"},{key:"intensity",label:"Intensidad",type:"select",options:["Light","Medium","Dark","Extra dark"]},{key:"development",label:"Tiempo de desarrollo",placeholder:"Hora recomendada de enjuague"}]}],
  makeup:[{title:"Su look",subtitle:"Tonos y acabados que sabemos que le funcionan.",fields:[{key:"foundation",label:"Base / tono",placeholder:"Marca + tono + subtono"},{key:"finish",label:"Acabado",type:"select",options:["Natural","Soft glam","Full glam","Matte","Glowy"]},{key:"eyes",label:"Ojos",placeholder:"Tonos / técnica"},{key:"lashes",label:"Pestaña usada",placeholder:"Modelo / número"},{key:"lips",label:"Labios",placeholder:"Liner + lipstick / gloss"}]}],
  general:[{title:"Detalles de la visita",subtitle:"Guarda lo que valga la pena recordar.",fields:[{key:"details",label:"Detalles",placeholder:"¿Qué deberíamos recordar?"}]}],
};

export default function CompleteVisitPage(){
  const params=useParams<{id:string}>();const router=useRouter();
  const [appt,setAppt]=useState<Appointment|null>(null);const [loading,setLoading]=useState(true);const [values,setValues]=useState<Record<string,string>>({});
  const [summary,setSummary]=useState("");const [maintenance,setMaintenance]=useState("");
  const [products,setProducts]=useState({shampoo:"",conditioner:"",toner:"",treatment:"",styling:""});
  const [visible,setVisible]=useState(true);const [saving,setSaving]=useState(false);const [message,setMessage]=useState<string|null>(null);const [done,setDone]=useState(false);
  const [extraOpen,setExtraOpen]=useState(false);const [allServices,setAllServices]=useState<ServiceOption[]>([]);const [extraServiceId,setExtraServiceId]=useState("");const [extraEligibleStaff,setExtraEligibleStaff]=useState<StaffOption[]>([]);const [extraStaffId,setExtraStaffId]=useState("");const [extraPrice,setExtraPrice]=useState("");

  useEffect(()=>{(async()=>{const {data}=await supabase.from("appointments").select("id,client_name,client_phone,client_email,status,start_at,service_id,staff_id,client_id,service:service_id(name,category),staff:staff_id(name)").eq("id",params.id).maybeSingle();setAppt((data as Appointment|null)||null);setLoading(false)})()},[params.id]);
  useEffect(()=>{(async()=>{const {data}=await supabase.from("services").select("id,name,category,duration_minutes,price_label").eq("active",true).order("name");setAllServices((data as ServiceOption[])||[])})()},[]);
  useEffect(()=>{if(!extraServiceId){setExtraEligibleStaff([]);setExtraStaffId("");return}(async()=>{const {data}=await supabase.from("staff_services").select("staff:staff_id(id,name)").eq("service_id",extraServiceId);const list=((data as any[])||[]).map(x=>x.staff).filter(Boolean);setExtraEligibleStaff(list);setExtraStaffId(list.length===1?list[0].id:"")})()},[extraServiceId]);
  const extraService=useMemo(()=>allServices.find(s=>s.id===extraServiceId)||null,[allServices,extraServiceId]);
  const family=useMemo(()=>serviceFamily(appt?.service?.name||"",appt?.service?.category||"general"),[appt?.service?.name,appt?.service?.category]);
  const sections=configs[family]||configs.general;

  async function save(){if(!appt)return;setSaving(true);setMessage(null);
    const details={service_family:family,...Object.fromEntries(Object.entries(values).filter(([,v])=>v.trim()).map(([k,v])=>[k,v.trim()]))};
    const productList=Object.entries(products).filter(([,v])=>v.trim()).map(([type,name])=>({type,name:name.trim()}));
    const title=buildTitle(family,details,appt.service?.name||"Visita");
    const {error}=await supabase.rpc("save_and_complete_appointment",{p_appointment_id:appt.id,p_title:title,p_summary:summary||null,p_details:details,p_client_visible:visible,p_maintenance_notes:maintenance||null,p_products_used:productList});
    if(error){setSaving(false);setMessage(error.message);return;}
    if(extraOpen&&extraServiceId&&extraStaffId){
      const {data:newId,error:e1}=await supabase.rpc("hub_create_appointment",{p_service_id:extraServiceId,p_staff_id:extraStaffId,p_start_at:appt.start_at,p_client_name:appt.client_name,p_client_phone:appt.client_phone,p_client_email:appt.client_email,p_notes_internal:"Servicio agregado al completar la visita principal.",p_source:"gloria_hub"});
      if(e1){setSaving(false);setMessage(`Se guardó la visita, pero no se pudo agregar el servicio extra: ${e1.message}`);return;}
      const priceCents=extraPrice.trim()===""?null:Math.round(Number(extraPrice)*100);
      await supabase.rpc("hub_update_appointment_status",{p_appointment_id:newId,p_status:"completed"});
      if(priceCents!==null)await supabase.rpc("hub_update_appointment_details",{p_appointment_id:newId,p_client_name:appt.client_name,p_client_phone:appt.client_phone,p_client_email:appt.client_email,p_notes_internal:"Servicio agregado al completar la visita principal.",p_price_cents:priceCents,p_deposit_cents:null});
    }
    setSaving(false);setDone(true)
  }
  if(loading)return <p className="text-[12px] text-taupe">Cargando visita...</p>;
  if(!appt)return <div><h1 className="font-serif text-[40px]">Cita no disponible.</h1><p className="mt-3 text-[12px] text-taupe">Puede que no tengas permiso para acceder a esta cita.</p></div>;
  if(done)return <div className="max-w-[620px] mx-auto py-10 text-center"><div className="mx-auto h-14 w-14 rounded-full bg-[#34261F] text-ivory flex items-center justify-center"><Check size={24}/></div><p className="mt-6 text-[9px] uppercase tracking-[.25em] text-mocha">Beauty memory updated</p><h1 className="mt-2 font-serif text-[46px] leading-none">Todo quedó guardado.</h1><p className="mt-4 text-[13px] text-taupe">La cita está completada y el perfil de {appt.client_name} ahora recuerda esta visita.</p><button onClick={()=>router.push("/hub/my-agenda")} className="mt-7 rounded-full bg-[#34261F] px-6 py-3 text-[9px] uppercase tracking-[0.14em] text-ivory">Volver a Mis Citas</button></div>;

  return <div className="max-w-[980px] mx-auto pb-12">
    <button onClick={()=>router.back()} className="inline-flex items-center gap-1 text-[11px] text-taupe"><ChevronLeft size={14}/>Volver</button>
    <section className="mt-5 overflow-hidden rounded-[28px] bg-[#34261F] text-ivory shadow-[0_18px_50px_rgba(52,38,31,.12)]">
      <div className="p-6 md:p-8"><div className="flex items-start justify-between gap-5"><div><p className="text-[9px] uppercase tracking-[.26em] text-champagne">Guardar + Completar</p><h1 className="mt-2 font-serif text-[42px] md:text-[54px] leading-none">{appt.client_name}</h1><p className="mt-3 text-[12px] text-ivory/65">{appt.service?.name} · {appt.staff?.name}</p></div><Sparkles className="text-champagne" size={24}/></div></div>
      <div className="bg-[#F8F4EE] text-espresso px-6 py-4 flex items-center justify-between gap-4"><div><p className="text-[9px] uppercase tracking-[.18em] text-mocha">Lo que guardes aquí construye su Beauty Profile</p><p className="mt-1 text-[11px] text-taupe">Solo aparecen los campos relevantes para este servicio.</p></div><button onClick={()=>setVisible(v=>!v)} className="flex shrink-0 items-center gap-2 rounded-full border border-champagne/50 bg-white/70 px-3 py-2 text-[9px] text-mocha">{visible?<Eye size={14}/>:<EyeOff size={14}/>} {visible?"Visible para ella":"Solo interno"}</button></div>
    </section>

    <div className="mt-6 space-y-5">{sections.map((section,idx)=><section key={section.title} className="rounded-[24px] border border-champagne/35 bg-white/70 p-5 md:p-7 shadow-[0_8px_28px_rgba(52,38,31,.04)]"><div className="flex gap-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blush/55 font-serif text-[15px] text-mocha">{idx+1}</span><div><h2 className="font-serif text-[30px] leading-none">{section.title}</h2><p className="mt-2 text-[11px] text-taupe">{section.subtitle}</p></div></div><div className="mt-6 grid gap-4 sm:grid-cols-2">{section.fields.map(f=><BeautyField key={f.key} field={f} value={values[f.key]||""} onChange={v=>setValues(x=>({...x,[f.key]:v}))}/>)}</div></section>)}

      {(["color","blowdry","treatment","cut","styling","extensions"] as string[]).includes(family)&&<section className="rounded-[24px] border border-champagne/35 bg-[#EFE4DC]/45 p-5 md:p-7"><div><p className="text-[9px] uppercase tracking-[.2em] text-mocha">Productos usados hoy</p><h2 className="mt-2 font-serif text-[30px] leading-none">Su rutina, sin adivinar.</h2><p className="mt-2 text-[11px] text-taupe">Guarda solo lo que realmente usamos en ella.</p></div><div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"><ProductField label="Shampoo" value={products.shampoo} onChange={v=>setProducts(p=>({...p,shampoo:v}))}/><ProductField label="Acondicionador" value={products.conditioner} onChange={v=>setProducts(p=>({...p,conditioner:v}))}/><ProductField label="Matizador" value={products.toner} onChange={v=>setProducts(p=>({...p,toner:v}))}/><ProductField label="Tratamiento" value={products.treatment} onChange={v=>setProducts(p=>({...p,treatment:v}))}/><ProductField label="Styling / Finish" value={products.styling} onChange={v=>setProducts(p=>({...p,styling:v}))}/></div></section>}

      <section className="rounded-[24px] border border-champagne/35 bg-white/70 p-5 md:p-7">
        <div className="flex items-center justify-between gap-4"><div><p className="text-[9px] uppercase tracking-[.2em] text-mocha">¿Se hizo algo más en esta visita?</p><h2 className="mt-2 font-serif text-[28px] leading-none">Agregar otro servicio</h2><p className="mt-2 text-[11px] text-taupe">Si otra profesional hizo parte de esta visita (por ejemplo cabello, que hacen varias), regístralo aquí para que le cuente en su progreso.</p></div><button onClick={()=>setExtraOpen(v=>!v)} className="shrink-0 rounded-full border border-mocha/30 px-4 py-2.5 text-[9px] uppercase tracking-[.12em] text-mocha">{extraOpen?"Quitar":"+ Agregar"}</button></div>
        {extraOpen&&<div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2"><span className="block text-[9px] uppercase tracking-[0.14em] text-taupe">Servicio</span><select value={extraServiceId} onChange={e=>setExtraServiceId(e.target.value)} className="mt-2 w-full rounded-[14px] border border-taupe/20 bg-[#FBF8F3] px-3 py-3.5 text-[12px] outline-none"><option value="">Seleccionar servicio</option>{allServices.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
          {extraServiceId&&<label><span className="block text-[9px] uppercase tracking-[0.14em] text-taupe">¿Con quién fue?</span><select value={extraStaffId} onChange={e=>setExtraStaffId(e.target.value)} className="mt-2 w-full rounded-[14px] border border-taupe/20 bg-[#FBF8F3] px-3 py-3.5 text-[12px] outline-none"><option value="">Seleccionar profesional</option>{extraEligibleStaff.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select>{extraEligibleStaff.length===0&&<p className="mt-1.5 text-[10px] text-red-700">Este servicio no tiene profesionales asignadas todavía.</p>}</label>}
          {extraServiceId&&<label><span className="block text-[9px] uppercase tracking-[0.14em] text-taupe">Precio ($)</span><input type="number" min={0} step="0.01" value={extraPrice} onChange={e=>setExtraPrice(e.target.value)} placeholder={extraService?.price_label||"0.00"} className="mt-2 w-full rounded-[14px] border border-taupe/20 bg-[#FBF8F3] px-3 py-3.5 text-[12px] outline-none"/></label>}
        </div>}
      </section>

      <section className="rounded-[24px] border border-champagne/35 bg-white/70 p-5 md:p-7"><h2 className="font-serif text-[30px]">Cierre de visita</h2><div className="mt-5 grid gap-4"><Text label="Resumen bonito para la clienta" value={summary} onChange={setSummary} placeholder="Ej. Hoy dejamos tu balayage beige neutro y terminamos con ondas suaves."/><Text label="Mantenimiento / próxima visita" value={maintenance} onChange={setMaintenance} placeholder="Ej. Matizar en 6–8 semanas. No lavar por 48 h. Próximo mantenimiento de extensiones..."/></div></section>
    </div>

    {message&&<p className="mt-4 text-[12px] text-red-700">{message}</p>}
    <div className="sticky bottom-[82px] md:bottom-4 mt-6 rounded-[20px] border border-champagne/35 bg-[#FBF8F3]/95 p-3 backdrop-blur-xl shadow-[0_10px_35px_rgba(52,38,31,.10)]"><button disabled={saving||(extraOpen&&(!extraServiceId||!extraStaffId))} onClick={save} className="w-full inline-flex items-center justify-center gap-2 rounded-[16px] bg-[#34261F] px-6 py-4 text-[10px] uppercase tracking-[0.14em] text-ivory disabled:opacity-50"><Save size={15}/>{saving?"Guardando...":"Guardar Beauty Profile + Completar cita"}</button></div>
  </div>
}

function BeautyField({field,value,onChange}:{field:Field;value:string;onChange:(v:string)=>void}){return <label><span className="block text-[9px] uppercase tracking-[0.14em] text-taupe">{field.label}</span>{field.type==="select"?<select value={value} onChange={e=>onChange(e.target.value)} className="mt-2 w-full rounded-[14px] border border-taupe/20 bg-[#FBF8F3] px-3 py-3.5 text-[12px] outline-none"><option value="">Seleccionar</option>{field.options?.map(o=><option key={o} value={o}>{o}</option>)}</select>:<input value={value} onChange={e=>onChange(e.target.value)} placeholder={field.placeholder} className="mt-2 w-full rounded-[14px] border border-taupe/20 bg-[#FBF8F3] px-3 py-3.5 text-[12px] outline-none focus:border-mocha/45"/>}</label>}
function ProductField({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}){return <label className="rounded-[16px] bg-white/65 p-3"><span className="text-[9px] uppercase tracking-[.14em] text-mocha">{label}</span><input value={value} onChange={e=>onChange(e.target.value)} placeholder="Marca + producto" className="mt-2 w-full bg-transparent text-[12px] outline-none placeholder:text-taupe/55"/></label>}
function Text({label,value,onChange,placeholder}:{label:string;value:string;onChange:(v:string)=>void;placeholder:string}){return <label><span className="block text-[9px] uppercase tracking-[0.14em] text-taupe">{label}</span><textarea rows={3} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-[14px] border border-taupe/20 bg-[#FBF8F3] px-3 py-3 text-[12px] outline-none"/></label>}
function serviceFamily(name:string,category:string){const n=name.toLowerCase();if(category==="nails")return "nails";if(category==="lashes")return "lashes";if(category==="brows")return "brows";if(category==="tanning")return "tanning";if(category==="makeup")return "makeup";if(n.includes("extension"))return "extensions";if(n.includes("blowdry"))return "blowdry";if(n.includes("botox")||n.includes("keratin"))return "treatment";if(n.includes("color")||n.includes("highlight")||n.includes("balayage"))return "color";if(n.includes("cut"))return "cut";if(n.includes("braid"))return "styling";return category==="hair"?"hair":"general"}
function buildTitle(family:string,d:Record<string,unknown>,fallback:string){const pick=(...keys:string[])=>keys.map(k=>String(d[k]||"")).filter(Boolean).join(" · ");if(family==="color")return pick("color_result","technique")||fallback;if(family==="blowdry")return pick("finish","volume")||fallback;if(family==="nails")return pick("color","shape")||fallback;if(family==="lashes")return pick("lash_type","effect")||fallback;if(family==="brows")return pick("shape","tint_color")||fallback;if(family==="extensions")return pick("extension_type","length","color")||fallback;return pick("style","treatment_type","shape","tone")||fallback}
