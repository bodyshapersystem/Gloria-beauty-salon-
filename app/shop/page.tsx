import type { Metadata } from "next";
import Image from "next/image";
import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Shop | Gloria Beauty Salon",
  description:
    "Los productos de belleza que usamos y amamos en Gloria Beauty Salon — próximamente.",
};

export default function ShopPage() {
  return (
    <>
      <Nav />

      <section className="relative overflow-hidden aspect-[16/9] md:aspect-[21/9] bg-ivory">
        <Image
          src="/images/gloria/shop/shop-hero.jpg"
          alt="Gloria Beauty Salon Shop"
          fill
          priority
          className="object-cover"
        />
      </section>

      <div className="max-w-[1220px] mx-auto px-6 md:px-8 py-20 md:py-[110px] text-center">
        <Eyebrow>SHOP</Eyebrow>
        <h1 className="font-serif font-medium text-[clamp(34px,4.4vw,54px)] leading-[1.05] max-w-[640px] mx-auto">
          Muy pronto, los productos
          <br />
          <em className="italic font-normal text-mocha">que usamos contigo.</em>
        </h1>
        <p className="mt-5 text-[14.5px] text-mocha max-w-[420px] mx-auto">
          Estamos preparando nuestra selección de productos de belleza —
          disponibles para pickup en salón y, más adelante, para envío.
        </p>
      </div>

      <Footer />
    </>
  );
}
