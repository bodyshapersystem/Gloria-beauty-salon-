import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { confirmacionDeCitaEmail } from "@/lib/emails/templates/confirmacion-cita";
import { sendMail } from "@/lib/emails/send";

const supabase = createClient(
  "https://ferznukzbfvzhjefcrye.supabase.co",
  "sb_publishable_iaAU9rgEtv0CaQCmOwuLgQ_rTNOY3-5"
);

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { clientName, clientEmail, serviceId, staffId, startAt } = body ?? {};

    if (!clientEmail || !clientName || !serviceId || !staffId || !startAt) {
      // Nothing to send (e.g. client didn't give an email) — not an error.
      return NextResponse.json({ ok: true, skipped: "missing_fields" });
    }

    const [{ data: service }, { data: staff }] = await Promise.all([
      supabase.from("services").select("name").eq("id", serviceId).single(),
      supabase.from("staff").select("name").eq("id", staffId).single(),
    ]);

    if (!service || !staff) {
      return NextResponse.json({ ok: true, skipped: "lookup_failed" });
    }

    const start = new Date(startAt);
    const dateLabel = start.toLocaleDateString("es-US", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "America/New_York",
    });
    const timeLabel = start.toLocaleTimeString("es-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "America/New_York",
    });

    const html = confirmacionDeCitaEmail({
      clientName: escapeHtml(String(clientName)).slice(0, 120),
      dateLabel,
      timeLabel,
      serviceName: service.name,
      staffName: staff.name,
      manageUrl: "https://www.gloriabeautysalonmiami.com/reservar",
    });

    const result = await sendMail({
      to: String(clientEmail),
      subject: "Tu cita en Gloria Beauty Salon está confirmada",
      html,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("send-confirmation error:", err);
    // Always 200 — a failed email must never surface as a booking error.
    return NextResponse.json({ ok: false, error: "exception" });
  }
}
