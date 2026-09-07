"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

type MemoryLike={category:string;details:Record<string,unknown>;title?:string|null};
type Area="hair"|"brows"|"lashes"|"nails";

export function BeautyProfileMap({memory,mode="client"}:{memory:MemoryLike[];mode?:"client"|"hub"}){
  const [area,setArea]=useState<Area>("hair");
  const grouped=useMemo(()=>({
    hair:memory.filter(m=>["hair","color","blowdry","cut","treatment","styling","extensions"].includes(family(m))),
    brows:memory.filter(m=>family(m)==="brows"),
    lashes:memory.filter(m=>family(m)==="lashes"),
    nails:memory.filter(m=>family(m)==="nails"),
  }),[memory]);
  const data=merge(grouped[area]);
  const tabs:[Area,string][]=[["hair","Cabello"],["brows","Cejas"],["lashes","Pestañas"],["nails","Uñas"]];

  return <section className="overflow-hidden rounded-[28px] border border-[#D9C8BC] bg-[#FBF7F2] shadow-[0_16px_42px_rgba(52,38,31,.07)]">
    <div className="flex items-center justify-between gap-4 border-b border-[#E8DDD4] px-5 py-4 md:px-6">
      <div><p className="text-[8px] uppercase tracking-[.22em] text-mocha">Interactive Beauty Map</p><h3 className="mt-1 font-serif text-[29px] md:text-[34px]">{mode==="hub"?"Su beauty blueprint":"Tu beauty blueprint"}</h3></div>
      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#EFE1DA] text-[#6F3642]"><Sparkles size={17}/></span>
    </div>
    <div className="grid grid-cols-4 border-b border-[#E8DDD4]">
      {tabs.map(([key,label])=>{const ready=grouped[key].length>0;return <button key={key} onClick={()=>setArea(key)} className={`relative px-2 py-4 text-center transition ${area===key?"bg-[#EFE1DA]":"bg-white/45"}`}><span className={`mx-auto mb-2 block h-2 w-2 rounded-full ${ready?"bg-[#7B3C48]":"bg-[#D7C6BA]"}`}/><span className="text-[8px] uppercase tracking-[.11em] text-mocha">{label}</span>{area===key&&<span className="absolute inset-x-5 bottom-0 h-px bg-[#7B3C48]"/>}</button>})}
    </div>
    {area==="hair"?<HairMap data={data} ready={grouped.hair.length>0}/>:area==="nails"?<NailsMap data={data} ready={grouped.nails.length>0}/>:<EyeMap kind={area} data={data} ready={grouped[area].length>0}/>} 
  </section>
}

function HairMap({data,ready}:{data:Record<string,unknown>;ready:boolean}){
  const [detail,setDetail]=useState<"length"|"texture"|"color"|"highlights"|"blowdry">("length");
  const value={
    length:pick(data,["length","preferred_length"]),
    texture:pick(data,["texture","hair_texture"]),
    color:pick(data,["current_color","color","tone"]),
    highlights:pick(data,["technique","highlights","mecha"]),
    blowdry:pick(data,["blowdry_preference","finish","usual_style","drying_style"]),
  };
  const labels={length:"Largo",texture:"Textura",color:"Color",highlights:"Mechas",blowdry:"Secado"};
  return <div className="grid md:grid-cols-[.92fr_1.08fr]">
    <div className="relative min-h-[400px] overflow-hidden bg-[linear-gradient(155deg,#F1E4DC,#DABCB0)]">
      <div className="absolute inset-0 opacity-75" style={{backgroundImage:"radial-gradient(circle at 75% 16%,rgba(255,255,255,.9),transparent 26%),repeating-radial-gradient(ellipse at 50% 20%,rgba(84,52,43,.11) 0 2px,transparent 3px 15px)"}}/>
      <div className="absolute left-1/2 top-8 h-[326px] w-[198px] -translate-x-1/2 rounded-[49%_49%_42%_42%/22%_22%_78%_78%] bg-[linear-gradient(90deg,#3D2923,#684637_22%,#A6795E_47%,#C39A78_58%,#77503E_78%,#3B2925)] shadow-[0_30px_65px_rgba(74,44,35,.24)]"/>
      <div className="absolute left-1/2 top-14 h-[290px] w-[160px] -translate-x-1/2 rounded-[49%_49%_42%_42%/22%_22%_78%_78%] opacity-50" style={{backgroundImage:"repeating-linear-gradient(102deg,rgba(255,232,207,.22) 0 2px,transparent 3px 11px)"}}/>
      <div className="absolute bottom-5 left-5 right-5 rounded-[17px] border border-white/50 bg-white/55 p-4 backdrop-blur-sm"><p className="text-[7px] uppercase tracking-[.18em] text-taupe">Hair signature</p><p className="mt-1 font-serif text-[24px] text-[#4A352B]">{ready?(value.color||"Perfil de cabello"):`Aún sin datos`}</p><p className="mt-1 text-[9px] text-taupe">{[value.length,value.highlights,value.blowdry].filter(Boolean).join(" · ")||"Se irá completando con cada visita."}</p></div>
    </div>
    <div className="p-5 md:p-6">
      <div className="flex gap-1 overflow-x-auto pb-2">{(Object.keys(labels) as (keyof typeof labels)[]).map(k=><button key={k} onClick={()=>setDetail(k)} className={`whitespace-nowrap rounded-full px-3 py-2 text-[8px] uppercase tracking-[.09em] ${detail===k?"bg-[#4A352B] text-white":"bg-[#EEE3DB] text-mocha"}`}>{labels[k]}</button>)}</div>
      <div className="mt-6"><p className="text-[8px] uppercase tracking-[.18em] text-taupe">{labels[detail]}</p><h4 className="mt-2 font-serif text-[34px] leading-none">{value[detail]||"Por definir"}</h4><p className="mt-3 text-[10px] leading-relaxed text-taupe">{detail==="blowdry"?"Cómo le gusta salir del salón: ondas, liso, volumen, puntas o blowout.":detail==="highlights"?"Técnica y patrón de iluminación que prefiere.":"Preferencia guardada por Gloria y el team."}</p>
      <div className="mt-6 grid grid-cols-4 gap-2">{[0,1,2,3].map(i=><div key={i} className={`rounded-[15px] border p-2 ${i===0&&value[detail]?"border-[#7B3C48] bg-[#EEDDD8]":"border-[#E3D6CC] bg-white/65"}`}><HairGlyph variant={i}/></div>)}</div>
      {!ready&&<Empty/>}</div>
    </div>
  </div>
}

function NailsMap({data,ready}:{data:Record<string,unknown>;ready:boolean}){const shape=pick(data,["shape"]);const shade=pick(data,["shade","color"]);const technique=pick(data,["technique"]);const length=pick(data,["length"]);return <div className="grid md:grid-cols-[1.05fr_.95fr]"><div className="relative min-h-[375px] overflow-hidden bg-[linear-gradient(145deg,#F0DDD8,#D8B7B0)]"><div className="absolute left-[17%] top-[62px] h-[245px] w-[160px] rotate-[-13deg] rounded-[50%_48%_42%_44%] bg-[#D5A38F] shadow-[0_24px_45px_rgba(96,54,46,.13)]"/>{[0,1,2,3].map(i=><div key={i} className="absolute h-[99px] w-[27px] rounded-[18px] bg-[#D5A38F]" style={{left:`${39+i*31}%`,top:`${73+i*8}px`,transform:`rotate(${-9+i*4}deg)`}}><span className="absolute left-[3px] top-[2px] h-[35px] w-[21px] rounded-[11px] border border-white/35" style={{background:shadeColor(shade)}}/></div>)}<div className="absolute bottom-5 left-5 rounded-[16px] bg-white/58 px-4 py-3 backdrop-blur-sm"><p className="text-[7px] uppercase tracking-[.16em] text-taupe">Nail signature</p><p className="mt-1 font-serif text-[23px]">{shade||"Por definir"}</p></div></div><div className="p-6"><p className="text-[8px] uppercase tracking-[.2em] text-mocha">Uñas</p><h4 className="mt-2 font-serif text-[34px]">{ready?"Su forma + color":"Aún sin datos"}</h4><div className="mt-5 grid grid-cols-2 gap-3"><Datum label="Forma" value={shape}/><Datum label="Color" value={shade}/><Datum label="Técnica" value={technique}/><Datum label="Largo" value={length}/></div>{!ready&&<Empty/>}</div></div>}

function EyeMap({kind,data,ready}:{kind:"brows"|"lashes";data:Record<string,unknown>;ready:boolean}){return <div className="grid md:grid-cols-[1fr_.95fr]"><div className="relative min-h-[360px] overflow-hidden bg-[linear-gradient(155deg,#EFD8D3,#D4ABA3)]"><div className="absolute left-1/2 top-[112px] h-[88px] w-[225px] -translate-x-1/2 rounded-[50%] bg-[#D3A18E]"/><div className="absolute left-1/2 top-[139px] h-[40px] w-[122px] -translate-x-1/2 rounded-[50%] bg-[#5D4338]"/><div className="absolute left-1/2 top-[144px] h-[28px] w-[28px] -translate-x-1/2 rounded-full bg-[#211918] ring-[10px] ring-[#98735D]"/>{kind==="lashes"?<div className="absolute left-1/2 top-[119px] h-[42px] w-[160px] -translate-x-1/2 rounded-[50%] border-t-[5px] border-[#3E2B27]"/>:<div className="absolute left-1/2 top-[90px] h-[23px] w-[160px] -translate-x-1/2 rounded-[50%] border-t-[8px] border-[#493229]"/>}</div><div className="p-6"><p className="text-[8px] uppercase tracking-[.2em] text-mocha">{kind==="brows"?"Cejas":"Pestañas"}</p><h4 className="mt-2 font-serif text-[34px]">{ready?(kind==="brows"?"Su shape":"Su mapping"):"Aún sin datos"}</h4><div className="mt-5 grid grid-cols-2 gap-3">{Object.entries(data).filter(([k,v])=>k!=="service_family"&&v!=null&&v!=="").slice(0,6).map(([k,v])=><Datum key={k} label={human(k)} value={String(v)}/>)}</div>{!ready&&<Empty/>}</div></div>}

function Datum({label,value}:{label:string;value:string}){return <div className="rounded-[16px] border border-[#E0D2C8] bg-white/65 p-3"><p className="text-[7px] uppercase tracking-[.12em] text-taupe">{label}</p><p className="mt-1 font-serif text-[20px]">{value||"—"}</p></div>}
function Empty(){return <div className="mt-6 rounded-[17px] border border-dashed border-[#D6C4B8] bg-white/40 p-4 text-center"><p className="text-[9px] text-taupe">Esta parte se completa cuando el team guarda sus preferencias.</p></div>}
function HairGlyph({variant}:{variant:number}){return <div className="mx-auto flex h-16 w-12 items-end justify-center gap-[3px] rounded-t-[24px] bg-[#E8D5CB] px-2">{[0,1,2,3].map(x=><span key={x} className="block w-[4px] rounded-full bg-[linear-gradient(#57392E,#A77A5F)]" style={{height:`${38+((x+variant*2)%4)*5}px`,transform:`rotate(${(x-1.5)*(variant%2?3:1.2)}deg)`}}/>)}</div>}
function family(m:MemoryLike){return String(m.details?.service_family||m.category||"general").toLowerCase()}
function merge(items:MemoryLike[]){const out:Record<string,unknown>={};[...items].reverse().forEach(m=>Object.assign(out,m.details||{}));return out}
function pick(data:Record<string,unknown>,keys:string[]){for(const k of keys){const v=data[k];if(v!==null&&v!==undefined&&String(v).trim()!=="")return String(v)}return ""}
function human(v:string){return v.replaceAll("_"," ").replaceAll("-"," ").replace(/\b\w/g,c=>c.toUpperCase())}
function shadeColor(shade:string){const s=(shade||"").toLowerCase();if(s.includes("red")||s.includes("rojo")||s.includes("ferrari"))return "#B51F2A";if(s.includes("nude")||s.includes("beige"))return "#D8B7AA";if(s.includes("pink")||s.includes("rosa"))return "#D79AA6";if(s.includes("wine")||s.includes("vino"))return "#743642";return "#DAB9B0"}
