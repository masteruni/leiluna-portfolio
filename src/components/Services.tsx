"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { services } from "@/content/site";
import { SectionHeader } from "./SectionHeader";

export function Services() {
  const [open, setOpen] = useState<string>(services[0].id);

  return (
    <section id="services" className="px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index="02"
          label="What I do"
          title={
            <>
              Four skills. <span className="text-outline">One</span> brand voice.
            </>
          }
        />

        <ul className="border-t border-line">
          {services.map((s, i) => {
            const isOpen = open === s.id;
            return (
              <li key={s.id} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? "" : s.id)}
                  aria-expanded={isOpen}
                  aria-controls={`svc-${s.id}`}
                  className="group flex w-full items-center gap-4 py-7 text-left sm:gap-8"
                >
                  <span className="font-mono text-sm text-muted">0{i + 1}</span>
                  <span
                    className={`flex-1 font-display text-3xl font-semibold tracking-tight transition sm:text-5xl ${
                      isOpen ? "text-paper" : "text-paper/50 group-hover:text-paper"
                    }`}
                  >
                    {s.title}
                  </span>
                  <span
                    className={`grid size-11 shrink-0 place-items-center rounded-full border transition duration-300 ${
                      isOpen ? "rotate-45 border-brand bg-brand text-ink" : "border-line"
                    }`}
                  >
                    <Plus size={20} />
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`svc-${s.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.2, 0.7, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-6 pb-8 sm:pl-14 md:grid-cols-2">
                        <p className="max-w-md text-lg leading-relaxed text-muted">{s.blurb}</p>
                        <ul className="flex flex-wrap content-start gap-2">
                          {s.deliverables.map((d) => (
                            <li key={d} className="rounded-full border border-line px-4 py-2 text-sm">
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
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
