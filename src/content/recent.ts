// Recent work: the latest pieces from the brands we're working with right now. Shown on the homepage in
// "Recent work", newest first (keep this list in that order).
//
// Adding a piece:
//   1. Put the file in /public/recent/  (e.g. /public/recent/ai-edge-chatgpt-tips.mp4 or ...-carousel.webp)
//   2. Add an entry at the TOP of `recent`. Use the brand's name exactly as in `brands`, so it picks up the logo.
//   3. Videos: add a `poster` (the still shown before it plays). They loop silently on the card.
//   4. `link` (optional): the live post, e.g. "https://www.instagram.com/reel/...". The card then opens it.
// Images: 9:16 or 4:5 .webp/.jpg. Videos: .mp4 under ~10MB.
//
// A brand you've stopped working with: remove it from `brands` and its pieces from `recent`
// (its case study, if it has one, stays in Selected work).

export type Brand = { name: string; logo: string; handle?: string; url?: string };

// The brands we're working with right now: shown as the "Now working with" row.
export const brands: Brand[] = [
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
  date?: string; // when it went live, e.g. "Oct 2026"
  link?: string; // the live post
};

export const recent: RecentPiece[] = [
  {
    brand: "Business Resilience Mindset",
    kind: "Reel",
    title: "The reels pushing the page past 9M views",
    src: "/work/business-resilience-mindset/top-reels.webp",
    link: "https://www.instagram.com/resilientsuccessmindset/",
  },
  {
    brand: "The AI Edge Daily",
    kind: "Post",
    title: "Daily AI tools, tips and trivia",
    src: "/work/the-ai-edge-daily/profile.webp",
    link: "https://www.instagram.com/theaiedgedaily/",
  },
  {
    brand: "Business Resilience Mindset",
    kind: "Branding",
    title: "The glowing phoenix identity",
    src: "/work/business-resilience-mindset/brand.webp",
  },
  {
    brand: "The AI Edge Daily",
    kind: "Branding",
    title: "AI-head logo and blue visual identity",
    src: "/work/the-ai-edge-daily/brand.webp",
  },
];
