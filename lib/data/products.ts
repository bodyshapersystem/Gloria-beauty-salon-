export type Product = {
  slug: string;
  name: string;
  brand: string;
  size: string;
  description: string;
  photo: string;
  price: number | null; // null until confirmed
};

// TODO(shop): replace with a query to the `products` table once Stripe +
// Supabase are wired up (Phase 4). Prices are intentionally null until
// confirmed — never invent a price.
export const products: Product[] = [
  {
    slug: "truss-net-mask",
    name: "Net Mask",
    brand: "TRUSS",
    size: "550g / 19.40 oz",
    description:
      "Mascarilla condicionadora efecto fibra con nano-regeneración. Repara, hidrata y nutre todo tipo de cabello.",
    photo: "/images/gloria/shop/products/truss-net-mask.jpg",
    price: null,
  },
  {
    slug: "truss-amino-liponutriente",
    name: "Amino Liponutriente",
    brand: "TRUSS",
    size: "225ml / 7.61 fl.oz",
    description:
      "Potencializa la hidratación, desenreda y protege del calor al cepillar o planchar. Protección de color.",
    photo: "/images/gloria/shop/products/truss-amino-liponutriente.jpg",
    price: null,
  },
];
