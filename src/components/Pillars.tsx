import Image from "next/image";
import { services } from "@/content/site";

// Slow-drifting band of the five service pillars, alternating solid and outline type.
export function Pillars() {
  const row = [...services, ...services];
  return (
    <div className="overflow-hidden border-y border-line py-8" aria-hidden>
      <div className="animate-marquee flex w-max items-center gap-10 whitespace-nowrap font-display text-5xl font-semibold tracking-[-0.03em] sm:text-7xl">
        {row.map((s, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className={i % 2 ? "text-outline" : ""}>{s.short}</span>
            <Image src="/brand/mark.png" alt="" width={44} height={46} className="h-10 w-auto opacity-80 sm:h-12" />
          </span>
        ))}
      </div>
    </div>
  );
}
