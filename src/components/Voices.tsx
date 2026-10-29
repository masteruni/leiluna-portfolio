"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { testimonials } from "@/content/site";

export function Voices() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const t = testimonials[i];
  const step = (d: number) => setI((n) => (n + d + testimonials.length) % testimonials.length);

  useEffect(() => {
    if (paused || reduce) return;
    const id = setTimeout(() => setI((n) => (n + 1) % testimonials.length), 7000);
    return () => clearTimeout(id);
  }, [i, paused, reduce]);

  return (
    <section
      className="relative px-5 py-32 sm:px-10 md:py-44"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Client testimonials"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          <span className="text-brand">(08)</span> Kind words
        </p>

        <motion.div
          className="relative mt-14 min-h-[22rem] touch-pan-y md:min-h-[26rem]"
          // swipe left/right on touch screens
          onPanEnd={(_, info) => Math.abs(info.offset.x) > 40 && step(info.offset.x < 0 ? 1 : -1)}
        >
          <span aria-hidden className="serif absolute -left-2 -top-16 text-[12rem] leading-none text-brand/30 md:-left-14">
            &ldquo;
          </span>
          <AnimatePresence mode="wait">
            <motion.figure
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
            >
              <blockquote className="serif text-[clamp(2rem,4.6vw,4.4rem)] leading-[1.05] tracking-[-0.01em]">
                {t.quote.split(" ").map((w, k, all) => (
                  <span key={k}>
                    <motion.span
                      className="inline-block"
                      initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ duration: 0.7, delay: k * 0.025, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {w}
                    </motion.span>
                    {k < all.length - 1 && " "}
                  </span>
                ))}
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-4">
                {/* initial in a small moon, lit from the upper left like the logo */}
                <span
                  aria-hidden
                  className="grid size-12 shrink-0 place-items-center rounded-full bg-ink-2 font-display text-lg font-semibold text-paper"
                  style={{ boxShadow: "inset 0.45rem -0.3rem 0 0 var(--brand), 0 0 24px -6px var(--brand)" }}
                >
                  {t.name.charAt(0)}
                </span>
                <span className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3">
                  <span className="font-medium">{t.name}</span>
                  <span className="text-sm text-muted">{t.title}</span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </motion.div>

        <div className="mt-12 flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-3" role="tablist" aria-label="Choose testimonial">
            {testimonials.map((_, k) => (
            <button
              key={k}
              type="button"
              role="tab"
              aria-selected={k === i}
              aria-label={`Testimonial ${k + 1}`}
              onClick={() => setI(k)}
              className="group relative size-8"
            >
              <span
                className={`absolute inset-1.5 rounded-full border transition-colors duration-500 ${k === i ? "border-paper bg-paper" : "border-paper/40 group-hover:border-paper"}`}
              />
              <span
                className={`absolute inset-1.5 rounded-full bg-ink transition-transform duration-700 ${k === i ? "translate-x-3" : "translate-x-0"}`}
              />
            </button>
            ))}
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
            <button type="button" onClick={() => step(-1)} aria-label="Previous testimonial" className="rounded-full border border-line px-3 py-2 transition-colors hover:border-brand hover:text-paper">
              ←
            </button>
            <span className="tabular-nums">
              {String(i + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
            </span>
            <button type="button" onClick={() => step(1)} aria-label="Next testimonial" className="rounded-full border border-line px-3 py-2 transition-colors hover:border-brand hover:text-paper">
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
