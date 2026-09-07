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
  const current=areas.find(a=>a.key===active)!;
  const details=merge(grouped[active]);
  const ready=grouped[active].length>0;

  return <section className="overflow-hidden rounded-[30px] border border-[#DCCFC5] bg-[#FBF7F2] shadow-[0_18px_45px_rgba(52,38,31,.07)]">
    <div className="flex items-center justify-between gap-4 border-b border-[#E7DBD1] px-5 py-4 md:px-6">
      <div><p className="text-[8px] uppercase tracking-[.22em] text-mocha">Interactive Beauty Map</p><h3 className="mt-1 font-serif text-[29px] md:text-[34px]">{mode==="hub"?"Su beauty blueprint":"Tu beauty blueprint"}</h3></div>
      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#EFE1DA] text-[#6F3642]"><Sparkles size={17}/></span>
    </div>

    <div className="grid grid-cols-4 border-b border-[#E7DBD1] bg-[#F7F1EB]">
      {areas.map(a=><button key={a.key} onClick={()=>setActive(a.key)} className={`relative px-2 py-4 text-center transition ${active===a.key?"bg-[#EEDFD8]":"bg-transparent"}`}>
        <span className={`mx-auto mb-2 block h-2 w-2 rounded-full ${grouped[a.key].length?"bg-[#7A3945]":"bg-[#D5C5BA]"}`}/>
        <span className="text-[8px] uppercase tracking-[.12em] text-mocha">{a.label}</span>
        {active===a.key&&<span className="absolute inset-x-6 bottom-0 h-px bg-[#7A3945]"/>}
      </button>)}
    </div>

    <div className="grid md:grid-cols-[1.15fr_.85fr]">
      <div className="relative min-h-[420px] overflow-hidden md:min-h-[520px]">
        <img src={current.image} alt={current.label} className="absolute inset-0 h-full w-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-[#2E2724]/78 via-[#2E2724]/12 to-transparent"/>
        <div className="absolute inset-x-0 bottom-0 p-5 text-white md:p-7">
          <p className="text-[8px] uppercase tracking-[.25em] text-white/65">{current.eyebrow}</p>
          <h3 className="mt-2 font-serif text-[42px] leading-none">{ready?headline(active,details):`${current.label} por descubrir`}</h3>
          <p className="mt-3 max-w-[440px] text-[10px] leading-relaxed text-white/70">{ready?summary(active,details):mode==="hub"?"Agrega los detalles reales que ya conoces de esta clienta.":"Esta parte se irá completando con tus visitas reales."}</p>
        </div>
      </div>

      <div className="p-5 md:p-6">
        {active==="hair"?<HairDetails data={details} ready={ready}/>:<BeautyDetails area={active} data={details} ready={ready}/>} 
      </div>
    </div>
  </section>
}

function HairDetails({data,ready}:{data:Record<string,unknown>;ready:boolean}){
  const rows=[
    ["Largo",pick(data,["length","preferred_length"])],
    ["Textura",pick(data,["texture","hair_texture"])],
    ["Color",pick(data,["current_color","color","tone"])],
    ["Mechas",pick(data,["technique","highlights","mecha"])],
    ["Secado",pick(data,["blowdry_preference","usual_style","finish","blowdry","drying_style"])],
  ];
  return <div>
    <p className="text-[8px] uppercase tracking-[.2em] text-mocha">Beauty map · Cabello</p>
    <h4 className="mt-2 font-serif text-[34px] leading-none">Así le gusta verse.</h4>
    <p className="mt-3 text-[10px] leading-relaxed text-taupe">Largo, textura, color, técnica y el acabado que hace que el resultado se sienta realmente suyo.</p>
    <div className="mt-6 space-y-2.5">{rows.map(([label,value])=><div key={label} className="group flex items-center gap-3 rounded-[17px] border border-[#E3D6CC] bg-white/70 px-4 py-3.5">
      <div className="min-w-0 flex-1"><p className="text-[8px] uppercase tracking-[.14em] text-taupe">{label}</p><p className={`mt-1 font-serif text-[21px] ${value?"text-[#4A352B]":"text-[#B7A69B]"}`}>{value||"Por definir"}</p></div>
      {value?<span className="h-2 w-2 rounded-full bg-[#7A3945]"/>:<span className="grid h-8 w-8 place-items-center rounded-full bg-[#F0E4DC] text-mocha"><Plus size={13}/></span>}
    </div>)}</div>
    {ready&&<div className="mt-5 rounded-[18px] bg-[#EEDFD8] p-4"><div className="flex items-center gap-2 text-[#7A3945]"><Sparkles size={14}/><p className="text-[8px] uppercase tracking-[.16em]">Signature finish</p></div><p className="mt-2 font-serif text-[24px]">{pick(data,["blowdry_preference","usual_style","finish","blowdry","drying_style"])||"Aún por definir"}</p></div>}
  </div>
}

function BeautyDetails({area,data,ready}:{area:"brows"|"lashes"|"nails";data:Record<string,unknown>;ready:boolean}){
  const keys=area==="brows"?[["Shape",["shape","brow_shape"]],["Color",["color","tint","tone"]],["Finish",["finish"]]]:area==="lashes"?[["Tipo",["lash_type","type"]],["Curl",["curl"]],["Efecto",["effect","style"]],["Mapping",["mapping","map"]]]:[["Forma",["shape"]],["Color",["shade","color"]],["Técnica",["technique"]],["Largo",["length"]],["Finish",["finish"]]];
  return <div><p className="text-[8px] uppercase tracking-[.2em] text-mocha">Beauty map</p><h4 className="mt-2 font-serif text-[34px] leading-none">{area==="brows"?"Sus cejas.":area==="lashes"?"Su mirada.":"Sus uñas."}</h4><p className="mt-3 text-[10px] leading-relaxed text-taupe">{ready?"Preferencias reales guardadas por el team.":"Aún no tenemos datos de esta área."}</p><div className="mt-6 space-y-2.5">{keys.map(([label,ks])=>{const value=pick(data,ks as string[]);return <div key={label as string} className="flex items-center gap-3 rounded-[17px] border border-[#E3D6CC] bg-white/70 px-4 py-3.5"><div className="min-w-0 flex-1"><p className="text-[8px] uppercase tracking-[.14em] text-taupe">{label as string}</p><p className={`mt-1 font-serif text-[21px] ${value?"text-[#4A352B]":"text-[#B7A69B]"}`}>{value||"Por definir"}</p></div>{value?<ChevronRight size={14} className="text-mocha"/>:<Plus size={14} className="text-taupe"/>}</div>})}</div></div>
}

function family(m:MemoryLike){return String(m.details?.service_family||m.category||"general").toLowerCase()}
function merge(items:MemoryLike[]){const out:Record<string,unknown>={};[...items].reverse().forEach(m=>Object.assign(out,m.details||{}));return out}
function pick(data:Record<string,unknown>,keys:string[]){for(const k of keys){const v=data[k];if(v!==null&&v!==undefined&&String(v).trim()!=="")return String(v)}return ""}
function headline(area:Area,d:Record<string,unknown>){if(area==="hair")return pick(d,["current_color","color","tone"])||pick(d,["length"])||"Tu cabello";if(area==="brows")return pick(d,["shape","brow_shape"])||"Tus cejas";if(area==="lashes")return [pick(d,["lash_type","type"]),pick(d,["curl"])].filter(Boolean).join(" · ")||"Tus pestañas";return [pick(d,["shape"]),pick(d,["shade","color"])].filter(Boolean).join(" · ")||"Tus uñas"}
function summary(area:Area,d:Record<string,unknown>){if(area==="hair")return [pick(d,["length"]),pick(d,["technique"]),pick(d,["finish","blowdry_preference","drying_style"])].filter(Boolean).join(" · ")||"Preferencias de cabello guardadas.";if(area==="brows")return [pick(d,["shape"]),pick(d,["color","tint"])].filter(Boolean).join(" · ")||"Preferencias de cejas guardadas.";if(area==="lashes")return [pick(d,["lash_type"]),pick(d,["curl"]),pick(d,["effect"])].filter(Boolean).join(" · ")||"Preferencias de pestañas guardadas.";return [pick(d,["shape"]),pick(d,["shade","color"]),pick(d,["technique"])].filter(Boolean).join(" · ")||"Preferencias de uñas guardadas."}
