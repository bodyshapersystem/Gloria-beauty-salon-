import { Nav } from "@/components/public/Nav";
import { Hero } from "@/components/public/Hero";
import { ServicesStrip } from "@/components/public/ServicesStrip";
import { AboutGloria } from "@/components/public/AboutGloria";
import { Experience } from "@/components/public/Experience";
import { Team } from "@/components/public/Team";
import { Location } from "@/components/public/Location";
import { Footer } from "@/components/public/Footer";

export default function HomePage() {
  return (
    <>
      <Nav />
      <Hero />
      <ServicesStrip />
      <AboutGloria />
      <Experience />
      <Team />
      <Location />
      <Footer />
    </>
  );
}
