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
    <footer
      className="relative overflow-hidden text-[#FFF6EE]"
      style={{
        background:
          "radial-gradient(ellipse at 14% 18%,rgba(255,214,190,.11),transparent 28%),radial-gradient(ellipse at 82% 4%,rgba(255,233,216,.08),transparent 24%),radial-gradient(ellipse at 92% 88%,rgba(255,190,174,.08),transparent 28%),linear-gradient(132deg,#4A0711 0%,#6B101B 31%,#4B0711 59%,#70121E 100%)",
      }}
    >
      <div className="pointer-events-none absolute -left-24 top-[-50%] h-[190%] w-[48%] rotate-[15deg] rounded-[58%] border-[18px] border-white/10 bg-white/[.025] blur-[1px]" />
      <div className="pointer-events-none absolute right-[-22%] top-[-38%] h-[190%] w-[56%] -rotate-[17deg] rounded-[58%] border-[20px] border-[#F4CDB6]/12 bg-white/[.018] blur-[1px]" />
      <div className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(112deg,transparent 0%,rgba(255,255,255,.08) 17%,transparent 29%,transparent 44%,rgba(255,216,198,.08) 47%,transparent 54%,transparent 72%,rgba(255,255,255,.05) 77%,transparent 88%)",
        }}
      />

      <div className="relative mx-auto max-w-[1220px] px-6 py-7 md:px-8 md:py-9">
        <div className="grid gap-6 md:grid-cols-[auto_1fr] md:items-center">
          <Logo className="h-[58px] w-auto md:h-[64px]" />

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-end">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[9px] text-[#FFF3E7]/78 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <span className="mx-1 hidden h-5 w-px bg-[#F0CBAA]/32 md:block" />
            <a
              href="https://www.instagram.com/gloriabeautysalon_/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram Gloria Beauty Salon"
              className="text-[#FFF0E2]/90 hover:text-white"
            >
              <Instagram size={15} />
            </a>
            <a
              href="https://www.facebook.com/iamgloriastylist"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook Gloria Beauty Salon"
              className="text-[#FFF0E2]/90 hover:text-white"
            >
              <Facebook size={15} />
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-[#F0C7A5]/22 pt-4 text-[8px] uppercase tracking-[0.07em] text-[#F6DDC9]/62 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {site.name}. Todos los derechos reservados.</span>
          <span>Miami, FL · Belleza · Bienestar · Confianza</span>
        </div>

        <div className="mt-4 flex items-center justify-center gap-4 text-[#EEC9A8]/75">
          <span className="h-px w-10 bg-[#EEC9A8]/42" />
          <p className="font-serif text-[15px] italic tracking-[0.06em] md:text-[18px]">Más que belleza es confianza</p>
          <span className="h-px w-10 bg-[#EEC9A8]/42" />
        </div>
      </div>
    </footer>
  );
}
