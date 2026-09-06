import Image from "next/image";
import Link from "next/link";
import { serviceCategories } from "@/lib/data/services";

export function ServicesStrip() {
  return (
    <section className="border-y border-taupe/35">
      <div className="grid grid-cols-2 md:grid-cols-6">
        {serviceCategories.map((cat, i) => (
          <Link
            href={`/servicios#${cat.slug}`}
            key={cat.slug}
            className={`group relative flex flex-col justify-end p-5 aspect-square md:aspect-[3/4] overflow-hidden border-b md:border-b-0 border-taupe/20 ${
              i !== 0 ? "md:border-l md:border-taupe/20" : ""
            }`}
          >
            <Image
              src={cat.photo}
              alt={cat.name}
              fill
              className="object-cover transition-transform duration-[1.1s] ease-out group-hover:scale-[1.06]"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(46,39,36,0) 38%, rgba(46,39,36,0.8) 100%)",
              }}
            />
            <span className="relative z-10 text-[11px] tracking-[0.1em] text-champagne">
              {cat.index}
            </span>
            <h3 className="relative z-10 font-serif font-medium text-2xl text-ivory">
              {cat.name}
            </h3>
            <p className="relative z-10 text-[11px] text-blush mt-1.5 leading-snug">
              {cat.items.slice(0, 3).map((it) => it.name).join(" · ")}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
