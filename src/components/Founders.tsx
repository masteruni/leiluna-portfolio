"use client";

import Image from "next/image";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { founders } from "@/content/site";
import { Crescent } from "./Crescent";
import { Eyebrow } from "./Eyebrow";
import { LineReveal } from "./LineReveal";
import { Tag } from "./ui";

const tiltSpring = { stiffness: 150, damping: 18, mass: 0.6 };

// With a mouse, the portrait frame tilts toward the pointer and its layers part in depth: the backdrop and
// crescent drift one way, the cut-out portrait the other, under a soft sheen that follows the pointer.
function Founder({ f, i }: { f: (typeof founders)[number]; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], i ? [20, -20] : [-20, 20]);
  const role = f.role.split(" · ");

  // Pointer position over the frame, from -0.5 to 0.5 on each axis.
  const px = useSpring(0, tiltSpring);
  const py = useSpring(0, tiltSpring);
  const rotateY = useTransform(px, (v) => v * 14);
  const rotateX = useTransform(py, (v) => v * -12);
  const backX = useTransform(px, (v) => v * -16);
  const backY = useTransform(py, (v) => v * -16);
  const moonX = useTransform(px, (v) => v * -30);
  const moonY = useTransform(py, (v) => v * -30);
  const portraitX = useTransform(px, (v) => v * 20);
  const sheenX = useTransform(px, (v) => `${(v + 0.5) * 100}%`);
  const sheenY = useTransform(py, (v) => `${(v + 0.5) * 100}%`);
  const sheen = useMotionTemplate`radial-gradient(30rem circle at ${sheenX} ${sheenY}, rgb(246 166 189 / 0.22), transparent 55%)`;

  const follow = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const rest = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <article ref={ref} className={`group ${i ? "md:mt-28" : ""}`}>
      <div className="perspective-[1200px]" onPointerMove={follow} onPointerLeave={rest}>
        <motion.div style={{ rotateX, rotateY }} className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-ink-2">
          {/* placeholder backdrop: pink glow + initial — stays behind the cut-out portrait */}
          <motion.div
            style={{ x: backX, y: backY, background: `radial-gradient(80% 60% at ${i ? 70 : 30}% 30%, rgb(234 106 142 / 0.35), transparent 70%), var(--ink-2)` }}
            className="absolute -inset-6"
          >
            <span className="serif absolute inset-0 grid place-items-center text-[14rem] leading-none text-paper/10">{f.name.charAt(0)}</span>
          </motion.div>
          {/* crescent echoing the logo, orbiting behind the portrait */}
          <motion.div
            aria-hidden
            style={{ rotate, x: moonX, y: moonY }}
            className="pointer-events-none absolute -bottom-1/4 -right-1/4 size-[90%] rounded-full"
          >
            <div
              className="size-full rounded-full"
              style={{ boxShadow: `inset ${i ? "-" : ""}2.2rem -1.4rem 0 0 ${i ? "var(--brand)" : "var(--paper)"}` }}
            />
          </motion.div>
          {f.photo && (
            <motion.div style={{ y, x: portraitX }} className="absolute inset-x-[-5%] bottom-[-12%] top-[2%]">
              <Image
                src={f.photo}
                alt={`Portrait of ${f.fullName}`}
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover object-top drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
              />
            </motion.div>
          )}
          <motion.div
            aria-hidden
            style={{ background: sheen }}
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100"
          />
          <Tag className="absolute left-5 top-5">{f.photo ? "Co-founder" : "Photo coming soon"}</Tag>
        </motion.div>
      </div>

      <div className="mt-8">
        <h3 className="font-display text-5xl font-bold tracking-[-0.04em]">{f.name}</h3>
        <p className="serif mt-1 text-2xl text-muted">{f.fullName}</p>
        <p className="mt-4 text-[13px] leading-relaxed">
          <span className="text-paper/65">{role[0]}</span>
          {role[1] && <span className="block text-accent">{role[1]}</span>}
        </p>
        <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-paper/70">{f.bio}</p>
        <p className="mt-10 text-xs text-muted">Leads</p>
        <ul className="mt-3 max-w-lg border-t border-line">
          {f.leads.map((l) => (
            <li
              key={l}
              className="flex items-baseline gap-4 border-b border-line py-3"
            >
              <span aria-hidden className="size-1.5 shrink-0 translate-y-[-2px] rounded-full bg-brand" />
              <span className="text-paper/85">{l}</span>
            </li>
          ))}
        </ul>
        {f.certifications.length > 0 && (
          <>
            <p className="mt-8 text-xs text-muted">Certified in</p>
            <ul className="mt-3 max-w-lg border-t border-line">
              {f.certifications.map((c) => (
                <li key={c.name} className="flex items-center gap-4 border-b border-line py-3">
                  {c.logo && (
                    <Image src={c.logo} alt="" width={36} height={36} className="size-9 shrink-0 object-contain" />
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="block text-paper/85">{c.name}</span>
                    <span className="block text-sm text-muted">{c.issuer}</span>
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
  const glow = useTransform(p, [0.7, 1], [0, 0.45]);
  return (
    <div ref={ref} aria-hidden className="relative hidden aspect-square w-64 shrink-0 lg:block xl:mr-16 xl:w-72">
      <motion.div style={{ opacity: glow }} className="absolute inset-[22%] rounded-full bg-brand blur-3xl motion-reduce:opacity-45!" />
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
          <div>
            <Eyebrow id="founders" />
            <h2 className="mt-6 font-display text-[clamp(2.8rem,6vw,6rem)] font-bold leading-[0.9] tracking-[-0.045em]">
              <LineReveal inView lines={["Two crescents,", "one orbit."]} />
            </h2>
            <p className="mt-6 max-w-xl text-lg text-paper/60">
              Like the two halves of our mark: one shapes the strategy and looks after every client, the other powers the
              creative and the systems behind it. Together they make the full circle.
            </p>
          </div>
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
