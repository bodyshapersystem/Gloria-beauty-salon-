import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { site } from "@/lib/data/site";

const fields: [string, string][] = [
  ["Dirección", site.address],
  ["Teléfono", site.phone],
  ["WhatsApp", site.whatsapp],
  ["Horario", `${site.hours} · ${site.hoursClosed}`],
];

export function Location() {
  return (
    <section
      id="contacto"
      className="px-6 md:px-8 pb-24 md:pb-[130px] max-w-[1220px] mx-auto grid md:grid-cols-2 gap-12 md:gap-[60px]"
    >
      <div className="relative bg-espresso aspect-[16/11] flex items-center justify-center overflow-hidden">
        <Logo className="w-[56%] max-w-[280px] h-auto" />
      </div>

      <div>
        <Eyebrow>UBICACIÓN</Eyebrow>
        <h2 className="font-serif font-medium text-[clamp(34px,4vw,50px)]">
          Calle 8, Miami
        </h2>
        <p className="mt-3.5 text-[15px] text-mocha">
          Tu beauty spot en el corazón de la ciudad.
        </p>

        <div className="mt-11 flex flex-col gap-[18px]">
          {fields.map(([label, value]) => (
            <div key={label} className="flex gap-4 text-sm">
              <span className="w-[90px] shrink-0 text-[11.5px] font-semibold tracking-[0.06em] uppercase text-taupe pt-0.5">
                {label}
              </span>
              <span>{value}</span>
            </div>
          ))}
        </div>

        <Button href="#" variant="ghost" className="mt-8">
          CÓMO LLEGAR
        </Button>
      </div>
    </section>
  );
}
