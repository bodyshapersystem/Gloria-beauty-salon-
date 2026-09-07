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
      className="relative overflow-hidden text-[#FFF7EF]"
      style={{
        background:
          "radial-gradient(circle at 8% 12%,rgba(255,224,194,.13),transparent 24%),radial-gradient(circle at 88% 18%,rgba(255,222,210,.10),transparent 20%),linear-gradient(135deg,#4A0710 0%,#6B101B 34%,#3D0710 68%,#5A0D16 100%)",
      }}
    >
      <div className="pointer-events-none absolute -left-24 top-[-45%] h-[190%] w-[55%] rotate-[13deg] rounded-[55%] border-[18px] border-white/8 bg-white/[.025] blur-[1px]" />
      <div className="pointer-events-none absolute right-[-18%] top-[-25%] h-[150%] w-[54%] -rotate-[16deg] rounded-[60%] border-[20px] border-[#F3C6B0]/10 bg-white/[.02] blur-[1px]" />
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(110deg,transparent_0%,rgba(255,255,255,.08)_22%,transparent_40%,rgba(255,255,255,.04)_61%,transparent_78%)]" />

      <div className="relative mx-auto max-w-[1220px] px-6 py-8 md:px-8 md:py-10">
        <div className="grid gap-7 md:grid-cols-[auto_1fr_auto] md:items-center">
          <div>
            <Logo className="h-[58px] w-auto" />
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:justify-center">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[9px] text-[#F8EBDD]/80 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <span className="mx-1 hidden h-5 w-px bg-[#EBC8A6]/30 md:block" />
            <a
              href="https://www.instagram.com/gloriabeautysalon_/"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram Gloria Beauty Salon"
              className="text-[#F9E8D8]/90 hover:text-white"
            >
              <Instagram size={15} />
            </a>
            <a
              href="https://www.facebook.com/iamgloriastylist"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook Gloria Beauty Salon"
              className="text-[#F9E8D8]/90 hover:text-white"
            >
              <Facebook size={15} />
            </a>
          </div>

          <div className="border-l border-[#E7C29E]/30 pl-5 font-serif text-[15px] leading-[1.25] text-[#F0D7BE] md:text-right">
            Realza tu esencia.
            <br />
            Define tu estilo.
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-2 border-t border-[#E8C29F]/20 pt-5 text-[8px] uppercase tracking-[0.08em] text-[#F2DCC9]/55 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {site.name}. Todos los derechos reservados.</span>
          <span>Miami, FL · Belleza · Bienestar · Confianza</span>
        </div>

        <div className="mt-5 flex items-center justify-center gap-4 text-[#E7C3A4]/70">
          <span className="h-px w-10 bg-[#E7C3A4]/35" />
          <p className="font-serif text-[15px] italic tracking-[0.06em] md:text-[18px]">Más que belleza es confianza</p>
          <span className="h-px w-10 bg-[#E7C3A4]/35" />
        </div>
      </div>
    </footer>
  );
}
