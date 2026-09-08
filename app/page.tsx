import { Nav } from "@/components/public/Nav";
import { Hero } from "@/components/public/Hero";
import { ServicesStrip } from "@/components/public/ServicesStrip";
import { AboutGloria } from "@/components/public/AboutGloria";
import { Experience } from "@/components/public/Experience";
import { Location } from "@/components/public/Location";
import { Footer } from "@/components/public/Footer";
import { HomeBookingCTA } from "@/components/public/HomeBookingCTA";

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
