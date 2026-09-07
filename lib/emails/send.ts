import { Resend } from "resend";
import { SITE } from "./base";

// Server-only. RESEND_API_KEY lives in Vercel env vars — never in the repo.
// This file must only be imported from server code (API routes, RSC),
// never from a "use client" component — that would leak the key.

let resendClient: Resend | null = null;

function getClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!resendClient) resendClient = new Resend(apiKey);
  return resendClient;
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  const client = getClient();
  if (!client) {
    // Fails soft: booking/whatever triggered this should never break just
    // because the email couldn't go out (e.g. key not configured yet).
    console.error("RESEND_API_KEY is not set — skipping email send.");
    return { ok: false, error: "not_configured" };
  }

  try {
    const { error } = await client.emails.send({
      from: `${SITE.fromName} <${SITE.fromAddress}>`,
      to: opts.to,
      replyTo: SITE.replyToAddress,
      subject: opts.subject,
      html: opts.html,
    });
    if (error) {
      console.error("Resend send error:", error);
      return { ok: false, error: error.message };
    }
    return { ok: true };
  } catch (err) {
    console.error("Resend send exception:", err);
    return { ok: false, error: "exception" };
  }
}
