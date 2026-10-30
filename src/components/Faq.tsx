"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useId, useState } from "react";
import { faqs } from "@/content/site";
import { Eyebrow } from "./Eyebrow";
import { LineReveal } from "./LineReveal";

// Questions slide in one after another as the list scrolls into view; a pink bar glides to the open one.
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const id = useId();
  return (
    <section id="faq" className="px-5 py-32 sm:px-10 md:py-44" aria-labelledby={`${id}-title`}>
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Eyebrow id="faq" />
          <h2 id={`${id}-title`} className="mt-6 font-display text-[clamp(3rem,6vw,6rem)] font-bold leading-[0.88] tracking-[-0.045em]">
            <LineReveal inView lines={["Before you", <span key="a" className="serif font-normal text-accent">ask.</span>]} />
          </h2>
          <p className="mt-6 max-w-sm text-lg text-paper/60">Still wondering about something? Ask it in your brief and we&apos;ll answer within one business day.</p>
        </div>

        <ul className="border-t border-line">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.li
                key={f.q}
                className="relative border-b border-line"
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={reduce ? { duration: 0 } : { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.06 }}
              >
                {isOpen && (
                  <motion.span
                    layoutId="faq-accent"
                    aria-hidden
                    className="absolute -left-3 top-7 h-10 w-1 rounded-full bg-brand sm:-left-5"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <h3>
                  <button
                    type="button"
                    id={`${id}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-a${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center gap-6 py-7 text-left"
                  >
                    <span className={`font-mono text-xs transition-colors ${isOpen ? "text-accent" : "text-muted"}`}>0{i + 1}</span>
                    <span className={`flex-1 font-display text-xl font-medium tracking-[-0.02em] transition-colors sm:text-2xl ${isOpen ? "text-paper" : "text-paper/80 group-hover:text-paper"}`}>
                      {f.q}
                    </span>
                    <span
                      aria-hidden
                      className={`grid size-10 shrink-0 place-items-center rounded-full border transition duration-500 ${
                        isOpen ? "rotate-45 border-brand bg-brand text-on-brand" : "border-line text-paper/70 group-hover:border-paper/50"
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
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
