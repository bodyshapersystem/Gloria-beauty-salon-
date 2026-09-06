import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

type Row = {
  index: string;
  title: string;
  subcopy: string;
  photo: string;
  href: string;
};

const rows: Row[] = [
  {
    index: "01",
    title: "HAIR",
    subcopy: "Cortes · Color · Balayage · Blowdry · Tratamientos",
    photo: "/images/gloria/hair/hair-01.jpg",
    href: "/servicios#hair",
  },
  {
    index: "02",
    title: "NAILS",
    subcopy: "Manicure · Pedicure · Gel · Polygel",
    photo: "/images/gloria/nails/nails-01.jpg",
    href: "/servicios#nails",
  },
  {
    index: "03",
    title: "BROWS + LASHES",
    subcopy: "Diseño de cejas · Henna · Clásicas · Híbridas · Mega Volumen",
    photo: "/images/gloria/lashes/lashes-01.jpg",
    href: "/servicios#brows",
  },
  {
    index: "04",
    title: "TANNING + MAKEUP",
    subcopy: "Spray Tan · Maquillaje profesional",
    photo: "/images/gloria/tanning/tanning-01.jpg",
    href: "/servicios#tanning",
  },
];

export function ServicesStrip() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-[1220px] mx-auto px-6 md:px-8 mb-9 md:mb-12">
        <Eyebrow>NUESTROS SERVICIOS</Eyebrow>
        <h2 className="font-serif font-medium text-[clamp(32px,5vw,58px)] leading-[1.04]">
          Resultados
          <br />
          en cada detalle.
        </h2>
      </div>

      <div className="flex flex-col">
        {rows.map((row) => (
          <Link
            href={row.href}
            key={row.index}
            className="group relative flex items-end aspect-[16/7] md:aspect-[16/4.2] overflow-hidden border-t border-taupe/25 last:border-b"
          >
            <Image
              src={row.photo}
              alt={row.title}
              fill
              className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.04]"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgba(46,39,36,0.55) 0%, rgba(46,39,36,0.15) 42%, rgba(46,39,36,0) 62%)",
              }}
            />
            <div className="relative z-10 px-6 md:px-12 py-6 md:py-9">
              <span className="block text-[11px] tracking-[0.16em] text-champagne mb-1.5">
                {row.index}
              </span>
              <h3 className="font-serif font-medium text-ivory leading-none text-[clamp(30px,5.6vw,64px)]">
                {row.title}
              </h3>
              <p className="mt-2.5 text-[12px] md:text-[13px] text-blush tracking-[0.02em]">
                {row.subcopy}
              </p>
            </div>
            <div className="relative z-10 ml-auto mr-6 md:mr-12 mb-6 md:mb-9 w-11 h-11 md:w-12 md:h-12 rounded-full border border-ivory/70 flex items-center justify-center text-ivory shrink-0 transition-colors group-hover:bg-ivory group-hover:text-espresso">
              <ArrowRight size={18} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
