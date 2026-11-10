"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useLenis } from "lenis/react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { site } from "@/content/site";
import { useFocusTrap } from "@/lib/focus";
import { closeOrbitCheck, isEmail, normalizeHandle, useOrbitCheckOpen } from "@/lib/orbitCheck";
import { track } from "@/lib/track";
import { buttonClass } from "./ui";

const field =
  "w-full border-b border-line bg-transparent py-3 text-paper outline-none transition-colors placeholder:text-muted focus:border-brand focus-visible:outline-none! focus:shadow-[0_1px_0_0_var(--brand)] aria-invalid:border-brand";

// The Free Orbit Check: an Instagram handle and an email, sent the same way as the project brief (it opens the
// visitor's email app with the request written out, addressed to the studio). Opened from the hero and after Selected work.
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
  const [sent, setSent] = useState<string | null>(null); // the cleaned-up handle, once sent
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    lenis?.stop();
    first.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeOrbitCheck();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [lenis]);

  const request = (h: string) =>
    [
      `Hi Leiluna,`,
      ``,
      `I'd like a free Orbit Check (3 fixes for our feed).`,
      ``,
      `Instagram: @${h} (https://instagram.com/${h})`,
      `Reply to: ${email.trim()}`,
      ``,
      `Thanks!`,
    ].join("\n");

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
    setHandle(`@${h}`);
    track("Orbit Check sent");
    setSent(h);
    window.location.assign(
      `mailto:${site.email}?subject=${encodeURIComponent(`Free Orbit Check: @${h}`)}&body=${encodeURIComponent(request(h))}`,
    );
  };

  const copy = async () => {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(`To: ${site.email}\nSubject: Free Orbit Check: @${sent}\n\n${request(sent)}`);
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
          {sent ? (
            <div className="mt-6">
              <p className="text-lg text-paper">Almost there. Your email app should open with the request for @{sent} written out. Just hit send.</p>
              <p className="mt-3 text-sm leading-relaxed text-paper/60">
                Didn&apos;t open? Copy it and send it to {site.email} from any email account.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={copy} className={buttonClass("outline", "md")}>
                  {copied ? "Copied" : "Copy the request"}
                </button>
                <button type="button" onClick={() => setSent(null)} className={buttonClass("outline", "md")}>
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
                    if (errors.email) setErrors((x) => ({ ...x, email: undefined }));
                  }}
                  aria-invalid={!!errors.email || undefined}
                  aria-describedby={errors.email ? `${id}-email-error` : undefined}
                  placeholder="you@yourbrand.com"
                  className={field}
                />
                {errors.email && (
                  <p id={`${id}-email-error`} role="alert" className="mt-2 text-sm text-accent">
                    {errors.email}
                  </p>
                )}
              </div>
              <button type="submit" className={buttonClass("primary", "lg", "mt-8 w-full")}>
                Get my 3 fixes
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
