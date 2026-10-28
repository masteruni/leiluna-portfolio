"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { testimonials } from "@/content/site";

export function Voices() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const t = testimonials[i];

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
      aria-roledescription="carousel"
      aria-label="Client testimonials"
    >
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          <span className="text-brand">(08)</span> Kind words
        </p>

        <div className="relative mt-14 min-h-[22rem] md:min-h-[26rem]">
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
                {t.quote.split(" ").map((w, k) => (
                  <motion.span
                    key={k}
                    className="inline-block pr-[0.22em]"
                    initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.7, delay: k * 0.025, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {w}
                  </motion.span>
                ))}
              </blockquote>
              <figcaption className="mt-10 flex items-center gap-4">
                <span className="h-px w-10 bg-brand" />
                <span className="font-medium">{t.name}</span>
                <span className="text-sm text-muted">{t.title}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex items-center gap-3" role="tablist" aria-label="Choose testimonial">
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
      </div>
    </section>
  );
}
