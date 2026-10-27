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
    slug: "glow-up-skincare",
    title: "The 30-Day Glow Up",
    client: "Lumen Skincare",
    year: "2025",
    categories: ["Social", "Video", "Strategy"],
    format: "reel",
    summary: "A UGC-style reel series that turned a quiet skincare brand into a TikTok regular.",
    palette: ["#ea6a8e", "#ffb199"],
    metrics: [
      { value: "12.4M", label: "Views" },
      { value: "+410%", label: "Engagement" },
      { value: "+28K", label: "Followers" },
    ],
    challenge:
      "Lumen had great products and zero personality online. Posts were product shots on white, and engagement sat under 1%.",
    approach: [
      "Interviewed 12 customers to find the real language they use about their skin.",
      "Built a 30-day challenge format with daily check-in reels and a recurring hook.",
      "Edited in a lo-fi UGC style with punchy captions and trending audio.",
    ],
    results:
      "The series hit 12.4M organic views, the brand gained 28K followers in a month, and the hero product sold out twice.",
    deliverables: ["30 short-form videos", "Content calendar", "Caption & hook library"],
    platforms: ["TikTok", "Instagram Reels"],
  },
  {
    slug: "brew-brand-refresh",
    title: "Brewed Different",
    client: "North Roast Coffee",
    year: "2025",
    categories: ["Design", "Social"],
    format: "square",
    summary: "A bold visual system for a local roaster: carousels, templates and a feed that pops.",
    palette: ["#b06ab3", "#ea6a8e"],
    metrics: [
      { value: "3.2x", label: "Saves" },
      { value: "+65%", label: "Store visits" },
      { value: "40", label: "Templates" },
    ],
    challenge:
      "North Roast's feed looked like everyone else's: latte art, brown tones, low saves. They needed to stand out locally.",
    approach: [
      "Created a loud color system and type pairing built around their packaging.",
      "Designed 40 reusable Canva templates so the team could post daily without me.",
      "Launched an educational carousel series about brew methods.",
    ],
    results: "Saves tripled, the carousels became their top format, and in-store visits rose 65% over the quarter.",
    deliverables: ["Brand kit", "40 templates", "Carousel series"],
    platforms: ["Instagram", "Pinterest"],
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
