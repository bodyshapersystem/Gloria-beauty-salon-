import type { Metadata } from "next";
import { Nav } from "@/components/public/Nav";
import { Footer } from "@/components/public/Footer";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { BookingWidget } from "@/components/public/BookingWidget";

export const metadata: Metadata = {
  title: "Reserva tu cita | Gloria Beauty Salon",
  description:
    "Reserva tu cita en Gloria Beauty Salon — elige el servicio, tu profesional favorita, y el horario que mejor te acomode.",
};

export default function ReservarPage() {
  return (
    <>
      <Nav />

      <div className="max-w-[1220px] mx-auto px-6 md:px-8 pt-20 md:pt-[90px] pb-10 md:pb-14 text-center">
        <Eyebrow>GLORIA ON DEMAND</Eyebrow>
        <h1 className="font-serif font-medium text-[clamp(38px,5.2vw,60px)] leading-[1.02]">
          Reserva tu
          <br />
          <em className="italic font-normal text-mocha">cita.</em>
        </h1>
        <p className="mt-5 text-[14.5px] text-mocha max-w-[420px] mx-auto">
          Elige tu servicio, tu profesional y el horario que mejor te
          acomode.
        </p>
      </div>

      <div className="px-6 md:px-8 pb-24 md:pb-[130px]">
        <BookingWidget />
      </div>

      <Footer />
    </>
  );
}
