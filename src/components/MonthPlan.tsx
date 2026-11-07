"use client";

import Image from "next/image";
import { useLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { pieces } from "@/content/library";
import { kindLabel, kindShort, monthPlan, type DayKind } from "@/content/month";
import { openBriefWith } from "@/lib/brief";
import { track } from "@/lib/track";
import { Eyebrow, MoonPhase } from "./Eyebrow";
import { LineReveal } from "./LineReveal";
import { Button } from "./ui";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Day = { n: number; kind: DayKind | "story"; piece?: (typeof pieces)[number] };

const days: Day[] = Array.from({ length: monthPlan.length }, (_, i) => {
  const n = i + 1;
  const d = monthPlan.days[n];
  return { n, kind: d?.kind ?? "story", piece: d?.piece ? pieces.find((p) => p.id === d.piece) : undefined };
});

// What a client actually gets in a month, as a calendar: each day shows what goes out, with the moon waxing across the
// month (the studio's mark), and tapping a day shows a real example of that kind of post from the Library. Below it,
// what the month adds up to, and a low-commitment next step for visitors who aren't ready to start a project.
export function MonthPlan() {
  const [sel, setSel] = useState(7);
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const day = days[sel - 1];
  const detail = useRef<HTMLDivElement>(null);
  // On a phone the example sits below the calendar, so a tap brings it into view.
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

  const audit = () => {
    track("Free audit", { from: "month" });
    openBriefWith({ message: "I'd like a free feed audit. Our Instagram is @" });
    requestAnimationFrame(() => {
      const t = document.querySelector<HTMLElement>("#project-brief") ?? document.querySelector<HTMLElement>("#contact");
      if (!t) return;
      if (lenis) lenis.scrollTo(t, { offset: -140, duration: 1.2, force: true });
      else t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
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
            What goes out, and when, on a sample content plan. Tap any day to see a real example of that post.
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
          {/* the calendar */}
          <div>
            <p className="mb-3 text-sm text-muted">{monthPlan.name}</p>
            <div className="grid grid-cols-7 border-l border-t border-line" role="group" aria-label="A sample month, day by day">
              {WEEKDAYS.map((d) => (
                <div key={d} aria-hidden className="border-b border-r border-line px-2 py-2 text-xs text-muted sm:px-3">
                  <span className="sm:hidden">{d[0]}</span>
                  <span className="max-sm:hidden">{d}</span>
                </div>
              ))}
              {days.map((d) => {
                const on = d.n === sel;
                const media = d.piece?.poster ?? d.piece?.src;
                return (
                  <button
                    key={d.n}
                    type="button"
                    aria-pressed={on}
                    aria-label={`Day ${d.n}: ${kindLabel[d.kind]}${d.piece ? `, ${d.piece.style}` : ""}`}
                    onClick={() => pick(d.n)}
                    className={`group relative flex aspect-square flex-col justify-between border-b border-r border-line p-1.5 text-left transition-colors duration-200 sm:aspect-[4/5] sm:p-2.5 ${
                      on ? "bg-brand/10" : "hover:bg-paper/5"
                    }`}
                  >
                    {on && <span aria-hidden className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-brand" />}
                    <span className="flex items-start justify-between">
                      <span className={`text-xs tabular-nums sm:text-sm ${on ? "text-paper" : "text-paper/60"}`}>{d.n}</span>
                      <MoonPhase lit={d.n / monthPlan.length} className="size-2.5 sm:size-3.5" />
                    </span>
                    {media && (d.kind === "reel" || d.kind === "carousel") ? (
                      <span className="relative mx-auto hidden aspect-[9/16] w-[46%] overflow-hidden rounded-[4px] sm:block">
                        <Image src={media} alt="" fill sizes="80px" className="object-cover" />
                      </span>
                    ) : null}
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
            </p>
          </div>

          {/* the selected day */}
          <div ref={detail} className="lg:sticky lg:top-28 lg:self-start" aria-live="polite">
            <p className="text-sm text-accent">
              Day {day.n}, {kindLabel[day.kind]}
            </p>
            <DayDetail day={day} reduce={!!reduce} />
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

        <div className="mt-10 flex flex-col items-start justify-between gap-6 border-t border-line pt-8 sm:flex-row sm:items-center">
          <p className="max-w-xl text-lg text-paper/80">
            Not sure what your brand needs yet? Send us your Instagram and we&apos;ll reply with three quick fixes for your feed, free.
          </p>
          <Button variant="primary" size="lg" onClick={audit}>
            Get a free feed audit
          </Button>
        </div>
      </div>
    </section>
  );
}

function DayDetail({ day, reduce }: { day: Day; reduce: boolean }) {
  if (day.kind === "plan" || day.kind === "report" || day.kind === "story") {
    const copy = {
      plan: {
        title: "Strategy call and calendar",
        text: "We review last month together, agree on this month's content pillars and hooks, and lock the posting calendar.",
      },
      report: {
        title: "Monthly report",
        text: "Views, reach, saves and follower growth from your own insights, what worked, and what we'll do more of next month.",
      },
      story: {
        title: "Stories and community",
        text: "Daily stories, replies to comments and messages, and scheduling, so the page stays active between the big posts.",
      },
    }[day.kind];
    return (
      <div className="mt-4">
        <div className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-2xl border border-line bg-ink-2">
          {day.kind === "report" ? (
            <Image src="/work/business-resilience-mindset/top-reels.webp" alt="A real monthly results screenshot from a client's Instagram insights" fill sizes="22rem" className="object-cover object-top" />
          ) : (
            <MoonPhase lit={day.n / monthPlan.length} className="size-28" />
          )}
        </div>
        <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.02em]">{copy.title}</h3>
        <p className="mt-2 leading-relaxed text-paper/70">{copy.text}</p>
      </div>
    );
  }
  const p = day.piece;
  if (!p) return null;
  const video = p.kind === "video";
  return (
    <div className="mt-4">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-line bg-ink-2">
        {video ? (
          <video
            key={p.id}
            src={p.preview ?? p.src}
            poster={p.poster}
            muted
            loop
            playsInline
            autoPlay={!reduce}
            preload="metadata"
            className="absolute inset-0 size-full object-cover"
          />
        ) : (
          <Image key={p.id} src={p.src ?? ""} alt={p.title} fill sizes="22rem" className="object-cover object-top" />
        )}
      </div>
      <h3 className="mt-5 font-display text-2xl font-semibold tracking-[-0.02em]">{p.style}</h3>
      <p className="mt-2 leading-relaxed text-paper/70">
        {p.title}. A real example from our Library of the kind of {day.kind === "reel" ? "reel" : "post"} that goes out on a day like this.
      </p>
    </div>
  );
}
