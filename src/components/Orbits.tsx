"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTime, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { useRef, useState } from "react";
import { services } from "@/content/site";

const CX = 300;
const CY = 300;

function OrbitPlanet({ i, active }: { i: number; active: boolean }) {
  const time = useTime();
  const reduce = useReducedMotion();
  const rx = 80 + i * 48;
  const ry = rx * 0.36;
  const speed = 0.00022 / (1 + i * 0.35);
  const phase = i * 1.7;
  const angle = useTransform(time, (t) => (reduce ? phase : phase + t * speed * Math.PI * 2));
  const x = useTransform(angle, (a) => CX + rx * Math.cos(a));
  const y = useTransform(angle, (a) => CY + ry * Math.sin(a));
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
        className="transition-all duration-700"
      />
      <motion.circle cx={x} cy={y} r={active ? 9 : 4} fill={active ? "var(--brand)" : "var(--paper)"} className="transition-[r] duration-500" />
      {active && <motion.circle cx={x} cy={y} r={22} fill="var(--brand)" opacity={0.18} />}
    </>
  );
}

function OrbitSystem({ active }: { active: number }) {
  return (
    <svg viewBox="0 0 600 600" className="h-auto w-full -rotate-12 scale-125 overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="core">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={CX} cy={CY} r="90" fill="url(#core)" />
      {services.map((s, i) => (
        <OrbitPlanet key={s.id} i={i} active={i === active} />
      ))}
    </svg>
  );
}

function Detail({ i }: { i: number }) {
  const s = services[i];
  return (
    <motion.div
      key={s.id}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <h3 className="font-display text-[clamp(2.4rem,4.6vw,4.8rem)] font-semibold leading-[0.95] tracking-[-0.04em]">{s.title}</h3>
      <p className="mt-6 max-w-lg text-lg leading-relaxed text-paper/70">{s.blurb}</p>
      <ul className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3 text-sm text-paper/80">
        {s.items.map((it, k) => (
          <motion.li
            key={it}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + k * 0.035 }}
            className="flex gap-3 border-t border-line pt-3"
          >
            <span className="text-brand">✦</span>
            {it}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

export function Orbits() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const lenis = useLenis();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => setActive(Math.min(services.length - 1, Math.floor(p * services.length))));
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
      <div ref={ref} className="hidden lg:block" style={{ height: `${services.length * 90 + 10}vh` }}>
        <div className="sticky top-0 flex h-screen flex-col overflow-hidden px-10 pb-10 pt-28">
          <div className="flex items-end justify-between">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
              <span className="text-brand">(02)</span> Services, five orbits
            </p>
            <p className="font-display text-sm tabular-nums text-muted">
              <span className="text-3xl font-semibold text-paper">0{active + 1}</span> / 0{services.length}
            </p>
          </div>

          <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-[1.1fr_1fr] items-center gap-16">
            <div className="relative min-h-[460px]">
              <AnimatePresence mode="wait">
                <Detail key={active} i={active} />
              </AnimatePresence>
            </div>
            <div className="relative">
              <OrbitSystem active={active} />
              <Image
                src="/brand/mark.png"
                alt=""
                width={92}
                height={96}
                className="absolute left-1/2 top-1/2 h-24 w-auto -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_30px_rgba(234,106,142,0.6)]"
              />
            </div>
          </div>

          <div className="flex items-center gap-8">
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
      <div className="px-5 py-24 sm:px-10 lg:hidden">
        <p className="mb-10 font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          <span className="text-brand">(02)</span> Services, five orbits
        </p>
        <ol className="space-y-14">
          {services.map((s, i) => (
            <li key={s.id} className="border-t border-line pt-6">
              <p className="font-mono text-xs text-brand">0{i + 1}</p>
              <h3 className="mt-3 font-display text-4xl font-semibold leading-[0.95] tracking-[-0.03em]">{s.title}</h3>
              <p className="mt-4 text-paper/70">{s.blurb}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {s.items.map((it) => (
                  <li key={it} className="rounded-full border border-line px-3 py-1.5 text-xs text-paper/80">
                    {it}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
