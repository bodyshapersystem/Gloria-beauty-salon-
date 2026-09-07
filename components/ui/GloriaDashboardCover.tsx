"use client";

import Link from "next/link";
import { Bell, ChevronRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { gloriaCreamDashboardArt } from "@/lib/ui/gloriaArt";

type Shortcut={label:string;href:string;icon:React.ReactNode};

export function GloriaDashboardCover({role,name,tagline,metricValue,metricLabel,metricHref,shortcuts}:{role:"HUB"|"TEAM"|"ACCESS";name:string;tagline:string[];metricValue:string;metricLabel:string;metricHref:string;shortcuts:Shortcut[]}){
  return <section className="relative overflow-hidden rounded-[30px] border border-[#D8C7BA] min-h-[570px] px-5 py-5 shadow-[0_20px_55px_rgba(73,46,40,.10)] md:min-h-[610px] md:px-9 md:py-7" style={{backgroundImage:`url("${gloriaCreamDashboardArt}")`,backgroundSize:"cover",backgroundPosition:"center"}}>
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(250,246,240,.20),rgba(250,246,240,.03))]"/>
    <div className="relative z-10">
      <div className="relative flex justify-center">
        <div className="text-center"><Logo className="mx-auto h-[82px] w-auto md:h-[92px]"/><p className="-mt-2 text-[10px] uppercase tracking-[.38em] text-[#4C2B27]">{role}</p></div>
        <button aria-label="Notifications" className="absolute right-0 top-1 grid h-10 w-10 place-items-center rounded-full border border-[#79554A]/20 bg-white/40 text-[#512D29] backdrop-blur-sm"><Bell size={17}/></button>
      </div>

      <div className="mt-12 md:mt-14">
        <h1 className="font-serif text-[54px] leading-[.88] text-[#43201F] md:text-[74px]">Hola,<br/>{name}</h1>
        <div className="mt-6 space-y-1">{tagline.map(line=><p key={line} className="text-[9px] uppercase tracking-[.36em] text-[#5A322E] md:text-[10px]">{line}</p>)}</div>
        <p className="mt-8 text-[10px] capitalize text-[#6B5149]">{todayLabel()}</p>
      </div>

      <Link href={metricHref} className="mt-5 flex max-w-[360px] items-center justify-between rounded-[22px] border border-white/70 bg-[#FCF9F5]/88 p-5 shadow-[0_12px_30px_rgba(74,45,38,.08)] backdrop-blur-sm">
        <div><p className="font-serif text-[36px] leading-none text-[#5B302E]">{metricValue}</p><p className="mt-2 text-[10px] text-[#6E574F]">{metricLabel}</p></div><ChevronRight size={20} className="text-[#6B413A]"/>
      </Link>

      <div className="mt-5 grid grid-cols-4 gap-2 md:max-w-[620px] md:gap-3">
        {shortcuts.slice(0,4).map(s=><Link key={s.href+s.label} href={s.href} className="flex min-h-[103px] flex-col items-center justify-center gap-2 rounded-[20px] border border-white/70 bg-[#FCF9F5]/88 px-2 text-[#5A352E] shadow-[0_10px_24px_rgba(73,46,40,.06)] backdrop-blur-sm transition hover:-translate-y-0.5"><span>{s.icon}</span><span className="text-center text-[9px] leading-tight">{s.label}</span></Link>)}
      </div>
    </div>
  </section>
}

function todayLabel(){return new Date().toLocaleDateString("es-US",{weekday:"long",day:"numeric",month:"long",timeZone:"America/New_York"})}
