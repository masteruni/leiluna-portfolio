"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useLenis } from "lenis/react";
import { useOverNight } from "@/lib/useOverNight";

// A tiny moon travels once around its orbit as you scroll the page. Click it to return to the top.
export function ScrollOrbit() {
  const lenis = useLenis();
  const { scrollYProgress } = useScroll();
  const angle = useTransform(scrollYProgress, [0, 1], [-90, 270]);
  const cx = useTransform(angle, (a) => 28 + 21 * Math.cos((a * Math.PI) / 180));
  const cy = useTransform(angle, (a) => 28 + 21 * Math.sin((a * Math.PI) / 180));
  const opacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);
  const dash = useTransform(scrollYProgress, (p) => 2 * Math.PI * 21 * (1 - p));
  // In light mode it takes on the night colours over the dark sections (its centre sits 52px above the bottom).
  const overNight = useOverNight(() => window.innerHeight - 52);

  return (
    <motion.button
      type="button"
      style={{ opacity }}
      onClick={() => (lenis ? lenis.scrollTo(0, { duration: 2 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
      aria-label="Back to top"
      data-cursor="Top"
      className={`${overNight ? "over-night" : ""} fixed bottom-6 right-6 z-[60] hidden size-14 rounded-full bg-ink/60 backdrop-blur-md transition-transform duration-500 ease-[var(--ease-out)] hover:scale-110 md:block`}
    >
      <svg viewBox="0 0 56 56" className="size-full overflow-visible" aria-hidden>
        <circle cx="28" cy="28" r="21" fill="none" stroke="var(--line)" />
        {/* the pink arc is the distance travelled so far */}
        <motion.circle
          cx="28"
          cy="28"
          r="21"
          fill="none"
          stroke="var(--brand)"
          strokeWidth="1.2"
          strokeDasharray={2 * Math.PI * 21}
          strokeDashoffset={dash}
          transform="rotate(-90 28 28)"
        />
        <circle cx="28" cy="28" r="5" fill="var(--ink)" stroke="var(--brand)" />
        <circle cx="26.5" cy="26.5" r="3.4" fill="var(--brand)" opacity="0.9" />
        <motion.circle cx={cx} cy={cy} r="3.2" fill="var(--paper)" />
      </svg>
    </motion.button>
  );
}
