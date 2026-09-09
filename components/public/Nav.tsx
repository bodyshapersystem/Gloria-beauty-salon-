"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Home,
  Image as ImageIcon,
  Instagram,
  Mail,
  Menu,
  MessageCircle,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { navLinks } from "@/lib/data/site";
import { useCart } from "@/lib/cart/CartContext";

const menuIcons = [Home, Sparkles, ImageIcon, UserRound, UsersRound, ShoppingBag, Mail];

export function Nav() {
  const [open, setOpen] = useState(false);
  const publicNavLinks = navLinks.filter((link) => link.href !== "/hub-login");
  const cart = useCart();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-ivory/90 backdrop-blur-md border-b border-taupe/25">
        <nav className="max-w-[1220px] mx-auto flex items-center justify-between px-5 md:px-8 py-3 md:py-4">
          <Link href="/" aria-label="Gloria Beauty Salon — inicio"><Logo className="h-12 md:h-14 w-auto" /></Link>

          <ul className="hidden xl:flex items-center gap-5 2xl:gap-7">
            {publicNavLinks.map((link) => <li key={link.href}><Link href={link.href} className="text-[10px] font-medium uppercase tracking-[0.2em] text-mocha/75 transition-colors hover:text-espresso">{link.label}</Link></li>)}
          </ul>

          <div className="hidden xl:flex items-center gap-3">
            <Link href="/access/login" className="text-[9px] uppercase tracking-[0.16em] text-mocha hover:text-espresso">Gloria Access</Link>
            <span className="h-3 w-px bg-taupe/35"/>
            <Link href="/hub-login" className="text-[9px] uppercase tracking-[0.16em] text-[#6F3642] hover:text-espresso">Hub / Team</Link>
            <button onClick={cart.open} aria-label="Ver carrito" className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-espresso hover:bg-champagne/15">
              <ShoppingCart size={19} strokeWidth={1.5} />
              {cart.count > 0 && <span className="absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center rounded-full bg-espresso px-1 text-[8px] text-ivory">{cart.count}</span>}
            </button>
            <Button href="/reservar" variant="solid">RESERVA TU CITA</Button>
          </div>

          <div className="flex items-center gap-1 xl:hidden">
            <button onClick={cart.open} aria-label="Ver carrito" className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-espresso">
              <ShoppingCart size={22} strokeWidth={1.5} />
              {cart.count > 0 && <span className="absolute top-1 right-1 grid h-4 min-w-4 place-items-center rounded-full bg-espresso px-1 text-[8px] text-ivory">{cart.count}</span>}
            </button>
            <button aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} onClick={() => setOpen((v) => !v)} className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-espresso hover:bg-champagne/15 transition-colors">{open ? <X size={24} strokeWidth={1.5} /> : <Menu size={26} strokeWidth={1.5} />}</button>
          </div>
        </nav>
      </header>

      {open && (
        <div className="xl:hidden fixed inset-x-0 bottom-0 top-[65px] z-[100]">
          <button aria-label="Cerrar menú" onClick={() => setOpen(false)} className="absolute inset-0 bg-espresso/50 backdrop-blur-[2px]" />
          <aside className="relative h-full w-[88%] max-w-[410px] bg-ivory shadow-2xl border-r border-champagne/25 overflow-hidden">
            <div className="h-full px-4 py-3 flex flex-col">
              <div className="flex items-center justify-between gap-4 pb-2.5 border-b border-champagne/25">
                <Link href="/" onClick={() => setOpen(false)} aria-label="Gloria Beauty Salon — inicio"><Logo className="h-11 w-auto" /></Link>
                <button aria-label="Cerrar menú" onClick={() => setOpen(false)} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-taupe/30 text-espresso"><X size={21} strokeWidth={1.4} /></button>
              </div>

              <div className="mt-2 border-b border-taupe/20">
                {publicNavLinks.map((link, index) => { const Icon = menuIcons[index] ?? Sparkles; return <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="group flex items-center gap-2.5 border-b last:border-b-0 border-taupe/15 py-[7px]"><span className="inline-flex h-6 w-6 shrink-0 items-center justify-center text-mocha"><Icon size={14} strokeWidth={1.35} /></span><span className="flex-1 text-[9px] font-medium uppercase tracking-[0.2em] text-espresso">{link.label}</span><ChevronRight size={13} strokeWidth={1.35} className="text-mocha" /></Link> })}
              </div>

              <Link href="/reservar" onClick={() => setOpen(false)} className="mt-3 inline-flex min-h-[42px] items-center justify-center gap-3 rounded-[4px] bg-gradient-to-r from-mocha to-taupe px-5 text-[9px] font-semibold uppercase tracking-[0.2em] text-ivory">Reserva tu cita <ArrowRight size={14} strokeWidth={1.4} /></Link>

              <div className="mt-2.5 grid grid-cols-3 gap-2">
                <Link href="/reservar" onClick={() => setOpen(false)} className="flex min-h-[72px] flex-col justify-between rounded-lg border border-champagne/30 bg-white/45 px-2.5 py-2.5"><CalendarDays size={16} strokeWidth={1.35} className="text-mocha" /><span><span className="block font-serif text-[14px] leading-none">On Demand</span><span className="mt-1 block text-[6.5px] uppercase tracking-[0.1em] text-taupe">Reservar</span></span></Link>
                <Link href="/access/login" onClick={() => setOpen(false)} className="flex min-h-[72px] flex-col justify-between rounded-lg border border-champagne/30 bg-white/45 px-2.5 py-2.5"><UserRound size={16} strokeWidth={1.35} className="text-mocha" /><span><span className="block font-serif text-[14px] leading-none">Access</span><span className="mt-1 block text-[6.5px] uppercase tracking-[0.1em] text-taupe">Clientas</span></span></Link>
                <Link href="/hub-login" onClick={() => setOpen(false)} className="flex min-h-[72px] flex-col justify-between rounded-lg border border-[#7B3C48]/25 bg-[#6F3642] px-2.5 py-2.5 text-white"><UsersRound size={16} strokeWidth={1.35} /><span><span className="block font-serif text-[14px] leading-none">Hub</span><span className="mt-1 block text-[6.5px] uppercase tracking-[0.1em] text-white/60">Team</span></span></Link>
              </div>

              <div className="mt-auto pt-2.5 flex items-center justify-between border-t border-champagne/30">
                <p className="font-serif italic text-[12px] leading-tight text-mocha">Realza tu esencia.</p>
                <div className="flex items-center gap-2"><a href="https://wa.me/13057815456" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-champagne/50 text-mocha"><MessageCircle size={15} strokeWidth={1.35} /></a><a href="https://www.instagram.com/gloriabeautysalon_/" target="_blank" rel="noreferrer" aria-label="Instagram" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-champagne/50 text-mocha"><Instagram size={15} strokeWidth={1.35} /></a></div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
