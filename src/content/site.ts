// Everything written on the site lives here. Edit freely — the design reads from this file.
// Text marked [PLACEHOLDER] is sample content to replace with your own.

export const site = {
  name: "Leiluna Studio",
  short: "Leiluna",
  url: "https://leilunastudio.com",
  email: "hello@leilunastudio.com", // [PLACEHOLDER] confirm this inbox exists
  location: "Working worldwide",
  available: true,
  headline: ["Your story.", "Our creative", "orbit."],
  tagline: "Let's build your brand.",
  description:
    "Leiluna Studio is a social media and content studio. Strategy, content creation, and AI-powered workflows that keep your brand in everyone's orbit.",
  pillars: ["Social Media Management", "Content Creation", "AI Workflows"],
  socials: [
    { label: "Instagram", href: "https://instagram.com/" }, // [PLACEHOLDER] links
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

// [PLACEHOLDER] numbers — replace with real results.
export const stats = [
  { value: 48, suffix: "M", label: "organic views delivered" },
  { value: 340, suffix: "%", label: "average engagement lift" },
  { value: 60, suffix: "+", label: "brands in our orbit" },
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
    role: "Co-founder · Client & Business Lead",
    bio: "Juri is your first hello and your steady point of contact, leading discovery calls, proposals, onboarding and client communication, so you always know what's happening and why.",
    leads: ["Discovery & sales", "Proposals & contracts", "Client onboarding", "Communication", "Finance"],
    photo: null as string | null, // e.g. "/team/juri.jpg"
  },
  {
    name: "Sven",
    fullName: "Sven M. Laureno",
    role: "Co-founder · Creative & Operations Lead",
    bio: "Sven runs the engine room: project setup, production, quality control and the systems that keep the studio delivering on time, every time.",
    leads: ["Project setup", "Content production", "Quality control", "SOPs & workflows", "Deadlines"],
    photo: null as string | null, // e.g. "/team/sven.jpg"
  },
];

// [PLACEHOLDER] quotes.
export const testimonials = [
  {
    quote: "Our reels went from 300 views to 300K. They just get what makes people stop scrolling.",
    name: "Maya R.",
    title: "Founder, Bakery Brand",
  },
  {
    quote: "Strategy, editing, design and automations from one team, and it all feels like one brand.",
    name: "Jordan K.",
    title: "Marketing Lead, Tech Startup",
  },
  {
    quote: "They automated our onboarding and reporting. We got back ten hours a week and the content got better.",
    name: "Sofia L.",
    title: "Content Creator",
  },
];
