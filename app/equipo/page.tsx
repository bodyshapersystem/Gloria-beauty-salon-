import type { Metadata } from "next";
import { Nav } from "@/components/public/Nav";
import { Team } from "@/components/public/Team";
import { Footer } from "@/components/public/Footer";

export const metadata: Metadata = {
  title: "Equipo | Gloria Beauty Salon",
  description:
    "Conoce a Gloria, Nudis, Diana, Caro y Emmy — el equipo detrás de Gloria Beauty Salon, en Calle 8, Miami.",
};

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
