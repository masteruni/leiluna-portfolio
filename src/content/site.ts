// Everything personal on the site lives here. Edit freely — the design reads from this file.
// Text marked [PLACEHOLDER] is dummy content to replace with your own.

export const site = {
  name: "Leiluna",
  fullName: "Leiluna", // [PLACEHOLDER] full name if you want it shown
  url: "https://leiluna.vercel.app", // [PLACEHOLDER] update once you have your Vercel / custom domain
  email: "hello@leiluna.com", // [PLACEHOLDER]
  location: "Available worldwide · Remote", // [PLACEHOLDER]
  available: true,
  tagline: "I make brands impossible to scroll past.",
  description:
    "Social media manager, content strategist, video editor and graphic designer. I turn brands into feeds people actually stop for.",
  roles: [
    "Social Media Manager",
    "Content Strategist",
    "Video Editor",
    "Graphic Designer",
  ],
  resumeUrl: "/resume.pdf", // drop your CV into /public/resume.pdf
  socials: [
    { label: "Instagram", href: "https://instagram.com/" },
    { label: "TikTok", href: "https://tiktok.com/" },
    { label: "LinkedIn", href: "https://linkedin.com/" },
    { label: "Behance", href: "https://behance.net/" },
    { label: "YouTube", href: "https://youtube.com/" },
  ],
};

// [PLACEHOLDER] numbers — replace with your real results.
export const stats = [
  { value: 48, suffix: "M+", label: "Organic views generated" },
  { value: 340, suffix: "%", label: "Avg. engagement lift" },
  { value: 60, suffix: "+", label: "Brands & creators served" },
  { value: 1200, suffix: "+", label: "Assets designed & edited" },
];

export const services = [
  {
    id: "social",
    title: "Social Media Management",
    blurb:
      "Always-on channels that grow while you sleep. Calendars, community, publishing and reporting, all handled.",
    deliverables: ["Content calendars", "Community management", "Monthly analytics", "Paid boost strategy"],
  },
  {
    id: "strategy",
    title: "Content Strategy",
    blurb:
      "Content pillars, hooks and formats built from your audience data, so every post has a job to do.",
    deliverables: ["Audience research", "Content pillars", "Hook libraries", "Platform playbooks"],
  },
  {
    id: "video",
    title: "Video Editing",
    blurb:
      "Short-form edits that hold attention from the first frame: pacing, captions, sound design and motion.",
    deliverables: ["Reels / TikTok / Shorts", "YouTube long-form", "Motion captions", "Sound design"],
  },
  {
    id: "design",
    title: "Graphic Design",
    blurb:
      "Scroll-stopping visuals with a system behind them: carousels, templates and brand kits your team can reuse.",
    deliverables: ["Carousels & posts", "Brand kits", "Templates", "Thumbnails & covers"],
  },
];

export const process = [
  { step: "01", title: "Listen", text: "Audit your channels, audience and competitors. Find the gap nobody's filling." },
  { step: "02", title: "Plan", text: "Pillars, formats and a calendar. Every post gets a purpose before it gets made." },
  { step: "03", title: "Create", text: "Shoot, edit, design. Hooks in the first second, brand in every frame." },
  { step: "04", title: "Ship", text: "Publish at the right time, on the right platform, in the right format." },
  { step: "05", title: "Learn", text: "Read the numbers, double down on what works, cut what doesn't. Repeat." },
];

export const about = {
  // [PLACEHOLDER] write this in your own voice
  intro:
    "Hey, I'm Leiluna. I live at the intersection of strategy and craft. I'll plan the content calendar in the morning, cut a reel by lunch and design the carousel before dinner.",
  body: [
    "I started editing videos for friends and fell in love with that moment when a viewer decides to keep watching. Since then I've helped brands, founders and creators build audiences that care, not just numbers that look good.",
    "My approach is simple: understand the audience, respect their attention, and make every frame earn its spot.",
  ],
  tools: [
    "Premiere Pro",
    "After Effects",
    "CapCut",
    "DaVinci Resolve",
    "Photoshop",
    "Illustrator",
    "Figma",
    "Canva",
    "Meta Business Suite",
    "Later",
    "Notion",
    "ChatGPT / Claude",
  ],
};

// [PLACEHOLDER] your work history
export const experience = [
  {
    period: "2024 — Now",
    role: "Freelance Social Media Manager & Editor",
    company: "Independent",
    text: "Running social and short-form video for lifestyle, beauty and tech brands.",
  },
  {
    period: "2022 — 2024",
    role: "Content Strategist",
    company: "Studio Name",
    text: "Built content systems for 20+ clients and led a team of 3 editors.",
  },
  {
    period: "2021 — 2022",
    role: "Video Editor & Designer",
    company: "Agency Name",
    text: "Edited 400+ short-form videos and designed campaign assets across platforms.",
  },
  {
    period: "2020 — 2021",
    role: "Social Media Assistant",
    company: "Brand Name",
    text: "Managed daily posting and community, growing followers from 2K to 38K.",
  },
];

// Shown like social media comments. [PLACEHOLDER] quotes.
export const testimonials = [
  {
    name: "Maya R.",
    handle: "@mayabakes",
    title: "Founder, Bakery Brand",
    quote: "Our reels went from 300 views to 300K. Leiluna gets what makes people stop scrolling.",
    likes: "2.4K",
  },
  {
    name: "Jordan K.",
    handle: "@jordank",
    title: "Marketing Lead, Tech Startup",
    quote: "Strategy, editing and design from one person, and it all feels like one brand. Unreal.",
    likes: "1.1K",
  },
  {
    name: "Sofia L.",
    handle: "@sofiastyle",
    title: "Content Creator",
    quote: "My editing turnaround went from a week to two days, and the quality went UP. 10/10.",
    likes: "3.8K",
  },
];
