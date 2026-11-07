// Recent work: our newest pieces for client brands. Shown on the homepage in
// "Recent work", newest first (keep this list in that order).
//
// Adding a piece:
//   1. Put the file in /public/recent/  (e.g. /public/recent/ai-edge-chatgpt-tips.mp4 or ...-carousel.webp)
//   2. Add an entry at the TOP of `recent`. Use the brand's name exactly as in `brands`, so it picks up the logo.
//   3. Videos: add a `poster` (the still shown before it plays) and a small silent `preview` that loops on the card;
//      tapping the card plays the full `src` with sound.
//   4. `link` (optional): the live post, e.g. "https://www.instagram.com/reel/...". The card then opens it.
// Images: 9:16 or 4:5 .webp/.jpg. Videos: .mp4 under ~10MB.
//
// A brand you've stopped working with: remove it from `brands` and its pieces from `recent`
// (its case study, if it has one, stays in Selected work).

export type Brand = { name: string; logo: string; handle?: string; url?: string };

// Client brands shown in the "Brands we've worked with" row. The site never says which of them are current.
export const brands: Brand[] = [
  { name: "Kabogera Beauty", logo: "/clients/kabogera-beauty.webp" },
  { name: "MD Raymundo Consulting Services", logo: "/clients/md-raymundo.webp" },
  {
    name: "Business Resilience Mindset",
    logo: "/clients/business-resilience-mindset.webp",
    handle: "@resilientsuccessmindset",
    url: "https://www.instagram.com/resilientsuccessmindset/",
  },
  {
    name: "The AI Edge Daily",
    logo: "/clients/the-ai-edge-daily.webp",
    handle: "@theaiedgedaily",
    url: "https://www.instagram.com/theaiedgedaily/",
  },
];

export type RecentPiece = {
  brand: string; // one of `brands`
  kind: "Reel" | "Post" | "Carousel" | "Video" | "Branding";
  title: string;
  src: string; // .mp4 or an image
  poster?: string; // videos
  preview?: string; // videos: a small silent loop for the card
  vertical?: boolean; // videos: 9:16, so the player opens tall
  date?: string; // when it went live, e.g. "Oct 2026"
  link?: string; // the live post
};

export const recent: RecentPiece[] = [
  {
    brand: "Kabogera Beauty",
    kind: "Video",
    title: "Kabogera Beauty app: your everyday glow ritual",
    src: "/recent/kabogera-glow-app-promo.mp4",
    preview: "/recent/kabogera-glow-app-promo-preview.mp4",
    poster: "/recent/kabogera-glow-app-promo-poster.webp",
    vertical: true,
    date: "Nov 2026",
  },
  {
    brand: "Kabogera Beauty",
    kind: "Video",
    title: "Perfect Bar Soap: the new look, in 3D",
    src: "/recent/kabogera-perfect-bar-3d-ad.mp4",
    preview: "/recent/kabogera-perfect-bar-3d-ad-preview.mp4",
    poster: "/recent/kabogera-perfect-bar-3d-ad-poster.webp",
    vertical: true,
    date: "Nov 2026",
  },
  {
    brand: "Kabogera Beauty",
    kind: "Post",
    title: "The bar you love, in a new look",
    src: "/recent/kabogera-new-look.webp",
    date: "Nov 2026",
  },
  {
    brand: "MD Raymundo Consulting Services",
    kind: "Video",
    title: "Logo reveal",
    src: "/recent/md-raymundo-logo-reveal.mp4",
    preview: "/recent/md-raymundo-logo-reveal-preview.mp4",
    poster: "/recent/md-raymundo-logo-reveal-poster.webp",
    vertical: true,
    date: "Nov 2026",
  },
];
