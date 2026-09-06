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

const menuIcons = [
  Home,
  Sparkles,
  ImageIcon,
  UserRound,
  UsersRound,
  ShoppingBag,
  Mail,
];

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
    <header className="sticky top-0 z-50 bg-ivory/90 backdrop-blur-md border-b border-taupe/25">
      <nav className="max-w-[1220px] mx-auto flex items-center justify-between px-6 md:px-8 py-4">
        <Link href="/" aria-label="Gloria Beauty Salon — inicio">
          <Logo className="h-14 w-auto" />
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

        <div className="hidden lg:block">
          <Button href="/reservar" variant="solid">
            RESERVA TU CITA
          </Button>
        </div>

        <button
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-full text-espresso hover:bg-champagne/15 transition-colors"
        >
          {open ? <X size={27} strokeWidth={1.5} /> : <Menu size={29} strokeWidth={1.5} />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden fixed inset-0 top-[89px] z-[60]">
          <button
            aria-label="Cerrar menú"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-espresso/55 backdrop-blur-[2px]"
          />

          <aside className="relative h-full w-[88%] max-w-[430px] overflow-y-auto bg-ivory shadow-2xl border-r border-champagne/25">
            <div className="min-h-full px-6 pt-7 pb-10 flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-8">
                <Link href="/" onClick={() => setOpen(false)} aria-label="Gloria Beauty Salon — inicio">
                  <Logo className="h-[86px] w-auto" />
                </Link>
                <button
                  aria-label="Cerrar menú"
                  onClick={() => setOpen(false)}
                  className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full border border-taupe/30 text-espresso hover:bg-champagne/10 transition-colors"
                >
                  <X size={24} strokeWidth={1.4} />
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-[11px] uppercase tracking-[0.34em] text-mocha">Explora</span>
                <span className="h-px flex-1 bg-champagne/70" />
              </div>

              <div className="border-y border-taupe/20">
                {navLinks.map((link, index) => {
                  const Icon = menuIcons[index] ?? Sparkles;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-center gap-4 border-b last:border-b-0 border-taupe/15 py-[14px]"
                    >
                      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center text-mocha">
                        <Icon size={22} strokeWidth={1.35} />
                      </span>
                      <span className="flex-1 font-serif text-[27px] leading-none text-espresso">
                        {link.label}
                      </span>
                      <ChevronRight
                        size={19}
                        strokeWidth={1.35}
                        className="text-mocha transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  );
                })}
              </div>

              <Link
                href="/reservar"
                onClick={() => setOpen(false)}
                className="mt-6 inline-flex min-h-[62px] items-center justify-center gap-4 rounded-[4px] bg-gradient-to-r from-mocha to-taupe px-6 text-[12px] font-semibold uppercase tracking-[0.26em] text-ivory shadow-sm"
              >
                Reserva tu cita
                <ArrowRight size={18} strokeWidth={1.4} />
              </Link>

              <section className="mt-8">
                <div className="flex items-center gap-4">
                  <span className="h-px flex-1 bg-champagne/70" />
                  <span className="text-[11px] uppercase tracking-[0.34em] text-mocha">Accesos</span>
                  <span className="h-px flex-1 bg-champagne/70" />
                </div>
                <p className="mt-3 text-center text-[9px] uppercase tracking-[0.26em] text-taupe">
                  Tu experiencia Gloria, siempre contigo
                </p>

                <div className="mt-5 space-y-3">
                  <Link
                    href="/reservar"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 rounded-xl border border-champagne/25 bg-white/45 px-4 py-4"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-champagne/50 text-mocha">
                      <CalendarDays size={22} strokeWidth={1.35} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif text-[23px] leading-none text-espresso">Gloria On Demand</span>
                      <span className="mt-1 block text-[11px] text-taupe">Reservas y citas</span>
                    </span>
                    <span className="rounded-lg bg-mocha px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-ivory">
                      Reservar
                    </span>
                  </Link>

                  <div className="flex items-center gap-4 rounded-xl border border-champagne/25 bg-white/45 px-4 py-4">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-champagne/50 text-mocha">
                      <UserRound size={22} strokeWidth={1.35} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-serif text-[23px] leading-none text-espresso">Gloria Access</span>
                      <span className="mt-1 block text-[11px] text-taupe">Portal de clienta</span>
                    </span>
                    <span className="rounded-lg border border-mocha/35 px-3 py-2 text-[9px] uppercase tracking-[0.12em] text-mocha">
                      Muy pronto
                    </span>
                  </div>
                </div>
              </section>

              <section className="mt-8">
                <div className="flex items-center gap-4">
                  <span className="h-px flex-1 bg-champagne/55" />
                  <span className="text-[9px] uppercase tracking-[0.3em] text-taupe">Conecta con nosotros</span>
                  <span className="h-px flex-1 bg-champagne/55" />
                </div>
                <div className="mt-5 flex items-center justify-center gap-8">
                  <a
                    href="https://wa.me/13057815456"
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center gap-2 text-mocha"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-champagne/60">
                      <MessageCircle size={20} strokeWidth={1.35} />
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.2em]">WhatsApp</span>
                  </a>
                  <a
                    href="https://www.instagram.com/gloriabeautysalon_/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-col items-center gap-2 text-mocha"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-champagne/60">
                      <Instagram size={20} strokeWidth={1.35} />
                    </span>
                    <span className="text-[9px] uppercase tracking-[0.2em]">Instagram</span>
                  </a>
                </div>
              </section>

              <div className="mt-auto pt-10 text-center">
                <p className="font-serif italic text-[18px] leading-snug text-mocha">
                  Realza tu esencia,
                  <br />
                  define tu estilo.
                </p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.36em] text-taupe">Miami</p>
              </div>
            </div>
          </aside>
        </div>
      )}
    </header>
  );
}
