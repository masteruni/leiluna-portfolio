"use client";

import Image from "next/image";
import { motion, useMotionTemplate, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { founders } from "@/content/site";
import { Eyebrow } from "./Eyebrow";
import { LineReveal } from "./LineReveal";

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
    <article ref={ref} className={`group ${i ? "md:mt-40" : ""}`}>
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
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-500 group-hover:opacity-100"
          />
          <span className="absolute left-5 top-5 rounded-full bg-ink/60 px-3 py-1 font-mono text-[10px] uppercase tracking-widest backdrop-blur">
            {f.photo ? "Co-founder" : "Photo coming soon"}
          </span>
        </motion.div>
      </div>

      <div className="mt-8">
        <h3 className="font-display text-5xl font-bold tracking-[-0.04em]">{f.name}</h3>
        <p className="serif mt-1 text-2xl text-muted">{f.fullName}</p>
        <p className="mt-4 font-mono text-[11px] uppercase leading-relaxed tracking-[0.25em]">
          <span className="text-paper/65">{role[0]}</span>
          {role[1] && <span className="block text-accent">{role[1]}</span>}
        </p>
        <p className="mt-6 max-w-lg text-[1.05rem] leading-relaxed text-paper/70">{f.bio}</p>
        <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-muted">Leads</p>
        <ol className="mt-3 max-w-lg border-t border-line">
          {f.leads.map((l, n) => (
            <li
              key={l}
              className="flex items-baseline gap-4 border-b border-line py-3"
            >
              <span className="font-mono text-[10px] text-accent">{String(n + 1).padStart(2, "0")}</span>
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
    <section id="founders" className="px-5 py-24 sm:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <Eyebrow id="founders" />
        <h2 className="mt-6 font-display text-[clamp(2.8rem,6vw,6rem)] font-bold leading-[0.9] tracking-[-0.045em]">
          <LineReveal inView lines={["Two crescents,", <span key="b" className="serif font-normal text-accent">one orbit.</span>]} />
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
