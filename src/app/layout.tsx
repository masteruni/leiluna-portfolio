import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Cursor } from "@/components/Cursor";
import { Protect } from "@/components/Protect";
import { ScrollOrbit } from "@/components/ScrollOrbit";
import { SmoothScroll } from "@/components/SmoothScroll";
import { founders, profileLinks, site } from "@/content/site";
import "./globals.css";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], display: "swap" });
const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: "italic", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Social Media, Content & AI Workflows`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name}: Your story. Our creative orbit.`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "dark",
};

// Structured data: tells Google who the studio is, what it does and who runs it.
const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  email: site.email,
  description: site.description,
  logo: `${site.url}/brand/mark.png`,
  founder: founders.map((f) => ({ "@type": "Person", name: f.fullName, jobTitle: f.role })),
  knowsAbout: site.pillars,
  ...(profileLinks.length ? { sameAs: profileLinks.map((s) => s.href) } : {}),
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${outfit.variable} ${instrument.variable} antialiased`}>
      <body className="grain min-h-dvh overflow-x-clip">
        {/* Without JavaScript the hero's entrance would never play, so show it as it ends. */}
        <noscript>
          <style>{`[data-enter]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div aria-hidden className="stars" />
        <SmoothScroll>
          <Cursor />
          <Protect />
          {children}
          <ScrollOrbit />
        </SmoothScroll>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }} />
        <Analytics />
      </body>
    </html>
  );
}
