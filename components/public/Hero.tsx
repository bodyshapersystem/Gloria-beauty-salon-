import Image from "next/image";
import { Logo } from "@/components/brand/Logo";
import { site } from "@/lib/data/site";

export function Hero() {
  return (
    <section className="bg-ivory">
      <div className="grid md:grid-cols-[1fr_1.05fr] max-w-[1400px] mx-auto">
        {/* Left — plain ivory, all the text lives here */}
        <div className="flex flex-col justify-center px-6 md:pl-12 lg:pl-16 md:pr-8 py-12 md:py-0 order-2 md:order-1">
          <Logo className="h-[64px] md:h-[88px] w-auto" />
          <div className="w-[100px] h-px bg-champagne my-5" />
          <h1 className="font-serif font-medium uppercase text-mocha leading-[1.28] text-[22px] md:text-[30px] tracking-[0.01em]">
            Realza tu esencia,
            <br />
            define tu estilo.
          </h1>
          <div className="w-[100px] h-px bg-champagne my-5" />
          <div className="text-sm tracking-[0.1em] text-taupe">
            {site.location}
          </div>
          <a
            href="#book"
            className="mt-7 inline-flex items-center gap-4 self-start rounded-full bg-taupe text-ivory px-8 py-[15px] text-[12.5px] font-semibold tracking-[0.1em] hover:bg-mocha transition-colors"
          >
            RESERVA TU CITA <span className="text-[15px]">→</span>
          </a>
        </div>

        {/* Right — the photo, contained to its own column (not full-bleed) */}
        <div className="relative aspect-[4/3] md:aspect-auto order-1 md:order-2">
          <Image
            src="/images/gloria/hero/hero-01.jpg"
            alt="Gloria Beauty Salon"
            fill
            priority
            className="object-cover"
            style={{ objectPosition: "30% 12%" }}
          />
        </div>
      </div>
    </section>
  );
}
