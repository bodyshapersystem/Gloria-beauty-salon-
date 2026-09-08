"use client";

import Link from "next/link";
import { Bell, ChevronRight } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

type Shortcut={label:string;href:string;icon:React.ReactNode};
type BusinessMetric={label:string;value:string};

export function GloriaDashboardCover({
  role,name,photoUrl,professionMessage,tagline,metricValue,metricLabel,metricHref,shortcuts,businessMetrics
}:{
  role:"HUB"|"TEAM"|"ACCESS"|"HUB - TEAM";
  name:string;
  photoUrl?:string|null;
  professionMessage?:string;
  tagline?:string[];
  metricValue:string;
  metricLabel:string;
  metricHref:string;
  shortcuts:Shortcut[];
  businessMetrics?:BusinessMetric[];
}){
  const greeting=timeGreeting();
  const lines=tagline?.length?tagline:["Same girls.","Higher standards."];
  const isCaro=name.trim().toLowerCase().startsWith("caro");
  return <section className="relative overflow-hidden rounded-[30px] border border-[#D8C7BA] min-h-[690px] shadow-[0_20px_55px_rgba(73,46,40,.10)] md:min-h-[610px]">
    <div className="absolute inset-0" style={{backgroundImage:heroBackground}}/>
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <span className="absolute left-[6%] top-[4%] h-[38%] w-[30%] rounded-full bg-white/55 blur-[42px]"/>
      <span className="absolute -left-[8%] top-[16%] h-[70%] w-[35%] rotate-[12deg] rounded-[52%] bg-[linear-gradient(180deg,rgba(255,255,255,.52),rgba(255,255,255,.06))] blur-[8px]"/>
      <span className="absolute left-[-4%] bottom-[-4%] h-[40%] w-[35%] bg-[radial-gradient(circle_at_center,rgba(86,98,77,.16),transparent_66%)] blur-[10px]"/>
      <span className="absolute right-[1%] top-[6%] h-[84%] w-[58%] rounded-[40%] bg-[radial-gradient(ellipse_at_center,rgba(81,47,36,.17),transparent_68%)] blur-[24px]"/>
    </div>

    {photoUrl&&<div className="absolute inset-y-0 right-0 w-[72%] md:w-[62%]">
      <img src={photoUrl} alt={name} className="h-full w-full object-cover" style={{objectPosition:isCaro?"22% 22%":"52% 22%"}}/>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#F7EEE7_0%,rgba(247,238,231,.94)_16%,rgba(247,238,231,.52)_34%,rgba(247,238,231,.08)_60%,rgba(247,238,231,0)_78%)]"/>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(77,52,42,.05),rgba(77,52,42,.18))]"/>
    </div>}

    <div className="relative z-10 flex min-h-[690px] flex-col px-5 py-5 md:min-h-[610px] md:px-9 md:py-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Logo className="h-[82px] w-auto md:h-[92px]"/>
          <div className="mt-3 h-px w-20 bg-[#9C6B5E]/35"/>
          <p className="mt-3 text-[9px] uppercase tracking-[.38em] text-[#4C2B27]">{role}</p>
        </div>
        <button aria-label="Notifications" className="grid h-10 w-10 place-items-center rounded-full border border-white/35 bg-white/20 text-white backdrop-blur-sm"><Bell size={17}/></button>
      </div>

      <div className="mt-9 max-w-[55%] md:mt-10 md:max-w-[47%]">
        <h1 className="font-serif text-[50px] leading-[.92] text-[#43201F] md:text-[70px]">{greeting},</h1>
        <p className="mt-1 font-serif text-[54px] italic leading-[.88] text-[#A95C67] md:text-[72px]">{name}</p>
        <div className="mt-7 space-y-1">{lines.map(line=><p key={line} className="text-[8px] uppercase tracking-[.31em] text-[#5A322E] md:text-[9px]">{line}</p>)}</div>
        {professionMessage&&<p className="mt-7 max-w-[220px] font-serif text-[24px] italic leading-[1.05] text-[#8E505B] md:text-[28px]">{professionMessage}</p>}
      </div>

      <div className="mt-auto">
        {businessMetrics?.length?<div className="rounded-[24px] border border-white/70 bg-[#6A493F]/60 p-4 shadow-[0_14px_34px_rgba(74,45,38,.18)] backdrop-blur-xl md:max-w-[760px]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-serif text-[26px] text-[#4A2A26]">Today&apos;s Business</h2>
            <span className="h-px flex-1 bg-[#B77B7B]/45"/>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {businessMetrics.slice(0,4).map((m,i)=><div key={m.label} className="rounded-[16px] border border-white/70 bg-white/55 px-2 py-3 text-center">
              <p className="font-serif text-[23px] leading-none text-[#512D29] md:text-[28px]">{m.value}</p>
              <p className="mt-2 text-[8px] leading-tight text-[#70584F]">{m.label}</p>
            </div>)}
          </div>
        </div>:<>
          <Link href={metricHref} className="flex max-w-[360px] items-center justify-between rounded-[22px] border border-white/75 bg-[#FCF9F5]/90 p-5 shadow-[0_12px_30px_rgba(74,45,38,.08)] backdrop-blur-md">
            <div><p className="font-serif text-[36px] leading-none text-[#5B302E]">{metricValue}</p><p className="mt-2 text-[10px] text-[#6E574F]">{metricLabel}</p></div><ChevronRight size={20} className="text-[#6B413A]"/>
          </Link>
        </>}
        <div className="mt-3 grid grid-cols-4 gap-2 rounded-[22px] border border-white/45 bg-[#6A493F]/50 p-2.5 shadow-[0_12px_30px_rgba(74,45,38,.15)] backdrop-blur-xl md:max-w-[620px] md:gap-3">
          {shortcuts.slice(0,4).map(s=><Link key={s.href+s.label} href={s.href} className="flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-[18px] border border-white/45 bg-white/16 px-2 text-white shadow-[0_10px_24px_rgba(73,46,40,.08)] backdrop-blur-md transition hover:-translate-y-0.5"><span>{s.icon}</span><span className="text-center text-[8px] leading-tight">{s.label}</span></Link>)}
        </div>
      </div>
    </div>
  </section>
}

const heroBackground="radial-gradient(circle at 12% 10%,rgba(255,255,255,.98),transparent 25%),radial-gradient(circle at 32% 42%,rgba(255,249,244,.72),transparent 35%),radial-gradient(ellipse at 82% 20%,rgba(154,100,79,.20),transparent 34%),linear-gradient(142deg,#FAF3EC 0%,#EEDFD5 42%,#D5B7A8 72%,#A27A68 100%)";
function timeGreeting(){const h=Number(new Intl.DateTimeFormat("en-US",{hour:"2-digit",hour12:false,timeZone:"America/New_York"}).format(new Date()));return h<12?"Good Morning":h<18?"Good Afternoon":"Good Evening"}
