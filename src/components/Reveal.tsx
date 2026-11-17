"use client";

import { motion } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 0, // fade only by default: content sliding up section after section reads as a template
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
    // With reduced motion the content is simply there: the hidden start is switched off in CSS rather than left out
    // of the markup, so the server's HTML and the browser's always match.
    <Tag
      className={`motion-reduce:opacity-100! motion-reduce:transform-none! ${className ?? ""}`}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
}
