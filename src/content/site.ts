// Everything written on the site lives here. Edit freely — the design reads from this file.
// Text marked [PLACEHOLDER] is sample content to replace with your own.

export const site = {
  name: "Leiluna Studio",
  short: "Leiluna",
  url: "https://leilunastudio.com",
  email: "leilunastudio@gmail.com",
  location: "Working worldwide",
  available: true,
  // How fast you reply to a brief. Used in the FAQ, the contact section and the brief itself.
  replyTime: "one business day",
  // Bump this when the content changes; it's the "last modified" date search engines see in the sitemap.
  updated: "2026-10-30",
  // The hero says plainly what the studio does.
  hero: {
    title: ["Social media that", "people stop for."],
    intro:
      "We plan, film, edit and post content for brands on Instagram, TikTok and YouTube, with strategy, design and AI workflows under one roof.",
    // Library reels that play in the hero phone, in order.
    reels: ["muse-beauty-edit", "promotion-reel", "lot-to-home", "ramen-ad", "lipstick-ad", "masterclass-reel", "outfit-details", "kinetic-typography"],
  },
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

export const manifesto = {
  title: "A story worth orbiting.",
  text: "Every brand has one. We plan it, shoot it, cut it, design it and automate the busywork around it, so you show up every day with something people actually stop for.",
};

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

// "Pick a format": the formats we make, each shown with a real Library piece.
// `need` is the service it pre-selects in the brief; `bestFor` and `pitch` are the sales copy.
export const formats = [
  {
    piece: "promotion-reel",
    name: "Talking head + motion graphics",
    bestFor: "Coaches, educators and founders",
    pitch: "Turn what you know into reels that teach, build trust and bring people to your offer.",
    need: "Content Creation & Production",
  },
  {
    piece: "client-interviews",
    name: "Client interview edit",
    bestFor: "Products and services that need social proof",
    pitch: "Real customers telling their story, cut tight with captions and on-brand titles.",
    need: "Content Creation & Production",
  },
  {
    piece: "lipstick-ad",
    name: "Luxury product ad",
    bestFor: "Beauty, fashion and product launches",
    pitch: "Slow, premium visuals that make one product feel like the only one worth buying.",
    need: "Content Creation & Production",
  },
  {
    piece: "lot-to-home",
    name: "3D build reveal",
    bestFor: "Real estate, construction and interiors",
    pitch: "Show the journey from empty lot to finished home in seconds.",
    need: "Content Creation & Production",
  },
  {
    piece: "ramen-ad",
    name: "Animated menu ad",
    bestFor: "Restaurants, cafés and food brands",
    pitch: "Bold, hungry motion for menus, promos and openings that stop the scroll at lunchtime.",
    need: "Content Creation & Production",
  },
  {
    piece: "kinetic-typography",
    name: "Kinetic typography",
    bestFor: "Fitness, motivation and announcements",
    pitch: "Words that move to the beat, for messages people should feel, not just read.",
    need: "Content Creation & Production",
  },
];

// Floating proof in the hero. All from client screenshots.
export const heroProof = [
  { value: "9M", label: "views on a single reel", source: "Business Resilience Mindset" },
  { value: "306K", label: "followers and growing", source: "Business Resilience Mindset" },
  { value: "2.6M", label: "views on a 3.8K-follower page", source: "The AI Edge Daily" },
];

// Verified from client screenshots (see the two case studies).
export const stats = [
  { value: 29, suffix: "M+", label: "views on our clients' six pinned reels" },
  { value: 680, suffix: "×", label: "top reel reach vs. the page's followers" },
  { value: 306, suffix: "K", label: "followers on a page we grow and manage" },
];

// Top reels for the proof chart (views), from the two case studies.
export const topReels = [
  { views: 9, label: "9M", page: "Business Resilience Mindset" },
  { views: 8.3, label: "8.3M", page: "Business Resilience Mindset" },
  { views: 6.2, label: "6.2M", page: "Business Resilience Mindset" },
  { views: 2.6, label: "2.6M", page: "The AI Edge Daily" },
  { views: 2.2, label: "2.2M", page: "The AI Edge Daily" },
  { views: 0.852, label: "852K", page: "The AI Edge Daily" },
];

// Smaller proof tiles and the running ticker.
export const moreProof = [
  { value: "1.1M", label: "likes on one reel" },
  { value: "147K", label: "reposts on that same reel" },
  { value: "11", label: "reels past 3M views on one page" },
];

// Questions people ask before booking. Answers only use what the studio already states on this site.
export const faqs = [
  {
    q: "What exactly do you do?",
    a: "Five things, together or on their own: social media management, content creation and production, AI-powered content generation, AI automation and workflows, and content strategy and growth. Most clients start with management and content, then add the rest.",
  },
  {
    q: "Which platforms do you work on?",
    a: "Instagram, TikTok, YouTube and Facebook. We edit short-form for Reels, TikTok and Shorts, cut long-form videos and repurpose podcasts into clips, carousels and thumbnails.",
  },
  {
    q: "How does a project start?",
    a: "Send us a brief with the button below. We reply within one business day, then begin with a discovery call and an audit of your channels. From there we plan your content pillars and calendar before anything gets made.",
  },
  {
    q: "Will AI make my content look generic?",
    a: "No. AI speeds up ideas, drafts and visuals, but people make every call and every final cut. You get the pace of AI with human taste on top.",
  },
  {
    q: "How much does it cost?",
    a: "It depends on the mix of services and how much content you need. We work on monthly plans and one-off projects. Pick a budget range in the brief below (or 'Not sure yet') and we'll scope the right mix with you before anything starts.",
  },
  {
    q: "What do you need from us to start?",
    a: "Access to the accounts we'll manage, your brand assets (logo, fonts, colors, any past content) and time for a discovery call. If you don't have all of it yet, that's fine: building it is part of the work.",
  },
  {
    q: "Do you work with brands outside your country?",
    a: "Yes. We work fully remotely with brands worldwide.",
  },
  {
    q: "Can I see more of your work?",
    a: "Open any case study above for the full story and results, or browse the Library for single reels, edits and graphics filtered by industry.",
  },
];

// The five phases of a project, drawn as phases of the moon.
export const process = [
  {
    title: "Discover",
    text: "A discovery call, an audit of your channels and a look at what competitors miss.",
    output: "Channel audit and kickoff notes",
  },
  {
    title: "Plan",
    text: "Content pillars, formats and a calendar. Every post gets a purpose before it gets made.",
    output: "Content pillars and a monthly calendar",
  },
  {
    title: "Create",
    text: "We shoot, edit, design and write, with AI speeding up the drafts and humans making the calls.",
    output: "Reels, graphics and captions, ready to post",
  },
  {
    title: "Launch",
    text: "Scheduled, published and managed, plus a community that hears back from you.",
    output: "Scheduled posts and community replies",
  },
  {
    title: "Grow",
    text: "Monthly reports, honest insights, and we double down on what works.",
    output: "A monthly performance report",
  },
];

// Client quotes. The section only appears once there is at least one; add them as they come in.
// Example:
//   { quote: "They turned our page around in two months.", name: "Alex Rivera", role: "Founder, Whisk & Crumb" }
export const testimonials: { quote: string; name: string; role: string }[] = [];

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
