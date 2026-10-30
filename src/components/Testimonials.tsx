"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { testimonials } from "@/content/site";
import { LineReveal } from "./LineReveal";

// Client quotes, one at a time, in the same cinematic serif as the case studies.
// Renders nothing until `testimonials` in src/content/site.ts has at least one entry.
export function Testimonials() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const total = testimonials.length;

  // Rotate every eight seconds unless the reader hovers, focuses or prefers less motion.
  useEffect(() => {
    if (total < 2 || paused || reduce) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % total), 8000);
    return () => window.clearInterval(t);
  }, [total, paused, reduce]);

  if (!total) return null;
  const t = testimonials[i];

  return (
    <section
      id="testimonials"
      className="px-5 py-32 sm:px-10 md:py-44"
      aria-labelledby="testimonials-title"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="mx-auto max-w-7xl">
        <h2 id="testimonials-title" className="font-display text-[clamp(2.8rem,6vw,6rem)] font-bold leading-[0.9] tracking-[-0.045em]">
          <LineReveal inView lines={["What clients", "say."]} />
        </h2>

        <div className="relative mt-16 min-h-[14rem] md:min-h-[12rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.figure
              key={i}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl"
            >
              <blockquote className="serif text-[clamp(1.8rem,4vw,3.6rem)] leading-[1.15] text-paper">
                <span aria-hidden className="text-brand">“</span>
                {t.quote}
                <span aria-hidden className="text-brand">”</span>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4 text-sm">
                <span>
                  <span className="font-medium text-paper">{t.name}</span>
                  <span className="text-muted"> · {t.role}</span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        {total > 1 && (
          <div className="mt-10 flex items-center gap-3" role="group" aria-label="Choose a quote">
            {testimonials.map((q, n) => (
              <button
                key={q.name + n}
                type="button"
                onClick={() => setI(n)}
                aria-label={`Quote ${n + 1} of ${total}, ${q.name}`}
                aria-current={n === i}
                className={`h-1.5 rounded-full transition-all duration-500 ${n === i ? "w-10 bg-brand" : "w-4 bg-paper/25 hover:bg-paper/60"}`}
              />
            ))}
            <span className="ml-3 text-sm text-muted tabular-nums">
              {i + 1} of {total}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
