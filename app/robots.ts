import type { MetadataRoute } from "next";

const siteUrl = "https://www.gloriabeautysalonmiami.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/servicios",
          "/reservar",
          "/galeria",
          "/equipo",
          "/sobre-gloria",
          "/shop",
          "/memberships",
          "/access",
          "/access/book",
          "/access/shop",
          "/beauty-dna-lab",
        ],
        disallow: [
          "/hub",
          "/hub/",
          "/hub-login",
          "/hub-reset-password",
          "/hub-forgot-password",
          "/api/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
