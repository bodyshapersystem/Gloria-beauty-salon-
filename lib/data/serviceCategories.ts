// Same category → color mapping used on the Servicios page, so appointments
// can be visually grouped by service type the same way.

export const categoryMeta: Record<string, { label: string; bg: string }> = {
  hair: { label: "Hair", bg: "linear-gradient(135deg,#6B4F43,#3E2C27)" },
  color: { label: "Color & Tintes", bg: "linear-gradient(135deg,#7A3D48,#4B2D33)" },
  blowdry: { label: "Secado & Estilismo", bg: "linear-gradient(135deg,#A98273,#6B4F43)" },
  cut: { label: "Corte", bg: "linear-gradient(135deg,#59433A,#302521)" },
  treatment: { label: "Tratamientos", bg: "linear-gradient(135deg,#D9C4B4,#AE8D77)" },
  extensions: { label: "Extensiones", bg: "linear-gradient(135deg,#8D665B,#5A4039)" },
  nails: { label: "Nails", bg: "linear-gradient(135deg,#E7C9C8,#B77F84)" },
  lashes: { label: "Pestañas", bg: "linear-gradient(135deg,#6E5564,#3E3138)" },
  brows: { label: "Cejas & Wax", bg: "linear-gradient(135deg,#CBAA8E,#9B7455)" },
  makeup: { label: "Maquillaje", bg: "linear-gradient(135deg,#C9909C,#8A5B69)" },
  tanning: { label: "Spray Tan", bg: "linear-gradient(135deg,#C59662,#8F633E)" },
};

export function normalizeServiceCategory(name: string | undefined | null, category: string | undefined | null): string {
  const n = (name || "").toLowerCase();
  const c = (category || "").toLowerCase();
  if (["nails", "lashes", "brows", "makeup", "tanning"].includes(c)) return c;
  if (n.includes("balayage") || n.includes("highlight") || n.includes("root") || n.includes("tinte") || n.includes("color")) return "color";
  if (n.includes("blow") || n.includes("secado") || n.includes("braid") || n.includes("peinado") || n.includes("style")) return "blowdry";
  if (n.includes("cut") || n.includes("corte")) return "cut";
  if (n.includes("botox") || n.includes("keratin") || n.includes("tratamiento")) return "treatment";
  if (n.includes("extension")) return "extensions";
  return c === "hair" ? "hair" : c || "hair";
}

export function categoryBg(name: string | undefined | null, category: string | undefined | null): string {
  const key = normalizeServiceCategory(name, category);
  return categoryMeta[key]?.bg || categoryMeta.hair.bg;
}
