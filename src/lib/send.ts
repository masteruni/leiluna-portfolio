import type { BriefData } from "./message";

// Sends a form to the studio through the site (POST /api/send) and says how it went:
//   "sent"         it's on its way
//   "unavailable"  the site has no email service set up (no RESEND_API_KEY): the form falls back to opening
//                  the visitor's own email app, as it did before the site could send
//   "busy"         too many tries from this visitor in a short time
//   "failed"       anything else: offline, a timeout, the email service turned it down
export type SendResult = "sent" | "unavailable" | "busy" | "failed";

type Payload = ({ kind: "brief" } & BriefData) | { kind: "orbit"; handle: string; email: string };

// `key` names this exact message. Sending the same key twice (a retry after a timeout that had in fact gone
// through) delivers one email, not two. `website` is a field people never see; only bots fill it in.
export async function send(payload: Payload, key: string, website = ""): Promise<SendResult> {
  try {
    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, key, website }),
      signal: AbortSignal.timeout(15000),
    });
    if (res.ok) return "sent";
    if (res.status === 503) return "unavailable";
    if (res.status === 429) return "busy";
    return "failed";
  } catch {
    return "failed";
  }
}

// A fresh name for a message (see `key` above).
export const newKey = () => {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  }
};
