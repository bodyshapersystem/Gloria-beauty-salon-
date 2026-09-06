import { emailShell, heading, greeting, paragraph, detailsCard, button, SITE } from "../base";
import type { AppointmentEmailParams } from "./confirmacion-cita";

export function recordatorio24hEmail(p: AppointmentEmailParams) {
  const body = `
    ${heading("Nos vemos", "mañana")}
    ${greeting(p.clientName)}
    ${paragraph("Mañana tienes una cita con nosotros. Aquí están los detalles:")}
    ${detailsCard([
      { label: "Fecha", value: p.dateLabel },
      { label: "Hora", value: p.timeLabel },
      { label: "Servicio", value: p.serviceName },
      { label: "Con", value: p.staffName },
      { label: "Dirección", value: "1130 SW 8th St, Miami, FL 33130" },
    ])}
    ${button("Ver / reprogramar cita", p.manageUrl)}
    ${paragraph(
      "Si necesitas hacer algún cambio, puedes hacerlo desde tu cuenta en cualquier momento."
    )}
  `;

  return emailShell({
    preheaderLabel: "02 · RECORDATORIO 24H",
    heroImageUrl: `https://www.${SITE.domain}/images/gloria/hair/hair-01.jpg`,
    heroImageAlt: "Gloria Beauty Salon",
    bodyHtml: body,
  });
}
