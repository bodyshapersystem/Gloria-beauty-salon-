import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { seo, siteUrl } from "@/lib/seo";
import "./globals.css";
import { CartProvider } from "@/lib/cart/CartContext";
import { CartDrawer } from "@/components/public/CartDrawer";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

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
  metadataBase: new URL(siteUrl),
  title: {
    default: seo.title,
    template: "%s | Gloria Beauty Salon",
  },
  description: seo.description,
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Gloria Beauty Salon",
    "salon de belleza Miami",
    "beauty salon Calle 8",
    "hair salon Miami",
    "nail salon Miami",
    "balayage Miami",
    "blowout Miami",
    "cejas Miami",
    "pestanas Miami",
    "spray tan Miami",
  ],
  openGraph: {
    title: seo.title,
    description: seo.description,
    url: siteUrl,
    siteName: seo.name,
    locale: "es_US",
    type: "website",
    images: [
      {
        url: seo.ogImage,
        width: 1200,
        height: 630,
        alt: "Gloria Beauty Salon en Calle 8, Miami",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
    images: [seo.ogImage],
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
  name: seo.name,
  url: siteUrl,
  telephone: seo.phone,
  priceRange: "$",
  image: `${siteUrl}${seo.ogImage}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "1130 SW 8th St",
    addressLocality: "Miami",
    addressRegion: "FL",
    postalCode: "33130",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 25.765,
    longitude: -80.214,
  },
  areaServed: ["Miami", "Little Havana", "Calle 8", "Coral Gables", "Brickell"],
  sameAs: [seo.instagramUrl, seo.facebookUrl],
  makesOffer: [
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Haircuts, blowouts and styling" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Hair color, highlights and balayage" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Manicure, pedicure and nail services" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Brows and lashes" } },
    { "@type": "Offer", itemOffered: { "@type": "Service", name: "Spray tan and makeup" } },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "17:00",
    },
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
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
