// Shared HTML shell for every Gloria Beauty Salon transactional/marketing
// email. Table-based layout with inline styles — this is required for
// consistent rendering across email clients (Gmail, Outlook, Apple Mail),
// which don't support modern CSS (flexbox, grid, external stylesheets).
//
// NOT wired up yet: this is the template layer only. Sending via Resend
// and the automation triggers (booking confirmed, 24h/2h before, post-visit,
// rebooking cadence, birthday) are a separate next step.

export const BRAND = {
  ivory: "#F8F5EF",
  champagne: "#D4B896",
  taupe: "#A68F7B",
  mocha: "#6B4F43",
  espresso: "#2E2724",
  blush: "#EAD6D1",
};

export const SITE = {
  name: "Gloria Beauty Salon",
  tagline: "Realza tu esencia, define tu estilo.",
  address: "1130 SW 8th St, Miami, FL 33130",
  phone: "+1 (305) 781-5456",
  domain: "gloriabeautysalonmiami.com",
  // Master "from" address for every automated email in the Gloria ecosystem
  // (booking confirmations/reminders, Hub notifications, Access invites,
  // rebooking/birthday sends). Sending-only — no inbox behind it, so never
  // present this as a reply-to or support address.
  fromAddress: "reservas@gloriabeautysalonmiami.com",
  fromName: "Gloria Beauty Salon",
  logoUrl: "https://www.gloriabeautysalonmiami.com/images/gloria/logo/gloria-logo.png",
};

const FONT_SERIF =
  "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
const FONT_SANS =
  "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";

export function button(label: string, href: string, variant: "dark" | "light" = "dark") {
  const bg = variant === "dark" ? BRAND.espresso : BRAND.ivory;
  const color = variant === "dark" ? BRAND.ivory : BRAND.espresso;
  const border = variant === "dark" ? BRAND.espresso : BRAND.espresso;
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0;">
    <tr>
      <td style="background:${bg};border:1px solid ${border};border-radius:2px;">
        <a href="${href}" style="display:inline-block;padding:14px 30px;font-family:${FONT_SANS};font-size:12px;font-weight:700;letter-spacing:1.5px;color:${color};text-decoration:none;">
          ${label.toUpperCase()}
        </a>
      </td>
    </tr>
  </table>`;
}

export type DetailRow = { label: string; value: string };

export function detailsCard(rows: DetailRow[]) {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.blush}22;border:1px solid ${BRAND.taupe}44;margin:22px 0;">
    <tr><td style="padding:20px 22px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ${rows
          .map(
            (r, i) => `
        <tr>
          <td style="padding:${i === 0 ? "0" : "10px"} 0 0 0;font-family:${FONT_SANS};font-size:11px;letter-spacing:1px;color:${BRAND.taupe};text-transform:uppercase;width:110px;vertical-align:top;">${r.label}</td>
          <td style="padding:${i === 0 ? "0" : "10px"} 0 0 0;font-family:${FONT_SANS};font-size:14px;color:${BRAND.espresso};vertical-align:top;">${r.value}</td>
        </tr>`
          )
          .join("")}
      </table>
    </td></tr>
  </table>`;
}

export function emailShell(opts: {
  preheaderLabel: string; // small kicker shown top-right, e.g. "01 · CONFIRMACIÓN DE CITA"
  heroImageUrl?: string; // optional full-width photo under the header
  heroImageAlt?: string;
  afterHeroBannerHtml?: string; // optional dark text band directly under the hero photo (its own <tr><td>...)
  bodyHtml: string; // main content, already-built HTML (headings, paragraphs, details card, button)
  showSocialFooter?: boolean; // rich footer with social icons (post-visit / rebooking / birthday style)
}) {
  const { preheaderLabel, heroImageUrl, heroImageAlt, afterHeroBannerHtml, bodyHtml, showSocialFooter } = opts;

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${SITE.name}</title>
</head>
<body style="margin:0;padding:0;background:#EDE9E2;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EDE9E2;padding:32px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:${BRAND.ivory};max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:26px 32px 18px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <img src="${SITE.logoUrl}" width="84" alt="${SITE.name}" style="display:block;" />
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="font-family:${FONT_SANS};font-size:10px;letter-spacing:1px;color:${BRAND.taupe};">${preheaderLabel}</span>
                  </td>
                </tr>
              </table>
              <div style="font-family:${FONT_SANS};font-size:10px;letter-spacing:2.5px;color:${BRAND.taupe};margin-top:14px;">
                HAIR &nbsp;·&nbsp; NAILS &nbsp;·&nbsp; BROWS &nbsp;·&nbsp; LASHES &nbsp;·&nbsp; TANNING &nbsp;·&nbsp; MAKEUP
              </div>
            </td>
          </tr>

          ${
            heroImageUrl
              ? `
          <tr>
            <td>
              <img src="${heroImageUrl}" alt="${heroImageAlt ?? ""}" width="600" style="display:block;width:100%;max-width:600px;height:auto;" />
            </td>
          </tr>`
              : ""
          }
          ${afterHeroBannerHtml ?? ""}

          <!-- Body -->
          <tr>
            <td style="padding:30px 32px 10px 32px;font-family:${FONT_SANS};color:${BRAND.espresso};">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Signature -->
          <tr>
            <td style="padding:6px 32px 26px 32px;">
              <div style="font-family:${FONT_SERIF};font-style:italic;font-size:18px;color:${BRAND.mocha};">Beauty Lives Here.</div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top:1px solid ${BRAND.taupe}33;padding:20px 32px 28px 32px;">
              ${
                showSocialFooter
                  ? `
              <div style="margin-bottom:12px;">
                <a href="https://instagram.com/gloriabeautysalon_" style="text-decoration:none;color:${BRAND.espresso};font-family:${FONT_SANS};font-size:12px;margin-right:14px;">Instagram</a>
                <a href="https://facebook.com/iamgloriastylist" style="text-decoration:none;color:${BRAND.espresso};font-family:${FONT_SANS};font-size:12px;margin-right:14px;">Facebook</a>
                <a href="https://www.${SITE.domain}" style="text-decoration:none;color:${BRAND.espresso};font-family:${FONT_SANS};font-size:12px;">TikTok</a>
              </div>`
                  : ""
              }
              <div style="font-family:${FONT_SANS};font-size:11px;color:${BRAND.taupe};line-height:1.7;">
                ${SITE.address}<br />
                ${SITE.phone}<br />
                ${SITE.domain.toUpperCase()}
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export const heading = (line1: string, line2Italic?: string) => `
  <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-weight:500;font-size:32px;line-height:1.15;color:${BRAND.espresso};margin:0 0 18px 0;">
    ${line1}${line2Italic ? `<br/><em style="font-style:italic;color:${BRAND.mocha};font-weight:400;">${line2Italic}</em>` : ""}
  </h1>`;

export const greeting = (clientName: string) => `
  <p style="font-family:'Manrope',sans-serif;font-size:14.5px;margin:0 0 14px 0;">Hola, ${clientName} ✨</p>`;

export const paragraph = (text: string) => `
  <p style="font-family:'Manrope',sans-serif;font-size:14px;line-height:1.7;color:${BRAND.mocha};margin:0 0 4px 0;">${text}</p>`;
