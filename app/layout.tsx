import type { Metadata, Viewport } from "next";
import { Barlow_Semi_Condensed } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import ConsentBanner from "@/components/ConsentBanner";
import { site, locations } from "@/lib/content";

/**
 * Brand face is Sofia Pro Narrow (Adobe Font). Barlow Semi Condensed is the
 * self-hosted stand-in — same narrow geometric proportions, and it ships the
 * Regular / Semi Bold / Black weights plus true italics the design needs.
 * next/font self-hosts at build time, so there is no external font request.
 */
const brand = Barlow_Semi_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-brand",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Lobster Lab | Lobster Rolls & Coastal Seafood in San Diego",
    template: "%s | Lobster Lab",
  },
  description: site.description,
  keywords: [
    "lobster roll",
    "San Diego seafood",
    "Carlsbad lobster roll",
    "lobster bisque",
    "Windmill Food Hall",
    "Sky Deck Del Mar",
    "seafood catering San Diego",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: "Lobster Lab | Lobster Rolls & Coastal Seafood in San Diego",
    description: site.description,
    images: [
      { url: "/photos/hero.webp", width: 2048, height: 1366, alt: "Lobster Lab spread of lobster rolls and seafood sandwiches" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lobster Lab | Lobster Rolls & Coastal Seafood in San Diego",
    description: site.description,
    images: ["/photos/hero.webp"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#013a71",
  width: "device-width",
  initialScale: 1,
};

/** Restaurant schema — one entry per location, so each stall can rank locally. */
function structuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": locations.map((l) => ({
      "@type": "Restaurant",
      name: `Lobster Lab — ${l.name}`,
      servesCuisine: ["Seafood", "American"],
      priceRange: "$$",
      url: site.url,
      image: `${site.url}/photos/hero.webp`,
      email: site.email,
      sameAs: [site.instagram],
      address: { "@type": "PostalAddress", streetAddress: l.address },
      openingHours: "Mo-Su 11:00-21:00",
      parentOrganization: { "@type": "Organization", name: site.operator },
    })),
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={brand.variable}>
      <head>
        {/*
          Marks the document as JS-capable before first paint. `.reveal` only
          starts hidden under `.js`, so a no-JS or JS-failed render shows the
          full page instead of a blank one. Must stay inline and synchronous.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <SmoothScroll />
        {children}
        <ConsentBanner />
      </body>
    </html>
  );
}
