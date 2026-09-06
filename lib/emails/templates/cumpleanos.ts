import { emailShell, greeting, paragraph, button, BRAND, SITE } from "../base";

export function cumpleanosEmail(params: { clientName: string; bookUrl: string }) {
  const body = `
    <h1 style="font-family:'Manrope',sans-serif;font-weight:800;font-size:30px;line-height:1.15;color:${BRAND.espresso};margin:0 0 16px 0;">
      Happy Birthday<br/><em style="font-style:italic;font-weight:500;">Beautiful</em>
    </h1>
    ${greeting(params.clientName)}
    ${paragraph(
      "Hoy celebramos tu día ✨ Gracias por ser parte de la familia Gloria. Te deseamos un año lleno de belleza, amor y cosas lindas."
    )}
    ${button("Disfruta tu día", params.bookUrl)}
  `;

  return emailShell({
    preheaderLabel: "08 · MENSAJE ESPECIAL (CUMPLEAÑOS)",
    bodyHtml: body,
    showSocialFooter: true,
  });
}
