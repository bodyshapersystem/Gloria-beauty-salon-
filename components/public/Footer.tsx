import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { site } from "@/lib/data/site";

const footerLinks = [
  { label: "Inicio", href: "/" },
  { label: "Servicios", href: "/servicios" },
  { label: "Galería", href: "/galeria" },
  { label: "Sobre Gloria", href: "/#sobre" },
  { label: "Equipo", href: "/equipo" },
  { label: "Contacto", href: "/#contacto" },
];

export function Footer() {
  return (
    <footer className="bg-[#2F211A] text-[#F8F3EC]">
      <div className="mx-auto max-w-[1220px] px-6 py-8 md:px-8 md:py-10">
        <div className="grid gap-7 md:grid-cols-[auto_1fr_auto] md:items-center">
          <div>
            <Logo className="h-[54px] w-auto brightness-[4] grayscale" />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-center">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[9px] text-ivory/75 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <span className="mx-1 hidden h-5 w-px bg-white/20 md:block" />
            <a
              href="https://www.instagram.com/gloriabeautysalon_/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram Gloria Beauty Salon"
              className="text-ivory/80 hover:text-white"
            >
              <Instagram size={15} />
            </a>
            <a
              href="https://www.facebook.com/iamgloriastylist"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook Gloria Beauty Salon"
              className="text-ivory/80 hover:text-white"
            >
              <Facebook size={15} />
            </a>
          </div>

          <div className="border-l border-white/20 pl-5 font-serif text-[15px] leading-[1.25] text-[#E7D5C7] md:text-right">
            Realza tu esencia.
            <br />
            Define tu estilo.
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-2 border-t border-white/10 pt-5 text-[8px] uppercase tracking-[0.08em] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {site.name}. Todos los derechos reservados.</span>
          <span>Miami, FL · Belleza · Bienestar · Confianza</span>
        </div>
      </div>
    </footer>
  );
}
