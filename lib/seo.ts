import type { Metadata } from "next";

export const siteUrl = "https://www.gloriabeautysalonmiami.com";

export const seo = {
  name: "Gloria Beauty Salon",
  title: "Gloria Beauty Salon | Salon de belleza en Calle 8, Miami",
  description:
    "Salon de belleza en Calle 8, Miami para cabello, color, balayage, blowouts, unas, cejas, pestanas, maquillaje y spray tan.",
  address: "1130 SW 8th St, Miami, FL 33130",
  phone: "+13057815456",
  instagramUrl: "https://www.instagram.com/gloriabeautysalon_/",
  facebookUrl: "https://www.facebook.com/iamgloriastylist",
  ogImage: "/og-image.jpg",
};

type PageSeo = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
};

export function createPageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
}: PageSeo): Metadata {
  const url = `${siteUrl}${path}`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    keywords: [
      "Gloria Beauty Salon",
      "salon de belleza Miami",
      "beauty salon Calle 8",
      "hair salon Miami",
      "nail salon Miami",
      "cejas Miami",
      "pestanas Miami",
      ...keywords,
    ],
    openGraph: {
      title,
      description,
      url,
      siteName: seo.name,
      locale: "es_US",
      type: "website",
      images: [
        {
          url: seo.ogImage,
          width: 1200,
          height: 630,
          alt: `${seo.name} en Calle 8, Miami`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [seo.ogImage],
    },
  };
}
