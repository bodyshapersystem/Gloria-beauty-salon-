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
    subcopy: "Manicure · Pedicure · Gel · Polygel",
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
    photo: "/images/gloria/team/diana.jpg",
    href: "/servicios#brows",
    position: "object-[50%_25%]",
  },
  {
    title: "Maquillaje & Bronceado",
    subcopy: "Maquillaje profesional · Spray Tan · Bronceado",
    quote: "Luce radiante, siempre tú.",
    accent: "Belleza que te acompaña",
    photo: "/images/gloria/team/emmy.jpg",
    href: "/servicios#tanning",
    position: "object-[50%_22%]",
  },
];

export function ServicesStrip() {
  return (
    <section className="relative overflow-hidden bg-[#FBF5EE] py-14 md:py-20">
      <div className="pointer-events-none absolute -right-24 top-8 h-[360px] w-[360px] rounded-full bg-white/50 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-24 h-[320px] w-[320px] rounded-full bg-[#E8D2C5]/35 blur-3xl" />

      <div className="relative mx-auto max-w-[1220px] px-4 md:px-8">
        <div className="mb-7 flex items-start justify-between gap-5 md:mb-10">
          <div>
            <p className="text-[9px] uppercase tracking-[0.30em] text-[#8C6758] md:text-[10px]">Nuestros servicios</p>
            <h2 className="mt-2 max-w-[700px] font-serif text-[42px] leading-[0.94] text-[#2E211C] md:text-[68px]">
              Belleza<br className="md:hidden" /> en cada detalle
            </h2>
          </div>
          <p className="hidden pt-2 text-right text-[10px] uppercase tracking-[0.28em] text-[#B18D7B] md:block">
            Tu estilo<br />nuestra pasión
          </p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {services.map((service) => (
            <Link
              href={service.href}
              key={service.title}
              className="group relative block min-h-[205px] overflow-hidden rounded-[26px] border border-white/70 bg-[#F3E7DD] shadow-[0_18px_45px_rgba(87,60,50,.08)] md:min-h-[260px]"
            >
              <Image
                src={service.photo}
                alt={service.title}
                fill
                sizes="(max-width: 768px) 100vw, 1220px"
                className={`object-cover ${service.position} transition-transform duration-[1.2s] ease-out group-hover:scale-[1.025]`}
              />

              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(250,242,233,.98)_0%,rgba(250,242,233,.94)_36%,rgba(250,242,233,.55)_58%,rgba(250,242,233,.08)_82%,rgba(250,242,233,0)_100%)]" />
              <div className="absolute inset-y-0 left-[46%] w-[28%] -skew-x-[13deg] bg-white/12 blur-xl" />
              <div className="absolute -left-10 bottom-[-55%] h-[160%] w-[52%] rounded-[55%] border-[18px] border-white/20 bg-white/5 blur-[1px]" />

              <div className="relative z-10 flex min-h-[205px] items-center justify-between gap-4 px-5 py-5 md:min-h-[260px] md:px-9 md:py-8">
                <div className="max-w-[64%] md:max-w-[54%]">
                  <h3 className="font-serif text-[31px] leading-none text-[#2B1E1A] md:text-[52px]">{service.title}</h3>
                  <p className="mt-2 text-[9px] uppercase leading-[1.5] tracking-[0.16em] text-[#6D5449] md:text-[11px]">{service.subcopy}</p>
                  <p className="mt-4 max-w-[270px] font-serif text-[17px] italic leading-[1.15] text-[#76584A] md:text-[23px]">{service.quote}</p>
                </div>

                <div className="flex h-full min-h-[165px] flex-col items-end justify-between self-stretch py-1 md:min-h-[204px]">
                  <span className="max-w-[85px] text-right text-[8px] uppercase leading-[1.55] tracking-[0.30em] text-[#8C6B5C] md:text-[10px]">{service.accent}</span>
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-[#5A3525]/95 text-[#FFF8F0] shadow-[0_8px_20px_rgba(67,41,29,.18)] transition-transform duration-300 group-hover:translate-x-1 md:h-14 md:w-14">
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
