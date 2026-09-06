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
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { navLinks } from "@/lib/data/site";

const menuIcons = [Home, Sparkles, ImageIcon, UserRound, UsersRound, ShoppingBag, Mail];

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-ivory/90 backdrop-blur-md border-b border-taupe/25">
        <nav className="max-w-[1220px] mx-auto flex items-center justify-between px-5 md:px-8 py-3 md:py-4">
          <Link href="/" aria-label="Gloria Beauty Salon — inicio">
            <Logo className="h-12 md:h-14 w-auto" />
          </Link>

          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-[13px] hover:text-mocha transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-5">
            <Link href="/access/login" className="text-[10px] uppercase tracking-[0.16em] text-mocha hover:text-espresso">
              Login / Access
            </Link>
            <Button href="/reservar" variant="solid">RESERVA TU CITA</Button>
          </div>

          <button
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-espresso hover:bg-champagne/15 transition-colors"
          >
            {open ? <X size={25} strokeWidth={1.5} /> : <Menu size={27} strokeWidth={1.5} />}
          </button>
        </nav>
      </header>

      {open && (
        <div className="lg:hidden fixed inset-x-0 bottom-0 top-[73px] z-[100]">
          <button aria-label="Cerrar menú" onClick={() => setOpen(false)} className="absolute inset-0 bg-espresso/50 backdrop-blur-[2px]" />

          <aside className="relative h-full w-[88%] max-w-[410px] bg-ivory shadow-2xl border-r border-champagne/25 overflow-hidden">
            <div className="h-full px-5 py-4 flex flex-col">
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-champagne/25">
                <Link href="/" onClick={() => setOpen(false)} aria-label="Gloria Beauty Salon — inicio">
                  <Logo className="h-14 w-auto" />
                </Link>
                <button
                  aria-label="Cerrar menú"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-taupe/30 text-espresso"
                >
                  <X size={21} strokeWidth={1.4} />
                </button>
              </div>

              <div className="mt-2 border-b border-taupe/20">
                {navLinks.map((link, index) => {
                  const Icon = menuIcons[index] ?? Sparkles;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-center gap-3 border-b last:border-b-0 border-taupe/15 py-[8px]"
                    >
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center text-mocha">
                        <Icon size={17} strokeWidth={1.35} />
                      </span>
                      <span className="flex-1 font-serif text-[21px] leading-none text-espresso">{link.label}</span>
                      <ChevronRight size={15} strokeWidth={1.35} className="text-mocha" />
                    </Link>
                  );
                })}
              </div>

              <Link
                href="/reservar"
                onClick={() => setOpen(false)}
                className="mt-3 inline-flex min-h-[48px] items-center justify-center gap-3 rounded-[4px] bg-gradient-to-r from-mocha to-taupe px-5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ivory"
              >
                Reserva tu cita <ArrowRight size={15} strokeWidth={1.4} />
              </Link>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <Link
                  href="/reservar"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-champagne/30 bg-white/45 px-3 py-3"
                >
                  <CalendarDays size={18} strokeWidth={1.35} className="text-mocha shrink-0" />
                  <span className="min-w-0">
                    <span className="block font-serif text-[17px] leading-none">On Demand</span>
                    <span className="mt-1 block text-[8px] uppercase tracking-[0.1em] text-taupe">Reservar</span>
                  </span>
                </Link>

                <Link
                  href="/access/login"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-xl border border-champagne/30 bg-white/45 px-3 py-3"
                >
                  <UserRound size={18} strokeWidth={1.35} className="text-mocha shrink-0" />
                  <span className="min-w-0">
                    <span className="block font-serif text-[17px] leading-none">Gloria Access</span>
                    <span className="mt-1 block text-[8px] uppercase tracking-[0.1em] text-taupe">Iniciar sesión</span>
                  </span>
                </Link>
              </div>

              <div className="mt-auto pt-3 flex items-center justify-between border-t border-champagne/30">
                <p className="font-serif italic text-[14px] leading-tight text-mocha">Realza tu esencia, define tu estilo.</p>
                <div className="flex items-center gap-2">
                  <a href="https://wa.me/13057815456" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-champagne/50 text-mocha">
                    <MessageCircle size={15} strokeWidth={1.35} />
                  </a>
                  <a href="https://www.instagram.com/gloriabeautysalon_/" target="_blank" rel="noreferrer" aria-label="Instagram" className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-champagne/50 text-mocha">
                    <Instagram size={15} strokeWidth={1.35} />
                  </a>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
