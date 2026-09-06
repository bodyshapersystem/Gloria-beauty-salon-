import type { Metadata } from "next";
import Image from "next/image";
import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button, UnderlineLink } from "@/components/ui/Button";
import { serviceCategories } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Servicios | Gloria Beauty Salon",
  description:
    "Hair, Nails, Brows, Lashes, Tanning y Makeup — todo lo que te hace brillar, en Calle 8, Miami.",
};

export default function ServiciosPage() {
  return (
    <>
      <Nav />

      <div className="max-w-[1220px] mx-auto px-6 md:px-8 pt-20 md:pt-[90px] pb-5">
        <Eyebrow>SERVICIOS</Eyebrow>
        <h1 className="font-serif font-medium text-[clamp(44px,6vw,76px)] leading-[0.98]">
          Todo lo que
          <br />
          te hace <em className="italic font-normal text-mocha">brillar.</em>
        </h1>
        <p className="mt-5 text-[15px] text-mocha max-w-[420px]">
          Cabello, uñas, cejas, pestañas, bronceado y maquillaje — cada
          detalle, con la misma dedicación.
        </p>
        <p className="mt-3 text-[12.5px] text-taupe max-w-[420px]">
          Precios y duración de referencia. El valor final de servicios
          variables (balayage, extensiones) depende del cabello.
        </p>
      </div>

      <div className="max-w-[1220px] mx-auto px-6 md:px-8 pb-24 md:pb-[140px] mt-16 md:mt-20">
        {serviceCategories.map((cat, i) => (
          <div
            id={cat.slug}
            key={cat.slug}
            className="grid md:grid-cols-2 gap-9 md:gap-[70px] items-center py-12 md:py-[70px] border-t border-taupe/30 last:border-b scroll-mt-24"
          >
            <div className={i % 2 === 1 ? "md:order-2" : ""}>
              <div className="relative aspect-[5/4] overflow-hidden">
                <Image src={cat.photo} alt={cat.name} fill className="object-cover" />
              </div>
            </div>

            <div className={i % 2 === 1 ? "md:order-1" : ""}>
              <div className="text-xs tracking-[0.16em] text-taupe font-semibold mb-3.5">
                {cat.index} · {cat.name.toUpperCase()}
              </div>
              <h2 className="font-serif font-medium text-[clamp(34px,3.6vw,50px)]">{cat.name}</h2>
              <p className="mt-3 text-[14.5px] text-mocha max-w-[360px] leading-relaxed">{cat.tagline}</p>

              {cat.groups ? (
                <div className="mt-7 max-w-[440px] border-y border-taupe/20">
                  {cat.groups.map((group, index) => (
                    <details key={group.slug} className="group border-b last:border-b-0 border-taupe/20" open={index === 0}>
                      <summary className="list-none cursor-pointer py-4 flex items-center justify-between gap-5">
                        <div>
                          <p className="font-serif text-[25px] leading-none text-espresso">{group.name}</p>
                          {group.description && (
                            <p className="mt-1.5 text-[11px] leading-snug text-taupe">{group.description}</p>
                          )}
                        </div>
                        <span className="shrink-0 h-8 w-8 rounded-full border border-champagne/55 flex items-center justify-center text-mocha text-[18px] leading-none transition-transform group-open:rotate-45">+</span>
                      </summary>
                      <ul className="pb-3 pl-1">
                        {group.items.map((item) => (
                          <li key={item.name} className="flex items-baseline justify-between gap-4 py-2.5 border-t border-taupe/10 first:border-t-0">
                            <div className="min-w-0">
                              <div className="text-[13px] leading-snug">{item.name}</div>
                              <div className="text-[10.5px] text-taupe mt-0.5">{item.duration}</div>
                            </div>
                            <div className="font-serif italic text-[16px] text-mocha whitespace-nowrap shrink-0">{item.price}</div>
                          </li>
                        ))}
                      </ul>
                    </details>
                  ))}
                </div>
              ) : (
                <ul className="mt-7 flex flex-col divide-y divide-taupe/20 max-w-[420px]">
                  {cat.items.map((item) => (
                    <li key={item.name} className="flex items-baseline justify-between gap-4 py-3">
                      <div className="min-w-0">
                        <div className="text-[13.5px] leading-snug">{item.name}</div>
                        <div className="text-[11px] text-taupe mt-0.5">{item.duration}</div>
                      </div>
                      <div className="font-serif italic text-[17px] text-mocha whitespace-nowrap shrink-0">{item.price}</div>
                    </li>
                  ))}
                </ul>
              )}

              <UnderlineLink href="/reservar" className="mt-7 inline-block">Ver disponibilidad</UnderlineLink>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-espresso text-ivory px-6 md:px-8 py-24 text-center">
        <h2 className="font-serif font-medium text-[clamp(30px,3.6vw,44px)] max-w-[640px] mx-auto leading-tight">
          Disponibilidad en tiempo real,
          <br />
          <em className="italic text-champagne font-normal">dentro de Gloria On Demand.</em>
        </h2>
        <p className="mt-[18px] text-[13.5px] text-blush">Selecciona tu servicio, tu profesional y el horario que mejor te acomode.</p>
        <Button href="/reservar" variant="pill-dark" className="mt-9 !border-champagne">RESERVA TU CITA</Button>
      </div>

      <Footer />
    </>
  );
}
