"use client";

import { useInView, useReducedMotion, useScroll, useSpring, useVelocity } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import { services } from "@/content/site";

const SPEED = 60; // px per second along the curve at rest

// Where the night of the hero meets the page: the page rises into the dark like the curve of a moon, and the
// studio's services flow along that curve (an idea from ReactBits' Curved Loop, written for this site). It replaces
// a flat seam and a separate marquee band with one piece. Scrolling pushes the words along, and the other way when
// scrolling back up; hovering slows them almost to a stop so a word can be read, and on touch screens a tap holds
// them. Off-screen it rests; with reduced motion it stays still.
export function HorizonLoop() {
  const id = useId().replace(/:/g, "");
  const wrap = useRef<HTMLDivElement>(null);
  const textPath = useRef<SVGTextPathElement>(null);
  const measure = useRef<SVGTextElement>(null);
  const [w, setW] = useState(1440);
  const [unit, setUnit] = useState(0); // the length of one run of the words, measured
  const reduce = useReducedMotion();
  const onScreen = useInView(wrap);
  const hover = useRef(false);
  const held = useRef(false);

  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });

  // Size: the curve is drawn in real pixels so the type never stretches.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const h = Math.round(Math.min(220, Math.max(120, w * 0.14))); // height of the horizon band
  const font = Math.round(Math.min(64, Math.max(26, w * 0.042)));
  const apex = Math.round(h * 0.38); // how high the curve rises in the middle
  const cy = Math.round((4 * apex - 2 * h) / 2); // control point that puts the curve's top at `apex`
  const limb = `M -40 ${h} Q ${w / 2} ${cy} ${w + 40} ${h}`;
  const lift = Math.round(font * 0.32); // words ride just above the edge
  const track = `M -40 ${h - lift} Q ${w / 2} ${cy - lift} ${w + 40} ${h - lift}`;

  // One run of the words; repeated enough times to cover the curve twice, so it can wrap without a seam.
  const words = services.map((s) => s.short);
  useEffect(() => {
    const t = measure.current;
    if (!t) return;
    const measureNow = () => setUnit(t.getComputedTextLength());
    measureNow();
    document.fonts?.ready.then(measureNow);
  }, [font, w]);
  const copies = unit ? Math.ceil((w * 1.3 * 2) / unit) + 1 : 4;

  // Drift along the curve; scroll velocity adds a push and sets the direction.
  useEffect(() => {
    if (reduce || !unit) return;
    let raf = 0;
    let last = performance.now();
    let offset = 0;
    let calm = 1;
    let dir = -1;
    const tick = (now: number) => {
      const dt = Math.min(now - last, 100) / 1000;
      last = now;
      if (onScreen && textPath.current) {
        calm += ((held.current ? 0 : hover.current ? 0.12 : 1) - calm) * Math.min(1, dt * 4);
        const v = velocity.get();
        if (v > 5) dir = -1;
        else if (v < -5) dir = 1;
        const boost = 1 + Math.min(6, Math.abs(v) / 300);
        offset += dir * SPEED * boost * calm * dt;
        offset = ((offset % unit) + unit) % unit; // wrap within one run
        textPath.current.setAttribute("startOffset", `${offset - unit}px`);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce, unit, onScreen, velocity]);

  const run = (k: number) =>
    words.map((word, i) => (
      <tspan key={`${k}-${i}`}>
        <tspan className={(i + k) % 2 ? "horizon-outline" : "horizon-solid"}>{word}</tspan>
        <tspan className="horizon-star" dx={font * 0.45}>
          ✦
        </tspan>
        <tspan dx={font * 0.45}> </tspan>
      </tspan>
    ));

  return (
    <div
      ref={wrap}
      aria-hidden
      className="relative z-10 select-none"
      // overlaps the bottom of the hero a little, so the two read as one sky
      style={{ marginTop: -Math.round(h * 0.3) }}
      onMouseEnter={() => (hover.current = true)}
      onMouseLeave={() => (hover.current = false)}
      onPointerUp={(e) => e.pointerType !== "mouse" && (held.current = !held.current)}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="block w-full" style={{ height: h }}>
        <defs>
          <path id={`limb-${id}`} d={limb} />
          <path id={`track-${id}`} d={track} />
          {/* the night fades in over the part that overlaps the hero (the top 30%), so the planet glow eases out instead of ending
              in a hard line */}
          <linearGradient id={`night-${id}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#050506" stopOpacity="0" />
            <stop offset="0.28" stopColor="#050506" stopOpacity="1" />
          </linearGradient>
          <linearGradient id={`rim-${id}`} x1="0" x2="1">
            <stop offset="0" stopColor="var(--brand)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--brand-2)" />
            <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* the night above the curve (the hero's colour, in both themes) */}
        <path d={`M 0 0 H ${w} V ${h} H 0 Z`} fill={`url(#night-${id})`} />
        {/* the page rising as a moon */}
        <path d={`${limb} V ${h + 2} H -40 Z`} className="horizon-moon" />
        {/* a soft pink rim along the edge, like the hero's planet */}
        <use href={`#limb-${id}`} fill="none" stroke={`url(#rim-${id})`} strokeWidth="1.5" />
        <text className="horizon-text" style={{ fontSize: font }}>
          <textPath ref={textPath} href={`#track-${id}`} startOffset="0">
            {Array.from({ length: copies }, (_, k) => run(k))}
          </textPath>
        </text>
        {/* hidden: measures one run, so the loop wraps exactly */}
        <text ref={measure} className="horizon-text" style={{ fontSize: font, visibility: "hidden" }}>
          {run(0)}
        </text>
      </svg>
    </div>
  );
}
