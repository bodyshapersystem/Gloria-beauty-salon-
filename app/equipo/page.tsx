import type { Metadata } from "next";
import { Nav } from "@/components/public/Nav";
import { Team } from "@/components/public/Team";
import { Footer } from "@/components/public/Footer";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Equipo de Gloria Beauty Salon",
  description:
    "Conoce al equipo de Gloria Beauty Salon en Calle 8, Miami: Gloria, Nudis, Diana, Caro y Emmy para cabello, unas, cejas, pestanas y glow.",
  path: "/equipo",
  keywords: ["equipo salon Miami", "stylists Miami", "nail tech Miami"],
});

export default function EquipoPage() {
  return (
    <>
      <Nav />
      <div className="pt-14 md:pt-20">
        <Team />
      </div>
      <Footer />
    </>
  );
}
