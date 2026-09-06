export type ServiceItem = {
  name: string;
  duration: string;
  price: string;
};

export type ServiceCategory = {
  index: string;
  slug: string;
  name: string;
  tagline: string;
  photo: string;
  items: ServiceItem[];
};

// TODO(hub): replace with a query to `service_categories` + `services`
// once Gloria On Demand / Gloria Hub are wired up (Phase 2 & 5). Prices
// and durations here mirror the approved GLORIA BEAUTY SALON — SERVICE
// MENU exactly — do not change without an explicit update from Gloria.
// Availability is still only confirmed inside Gloria On Demand; this
// page is informational, not the booking engine.
export const serviceCategories: ServiceCategory[] = [
  {
    index: "01",
    slug: "hair",
    name: "Hair",
    tagline:
      "Cortes, color y transformaciones, cuidando siempre la salud de la fibra capilar.",
    photo: "/images/gloria/hair/hair-01.jpg",
    items: [
      { name: "Women's Haircut", duration: "30 min", price: "$40" },
      { name: "Men's Haircut", duration: "30 min", price: "$30" },
      { name: "Blowdry — Short", duration: "20 min", price: "$30" },
      { name: "Blowdry — Medium", duration: "30 min", price: "$40" },
      { name: "Blowdry — Long", duration: "40 min", price: "$50" },
      { name: "Root Color", duration: "50 min", price: "$70" },
      { name: "Full Color", duration: "1h 10min", price: "$100" },
      { name: "Partial Highlights", duration: "1h", price: "$170" },
      { name: "Full Highlights", duration: "2h", price: "$230" },
      { name: "Balayage", duration: "3–8h", price: "Starting at $250" },
      { name: "Keratin — Short Hair", duration: "1h", price: "$100" },
      { name: "Keratin — Medium Hair", duration: "2h", price: "$150" },
      { name: "Keratin — Long Hair", duration: "2h 30min", price: "$220" },
      { name: "Hair Botox — Short Hair", duration: "1h", price: "$80" },
      { name: "Hair Botox — Medium Hair", duration: "2h", price: "$140" },
      { name: "Hair Botox — Long Hair", duration: "2h 30min", price: "$180" },
      { name: "Braids", duration: "Starting at 30 min", price: "Starting at $30" },
      {
        name: "Tape Extensions — Application",
        duration: "1h",
        price: "$100–$150",
      },
    ],
  },
  {
    index: "02",
    slug: "nails",
    name: "Nails",
    tagline: "Manicure y pedicure con precisión, para un acabado impecable.",
    photo: "/images/gloria/nails/nails-01.jpg",
    items: [
      { name: "Regular Manicure", duration: "30 min", price: "$25" },
      { name: "Regular Pedicure", duration: "45 min", price: "$35" },
      { name: "Gel Manicure", duration: "35 min", price: "$35" },
      { name: "Gel Pedicure", duration: "40 min", price: "$40" },
      { name: "Aprés Manicure", duration: "1h", price: "$60" },
      { name: "DIP Manicure", duration: "45 min", price: "$45" },
      { name: "Polygel", duration: "45 min", price: "$50" },
      {
        name: "Full Set Acrylic — Hands",
        duration: "1h 20min",
        price: "$70",
      },
    ],
  },
  {
    index: "03",
    slug: "brows",
    name: "Brows",
    tagline: "El marco perfecto para tu mirada.",
    photo: "/images/gloria/brows/brows-01.jpg",
    items: [
      { name: "Brow Shaping", duration: "15 min", price: "$20" },
      { name: "Upper Lip Wax", duration: "10 min", price: "$10" },
      { name: "Henna Brows", duration: "10 min", price: "$10" },
    ],
  },
  {
    index: "04",
    slug: "lashes",
    name: "Lashes",
    tagline: "Volumen y definición, a la medida de tu mirada.",
    photo: "/images/gloria/lashes/lashes-01.jpg",
    items: [
      { name: "Classic Lashes", duration: "1h", price: "$80" },
      { name: "Greek Lashes", duration: "1h", price: "$100" },
      { name: "Hybrid Lashes", duration: "1h 30min", price: "$120" },
      { name: "Mega Volume", duration: "2h", price: "$140" },
    ],
  },
  {
    index: "05",
    slug: "tanning",
    name: "Tanning",
    tagline: "Un glow natural, todo el año.",
    photo: "/images/gloria/tanning/tanning-01.jpg",
    items: [
      { name: "Regular Spray Tan", duration: "30 min", price: "$75" },
      { name: "Express Spray Tan", duration: "30 min", price: "$85" },
    ],
  },
  {
    index: "06",
    slug: "makeup",
    name: "Makeup",
    tagline: "Belleza lista para brillar, dentro y fuera del salón.",
    photo: "/images/gloria/makeup/makeup-01.jpg",
    items: [{ name: "Makeup Application", duration: "1h", price: "$100" }],
  },
];
