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

const siteUrl = "https://www.gloriabeautysalonmiami.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Gloria Beauty Salon | Calle 8, Miami",
    template: "%s | Gloria Beauty Salon",
  },
  description:
    "Cabello, uñas, cejas, pestañas, bronceado y más, en un solo lugar. Beauty salon en el corazón de Calle 8, Miami.",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Gloria Beauty Salon",
    "salon de belleza Miami",
    "beauty salon Calle 8",
    "hair salon Miami",
    "nails Miami",
    "cejas Miami",
    "pestanas Miami",
    "spray tan Miami",
  ],
  openGraph: {
    title: "Gloria Beauty Salon | Calle 8, Miami",
    description: "Realza tu esencia, define tu estilo.",
    url: siteUrl,
    siteName: "Gloria Beauty Salon",
    locale: "es_US",
    type: "website",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Gloria Beauty Salon en Calle 8, Miami",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gloria Beauty Salon | Calle 8, Miami",
    description: "Cabello, uñas, cejas, pestañas, bronceado y más, en un solo lugar.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/app-icon-192.png", sizes: "192x192", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "Gloria Hub",
    statusBarStyle: "black-translucent",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "BeautySalon",
  "@id": `${siteUrl}/#business`,
  name: "Gloria Beauty Salon",
  url: siteUrl,
  telephone: "+13057815456",
  priceRange: "$$",
  image: `${siteUrl}/og-image.jpg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "1130 SW 8th St",
    addressLocality: "Miami",
    addressRegion: "FL",
    postalCode: "33130",
    addressCountry: "US",
  },
  areaServed: ["Miami", "Little Havana", "Calle 8", "Coral Gables", "Brickell"],
  sameAs: ["https://www.instagram.com/gloriabeautysalonmiami/"],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hair color and highlights" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Blowout and styling" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Nails and pedicure" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Brows and lashes" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Spray tan" } },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${manrope.variable}`}>
      <body className="bg-ivory text-espresso font-sans antialiased overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
