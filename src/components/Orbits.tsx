"use client";

import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTime, useTransform, type Variants } from "motion/react";
import { useLenis } from "lenis/react";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";
import { services } from "@/content/site";
import { Mark } from "./Mark";

const CX = 300;
const CY = 300;

function OrbitPlanet({ i, active, label }: { i: number; active: boolean; label: string }) {
  const time = useTime();
  const reduce = useReducedMotion();
  const rx = 112 + i * 40; // the innermost orbit clears the mark in the middle
  const ry = rx * 0.36;
  const speed = 0.00022 / (1 + i * 0.35);
  const phase = i * 1.7;
  const angle = useTransform(time, (t) => (reduce ? phase : phase + t * speed * Math.PI * 2));
  const x = useTransform(angle, (a) => CX + rx * Math.cos(a));
  const y = useTransform(angle, (a) => CY + ry * Math.sin(a));
  // the name tag rides just above its planet (and tilts with the whole system)
  const labelY = useTransform(y, (v) => v - 18);
  return (
    <>
      <ellipse
        cx={CX}
        cy={CY}
        rx={rx}
        ry={ry}
        fill="none"
        stroke={active ? "var(--brand)" : "var(--line)"}
        strokeWidth={active ? 1.5 : 1}
        className="transition-[stroke,stroke-width] duration-500"
      />
      <motion.circle cx={x} cy={y} r={active ? 9 : 4} fill={active ? "var(--brand)" : "var(--paper)"} className="transition-[r] duration-500" />
      {active && (
        <>
          {/* a single ripple as this orbit lights up, so the eye lands on the planet that just took over (hidden in
              CSS with reduced motion, rather than left out, so server and browser markup stay the same) */}
          <motion.circle
            cx={x}
            cy={y}
            fill="none"
            stroke="var(--brand)"
            strokeWidth={1}
            className="motion-reduce:hidden"
            initial={{ r: 10, opacity: 0.7 }}
            animate={{ r: 46, opacity: 0 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.text
            x={x}
            y={labelY}
            textAnchor="middle"
            fill="var(--paper)"
            fontSize="13"
            fontFamily="var(--font-outfit), sans-serif"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {label}
          </motion.text>
        </>
      )}
    </>
  );
}

function OrbitSystem({ active }: { active: number }) {
  return (
    <svg viewBox="0 0 600 600" className="h-auto w-full -rotate-12 scale-125 overflow-visible" aria-hidden>
      {services.map((s, i) => (
        <OrbitPlanet key={s.id} i={i} active={i === active} label={s.short} />
      ))}
    </svg>
  );
}

// One service handing over to the next. `dir` is the way the page is being scrolled (1 down, -1 up): the new
// service arrives from that side and the old one leaves ahead of it, quickly, so a fast scroll through all five
// never queues up half-faded text. With reduced motion it's a plain crossfade.
const handOver: Variants = {
  enter: (dir: number) => ({ opacity: 0, y: 36 * dir }),
  center: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  exit: (dir: number) => ({ opacity: 0, y: -20 * dir, transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }),
};

function Detail({ i, dir }: { i: number; dir: number }) {
  const s = services[i];
  return (
    <motion.div key={s.id} custom={dir} variants={handOver} initial="enter" animate="center" exit="exit">
      <h3 className="font-display text-[clamp(2.2rem,4.2vw,4.25rem)] font-semibold leading-[0.98] tracking-[-0.04em] short:text-[clamp(1.9rem,6svh,3.4rem)]">{s.title}</h3>
      <p className="mt-6 max-w-lg text-lg leading-relaxed text-paper/70 short:mt-3 short:text-base">{s.blurb}</p>
      {/* what's included, as a plain ruled list: the whole block arrives together */}
      <ul className="mt-10 grid max-w-xl grid-cols-2 gap-x-8 text-sm text-paper/80 short:mt-4 short:text-xs">
        {s.items.map((it) => (
          <li key={it} className="border-t border-line py-2.5 short:py-1">
            {it}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// Phones and tablets: one service open at a time, so the list stays scannable.
function MobileServices() {
  const [openId, setOpenId] = useState<string | null>(services[0].id);
  const reduce = useReducedMotion();
  return (
    <ol className="divide-y divide-line border-t border-line">
      {services.map((s) => {
        const open = openId === s.id;
        return (
          <li key={s.id}>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={`service-${s.id}`}
              onClick={() => setOpenId(open ? null : s.id)}
              className="flex w-full items-start gap-5 py-6 text-left"
            >
              <span className="flex-1">
                <span className="block font-display text-3xl font-semibold leading-[0.95] tracking-[-0.03em] sm:text-4xl">{s.title}</span>
                <span className="mt-3 block text-sm text-paper/60 sm:text-base">{s.blurb}</span>
              </span>
              <Plus
                aria-hidden
                strokeWidth={1.5}
                className={`mt-1 size-6 shrink-0 transition-[rotate,color] duration-300 ease-[var(--ease-out)] ${open ? "rotate-45 text-accent" : "text-paper/60"}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={`service-${s.id}`}
                  key="items"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0, transition: { duration: reduce ? 0 : 0.2, ease: [0.16, 1, 0.3, 1] } }}
                  transition={{ duration: reduce ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="grid gap-x-8 pb-8 pr-11 text-sm text-paper/80 sm:grid-cols-2">
                    {s.items.map((it) => (
                      <li key={it} className="border-t border-line py-2.5">
                        {it}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ol>
  );
}

export function Orbits() {
  const ref = useRef<HTMLDivElement>(null);
  // the service in view, and which way the visitor was scrolling when it took over (1 down, -1 up)
  const [{ active, dir }, setView] = useState({ active: 0, dir: 1 });
  const reduce = useReducedMotion();
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(services.length - 1, Math.floor(p * services.length));
    setView((v) => (v.active === next ? v : { active: next, dir: next > v.active ? 1 : -1 }));
  });
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const jump = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    lenis?.scrollTo(top + (span * (i + 0.5)) / services.length, { duration: 1.2 });
  };

  return (
    <section id="services" className="relative">
      {/* Desktop: pinned orbital system */}
      <div ref={ref} className="hidden lg:block" style={{ height: `${services.length * 70 + 10}vh` }}>
        <div className="sticky top-0 flex h-svh flex-col overflow-hidden px-10 pb-10 pt-28 short:pb-5 short:pt-20">
          {/* the head and the foot share the content's width, so the eyebrow lines up with every other section's */}
          <div className="mx-auto flex w-full max-w-7xl shrink-0 items-end justify-between">
            <h2 className="font-display text-xl font-medium tracking-[-0.01em]">Services</h2>
            <p className="text-sm tabular-nums text-muted">
              {active + 1} of {services.length}
            </p>
          </div>

          <div className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 grid-cols-[1.1fr_1fr] items-center gap-16">
            <div className="relative min-h-[460px] short:min-h-0">
              <AnimatePresence mode="wait" custom={reduce ? 0 : dir} initial={false}>
                <Detail key={active} i={active} dir={reduce ? 0 : dir} />
              </AnimatePresence>
            </div>
            {/* on short screens the orbit is sized by the height left over, not the column width */}
            <div className="relative short:mx-auto short:w-[min(100%,calc(100svh-15rem))]">
              <OrbitSystem active={active} />
              <Mark
                width={92}
                height={96}
                className="absolute left-1/2 top-1/2 h-16 w-auto -translate-x-1/2 -translate-y-1/2"
              />
            </div>
          </div>

          <div className="mx-auto flex w-full max-w-7xl shrink-0 items-center gap-8">
            <div className="flex gap-6">
              {services.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => jump(i)}
                  className={`text-sm transition-colors ${i === active ? "text-paper" : "text-muted hover:text-paper"}`}
                >
                  {s.short}
                </button>
              ))}
            </div>
            <div className="h-px flex-1 bg-line">
              <motion.div className="h-px bg-brand" style={{ width: bar }} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet: stacked */}
      <div className="px-5 py-16 md:py-24 sm:px-10 lg:hidden">
        <h2 className="heading-section mb-8">Services</h2>
        <MobileServices />
      </div>
    </section>
  );
}
