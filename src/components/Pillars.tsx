"use client";

import Image from "next/image";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef } from "react";
import { services } from "@/content/site";

const DRIFT = 50 / 90; // % of the track per second: the band is twice as long as before, so the same pace

// Slow-drifting band of the five service pillars, alternating solid and outline type. Scrolling pushes it:
// it speeds up and leans with a fast scroll, turns around when you scroll back up, then settles back to its
// drift. Hovering eases it almost to a stop so a word can be read.
export function Pillars() {
  // Twice round the five pillars makes one full solid/outline cycle; the band is two such cycles, so it can
  // wrap at the halfway point without a visible jump.
  const row = [...services, ...services, ...services, ...services];
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const onScreen = useInView(ref);
  const hover = useRef(false);
  const calm = useRef(1); // eases toward 0.15 on hover and back to 1
  const direction = useRef(1);

  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [0, 1000], [0, 5], { clamp: false });
  const skew = useTransform(velocity, (v) => (reduce ? 0 : Math.max(-6, Math.min(6, (-v / 2500) * 6))));
  const x = useTransform(base, (v) => `${(((v % 50) + 50) % 50) - 50}%`); // wraps at the halfway point

  useAnimationFrame((_, delta) => {
    if (reduce || !onScreen) return;
    const dt = Math.min(delta, 100) / 1000;
    calm.current += ((hover.current ? 0.15 : 1) - calm.current) * Math.min(1, dt * 4);
    const b = boost.get();
    if (b < 0) direction.current = -1;
    else if (b > 0) direction.current = 1;
    let move = direction.current * DRIFT * dt * calm.current;
    move += move * Math.abs(b);
    base.set(base.get() - move);
  });

  return (
    <div
      ref={ref}
      className="overflow-hidden border-y border-line py-8"
      aria-hidden
      onMouseEnter={() => (hover.current = true)}
      onMouseLeave={() => (hover.current = false)}
    >
      <motion.div
        style={{ x, skewX: skew }}
        className="flex w-max items-center whitespace-nowrap font-display text-5xl font-semibold tracking-[-0.03em] sm:text-7xl"
      >
        {row.map((s, i) => (
          <span key={i} className="flex items-center gap-10 pr-10">
            <span className={i % 2 ? "text-outline" : ""}>{s.short}</span>
            <Image src="/brand/mark.png" alt="" width={44} height={46} className="h-10 w-auto opacity-80 sm:h-12" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
