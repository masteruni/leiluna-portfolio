"use client";

import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll, useTime, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { useRef, useState } from "react";
import { services } from "@/content/site";

const CX = 300;
const CY = 300;

function OrbitPlanet({ i, active, label }: { i: number; active: boolean; label: string }) {
  const time = useTime();
  const reduce = useReducedMotion();
  const rx = 80 + i * 48;
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
        className="transition-all duration-700"
      />
      <motion.circle cx={x} cy={y} r={active ? 9 : 4} fill={active ? "var(--brand)" : "var(--paper)"} className="transition-[r] duration-500" />
      {active && (
        <>
          <motion.circle cx={x} cy={y} r={22} fill="var(--brand)" opacity={0.18} />
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
      <defs>
        <radialGradient id="core">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={CX} cy={CY} r="90" fill="url(#core)" />
      {services.map((s, i) => (
        <OrbitPlanet key={s.id} i={i} active={i === active} label={s.short} />
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
      <h3 className="font-display text-[clamp(2.4rem,4.6vw,4.8rem)] font-semibold leading-[0.95] tracking-[-0.04em] short:text-[clamp(1.9rem,6svh,3.4rem)]">{s.title}</h3>
      <p className="mt-6 max-w-lg text-lg leading-relaxed text-paper/70 short:mt-3 short:text-base">{s.blurb}</p>
      <ul className="mt-10 grid max-w-xl grid-cols-2 gap-x-6 gap-y-3 text-sm text-paper/80 short:mt-4 short:gap-y-1 short:text-[13px]">
        {s.items.map((it, k) => (
          <motion.li
            key={it}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + k * 0.035 }}
            className="flex gap-3 border-t border-line pt-3 short:pt-1"
          >
            {it}
          </motion.li>
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
              <span
                aria-hidden
                className={`mt-1 grid size-9 shrink-0 place-items-center rounded-full border border-line text-lg transition-all duration-500 ${
                  open ? "rotate-45 border-brand bg-brand text-ink" : "text-paper/70"
                }`}
              >
                +
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={`service-${s.id}`}
                  key="items"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <ul className="flex flex-wrap gap-2 pb-8 pl-9">
                    {s.items.map((it) => (
                      <li key={it} className="rounded-full border border-line px-3 py-1.5 text-[13px] text-paper/80">
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
        <div className="sticky top-0 flex h-svh flex-col overflow-hidden px-10 pb-10 pt-28 short:pb-5 short:pt-20">
          <div className="flex shrink-0 items-end justify-between">
            <h2 className="text-lg font-medium text-paper/70">Services</h2>
            <p className="text-sm tabular-nums text-muted">
              {active + 1} of {services.length}
            </p>
          </div>

          <div className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 grid-cols-[1.1fr_1fr] items-center gap-16">
            <div className="relative min-h-[460px] short:min-h-0">
              <AnimatePresence mode="wait">
                <Detail key={active} i={active} />
              </AnimatePresence>
            </div>
            {/* on short screens the orbit is sized by the height left over, not the column width */}
            <div className="relative short:mx-auto short:w-[min(100%,calc(100svh-15rem))]">
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

          <div className="flex shrink-0 items-center gap-8">
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
        <h2 className="mb-10 font-display text-5xl font-bold tracking-[-0.04em]">Services</h2>
        <MobileServices />
      </div>
    </section>
  );
}
