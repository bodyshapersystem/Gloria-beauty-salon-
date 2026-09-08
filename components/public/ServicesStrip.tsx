import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const services = [
  {
    title: "Cabello",
    subcopy: "Color · Cortes · Secados · Tratamientos · Extensiones",
    quote: "Un cabello saludable también es confianza.",
    accent: "Tu mejor versión",
    photo: "/images/gloria/hair/hair-01.jpg",
    href: "/servicios#hair",
    position: "object-center",
  },
  {
    title: "Uñas",
    subcopy: "Manicure · Pedicure · Nail Art · Tratamientos",
    quote: "Pequeños detalles, grandes historias.",
    accent: "Arte en tus manos",
    photo: "/images/gloria/nails/nails-01.jpg",
    href: "/servicios#nails",
    position: "object-center",
  },
  {
    title: "Cejas & Pestañas",
    subcopy: "Diseño · Henna · Laminado · Extensiones · Lifting",
    quote: "Miradas que inspiran.",
    accent: "Realza tu esencia",
    photo: "/images/gloria/team/diana-hero.jpg",
    href: "/servicios#brows",
    position: "object-[50%_28%]",
  },
  {
    title: "Maquillaje & Bronceado",
    subcopy: "Maquillaje profesional · Spray Tan · Bronceado",
    quote: "Luce radiante, siempre tú.",
    accent: "Belleza que te acompaña",
    photo: "/images/gloria/makeup/emmy-service.webp",
    href: "/servicios#tanning",
    position: "object-[50%_18%]",
  },
];

export function ServicesStrip() {
  return (
    <section className="relative overflow-hidden bg-[#FBF6F0] py-12 md:py-20">
      <div className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          background:
            "radial-gradient(ellipse at 88% 10%,rgba(255,255,255,.95) 0%,rgba(250,237,227,.55) 28%,transparent 52%),radial-gradient(ellipse at 8% 62%,rgba(255,255,255,.75) 0%,rgba(237,215,201,.28) 34%,transparent 58%),linear-gradient(135deg,#FBF7F2 0%,#F7ECE3 48%,#FBF6F0 100%)",
        }}
      />
      <div className="pointer-events-none absolute -right-20 top-2 h-[430px] w-[230px] rotate-[18deg] rounded-[55%] border-[18px] border-white/70 bg-white/10 blur-[1px]" />
      <div className="pointer-events-none absolute -left-28 bottom-8 h-[420px] w-[260px] -rotate-[18deg] rounded-[60%] border-[20px] border-[#EED7C8]/45 bg-white/10 blur-[1px]" />

      <div className="relative mx-auto max-w-[1220px] px-4 md:px-8">
        <div className="mb-7 flex items-start justify-between gap-4 md:mb-10">
          <div>
            <p className="text-[9px] uppercase tracking-[0.32em] text-[#8E6B5C] md:text-[10px]">Nuestros servicios</p>
            <h2 className="mt-2 max-w-[680px] font-serif text-[42px] leading-[0.93] text-[#211612] md:text-[68px]">
              Belleza<br className="md:hidden" /> en cada detalle
            </h2>
          </div>
          <p className="hidden pt-1 text-right text-[10px] uppercase leading-[1.55] tracking-[0.30em] text-[#B38F7F] md:block">
            Tu estilo<br />nuestra pasión
          </p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {services.map((service) => (
            <Link
              href={service.href}
              key={service.title}
              className="group relative block min-h-[205px] overflow-hidden rounded-[24px] border border-[#F1E2D8] bg-[#F5E9DF] shadow-[0_12px_30px_rgba(82,53,41,.07)] md:min-h-[258px]"
            >
              <div className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 14% 16%,rgba(255,255,255,.98),rgba(255,255,255,.28) 38%,transparent 64%),radial-gradient(ellipse at 58% 105%,rgba(255,255,255,.62),transparent 58%),linear-gradient(112deg,#F8EEE6 0%,#F5E8DE 44%,#EFE0D4 100%)",
                }}
              />
              <div className="absolute -left-20 bottom-[-48%] h-[165%] w-[55%] rounded-[56%] border-[18px] border-white/60 bg-white/10 blur-[1px]" />
              <div className="absolute inset-y-0 right-0 w-[58%] overflow-hidden">
                <Image
                  src={service.photo}
                  alt={service.title}
                  fill
                  sizes="(max-width: 768px) 58vw, 710px"
                  className={`object-cover ${service.position} transition-transform duration-[1.2s] ease-out group-hover:scale-[1.025]`}
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,#F5E9DF_0%,rgba(245,233,223,.82)_14%,rgba(245,233,223,.28)_38%,rgba(245,233,223,0)_72%)]" />
              </div>

              <div className="relative z-10 flex min-h-[205px] items-stretch justify-between gap-3 px-5 py-5 md:min-h-[258px] md:px-9 md:py-8">
                <div className="flex max-w-[62%] flex-col justify-center md:max-w-[52%]">
                  <h3 className="font-serif text-[31px] leading-[0.95] text-[#261915] md:text-[50px]">{service.title}</h3>
                  <p className="mt-2 max-w-[330px] text-[9px] uppercase leading-[1.55] tracking-[0.16em] text-[#6E554A] md:text-[11px]">
                    {service.subcopy}
                  </p>
                  <p className="mt-4 max-w-[255px] font-serif text-[17px] italic leading-[1.12] text-[#785B4E] md:text-[22px]">
                    {service.quote}
                  </p>
                </div>

                <div className="flex w-[86px] flex-col items-end justify-between py-1 md:w-[112px]">
                  <span className="max-w-[82px] text-right text-[8px] uppercase leading-[1.55] tracking-[0.28em] text-[#8E6B5D] md:text-[10px]">
                    {service.accent}
                  </span>
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-[#5A3525] text-[#FFF8F0] shadow-[0_8px_20px_rgba(67,41,29,.16)] transition-transform duration-300 group-hover:translate-x-1 md:h-14 md:w-14">
                    <ArrowRight size={20} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
