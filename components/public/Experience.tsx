import Image from "next/image";
import { User, Gem, Leaf, Home } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";

const values = [
  { icon: User, label: "Atención personalizada" },
  { icon: Gem, label: "Productos de alta calidad" },
  { icon: Leaf, label: "Resultados que te hacen sentir bien" },
  { icon: Home, label: "Un espacio íntimo y acogedor" },
];

export function Experience() {
  return (
    <section className="relative overflow-hidden bg-espresso text-ivory px-6 md:px-8 py-24 md:py-[110px] mb-20 md:mb-[120px]">
      <div className="absolute inset-0">
        <Image
          src="/images/gloria/experience/leaf-bg.jpg"
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition: "100% 100%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(100deg, #2E2724 0%, #2E2724 38%, rgba(46,39,36,0.88) 52%, rgba(46,39,36,0.55) 68%, rgba(46,39,36,0.28) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[1220px] mx-auto">
        <div className="flex items-center gap-3.5 mb-6">
          <span className="text-[11px] tracking-[0.22em] text-champagne font-semibold">
            GLORIA BEAUTY SALON
          </span>
          <div className="w-10 h-px bg-champagne/60" />
        </div>

        <h2 className="font-serif font-medium text-[clamp(34px,4.2vw,54px)] leading-[1.05] max-w-[640px]">
          MÁS QUE UN SALÓN,
          <br />
          <em className="italic text-champagne font-normal">
            una experiencia.
          </em>
        </h2>
        <p className="mt-5 text-[14.5px] text-blush max-w-[380px] leading-relaxed">
          Belleza, bienestar y confianza en un solo lugar.
        </p>

        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-9">
          {values.map(({ icon: Icon, label }) => (
            <div key={label} className="flex gap-3.5 items-start">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-full border border-champagne/40 flex items-center justify-center shrink-0 text-champagne">
                <Icon size={18} strokeWidth={1.5} />
              </div>
              <p className="text-[13.5px] leading-snug text-blush pt-2.5">
                {label}
              </p>
            </div>
          ))}
        </div>

        <Button
          href="/reservar"
          variant="pill-dark"
          className="mt-14 !border-champagne"
          withArrow
        >
          AGENDA TU CITA
        </Button>

        <div className="mt-12 flex items-center gap-3.5">
          <div className="w-8 h-px bg-taupe/50" />
          <span className="text-[10.5px] tracking-[0.16em] text-taupe">
            TU BELLEZA
            <br />
            NUESTRA PASIÓN
          </span>
        </div>
      </div>
    </section>
  );
}
