import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendMail } from "@/lib/emails/send";
import { dailyChecklistEmail } from "@/lib/emails/templates/daily-checklist";

const SUPABASE_URL = "https://ferznukzbfvzhjefcrye.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_iaAU9rgEtv0CaQCmOwuLgQ_rTNOY3-5";
const CRON_SECRET_FOR_DB = "gloria-cron-8f3a1d9c4b7e";

// Vercel Cron hits this every hour (see vercel.json). We only do the heavy
// lifting during the 7pm America/New_York hour, so this stays correct
// across daylight saving without needing two different cron schedules a
// year. The DB functions themselves are idempotent for a given day, so
// even if this fires more than once inside that hour, nobody gets a
// second email and nothing gets double-processed.
export async function GET(req: Request) {
  // Optional extra layer: if CRON_SECRET is set in Vercel env vars, require
  // it on the Authorization header (Vercel Cron sends this automatically
  // when the env var exists). If it's not set yet, we still run — the
  // Postgres-side secret above is the real gate against outside misuse.
  const authHeader = req.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  const nowInNY = new Date(
    new Date().toLocaleString("en-US", { timeZone: "America/New_York" })
  );
  const hourInNY = nowInNY.getHours();

  if (hourInNY !== 19) {
    return NextResponse.json({ ok: true, skipped: true, hourInNY });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

  const { data: autoCompletedCount, error: autoErr } = await supabase.rpc(
    "hub_auto_complete_past_appointments",
    { p_secret: CRON_SECRET_FOR_DB }
  );

  const { data: dueStaff, error: dueErr } = await supabase.rpc(
    "hub_create_daily_checklist_notifications",
    { p_secret: CRON_SECRET_FOR_DB }
  );

  if (autoErr || dueErr) {
    return NextResponse.json(
      { ok: false, autoErr: autoErr?.message, dueErr: dueErr?.message },
      { status: 500 }
    );
  }

  const rows = (dueStaff as { staff_id: string; staff_name: string; staff_email: string | null; pending_count: number }[]) || [];
  const emailResults: { staffName: string; ok: boolean }[] = [];

  for (const row of rows) {
    if (!row.staff_email) continue;
    const html = dailyChecklistEmail({
      staffName: row.staff_name,
      pendingCount: row.pending_count,
      checklistUrl: "https://www.gloriabeautysalonmiami.com/hub/my-agenda",
    });
    const result = await sendMail({
      to: row.staff_email,
      subject: `Confirma tu día — ${row.pending_count} cita${row.pending_count === 1 ? "" : "s"} pendiente${row.pending_count === 1 ? "" : "s"}`,
      html,
    });
    emailResults.push({ staffName: row.staff_name, ok: result.ok });
  }

  return NextResponse.json({
    ok: true,
    autoCompletedCount,
    notifiedStaff: rows.map((r) => r.staff_name),
    emailResults,
  });
}
