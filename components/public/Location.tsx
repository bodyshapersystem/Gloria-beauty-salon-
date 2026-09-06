import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/data/site";

const fields: [string, string][] = [
  ["Dirección", site.address],
  ["Teléfono", site.phone],
  ["WhatsApp", site.whatsapp],
  ["Horario", `${site.hours} · ${site.hoursClosed}`],
];

const encodedAddress = encodeURIComponent(site.address);
const mapEmbedSrc = `https://maps.google.com/maps?q=${encodedAddress}&z=16&output=embed`;
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

export function Location() {
  return (
    <section
      id="contacto"
      className="px-6 md:px-8 pb-24 md:pb-[130px] max-w-[1220px] mx-auto grid md:grid-cols-2 gap-12 md:gap-[60px]"
    >
      <div className="relative aspect-[16/11] overflow-hidden bg-blush group">
        <iframe
          src={mapEmbedSrc}
          title="Ubicación de Gloria Beauty Salon"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 w-full h-full border-0 grayscale-[35%] contrast-[1.05] transition-[filter] duration-500 group-hover:grayscale-0"
          allowFullScreen
        />
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

        <Button href={directionsUrl} variant="ghost" className="mt-8">
          CÓMO LLEGAR
        </Button>
      </div>
    </section>
  );
}
