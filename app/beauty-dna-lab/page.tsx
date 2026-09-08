"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Heart, Sparkles, Wand2 } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

type Category="hair"|"nails"|"brows"|"lashes";

const tabs:[Category,string][]=[
  ["hair","Hair"],["nails","Nails"],["brows","Brows"],["lashes","Lashes"]
];

export default function BeautyDnaLab(){
  const [cat,setCat]=useState<Category>("hair");
  const [mode,setMode]=useState<"client"|"pro">("client");

  return <main className="min-h-screen bg-[#F6EFE9] text-[#4A2927]">
    <div className="mx-auto max-w-[430px] min-h-screen bg-[radial-gradient(circle_at_80%_5%,rgba(125,73,73,.15),transparent_26%),linear-gradient(180deg,#FBF7F2,#F2E5DD)] shadow-2xl">
      <header className="sticky top-0 z-40 border-b border-white/70 bg-[#F8F1EB]/90 px-5 pb-3 pt-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <Logo className="h-[52px] w-auto"/>
          <div className="rounded-full border border-[#8F5E58]/20 bg-white/55 p-1 text-[9px] uppercase tracking-[.14em]">
            <button onClick={()=>setMode("client")} className={`rounded-full px-3 py-2 ${mode==="client"?"bg-[#7A3E48] text-white":""}`}>Client</button>
            <button onClick={()=>setMode("pro")} className={`rounded-full px-3 py-2 ${mode==="pro"?"bg-[#7A3E48] text-white":""}`}>Pro</button>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-[9px] uppercase tracking-[.28em] text-[#8C655E]">Emmy's Beauty DNA</p>
          <h1 className="mt-1 font-serif text-[34px] leading-none">Your look, remembered.</h1>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {tabs.map(([id,label])=><button key={id} onClick={()=>setCat(id)} className={`rounded-2xl border px-2 py-3 text-[10px] transition ${cat===id?"border-[#7A3E48] bg-[#7A3E48] text-white shadow-lg":"border-white/80 bg-white/55"}`}>{label}</button>)}
        </div>
      </header>

      <section className="px-4 pb-28 pt-4">
        <div className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/45 shadow-[0_18px_55px_rgba(74,41,39,.12)] backdrop-blur-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(131,76,72,.15),transparent_30%),radial-gradient(circle_at_18%_88%,rgba(239,214,203,.7),transparent_28%)]"/>
          <div className="relative p-5">
            <div className="flex items-center justify-between">
              <div><p className="text-[8px] uppercase tracking-[.24em] text-[#8C655E]">{mode==="client"?"My Preference":"Live Beauty Canvas"}</p><h2 className="mt-1 font-serif text-[30px]">{tabs.find(t=>t[0]===cat)?.[1]}</h2></div>
              <button className="grid h-10 w-10 place-items-center rounded-full border border-white/70 bg-white/55"><Heart size={18}/></button>
            </div>
            <div className="mt-4 min-h-[380px]">
              {cat==="hair"&&<HairConfigurator mode={mode}/>}
              {cat==="nails"&&<NailsConfigurator mode={mode}/>}
              {cat==="brows"&&<BrowsConfigurator mode={mode}/>}
              {cat==="lashes"&&<LashesConfigurator mode={mode}/>}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[26px] border border-white/80 bg-[#6E4A40]/88 p-4 text-[#FFF9F4] shadow-xl backdrop-blur-xl">
          <div className="flex items-center gap-2"><Sparkles size={16}/><p className="text-[9px] uppercase tracking-[.22em]">Beauty Memory</p></div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-2xl bg-white/10 p-3"><p className="font-serif text-[18px]">Preference</p><p className="mt-1 text-[8px] text-white/75">Client selected</p></div>
            <div className="rounded-2xl bg-white/10 p-3"><p className="font-serif text-[18px]">Last Look</p><p className="mt-1 text-[8px] text-white/75">Jul 15, 2026</p></div>
            <div className="rounded-2xl bg-white/10 p-3"><p className="font-serif text-[18px]">Pro Default</p><p className="mt-1 text-[8px] text-white/75">Saved by Gloria</p></div>
          </div>
        </div>

        {mode==="pro"&&<div className="mt-4 rounded-[26px] border border-[#8A5D55]/15 bg-white/65 p-4 shadow-sm">
          <div className="flex items-center gap-2"><Wand2 size={16}/><p className="font-serif text-[22px]">What we did today</p></div>
          <p className="mt-2 text-[10px] leading-relaxed text-[#7B625B]">Use the same visual controls above, then save the result as the latest service or professional default.</p>
          <div className="mt-4 grid grid-cols-2 gap-2"><button className="rounded-full border border-[#7A3E48]/25 bg-white px-4 py-3 text-[9px] uppercase tracking-[.12em]">Save latest</button><button className="rounded-full bg-[#7A3E48] px-4 py-3 text-[9px] uppercase tracking-[.12em] text-white">Set Pro Default</button></div>
        </div>}
      </section>
    </div>
  </main>
}

function Choice({label,active,onClick}:{label:string;active:boolean;onClick:()=>void}){return <button onClick={onClick} className={`rounded-full border px-3 py-2 text-[9px] transition ${active?"border-[#7A3E48] bg-[#F1DAD6] text-[#6B3540] shadow-sm":"border-[#DCC8BD] bg-white/70 text-[#6E5750]"}`}>{label}</button>}

function HairConfigurator({mode}:{mode:"client"|"pro"}){
  const [length,setLength]=useState("Long"),[texture,setTexture]=useState("Waves"),[part,setPart]=useState("Center"),[color,setColor]=useState("#6A4033");
  const scale=length==="Short"?0.72:length==="Mid"?0.88:length==="XL"?1.14:1;
  const wave=texture==="Straight"?0:texture==="Soft Waves"?7:texture==="Waves"?14:22;
  return <div>
    <div className="relative mx-auto h-[250px] w-[230px]">
      <div className="absolute left-1/2 top-3 h-[86px] w-[86px] -translate-x-1/2 rounded-[46%_46%_44%_44%] bg-[#D9AA91] shadow-inner"/>
      <div className="absolute left-1/2 top-[42px] h-[190px] w-[190px] -translate-x-1/2 origin-top rounded-[46%_46%_35%_35%] transition-all duration-500" style={{background:color,transform:`translateX(-50%) scaleY(${scale})`,clipPath:"polygon(8% 0,92% 0,100% 18%,91% 100%,70% 83%,50% 100%,30% 83%,9% 100%,0 18%)"}}/>
      <div className="absolute left-1/2 top-[55px] h-[170px] w-[150px] -translate-x-1/2 opacity-35" style={{background:`repeating-radial-gradient(ellipse at 50% 0, transparent 0 ${18-wave/2}px, rgba(255,255,255,.8) ${19-wave/2}px ${20+wave/2}px)`}}/>
      <div className="absolute left-1/2 top-[58px] h-[70px] w-[70px] -translate-x-1/2 rounded-full bg-[#D9AA91]"/>
      <div className="absolute left-1/2 top-[57px] h-[3px] w-[74px] -translate-x-1/2 bg-[#5A342B]" style={{transform:`translateX(-50%) rotate(${part==="Left"?-12:part==="Right"?12:0}deg)`}}/>
    </div>
    <Panel title="Length">{["Short","Mid","Long","XL"].map(x=><Choice key={x} label={x} active={length===x} onClick={()=>setLength(x)}/>)}</Panel>
    <Panel title="Texture">{["Straight","Soft Waves","Waves","Curls"].map(x=><Choice key={x} label={x} active={texture===x} onClick={()=>setTexture(x)}/>)}</Panel>
    <Panel title="Part">{["Left","Center","Right"].map(x=><Choice key={x} label={x} active={part===x} onClick={()=>setPart(x)}/>)}</Panel>
    <Panel title="Color"><div className="flex gap-2">{["#2D201C","#4B3029","#6A4033","#9B6041","#B46C53","#B79A73"].map(c=><button key={c} onClick={()=>setColor(c)} className={`h-8 w-8 rounded-full border-2 ${color===c?"border-[#7A3E48] scale-110":"border-white"}`} style={{background:c}}/>)}</div></Panel>
    {mode==="pro"&&<p className="mt-3 rounded-2xl bg-[#F3E5DF] px-3 py-2 text-[9px]">Formula note: 6N + 6.3 · 20 vol · warm finish</p>}
  </div>
}

function NailsConfigurator({mode}:{mode:"client"|"pro"}){
  const [shape,setShape]=useState("Almond"),[len,setLen]=useState(3),[color,setColor]=useState("#8E3042"),[finish,setFinish]=useState("Glossy");
  return <div>
    <div className="mx-auto flex h-[245px] w-[250px] items-end justify-center gap-2 rounded-[44%_44%_18%_18%] bg-[#E2B59C] px-6 pb-8 shadow-inner">
      {[0,1,2,3,4].map(i=><div key={i} className="relative h-[125px] w-[34px] rounded-[18px] bg-[#D8A98E]"><div className="absolute left-1/2 top-1 -translate-x-1/2 transition-all duration-300" style={{height:42+len*6,width:24,background:color,borderRadius:shape==="Square"?"7px":shape==="Coffin"?"12px 12px 5px 5px":shape==="Almond"?"50% 50% 38% 38%":"45%",boxShadow:finish==="Chrome"?"inset 0 0 12px rgba(255,255,255,.8)":"inset 0 0 4px rgba(255,255,255,.35)"}}/></div>)}
    </div>
    <Panel title="Shape">{["Round","Square","Oval","Almond","Coffin"].map(x=><Choice key={x} label={x} active={shape===x} onClick={()=>setShape(x)}/>)}</Panel>
    <Panel title="Length">{[1,2,3,4,5].map(x=><Choice key={x} label={String(x)} active={len===x} onClick={()=>setLen(x)}/>)}</Panel>
    <Panel title="Color"><div className="flex gap-2">{["#E7C6BD","#D69A98","#B86B73","#8E3042","#5C232D","#ECE5DB"].map(c=><button key={c} onClick={()=>setColor(c)} className={`h-8 w-8 rounded-full border-2 ${color===c?"border-[#7A3E48] scale-110":"border-white"}`} style={{background:c}}/>)}</div></Panel>
    <Panel title="Finish">{["Glossy","Matte","French","Chrome"].map(x=><Choice key={x} label={x} active={finish===x} onClick={()=>setFinish(x)}/>)}</Panel>
    {mode==="pro"&&<p className="mt-3 rounded-2xl bg-[#F3E5DF] px-3 py-2 text-[9px]">Last service: Short almond · milky nude · gel</p>}
  </div>
}

function BrowsConfigurator({mode}:{mode:"client"|"pro"}){
  const [shape,setShape]=useState("Defined"),[thick,setThick]=useState("Medium"),[color,setColor]=useState("#5B392F");
  const rot=shape==="Straight"?0:shape==="Soft"?-2:shape==="High Arch"?-10:-6;
  const h=thick==="Fine"?7:thick==="Full"?15:11;
  return <div>
    <div className="relative mx-auto mt-6 h-[220px] w-[280px] rounded-[48%] bg-[#D9AA91] shadow-inner">
      {[78,178].map((x,i)=><div key={x} className="absolute top-[92px] h-[44px] w-[66px] rounded-[50%] border-[3px] border-[#4E332E] bg-white" style={{left:x-34}}><div className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5B3E31]"/></div>)}
      {[78,178].map(x=><div key={x} className="absolute top-[64px] w-[72px] origin-center rounded-full transition-all duration-300" style={{left:x-36,height:h,background:color,transform:`rotate(${rot}deg)`}}/>)}
    </div>
    <Panel title="Shape">{["Soft","Straight","Defined","High Arch"].map(x=><Choice key={x} label={x} active={shape===x} onClick={()=>setShape(x)}/>)}</Panel>
    <Panel title="Thickness">{["Fine","Medium","Full"].map(x=><Choice key={x} label={x} active={thick===x} onClick={()=>setThick(x)}/>)}</Panel>
    <Panel title="Color"><div className="flex gap-2">{["#B98E70","#8A5F46","#5B392F","#3A2621","#211716"].map(c=><button key={c} onClick={()=>setColor(c)} className={`h-8 w-8 rounded-full border-2 ${color===c?"border-[#7A3E48] scale-110":"border-white"}`} style={{background:c}}/>)}</div></Panel>
    {mode==="pro"&&<p className="mt-3 rounded-2xl bg-[#F3E5DF] px-3 py-2 text-[9px]">Professional note: keep front soft, define tail only.</p>}
  </div>
}

function LashesConfigurator({mode}:{mode:"client"|"pro"}){
  const [style,setStyle]=useState("Hybrid"),[curl,setCurl]=useState("C"),[mm,setMm]=useState(12),[map,setMap]=useState("Cat Eye");
  const count=style==="Classic"?9:style==="Hybrid"?14:style==="Mega"?22:12;
  return <div>
    <div className="relative mx-auto mt-6 h-[220px] w-[290px] rounded-[48%] bg-[#D9AA91] shadow-inner">
      <div className="absolute left-1/2 top-[92px] h-[58px] w-[150px] -translate-x-1/2 rounded-[50%] border-[3px] border-[#4E332E] bg-white"><div className="absolute left-1/2 top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#5B3E31]"/></div>
      <div className="absolute left-1/2 top-[77px] flex w-[155px] -translate-x-1/2 justify-between">
        {Array.from({length:count}).map((_,i)=>{const bias=map==="Cat Eye"?i/(count-1):map==="Doll"?1-Math.abs((i-(count-1)/2)/((count-1)/2)):0.7;const h=18+(mm-8)*2+bias*12;return <span key={i} className="block w-[1.5px] origin-bottom bg-[#2B201D]" style={{height:h,transform:`rotate(${-38+i*(76/(count-1))}deg) translateY(-2px)`,borderRadius:curl==="D"?"50% 50% 0 0":"0"}}/>})}
      </div>
    </div>
    <Panel title="Style">{["Classic","Greek","Hybrid","Mega"].map(x=><Choice key={x} label={x} active={style===x} onClick={()=>setStyle(x)}/>)}</Panel>
    <Panel title="Curl">{["B","C","CC","D"].map(x=><Choice key={x} label={x} active={curl===x} onClick={()=>setCurl(x)}/>)}</Panel>
    <Panel title="Length (mm)">{[8,9,10,11,12,13,14,15,16].map(x=><Choice key={x} label={String(x)} active={mm===x} onClick={()=>setMm(x)}/>)}</Panel>
    <Panel title="Mapping">{["Natural","Doll","Cat Eye","Wispy"].map(x=><Choice key={x} label={x} active={map===x} onClick={()=>setMap(x)}/>)}</Panel>
    {mode==="pro"&&<p className="mt-3 rounded-2xl bg-[#F3E5DF] px-3 py-2 text-[9px]">Current map: {style} · {curl} curl · {mm} mm · {map}</p>}
  </div>
}

function Panel({title,children}:{title:string;children:React.ReactNode}){return <div className="mt-4"><p className="mb-2 text-[8px] uppercase tracking-[.22em] text-[#8C655E]">{title}</p><div className="flex flex-wrap gap-2">{children}</div></div>}
