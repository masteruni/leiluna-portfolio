// Where the page ends and the night returns for the finale: the mirror of the horizon under the hero. There the page
// rises into the dark like the top of a moon; here its lower limb curves away and the night of the contact section
// shows beneath it, with the same soft pink rim along the edge. In dark mode both sides are the night already, so
// only the rim shows; in light mode it replaces a hard straight seam. Pure SVG, nothing moves.
// `tuck` pulls it up into the empty foot of the section above (both are the page's colour there), so it adds little
// height; leave it off where the content above runs right to its edge.
export function Dusk({ tuck = false }: { tuck?: boolean }) {
  return (
    <div aria-hidden className={`pointer-events-none relative z-10 ${tuck ? "-mt-[clamp(1.5rem,4vw,4rem)]" : "mt-8"}`}>
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block h-[clamp(3.5rem,8vw,7.5rem)] w-full">
        <defs>
          <linearGradient id="dusk-rim" x1="0" x2="1">
            <stop offset="0" stopColor="var(--brand)" stopOpacity="0" />
            <stop offset="0.5" stopColor="var(--brand-2)" />
            <stop offset="1" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* the night of the contact section (its colour in both themes) */}
        <rect width="1440" height="121" fill="#050506" />
        {/* the page, ending in a curve */}
        <path d="M0 -1 H1440 V0 Q720 236 0 0 Z" className="horizon-moon" />
        <path d="M0 0 Q720 236 1440 0" fill="none" stroke="url(#dusk-rim)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
