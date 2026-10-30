"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { process } from "@/content/site";

// One panel per phase, new moon to full: each a lighter flat colour than the last, each with its moon.
const tones = [
  { bg: "#1d1a22", fg: "#f2f1ee", soft: "#c4bfc8", moon: "#f2f1ee", lit: 0.1 },
  { bg: "#5e1f3a", fg: "#f2f1ee", soft: "#e4bfcd", moon: "#f2f1ee", lit: 0.32 },
  { bg: "#8e3358", fg: "#f2f1ee", soft: "#ecc9d6", moon: "#f2f1ee", lit: 0.56 },
  { bg: "#ea6a8e", fg: "#050506", soft: "#3d1422", moon: "#f2f1ee", lit: 0.8 },
  { bg: "#f2f1ee", fg: "#050506", soft: "#57525c", moon: "#ea6a8e", lit: 1 },
];

// The lit part of a moon: a disc with an offset disc in the panel's own colour laid over it.
function Moon({ lit, color, bg }: { lit: number; color: string; bg: string }) {
  return (
    <svg viewBox="0 0 100 100" className="size-full" aria-hidden>
      <circle cx="50" cy="50" r="46" fill={color} />
      {lit < 1 && <circle cx={50 + lit * 100} cy="50" r="47" fill={bg} />}
    </svg>
  );
}

export function Phases() {
  const [open, setOpen] = useState(0);
  const reduce = useReducedMotion();

  return (
    <section data-chapter="night" id="process" aria-labelledby="process-title" className="px-5 py-20 sm:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <h2 id="process-title" className="font-display text-[clamp(2.75rem,5vw,4.5rem)] font-bold leading-[0.92] tracking-[-0.045em] lg:col-span-6">
            From new moon to full orbit.
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-paper/80 lg:col-span-5 lg:col-start-8">
            Five phases in order the first time, then Create, Launch and Grow on repeat every month. You always know what&apos;s being made, why, and what you get back.
          </p>
        </div>

        <ol className="mt-16 flex flex-col overflow-hidden rounded-[1.6rem] lg:h-[34rem] lg:flex-row">
          {process.map((p, i) => {
            const on = open === i;
            const t = tones[i];
            return (
              <li
                key={p.title}
                style={{ background: t.bg, color: t.fg }}
                className={`relative transition-[flex-grow] duration-[450ms] ease-[var(--ease-out)] lg:basis-0 ${on ? "lg:grow-[58]" : "lg:grow-[10.5]"}`}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={on}
                    aria-controls={`phase-${i}`}
                    onClick={() => setOpen(i)}
                    className={`flex min-h-16 w-full items-center justify-between gap-4 px-6 text-left font-display text-lg font-semibold tracking-tight lg:absolute lg:inset-0 lg:items-end lg:p-6 lg:text-xl ${
                      on ? "lg:pointer-events-none lg:opacity-0" : ""
                    }`}
                  >
                    {/* on wide screens a closed phase is a sliver: its name runs up the panel */}
                    <span className="lg:[writing-mode:vertical-rl] lg:rotate-180">{p.title}</span>
                    <span aria-hidden className="text-2xl lg:hidden">
                      {on ? "–" : "+"}
                    </span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      id={`phase-${i}`}
                      role="region"
                      aria-label={p.title}
                      initial={reduce ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.15 } }}
                      transition={{ duration: 0.4, delay: reduce ? 0 : 0.2 }}
                      className="grid gap-8 px-6 pb-8 lg:absolute lg:inset-0 lg:grid-cols-[1fr_auto] lg:p-10"
                    >
                      <div className="flex flex-col justify-between gap-6">
                        <p aria-hidden className="hidden font-display text-[2.5rem] font-bold leading-none tracking-[-0.04em] lg:block">
                          {p.title}
                        </p>
                        <div>
                          <p className="max-w-[36ch] text-lg leading-relaxed">{p.text}</p>
                          <p className="mt-4 max-w-[36ch] text-[15px]" style={{ color: t.soft }}>
                            You get: {p.output}
                          </p>
                        </div>
                      </div>
                      <div className="size-28 sm:size-36 lg:size-56 lg:self-center">
                        <Moon lit={t.lit} color={t.moon} bg={t.bg} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
