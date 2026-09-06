"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { navLinks } from "@/lib/data/site";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-ivory/90 backdrop-blur-md border-b border-taupe/25">
      <nav className="max-w-[1220px] mx-auto flex items-center justify-between px-6 md:px-8 py-4">
        <Link href="/" aria-label="Gloria Beauty Salon — inicio">
          <Logo className="h-14 w-auto" />
        </Link>

        <ul className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="text-[13px] hover:text-mocha">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button href="/#book" variant="solid">
            RESERVA TU CITA
          </Button>
        </div>

        <button
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden text-espresso"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-t border-taupe/25 bg-ivory px-6 py-6 flex flex-col gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="text-sm"
            >
              {link.label}
            </Link>
          ))}
          <Button href="/#book" variant="solid" className="justify-center mt-2">
            RESERVA TU CITA
          </Button>
        </div>
      )}
    </header>
  );
}
