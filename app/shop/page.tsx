"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { supabase } from "@/lib/supabase/client";
import { useCart } from "@/lib/cart/CartContext";

type Product = {
  slug: string;
  name: string;
  brand: string;
  price_cents: number | null;
  image_url: string | null;
  inventory_quantity: number;
  tags: string[] | null;
};

function money(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);
}

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const cart = useCart();

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("product_catalog")
        .select("slug,name,brand,price_cents,image_url,inventory_quantity,tags")
        .eq("active", true)
        .order("featured", { ascending: false })
        .order("name");
      setProducts((data as Product[]) || []);
      setLoading(false);
    })();
  }, []);

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
          Disponibles para pickup en salón — envío y pago en línea, próximamente.
        </p>
      </div>

      <div className="max-w-[1220px] mx-auto px-6 md:px-8 pb-24 md:pb-[130px] mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-9">
        {loading ? (
          <p className="col-span-full text-center text-[13px] text-taupe py-10">Cargando productos...</p>
        ) : products.length === 0 ? (
          <p className="col-span-full text-center text-[13px] text-taupe py-10">
            Todavía no hay productos disponibles.
          </p>
        ) : (
          products.map((p) => {
            const outOfStock = p.inventory_quantity <= 0;
            return (
              <div key={p.slug} className="group">
                <div className="relative aspect-square overflow-hidden bg-blush flex items-center justify-center">
                  {p.image_url ? (
                    <Image
                      src={p.image_url}
                      alt={`${p.brand} ${p.name}`}
                      fill
                      className="object-contain p-6 transition-transform duration-[1.1s] ease-out group-hover:scale-[1.04]"
                    />
                  ) : (
                    <span className="text-[11px] tracking-[0.12em] text-taupe text-center px-6">
                      FOTO PRÓXIMAMENTE
                    </span>
                  )}
                  {outOfStock && (
                    <span className="absolute top-2 left-2 rounded-full bg-espresso/85 px-2.5 py-1 text-[9px] uppercase tracking-[0.1em] text-ivory">
                      Agotado
                    </span>
                  )}
                </div>
                <div className="mt-4">
                  <div className="text-[10.5px] tracking-[0.16em] text-taupe font-semibold">
                    {p.brand.toUpperCase()}
                  </div>
                  <h3 className="font-serif italic font-medium text-[19px] mt-1">{p.name}</h3>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="font-serif italic text-[16px] text-mocha">
                      {p.price_cents !== null ? money(p.price_cents) : "Precio en salón"}
                    </span>
                    {p.price_cents !== null && !outOfStock && (
                      <button
                        onClick={() =>
                          cart.addItem({
                            slug: p.slug,
                            name: p.name,
                            brand: p.brand,
                            size: "",
                            image: p.image_url,
                            priceCents: p.price_cents!,
                          })
                        }
                        aria-label={`Agregar ${p.name} al carrito`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-espresso px-3.5 py-2 text-[9.5px] uppercase tracking-[0.1em] text-ivory"
                      >
                        <Plus size={12} /> Agregar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Footer />
    </>
  );
}
