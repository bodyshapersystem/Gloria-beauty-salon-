import { emailShell, greeting, paragraph, button, BRAND, SITE } from "../base";

export function postCitaEmail(params: { clientName: string; bookAgainUrl: string }) {
  const intro = `
    <div style="text-align:center;margin-bottom:8px;">
      <span style="font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:38px;color:${BRAND.espresso};">Gracias</span><br/>
      <span style="font-family:'Manrope',sans-serif;font-size:12px;letter-spacing:3px;color:${BRAND.taupe};">POR VENIR</span>
    </div>`;

  const body = `
    ${intro}
    ${greeting(params.clientName)}
    ${paragraph(
      "Gracias por tu visita a Gloria Beauty Salon. Esperamos que hayas disfrutado tu experiencia tanto como nosotras disfrutamos atenderte."
    )}
  `;

  const closingBanner = `
  <tr>
    <td style="background:${BRAND.espresso};padding:24px 32px;">
      <div style="font-family:'Manrope',sans-serif;font-weight:700;font-size:18px;color:${BRAND.ivory};line-height:1.4;">
        TU BELLEZA SIEMPRE SERA<br/>NUESTRA INSPIRACION.
      </div>
      ${button("Reserva tu próxima cita", params.bookAgainUrl, "light")}
    </td>
  </tr>`;

  return emailShell({
    preheaderLabel: "04 · POST CITA (THANK YOU)",
    heroImageUrl: `https://www.${SITE.domain}/images/gloria/lashes/lashes-01.jpg`,
    heroImageAlt: "Gracias por venir",
    afterHeroBannerHtml: closingBanner,
    bodyHtml: body,
    showSocialFooter: true,
  });
}
