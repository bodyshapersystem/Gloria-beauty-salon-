export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  services: string;
  photo: string;
  featured?: boolean;
};

// TODO(hub): replace with a query to the `staff` table once Gloria Hub
// and Supabase are wired up (Phase 5). Shape mirrors that table's
// public-facing fields intentionally.
export const team: TeamMember[] = [
  {
    slug: "gloria",
    name: "Gloria",
    role: "Fundadora · Master Stylist",
    services: "Cortes · Color · Balayage · Blowdry · Keratin",
    photo: "/images/gloria/team/gloria.jpg",
    featured: true,
  },
  {
    slug: "nudis",
    name: "Nudis",
    role: "Hair Stylist · Colorist",
    services: "Cortes · Color · Balayage · Braids",
    photo: "/images/gloria/team/nudis.jpg",
  },
  {
    slug: "diana",
    name: "Diana",
    role: "Nails · Brows · Waxing · Makeup",
    services: "Manicure · Pedicure · Cejas · Maquillaje",
    photo: "/images/gloria/team/diana-hero.jpg",
  },
  {
    slug: "caro",
    name: "Caro",
    role: "Lash Artist",
    services: "Clásicas · Griegas · Híbridas · Mega Volumen",
    photo: "/images/gloria/team/caro.jpg",
  },
  {
    slug: "emmy",
    name: "Emmy",
    role: "Spray Tan Specialist",
    services: "Bronceado regular · Bronceado express",
    photo: "/images/gloria/team/emmy.jpg",
  },
];

export const teamGroupPhoto = "/images/gloria/team/group.jpg";
