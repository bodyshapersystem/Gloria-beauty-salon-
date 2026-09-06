import Image from "next/image";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { UnderlineLink } from "@/components/ui/Button";

export function AboutGloria() {
  return (
    <section
      id="sobre"
      className="grid md:grid-cols-[0.85fr_1.15fr] gap-12 md:gap-[70px] items-center px-6 md:px-8 py-20 md:py-[120px] max-w-[1220px] mx-auto"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image
          src="/images/gloria/team/gloria.jpg"
          alt="Gloria, fundadora"
          fill
          className="object-cover object-top"
        />
      </div>

      <div>
        <Eyebrow>CONOCE A</Eyebrow>
        <h2 className="font-serif font-medium text-[clamp(38px,4.4vw,58px)] leading-[1.02]">
          Gloria
        </h2>
        <div className="text-xs tracking-[0.16em] text-taupe font-semibold my-5">
          FUNDADORA · MASTER STYLIST · COLOR SPECIALIST
        </div>
        <p className="text-[14.5px] leading-[1.75] text-mocha max-w-[520px] mb-4">
          Con más de 25 años de experiencia en la industria de la belleza,
          Gloria ha construido su trayectoria sobre una combinación de
          técnica, intuición y formación constante.
        </p>
        <p className="text-[14.5px] leading-[1.75] text-mocha max-w-[520px] mb-4">
          Su historia profesional comenzó en Venezuela, y ha continuado su
          educación con más de 30 cursos y especializaciones, también en
          Estados Unidos. Especialista en colorimetría, balayage y cortes.
        </p>
        <blockquote className="my-6 font-serif italic text-[22px] border-l-2 border-champagne pl-5">
          &ldquo;La belleza también es una forma de confianza.&rdquo;
        </blockquote>
        <UnderlineLink href="/sobre-gloria">NUESTRA HISTORIA</UnderlineLink>
      </div>
    </section>
  );
}
