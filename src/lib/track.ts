import { track as send } from "@vercel/analytics";

// Every conversion the site reports to Vercel Analytics (Analytics → Events), in one place. Properties stay
// short and never include anything a visitor typed.
type Events = {
  "Start project": { from: "hero" | "contact" };
  "Format requested": { format: string };
  "Brief sent": { services: number; timeline: string; budget: string };
  "Brief copied": Record<string, never>;
  "Email copied": { from: string };
  "Email clicked": { from: string };
  "Showreel opened": Record<string, never>;
  "Library piece opened": { piece: string; kind: string };
  "Library expanded": { pieces: number };
  "Case study shared": { how: "share sheet" | "link copied" };
  "Theme changed": { to: string };
};

export function track<E extends keyof Events>(event: E, ...props: Events[E] extends Record<string, never> ? [] : [Events[E]]) {
  try {
    send(event, props[0]);
  } catch {}
}
