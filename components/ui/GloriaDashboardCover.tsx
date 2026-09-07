"use client";

import Link from "next/link";
import { Bell, ChevronRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

type Shortcut={label:string;href:string;icon:React.ReactNode};

export function GloriaDashboardCover({role,name,tagline,metricValue,metricLabel,metricHref,shortcuts}:{role:"HUB"|"TEAM"|"ACCESS";name:string;tagline:string[];metricValue:string;metricLabel:string;metricHref:string;shortcuts:Shortcut[]}){
  return <section className="relative overflow-hidden rounded-[30px] border border-[#D8C7BA] min-h-[570px] px-5 py-5 shadow-[0_20px_55px_rgba(73,46,40,.10)] md:min-h-[610px] md:px-9 md:py-7" style={{backgroundImage:creamWineBackground}}>
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="absolute -right-[17%] -top-[10%] h-[91%] w-[58%] rotate-[9deg] rounded-[58%_42%_66%_34%/42%_56%_44%_58%] bg-[linear-gradient(145deg,rgba(123,60,72,.78),rgba(87,39,48,.86)_47%,rgba(197,146,144,.52)_74%,rgba(250,242,235,.68))] shadow-[inset_28px_0_45px_rgba(255,247,240,.35),inset_-24px_-18px_45px_rgba(70,25,34,.22)]"/>
      <span className="absolute right-[6%] top-[1%] h-[86%] w-[18%] rotate-[17deg] rounded-[48%] bg-[linear-gradient(180deg,rgba(255,249,244,.56),rgba(255,249,244,.14)_44%,rgba(137,71,81,.20))] blur-[18px]"/>
      <span className="absolute right-[-8%] bottom-[-22%] h-[52%] w-[60%] rounded-[62%] bg-[radial-gradient(ellipse_at_center,rgba(102,40,50,.48),rgba(123,60,72,.20)_48%,transparent_72%)] blur-[12px]"/>
      <span className="absolute left-[34%] top-[7%] h-[34%] w-[42%] rounded-full bg-white/20 blur-[48px]"/>
      <span className="absolute left-[-7%] bottom-[-11%] h-[45%] w-[52%] rounded-[55%] bg-[#E8D4C8]/45 blur-[56px]"/>
    </div>

    <div className="relative z-10">
      <div className="relative flex justify-center">
        <div className="text-center">
          <Logo className="mx-auto h-[82px] w-auto md:h-[92px]"/>
          <p className="mt-2 text-[10px] uppercase tracking-[.38em] text-[#4C2B27]">{role}</p>
        </div>
        <button aria-label="Notifications" className="absolute right-0 top-1 grid h-10 w-10 place-items-center rounded-full border border-[#79554A]/20 bg-white/40 text-[#512D29] backdrop-blur-sm"><Bell size={17}/></button>
      </div>

      <div className="mt-10 md:mt-12">
        <h1 className="font-serif text-[54px] leading-[.88] text-[#43201F] md:text-[74px]">Hola,<br/>{name}</h1>
        <div className="mt-6 space-y-1">{tagline.map(line=><p key={line} className="text-[9px] uppercase tracking-[.36em] text-[#5A322E] md:text-[10px]">{line}</p>)}</div>
        <p className="mt-8 text-[10px] capitalize text-[#6B5149]">{todayLabel()}</p>
      </div>

      <Link href={metricHref} className="mt-5 flex max-w-[360px] items-center justify-between rounded-[22px] border border-white/75 bg-[#FCF9F5]/90 p-5 shadow-[0_12px_30px_rgba(74,45,38,.08)] backdrop-blur-md">
        <div><p className="font-serif text-[36px] leading-none text-[#5B302E]">{metricValue}</p><p className="mt-2 text-[10px] text-[#6E574F]">{metricLabel}</p></div><ChevronRight size={20} className="text-[#6B413A]"/>
      </Link>

      <div className="mt-5 grid grid-cols-4 gap-2 md:max-w-[620px] md:gap-3">
        {shortcuts.slice(0,4).map(s=><Link key={s.href+s.label} href={s.href} className="flex min-h-[103px] flex-col items-center justify-center gap-2 rounded-[20px] border border-white/75 bg-[#FCF9F5]/90 px-2 text-[#5A352E] shadow-[0_10px_24px_rgba(73,46,40,.06)] backdrop-blur-md transition hover:-translate-y-0.5"><span>{s.icon}</span><span className="text-center text-[9px] leading-tight">{s.label}</span></Link>)}
      </div>
    </div>
  </section>
}

const creamWineBackground="radial-gradient(circle at 12% 10%,rgba(255,255,255,.96),transparent 27%),radial-gradient(circle at 31% 44%,rgba(255,250,245,.70),transparent 34%),radial-gradient(ellipse at 78% 24%,rgba(151,91,96,.22),transparent 30%),linear-gradient(142deg,#F9F2EA 0%,#EEDFD5 40%,#D8BBB0 70%,#C59595 100%)";
function todayLabel(){return new Date().toLocaleDateString("es-US",{weekday:"long",day:"numeric",month:"long",timeZone:"America/New_York"})}
