"use client";

import Image from "next/image";
import { services } from "@/content/site";
import { ScrollVelocity } from "./ScrollVelocity";

// The five service pillars drifting past; scrolling the page speeds the band up and turns it round.
export function Pillars() {
  const row = (
    <span className="inline-flex items-center gap-10">
      {services.map((s) => (
        <span key={s.id} className="inline-flex items-center gap-10">
          {s.short}
          <Image src="/brand/mark.png" alt="" width={44} height={46} className="h-10 w-auto opacity-80 sm:h-12" />
        </span>
      ))}
    </span>
  );
  return (
    <div data-chapter="night" className="py-8" aria-hidden>
      <ScrollVelocity
        texts={[row]}
        velocity={60}
        numCopies={4}
        gap={40}
        pauseOnHover
        fontSize="clamp(3rem, 6vw, 4.5rem)"
        fontWeight={600}
        scrollerClassName="items-center font-display"
      />
    </div>
  );
}
