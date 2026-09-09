import type { Metadata } from "next";
import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Check, Sparkles } from "lucide-react";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Memberships de belleza en Miami",
  description:
    "Planes prepagados de Gloria Beauty Salon para mantener tu rutina de blowouts y servicios de belleza en Calle 8, Miami.",
  path: "/memberships",
  keywords: ["beauty memberships Miami", "blowout membership Miami", "planes belleza Miami"],
});

export default function MembershipsPage(){
  return <><Nav/><main className="max-w-[1120px] mx-auto px-6 md:px-8 pt-20 md:pt-28 pb-24"><section className="text-center"><Eyebrow>GLORIA MEMBERSHIPS</Eyebrow><h1 className="mt-3 font-serif text-[clamp(44px,7vw,78px)] leading-[.92]">Your beauty routine,<br/><em className="italic text-mocha">already taken care of.</em></h1><p className="mx-auto mt-6 max-w-[560px] text-[14px] leading-relaxed text-taupe">Planes prepagados para las visitas que ya sabes que quieres mantener. Un solo pago, tus servicios listos para usar durante el mes.</p></section>
  <section className="mt-14 grid gap-5 md:grid-cols-2"><article className="relative overflow-hidden rounded-[28px] bg-[#6F3642] p-7 md:p-9 text-white shadow-[0_18px_50px_rgba(82,42,47,.14)]"><div className="absolute -right-14 -top-12 h-52 w-52 rounded-full bg-white/10 blur-3xl"/><div className="relative"><div className="flex items-center gap-2 text-[#EFD6D1]"><Sparkles size={15}/><p className="text-[9px] uppercase tracking-[.2em]">Monthly Blowout Edit</p></div><h2 className="mt-4 font-serif text-[42px] leading-none">4 secados<br/><em className="italic">al mes</em></h2><p className="mt-5 max-w-[370px] text-[12px] leading-relaxed text-white/70">Un secado por semana para mantener tu look siempre fresh. Se compra una sola vez y tienes cuatro visitas disponibles durante el mes.</p><div className="mt-6 space-y-3 text-[11px] text-white/85"><Benefit text="4 blowouts / secados"/><Benefit text="One-time payment"/><Benefit text="Uso durante el mes de compra"/><Benefit text="Reserva según disponibilidad"/></div><button disabled className="mt-8 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-[9px] uppercase tracking-[.16em] text-white/70">Pago online · próximamente</button><p className="mt-3 text-[9px] text-white/45">Stripe se conectará en la siguiente fase.</p></div></article>
  <article className="rounded-[28px] border border-[#DDD0C6] bg-[#F8F1EA] p-7 md:p-9"><p className="text-[9px] uppercase tracking-[.2em] text-mocha">Coming next</p><h2 className="mt-4 font-serif text-[37px] leading-none">Más rutinas<br/><em className="italic text-[#7B3C48]">en camino.</em></h2><p className="mt-5 text-[12px] leading-relaxed text-taupe">Esta sección queda preparada para agregar nuevos planes prepagados según lo que más repitan las clientas: nails, brows, glow, tratamientos o combinaciones especiales.</p><div className="mt-7 rounded-[18px] border border-[#DFCFC3] bg-white/60 p-5"><p className="text-[10px] font-medium text-mocha">One payment. Multiple visits. No subscription headache.</p></div></article></section></main><Footer/></>
}

function Benefit({text}:{text:string}){return <div className="flex items-center gap-2"><span className="grid h-5 w-5 place-items-center rounded-full bg-white/10"><Check size={11}/></span><span>{text}</span></div>}
