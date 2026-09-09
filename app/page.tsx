import type { Metadata } from "next";
import { Nav } from "@/components/public/Nav";
import { Hero } from "@/components/public/Hero";
import { ServicesStrip } from "@/components/public/ServicesStrip";
import { AboutGloria } from "@/components/public/AboutGloria";
import { Experience } from "@/components/public/Experience";
import { Location } from "@/components/public/Location";
import { Footer } from "@/components/public/Footer";
import { HomeBookingCTA } from "@/components/public/HomeBookingCTA";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Gloria Beauty Salon | Salon de belleza en Calle 8, Miami",
  description:
    "Reserva en Gloria Beauty Salon en Calle 8, Miami: cabello, balayage, blowouts, unas, cejas, pestanas, maquillaje y spray tan.",
  path: "/",
  keywords: ["salon de belleza Calle 8", "Gloria Beauty Salon Miami", "beauty salon Miami"],
});

export default function HomePage() {
  return (
    <>
      <Nav />
      <Hero />
      <ServicesStrip />
      <HomeBookingCTA />
      <AboutGloria />
      <Experience />
      <Location />
      <Footer />
    </>
  );
}
