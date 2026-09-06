import type { Metadata } from "next";
import Image from "next/image";
import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = {
  title: "Galería | Gloria Beauty Salon",
  description:
    "Un vistazo al trabajo y al detrás de cámaras de Gloria Beauty Salon, en Calle 8, Miami.",
};

const photos = [
  {
    src: "/images/gloria/gallery/gloria-scissors-comb.jpg",
    alt: "Gloria con tijeras y peine",
  },
  {
    src: "/images/gloria/gallery/gloria-smiling-scissors.jpg",
    alt: "Gloria sonriendo con tijeras",
  },
  {
    src: "/images/gloria/gallery/gloria-hair-ring.jpg",
    alt: "Gloria mostrando un anillo de mechones de color",
  },
  {
    src: "/images/gloria/gallery/gloria-tools.jpg",
    alt: "Gloria con plancha y secador",
  },
];

export default function GaleriaPage() {
  return (
    <>
      <Nav />

      <div className="max-w-[1220px] mx-auto px-6 md:px-8 pt-20 md:pt-[90px] pb-10 md:pb-14">
        <Eyebrow>GALERÍA</Eyebrow>
        <h1 className="font-serif font-medium text-[clamp(40px,5.6vw,68px)] leading-[1.02] max-w-[720px]">
          Un vistazo
          <br />
          <em className="italic font-normal text-mocha">detrás de cámaras.</em>
        </h1>
      </div>

      <div className="max-w-[1220px] mx-auto px-6 md:px-8 pb-24 md:pb-[130px] grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {photos.map((photo) => (
          <div
            key={photo.src}
            className="relative aspect-[3/4] overflow-hidden bg-blush"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <Footer />
    </>
  );
}
