import type { Metadata } from "next";
import Image from "next/image";
import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { products } from "@/lib/data/products";

export const metadata: Metadata = {
  title: "Shop | Gloria Beauty Salon",
  description:
    "Los productos de belleza que usamos y amamos en Gloria Beauty Salon.",
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

      <div className="max-w-[1220px] mx-auto px-6 md:px-8 pt-16 md:pt-20 pb-6 text-center">
        <Eyebrow>SHOP</Eyebrow>
        <h1 className="font-serif font-medium text-[clamp(34px,4.4vw,54px)] leading-[1.05] max-w-[640px] mx-auto">
          Los productos
          <br />
          <em className="italic font-normal text-mocha">que usamos contigo.</em>
        </h1>
        <p className="mt-5 text-[14.5px] text-mocha max-w-[420px] mx-auto">
          Disponibles para pickup en salón — envío, próximamente.
        </p>
      </div>

      <div className="max-w-[1220px] mx-auto px-6 md:px-8 pb-24 md:pb-[130px] mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-9">
        {products.map((p) => (
          <div key={p.slug} className="group">
            <div className="relative aspect-square overflow-hidden bg-blush flex items-center justify-center">
              {p.photo ? (
                <Image
                  src={p.photo}
                  alt={`${p.brand} ${p.name}`}
                  fill
                  className="object-contain p-6 transition-transform duration-[1.1s] ease-out group-hover:scale-[1.04]"
                />
              ) : (
                <span className="text-[11px] tracking-[0.12em] text-taupe text-center px-6">
                  FOTO PRÓXIMAMENTE
                </span>
              )}
            </div>
            <div className="mt-4">
              <div className="text-[10.5px] tracking-[0.16em] text-taupe font-semibold">
                {p.brand.toUpperCase()}
              </div>
              <h3 className="font-serif italic font-medium text-[19px] mt-1">
                {p.name}
              </h3>
              <div className="text-[11.5px] text-taupe mt-0.5">{p.size}</div>
              <div className="font-serif italic text-[16px] text-mocha mt-2">
                {p.price !== null ? `$${p.price.toFixed(2)}` : "Precio en salón"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
}
