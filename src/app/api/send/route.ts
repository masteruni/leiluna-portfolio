import { brief as briefOptions, services, site } from "@/content/site";
import { briefSubject, briefText, orbitSubject, orbitText } from "@/lib/message";
import { isEmail, LIMITS, normalizeHandle } from "@/lib/validate";

// Sends the project brief and the Free Orbit Check request to the studio's inbox, through Resend
// (https://resend.com). Set these in Vercel → Project → Settings → Environment Variables:
//
//   RESEND_API_KEY  required. Without it this route answers 503 and the forms fall back to opening the
//                   visitor's own email app.
//   RESEND_FROM     optional. The sender, e.g. "Leiluna Studio <hello@leilunastudio.com>", on a domain verified
//                   in Resend. Until a domain is verified, Resend's test sender (the default below) works, but
//                   only delivers to the address the Resend account was created with.
//   BRIEF_TO        optional. Where the messages arrive. Defaults to the studio's email in src/content/site.ts.
//
// The visitor's address goes in Reply-To, so answering the email answers them.

const RESEND_URL = "https://api.resend.com/emails";
const MAX_BODY = 20_000; // bytes: several times the longest honest brief

// A little protection against one visitor (or script) flooding the inbox: 5 messages per 10 minutes per address.
// Best effort only: it's kept in memory, so it resets whenever the server function restarts.
const WINDOW = 10 * 60 * 1000;
const MAX_IN_WINDOW = 5;
const recent = new Map<string, number[]>();
function tooMany(who: string) {
  const now = Date.now();
  const times = (recent.get(who) ?? []).filter((t) => now - t < WINDOW);
  if (times.length >= MAX_IN_WINDOW) {
    recent.set(who, times);
    return true;
  }
  times.push(now);
  recent.set(who, times);
  if (recent.size > 5000) recent.clear();
  return false;
}

const reply = (status: number, reason?: string) => Response.json(reason ? { ok: false, reason } : { ok: true }, { status });

// One line of text, trimmed to a length: nothing a visitor types can add a line to the subject.
const line = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/[\r\n\t]+/g, " ").trim().slice(0, max) : "");
const pick = (v: unknown, allowed: readonly string[]) => (typeof v === "string" && allowed.includes(v) ? v : "");

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY) return reply(413, "too_large");
  let data: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return reply(400, "invalid");
    data = parsed as Record<string, unknown>;
  } catch {
    return reply(400, "invalid");
  }

  // The hidden field: people never see it, bots fill it in. They're told it worked, and nothing is sent.
  if (typeof data.website === "string" && data.website.trim()) return reply(200);

  const email = line(data.email, LIMITS.email);
  if (!isEmail(email)) return reply(400, "email");

  let subject: string;
  let text: string;
  if (data.kind === "brief") {
    const name = line(data.name, LIMITS.name);
    if (!name) return reply(400, "name");
    const titles = services.map((s) => s.title);
    const fields = {
      name,
      email,
      brand: line(data.brand, LIMITS.brand),
      link: line(data.link, LIMITS.link),
      needs: Array.isArray(data.needs) ? titles.filter((t) => (data.needs as unknown[]).includes(t)) : [],
      timeline: pick(data.timeline, briefOptions.timelines),
      budget: pick(data.budget, briefOptions.budgets),
      message: typeof data.message === "string" ? data.message.trim().slice(0, LIMITS.message) : "",
    };
    subject = briefSubject(fields);
    text = briefText(fields);
  } else if (data.kind === "orbit") {
    const handle = typeof data.handle === "string" ? normalizeHandle(data.handle) : null;
    if (!handle) return reply(400, "handle");
    subject = orbitSubject(handle);
    text = orbitText(handle, email);
  } else {
    return reply(400, "invalid");
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) return reply(503, "not_configured");

  const who = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (tooMany(who)) return reply(429, "busy");

  const once = typeof data.key === "string" && /^[\w-]{8,64}$/.test(data.key) ? data.key : null;
  try {
    const res = await fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...(once ? { "Idempotency-Key": once } : {}) },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || `${site.name} <onboarding@resend.dev>`,
        to: [process.env.BRIEF_TO || site.email],
        reply_to: email,
        subject,
        text,
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      // Resend's own reason (a wrong key, an unverified sender), for the function logs in Vercel. Nothing the
      // visitor typed is logged.
      console.error(`[send] Resend answered ${res.status}: ${(await res.text()).slice(0, 300)}`);
      return reply(502, "send_failed");
    }
  } catch (e) {
    console.error(`[send] Could not reach Resend: ${e instanceof Error ? e.name : "error"}`);
    return reply(502, "send_failed");
  }
  return reply(200);
}
