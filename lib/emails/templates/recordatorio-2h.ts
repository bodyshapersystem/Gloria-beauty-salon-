import { emailShell, greeting, paragraph, detailsCard, button, BRAND, SITE } from "../base";
import type { AppointmentEmailParams } from "./confirmacion-cita";

export function recordatorio2hEmail(p: AppointmentEmailParams) {
  const body = `
    ${greeting(p.clientName)}
    ${paragraph("Tu cita en Gloria Beauty Salon es en unas horas.")}
    ${detailsCard([
      { label: "Fecha", value: p.dateLabel },
      { label: "Hora", value: p.timeLabel },
      { label: "Servicio", value: p.serviceName },
      { label: "Con", value: p.staffName },
      { label: "Dirección", value: "1130 SW 8th St, Miami, FL 33130" },
    ])}
    ${button("Ver mi cita", p.manageUrl)}
    ${paragraph("Nos vemos pronto.")}
  `;

  const banner = `
  <tr>
    <td style="background:${BRAND.espresso};padding:22px 32px;">
      <div style="font-family:'Manrope',sans-serif;font-weight:700;font-size:20px;letter-spacing:0.5px;color:${BRAND.ivory};line-height:1.3;">
        TU CITA ES EN UNAS HORAS
      </div>
      <div style="font-family:'Manrope',sans-serif;font-size:13px;color:${BRAND.blush};margin-top:4px;">
        Estamos listas para recibirte
      </div>
    </td>
  </tr>`;

  return emailShell({
    preheaderLabel: "03 · RECORDATORIO 2H",
    heroImageUrl: `https://www.${SITE.domain}/images/gloria/hair/hair-01.jpg`,
    heroImageAlt: "Gloria Beauty Salon",
    afterHeroBannerHtml: banner,
    bodyHtml: body,
  });
}
