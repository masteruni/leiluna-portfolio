"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { faqs } from "@/content/site";
import { LineReveal } from "./LineReveal";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();
  return (
    <section className="px-5 py-32 sm:px-10 md:py-44" aria-labelledby={`${id}-title`}>
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
            <span className="text-brand">(08)</span> Good questions
          </p>
          <h2 id={`${id}-title`} className="mt-6 font-display text-[clamp(3rem,6vw,6rem)] font-bold leading-[0.88] tracking-[-0.045em]">
            <LineReveal inView lines={["Before you", <span key="a" className="serif font-normal text-brand">ask.</span>]} />
          </h2>
          <p className="mt-6 max-w-sm text-lg text-paper/60">Still wondering about something? Ask it in your brief and we&apos;ll answer within one business day.</p>
        </div>

        <ul className="border-t border-line">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q} className="border-b border-line">
                <h3>
                  <button
                    type="button"
                    id={`${id}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-a${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center gap-6 py-7 text-left"
                  >
                    <span className="font-mono text-xs text-brand">0{i + 1}</span>
                    <span className={`flex-1 font-display text-xl font-medium tracking-[-0.02em] transition-colors sm:text-2xl ${isOpen ? "text-paper" : "text-paper/80 group-hover:text-paper"}`}>
                      {f.q}
                    </span>
                    <span
                      aria-hidden
                      className={`grid size-10 shrink-0 place-items-center rounded-full border transition duration-500 ${
                        isOpen ? "rotate-45 border-brand bg-brand text-ink" : "border-line text-paper/70 group-hover:border-paper/50"
                      }`}
                    >
                      +
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`${id}-a${i}`}
                      role="region"
                      aria-labelledby={`${id}-q${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-8 pl-10 leading-relaxed text-paper/70 sm:text-lg">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
