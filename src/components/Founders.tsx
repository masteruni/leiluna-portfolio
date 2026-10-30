"use client";

import Image from "next/image";
import { Crescent } from "./Crescent";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { founders } from "@/content/site";
import { LineReveal } from "./LineReveal";

function Founder({ f, i }: { f: (typeof founders)[number]; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], i ? [20, -20] : [-20, 20]);
  const role = f.role.split(" · ");

  return (
    <article ref={ref} className={`group ${i ? "md:mt-40" : ""}`}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-ink-2">
        {/* a field of rose behind the cut-out portrait */}
        <div className="absolute inset-0" style={{ background: "color-mix(in oklab, var(--brand) 14%, var(--ink-2))" }} />
        {/* crescent echoing the logo, orbiting behind the portrait */}
        <motion.div
          aria-hidden
          style={{ rotate }}
          className="pointer-events-none absolute -bottom-1/4 -right-1/4 size-[90%] rounded-full"
        >
          <Crescent className="size-full" color={i ? "var(--brand)" : "var(--paper)"} dx={i ? -7 : 7} dy={-4.5} />
        </motion.div>
        {f.photo && (
          <motion.div style={{ y }} className="absolute inset-x-[-5%] bottom-[-12%] top-[2%]">
            <Image
              src={f.photo}
              alt={`Portrait of ${f.fullName}`}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover object-top"
            />
          </motion.div>
        )}
        <span className="absolute left-5 top-5 rounded-full bg-ink/85 px-3 py-1 text-[13px]">
          {f.photo ? "Co-founder" : "Photo coming soon"}
        </span>
      </div>

      <div className="mt-8">
        <h3 className="font-display text-5xl font-bold tracking-[-0.04em]">{f.name}</h3>
        <p className="serif mt-1 text-2xl text-muted">{f.fullName}</p>
        <p className="mt-4 text-sm leading-relaxed ">
          <span className="text-paper/50">{role[0]}</span>
          {role[1] && <span className="block text-brand">{role[1]}</span>}
        </p>
        <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-paper/70">{f.bio}</p>
        <p className="mt-10 text-sm text-muted">Leads</p>
        <ol className="mt-3 max-w-lg">
          {f.leads.map((l) => (
            <li
              key={l}
              className="flex items-baseline gap-4 py-3"
            >
              <span className="text-paper/85">{l}</span>
            </li>
          ))}
        </ol>
      </div>
    </article>
  );
}

export function Founders() {
  return (
    <section id="founders" className="px-5 py-20 sm:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-display text-[clamp(2.8rem,6vw,6rem)] font-bold leading-[0.9] tracking-[-0.045em]">
          <LineReveal inView lines={["Two crescents,", "one orbit."]} />
        </h2>
        <p className="mt-6 max-w-xl text-lg text-paper/60">
          Like the two halves of our mark: one shapes the strategy and looks after every client, the other powers the
          creative and the systems behind it. Together they make the full circle.
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
