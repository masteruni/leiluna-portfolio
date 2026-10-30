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

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onSubmit={(e) => {
        e.preventDefault();
        track("Brief sent", { services: needs.length, timeline: timeline || "not set", budget: budget || "not set" });
        setSent(true);
        window.location.href = mailto;
      }}
      className="mx-auto mt-14 w-full max-w-3xl rounded-[2rem] border border-line bg-ink-2/70 p-6 text-left backdrop-blur-xl sm:p-10"
      aria-label="Project brief"
    >
      <div className="grid gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className={label}>
            Your name
          </label>
          <input id={`${id}-name`} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required className={field} placeholder="Alex" />
        </div>
        <div>
          <label htmlFor={`${id}-brand`} className={label}>
            Brand or company
          </label>
          <input id={`${id}-brand`} value={brand} onChange={(e) => setBrand(e.target.value)} autoComplete="organization" className={field} placeholder="Your brand" />
        </div>
      </div>

      <div className="mt-8">
        <label htmlFor={`${id}-link`} className={label}>
          Where can we see your brand? <span className="normal-case tracking-normal text-paper/30">(optional)</span>
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

      <fieldset className="mt-8">
        <legend className={label}>What do you need?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
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
                className={`rounded-full border px-3.5 py-2 text-xs transition-colors pointer-coarse:min-h-11 ${
                  on ? "border-brand bg-brand text-on-brand" : "border-line text-paper/70 hover:border-paper/50 hover:text-paper"
                }`}
              >
                {s.short}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        <Choice legend="Timeline" options={briefOptions.timelines} value={timeline} onChange={setTimeline} />
        <Choice legend="Budget" options={briefOptions.budgets} value={budget} onChange={setBudget} />
      </div>

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
      </div>

      <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-3">
          <button type="submit" onClick={spark} className="rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-on-brand transition-colors hover:bg-paper hover:text-ink">
            Send by email →
          </button>
          <button
            type="button"
            onClick={(e) => {
              spark(e);
              copy();
            }}
            className="rounded-full border border-line px-6 py-3.5 text-sm text-paper/80 transition-colors hover:border-paper hover:text-paper">
            {copied ? "Copied ✦" : "Copy the brief"}
          </button>
        </div>
        <div className="flex gap-6 font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
          <button
            type="button"
            onClick={() => {
              setDraft(empty);
              setSent(false);
            }}
            className="hover:text-paper pointer-coarse:min-h-11"
          >
            Clear
          </button>
          <button type="button" onClick={onDone} className="hover:text-paper pointer-coarse:min-h-11">
            Close
          </button>
        </div>
      </div>
      <p className="mt-6 text-xs text-muted" aria-live="polite">
        {sent
          ? `Your mail app should have opened with the brief filled in. If it didn't, copy the brief and send it to ${site.email}. We reply within ${site.replyTime}.`
          : `Opens in your mail app, or copy the text and send it from anywhere. We reply within ${site.replyTime}.`}
      </p>
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
