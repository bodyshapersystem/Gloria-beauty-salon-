"use client";

import { useState } from "react";
import { Heart, Sparkles, Wand2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

type Category="hair"|"nails"|"brows"|"lashes";
const tabs:[Category,string][]=[["hair","Hair"],["nails","Nails"],["brows","Brows"],["lashes","Lashes"]];

const realAssets:Record<Category,string>={
  hair:"/images/gloria/hair/hair-01.jpg",
  nails:"/images/gloria/nails/nails-01.jpg",
  brows:"/images/gloria/brows/brows-01.jpg",
  lashes:"/images/gloria/lashes/lashes-01.jpg"
};

export default function BeautyDnaLab(){
  const [cat,setCat]=useState<Category>("hair");
  const [mode,setMode]=useState<"client"|"pro">("client");

  return <main className="min-h-screen bg-[#F4ECE6] text-[#4A2927]">
    <div className="mx-auto min-h-screen max-w-[430px] bg-[radial-gradient(circle_at_80%_5%,rgba(125,73,73,.14),transparent_25%),linear-gradient(180deg,#FCF8F3,#F1E4DC)] shadow-2xl">
      <header className="sticky top-0 z-40 border-b border-white/75 bg-[#F8F1EB]/92 px-5 pb-3 pt-4 backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <Logo className="h-[52px] w-auto"/>
          <div className="rounded-full border border-[#8F5E58]/20 bg-white/60 p-1 text-[9px] uppercase tracking-[.14em]">
            <button onClick={()=>setMode("client")} className={`rounded-full px-3 py-2 ${mode==="client"?"bg-[#7A3E48] text-white":""}`}>Client</button>
            <button onClick={()=>setMode("pro")} className={`rounded-full px-3 py-2 ${mode==="pro"?"bg-[#7A3E48] text-white":""}`}>Pro</button>
          </div>
        </div>
        <p className="mt-3 text-[9px] uppercase tracking-[.28em] text-[#8C655E]">Emmy&apos;s Beauty DNA</p>
        <h1 className="mt-1 font-serif text-[34px] leading-none">Your look, remembered.</h1>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {tabs.map(([id,label])=><button key={id} onClick={()=>setCat(id)} className={`rounded-2xl border px-2 py-3 text-[10px] transition-all duration-300 ${cat===id?"border-[#7A3E48] bg-[#7A3E48] text-white shadow-lg":"border-white/80 bg-white/55"}`}>{label}</button>)}
        </div>
      </header>

      <section className="px-4 pb-28 pt-4">
        <div className="overflow-hidden rounded-[30px] border border-white/80 bg-white/50 shadow-[0_18px_55px_rgba(74,41,39,.12)] backdrop-blur-xl">
          <div className="p-5 pb-3">
            <div className="flex items-center justify-between">
              <div><p className="text-[8px] uppercase tracking-[.24em] text-[#8C655E]">{mode==="client"?"My Preference":"Live Beauty Canvas"}</p><h2 className="mt-1 font-serif text-[30px]">{tabs.find(t=>t[0]===cat)?.[1]}</h2></div>
              <button className="grid h-10 w-10 place-items-center rounded-full border border-white/80 bg-white/70"><Heart size={18}/></button>
            </div>
          </div>

          <RealCanvas category={cat}/>

          <div className="p-5 pt-4">
            {cat==="hair"&&<HairControls mode={mode}/>}
            {cat==="nails"&&<NailsControls mode={mode}/>}
            {cat==="brows"&&<BrowsControls mode={mode}/>}
            {cat==="lashes"&&<LashesControls mode={mode}/>}
          </div>
        </div>

        <div className="mt-4 rounded-[26px] border border-white/80 bg-[#6E4A40]/90 p-4 text-[#FFF9F4] shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-2"><Sparkles size={16}/><p className="text-[9px] uppercase tracking-[.22em]">Beauty Memory</p></div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-white/10 p-3"><p className="font-serif text-[17px]">Preference</p><p className="mt-1 text-[8px] text-white/70">Client selected</p></div>
            <div className="rounded-2xl bg-white/10 p-3"><p className="font-serif text-[17px]">Last Look</p><p className="mt-1 text-[8px] text-white/70">Last service</p></div>
            <div className="rounded-2xl bg-white/10 p-3"><p className="font-serif text-[17px]">Pro Default</p><p className="mt-1 text-[8px] text-white/70">Salon memory</p></div>
          </div>
        </div>

        {mode==="pro"&&<div className="mt-4 rounded-[26px] border border-[#8A5D55]/15 bg-white/70 p-4 shadow-sm">
          <div className="flex items-center gap-2"><Wand2 size={16}/><p className="font-serif text-[22px]">What we did today</p></div>
          <p className="mt-2 text-[10px] leading-relaxed text-[#7B625B]">Document the professional result using the same preference controls. The client&apos;s preference stays separate from your technical record.</p>
          <div className="mt-4 grid grid-cols-2 gap-2"><button className="rounded-full border border-[#7A3E48]/25 bg-white px-4 py-3 text-[9px] uppercase tracking-[.12em]">Save latest</button><button className="rounded-full bg-[#7A3E48] px-4 py-3 text-[9px] uppercase tracking-[.12em] text-white">Set Pro Default</button></div>
        </div>}
      </section>
    </div>
  </main>
}

function RealCanvas({category}:{category:Category}){
  const labels={hair:"Real hair reference",nails:"Real manicure reference",brows:"Real brow reference",lashes:"Real lash reference"};
  return <div className="relative mx-3 overflow-hidden rounded-[26px] bg-[#D9C6BA]">
    <div className="relative h-[390px]">
      <img key={category} src={realAssets[category]} alt={labels[category]} className="h-full w-full object-cover transition-all duration-500 [animation:fadeIn_.45s_ease]"/>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(44,25,23,.03),rgba(44,25,23,.05)_55%,rgba(44,25,23,.68)_100%)]"/>
      <div className="absolute left-4 top-4 rounded-full border border-white/55 bg-black/15 px-3 py-2 text-[8px] uppercase tracking-[.2em] text-white backdrop-blur-md">Real reference</div>
      <div className="absolute bottom-4 left-4 right-4 rounded-[20px] border border-white/35 bg-[#5B3B34]/35 p-4 text-white backdrop-blur-xl">
        <p className="text-[8px] uppercase tracking-[.2em] text-white/75">Live selection</p>
        <p className="mt-1 font-serif text-[24px]">Tap below to define her signature.</p>
      </div>
    </div>
  </div>
}

function Choice({label,active,onClick}:{label:string;active:boolean;onClick:()=>void}){return <button onClick={onClick} className={`rounded-full border px-3 py-2 text-[9px] transition-all ${active?"border-[#7A3E48] bg-[#F1DAD6] text-[#6B3540] shadow-sm":"border-[#DCC8BD] bg-white/70 text-[#6E5750]"}`}>{label}</button>}
function Panel({title,children}:{title:string;children:React.ReactNode}){return <div className="mt-4"><p className="mb-2 text-[8px] uppercase tracking-[.22em] text-[#8C655E]">{title}</p><div className="flex flex-wrap gap-2">{children}</div></div>}
function Summary({text}:{text:string}){return <div className="mt-5 rounded-[22px] border border-[#7A3E48]/10 bg-[#F3E5DF]/80 p-4"><p className="text-[8px] uppercase tracking-[.2em] text-[#8C655E]">Selected look</p><p className="mt-1 font-serif text-[21px]">{text}</p></div>}

function HairControls({mode}:{mode:"client"|"pro"}){
  const [length,setLength]=useState("Long"),[texture,setTexture]=useState("Waves"),[part,setPart]=useState("Center"),[tone,setTone]=useState("Warm Chocolate");
  return <><Panel title="Length">{["Short","Shoulder","Mid","Long","XL"].map(x=><Choice key={x} label={x} active={length===x} onClick={()=>setLength(x)}/>)}</Panel><Panel title="Texture">{["Straight","Soft Waves","Defined Waves","Curls","Blowout"].map(x=><Choice key={x} label={x} active={texture===x} onClick={()=>setTexture(x)}/>)}</Panel><Panel title="Part">{["Left","Center","Right"].map(x=><Choice key={x} label={x} active={part===x} onClick={()=>setPart(x)}/>)}</Panel><Panel title="Tone">{["Espresso","Chocolate","Warm Chocolate","Caramel","Copper","Blonde"].map(x=><Choice key={x} label={x} active={tone===x} onClick={()=>setTone(x)}/>)}</Panel><Summary text={`${length} · ${texture} · ${part} part · ${tone}`}/>{mode==="pro"&&<p className="mt-3 text-[9px] text-[#7B625B]">Pro note: add exact formula, developer, technique and processing notes after the service.</p>}</>
}
function NailsControls({mode}:{mode:"client"|"pro"}){
  const [shape,setShape]=useState("Almond"),[len,setLen]=useState("3"),[color,setColor]=useState("Burgundy"),[finish,setFinish]=useState("Glossy");
  return <><Panel title="Shape">{["Round","Square","Oval","Almond","Coffin","Stiletto"].map(x=><Choice key={x} label={x} active={shape===x} onClick={()=>setShape(x)}/>)}</Panel><Panel title="Length">{["1","2","3","4","5"].map(x=><Choice key={x} label={x} active={len===x} onClick={()=>setLen(x)}/>)}</Panel><Panel title="Color">{["Milky Nude","Pink","Red","Burgundy","Chocolate","Black"].map(x=><Choice key={x} label={x} active={color===x} onClick={()=>setColor(x)}/>)}</Panel><Panel title="Finish">{["Glossy","Matte","French","Chrome","Natural"].map(x=><Choice key={x} label={x} active={finish===x} onClick={()=>setFinish(x)}/>)}</Panel><Summary text={`${shape} · Length ${len} · ${color} · ${finish}`}/>{mode==="pro"&&<p className="mt-3 text-[9px] text-[#7B625B]">Pro note: save product line, shade number, base/build system and refill details.</p>}</>
}
function BrowsControls({mode}:{mode:"client"|"pro"}){
  const [shape,setShape]=useState("Defined"),[thick,setThick]=useState("Medium"),[color,setColor]=useState("Dark Brown");
  return <><Panel title="Shape">{["Soft","Straight","Natural Arch","Defined","High Arch"].map(x=><Choice key={x} label={x} active={shape===x} onClick={()=>setShape(x)}/>)}</Panel><Panel title="Thickness">{["Fine","Medium","Full"].map(x=><Choice key={x} label={x} active={thick===x} onClick={()=>setThick(x)}/>)}</Panel><Panel title="Color">{["Light","Taupe","Brown","Dark Brown","Espresso","Black"].map(x=><Choice key={x} label={x} active={color===x} onClick={()=>setColor(x)}/>)}</Panel><Summary text={`${shape} · ${thick} · ${color}`}/>{mode==="pro"&&<p className="mt-3 text-[9px] text-[#7B625B]">Pro note: keep mapping, tint formula, timing and client sensitivities here.</p>}</>
}
function LashesControls({mode}:{mode:"client"|"pro"}){
  const [style,setStyle]=useState("Hybrid"),[curl,setCurl]=useState("C"),[mm,setMm]=useState("12"),[map,setMap]=useState("Cat Eye");
  return <><Panel title="Style">{["Classic","Greek","Hybrid","Mega"].map(x=><Choice key={x} label={x} active={style===x} onClick={()=>setStyle(x)}/>)}</Panel><Panel title="Curl">{["B","C","CC","D"].map(x=><Choice key={x} label={x} active={curl===x} onClick={()=>setCurl(x)}/>)}</Panel><Panel title="Length (mm)">{["8","9","10","11","12","13","14","15","16"].map(x=><Choice key={x} label={x} active={mm===x} onClick={()=>setMm(x)}/>)}</Panel><Panel title="Mapping">{["Natural","Doll","Cat Eye","Wispy"].map(x=><Choice key={x} label={x} active={map===x} onClick={()=>setMap(x)}/>)}</Panel><Summary text={`${style} · ${curl} curl · ${mm} mm · ${map}`}/>{mode==="pro"&&<p className="mt-3 text-[9px] text-[#7B625B]">Pro note: save the exact mapping by section and adhesive/retention notes.</p>}</>
}
