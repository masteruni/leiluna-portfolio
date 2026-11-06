// Dev-only test data for Recent work (see the "Demo / Worst case / …" switch at the bottom of the page in
// `next dev`, or add ?data=worst to the URL). Never imported in production. Every value here is something a real
// client entry could plausibly be, not random filler: it's the regression test for src/content/recent.ts.
import { brands as demoBrands, recent as demoRecent, type Brand, type RecentPiece } from "./recent";

export type RecentData = { brands: Brand[]; recent: RecentPiece[] };

const longBrand = "Maison Lumière Skincare & Aesthetics Clinic Philippines";

const worstBrands: Brand[] = [
  { name: longBrand, logo: "/clients/kabogera-beauty.webp" },
  { name: "Q", logo: "/clients/md-raymundo.webp" }, // a one-letter brand
  ...demoBrands,
  { name: "Northwind Industries Holdings International", logo: "/clients/the-ai-edge-daily.webp" },
  { name: "Café Ñandú", logo: "/clients/business-resilience-mindset.webp" }, // accents and ñ
  { name: "Kaffeehaus Wiener Melange", logo: "/clients/no-such-logo.webp" }, // a logo path with a typo
];

const worstRecent: RecentPiece[] = [
  {
    brand: longBrand,
    kind: "Carousel",
    title:
      "Holiday 2026 campaign: twelve reels, a ten-slide carousel series and the full launch-day story set for the new Perfect Bar Soap line",
    src: "/recent/kabogera-new-look.webp",
    date: "Nov 2026",
    link: "https://www.instagram.com/p/C0mPlEtElYmAdEuP/",
  },
  {
    brand: "Q",
    kind: "Post",
    title: "Logo",
    src: "/library/logo-animation-poster.webp", // a 16:9 image in a 4:5 card
  },
  {
    brand: "Northwind Industries Holdings International",
    kind: "Video",
    title: "#PerfectBarSoapNewLookLaunchDay2026CountdownTeaser",
    src: "/recent/md-raymundo-logo-reveal.mp4",
    preview: "/recent/md-raymundo-logo-reveal-preview.mp4",
    poster: "/recent/md-raymundo-logo-reveal-poster.webp",
    vertical: true,
    date: "Sept 2026",
    link: "https://www.tiktok.com/@northwindindustriesholdingsintl/video/7432198765432198765",
  },
  {
    brand: "A brand that isn't in the brands list",
    kind: "Branding",
    title: "Brand identity refresh",
    src: "/recent/kabogera-new-look.webp",
  },
  {
    brand: "Café Ñandú",
    kind: "Reel",
    title: "Menú de temporada: cinco platos, una historia",
    src: "/recent/kabogera-perfect-bar-ad.mp4",
    // no preview and no poster: the full 18MB video loads on the card
    date: "Oct 2026",
  },
  {
    brand: "Kaffeehaus Wiener Melange",
    kind: "Post",
    title: "Opening week",
    src: "/recent/opening-week.webp", // a file that was never uploaded
    date: "Aug 2026",
  },
];

const many: RecentPiece[] = Array.from({ length: 24 }, (_, i) => ({ ...demoRecent[i % demoRecent.length], title: `${demoRecent[i % demoRecent.length].title} (${i + 1})` }));

export const fixtures: Record<string, RecentData> = {
  worst: { brands: worstBrands, recent: worstRecent },
  empty: { brands: demoBrands, recent: [] },
  one: { brands: demoBrands.slice(0, 1), recent: demoRecent.slice(0, 1) },
  many: { brands: demoBrands, recent: many },
};
