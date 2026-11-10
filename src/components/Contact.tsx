"use client";

import { ArrowRight, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { brief as briefOptions, services, site } from "@/content/site";
import { clearBriefPrefill, peekBriefPrefill, setBriefOpen, useBriefOpen, useBriefVersion } from "@/lib/brief";
import { briefSubject, briefText, type BriefData } from "@/lib/message";
import { newKey, send } from "@/lib/send";
import { spark } from "@/lib/spark";
import { track } from "@/lib/track";
import { isEmail, LIMITS } from "@/lib/validate";
import { Eyebrow, MoonPhase } from "./Eyebrow";
import { LineReveal } from "./LineReveal";
import { Magnetic } from "./Magnetic";
import { buttonClass, chipClass, SwapLabel } from "./ui";
import { TrustLine } from "./TrustLine";
import { CallLink } from "./CallLink";

const label = "text-sm text-muted";
const briefCopyLabels = [
  ["idle", "Copy the brief"],
  ["done", "Copied"],
] as const;
const sendLabels = [
  ["idle", "Send brief"],
  ["sending", "Sending…"],
  ["retry", "Try again"],
] as const;
const emailCopyLabels = [
  ["idle", "Copy email"],
  ["done", "Copied"],
] as const;

const field =
  "w-full border-b border-line bg-transparent py-3 text-paper outline-none transition-colors placeholder:text-muted focus:border-brand";
// A field's error eases in rather than popping (CSS @starting-style); reduced motion keeps only the fade.
const fieldError =
  "mt-2 text-sm text-accent transition-[opacity,translate] duration-200 ease-[var(--ease-out)] starting:-translate-y-1 starting:opacity-0 motion-reduce:starting:translate-y-0";

// Single-choice chips; tapping the selected one again clears it. Picking one throws a little spark.
function Choice({ legend, options, value, onChange }: { legend: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset>
      <legend className={label}>{legend}</legend>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === o}
            onClick={(e) => {
              if (value !== o) spark(e);
              onChange(value === o ? "" : o);
            }}
            className={chipClass(value === o, "paper", "sm")}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

const DRAFT_KEY = "leiluna:brief";
type Draft = BriefData;
const empty: Draft = { name: "", email: "", brand: "", link: "", needs: [], timeline: "", budget: "", message: "" };

// Where a send stands. "mailed": the site has no email service set up, so the brief was handed to the visitor's
// own email app instead (how the brief worked before the site could send).
type Sending = "idle" | "sending" | "sent" | "failed" | "busy" | "mailed";

// The brief is only mounted after a click, so it's safe to read storage during the first render.
function loadDraft(): Draft {
  let draft = empty;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (raw) draft = { ...empty, ...(JSON.parse(raw) as Partial<Draft>) };
  } catch {}
  // Details handed over by another section ("I want this" on a format) are added on top of the draft.
  const p = peekBriefPrefill();
  if (p?.need && !draft.needs.includes(p.need)) draft = { ...draft, needs: [...draft.needs, p.need] };
  if (p?.message && !draft.message.includes(p.message)) draft = { ...draft, message: draft.message ? `${draft.message}\n\n${p.message}` : p.message };
  return draft;
}

// The brief's steps: short names for the progress bar and the Next button, and each step's question.
const STEPS = ["About you", "What you need", "Timing & budget", "Your story"];
const STEP_TITLES = ["Who are we talking to?", "What can we help with?", "When, and roughly how much?", "Tell us your story."];

// What the earlier steps came to, in four lines: read back before sending, and again once it has gone.
function ReadBack({ d }: { d: Draft }) {
  return (
    <dl className="mt-6 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
      {[
        ["From", [d.name, d.brand].filter(Boolean).join(", ") || "Not set"],
        ["Needs", d.needs.join(", ") || "Not set"],
        ["Timeline", d.timeline || "Not set"],
        ["Budget", d.budget || "Not set"],
      ].map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="text-muted">{k}</dt>
          {/* long names and brands wrap inside the card rather than running out of it */}
          <dd className={`min-w-0 [overflow-wrap:anywhere] ${v === "Not set" ? "text-paper/50" : "text-paper/85"}`}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

// The brief has gone. This is the moment the whole page works toward, so it says so in the page's own terms: the
// moon that waxes through the section markers is full. It confirms where the reply will go and what was sent, and
// offers the one thing left to do. Focus moves to the heading so keyboard and screen-reader users hear it.
function BriefSent({ d, onDone }: { d: Draft; onDone: () => void }) {
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => title.current?.focus({ preventScroll: true }), []);
  const first = d.name.trim().split(/\s+/)[0];
  return (
    <motion.div
      role="status"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto mt-14 w-full max-w-3xl overflow-hidden rounded-[2rem] border border-line bg-ink-2/70 p-6 text-left backdrop-blur-xl sm:p-10"
    >
      <MoonPhase lit={1} className="size-10 text-paper" />
      <h3 ref={title} tabIndex={-1} className="mt-6 font-display text-3xl font-semibold tracking-[-0.03em] outline-none sm:text-4xl">
        Brief sent.
      </h3>
      <p className="mt-3 max-w-xl text-lg leading-relaxed text-paper/70 [overflow-wrap:anywhere]">
        Thanks, {first}. It&apos;s with the studio now, and we&apos;ll reply to <span className="text-paper">{d.email.trim()}</span> within {site.replyTime}.
      </p>
      <ReadBack d={d} />
      <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-paper/70">
          Want to talk sooner? <CallLink from="brief sent">Book a free 30-min call</CallLink>
        </p>
        <button type="button" onClick={onDone} className={buttonClass("solid", "lg")}>
          Close
        </button>
      </div>
    </motion.div>
  );
}

// A short project brief, sent to the studio by the site itself (src/app/api/send/route.ts). The visitor is told
// plainly when it has gone, and when it hasn't: a failed send keeps everything they typed and offers another try,
// the text to copy, and their own email app. Whatever is typed is kept for the session, so an accidental reload
// doesn't wipe it.
function Brief({ onDone }: { onDone: () => void }) {
  const id = useId();
  const [draft, setDraft] = useState<Draft>(loadDraft);
  const { name, email, brand, link, needs, timeline, budget, message } = draft;
  const set = <K extends keyof Draft>(key: K) => (value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const setName = set("name"), setEmail = set("email"), setBrand = set("brand"), setLink = set("link"), setTimeline = set("timeline"), setBudget = set("budget"), setMessage = set("message");
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState<Sending>("idle");
  const website = useRef<HTMLInputElement>(null); // the field only bots fill in (see send.ts)

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {}
  }, [draft]);
  useEffect(clearBriefPrefill, []);

  const body = useMemo(() => briefText(draft), [draft]);
  // Names this exact brief: sending it again unchanged (a retry) can never deliver it twice.
  const key = useMemo(() => (body ? newKey() : ""), [body]);
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(briefSubject(draft))}&body=${encodeURIComponent(body)}`;

  const toggle = (n: string) =>
    setDraft((d) => ({ ...d, needs: d.needs.includes(n) ? d.needs.filter((x) => x !== n) : [...d.needs, n] }));

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`To: ${site.email}\n\n${body}`);
      track("Brief copied");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Four short steps instead of one long form. Only a name and an email are required (the email is how the studio
  // replies), checked when leaving step 1 and again on send; every other step can be skipped.
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState<"" | "missing" | "invalid">("");
  // Marks what's missing on step 1, puts the cursor in the first field that needs fixing, and says if all is well.
  const aboutYouOk = () => {
    const noName = !name.trim();
    const badEmail = !email.trim() ? "missing" : !isEmail(email) ? "invalid" : "";
    setNameError(noName);
    setEmailError(badEmail);
    if (noName || badEmail) requestAnimationFrame(() => document.getElementById(noName ? `${id}-name` : `${id}-email`)?.focus());
    return !noName && !badEmail;
  };
  const moved = useRef(false); // only move focus after the visitor changes step, not when the brief first opens
  const reduce = useReducedMotion();
  const last = STEPS.length - 1;

  const goTo = (n: number) => {
    if (n > 0 && step === 0 && !aboutYouOk()) return;
    setDir(n > step ? 1 : -1);
    moved.current = true;
    setStep(n);
    track("Brief step", { step: STEPS[n] });
  };
  // Focus follows the step, so keyboard and screen-reader users land on the new step's title. It's set as the
  // title mounts, since the new step only appears once the old one has animated out.
  const focusTitle = (el: HTMLHeadingElement | null) => {
    if (el && moved.current) {
      moved.current = false;
      el.focus({ preventScroll: true });
    }
  };

  if (sending === "sent") return <BriefSent d={draft} onDone={onDone} />;

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onSubmit={(e) => {
        e.preventDefault();
        // Enter in a field moves on to the next step; only the last step sends.
        if (step < last) return goTo(step + 1);
        if (sending === "sending") return;
        if (!name.trim() || !isEmail(email)) {
          setDir(-1);
          setStep(0);
          aboutYouOk();
          return;
        }
        setSending("sending");
        send({ kind: "brief", ...draft }, key, website.current?.value).then((result) => {
          if (result === "sent" || result === "unavailable") {
            track("Brief sent", { services: needs.length, timeline: timeline || "not set", budget: budget || "not set" });
          } else {
            track("Send failed", { form: "brief", why: result });
          }
          if (result === "sent") {
            // It has gone, so the saved draft goes too: opening the brief again starts a new one.
            try {
              sessionStorage.removeItem(DRAFT_KEY);
            } catch {}
            setSending("sent");
          } else if (result === "unavailable") {
            setSending("mailed");
            window.location.assign(mailto);
          } else {
            setSending(result);
          }
        });
      }}
      className="mx-auto mt-14 w-full max-w-3xl overflow-hidden rounded-[2rem] border border-line bg-ink-2/70 p-6 text-left backdrop-blur-xl sm:p-10"
      aria-label="Project brief"
    >
      {/* progress: one segment per step; reached steps can be revisited */}
      <ol className="grid grid-cols-4 gap-2" aria-label="Brief steps">
        {STEPS.map((title, n) => (
          <li key={title}>
            <button
              type="button"
              onClick={() => n !== step && goTo(n)}
              aria-current={n === step ? "step" : undefined}
              className="group block w-full text-left pointer-coarse:min-h-11"
            >
              <span className="block h-1 overflow-hidden rounded-full bg-paper/10">
                <span
                  className={`block h-full origin-left rounded-full bg-brand transition-transform duration-500 ease-[var(--ease-out)] ${n <= step ? "scale-x-100" : "scale-x-0"}`}
                />
              </span>
              <span className={`mt-2 block text-xs transition-colors max-sm:sr-only ${n === step ? "text-paper" : "text-muted group-hover:text-paper/80"}`}>{title}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-8 min-h-[18rem]">
        <AnimatePresence mode="wait" initial={false} custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={reduce ? false : { opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-sm text-muted">
              Step {step + 1} of {STEPS.length}
            </p>
            <h3 ref={focusTitle} tabIndex={-1} className="mt-1 font-display text-3xl font-semibold tracking-[-0.03em] outline-none sm:text-4xl">
              {STEP_TITLES[step]}
            </h3>

            {step === 0 && (
              <div className="mt-8 grid gap-8">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`${id}-name`} className={label}>
                      Your name
                    </label>
                    <input
                      id={`${id}-name`}
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (e.target.value.trim()) setNameError(false);
                      }}
                      autoComplete="name"
                      maxLength={LIMITS.name}
                      aria-required="true"
                      aria-invalid={nameError || undefined}
                      aria-describedby={nameError ? `${id}-name-error` : undefined}
                      className={`${field} ${nameError ? "border-brand" : ""}`}
                      placeholder="Alex"
                    />
                    {nameError && (
                      <p id={`${id}-name-error`} role="alert" className={fieldError}>
                        Add your name so we know who we&apos;re talking to.
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor={`${id}-email`} className={label}>
                      Your email
                    </label>
                    <input
                      id={`${id}-email`}
                      type="email"
                      inputMode="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError("");
                      }}
                      autoComplete="email"
                      autoCapitalize="none"
                      spellCheck={false}
                      maxLength={LIMITS.email}
                      aria-required="true"
                      aria-invalid={!!emailError || undefined}
                      aria-describedby={emailError ? `${id}-email-error` : undefined}
                      className={`${field} ${emailError ? "border-brand" : ""}`}
                      placeholder="you@yourbrand.com"
                    />
                    {emailError && (
                      <p id={`${id}-email-error`} role="alert" className={fieldError}>
                        {emailError === "missing" ? "Add your email so we can reply to you." : "Check your email address, it looks incomplete."}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`${id}-brand`} className={label}>
                      Brand or company
                    </label>
                    <input
                      id={`${id}-brand`}
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      autoComplete="organization"
                      maxLength={LIMITS.brand}
                      className={field}
                      placeholder="Your brand"
                    />
                  </div>
                  <div>
                    <label htmlFor={`${id}-link`} className={label}>
                      Where can we see it? <span className="text-paper/50">(optional)</span>
                    </label>
                    <input
                      id={`${id}-link`}
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      autoComplete="url"
                      inputMode="url"
                      autoCapitalize="none"
                      maxLength={LIMITS.link}
                      className={field}
                      placeholder="@yourbrand or yourbrand.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <fieldset className="mt-8">
                <legend className="text-paper/70">Pick everything that applies. You can add more later.</legend>
                <div className="mt-5 flex flex-wrap gap-2">
                  {services.map((s) => {
                    const on = needs.includes(s.title);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        aria-pressed={on}
                        onClick={(e) => {
                          if (!on) spark(e);
                          toggle(s.title);
                        }}
                        className={chipClass(on, "brand", "md")}
                      >
                        {s.title}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <div className="mt-8 grid gap-8 sm:grid-cols-2">
                <Choice legend="Timeline" options={briefOptions.timelines} value={timeline} onChange={setTimeline} />
                <Choice legend="Budget" options={briefOptions.budgets} value={budget} onChange={setBudget} />
              </div>
            )}

            {step === 3 && (
              <div className="mt-8">
                <label htmlFor={`${id}-msg`} className={label}>
                  Tell us about your story
                </label>
                <textarea
                  id={`${id}-msg`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  maxLength={LIMITS.message}
                  className={`${field} resize-y`}
                  placeholder="Where you are now, where you want to be, and anything we should know."
                />
                {/* a quick read-back of the earlier steps before sending */}
                <ReadBack d={draft} />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* A send that didn't go through: said plainly, next to the buttons that fix it. Nothing typed is lost. */}
      {step === last && (sending === "failed" || sending === "busy") && (
        <div role="alert" className="mt-8 text-sm leading-relaxed transition-opacity duration-200 ease-[var(--ease-out)] starting:opacity-0">
          <p className="font-medium text-accent">{sending === "busy" ? "That's a lot of tries in a row." : "We couldn't send your brief."}</p>
          <p className="mt-1 max-w-xl text-paper/70">
            {sending === "busy" ? "Give it a few minutes, then try again. " : "Nothing is lost: everything you wrote is still here. Try again, "}
            {sending === "busy" ? "Or copy" : "or copy"} the brief and send it to {site.email} yourself, or{" "}
            <a href={mailto} className="text-paper underline decoration-paper/30 underline-offset-4 hover:text-accent hover:decoration-accent">
              open it in your email app
            </a>
            .
          </p>
        </div>
      )}

      <div className="mt-10 flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-6 text-sm text-muted">
          {step > 0 && (
            <button type="button" onClick={() => goTo(step - 1)} className="hover:text-paper pointer-coarse:min-h-11">
              Back
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setDraft(empty);
              setSending("idle");
              setNameError(false);
              setEmailError("");
              setDir(-1);
              setStep(0);
            }}
            className="hover:text-paper pointer-coarse:min-h-11"
          >
            Clear
          </button>
          <button type="button" onClick={onDone} className="hover:text-paper pointer-coarse:min-h-11">
            Close
          </button>
        </div>
        {step < last ? (
          // A submit button, so Enter in a field moves on too (the form turns any submit before the last step into "next").
          <button
            type="submit"
            className={buttonClass("solid", "lg", "gap-3")}
          >
            {step === 1 && !needs.length ? "Skip for now" : `Next: ${STEPS[step + 1]}`}
            <ArrowRight aria-hidden className="size-4" />
          </button>
        ) : (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={(e) => {
                spark(e);
                copy();
              }}
              className={buttonClass("outline", "lg")}
            >
              <SwapLabel current={copied ? "done" : "idle"} labels={briefCopyLabels} />
            </button>
            <button
              type="submit"
              onClick={(e) => sending !== "sending" && spark(e)}
              aria-disabled={sending === "sending" || undefined}
              className={buttonClass("primary", "lg", `gap-3 ${sending === "sending" ? "cursor-progress opacity-70" : ""}`)}
            >
              <SwapLabel current={sending === "sending" ? "sending" : sending === "failed" || sending === "busy" ? "retry" : "idle"} labels={sendLabels} />
            </button>
          </div>
        )}
      </div>
      {step === last && sending !== "failed" && sending !== "busy" && (
        <p className="mt-6 text-xs text-muted" aria-live="polite">
          {sending === "mailed"
            ? `Your mail app should have opened with the brief filled in. If it didn't, copy the brief and send it to ${site.email}. We reply within ${site.replyTime}.`
            : `Goes straight to the studio. We reply within ${site.replyTime}.`}
        </p>
      )}
      {/* never shown to people; a bot that fills it in gives itself away (see src/lib/send.ts) */}
      <input ref={website} type="text" name="lu_extra" tabIndex={-1} autoComplete="off" aria-hidden="true" className="sr-only" />
    </motion.form>
  );
}

// The main call to action, the same pink pill as the hero's "Start a project" at a larger size, so the page's one
// action looks the same wherever it appears. On hover a light fill rises through it and the arrow moves forward.
function StartButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <Magnetic strength={0.2} className="inline-block">
      <button
        type="button"
        onClick={onClick}
        aria-expanded={open}
        aria-controls="project-brief"
        className="press group relative inline-flex h-16 items-center gap-6 overflow-hidden rounded-full bg-brand pl-8 pr-2 text-lg font-medium text-on-brand sm:h-[4.5rem] sm:pl-9 sm:text-xl"
      >
        <span className="absolute inset-0 translate-y-full rounded-full bg-paper transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-y-0 group-focus-visible:translate-y-0" />
        <span className="relative">{open ? "Close the brief" : "Start a project"}</span>
        <span className="relative grid size-12 place-items-center rounded-full bg-ink text-paper sm:size-14">
          {open ? (
            <X aria-hidden className="size-5" />
          ) : (
            <ArrowRight aria-hidden className="size-5 transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-0.5" />
          )}
        </span>
      </button>
    </Magnetic>
  );
}

// The finale: a planet rises over the horizon while the call to action lands.
export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const brief = useBriefOpen();
  const briefVersion = useBriefVersion();
  const setBrief = setBriefOpen;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const rise = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["35%", "0%"]);
  const glow = useTransform(scrollYProgress, [0.3, 1], [0.2, 1]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      track("Email copied", { from: "contact" });
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <section ref={ref} id="contact" className="night relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pb-36 pt-24 sm:px-10 md:pb-40 md:pt-20">
      {/* rising planet: its rim is measured up from the foot of the section, so it stays under the last line of content
          (the padding above keeps them apart) however tall the section gets, brief open or closed */}
      <motion.div aria-hidden style={{ y: rise }} className="pointer-events-none absolute left-1/2 top-[calc(100%-6.5rem)] w-[170vw] -translate-x-1/2 md:top-[calc(100%-7rem)] md:w-[150vw]">
        <motion.div
          style={{ opacity: glow }}
          className="aspect-square w-full rounded-full"
          // pink limb + atmosphere, like the header artwork
        >
          <div
            className="size-full rounded-full bg-ink"
            style={{
              boxShadow:
                "0 -1px 0 0 var(--brand-2), 0 -10px 40px -4px var(--brand), 0 -60px 160px -20px rgb(234 106 142 / 0.45), inset 0 30px 80px -40px rgb(234 106 142 / 0.6)",
            }}
          />
        </motion.div>
      </motion.div>

      <div className="relative mx-auto w-full max-w-7xl text-center">
        <Eyebrow id="contact" />
        <h2 className="mt-8 font-display text-[clamp(3.6rem,min(12vw,16svh),12rem)] font-bold leading-[0.85] tracking-[-0.05em]">
          <LineReveal
            inView
            lines={["Let's build", <span key="b">your brand.</span>]}
          />
        </h2>
        <p className="mx-auto mt-8 max-w-md text-lg text-paper/60">
          Tell us about your story. We&apos;ll reply within {site.replyTime} with ideas, not a sales script.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-10">
          <StartButton
            open={brief}
            onClick={() => {
              if (!brief) track("Start project", { from: "contact" });
              setBrief((b) => !b);
            }}
          />
          <div className="flex flex-col items-center gap-1 sm:items-start sm:border-l sm:border-line sm:pl-10">
            <a href={`mailto:${site.email}`} onClick={() => track("Email clicked", { from: "contact" })} className="font-display text-2xl font-medium transition-colors pointer-coarse:inline-flex pointer-coarse:min-h-11 pointer-coarse:items-center hover:text-accent sm:text-3xl">
              {site.email}
            </a>
            <button
              type="button"
              onClick={(e) => {
                spark(e);
                copy();
              }}
              className="text-sm text-muted transition-colors hover:text-paper pointer-coarse:min-h-11 pointer-coarse:px-3">
              <SwapLabel current={copied ? "done" : "idle"} labels={emailCopyLabels} />
            </button>
          </div>
        </div>

        <p className="mt-8 text-paper/70">
          Not sure where to start? <CallLink from="contact">Book a free 30-min call</CallLink> and we&apos;ll talk it through.
        </p>

        {/* brands we've worked with, right where the decision is made */}
        <TrustLine align="center" className="mt-8" />

        <div id="project-brief">
          <AnimatePresence>{brief && <Brief key={briefVersion} onDone={() => setBrief(false)} />}</AnimatePresence>
        </div>
      </div>
    </section>
  );
}
