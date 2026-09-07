"use client";

import Link from "next/link";
import { ChevronDown, MessageCircle } from "lucide-react";
import { useState } from "react";

const categories = [
  { label: "Cabello", href: "/reservar?category=hair" },
  { label: "Uñas", href: "/reservar?category=nails" },
  { label: "Cejas & Pestañas", href: "/reservar?category=brows,lashes" },
  { label: "Maquillaje & Bronceado", href: "/reservar?category=makeup,tanning" },
];

export function HomeBookingCTA(){
  const [open,setOpen]=useState(false);
  return <section className="bg-[#F8F1EA] px-4 py-10 md:px-8 md:py-16">
    <div className="mx-auto max-w-[1220px]">
      <div className="relative overflow-hidden rounded-[28px] border border-[#E2D3C7] bg-[linear-gradient(135deg,#F7ECE3,#E8D5C7)] p-6 shadow-[0_16px_40px_rgba(65,43,33,.08)] md:p-10">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border-[22px] border-white/25"/>
        <div className="relative grid gap-7 md:grid-cols-[1.1fr_.9fr] md:items-end">
          <div>
            <p className="text-[9px] uppercase tracking-[.22em] text-[#8B6757]">Gloria On Demand</p>
            <h2 className="mt-2 font-serif text-[40px] leading-[.95] text-[#2E211B] md:text-[58px]">Reserva tu cita</h2>
            <p className="mt-4 max-w-[520px] text-[12px] leading-relaxed text-[#71594C]">Elige la categoría y te llevamos directo a los servicios que corresponden.</p>

            <div className="relative mt-6 max-w-[390px]">
              <button onClick={()=>setOpen(v=>!v)} className="flex w-full items-center justify-between rounded-full bg-[#5B3526] px-5 py-4 text-left text-[10px] uppercase tracking-[.15em] text-white shadow-[0_10px_24px_rgba(66,40,28,.18)]">
                Elegir categoría <ChevronDown size={16} className={open?"rotate-180 transition":"transition"}/>
              </button>
              {open&&<div className="absolute left-0 right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-[18px] border border-[#DDCCBE] bg-[#FFF9F5] shadow-[0_18px_40px_rgba(52,38,31,.14)]">
                {categories.map((c,i)=><Link key={c.href} href={c.href} onClick={()=>setOpen(false)} className="flex items-center justify-between border-b border-[#E9DDD4] px-4 py-4 text-[12px] text-[#4A352B] last:border-b-0 hover:bg-[#F4E7DD]"><span>{c.label}</span><span className="text-[#8B6757]">→</span></Link>)}
              </div>}
            </div>
          </div>

          <a href="https://wa.me/13057815456?text=Hola%20Gloria%20Beauty%20Salon%2C%20quiero%20conversar%20sobre%20mi%20pr%C3%B3xima%20cita." target="_blank" rel="noreferrer" className="group rounded-[24px] bg-[#6F3642] p-6 text-white shadow-[0_14px_34px_rgba(111,54,66,.18)] md:p-7">
            <div className="flex items-center justify-between gap-4">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white/12"><MessageCircle size={19}/></span>
              <span className="text-[9px] uppercase tracking-[.16em] text-white/70">WhatsApp</span>
            </div>
            <p className="mt-8 font-serif text-[30px] leading-[.98] md:text-[36px]">Conversemos sobre tu cita</p>
            <p className="mt-3 text-[11px] leading-relaxed text-white/72">Si no sabes qué servicio elegir o quieres consultar algo antes, escríbenos directamente.</p>
            <span className="mt-6 inline-flex items-center gap-2 text-[9px] uppercase tracking-[.15em]">Abrir WhatsApp <span className="transition-transform group-hover:translate-x-1">→</span></span>
          </a>
        </div>
      </div>
    </div>
  </section>
}
