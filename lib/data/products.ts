export type Product = {
  slug: string;
  name: string;
  brand: string;
  size: string;
  description: string;
  photo: string | null; // null until a photo is available
  price: number | null; // null until confirmed
};

// TODO(shop): replace with a query to the `products` table once Stripe +
// Supabase are wired up (Phase 4). Prices are as given by Gloria — never
// invent one. Photos: null until a real product photo is provided.
export const products: Product[] = [
  {
    slug: "truss-net-mask",
    name: "Net Mask",
    brand: "TRUSS",
    size: "550g / 19.40 oz",
    description:
      "Mascarilla condicionadora efecto fibra con nano-regeneración. Repara, hidrata y nutre todo tipo de cabello.",
    photo: "/images/gloria/shop/products/truss-net-mask.jpg",
    price: 45,
  },
  {
    slug: "truss-amino-liponutriente",
    name: "Amino Liponutriente",
    brand: "TRUSS",
    size: "225ml / 7.61 fl.oz",
    description:
      "Potencializa la hidratación, desenreda y protege del calor al cepillar o planchar. Protección de color.",
    photo: "/images/gloria/shop/products/truss-amino-liponutriente.jpg",
    price: 40,
  },
  {
    slug: "truss-shampoo",
    name: "Shampoo",
    brand: "TRUSS",
    size: "300ml / 10.14 fl.oz",
    description:
      "Shampoo profesional TRUSS para el cuidado diario del cabello.",
    photo: "/images/gloria/shop/products/truss-shampoo.jpg",
    price: 30,
  },
  {
    slug: "truss-deluxe-prime",
    name: "Deluxe Prime",
    brand: "TRUSS",
    size: "260ml / 8.79 fl.oz",
    description:
      "Spray reconstructor con proteína. Repara, desenreda y deja el cabello suave y sedoso.",
    photo: "/images/gloria/shop/products/truss-deluxe-prime.jpg",
    price: 35,
  },
  {
    slug: "truss-frizz-zero",
    name: "Frizz Zero",
    brand: "TRUSS",
    size: "260ml / 9.15 fl.oz",
    description:
      "Máscara líquida con protección térmica. Sella la cutícula, da brillo intenso y disciplina el frizz.",
    photo: "/images/gloria/shop/products/truss-frizz-zero.jpg",
    price: 40,
  },
];
