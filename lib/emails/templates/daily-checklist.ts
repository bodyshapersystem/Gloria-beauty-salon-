import { emailShell, heading, greeting, paragraph, button } from "../base";

export type DailyChecklistEmailParams = {
  staffName: string;
  pendingCount: number;
  checklistUrl: string;
};

export function dailyChecklistEmail(p: DailyChecklistEmailParams) {
  const body = `
    ${heading("Confirma tu", "día de hoy")}
    ${greeting(p.staffName)}
    ${paragraph(
      `Terminando el día, tienes ${p.pendingCount} cita${p.pendingCount === 1 ? "" : "s"} que todavía no se marcó como completada. Entra a Gloria Team y confirma cuáles se hicieron — así tu progreso e ingresos quedan correctos.`
    )}
    ${button("Ver mi checklist", p.checklistUrl)}
    ${paragraph(
      "Si no las confirmas, el sistema las va a marcar como completadas automáticamente al día siguiente — mejor revisarlas tú misma por si alguna se canceló o no se presentó."
    )}
  `;

  return emailShell({
    preheaderLabel: "GLORIA TEAM · CHECKLIST DEL DÍA",
    bodyHtml: body,
  });
}
