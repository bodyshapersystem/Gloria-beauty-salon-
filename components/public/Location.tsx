import { MapPin } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/data/site";

const encodedAddress = encodeURIComponent(site.address);
const mapEmbedSrc = `https://maps.google.com/maps?q=${encodedAddress}&z=16&output=embed`;
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

export function Location() {
  return (
    <section id="contacto" className="border-t border-champagne/25 bg-[#F8F3EC]">
      <div className="mx-auto grid max-w-[1220px] md:grid-cols-[0.78fr_1.22fr]">
        <div className="px-6 py-10 md:px-8 md:py-14 lg:px-12 lg:py-16">
          <Eyebrow>VISÍTANOS</Eyebrow>
          <h2 className="mt-1 font-serif text-[clamp(34px,4vw,52px)] font-medium leading-[1.02]">
            Nuestra ubicación
          </h2>

          <div className="mt-6 flex items-start gap-3 text-mocha">
            <MapPin size={18} className="mt-0.5 shrink-0" />
            <p className="text-[14px] leading-relaxed">{site.address}</p>
          </div>

          <p className="mt-4 max-w-[360px] text-[13px] leading-[1.65] text-taupe">
            En el corazón de Calle 8, Miami. Te esperamos.
          </p>

          <Button href={directionsUrl} variant="ghost" className="mt-7">
            CÓMO LLEGAR
          </Button>
        </div>

        <div className="relative min-h-[300px] overflow-hidden bg-blush md:min-h-full">
          <iframe
            src={mapEmbedSrc}
            title="Ubicación de Gloria Beauty Salon"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0 grayscale-[20%] contrast-[1.02]"
            allowFullScreen
          />
        </div>
      </div>
    </section>
  );
}
