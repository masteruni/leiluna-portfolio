import type { ReactNode } from "react";
import { sections, type SectionId } from "@/lib/sections";

// The lit part of a waxing moon (light on the right), `k` = how much of it is lit, 0 (new) to 1 (full).
// The right half of the disc, closed by the terminator: an ellipse whose width shrinks to 0 at half moon.
function litPath(k: number) {
  const r = 40;
  const rx = Math.abs(1 - 2 * k) * r;
  const sweep = k < 0.5 ? 0 : 1; // crescent: terminator bows right; gibbous: it bows left
  return `M50 ${50 - r} A${r} ${r} 0 0 1 50 ${50 + r} A${rx} ${r} 0 0 ${sweep} 50 ${50 - r}Z`;
}

// A small moon, `lit` (0 to 1) of it lit in the accent colour; the rest is a faint outline in the text colour.
export function MoonPhase({ lit, className = "" }: { lit: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`shrink-0 ${className}`} aria-hidden>
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="5" />
      <path d={litPath(lit)} fill="var(--accent)" />
    </svg>
  );
}

// The running head above every section, as a lunar calendar: a small moon that waxes from a thin crescent in
// the first section to full at the last, beside the section's name. Its phase follows the section's place on
// the page (see src/lib/sections.ts), so it can't drift when sections are added or moved.
export function Eyebrow({
  id,
  as: Tag = "p",
  className = "",
  children,
}: {
  id: SectionId;
  as?: "p" | "h2" | "span";
  className?: string;
  children?: ReactNode;
}) {
  const i = Math.max(
    sections.findIndex((s) => s.id === id),
    0,
  );
  const lit = (i + 1) / sections.length;
  const label = children ?? sections[i]?.label;
  return (
    <Tag className={`inline-flex items-center gap-3 font-serif text-xl font-normal italic leading-none text-muted ${className}`}>
      <MoonPhase lit={lit} className="size-[1.05em]" />
      <span>{label}</span>
    </Tag>
  );
}
