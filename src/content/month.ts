// "A month with Leiluna" on the homepage: a sample month on a content plan, laid out as a calendar, so a visitor
// can see exactly what goes out and when. Edit the numbers and the schedule here; every example is a real piece
// from the Library (by its `id` in src/content/library.ts), so it always shows actual work.
//
// NOTE: the quantities below are a sample plan. Adjust them to match what you actually offer.

export type DayKind = "plan" | "reel" | "carousel" | "report";

export const monthPlan = {
  name: "A sample month on a content plan",
  // What the month adds up to, shown beside the calendar.
  totals: [
    { value: "12", label: "reels, scripted, filmed or animated, and edited" },
    { value: "8", label: "carousels and graphic posts" },
    { value: "Daily", label: "stories, community replies and scheduling" },
    { value: "1", label: "monthly report and strategy call" },
  ],
  // Day number → what goes out. Days not listed are stories and community days.
  days: {
    1: { kind: "plan" },
    2: { kind: "reel", piece: "promotion-reel" },
    3: { kind: "carousel", piece: "learning-carousel" },
    4: { kind: "reel", piece: "muse-beauty-edit" },
    7: { kind: "reel", piece: "ramen-ad" },
    8: { kind: "carousel", piece: "quote-cards" },
    9: { kind: "reel", piece: "trading-reel" },
    11: { kind: "reel", piece: "kinetic-typography" },
    12: { kind: "carousel", piece: "mango-shake" },
    14: { kind: "reel", piece: "lipstick-ad" },
    16: { kind: "reel", piece: "realestate-reel" },
    17: { kind: "carousel", piece: "wellness-infographic" },
    18: { kind: "reel", piece: "outfit-details" },
    19: { kind: "carousel", piece: "re-edit-living-room" },
    21: { kind: "reel", piece: "masterclass-reel" },
    22: { kind: "carousel", piece: "street-food-menu" },
    23: { kind: "reel", piece: "lip-veil-launch" },
    25: { kind: "reel", piece: "lot-to-home" },
    26: { kind: "carousel", piece: "whisk-crumb-opening" },
    28: { kind: "reel", piece: "client-interviews" },
    29: { kind: "carousel", piece: "brew-and-bean-identity" },
    30: { kind: "report" },
  } as Record<number, { kind: DayKind; piece?: string }>,
  length: 30,
};

// Short names for the calendar cells.
export const kindShort: Record<DayKind | "story", string> = {
  plan: "Plan",
  reel: "Reel",
  carousel: "Post",
  report: "Report",
  story: "Stories",
};

export const kindLabel: Record<DayKind | "story", string> = {
  plan: "Strategy call",
  reel: "Reel",
  carousel: "Carousel or post",
  report: "Monthly report",
  story: "Stories and replies",
};
