"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { faqs, site } from "@/content/site";
import { CallLink } from "./CallLink";
import { SectionHead } from "./SectionHead";

// One question open at a time. Nothing moves until a question is picked.
export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const id = useId();
  return (
    <section id="faq" className="px-5 py-16 sm:px-10 md:py-24" aria-labelledby={`${id}-title`}>
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHead id={`${id}-title`} title="Before you ask.">
            Still wondering about something? Ask it in your brief and we&apos;ll answer within {site.replyTime}.
          </SectionHead>
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
                    className="group flex w-full items-center gap-6 py-6 text-left"
                  >
                    <span className={`flex-1 font-display text-xl font-medium tracking-[-0.02em] transition-colors sm:text-2xl ${isOpen ? "text-paper" : "text-paper/80 group-hover:text-paper"}`}>
                      {f.q}
                    </span>
                    <Plus
                      aria-hidden
                      strokeWidth={1.5}
                      className={`size-6 shrink-0 transition-[rotate,color] duration-300 ease-[var(--ease-out)] ${isOpen ? "rotate-45 text-accent" : "text-paper/60 group-hover:text-paper"}`}
                    />
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
                      exit={{ height: 0, opacity: 0, transition: { duration: reduce ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] } }}
                      transition={{ duration: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-8 leading-relaxed text-paper/70 sm:text-lg">
                        {f.a}
                        {f.link && (
                          <>
                            {" "}
                            <CallLink from="faq">{f.link.label}</CallLink>
                          </>
                        )}
                      </p>
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
