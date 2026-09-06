import Image from "next/image";
import { Logo } from "@/components/brand/Logo";
import { site } from "@/lib/data/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[94vh] bg-ivory">
      <div className="absolute inset-0">
        <Image
          src="/images/gloria/hero/hero-01.jpg"
          alt="Gloria Beauty Salon"
          fill
          priority
          className="object-cover"
          style={{ objectPosition: "38% 16%" }}
        />
        {/* Blends the photo into the ivory background — desktop only;
            mobile fades from the bottom instead (see below). */}
        <div
          className="absolute inset-0 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, #F8F5EF 0%, #F8F5EF 30%, rgba(248,245,239,0.72) 42%, rgba(248,245,239,0.18) 56%, rgba(248,245,239,0) 68%)",
          }}
        />
        <div
          className="absolute inset-0 md:hidden"
          style={{
            background:
              "linear-gradient(0deg, #F8F5EF 0%, rgba(248,245,239,0) 26%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-[600px] px-6 md:px-12 py-16 md:py-28">
        <Logo className="h-[104px] md:h-[150px] w-auto" />
        <div className="w-[130px] h-px bg-champagne my-6" />
        <h1 className="font-serif font-medium uppercase text-mocha leading-[1.28] text-[28px] md:text-[42px] tracking-[0.01em]">
          Realza tu esencia,
          <br />
          define tu estilo.
        </h1>
        <div className="w-[130px] h-px bg-champagne my-6" />
        <div className="text-sm tracking-[0.1em] text-taupe">
          {site.location}
        </div>
        <a
          href="#book"
          className="mt-9 inline-flex items-center gap-4 rounded-full bg-taupe text-ivory px-8 py-[17px] text-[12.5px] font-semibold tracking-[0.1em] hover:bg-mocha transition-colors"
        >
          RESERVA TU CITA <span className="text-[15px]">→</span>
        </a>
      </div>
    </section>
  );
}
