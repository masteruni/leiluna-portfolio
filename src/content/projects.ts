// Your portfolio projects. Each one gets a card on the homepage and its own case-study page at /work/<slug>.
//
// Adding real visuals:
//   1. Put files in /public/work/<slug>/  (e.g. /public/work/glow-up-skincare/cover.jpg)
//   2. cover:   "/work/glow-up-skincare/cover.jpg"   → the card + case-study hero image
//      video:   "/work/glow-up-skincare/reel.mp4"    → plays silently when hovering the card
//      gallery: ["/work/glow-up-skincare/1.jpg", "/work/glow-up-skincare/2.mp4"]  → case-study gallery
// Images: .jpg/.png/.webp. Videos: .mp4, ideally under ~10MB. Until you add a cover, a generated planet cover is shown.

export type Category = "Social" | "Video" | "Design" | "Strategy" | "AI";

// The card shape mirrors the content format: 9:16 reels, 1:1 posts, 16:9 video, 4:5 feed.
export type Format = "reel" | "square" | "wide" | "portrait";

export type Project = {
  slug: string;
  title: string;
  client: string;
  year: string;
  categories: Category[];
  format: Format;
  summary: string;
  cover?: string;
  video?: string; // optional .mp4, plays muted on hover
  gallery?: string[]; // images (.jpg/.png/.webp) and videos (.mp4) for the case-study page
  palette: [string, string];
  metrics: { value: string; label: string }[];
  challenge: string;
  approach: string[];
  results: string;
  deliverables: string[];
  platforms: string[];
};

// Real client work only. Every number comes from the client's own screenshots.
export const projects: Project[] = [
  {
    slug: "business-resilience-mindset",
    title: "Resilience, at scale",
    client: "Business Resilience Mindset",
    year: "2025–26",
    categories: ["Social", "Video", "Strategy", "Design"],
    format: "reel",
    summary:
      "Quote-led reels, a recognizable identity and a steady posting engine for @resilientsuccessmindset, now 306K followers strong, with reels reaching up to 9M views.",
    cover: "/work/business-resilience-mindset/profile.webp",
    gallery: [
      "/work/business-resilience-mindset/profile.webp",
      "/work/business-resilience-mindset/top-reels.webp",
      "/work/business-resilience-mindset/brand.webp",
    ],
    palette: ["#5ab8e8", "#1b3a5c"],
    metrics: [
      { value: "306K", label: "Followers" },
      { value: "9M", label: "Top reel views" },
      { value: "11", label: "Reels over 3M views" },
    ],
    challenge:
      "Mindset and motivation is one of the most crowded corners of Instagram, with countless quote pages posting look-alike content. The page needed an identity people would recognize at a glance and reels worth stopping for, saving and sending.",
    approach: [
      "Content strategy: chose the emotional angles and hooks (resilience, relationships, self-worth) that people save and send.",
      "Video editing: cut quote reels from powerful moments, with clean captions, pacing and music.",
      "Account management: consistent daily posting, scheduling and community engagement.",
      "Graphics & branding: the glowing blue phoenix identity, profile and visual style.",
      "SEO captions: written so reels get found in Instagram search, not just the feed.",
    ],
    results:
      "The page now has 306K followers across 672 posts. Eleven reels have passed 3 million views each, led by 9M, 8.3M and 6.2M, and the top reel alone drew 1.1M likes and 147K reposts.",
    deliverables: ["Content strategy", "Short-form video editing", "Account management", "Branding & profile graphics", "SEO captions"],
    platforms: ["Instagram"],
  },
  {
    slug: "the-ai-edge-daily",
    title: "Reach beyond the follow",
    client: "The AI Edge Daily",
    year: "2025–26",
    categories: ["Social", "Video", "Strategy", "Design"],
    format: "reel",
    summary:
      "Daily AI tools, tips and trivia for @theaiedgedaily: reels that travel far beyond the follower count, with a 2.6M-view top reel on a 3.8K-follower account.",
    cover: "/work/the-ai-edge-daily/profile.webp",
    gallery: ["/work/the-ai-edge-daily/profile.webp", "/work/the-ai-edge-daily/brand.webp"],
    palette: ["#3d9bff", "#0b2a4a"],
    metrics: [
      { value: "2.6M", label: "Top reel views" },
      { value: "5.6M+", label: "Views on 3 pinned reels" },
      { value: "680×", label: "Top reel reach vs. followers" },
    ],
    challenge:
      "A young AI tips page with a small following, in a space flooded with recycled \"10 AI tools\" posts. Growth had to come from reels strong enough to be pushed to people who didn't follow the page yet.",
    approach: [
      "Content strategy: picked AI topics and curiosity-driven hooks that stop non-followers mid-scroll.",
      "Video editing: fast, punchy reels with bold on-screen text built for the Explore and Reels feeds.",
      "Account management: a consistent daily posting rhythm, scheduling and community engagement.",
      "Graphics & branding: the AI-head logo with lightning accents, profile and the blue visual identity.",
    ],
    results:
      "The page's three pinned reels have reached 2.6M, 2.2M and 852K views, over 5.6M combined, on an account of 3,804 followers and 248 posts. The top reel alone reached roughly 680 times the page's follower count.",
    deliverables: ["Content strategy", "Short-form video editing", "Account management", "Branding & profile graphics"],
    platforms: ["Instagram"],
  },
];

export const categories: ("All" | Category)[] = ["All", "Social", "Video", "Design", "Strategy", "AI"];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
