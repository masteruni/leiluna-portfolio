"use client";

import { ArrowRight, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { brief as briefOptions, services, site } from "@/content/site";
import { clearBriefPrefill, peekBriefPrefill, setBriefOpen, useBriefOpen, useBriefVersion } from "@/lib/brief";
import { spark } from "@/lib/spark";
import { track } from "@/lib/track";
import { Eyebrow } from "./Eyebrow";
import { LineReveal } from "./LineReveal";
import { Magnetic } from "./Magnetic";

const label = "font-mono text-[10px] uppercase tracking-[0.25em] text-muted";
const field =
  "w-full border-b border-line bg-transparent py-3 text-paper outline-none transition-colors placeholder:text-paper/30 focus:border-brand";

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
            className={`rounded-full border px-3.5 py-2 text-xs transition-colors pointer-coarse:min-h-11 ${
              value === o ? "border-paper bg-paper text-ink" : "border-line text-paper/70 hover:border-paper/50 hover:text-paper"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

const DRAFT_KEY = "leiluna:brief";
type Draft = { name: string; brand: string; link: string; needs: string[]; timeline: string; budget: string; message: string };
const empty: Draft = { name: "", brand: "", link: "", needs: [], timeline: "", budget: "", message: "" };

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

// A short project brief that turns into a ready-to-send email (no backend needed).
// Whatever you type is kept for the session, so an accidental reload doesn't wipe it.
function Brief({ onDone }: { onDone: () => void }) {
  const id = useId();
  const [draft, setDraft] = useState<Draft>(loadDraft);
  const { name, brand, link, needs, timeline, budget, message } = draft;
  const set = <K extends keyof Draft>(key: K) => (value: Draft[K]) => setDraft((d) => ({ ...d, [key]: value }));
  const setName = set("name"), setBrand = set("brand"), setLink = set("link"), setTimeline = set("timeline"), setBudget = set("budget"), setMessage = set("message");
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
    } catch {}
  }, [draft]);
  useEffect(clearBriefPrefill, []);

  const body = useMemo(
    () =>
      [
        `Hi Leiluna,`,
        ``,
        `I'm ${name || "…"}${brand ? ` from ${brand}` : ""}.`,
        link ? `You can find us at ${link}.` : ``,
        ``,
        needs.length ? `What we need: ${needs.join(", ")}` : ``,
        timeline ? `Timeline: ${timeline}` : ``,
        budget ? `Budget: ${budget}` : ``,
        ``,
        message,
        ``,
        `Thanks!`,
      ]
        .filter((l, i, all) => !(l === "" && all[i - 1] === ""))
        .join("\n"),
    [name, brand, link, needs, timeline, budget, message],
  );
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(`New project${brand ? `: ${brand}` : ""}`)}&body=${encodeURIComponent(body)}`;

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

  // Four short steps instead of one long form. The name is the only required field, checked when leaving step 1
  // and again on send; every other step can be skipped.
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [nameError, setNameError] = useState(false);
  const moved = useRef(false); // only move focus after the visitor changes step, not when the brief first opens
  const reduce = useReducedMotion();
  const last = STEPS.length - 1;

  const goTo = (n: number) => {
    if (n > 0 && step === 0 && !name.trim()) {
      setNameError(true);
      document.getElementById(`${id}-name`)?.focus();
      return;
    }
    setNameError(false);
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

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onSubmit={(e) => {
        e.preventDefault();
        // Enter in a field moves on to the next step; only the last step sends.
        if (step < last) return goTo(step + 1);
        if (!name.trim()) {
          setNameError(true);
          setDir(-1);
          moved.current = true;
          return setStep(0);
        }
        track("Brief sent", { services: needs.length, timeline: timeline || "not set", budget: budget || "not set" });
        setSent(true);
        window.location.assign(mailto);
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
                      aria-required="true"
                      aria-invalid={nameError || undefined}
                      aria-describedby={nameError ? `${id}-name-error` : undefined}
                      className={`${field} ${nameError ? "border-brand" : ""}`}
                      placeholder="Alex"
                    />
                    {nameError && (
                      <p id={`${id}-name-error`} role="alert" className="mt-2 text-sm text-accent">
                        Add your name so we know who to reply to.
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor={`${id}-brand`} className={label}>
                      Brand or company
                    </label>
                    <input id={`${id}-brand`} value={brand} onChange={(e) => setBrand(e.target.value)} autoComplete="organization" className={field} placeholder="Your brand" />
                  </div>
                </div>
                <div>
                  <label htmlFor={`${id}-link`} className={label}>
                    Where can we see your brand? <span className="normal-case tracking-normal text-paper/50">(optional)</span>
                  </label>
                  <input
                    id={`${id}-link`}
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    autoComplete="url"
                    inputMode="url"
                    autoCapitalize="none"
                    className={field}
                    placeholder="@yourbrand or yourbrand.com"
                  />
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
                        className={`rounded-full border px-4 py-2.5 text-sm transition-colors pointer-coarse:min-h-11 ${
                          on ? "border-brand bg-brand text-on-brand" : "border-line text-paper/75 hover:border-paper/50 hover:text-paper"
                        }`}
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
                  className={`${field} resize-y`}
                  placeholder="Where you are now, where you want to be, and anything we should know."
                />
                {/* a quick read-back of the earlier steps before sending */}
                <dl className="mt-6 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[auto_1fr]">
                  {[
                    ["From", [name, brand].filter(Boolean).join(", ") || "Not set"],
                    ["Needs", needs.join(", ") || "Not set"],
                    ["Timeline", timeline || "Not set"],
                    ["Budget", budget || "Not set"],
                  ].map(([k, v]) => (
                    <div key={k} className="contents">
                      <dt className="text-muted">{k}</dt>
                      <dd className={v === "Not set" ? "text-paper/50" : "text-paper/85"}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

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
              setSent(false);
              setNameError(false);
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
            className="inline-flex items-center justify-center gap-3 rounded-full bg-paper px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-brand hover:text-on-brand"
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
              className="rounded-full border border-line px-6 py-3.5 text-sm text-paper/80 transition-colors hover:border-paper hover:text-paper"
            >
              {copied ? "Copied" : "Copy the brief"}
            </button>
            <button type="submit" onClick={spark} className="inline-flex items-center gap-3 rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-on-brand transition-colors hover:bg-paper hover:text-ink">
              Send by email
              <ArrowRight aria-hidden className="size-4" />
            </button>
          </div>
        )}
      </div>
      {step === last && (
        <p className="mt-6 text-xs text-muted" aria-live="polite">
          {sent
            ? `Your mail app should have opened with the brief filled in. If it didn't, copy the brief and send it to ${site.email}. We reply within ${site.replyTime}.`
            : `Opens in your mail app, or copy the text and send it from anywhere. We reply within ${site.replyTime}.`}
        </p>
      )}
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
        className="group relative inline-flex h-16 items-center gap-6 overflow-hidden rounded-full bg-brand pl-8 pr-2 text-lg font-medium text-on-brand sm:h-[4.5rem] sm:pl-9 sm:text-xl"
      >
        <span className="absolute inset-0 translate-y-full rounded-full bg-paper transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-y-0 group-focus-visible:translate-y-0" />
        <span className="relative">{open ? "Close the brief" : "Start a project"}</span>
        <span className="relative grid size-12 place-items-center rounded-full bg-ink text-paper sm:size-14">
          {open ? (
            <X aria-hidden className="size-5" />
          ) : (
            <ArrowRight aria-hidden className="size-5 transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-0.5" />
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
    <section ref={ref} id="contact" className="night relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pb-40 pt-32 sm:px-10">
      {/* rising planet */}
      <motion.div aria-hidden style={{ y: rise }} className="pointer-events-none absolute left-1/2 top-[62%] w-[170vw] -translate-x-1/2 md:top-[84%] md:w-[130vw]">
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
        <h2 className="mt-8 font-display text-[clamp(3.6rem,12vw,12rem)] font-bold leading-[0.85] tracking-[-0.05em]">
          <LineReveal
            inView
            lines={["Let's build", <span key="b">your <span className="serif font-normal text-accent">brand.</span></span>]}
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
              {copied ? "Copied" : "Copy email"}
            </button>
          </div>
        </div>

        <div id="project-brief">
          <AnimatePresence>{brief && <Brief key={briefVersion} onDone={() => setBrief(false)} />}</AnimatePresence>
        </div>
      </div>
    </section>
  );
}
