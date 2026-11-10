"use client";

import { motion, type SVGMotionProps } from "motion/react";
import { useId } from "react";

// One half of the Leiluna mark, drawn the way the logo is built: a disc with a smaller disc bitten out of it.
// "paper" is the large light crescent, "brand" the pink one that locks inside it; stack the two in the same box
// and they make the mark. Each is its own SVG so it can be moved on its own (the intro spins them together, the
// founders section brings them together on scroll). The light one follows the text colour, so it turns to ink on
// the light theme, like the mark itself.
const shapes = {
  paper: { disc: [44, 44, 38], bite: [55, 47, 33], fill: "var(--paper)" },
  brand: { disc: [60, 60, 33], bite: [51, 56, 27], fill: "var(--brand)" },
} as const;

export function Crescent({ tone, ...props }: { tone: keyof typeof shapes } & SVGMotionProps<SVGSVGElement>) {
  const id = `crescent-${useId().replace(/:/g, "")}`;
  const { disc, bite, fill } = shapes[tone];
  return (
    <motion.svg viewBox="0 0 100 100" aria-hidden {...props}>
      <defs>
        <mask id={id}>
          <rect width="100" height="100" fill="white" />
          <circle cx={bite[0]} cy={bite[1]} r={bite[2]} fill="black" />
        </mask>
      </defs>
      <circle cx={disc[0]} cy={disc[1]} r={disc[2]} fill={fill} mask={`url(#${id})`} />
    </motion.svg>
  );
}
