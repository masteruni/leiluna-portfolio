"use client";

import { animate, useInView, useMotionValue, useReducedMotion, useTransform, motion } from "motion/react";
import { useEffect, useRef } from "react";

// Counts a stat like "2.6M", "5.6M+" or "680×" up from zero when it scrolls into view.
// The number keeps its decimals; anything around it (suffixes, symbols) stays put.
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const match = value.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
  const target = match ? parseFloat(match[2].replace(",", ".")) : 0;
  const decimals = match?.[2].split(/[.,]/)[1]?.length ?? 0;
  const valid = match !== null;
  // Always starts at zero, as the server renders it, so the page hydrates cleanly.
  const n = useMotionValue(0);
  const text = useTransform(n, (v) => v.toFixed(decimals));

  useEffect(() => {
    if (!valid) return;
    // Reduced motion: show the final number straight away, no count.
    if (reduce) {
      n.set(target);
      return;
    }
    if (!inView) return;
    const controls = animate(n, target, { duration: 1.8, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [inView, reduce, valid, n, target]);

  if (!match) return <span className={className}>{value}</span>;
  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{value}</span>
      <span aria-hidden className="tabular-nums">
        {match[1]}
        <motion.span>{text}</motion.span>
        {match[3]}
      </span>
    </span>
  );
}
