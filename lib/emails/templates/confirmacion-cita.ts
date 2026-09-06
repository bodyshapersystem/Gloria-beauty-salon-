import { emailShell, heading, greeting, paragraph, detailsCard, button } from "../base";

export type AppointmentEmailParams = {
  clientName: string;
  dateLabel: string; // e.g. "Jueves, 12 de Septiembre, 2024"
  timeLabel: string; // e.g. "10:00 AM"
  serviceName: string;
  staffName: string;
  manageUrl: string; // link to view/reschedule the appointment
};

export function confirmacionDeCitaEmail(p: AppointmentEmailParams) {
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
  `;

  return emailShell({
    preheaderLabel: "01 · CONFIRMACIÓN DE CITA",
    bodyHtml: body,
  });
}
