// The lit part of a waxing moon (light on the right), `k` = how much of it is lit, 0 (new) to 1 (full).
// The right half of the disc, closed by the terminator: an ellipse whose width shrinks to 0 at half moon.
function litPath(k: number) {
  const r = 40;
  const rx = Math.abs(1 - 2 * k) * r;
  const sweep = k < 0.5 ? 0 : 1; // crescent: terminator bows right; gibbous: it bows left
  return `M50 ${50 - r} A${r} ${r} 0 0 1 50 ${50 + r} A${rx} ${r} 0 0 ${sweep} 50 ${50 - r}Z`;
}

// A small moon, `lit` (0 to 1) of it lit in the accent colour; the rest is a faint outline in the text colour.
// Used where a phase stands for real progress (the intro fills it as the page loads).
export function MoonPhase({ lit, className = "" }: { lit: number; className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={`shrink-0 ${className}`} aria-hidden>
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="5" />
      <path d={litPath(lit)} fill="var(--accent)" />
    </svg>
  );
}
