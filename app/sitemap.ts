import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

const publicRoutes = [
  "",
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
];

export default function sitemap(): MetadataRoute.Sitemap {
  return publicRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/reservar" ? 0.9 : 0.7,
  }));
}
