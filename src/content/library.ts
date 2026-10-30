// The Library: individual reels, videos and graphics, organized by style and industry (not by brand).
//
// Adding a real piece:
//   1. Put the file in /public/library/  (e.g. /public/library/cafe-ugc.mp4 or /public/library/menu-carousel.jpg)
//   2. Set `src` to that path. For videos you can also add a `poster` image (the frame shown before it plays)
//      and a short silent `preview` clip that loops on the tile (the full `src` plays with sound when opened).
//   3. Pick its `kind`, `format`, `style` and `industry` so it shows up under the right filters.
// Videos: .mp4 under ~15MB (720p is plenty). Graphics: .jpg/.png/.webp. Carousels also list every slide in `slides`.
// Website copies of our videos carry a small "leiluna studio" watermark (originals stay clean in Drive).
// Until `src` is set, a designed placeholder card is shown.

export type Kind = "video" | "graphic";
// Shape of the piece: 9:16 reels/stories, 1:1 posts, 4:5 feed/carousels, 3:4 tall carousels, 16:9 YouTube, 4:3 covers,
// and "long" for scrolling infographics (the tile shows the top, the viewer scrolls the whole thing).
export type PieceFormat = "reel" | "square" | "portrait" | "tall" | "wide" | "landscape" | "long";

export const industries = [
  "Food & Beverage",
  "Beauty & Wellness",
  "Real Estate",
  "Fitness",
  "Fashion",
  "Tech & SaaS",
  "Education",
  "Hospitality",
  "Automotive",
  "Home & Living",
  "Finance & Trading",
] as const;
export type Industry = (typeof industries)[number];

export type Piece = {
  id: string;
  kind: Kind;
  format: PieceFormat;
  style: string; // e.g. "UGC talking head", "Carousel"
  industry: Industry | Industry[]; // a list when one piece spans several industries
  title: string;
  src?: string;
  slides?: string[]; // carousels: every slide in order (the first doubles as `src`, the cover)
  poster?: string;
  preview?: string;
  duration?: string; // videos, e.g. "0:24"
  tools?: string[];
};

// Real pieces only. A piece without `src` shows a designed placeholder card, so only add one once its file is ready.
export const pieces: Piece[] = [
  {
    id: "client-interviews",
    kind: "video",
    format: "wide",
    style: "Client interview edit",
    industry: ["Beauty & Wellness", "Automotive", "Home & Living", "Food & Beverage"],
    title: "Real people. Real stories.",
    src: "/library/client-interviews-v2.mp4",
    preview: "/library/client-interviews-preview-v2.mp4",
    poster: "/library/client-interviews-poster-v2.webp",
    duration: "1:05",
  },
  {
    id: "promotion-reel",
    kind: "video",
    format: "reel",
    style: "Talking head + motion graphics",
    industry: "Education",
    title: "How to get promoted in 6 months",
    src: "/library/promotion-reel-v2.mp4",
    preview: "/library/promotion-reel-preview-v2.mp4",
    poster: "/library/promotion-reel-poster-v2.webp",
    duration: "0:35",
  },
  {
    id: "trading-reel",
    kind: "video",
    format: "reel",
    style: "Talking head + data visuals",
    industry: "Finance & Trading",
    title: "The trading mindset shift",
    src: "/library/trading-reel-v2.mp4",
    preview: "/library/trading-reel-preview-v2.mp4",
    poster: "/library/trading-reel-poster-v2.webp",
    duration: "0:42",
  },
  {
    id: "masterclass-reel",
    kind: "video",
    format: "reel",
    style: "Editorial masterclass promo",
    industry: "Education",
    title: "The coaching masterclass",
    src: "/library/masterclass-reel-v2.mp4",
    preview: "/library/masterclass-reel-preview-v2.mp4",
    poster: "/library/masterclass-reel-poster-v2.webp",
    duration: "0:36",
  },
  {
    id: "realestate-reel",
    kind: "video",
    format: "reel",
    style: "Illustrated explainer",
    industry: "Real Estate",
    title: "3 projects that build real estate wealth",
    src: "/library/realestate-reel.mp4",
    preview: "/library/realestate-reel-preview.mp4",
    poster: "/library/realestate-reel-poster.webp",
    duration: "0:38",
  },
  {
    id: "logo-animation",
    kind: "video",
    format: "wide",
    style: "Logo animation",
    industry: [...industries], // a logo reveal works for any brand
    title: "Leiluna Studio logo reveal",
    src: "/library/logo-animation.mp4",
    preview: "/library/logo-animation-preview.mp4",
    poster: "/library/logo-animation-poster.webp",
    duration: "0:10",
  },
  {
    id: "studio-intro-light",
    kind: "video",
    format: "wide",
    style: "Brand intro film",
    industry: [...industries], // our own studio intro: the style works for any brand
    title: "Leiluna Studio intro: light",
    src: "/library/studio-intro-light.mp4",
    preview: "/library/studio-intro-light-preview.mp4",
    poster: "/library/studio-intro-light-poster.webp",
    duration: "0:28",
  },
  {
    id: "studio-intro-dark",
    kind: "video",
    format: "wide",
    style: "Brand intro film",
    industry: [...industries],
    title: "Leiluna Studio intro: dark",
    src: "/library/studio-intro-dark.mp4",
    preview: "/library/studio-intro-dark-preview.mp4",
    poster: "/library/studio-intro-dark-poster.webp",
    duration: "0:28",
  },
  {
    id: "lipstick-ad",
    kind: "video",
    format: "reel",
    style: "Luxury product ad",
    industry: "Beauty & Wellness",
    title: "Lipstick in violet light",
    src: "/library/lipstick-ad.mp4",
    preview: "/library/lipstick-ad-preview.mp4",
    poster: "/library/lipstick-ad-poster.webp",
    duration: "0:10",
  },
  {
    id: "lip-veil-launch",
    kind: "video",
    format: "wide",
    style: "Beauty product launch",
    industry: "Beauty & Wellness",
    title: "Maison Nova Lip Veil: six shades",
    src: "/library/lip-veil-launch.mp4",
    preview: "/library/lip-veil-launch-preview.mp4",
    poster: "/library/lip-veil-launch-poster.webp",
    duration: "0:27",
  },
  {
    id: "kinetic-typography",
    kind: "video",
    format: "reel",
    style: "Kinetic typography",
    industry: "Fitness",
    title: "Break through limits",
    src: "/library/kinetic-typography.mp4",
    preview: "/library/kinetic-typography-preview.mp4",
    poster: "/library/kinetic-typography-poster.webp",
    duration: "0:08",
  },
  {
    id: "muse-beauty-edit",
    kind: "video",
    format: "reel",
    style: "Beauty & fashion edit",
    industry: ["Beauty & Wellness", "Fashion"],
    title: "MUSE: a beauty edit",
    src: "/library/muse-beauty-edit.mp4",
    preview: "/library/muse-beauty-edit-preview.mp4",
    poster: "/library/muse-beauty-edit-poster.webp",
    duration: "0:30",
  },
  {
    id: "ramen-ad",
    kind: "video",
    format: "reel",
    style: "Animated restaurant ad",
    industry: "Food & Beverage",
    title: "Ramen, slurp by slurp",
    src: "/library/ramen-ad.mp4",
    preview: "/library/ramen-ad-preview.mp4",
    poster: "/library/ramen-ad-poster.webp",
    duration: "0:10",
  },
  {
    id: "lot-to-home",
    kind: "video",
    format: "reel",
    style: "3D build reveal",
    industry: "Real Estate",
    title: "From empty lot to dream home",
    src: "/library/lot-to-home.mp4",
    preview: "/library/lot-to-home-preview.mp4",
    poster: "/library/lot-to-home-poster.webp",
    duration: "0:19",
  },
  {
    id: "outfit-details",
    kind: "video",
    format: "reel",
    style: "Outfit callout edit",
    industry: "Fashion",
    title: "What I wore today: outfit details",
    src: "/library/outfit-details.mp4",
    preview: "/library/outfit-details-preview.mp4",
    poster: "/library/outfit-details-poster.webp",
    duration: "0:10",
  },
  {
    id: "learning-carousel",
    kind: "graphic",
    format: "tall",
    style: "Educational carousel",
    industry: "Education",
    title: "Why 90% of people stop learning by 25",
    src: "/library/learning-carousel-1b.webp",
    slides: ["1b", 2, 3, 4, 5].map((n) => `/library/learning-carousel-${n}.webp`),
  },
  {
    id: "quote-cards",
    kind: "graphic",
    format: "tall",
    style: "Quote card series",
    industry: "Education",
    title: "Words from great minds",
    src: "/library/quote-cards-1.webp",
    slides: [1, 2, 3, 4].map((n) => `/library/quote-cards-${n}.webp`),
  },
  {
    id: "wellness-infographic",
    kind: "graphic",
    format: "long",
    style: "Infographic",
    industry: "Beauty & Wellness",
    title: "Small habits, whole you",
    src: "/library/wellness-infographic.webp",
  },
  {
    id: "mango-shake",
    kind: "graphic",
    format: "reel",
    style: "Product promo poster",
    industry: "Food & Beverage",
    title: "Mango Shake: unique spice & sweet",
    src: "/library/mango-shake-poster.webp",
  },
  {
    id: "whisk-crumb-opening",
    kind: "graphic",
    format: "portrait",
    style: "Event calendar graphic",
    industry: "Food & Beverage",
    title: "Whisk & Crumb opening week",
    src: "/library/whisk-crumb-opening-week.webp",
  },
  {
    id: "street-food-menu",
    kind: "graphic",
    format: "reel",
    style: "Menu & promo poster",
    industry: "Food & Beverage",
    title: "Indonesian street-food menu",
    src: "/library/street-food-menu.webp",
  },
  {
    id: "podcast-cover-unfiltered",
    kind: "graphic",
    format: "landscape",
    style: "Podcast cover art",
    industry: "Education",
    title: "Unfiltered Dialogue",
    src: "/library/podcast-cover-unfiltered.webp",
  },
  {
    id: "thumbnail-no-shortcuts",
    kind: "graphic",
    format: "landscape",
    style: "YouTube thumbnail",
    industry: ["Finance & Trading", "Tech & SaaS"],
    title: "Innovate, no shortcuts",
    src: "/library/thumbnail-no-shortcuts.webp",
  },
  {
    id: "thumbnail-the-matrix",
    kind: "graphic",
    format: "landscape",
    style: "YouTube thumbnail",
    industry: "Finance & Trading",
    title: "Escape the matrix",
    src: "/library/thumbnail-the-matrix.webp",
  },
];

export const industriesOf = (p: Piece): Industry[] => (Array.isArray(p.industry) ? p.industry : [p.industry]);
