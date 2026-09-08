import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Gloria Beauty Salon",
    short_name: "Gloria",
    description: "Gloria Hub, Gloria Access y tus citas en un solo lugar.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF8F3",
    theme_color: "#713943",
    orientation: "portrait",
    icons: [
      {
        src: "/app-icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/app-icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
