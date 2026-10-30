"use client";

import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { brief as briefOptions, services, site } from "@/content/site";
import { clearBriefPrefill, peekBriefPrefill, setBriefOpen, useBriefOpen, useBriefVersion } from "@/lib/brief";
import { LineReveal } from "./LineReveal";
import { Magnetic } from "./Magnetic";

const label = " text-sm text-muted";
const field =
  "w-full border-b border-line bg-transparent py-3 text-paper outline-none transition-colors placeholder:text-paper/30 focus:border-brand";

// Single-choice chips; tapping the selected one again clears it.
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
            onClick={() => onChange(value === o ? "" : o)}
            className={`rounded-full px-3.5 py-2 text-[13px] transition-colors ${
              value === o ? "bg-paper text-ink" : "bg-paper/[0.07] text-paper/70 hover:bg-paper/15 hover:text-paper"
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
        setSent(true);
        window.location.href = mailto;
      }}
      className="mx-auto mt-14 w-full max-w-3xl rounded-[2rem] bg-ink-2/70 p-6 text-left backdrop-blur-xl sm:p-10"
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
                onClick={() => toggle(s.title)}
                className={`rounded-full px-3.5 py-2 text-[13px] transition-colors ${
                  on ? "bg-brand text-ink" : "bg-paper/[0.07] text-paper/70 hover:bg-paper/15 hover:text-paper"
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
          <button type="submit" className="rounded-full bg-brand px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-paper">
            Send by email →
          </button>
          <button type="button" onClick={copy} className="rounded-full px-6 py-3.5 text-sm text-paper/80 transition-colors hover:text-paper bg-paper/[0.07] hover:bg-paper/15">
            {copied ? "Copied" : "Copy the brief"}
          </button>
        </div>
        <div className="flex gap-6 text-sm text-muted">
          <button
            type="button"
            onClick={() => {
              setDraft(empty);
              setSent(false);
            }}
            className="hover:text-paper"
          >
            Clear
          </button>
          <button type="button" onClick={onDone} className="hover:text-paper">
            Close
          </button>
        </div>
      </div>
      <p className="mt-6 text-[13px] text-muted" aria-live="polite">
        {sent
          ? `Your mail app should have opened with the brief filled in. If it didn't, copy the brief and send it to ${site.email}. We reply within ${site.replyTime}.`
          : `Opens in your mail app, or copy the text and send it from anywhere. We reply within ${site.replyTime}.`}
      </p>
    </motion.form>
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
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <section ref={ref} id="contact" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pb-40 pt-32 sm:px-10">
      {/* rising planet */}
      <motion.div aria-hidden style={{ y: rise }} className="pointer-events-none absolute left-1/2 top-[62%] w-[170vw] -translate-x-1/2 md:w-[130vw]">
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
        <h2 className="font-display text-[clamp(3.6rem,12vw,12rem)] font-bold leading-[0.85] tracking-[-0.05em]">
          <LineReveal
            inView
            lines={["Let's build", <span key="b">your <span className="serif font-normal text-brand">brand.</span></span>]}
          />
        </h2>
        <p className="mx-auto mt-8 max-w-md text-lg text-paper/60">
          Tell us about your story. We&apos;ll reply within {site.replyTime} with ideas, not a sales script.
        </p>

        <div className="mt-14 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Magnetic strength={0.5}>
            <button
              type="button"
              onClick={() => setBrief((b) => !b)}
              aria-expanded={brief}
              aria-controls="project-brief"
              className="group relative grid size-44 place-items-center overflow-hidden rounded-full bg-brand text-center font-medium text-ink sm:size-52"
            >
              <span className="absolute inset-0 scale-0 rounded-full bg-paper transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-100" />
              <span className="relative text-lg leading-tight">
                {brief ? (
                  <>
                    Close
                    <br />
                    the brief ✕
                  </>
                ) : (
                  <>
                    Start a
                    <br />
                    project →
                  </>
                )}
              </span>
            </button>
          </Magnetic>
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <a href={`mailto:${site.email}`} className="font-display text-2xl font-medium transition-colors hover:text-brand sm:text-3xl">
              {site.email}
            </a>
            <button type="button" onClick={copy} className="text-sm text-muted hover:text-paper">
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
