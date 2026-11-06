"use client";

import { motion, useReducedMotion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
  css = false,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li";
  /** Run the entrance in CSS (`hero-in` / `fade-in` in globals.css) instead of waiting for JavaScript: for content
   *  above the fold, which should show the moment the page arrives. */
  css?: boolean;
}) {
  const reduce = useReducedMotion();
  if (css) {
    const Plain = as;
    return (
      <Plain className={`${y ? "hero-in" : "fade-in"} ${className ?? ""}`} style={{ "--d": `${delay}s` } as CSSProperties}>
        {children}
      </Plain>
    );
  }
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}
