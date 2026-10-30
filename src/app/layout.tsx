import type { Metadata, Viewport } from "next";
import { Instrument_Serif, JetBrains_Mono, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { Cursor } from "@/components/Cursor";
import { Loader } from "@/components/Loader";
import { Protect } from "@/components/Protect";
import { ScrollOrbit } from "@/components/ScrollOrbit";
import { SmoothScroll } from "@/components/SmoothScroll";
import { founders, profileLinks, site } from "@/content/site";
import { themeScript } from "@/lib/theme-script";
import "./globals.css";

const outfit = Outfit({ variable: "--font-outfit", subsets: ["latin"], display: "swap" });
const instrument = Instrument_Serif({ variable: "--font-instrument", subsets: ["latin"], weight: "400", style: "italic", display: "swap" });
const jetbrains = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"], display: "swap" });

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
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f2ef" },
    { media: "(prefers-color-scheme: dark)", color: "#050506" },
  ],
  colorScheme: "dark light",
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
    // The theme attribute is set by the script below before React loads, hence suppressHydrationWarning.
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${instrument.variable} ${jetbrains.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="grain min-h-dvh overflow-x-clip">
        {/* Without JavaScript the intro curtain would never lift, so hide it and show the page. */}
        <noscript>
          <style>{`[data-loader]{display:none!important}`}</style>
        </noscript>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <div aria-hidden className="stars" />
        <SmoothScroll>
          <Loader />
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
