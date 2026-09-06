import type { Metadata } from "next";
import Image from "next/image";
import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Sobre Gloria | Gloria Beauty Salon",
  description:
    "La historia de Gloria — fundadora, master stylist y color specialist de Gloria Beauty Salon, en Calle 8, Miami.",
};

export default function SobreGloriaPage() {
  return (
    <>
      <Nav />

      <div className="max-w-[1220px] mx-auto px-6 md:px-8 pt-20 md:pt-[90px] pb-5">
        <Eyebrow>NUESTRA HISTORIA</Eyebrow>
        <h1 className="font-serif font-medium text-[clamp(40px,5.6vw,68px)] leading-[1.02] max-w-[720px]">
          Una vida dedicada
          <br />
          <em className="italic font-normal text-mocha">a realzar belleza.</em>
        </h1>
      </div>

      <div className="grid md:grid-cols-[0.85fr_1.15fr] gap-12 md:gap-[70px] items-start px-6 md:px-8 pt-12 md:pt-16 pb-20 md:pb-[130px] max-w-[1220px] mx-auto">
        <div className="relative aspect-[4/5] overflow-hidden md:sticky md:top-28">
          <Image
            src="/images/gloria/team/gloria.jpg"
            alt="Gloria, fundadora"
            fill
            className="object-cover object-top"
          />
        </div>

        <div className="max-w-[620px]">
          <div className="text-xs tracking-[0.16em] text-taupe font-semibold mb-5">
            FUNDADORA · MASTER STYLIST · COLOR SPECIALIST
          </div>

          <p className="text-[15px] leading-[1.85] text-mocha mb-5">
            Con más de 25 años de experiencia en la industria de la belleza,
            Gloria ha construido su trayectoria sobre una combinación de
            técnica, intuición y formación constante — la misma filosofía que
            hoy define a Gloria Beauty Salon.
          </p>

          <p className="text-[15px] leading-[1.85] text-mocha mb-5">
            Su historia profesional comenzó en Venezuela, donde dio sus
            primeros pasos detrás de la silla y descubrió que el cabello era
            mucho más que un oficio: una forma de hacer sentir segura a cada
            persona que se sentaba frente a ella. Esa vocación la llevó a
            especializarse cada vez más — buscando siempre la técnica exacta,
            el tono exacto, el corte exacto para cada rostro.
          </p>

          <p className="text-[15px] leading-[1.85] text-mocha mb-5">
            Al establecerse en Estados Unidos, continuó su formación con más
            de 30 cursos y especializaciones, refinando su dominio en
            colorimetría, balayage y cortes de precisión. Cada nueva técnica
            aprendida se convirtió en una herramienta más al servicio de una
            misma meta: que cada clienta se vaya sintiéndose exactamente como
            quiere verse.
          </p>

          <p className="text-[15px] leading-[1.85] text-mocha mb-5">
            Hoy, esa misma pasión es la que sostiene a Gloria Beauty Salon —
            un espacio pensado para que la experiencia de cuidarte sea tan
            cuidada como el resultado final. Gloria lidera personalmente cada
            servicio de color, corte y balayage, acompañada de un equipo que
            comparte su mismo estándar de excelencia.
          </p>

          <blockquote className="my-8 font-serif italic text-[24px] leading-snug border-l-2 border-champagne pl-6">
            &ldquo;La belleza también es una forma de confianza.&rdquo;
          </blockquote>

          <p className="text-[15px] leading-[1.85] text-mocha mb-8">
            Fuera del salón, Gloria sigue siendo la misma de siempre: curiosa,
            detallista y profundamente comprometida con su oficio — siempre
            aprendiendo, siempre buscando la próxima técnica que le permita
            dar un poco más a quienes confían en ella.
          </p>

          <Button href="/reservar" variant="pill">
            RESERVA TU CITA CON GLORIA
          </Button>
        </div>
      </div>

      <Footer />
    </>
  );
}
