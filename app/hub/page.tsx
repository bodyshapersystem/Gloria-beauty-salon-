"use client";

import Link from "next/link";
import { CalendarDays, Sparkles, UsersRound } from "lucide-react";

export default function HubHome(){
  const cards=[
    {title:"Clients",text:"Open client profiles, history and Client Memory.",href:"/hub/clients",icon:UsersRound},
    {title:"Appointments",text:"Manage upcoming visits and completion workflows.",href:"/hub/appointments",icon:CalendarDays},
    {title:"Beauty Intelligence",text:"Review suggestions, patterns and opportunities.",href:"/hub/intelligence",icon:Sparkles},
  ];
  return <div><p className="text-[9px] uppercase tracking-[0.28em] text-mocha">Gloria Hub</p><h1 className="mt-2 font-serif text-[44px] md:text-[58px] leading-none">Good to see you.</h1><p className="mt-3 max-w-[640px] text-[13px] leading-relaxed text-taupe">Client Memory, appointments and business intelligence live here. Only real salon data appears in the Hub.</p><div className="mt-9 grid gap-4 md:grid-cols-3">{cards.map(({title,text,href,icon:Icon})=><Link key={title} href={href} className="rounded-[26px] border border-champagne/30 bg-white/45 p-6 hover:bg-white/65 transition-colors"><Icon size={22} className="text-mocha"/><h2 className="mt-5 font-serif text-[31px] leading-none">{title}</h2><p className="mt-3 text-[12px] leading-relaxed text-taupe">{text}</p></Link>)}</div></div>
}
