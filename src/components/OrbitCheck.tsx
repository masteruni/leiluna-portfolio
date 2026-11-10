"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { useFocusTrap } from "@/lib/focus";
import { orbitSubject, orbitText } from "@/lib/message";
import { closeOrbitCheck, isEmail, normalizeHandle, useOrbitCheckOpen } from "@/lib/orbitCheck";
import { newKey, send } from "@/lib/send";
import { track } from "@/lib/track";
import { LIMITS } from "@/lib/validate";
import { MoonPhase } from "./Eyebrow";
import { buttonClass, SwapLabel } from "./ui";

const sendLabels = [
  ["idle", "Get my 3 fixes"],
  ["sending", "Sending…"],
  ["retry", "Try again"],
] as const;

const field =
  "w-full border-b border-line bg-transparent py-3 text-paper outline-none transition-colors placeholder:text-muted focus:border-brand focus-visible:outline-none! focus:shadow-[0_1px_0_0_var(--brand)] aria-invalid:border-brand";

// The Free Orbit Check: an Instagram handle and an email, sent to the studio by the site itself, the same way as
// the project brief (src/app/api/send/route.ts). The visitor is told plainly when the request has gone and when it
// hasn't. If the site has no email service set up, it falls back to opening their own email app with the request
// written out. Opened from the hero and after Selected work.
export function OrbitCheck() {
  const open = useOrbitCheckOpen();
  return <AnimatePresence>{open && <Dialog />}</AnimatePresence>;
}

function Dialog() {
  const id = useId();
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const dialog = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLInputElement>(null);
  useFocusTrap(dialog, true);

  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ handle?: string; email?: string }>({});
  // "sent": the site delivered it. "mailed": no email service is set up, so it was handed to the visitor's own
  // email app. Both remember the cleaned-up handle, to say what was sent.
  const [state, setState] = useState<"idle" | "sending" | "sent" | "mailed" | "failed" | "busy">("idle");
  const [sent, setSent] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const key = useRef(""); // names this request, so a retry can never deliver it twice (see send.ts)
  const website = useRef<HTMLInputElement>(null); // the field only bots fill in
  const done = useRef<HTMLHeadingElement>(null);

  // Focus goes to the first field as the dialog opens, and back to the button that opened it when it closes.
  useEffect(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    first.current?.focus();
    return () => opener?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeOrbitCheck();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [lenis]);

  // Once it has gone, keyboard and screen-reader users land on the confirmation.
  useEffect(() => {
    if (state === "sent") done.current?.focus();
  }, [state]);

  const request = (h: string) => orbitText(h, email.trim());

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const h = normalizeHandle(handle);
    const next = {
      handle: !handle.trim() ? "Add your Instagram handle." : !h ? "That doesn't look like an Instagram handle. Try @yourbrand." : undefined,
      email: !email.trim() ? "Add your email so we can send your fixes." : !isEmail(email) ? "Check your email address, it looks incomplete." : undefined,
    };
    setErrors(next);
    if (next.handle || next.email || !h) {
      document.getElementById(next.handle ? `${id}-handle` : `${id}-email`)?.focus();
      return;
    }
    if (state === "sending") return;
    setHandle(`@${h}`);
    setState("sending");
    key.current ||= newKey();
    send({ kind: "orbit", handle: h, email: email.trim() }, key.current, website.current?.value).then((result) => {
      if (result === "sent" || result === "unavailable") track("Orbit Check sent");
      else track("Send failed", { form: "orbit check", why: result });
      if (result === "sent") {
        setSent(h);
        setState("sent");
      } else if (result === "unavailable") {
        setSent(h);
        setState("mailed");
        window.location.assign(`mailto:${site.email}?subject=${encodeURIComponent(orbitSubject(h))}&body=${encodeURIComponent(request(h))}`);
      } else {
        setState(result);
      }
    });
  };

  const copy = async () => {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(`To: ${site.email}\nSubject: ${orbitSubject(sent)}\n\n${request(sent)}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <motion.div
      className="fixed inset-0 z-[96] grid place-items-center overflow-y-auto bg-ink/85 p-4 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.2 } }}
      onClick={closeOrbitCheck}
    >
      <motion.div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${id}-title`}
        className="relative w-full max-w-md rounded-[2rem] border border-line bg-ink-2 p-6 shadow-[0_40px_120px_-20px_rgb(234_106_142/0.3)] sm:p-9"
        initial={{ opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: reduce ? 0 : 8, transition: { duration: 0.2 } }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeOrbitCheck}
          className={buttonClass("outline", "sm", "absolute right-5 top-5")}
        >
          Close<span className="sr-only"> the Orbit Check</span>
        </button>

        <p className="text-sm text-accent">Free feed audit</p>
        <h2 id={`${id}-title`} className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
          Free Orbit Check
        </h2>

        <div aria-live="polite">
          {state === "sent" && sent ? (
            // It has gone: the moon that waxes through the page's section markers is full.
            <div className="mt-6">
              <MoonPhase lit={1} className="size-9 text-paper" />
              <h3 ref={done} tabIndex={-1} className="mt-5 font-display text-2xl font-semibold tracking-[-0.02em] outline-none">
                Request sent.
              </h3>
              <p className="mt-2 leading-relaxed text-paper/70 [overflow-wrap:anywhere]">
                We&apos;ll look at @{sent} and send 3 fixes to <span className="text-paper">{email.trim()}</span> within 48 hours.
              </p>
              <button type="button" onClick={closeOrbitCheck} className={buttonClass("solid", "lg", "mt-8 w-full")}>
                Done
              </button>
            </div>
          ) : state === "mailed" && sent ? (
            <div className="mt-6">
              <p className="text-lg text-paper">Almost there. Your email app should open with the request for @{sent} written out. Just hit send.</p>
              <p className="mt-3 text-sm leading-relaxed text-paper/60">
                Didn&apos;t open? Copy it and send it to {site.email} from any email account.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={copy} className={buttonClass("outline", "md")}>
                  {copied ? "Copied" : "Copy the request"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSent(null);
                    setState("idle");
                  }}
                  className={buttonClass("outline", "md")}
                >
                  Change details
                </button>
              </div>
            </div>
          ) : (
            <form noValidate onSubmit={submit} className="mt-2">
              <p className="text-paper/70">3 fixes for your feed in 48h. Free.</p>
              <div className="mt-6">
                <label htmlFor={`${id}-handle`} className="text-sm text-muted">
                  Your Instagram
                </label>
                <input
                  ref={first}
                  id={`${id}-handle`}
                  value={handle}
                  onChange={(e) => {
                    setHandle(e.target.value);
                    key.current = ""; // a changed request is a new one
                    if (errors.handle) setErrors((x) => ({ ...x, handle: undefined }));
                  }}
                  onBlur={() => {
                    const h = normalizeHandle(handle);
                    if (h) setHandle(`@${h}`);
                  }}
                  autoComplete="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  aria-invalid={!!errors.handle || undefined}
                  aria-describedby={errors.handle ? `${id}-handle-error` : undefined}
                  placeholder="@yourbrand"
                  className={field}
                />
                {errors.handle && (
                  <p id={`${id}-handle-error`} role="alert" className="mt-2 text-sm text-accent">
                    {errors.handle}
                  </p>
                )}
              </div>
              <div className="mt-5">
                <label htmlFor={`${id}-email`} className="text-sm text-muted">
                  Where should we send your fixes?
                </label>
                <input
                  id={`${id}-email`}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    key.current = "";
                    if (errors.email) setErrors((x) => ({ ...x, email: undefined }));
                  }}
                  aria-invalid={!!errors.email || undefined}
                  aria-describedby={errors.email ? `${id}-email-error` : undefined}
                  maxLength={LIMITS.email}
                  placeholder="you@yourbrand.com"
                  className={field}
                />
                {errors.email && (
                  <p id={`${id}-email-error`} role="alert" className="mt-2 text-sm text-accent">
                    {errors.email}
                  </p>
                )}
              </div>
              {/* a send that didn't go through, said plainly beside the button that retries it; the fields keep their values */}
              {(state === "failed" || state === "busy") && (
                <div role="alert" className="mt-6 text-sm leading-relaxed transition-opacity duration-200 ease-[var(--ease-out)] starting:opacity-0">
                  <p className="font-medium text-accent">{state === "busy" ? "That's a lot of tries in a row." : "We couldn't send your request."}</p>
                  <p className="mt-1 text-paper/70">
                    {state === "busy" ? "Give it a few minutes, then try again, or" : "Try again, or"} email{" "}
                    <a href={`mailto:${site.email}`} className="text-paper underline decoration-paper/30 underline-offset-4 hover:text-accent hover:decoration-accent">
                      {site.email}
                    </a>{" "}
                    with your Instagram handle.
                  </p>
                </div>
              )}
              <button
                type="submit"
                aria-disabled={state === "sending" || undefined}
                className={buttonClass("primary", "lg", `mt-8 w-full ${state === "sending" ? "cursor-progress opacity-70" : ""}`)}
              >
                <SwapLabel current={state === "sending" ? "sending" : state === "failed" || state === "busy" ? "retry" : "idle"} labels={sendLabels} />
              </button>
              {/* never shown to people; a bot that fills it in gives itself away (see src/lib/send.ts) */}
              <input ref={website} type="text" name="lu_extra" tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" />
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
