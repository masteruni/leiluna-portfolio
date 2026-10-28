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

// [PLACEHOLDER] every project below is sample content
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
  {
    slug: "founder-youtube",
    title: "Founder Diaries",
    client: "Atlas App",
    year: "2024",
    categories: ["Video"],
    format: "wide",
    summary: "A documentary-style YouTube series that made a SaaS founder feel human.",
    palette: ["#f5c6d3", "#6a4c93"],
    metrics: [
      { value: "1.8M", label: "Watch minutes" },
      { value: "62%", label: "Avg. retention" },
      { value: "+9K", label: "Subscribers" },
    ],
    challenge: "Atlas wanted thought leadership on YouTube, but talking-head videos were losing viewers in 20 seconds.",
    approach: [
      "Restructured each episode around a story arc with an open loop in the first 15 seconds.",
      "Added B-roll, motion graphics and sound design to pace the edit.",
      "Cut every long video into 5 Shorts to feed the funnel.",
    ],
    results: "Average retention rose from 31% to 62%, and the channel crossed 10K subscribers in six months.",
    deliverables: ["12 long-form episodes", "60 Shorts", "Thumbnail system"],
    platforms: ["YouTube", "LinkedIn"],
  },
  {
    slug: "festival-campaign",
    title: "Sunset Sessions",
    client: "Tidal Music Fest",
    year: "2024",
    categories: ["Social", "Design", "Video"],
    format: "portrait",
    summary: "Full-funnel festival campaign: teaser, lineup drop, live coverage and recap.",
    palette: ["#ff8a6b", "#ea6a8e"],
    metrics: [
      { value: "Sold out", label: "In 9 days" },
      { value: "5.6M", label: "Reach" },
      { value: "220+", label: "Assets" },
    ],
    challenge: "A second-year festival had to sell 8,000 tickets with a fraction of the big festivals' budget.",
    approach: [
      "Mapped a 6-week narrative from teaser to lineup reveal to countdown.",
      "Designed the lineup-drop visuals and motion posters.",
      "Ran live same-day edits during the festival for real-time FOMO.",
    ],
    results: "Tickets sold out in 9 days, and the recap reel became the most-shared post in the festival's history.",
    deliverables: ["Campaign strategy", "Motion posters", "Live edits", "Recap film"],
    platforms: ["Instagram", "TikTok", "X"],
  },
  {
    slug: "content-system",
    title: "The Content Engine",
    client: "Bloom Wellness",
    year: "2025",
    categories: ["AI", "Strategy", "Social"],
    format: "portrait",
    summary: "An AI-powered content workflow that took a team from posting at random to posting with purpose, on autopilot.",
    palette: ["#8e7cc3", "#f5c6d3"],
    metrics: [
      { value: "5x", label: "Output" },
      { value: "-10h", label: "Admin / week" },
      { value: "+180%", label: "Reach" },
    ],
    challenge: "Bloom's team of four was burning out posting daily with no plan, and copying data into reports by hand every Friday.",
    approach: [
      "Defined four content pillars from audience and competitor research.",
      "Built an n8n workflow: AI drafts captions from briefs, approvals run in Notion, and approved posts schedule themselves.",
      "Automated weekly reporting straight from platform analytics into a client dashboard.",
    ],
    results: "Output went up 5x, the team got ten hours a week back, and reach grew 180% in a quarter.",
    deliverables: ["Strategy deck", "n8n automations", "AI caption system", "Auto-reporting"],
    platforms: ["Instagram", "LinkedIn", "TikTok"],
  },
  {
    slug: "creator-rebrand",
    title: "New Era",
    client: "@kaistudios",
    year: "2023",
    categories: ["Design", "Video"],
    format: "square",
    summary: "A creator rebrand: new identity, thumbnail style and a signature editing style.",
    palette: ["#ffd1dc", "#c2185b"],
    metrics: [
      { value: "+14%", label: "CTR" },
      { value: "2x", label: "Avg. views" },
      { value: "1", label: "Signature look" },
    ],
    challenge: "Kai's content was strong, but thumbnails and edits blended in with every other creator in the niche.",
    approach: [
      "Designed a new logo, color palette and thumbnail template system.",
      "Developed a recognizable editing style with custom transitions and caption animations.",
    ],
    results: "Click-through rate rose 14% and average views doubled within two months of the rebrand.",
    deliverables: ["Visual identity", "Thumbnail templates", "Editing style guide"],
    platforms: ["YouTube", "TikTok"],
  },
];

export const categories: ("All" | Category)[] = ["All", "Social", "Video", "Design", "Strategy", "AI"];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
