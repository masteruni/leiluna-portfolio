// Your portfolio projects. Each one gets a card on the homepage and its own case-study page at /work/<slug>.
// To use real visuals, put images in /public/work/ and set `cover: "/work/your-image.jpg"`.
// Until then a generated gradient cover is shown using `palette`.

export type Category = "Social" | "Video" | "Design" | "Strategy";

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
  video?: string; // optional .mp4 in /public/work, plays muted on hover
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
    palette: ["#ff3d7f", "#ffb36b"],
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
    palette: ["#7b5cff", "#3dd6ff"],
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
    palette: ["#c6ff3d", "#00b37e"],
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
    palette: ["#ff7a3d", "#ff3d7f"],
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
    year: "2023",
    categories: ["Strategy", "Social"],
    format: "portrait",
    summary: "Pillars, workflows and a 90-day calendar that took a team from posting randomly to posting with purpose.",
    palette: ["#3dd6ff", "#7b5cff"],
    metrics: [
      { value: "5x", label: "Output" },
      { value: "-60%", label: "Prod. time" },
      { value: "+180%", label: "Reach" },
    ],
    challenge: "Bloom's team of 4 was burning out posting daily with no plan, and results were flat.",
    approach: [
      "Defined 4 content pillars from audience and competitor research.",
      "Built a Notion production pipeline with briefs, approvals and a batching schedule.",
      "Trained the team on hooks and repurposing.",
    ],
    results: "Output went up 5x while production time fell 60%, and reach grew 180% in a quarter.",
    deliverables: ["Strategy deck", "Notion system", "90-day calendar", "Team workshop"],
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
    palette: ["#ffd23d", "#ff7a3d"],
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

export const categories: ("All" | Category)[] = ["All", "Social", "Video", "Design", "Strategy"];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
