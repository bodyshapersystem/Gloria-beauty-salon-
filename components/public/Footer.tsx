import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { navLinks, site } from "@/lib/data/site";

export function Footer() {
  return (
    <footer className="border-t border-taupe/35 px-6 md:px-8 pt-14 pb-12">
      <div className="max-w-[1220px] mx-auto flex flex-wrap justify-between gap-10">
        <Logo className="h-[74px] w-auto" />

        <ul className="flex flex-wrap gap-7 text-[13px]">
          {navLinks.slice(0, 5).map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>

        <div className="text-[11px] tracking-[0.14em] text-taupe text-right">
          REALZA TU ESENCIA,
          <br />
          DEFINE TU ESTILO.
        </div>
      </div>

      <div className="max-w-[1220px] mx-auto mt-10 pt-6 border-t border-taupe/20 text-[11px] text-taupe flex flex-wrap justify-between gap-2.5">
        <span>&copy; {new Date().getFullYear()} {site.name}. Todos los derechos reservados.</span>
        <span>CALLE 8 · MIAMI, FL</span>
      </div>
    </footer>
  );
}
