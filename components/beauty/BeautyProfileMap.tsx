"use client";

import { useMemo, useState } from "react";
import { Check, ChevronRight, Plus, Sparkles } from "lucide-react";

type MemoryLike={category:string;details:Record<string,unknown>;title?:string|null};
type Area="hair"|"brows"|"lashes"|"nails";
type HairTab="length"|"texture"|"color"|"highlights"|"blowdry";

const areaMeta:Record<Area,{label:string;image:string;eyebrow:string}>={
  hair:{label:"Cabello",image:"/images/gloria/hair/hair-01.jpg",eyebrow:"Hair identity"},
  brows:{label:"Cejas",image:"/images/gloria/brows/brows-01.jpg",eyebrow:"Shape + tint"},
  lashes:{label:"Pestañas",image:"/images/gloria/lashes/lashes-01.jpg",eyebrow:"Map + curl"},
  nails:{label:"Uñas",image:"/images/gloria/nails/nails-01.jpg",eyebrow:"Shape + shade"},
};
const areas=(Object.keys(areaMeta) as Area[]);
const hairTabs:{key:HairTab;label:string}[]=[
  {key:"length",label:"Largo"},{key:"texture",label:"Textura"},{key:"color",label:"Color"},{key:"highlights",label:"Mechas"},{key:"blowdry",label:"Secado"}
];

export function BeautyProfileMap({memory,mode="client"}:{memory:MemoryLike[];mode?:"client"|"hub"}){
  const [active,setActive]=useState<Area>("hair");
  const [hairTab,setHairTab]=useState<HairTab>("length");
  const grouped=useMemo(()=>({
    hair:memory.filter(m=>["hair","color","blowdry","cut","treatment","styling","extensions"].includes(family(m))),
    brows:memory.filter(m=>family(m)==="brows"),
    lashes:memory.filter(m=>family(m)==="lashes"),
    nails:memory.filter(m=>family(m)==="nails"),
  }),[memory]);
  const completed=areas.filter(a=>grouped[a].length>0).length;
  const stage=completed===0?"Stage 01 · Perfil vacío":completed<3?"Stage 02 · En construcción":completed<4?"Stage 03 · Perfil parcial":"Stage 04 · Beauty Profile completo";
  const details=merge(grouped[active]);

  return <section className="overflow-hidden rounded-[30px] border border-[#D9CBC1] bg-[#F7EFE8] shadow-[0_18px_45px_rgba(52,38,31,.07)]">
    <header className="border-b border-[#E3D6CC] px-5 py-5 md:px-7 md:py-6">
      <div className="flex items-start justify-between gap-4">
        <div><p className="text-[8px] uppercase tracking-[.24em] text-[#7B3C48]">Interactive Beauty Blueprint</p><h3 className="mt-1 font-serif text-[31px] md:text-[38px]">{mode==="hub"?"Su Beauty Map":"Tu Beauty Map"}</h3><p className="mt-2 text-[10px] leading-relaxed text-taupe">{stage} · {completed}/4 áreas con información real.</p></div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#6F3642] text-white"><Sparkles size={16}/></span>
      </div>
      <div className="mt-5 h-[3px] overflow-hidden rounded-full bg-[#E7DAD0]"><div className="h-full rounded-full bg-[#7B3C48] transition-all" style={{width:`${completed/4*100}%`}}/></div>
    </header>

    <div className="p-4 md:p-6">
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {areas.map(area=>{
          const ready=grouped[area].length>0;const selected=active===area;const m=areaMeta[area];
          return <button key={area} onClick={()=>setActive(area)} className={`relative min-h-[88px] overflow-hidden rounded-[19px] border text-left transition md:min-h-[118px] ${selected?"border-[#7B3C48] ring-2 ring-[#7B3C48]/10":"border-white/60"}`}>
            <img src={m.image} alt={m.label} className="absolute inset-0 h-full w-full object-cover"/>
            <span className="absolute inset-0 bg-gradient-to-t from-[#2E2724]/80 via-[#2E2724]/18 to-transparent"/>
            <span className={`absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full border border-white/35 backdrop-blur-sm ${ready?"bg-[#6F3642]":"bg-white/25"}`}>{ready?<Check size={11} className="text-white"/>:<Plus size={11} className="text-white"/>}</span>
            <span className="absolute inset-x-0 bottom-0 p-2.5 md:p-3"><span className="block text-[6px] uppercase tracking-[.15em] text-white/55 md:text-[7px]">{m.eyebrow}</span><span className="mt-1 block font-serif text-[17px] leading-none text-white md:text-[22px]">{m.label}</span></span>
          </button>
        })}
      </div>

      {active==="hair"?<HairPanel items={grouped.hair} data={details} tab={hairTab} setTab={setHairTab} mode={mode}/>:<AreaPanel area={active} data={details} ready={grouped[active].length>0} mode={mode}/>} 
    </div>
  </section>
}

function HairPanel({items,data,tab,setTab,mode}:{items:MemoryLike[];data:Record<string,unknown>;tab:HairTab;setTab:(t:HairTab)=>void;mode:"client"|"hub"}){
  const ready=items.length>0;
  const values:Record<HairTab,string>={
    length:pick(data,["length","preferred_length"]),
    texture:pick(data,["texture","hair_texture"]),
    color:pick(data,["current_color","color","tone"]),
    highlights:pick(data,["technique","highlights","mecha"]),
    blowdry:pick(data,["blowdry_preference","usual_style","finish","blowdry","drying_style"]),
  };
  return <div className="mt-4 overflow-hidden rounded-[27px] border border-[#DDCFC4] bg-[#FCF9F5]">
    <div className="grid lg:grid-cols-[.92fr_1.08fr]">
      <div className="relative min-h-[360px] overflow-hidden lg:min-h-[500px]">
        <img src="/images/gloria/hair/hair-01.jpg" alt="Hair profile" className="absolute inset-0 h-full w-full object-cover"/>
        <span className="absolute inset-0 bg-gradient-to-t from-[#2E2724]/82 via-transparent to-transparent"/>
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-7 text-white"><p className="text-[8px] uppercase tracking-[.2em] text-white/60">Your signature hair</p><h4 className="mt-2 font-serif text-[39px] leading-none md:text-[48px]">Tu cabello,<br/>detalle por detalle.</h4><p className="mt-4 max-w-[390px] text-[10px] leading-relaxed text-white/70">{ready?hairSummary(values):mode==="hub"?"Empieza agregando lo que ya conoces de esta clienta.":"Se irá construyendo con cada visita, sin inventar información."}</p></div>
      </div>
      <div className="p-5 md:p-7">
        <div className="flex gap-2 overflow-x-auto pb-2">{hairTabs.map(t=><button key={t.key} onClick={()=>setTab(t.key)} className={`shrink-0 rounded-full px-4 py-2.5 text-[8px] uppercase tracking-[.12em] ${tab===t.key?"bg-[#6F3642] text-white":"border border-[#D9C9BE] bg-white text-taupe"}`}>{t.label}</button>)}</div>
        <div className="mt-5 rounded-[23px] border border-[#E0D2C7] bg-[#F5EAE3] p-5 md:p-6"><p className="text-[8px] uppercase tracking-[.2em] text-[#7B3C48]">{hairTabs.find(t=>t.key===tab)?.label}</p><p className={`mt-2 font-serif text-[36px] leading-none ${values[tab]?"text-[#4A352B]":"text-[#B5A59A]"}`}>{values[tab]||"Por descubrir"}</p><p className="mt-3 text-[10px] leading-relaxed text-taupe">{hairHelp(tab,Boolean(values[tab]),mode)}</p></div>
        <div className="mt-4 grid grid-cols-2 gap-2">{hairTabs.filter(t=>t.key!==tab).map(t=><button key={t.key} onClick={()=>setTab(t.key)} className="flex min-h-[86px] items-center justify-between rounded-[18px] border border-[#E0D3C9] bg-white/75 p-4 text-left"><div><p className="text-[7px] uppercase tracking-[.14em] text-taupe">{t.label}</p><p className={`mt-1 font-serif text-[19px] leading-tight ${values[t.key]?"text-[#4A352B]":"text-[#B6A69B]"}`}>{values[t.key]||"Por definir"}</p></div>{values[t.key]?<span className="h-2 w-2 rounded-full bg-[#7B3C48]"/>:<Plus size={13} className="text-taupe"/>}</button>)}</div>
        {values.blowdry&&<div className="mt-4 rounded-[20px] bg-[#6F3642] p-5 text-white"><p className="text-[7px] uppercase tracking-[.18em] text-[#E9CFCF]">Usual finish</p><p className="mt-2 font-serif text-[27px]">{values.blowdry}</p></div>}
      </div>
    </div>
  </div>
}

function AreaPanel({area,data,ready,mode}:{area:"brows"|"lashes"|"nails";data:Record<string,unknown>;ready:boolean;mode:"client"|"hub"}){
  const meta=areaMeta[area];
  const keys=area==="brows"?[["Shape",["shape","brow_shape"]],["Color",["color","tint","tone"]],["Finish",["finish","wax_preference"]]]:area==="lashes"?[["Tipo",["lash_type","type"]],["Curl",["curl"]],["Efecto",["effect","style"]],["Mapping",["mapping","map"]],["Densidad",["density"]]]:[["Forma",["shape"]],["Color",["shade","color"]],["Técnica",["technique"]],["Largo",["length"]],["Finish",["finish"]]];
  return <div className="mt-4 overflow-hidden rounded-[27px] border border-[#DDCFC4] bg-[#FCF9F5]"><div className="grid md:grid-cols-[.82fr_1.18fr]">
    <div className="relative min-h-[310px] overflow-hidden"><img src={meta.image} alt={meta.label} className="absolute inset-0 h-full w-full object-cover"/><span className="absolute inset-0 bg-gradient-to-t from-[#2E2724]/78 via-transparent to-transparent"/><div className="absolute inset-x-0 bottom-0 p-6 text-white"><p className="text-[8px] uppercase tracking-[.18em] text-white/55">{meta.eyebrow}</p><h4 className="mt-2 font-serif text-[39px]">{meta.label}</h4><p className="mt-2 text-[10px] text-white/68">{ready?summary(area,data):mode==="hub"?"Agrega sus preferencias reales.":"Esta parte todavía está por descubrir."}</p></div></div>
    <div className="p-5 md:p-7"><div className="flex items-center justify-between"><div><p className="text-[8px] uppercase tracking-[.18em] text-[#7B3C48]">Beauty detail</p><h4 className="mt-1 font-serif text-[31px]">{ready?"Perfil activo":"Por descubrir"}</h4></div><span className={`grid h-9 w-9 place-items-center rounded-full ${ready?"bg-[#6F3642] text-white":"bg-[#EEE2D9] text-taupe"}`}>{ready?<Check size={15}/>:<Plus size={15}/>}</span></div><div className="mt-5 grid gap-2.5 sm:grid-cols-2">{keys.map(([label,ks])=>{const value=pick(data,ks as string[]);return <div key={label as string} className="rounded-[18px] border border-[#E0D3C9] bg-white/75 p-4"><p className="text-[7px] uppercase tracking-[.14em] text-taupe">{label as string}</p><p className={`mt-1 font-serif text-[22px] ${value?"text-[#4A352B]":"text-[#B5A59A]"}`}>{value||"Por definir"}</p></div>})}</div></div>
  </div></div>
}

function family(m:MemoryLike){return String(m.details?.service_family||m.category||"general").toLowerCase()}
function merge(items:MemoryLike[]){const out:Record<string,unknown>={};[...items].reverse().forEach(m=>Object.assign(out,m.details||{}));return out}
function pick(data:Record<string,unknown>,keys:string[]){for(const k of keys){const v=data[k];if(v!==null&&v!==undefined&&String(v).trim()!=="")return String(v)}return ""}
function hairSummary(v:Record<HairTab,string>){return [v.length,v.texture,v.color,v.highlights,v.blowdry].filter(Boolean).join(" · ")||"Preferencias de cabello guardadas."}
function hairHelp(tab:HairTab,ready:boolean,mode:"client"|"hub"){if(ready)return {length:"El largo que mejor describe su cabello actual.",texture:"La textura natural o la que solemos trabajar.",color:"Color y tono que forman parte de su beauty memory.",highlights:"Balayage, highlights, money piece u otra técnica guardada.",blowdry:"El acabado que más le gusta repetir después del servicio."}[tab];return mode==="hub"?"Todavía no está definido. Puedes agregarlo desde ‘Agregar al perfil’.":"Todavía no lo hemos definido contigo; se irá completando en tus próximas visitas."}
function summary(area:Area,d:Record<string,unknown>){if(area==="brows")return [pick(d,["shape"]),pick(d,["color","tint"])].filter(Boolean).join(" · ")||"Preferencias de cejas guardadas.";if(area==="lashes")return [pick(d,["lash_type"]),pick(d,["curl"]),pick(d,["effect"])].filter(Boolean).join(" · ")||"Preferencias de pestañas guardadas.";if(area==="nails")return [pick(d,["shape"]),pick(d,["shade","color"]),pick(d,["technique"])].filter(Boolean).join(" · ")||"Preferencias de uñas guardadas.";return "Preferencias de cabello guardadas."}
