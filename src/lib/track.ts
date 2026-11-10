import { track as send } from "@vercel/analytics";

// Every conversion the site reports to Vercel Analytics (Analytics → Events), in one place. Properties stay
// short and never include anything a visitor typed.
type Events = {
  "Start project": { from: "hero" | "contact" | "menu" };
  "Format requested": { format: string };
  "Brief sent": { services: number; timeline: string; budget: string };
  "Brief copied": Record<string, never>;
  "Brief step": { step: string };
  "Free audit": { from: string };
  "Orbit Check sent": Record<string, never>;
  // the visitor pressed send and saw it fail (they can try again, copy the text or use their own email)
  "Send failed": { form: "brief" | "orbit check"; why: "busy" | "failed" };
  "Call booked": { from: string };
  "Email copied": { from: string };
  "Email clicked": { from: string };
  "Library piece opened": { piece: string; kind: string };
  "Library expanded": { pieces: number };
  "Style requested": { piece: string };
  "Case study shared": { how: "share sheet" | "link copied" };
  "Theme changed": { to: string };
};

export function track<E extends keyof Events>(event: E, ...props: Events[E] extends Record<string, never> ? [] : [Events[E]]) {
  try {
    send(event, props[0]);
  } catch {}
}
