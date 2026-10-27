"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { founders } from "@/content/site";
import { LineReveal } from "./LineReveal";

function Founder({ f, i }: { f: (typeof founders)[number]; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], i ? [20, -20] : [-20, 20]);

  return (
    <article ref={ref} className={`group ${i ? "md:mt-40" : ""}`}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-ink-2">
        <motion.div style={{ y }} className="absolute inset-[-10%]">
          {f.photo ? (
            <Image src={f.photo} alt={`Portrait of ${f.name}`} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover grayscale transition duration-700 group-hover:grayscale-0" />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: `radial-gradient(80% 60% at ${i ? 70 : 30}% 30%, rgb(234 106 142 / 0.35), transparent 70%), var(--ink-2)` }}
            >
              <span className="serif absolute inset-0 grid place-items-center text-[14rem] leading-none text-paper/10">{f.name.charAt(0)}</span>
            </div>
          )}
        </motion.div>
        {/* crescent frame echoing the logo */}
        <motion.div
          aria-hidden
          style={{ rotate }}
          className="pointer-events-none absolute -bottom-1/4 -right-1/4 size-[90%] rounded-full"
        >
          <div
            className="size-full rounded-full"
            style={{ boxShadow: `inset ${i ? "-" : ""}2.2rem -1.4rem 0 0 ${i ? "var(--brand)" : "var(--paper)"}` }}
          />
        </motion.div>
        <span className="absolute left-5 top-5 rounded-full bg-ink/60 px-3 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur">
          {f.photo ? "Co-founder" : "Photo coming soon"}
        </span>
      </div>

      <div className="mt-8">
        <h3 className="font-display text-5xl font-bold tracking-[-0.04em]">
          {f.name}
          <span className="serif ml-3 text-2xl font-normal text-muted">{f.fullName}</span>
        </h3>
        <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.25em] text-brand">{f.role}</p>
        <p className="mt-5 max-w-md leading-relaxed text-paper/70">{f.bio}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {f.leads.map((l) => (
            <li key={l} className="rounded-full border border-line px-3 py-1.5 text-xs text-paper/80">
              {l}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function Founders() {
  return (
    <section className="px-5 py-32 sm:px-10 md:py-44">
      <div className="mx-auto max-w-7xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          <span className="text-brand">(06)</span> The founders
        </p>
        <h2 className="mt-6 font-display text-[clamp(2.8rem,6vw,6rem)] font-bold leading-[0.9] tracking-[-0.045em]">
          <LineReveal inView lines={["Two crescents,", <span key="b" className="serif font-normal text-brand">one orbit.</span>]} />
        </h2>
        <p className="mt-6 max-w-xl text-lg text-paper/60">
          Like the two halves of our mark: one keeps you in the loop, the other keeps the work moving. Together they
          make the full circle.
        </p>
        <div className="mt-20 grid gap-20 md:grid-cols-2 md:gap-16">
          {founders.map((f, i) => (
            <Founder key={f.name} f={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
