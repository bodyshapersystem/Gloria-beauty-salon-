import { emailShell, heading, greeting, paragraph, detailsCard, button } from "../base";

export type AppointmentEmailParams = {
  clientName: string;
  dateLabel: string;
  timeLabel: string;
  serviceName: string;
  staffName: string;
  manageUrl: string;
  accessActivationUrl?: string | null;
};

export function confirmacionDeCitaEmail(p: AppointmentEmailParams) {
  const accessBlock = p.accessActivationUrl
    ? `
      <div style="height:1px;background:#A68F7B33;margin:30px 0 24px 0;"></div>
      ${heading("Tu belleza,", "todo en un solo lugar")}
      ${paragraph("Si quieres, puedes activar Gloria Access y tener tus citas, reprogramaciones, Beauty Profile interactivo, recomendaciones y productos favoritos siempre contigo.")}
      ${paragraph("Es completamente opcional y no necesitas una cuenta para reservar con nosotros.")}
      ${button("Activar Gloria Access", p.accessActivationUrl)}
    `
    : "";

  const body = `
    ${heading("Tu cita está", "confirmada")}
    ${greeting(p.clientName)}
    ${paragraph(
      "Gracias por confiar en Gloria Beauty Salon. Tu cita ha sido confirmada y estamos emocionadas de recibirte."
    )}
    ${detailsCard([
      { label: "Fecha", value: p.dateLabel },
      { label: "Hora", value: p.timeLabel },
      { label: "Servicio", value: p.serviceName },
      { label: "Con", value: p.staffName },
      { label: "Dirección", value: "1130 SW 8th St, Miami, FL 33130" },
    ])}
    ${button("Ver mi cita", p.manageUrl)}
    ${paragraph(
      "Si necesitas hacer algún cambio, puedes reprogramar tu cita en cualquier momento."
    )}
    ${accessBlock}
  `;

  return emailShell({
    preheaderLabel: "01 · CONFIRMACIÓN DE CITA",
    bodyHtml: body,
  });
}
