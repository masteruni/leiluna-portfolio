"use client";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { founders } from "@/content/site";
import { Crescent } from "./Crescent";
import { SectionHead } from "./SectionHead";

// One founder: a portrait, then who they are and what they lead. The portrait is a still frame: nothing tilts or
// follows the pointer, and nothing is layered behind it.
function Founder({ f, i }: { f: (typeof founders)[number]; i: number }) {
  const role = f.role.split(" · ");

  return (
    <article className={i ? "md:mt-28" : ""}>
      <div className={`relative aspect-[4/5] overflow-hidden rounded-3xl ${i ? "bg-brand" : "bg-brand-2"}`}>
        {f.photo ? (
          // the cut-out portrait stands a little larger than its frame, cropped at the waist
          <div className="absolute inset-x-[-5%] bottom-[-12%] top-[2%]">
            <Image
              src={f.photo}
              alt={`Portrait of ${f.fullName}`}
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover object-top"
            />
          </div>
        ) : (
          <p className="absolute inset-x-6 bottom-6 text-sm text-muted">Photo coming soon</p>
        )}
      </div>

      <div className="mt-8">
        <h3 className="font-display text-5xl font-bold tracking-[-0.04em]">{f.name}</h3>
        <p className="mt-2 text-paper/65">
          {f.fullName}, {role[0].toLowerCase()}
        </p>
        {role[1] && <p className="mt-1 text-accent">{role[1]}</p>}
        <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-paper/70">{f.bio}</p>
        <h4 className="mt-10 text-sm text-muted">Leads</h4>
        <ul className="mt-3 max-w-lg border-t border-line">
          {f.leads.map((l) => (
            <li key={l} className="border-b border-line py-3 text-paper/85">
              {l}
            </li>
          ))}
        </ul>
        {f.certifications.length > 0 && (
          <>
            <h4 className="mt-8 text-sm text-muted">Certified in</h4>
            <ul className="mt-3 max-w-lg border-t border-line">
              {f.certifications.map((c) => (
                <li key={c.name} className="flex items-center gap-4 border-b border-line py-3">
                  {c.logo && (
                    <Image src={c.logo} alt="" width={36} height={36} className="size-9 shrink-0 object-contain" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block text-paper/85">{c.name}</span>
                    <span className="block text-sm text-paper/55">{c.issuer}</span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </article>
  );
}

// The heading, drawn: the mark's two crescents start apart, one for each founder, and come together as the section
// scrolls up the screen; once they've locked, the orbit they share closes around them. Scrolling back parts them
// again. Decorative, desktop only (it fills the empty half beside the heading). With reduced motion it's the
// finished mark, switched in CSS rather than in the markup so the server's HTML and the browser's always match.
function Joining() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "center 0.45"] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.5 });
  const leftX = useTransform(p, [0, 0.8], [-64, 0], { clamp: true });
  const leftTurn = useTransform(p, [0, 0.8], [-70, 0], { clamp: true });
  const rightX = useTransform(p, [0, 0.8], [64, 0], { clamp: true });
  const rightTurn = useTransform(p, [0, 0.8], [70, 0], { clamp: true });
  const orbit = useTransform(p, [0.7, 1], [0, 1]);
  return (
    <div ref={ref} aria-hidden className="relative hidden aspect-square w-64 shrink-0 lg:block xl:mr-16 xl:w-72">
      <svg viewBox="0 0 300 300" className="absolute inset-0 size-full -rotate-12 overflow-visible">
        <ellipse cx="150" cy="150" rx="146" ry="54" fill="none" stroke="var(--line)" />
        <motion.ellipse cx="150" cy="150" rx="146" ry="54" fill="none" stroke="var(--brand)" strokeWidth="1.5" className="motion-reduce:hidden" style={{ pathLength: orbit }} />
        <ellipse cx="150" cy="150" rx="146" ry="54" fill="none" stroke="var(--brand)" strokeWidth="1.5" className="hidden motion-reduce:block" />
      </svg>
      <div className="absolute inset-[27%]">
        <Crescent tone="paper" className="absolute inset-0 motion-reduce:transform-none!" style={{ x: leftX, rotate: leftTurn }} />
        <Crescent tone="brand" className="absolute inset-0 motion-reduce:transform-none!" style={{ x: rightX, rotate: rightTurn }} />
      </div>
    </div>
  );
}

export function Founders() {
  return (
    <section id="founders" className="px-5 py-16 sm:px-10 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-12">
          <SectionHead title="Two founders, one orbit.">
            Like the two halves of our mark: one shapes the strategy and looks after every client, the other powers the
            creative and the systems behind it. Together they make the full circle.
          </SectionHead>
          <Joining />
        </div>
        <div className="mt-12 grid gap-16 md:grid-cols-2 md:gap-16">
          {founders.map((f, i) => (
            <Founder key={f.name} f={f} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
