import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gloria Beauty Salon | Calle 8, Miami",
  description:
    "Cabello, uñas, cejas, pestañas, bronceado y más, en un solo lugar. Beauty salon en el corazón de Calle 8, Miami.",
  openGraph: {
    title: "Gloria Beauty Salon",
    description: "Realza tu esencia, define tu estilo.",
    locale: "es_US",
    type: "website",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/app-icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "Gloria",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="bg-ivory text-espresso font-sans antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
