"use client";

import Image from "next/image";

// A spinning sticker: text runs around a ring with the Leiluna mark in the middle.
export function OrbitBadge({ text, second, className = "" }: { text: string; second?: string; className?: string }) {
  const ring = `${text} ✦ ${second ?? text} ✦ `.toUpperCase();
  const circumference = 2 * Math.PI * 38;
  return (
    <div className={`relative size-32 sm:size-36 ${className}`} role="img" aria-label={second ? `${text}. ${second}` : text}>
      <svg viewBox="0 0 100 100" className="animate-spin-badge absolute inset-0 size-full" aria-hidden>
        <defs>
          <path id="orbit-badge-ring" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
        </defs>
        <circle cx="50" cy="50" r="48" fill="none" stroke="var(--line)" />
        {/* textLength stretches the spacing so the sentence closes the circle exactly */}
        <text fill="var(--paper)" fontSize="7" textLength={circumference} lengthAdjust="spacing" fontFamily="var(--font-jetbrains), monospace">
          <textPath href="#orbit-badge-ring" startOffset="0" textLength={circumference}>
            {ring}
          </textPath>
        </text>
      </svg>
      <Image
        src="/brand/mark.png"
        alt=""
        width={44}
        height={46}
        className="absolute left-1/2 top-1/2 h-11 w-auto -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_0_18px_rgba(234,106,142,0.6)]"
      />
    </div>
  );
}
