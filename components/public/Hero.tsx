import Image from "next/image";

export function Hero() {
  return (
    <section className="relative overflow-hidden aspect-[16/9] md:aspect-[21/9] bg-ivory">
      <Image
        src="/images/gloria/hero/hero-01.jpg"
        alt="Gloria Beauty Salon — Realza tu esencia, define tu estilo. Calle 8, Miami."
        fill
        priority
        className="object-cover"
      />
    </section>
  );
}
