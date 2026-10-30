// Everything written on the site lives here. Edit freely — the design reads from this file.
// Text marked [PLACEHOLDER] is sample content to replace with your own.

export const site = {
  name: "Leiluna Studio",
  short: "Leiluna",
  url: "https://leilunastudio.com",
  email: "leilunastudio@gmail.com",
  location: "Working worldwide",
  available: true,
  headline: ["Your story.", "Our creative", "orbit."],
  tagline: "Let's build your brand.",
  description:
    "Leiluna Studio is a social media and content studio. Strategy, content creation, and AI-powered workflows that keep your brand in everyone's orbit.",
  pillars: ["Social Media Management", "Content Creation", "AI Workflows"],
  socials: [
    // Add the studio's profile URLs (e.g. https://instagram.com/leilunastudio); bare domains stay hidden.
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "TikTok", href: "https://tiktok.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "Facebook", href: "https://facebook.com/" },
  ],
};

export const manifesto =
  "Every brand has a story worth orbiting. We plan it, shoot it, cut it, design it and automate the busywork around it, so you show up every day with something people actually stop for.";

// From the Leiluna Studio service sheet.
export const services = [
  {
    id: "social",
    title: "Social Media Management",
    short: "Social",
    blurb: "Always-on channels with a plan behind every post, run end to end from calendar to community.",
    items: [
      "Social media strategy",
      "Account management",
      "Content calendar planning",
      "Scheduling & publishing",
      "Caption writing & copywriting",
      "Hashtag research",
      "Profile optimization",
      "Community management",
      "Monthly performance reports",
    ],
  },
  {
    id: "content",
    title: "Content Creation & Production",
    short: "Content",
    blurb: "Scroll-stopping video and design, with hooks in the first second and your brand in every frame.",
    items: [
      "Short-form editing (Reels, TikTok, Shorts)",
      "Long-form video editing",
      "Podcast repurposing",
      "Social graphics & carousels",
      "Thumbnails & covers",
      "Hook & headline development",
      "Creative concept development",
      "Branded content",
      "Subtitles & captioning",
    ],
  },
  {
    id: "ai",
    title: "AI-Powered Content Generation",
    short: "AI Content",
    blurb: "More ideas, faster drafts, and fresh visuals, with human taste on every final cut.",
    items: [
      "AI-assisted writing & captions",
      "AI content ideation",
      "AI graphics & visual generation",
      "AI video generation",
      "AI voiceovers & narration",
      "AI scriptwriting",
      "AI-assisted research & trends",
      "Content personalization",
    ],
  },
  {
    id: "automation",
    title: "AI Automation & Workflows",
    short: "Automation",
    blurb: "We wire up the busywork, from onboarding to reporting, so your team spends time on the work that matters.",
    items: [
      "Social media workflow automation",
      "Automated content scheduling",
      "Client onboarding automation",
      "Email & follow-up sequences",
      "AI chatbots & support",
      "Lead capture & qualification",
      "Automated reporting",
      "CRM workflows",
      "Make, Zapier & n8n integrations",
    ],
  },
  {
    id: "strategy",
    title: "Content Strategy & Growth",
    short: "Strategy",
    blurb: "Pillars, research and a monthly plan, so every post has a job and every month beats the last.",
    items: [
      "Content pillar development",
      "Audience research",
      "Competitor analysis",
      "Platform-specific strategy",
      "Monthly content planning",
      "Trend research",
      "Organic growth strategy",
      "Campaign planning",
      "Performance analysis",
    ],
  },
];

// Choices in the "Start a project" brief. Budget ranges are a starting point: change them to match your pricing.
export const brief = {
  timelines: ["As soon as possible", "Within a month", "1–3 months", "Just exploring"],
  budgets: ["Under $500 / mo", "$500–1,500 / mo", "$1,500–3,000 / mo", "$3,000+ / mo", "One-off project", "Not sure yet"],
};

// Verified from client screenshots (see the two case studies).
export const stats = [
  { value: 29, suffix: "M+", label: "views on our clients' six pinned reels" },
  { value: 680, suffix: "×", label: "top reel reach vs. the page's followers" },
  { value: 306, suffix: "K", label: "followers on a page we grow and manage" },
];

// The five phases of a project, drawn as phases of the moon.
export const process = [
  { title: "Discover", text: "A discovery call, an audit of your channels and a look at what competitors miss." },
  { title: "Plan", text: "Content pillars, formats and a calendar. Every post gets a purpose before it gets made." },
  { title: "Create", text: "We shoot, edit, design and write, with AI speeding up the drafts and humans making the calls." },
  { title: "Launch", text: "Scheduled, published and managed, plus a community that hears back from you." },
  { title: "Grow", text: "Monthly reports, honest insights, and we double down on what works." },
];

export const founders = [
  {
    name: "Juri",
    fullName: "Marian Jurielle D. Raymundo",
    role: "Co-founder · Social Media & Client Strategy Lead",
    bio: "Juri bridges strategy, creativity, and client relationships, helping brands build a stronger online presence through thoughtful social media management and content strategy. From understanding each client’s goals to shaping content direction and managing day-to-day social media, she ensures every project aligns with the brand’s vision and business objectives.",
    leads: [
      "Social media management",
      "Content strategy & planning",
      "Creative direction",
      "Client relations & onboarding",
      "Business development & finance",
    ],
    photo: "/team/juri-hq.webp" as string | null,
  },
  {
    name: "Sven",
    fullName: "Sven M. Laureno",
    role: "Co-founder · AI Creative & Operations Lead",
    bio: "Sven combines AI-powered creativity with streamlined production systems to bring ideas to life. He leads creative execution, explores innovative AI tools and workflows, and oversees the processes that keep projects organized, efficient, and consistently delivered to a high standard.",
    leads: [
      "AI-powered creative production",
      "AI tools & workflow development",
      "Project setup & coordination",
      "Creative quality control",
      "SOPs, systems & operations",
    ],
    photo: "/team/sven.webp" as string | null,
  },
];

// Only socials that point at a real profile (not a bare domain) are shown or shared with search engines.
export const profileLinks = site.socials.filter((s) => {
  try {
    return new URL(s.href).pathname.length > 1;
  } catch {
    return false;
  }
});
