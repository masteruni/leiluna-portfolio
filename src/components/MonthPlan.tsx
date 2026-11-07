"use client";

import { useLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { pieces } from "@/content/library";
import { kindLabel, kindShort, monthPlan, taskState, tasksFor, today, type DayKind, type TaskState } from "@/content/month";
import { Eyebrow, MoonPhase } from "./Eyebrow";
import { CallLink } from "./CallLink";
import { site } from "@/content/site";
import { LineReveal } from "./LineReveal";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Day = { n: number; kind: DayKind | "story"; piece?: (typeof pieces)[number] };

const days: Day[] = Array.from({ length: monthPlan.length }, (_, i) => {
  const n = i + 1;
  const d = monthPlan.days[n];
  return { n, kind: d?.kind ?? "story", piece: d?.piece ? pieces.find((p) => p.id === d.piece) : undefined };
});

// What a client actually gets in a month, as a calendar: each day shows what goes out, with the moon waxing across the
// month (the studio's mark) and a bar for how far that day's post has got. Picking a day shows its production
// checklist, from ideation to publishing, against a sample "today". Below it, what the month adds up to.
export function MonthPlan() {
  const [sel, setSel] = useState(14);
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const day = days[sel - 1];
  const detail = useRef<HTMLDivElement>(null);
  // On a phone the checklist sits below the calendar, so a tap brings it into view.
  const pick = (n: number) => {
    setSel(n);
    if (window.matchMedia("(min-width: 1024px)").matches) return;
    requestAnimationFrame(() => {
      const el = detail.current;
      if (!el) return;
      // Touch screens scroll natively (the smooth-scroll library only drives mouse and trackpad scrolling).
      if (lenis && !window.matchMedia("(pointer: coarse)").matches) lenis.scrollTo(el, { offset: -100, duration: 0.8 });
      else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  };

  return (
    <section id="month" className="relative px-5 py-16 sm:px-10 md:py-24" aria-labelledby="month-title">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Eyebrow id="month" />
            <h2 id="month-title" className="mt-6 font-display text-[clamp(3rem,7vw,7rem)] font-bold leading-[0.88] tracking-[-0.045em]">
              <LineReveal inView lines={["A month with us,", "day by day."]} />
            </h2>
          </div>
          <p className="max-w-sm text-lg text-paper/60">
            What goes out, and when, on a sample content plan. Pick any day to see what&apos;s being made for it and where each step stands.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
          {/* the calendar */}
          <div>
            <p className="mb-3 flex flex-wrap justify-between gap-x-6 gap-y-1 text-sm text-muted">
              <span>{monthPlan.name}</span>
              <span>Today is day {today}</span>
            </p>
            <div className="grid grid-cols-7 border-l border-t border-line" role="group" aria-label="A sample month, day by day">
              {WEEKDAYS.map((d) => (
                <div key={d} aria-hidden className="border-b border-r border-line px-2 py-2 text-xs text-muted sm:px-3">
                  <span className="sm:hidden">{d[0]}</span>
                  <span className="max-sm:hidden">{d}</span>
                </div>
              ))}
              {days.map((d) => {
                const on = d.n === sel;
                const isToday = d.n === today;
                const tasks = tasksFor(d.kind, d.n);
                const done = tasks.filter((t) => taskState(d.n - t.before) === "done").length;
                const content = d.kind === "reel" || d.kind === "carousel";
                return (
                  <button
                    key={d.n}
                    type="button"
                    aria-pressed={on}
                    aria-label={`Day ${d.n}${isToday ? " (today)" : ""}: ${kindLabel[d.kind]}${d.piece ? `, ${d.piece.style}` : ""}, ${status(tasks.length, done, d.n).toLowerCase()}`}
                    onClick={() => pick(d.n)}
                    className={`group relative flex aspect-square flex-col justify-between border-b border-r border-line p-1.5 text-left transition-colors duration-200 sm:p-2.5 ${
                      on ? "bg-brand/10" : "hover:bg-paper/5"
                    }`}
                  >
                    {on && <span aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-brand" />}
                    <span className="flex items-start justify-between">
                      <span
                        className={`grid min-w-5 place-items-center rounded-full text-xs tabular-nums sm:min-w-6 sm:text-sm ${
                          isToday ? "bg-brand px-1 font-medium text-on-brand" : on ? "text-paper" : "text-paper/60"
                        }`}
                      >
                        {d.n}
                      </span>
                      <MoonPhase lit={d.n / monthPlan.length} className="size-2.5 sm:size-3.5" />
                    </span>
                    {content && (
                      <span aria-hidden className="block h-0.5 overflow-hidden rounded-full bg-paper/10 sm:h-1">
                        <span className="block h-full rounded-full bg-brand" style={{ width: `${(done / tasks.length) * 100}%` }} />
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <span
                        aria-hidden
                        className={`size-1.5 shrink-0 rounded-full ${
                          d.kind === "reel" ? "bg-brand" : d.kind === "carousel" ? "bg-paper" : d.kind === "story" ? "border border-paper/40" : "bg-brand-2"
                        }`}
                      />
                      <span className="hidden truncate text-[11px] text-paper/70 md:inline">{kindShort[d.kind]}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              <span className="flex items-center gap-2"><span aria-hidden className="size-1.5 rounded-full bg-brand" /> Reel</span>
              <span className="flex items-center gap-2"><span aria-hidden className="size-1.5 rounded-full bg-paper" /> Carousel or post</span>
              <span className="flex items-center gap-2"><span aria-hidden className="size-1.5 rounded-full border border-paper/40" /> Stories and replies</span>
              <span className="flex items-center gap-2"><span aria-hidden className="size-1.5 rounded-full bg-brand-2" /> Strategy call and report</span>
              <span className="flex items-center gap-2"><span aria-hidden className="h-1 w-4 rounded-full bg-brand" /> Production progress</span>
            </p>
          </div>

          {/* the selected day */}
          <div ref={detail} className="lg:sticky lg:top-28 lg:self-start" aria-live="polite">
            <p className="text-sm text-accent">
              Day {day.n}, {kindLabel[day.kind]}
            </p>
            <DayDetail key={day.n} day={day} />
          </div>
        </div>

        {/* what the month adds up to */}
        <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {monthPlan.totals.map((t) => (
            <div key={t.label} className="flex flex-col-reverse justify-end border-t border-line pt-5">
              <dt className="mt-2 text-sm text-paper/70">{t.label}</dt>
              <dd className="font-display text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{t.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-14 flex flex-col gap-2 border-t border-line pt-8 text-lg text-paper/80 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-3">
          <span>
            Plans start at {site.plansFrom}. Want to know what yours would look like?
          </span>
          <CallLink from="month">Book a free call</CallLink>
        </p>
      </div>
    </section>
  );
}

const status = (total: number, done: number, n: number) =>
  done === total ? (n < today ? "Published" : "Done") : done > 0 || n === today ? "In production" : "Planned";

const blurb: Record<DayKind | "story", string> = {
  reel: "Every reel goes through the same steps, each with its own deadline, so nothing is rushed on the day it goes out.",
  carousel: "Carousels and graphic posts follow the same steps, with design in place of the edit.",
  plan: "We review last month together, agree on this month's content pillars and hooks, and lock the posting calendar.",
  report: "Views, reach, saves and follower growth from your own insights, what worked, and what we'll do more of next month.",
  story: "Daily stories, replies to comments and messages, and scheduling, so the page stays active between the big posts.",
};

const dueLabel = (due: number) => (due < 1 ? "Last month" : due === today ? "Today" : `Day ${due}`);

function StateIcon({ state }: { state: TaskState }) {
  if (state === "done")
    return (
      <span aria-hidden className="grid size-5 shrink-0 place-items-center rounded-full bg-brand text-on-brand">
        <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2.5 6.2 5 8.5l4.5-5" />
        </svg>
      </span>
    );
  if (state === "now")
    return (
      <span aria-hidden className="relative grid size-5 shrink-0 place-items-center rounded-full border-2 border-brand">
        <span className="size-2 rounded-full bg-brand motion-safe:animate-pulse" />
      </span>
    );
  return <span aria-hidden className="size-5 shrink-0 rounded-full border border-paper/30" />;
}

const stateText: Record<TaskState, string> = { done: "done", now: "in progress", next: "to do" };

function DayDetail({ day }: { day: Day }) {
  const tasks = tasksFor(day.kind, day.n).map((t) => {
    const due = day.n - t.before;
    return { ...t, due, state: taskState(due) };
  });
  const done = tasks.filter((t) => t.state === "done").length;
  const title =
    day.kind === "reel" || day.kind === "carousel"
      ? (day.piece?.style ?? kindLabel[day.kind])
      : { plan: "Strategy call and calendar", report: "Monthly report", story: "Stories and community" }[day.kind];
  const label = status(tasks.length, done, day.n);
  return (
    <div className="mt-4 transition-opacity duration-300 ease-[var(--ease-out)] starting:opacity-0">
      <div className="rounded-2xl border border-line bg-ink-2 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-display text-2xl font-semibold leading-tight tracking-[-0.02em]">{title}</h3>
          <span
            className={`mt-1 shrink-0 rounded-full px-2.5 py-1 text-xs ${
              label === "In production" ? "bg-brand/15 text-accent" : label === "Planned" ? "bg-paper/10 text-paper/70" : "bg-paper text-ink"
            }`}
          >
            {label}
          </span>
        </div>
        <p className="mt-2 text-sm text-paper/60">
          {done} of {tasks.length} steps done
        </p>
        <div aria-hidden className="mt-3 h-1.5 overflow-hidden rounded-full bg-paper/10">
          <div className="h-full rounded-full bg-brand transition-[width] duration-500 ease-[var(--ease-out)]" style={{ width: `${(done / tasks.length) * 100}%` }} />
        </div>
        <ol className="mt-5 border-t border-line" aria-label={`Checklist for day ${day.n}`}>
          {tasks.map((t) => (
            <li key={t.label} className="flex items-center gap-3 border-b border-line py-3 last:border-b-0">
              <StateIcon state={t.state} />
              <span className={`min-w-0 flex-1 ${t.state === "done" ? "text-paper/55" : "text-paper"}`}>
                {t.label}
                <span className="sr-only">, {stateText[t.state]}</span>
              </span>
              <span className={`shrink-0 text-sm tabular-nums ${t.state === "now" ? "text-accent" : "text-paper/50"}`}>{dueLabel(t.due)}</span>
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-paper/60">{blurb[day.kind]}</p>
    </div>
  );
}
