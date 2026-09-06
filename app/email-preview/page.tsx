import { confirmacionDeCitaEmail } from "@/lib/emails/templates/confirmacion-cita";
import { recordatorio24hEmail } from "@/lib/emails/templates/recordatorio-24h";
import { recordatorio2hEmail } from "@/lib/emails/templates/recordatorio-2h";
import { postCitaEmail } from "@/lib/emails/templates/post-cita";
import {
  rebookingManicureEmail,
  rebookingBlowoutEmail,
  rebookingColorEmail,
} from "@/lib/emails/templates/rebooking-reminders";
import { cumpleanosEmail } from "@/lib/emails/templates/cumpleanos";

const sampleAppointment = {
  clientName: "María",
  dateLabel: "Jueves, 12 de Septiembre, 2024",
  timeLabel: "10:00 AM",
  serviceName: "Manicure en Gel",
  staffName: "Diana",
  manageUrl: "https://www.gloriabeautysalonmiami.com/reservar",
};

const templates: { title: string; html: string }[] = [
  {
    title: "01 · Confirmación de cita",
    html: confirmacionDeCitaEmail(sampleAppointment),
  },
  {
    title: "02 · Recordatorio 24h",
    html: recordatorio24hEmail({
      ...sampleAppointment,
      serviceName: "Blowdry",
      staffName: "Nudis",
    }),
  },
  {
    title: "03 · Recordatorio 2h",
    html: recordatorio2hEmail({
      ...sampleAppointment,
      dateLabel: "Hoy, 13 de Septiembre, 2024",
      serviceName: "Blowdry",
      staffName: "Nudis",
    }),
  },
  {
    title: "04 · Post cita (Thank you)",
    html: postCitaEmail({
      clientName: "María",
      bookAgainUrl: "https://www.gloriabeautysalonmiami.com/reservar",
    }),
  },
  {
    title: "05 · Rebooking reminder (Manicure)",
    html: rebookingManicureEmail({
      clientName: "María",
      bookUrl: "https://www.gloriabeautysalonmiami.com/reservar",
    }),
  },
  {
    title: "06 · Rebooking reminder (Blowout)",
    html: rebookingBlowoutEmail({
      clientName: "María",
      bookUrl: "https://www.gloriabeautysalonmiami.com/reservar",
    }),
  },
  {
    title: "07 · Rebooking reminder (Color)",
    html: rebookingColorEmail({
      clientName: "María",
      bookUrl: "https://www.gloriabeautysalonmiami.com/reservar",
    }),
  },
  {
    title: "08 · Mensaje especial (Cumpleaños)",
    html: cumpleanosEmail({
      clientName: "María",
      bookUrl: "https://www.gloriabeautysalonmiami.com/reservar",
    }),
  },
];

export default function EmailPreviewPage() {
  return (
    <div style={{ background: "#EDE9E2", padding: "40px 24px", minHeight: "100vh" }}>
      <div style={{ maxWidth: 1300, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "sans-serif", fontSize: 14, letterSpacing: 2, color: "#6B4F43", marginBottom: 24 }}>
          GLORIA — EMAIL TEMPLATES (internal preview, not linked in the site nav)
        </h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 28,
          }}
        >
          {templates.map((t) => (
            <div key={t.title}>
              <div style={{ fontFamily: "sans-serif", fontSize: 12, color: "#2E2724", marginBottom: 8, fontWeight: 700 }}>
                {t.title}
              </div>
              <iframe
                srcDoc={t.html}
                title={t.title}
                style={{
                  width: "100%",
                  height: 640,
                  border: "1px solid #D9CFC3",
                  background: "#fff",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
