import { emailShell, heading, greeting, paragraph, button, detailsCard } from "../base";

export type TeamWelcomeEmailParams = {
  staffName: string;
  activateUrl: string;
};

export function teamWelcomeEmail(p: TeamWelcomeEmailParams) {
  const body = `
    ${heading("Bienvenida al", "Gloria Team ✨")}
    ${greeting(p.staffName)}
    ${paragraph("Gracias por ser parte de Gloria Beauty Salon. Tu talento, tu trabajo y la manera en que haces sentir a cada clienta son parte de lo que hace que nuestro salón siga creciendo cada día.")}
    ${paragraph("Ahora queremos hacer tu experiencia dentro del salón mucho más fácil. Creamos un espacio especialmente para nuestro equipo para que puedas tener todo más organizado y sentir que llevas tu trabajo contigo, sin complicaciones.")}
    ${detailsCard([
      { label: "Tu espacio", value: "Citas + clientas + servicios + progreso" },
      { label: "Tu control", value: "Tu semana, tus ingresos y tu corte" },
      { label: "Tu acceso", value: "Gloria Team" },
    ])}
    ${paragraph("Tu Gloria Team ya está listo. Solo falta activar tu cuenta aquí abajo.")}
    ${button("Activar mi cuenta", p.activateUrl)}
    ${paragraph("Nos hace demasiada ilusión seguir construyendo todo esto juntas. Sigamos creciendo, creando y haciendo cosas bonitas 🥰")}
  `;

  return emailShell({
    preheaderLabel: "GLORIA TEAM · BIENVENIDA",
    bodyHtml: body,
  });
}
