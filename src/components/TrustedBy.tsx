import Image from "next/image";
import Link from "next/link";
import { recent } from "@/content/recent";
import { clients } from "@/content/site";

// "Trusted by": the brands we've worked with, as two rows of logos and names drifting past in opposite directions,
// faded at both edges. Grey until hovered, then in colour; each links to Recent work. Driven by `clients` in
// src/content/site.ts. (Worded as "Trusted by", never "now working with": the site doesn't say which clients are
// current.) The list is also given once as plain links for screen readers; the moving rows are hidden from them.
type Client = (typeof clients)[number];
const href = recent.length ? "/#recent" : "/#work";
const label = (c: Client) => ("short" in c && c.short ? c.short : c.name);

function Item({ c }: { c: Client }) {
  return (
    <Link
      href={href}
      tabIndex={-1}
      className="group/item flex items-center gap-3 px-7 text-paper/55 transition-colors duration-300 hover:text-paper sm:px-10"
    >
      <Image
        src={c.logo}
        alt=""
        width={32}
        height={32}
        className="size-8 shrink-0 rounded-full object-cover opacity-80 grayscale transition duration-300 group-hover/item:opacity-100 group-hover/item:grayscale-0"
      />
      <span className="whitespace-nowrap font-display text-lg font-semibold tracking-[-0.02em] sm:text-xl">{label(c)}</span>
    </Link>
  );
}

// One row: the set repeated enough to fill a wide screen, held twice so moving it by half loops without a seam.
function Row({ list, reverse = false, speed }: { list: Client[]; reverse?: boolean; speed: number }) {
  const set = [...list, ...list];
  return (
    <div className="trust-mask overflow-hidden">
      <div className={`trust-drift flex w-max ${reverse ? "trust-drift-reverse" : ""}`} style={{ animationDuration: `${speed}s` }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {set.map((c, i) => (
              <Item key={`${c.name}-${i}`} c={c} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TrustedBy() {
  if (!clients.length) return null;
  // the second row starts partway through the list, so the same brand doesn't sit above itself
  const shifted = [...clients.slice(Math.ceil(clients.length / 2)), ...clients.slice(0, Math.ceil(clients.length / 2))];
  return (
    <div>
      <h2 className="text-center font-display text-[clamp(1.9rem,3.6vw,3rem)] font-semibold tracking-[-0.03em]">Trusted by</h2>
      <ul className="sr-only">
        {clients.map((c) => (
          <li key={c.name}>
            <Link href={href}>{c.name}</Link>
          </li>
        ))}
      </ul>
      <div aria-hidden className="mt-10 space-y-7 md:mt-14 md:space-y-9">
        <Row list={clients} speed={44} />
        <Row list={shifted} reverse speed={52} />
      </div>
    </div>
  );
}
