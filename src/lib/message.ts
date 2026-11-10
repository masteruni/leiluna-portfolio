// The words of the two messages the site sends to the studio: the project brief and the Free Orbit Check
// request. Written once and used in three places, so they always match: the email the site sends
// (src/app/api/send/route.ts), "Copy the brief", and the fallback that opens the visitor's own email app.

export type BriefData = { name: string; email: string; brand: string; link: string; needs: string[]; timeline: string; budget: string; message: string };

export const briefSubject = (b: Pick<BriefData, "brand">) => `New project${b.brand ? `: ${b.brand}` : ""}`;

export function briefText(b: BriefData) {
  return [
    `Hi Leiluna,`,
    ``,
    `I'm ${b.name || "…"}${b.brand ? ` from ${b.brand}` : ""}.`,
    b.link ? `You can find us at ${b.link}.` : ``,
    b.email ? `Reply to: ${b.email}` : ``,
    ``,
    b.needs.length ? `What we need: ${b.needs.join(", ")}` : ``,
    b.timeline ? `Timeline: ${b.timeline}` : ``,
    b.budget ? `Budget: ${b.budget}` : ``,
    ``,
    b.message,
    ``,
    `Thanks!`,
  ]
    .filter((l, i, all) => !(l === "" && all[i - 1] === ""))
    .join("\n");
}

export const orbitSubject = (handle: string) => `Free Orbit Check: @${handle}`;

export function orbitText(handle: string, email: string) {
  return [
    `Hi Leiluna,`,
    ``,
    `I'd like a free Orbit Check (3 fixes for our feed).`,
    ``,
    `Instagram: @${handle} (https://instagram.com/${handle})`,
    `Reply to: ${email}`,
    ``,
    `Thanks!`,
  ].join("\n");
}
