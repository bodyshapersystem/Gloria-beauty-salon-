"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Plus, Sparkles } from "lucide-react";

type MemoryLike={category:string;details:Record<string,unknown>;title?:string|null};
type Area="hair"|"brows"|"lashes"|"nails";

const areas:{key:Area;label:string;image:string;eyebrow:string}[]=[
  {key:"hair",label:"Cabello",image:"/images/gloria/hair/hair-01.jpg",eyebrow:"Hair identity"},
  {key:"brows",label:"Cejas",image:"/images/gloria/brows/brows-01.jpg",eyebrow:"Shape + tint"},
  {key:"lashes",label:"Pestañas",image:"/images/gloria/lashes/lashes-01.jpg",eyebrow:"Map + curl"},
  {key:"nails",label:"Uñas",image:"/images/gloria/nails/nails-01.jpg",eyebrow:"Shape + shade"},
];

export function BeautyProfileMap({memory,mode="client"}:{memory:MemoryLike[];mode?:"client"|"hub"}){
  const [active,setActive]=useState<Area>("hair");
  const grouped=useMemo(()=>({
    hair:memory.filter(m=>["hair","color","blowdry","cut","treatment","styling","extensions"].includes(family(m))),
    brows:memory.filter(m=>family(m)==="brows"),
    lashes:memory.filter(m=>family(m)==="lashes"),
    nails:memory.filter(m=>family(m)==="nails"),
  }),[memory]);
  const details=merge(grouped[active]);
  const completed=areas.filter(a=>grouped[a.key].length>0).length;

  return <section className="overflow-hidden rounded-[30px] border border-[#DCCFC5] bg-[#F8F2EC] shadow-[0_18px_45px_rgba(52,38,31,.07)]">
    <div className="flex items-start justify-between gap-4 border-b border-[#E6D8CE] px-5 py-5 md:px-7">
      <div><p className="text-[8px] uppercase tracking-[.22em] text-mocha">Interactive Beauty Blueprint</p><h3 className="mt-1 font-serif text-[30px] md:text-[36px]">{mode==="hub"?"Su mapa de belleza":"Tu mapa de belleza"}</h3><p className="mt-2 text-[10px] text-taupe">{completed}/4 áreas construidas · toca cualquier módulo para abrir sus detalles.</p></div>
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#EADCD5] text-[#6F3642]"><Sparkles size={17}/></span>
    </div>

    <div className="p-4 md:p-6">
      <div className="grid gap-3 lg:grid-cols-[1.45fr_.75fr]">
        <BlueprintTile area="hair" grouped={grouped} active={active} setActive={setActive} large mode={mode}/>
        <div className="grid grid-cols-3 gap-3 lg:grid-cols-1">
          <BlueprintTile area="brows" grouped={grouped} active={active} setActive={setActive} mode={mode}/>
          <BlueprintTile area="lashes" grouped={grouped} active={active} setActive={setActive} mode={mode}/>
          <BlueprintTile area="nails" grouped={grouped} active={active} setActive={setActive} mode={mode}/>
        </div>
      </div>

      <div className="mt-4 rounded-[24px] border border-[#E0D1C6] bg-[#FCF9F5] p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between gap-3"><div><p className="text-[8px] uppercase tracking-[.18em] text-mocha">{areas.find(a=>a.key===active)?.eyebrow}</p><h4 className="mt-1 font-serif text-[31px]">{areas.find(a=>a.key===active)?.label}</h4></div><span className={`rounded-full px-3 py-1.5 text-[8px] uppercase tracking-[.1em] ${grouped[active].length?"bg-[#6F3642] text-white":"bg-[#EDE3DB] text-taupe"}`}>{grouped[active].length?"Perfil activo":"Por descubrir"}</span></div>
        {active==="hair"?<HairDetails data={details} ready={grouped.hair.length>0}/>:<BeautyDetails area={active} data={details} ready={grouped[active].length>0}/>} 
      </div>
    </div>
  </section>
}

function BlueprintTile({area,grouped,active,setActive,large=false,mode}:{area:Area;grouped:Record<Area,MemoryLike[]>;active:Area;setActive:(a:Area)=>void;large?:boolean;mode:"client"|"hub"}){
  const meta=areas.find(a=>a.key===area)!;const ready=grouped[area].length>0;const d=merge(grouped[area]);
  return <button onClick={()=>setActive(area)} className={`group relative overflow-hidden rounded-[25px] border text-left shadow-[0_10px_26px_rgba(52,38,31,.07)] transition duration-300 hover:-translate-y-0.5 ${large?"min-h-[430px] md:min-h-[510px]":"min-h-[150px] lg:min-h-0"} ${active===area?"border-[#7A3945] ring-2 ring-[#7A3945]/10":"border-white/55"}`}>
    <img src={meta.image} alt={meta.label} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"/>
    <div className={`absolute inset-0 ${large?"bg-gradient-to-t from-[#2E2724]/82 via-[#2E2724]/12 to-transparent":"bg-gradient-to-t from-[#2E2724]/75 via-[#2E2724]/10 to-transparent"}`}/>
    <div className={`absolute left-3 top-3 grid place-items-center rounded-full border border-white/40 backdrop-blur-md ${ready?"h-7 w-7 bg-[#6F3642]":"h-8 w-8 bg-white/35"}`}>{ready?<span className="h-2 w-2 rounded-full bg-white"/>:<Plus size={14} className="text-white"/>}</div>
    <div className={`absolute inset-x-0 bottom-0 text-white ${large?"p-5 md:p-7":"p-3 lg:p-4"}`}>
      <p className="text-[7px] uppercase tracking-[.18em] text-white/60">{meta.eyebrow}</p>
      <p className={`${large?"mt-2 font-serif text-[40px] md:text-[50px]":"mt-1 font-serif text-[20px] lg:text-[25px]"}`}>{meta.label}</p>
      {large?<><p className="mt-2 max-w-[460px] text-[10px] leading-relaxed text-white/72">{ready?summary(area,d):mode==="hub"?"Agrega los detalles reales que ya conoces de esta clienta.":"Esta parte se irá completando con tus visitas reales."}</p><div className="mt-4 flex flex-wrap gap-2">{hairPills(d).map(x=><span key={x} className="rounded-full border border-white/25 bg-white/12 px-3 py-1.5 text-[8px] backdrop-blur-sm">{x}</span>)}</div></>:ready&&<p className="mt-1 line-clamp-2 text-[8px] leading-relaxed text-white/65">{summary(area,d)}</p>}
    </div>
  </button>
}

function HairDetails({data,ready}:{data:Record<string,unknown>;ready:boolean}){
  const rows=[
    ["Largo",pick(data,["length","preferred_length"])],
    ["Textura",pick(data,["texture","hair_texture"])],
    ["Color",pick(data,["current_color","color","tone"])],
    ["Mechas",pick(data,["technique","highlights","mecha"])],
    ["Secado",pick(data,["blowdry_preference","usual_style","finish","blowdry","drying_style"])],
  ];
  return <div><p className="text-[10px] leading-relaxed text-taupe">Largo, textura, color, técnica y el acabado que hace que el resultado se sienta realmente suyo.</p><div className="mt-5 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-5">{rows.map(([label,value])=><div key={label} className="flex min-h-[92px] items-center gap-3 rounded-[17px] border border-[#E3D6CC] bg-white/75 px-4 py-3.5"><div className="min-w-0 flex-1"><p className="text-[8px] uppercase tracking-[.14em] text-taupe">{label}</p><p className={`mt-1 font-serif text-[20px] leading-tight ${value?"text-[#4A352B]":"text-[#B7A69B]"}`}>{value||"Por definir"}</p></div>{value?<span className="h-2 w-2 shrink-0 rounded-full bg-[#7A3945]"/>:<span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#F0E4DC] text-mocha"><Plus size={13}/></span>}</div>)}</div>{ready&&<div className="mt-4 rounded-[18px] bg-[#EEDFD8] p-4"><div className="flex items-center gap-2 text-[#7A3945]"><Sparkles size={14}/><p className="text-[8px] uppercase tracking-[.16em]">Signature finish</p></div><p className="mt-2 font-serif text-[24px]">{pick(data,["blowdry_preference","usual_style","finish","blowdry","drying_style"])||"Aún por definir"}</p></div>}</div>
}

function BeautyDetails({area,data,ready}:{area:"brows"|"lashes"|"nails";data:Record<string,unknown>;ready:boolean}){
  const keys=area==="brows"?[["Shape",["shape","brow_shape"]],["Color",["color","tint","tone"]],["Finish",["finish"]]]:area==="lashes"?[["Tipo",["lash_type","type"]],["Curl",["curl"]],["Efecto",["effect","style"]],["Mapping",["mapping","map"]]]:[["Forma",["shape"]],["Color",["shade","color"]],["Técnica",["technique"]],["Largo",["length"]],["Finish",["finish"]]];
  return <div><p className="text-[10px] leading-relaxed text-taupe">{ready?"Preferencias reales guardadas por el team.":"Aún no tenemos datos de esta área. Cuando el team la conozca mejor, este módulo se irá completando."}</p><div className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">{keys.map(([label,ks])=>{const value=pick(data,ks as string[]);return <div key={label as string} className="flex min-h-[92px] items-center gap-3 rounded-[17px] border border-[#E3D6CC] bg-white/75 px-4 py-3.5"><div className="min-w-0 flex-1"><p className="text-[8px] uppercase tracking-[.14em] text-taupe">{label as string}</p><p className={`mt-1 font-serif text-[21px] ${value?"text-[#4A352B]":"text-[#B7A69B]"}`}>{value||"Por definir"}</p></div>{value?<ChevronRight size={14} className="text-mocha"/>:<Plus size={14} className="text-taupe"/>}</div>})}</div></div>
}

function family(m:MemoryLike){return String(m.details?.service_family||m.category||"general").toLowerCase()}
function merge(items:MemoryLike[]){const out:Record<string,unknown>={};[...items].reverse().forEach(m=>Object.assign(out,m.details||{}));return out}
function pick(data:Record<string,unknown>,keys:string[]){for(const k of keys){const v=data[k];if(v!==null&&v!==undefined&&String(v).trim()!=="")return String(v)}return ""}
function hairPills(d:Record<string,unknown>){return [["Largo",pick(d,["length","preferred_length"])],["Color",pick(d,["current_color","color","tone"])],["Mechas",pick(d,["technique","highlights"])],["Secado",pick(d,["blowdry_preference","usual_style","finish"])]] .filter(([,v])=>Boolean(v)).map(([k,v])=>`${k}: ${v}`)}
function summary(area:Area,d:Record<string,unknown>){if(area==="hair")return [pick(d,["length"]),pick(d,["current_color","color","tone"]),pick(d,["technique"]),pick(d,["finish","blowdry_preference","drying_style"])].filter(Boolean).join(" · ")||"Preferencias de cabello guardadas.";if(area==="brows")return [pick(d,["shape"]),pick(d,["color","tint"])].filter(Boolean).join(" · ")||"Preferencias de cejas guardadas.";if(area==="lashes")return [pick(d,["lash_type"]),pick(d,["curl"]),pick(d,["effect"])].filter(Boolean).join(" · ")||"Preferencias de pestañas guardadas.";return [pick(d,["shape"]),pick(d,["shade","color"]),pick(d,["technique"])].filter(Boolean).join(" · ")||"Preferencias de uñas guardadas."}
