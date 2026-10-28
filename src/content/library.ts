// The Library: individual reels, videos and graphics, organized by style and industry (not by brand).
//
// Adding a real piece:
//   1. Put the file in /public/library/  (e.g. /public/library/cafe-ugc.mp4 or /public/library/menu-carousel.jpg)
//   2. Set `src` to that path. For videos you can also add a `poster` image (the frame shown before it plays)
//      and a short silent `preview` clip that loops on the tile (the full `src` plays with sound when opened).
//   3. Pick its `kind`, `format`, `style` and `industry` so it shows up under the right filters.
// Videos: .mp4 under ~15MB (720p is plenty). Graphics: .jpg/.png/.webp.
// Website copies of our videos carry a small "leiluna studio" watermark (originals stay clean in Drive).
// Until `src` is set, a designed placeholder card is shown.

export type Kind = "video" | "graphic";
// Shape of the piece: 9:16 reels/stories, 1:1 posts, 4:5 feed/carousels, 16:9 YouTube.
export type PieceFormat = "reel" | "square" | "portrait" | "wide";

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
  poster?: string;
  preview?: string;
  duration?: string; // videos, e.g. "0:24"
  tools?: string[];
};

// Real pieces first; the rest are [PLACEHOLDER] samples showing the range. Swap in real files as you add them.
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
  { id: "cafe-ugc", kind: "video", format: "reel", style: "UGC talking head", industry: "Food & Beverage", title: "Café opening-day story", duration: "0:28", tools: ["CapCut", "Premiere Pro"] },
  { id: "skin-carousel", kind: "graphic", format: "portrait", style: "Educational carousel", industry: "Beauty & Wellness", title: "5 skincare myths", tools: ["Figma", "Canva"] },
  { id: "condo-tour", kind: "video", format: "reel", style: "Cinematic property tour", industry: "Real Estate", title: "Sunset condo walkthrough", duration: "0:45", tools: ["DaVinci Resolve"] },
  { id: "gym-kinetic", kind: "video", format: "square", style: "Kinetic typography", industry: "Fitness", title: "No excuses January promo", duration: "0:15", tools: ["After Effects"] },
  { id: "menu-poster", kind: "graphic", format: "portrait", style: "Menu & promo poster", industry: "Food & Beverage", title: "Weekend brunch menu", tools: ["Illustrator"] },
  { id: "saas-explainer", kind: "video", format: "wide", style: "Motion graphics explainer", industry: "Tech & SaaS", title: "Feature launch in 60 seconds", duration: "1:00", tools: ["After Effects", "Figma"] },
  { id: "fashion-transition", kind: "video", format: "reel", style: "Outfit transition", industry: "Fashion", title: "One jacket, five looks", duration: "0:19", tools: ["CapCut"] },
  { id: "course-thumb", kind: "graphic", format: "wide", style: "YouTube thumbnail", industry: "Education", title: "Study-with-me thumbnail set", tools: ["Photoshop"] },
  { id: "spa-ai", kind: "video", format: "reel", style: "AI-generated visuals", industry: "Beauty & Wellness", title: "Dreamscape spa teaser", duration: "0:12", tools: ["AI video", "Premiere Pro"] },
  { id: "hotel-story", kind: "graphic", format: "reel", style: "Story template", industry: "Hospitality", title: "Staycation story pack", tools: ["Canva"] },
  { id: "realty-quote", kind: "graphic", format: "square", style: "Quote & stat card", industry: "Real Estate", title: "Market update cards", tools: ["Figma"] },
  { id: "podcast-clip", kind: "video", format: "reel", style: "Podcast clip with captions", industry: "Education", title: "Founder podcast highlight", duration: "0:38", tools: ["Premiere Pro", "AI captions"] },
  { id: "fit-infographic", kind: "graphic", format: "portrait", style: "Infographic", industry: "Fitness", title: "Protein guide infographic", tools: ["Illustrator"] },
  { id: "resto-broll", kind: "video", format: "wide", style: "Cinematic B-roll", industry: "Hospitality", title: "Chef's table B-roll", duration: "0:30", tools: ["DaVinci Resolve"] },
];

export const industriesOf = (p: Piece): Industry[] => (Array.isArray(p.industry) ? p.industry : [p.industry]);
