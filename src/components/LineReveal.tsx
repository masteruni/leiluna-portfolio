"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

// Each line rises out of a mask — the classic editorial headline reveal.
// `inView` plays it when the block scrolls into view; otherwise `play` controls it.
export function LineReveal({
  lines,
  play = true,
  delay = 0,
  stagger = 0.09,
  duration = 1.1,
  className,
  lineClassName = "",
  inView = false,
}: {
  lines: ReactNode[];
  play?: boolean;
  delay?: number;
  stagger?: number;
  duration?: number;
  className?: string;
  lineClassName?: string;
  inView?: boolean;
}) {
  const reduce = useReducedMotion();
  // Observe the wrapper: the lines themselves start clipped by their masks, so they never "intersect".
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const shown = inView ? seen : play;

  return (
    <span ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className={`block overflow-hidden pb-[0.08em] ${lineClassName}`}>
          <motion.span
            data-enter=""
            className="block origin-top-left"
            initial={reduce ? false : { y: "110%", rotate: 4 }}
            animate={shown ? { y: "0%", rotate: 0 } : undefined}
            transition={{ duration, ease: [0.16, 1, 0.3, 1], delay: delay + i * stagger }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
