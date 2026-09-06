import { emailShell, button, BRAND, SITE } from "../base";

type RebookingParams = {
  clientName: string;
  bookUrl: string;
};

function rebookingEmail(opts: {
  index: string;
  heroImageUrl: string;
  headingLine1: string;
  headingLine2: string;
  message: string;
  buttonLabel: string;
  buttonVariant?: "dark" | "light";
  bookUrl: string;
}) {
  const {
    index,
    heroImageUrl,
    headingLine1,
    headingLine2,
    message,
    buttonLabel,
    buttonVariant = "dark",
    bookUrl,
  } = opts;

  const body = `
    <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-weight:500;font-size:28px;line-height:1.2;color:${BRAND.espresso};margin:0 0 14px 0;">
      ${headingLine1}<br/>${headingLine2}
    </h1>
    <p style="font-family:'Manrope',sans-serif;font-size:14px;line-height:1.7;color:${BRAND.mocha};margin:0 0 4px 0;">
      ${message}
    </p>
    ${button(buttonLabel, bookUrl, buttonVariant)}
  `;

  return emailShell({
    preheaderLabel: index,
    heroImageUrl,
    heroImageAlt: headingLine1,
    bodyHtml: body,
    showSocialFooter: true,
  });
}

export function rebookingManicureEmail(p: RebookingParams) {
  return rebookingEmail({
    index: "05 · REBOOKING REMINDER (MANICURE)",
    heroImageUrl: `https://www.${SITE.domain}/images/gloria/nails/nails-01.jpg`,
    headingLine1: "It might",
    headingLine2: "be time for a little refresh.",
    message: "Ya pasaron un par de semanas desde tu ultimo manicure. Agendamos el proximo?",
    buttonLabel: "Reserva tu manicure",
    bookUrl: p.bookUrl,
  });
}

export function rebookingBlowoutEmail(p: RebookingParams) {
  return rebookingEmail({
    index: "06 · REBOOKING REMINDER (BLOWOUT)",
    heroImageUrl: `https://www.${SITE.domain}/images/gloria/hair/hair-01.jpg`,
    headingLine1: "Need",
    headingLine2: "a fresh blowout?",
    message: "Ya paso una semana desde tu ultimo secado. Vamos a devolverle ese movimiento y brillo a tu pelo.",
    buttonLabel: "Reserva tu blowout",
    bookUrl: p.bookUrl,
  });
}

export function rebookingColorEmail(p: RebookingParams) {
  return rebookingEmail({
    index: "07 · REBOOKING REMINDER (COLOR)",
    heroImageUrl: `https://www.${SITE.domain}/images/gloria/hair/hair-01.jpg`,
    headingLine1: "Your highlights",
    headingLine2: "might be ready for a refresh.",
    message: "Manten tu color luminoso y bien cuidado. Te esperamos para tu proxima cita.",
    buttonLabel: "Reserva tu color",
    buttonVariant: "light",
    bookUrl: p.bookUrl,
  });
}
