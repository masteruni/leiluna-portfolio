import Image from "next/image";
import { Fragment } from "react";
import Link from "next/link";
import { recent } from "@/content/recent";
import { clients } from "@/content/site";

// "Trusted by": the brands we've worked with, under the studio statement. Grey until hovered, then in colour; links
// to Recent work. Driven by `clients` in src/content/site.ts. (Worded as "Trusted by", never "now working with": the
// site doesn't say which clients are current.) Decorative copies in the moving rows are hidden from screen readers.
export type TrustedStyle = "drift" | "serif" | "grid" | "sentence" | "chips";

const href = recent.length ? "/#recent" : "/#work";
const label = (c: (typeof clients)[number]) => ("short" in c && c.short ? c.short : c.name);

function Logo({ c, size = 28, className = "" }: { c: (typeof clients)[number]; size?: number; className?: string }) {
  return (
    <Image
      src={c.logo}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className={`shrink-0 rounded-full object-cover opacity-75 grayscale transition duration-300 group-hover/item:opacity-100 group-hover/item:grayscale-0 ${className}`}
    />
  );
}

// A row that drifts sideways and loops: the set repeats enough times to fill a wide screen, twice over.
function Drift({ children, reverse = false, speed = 40 }: { children: React.ReactNode; reverse?: boolean; speed?: number }) {
  return (
    <div className="trust-mask overflow-hidden">
      <div className={`trust-drift flex w-max ${reverse ? "trust-drift-reverse" : ""}`} style={{ animationDuration: `${speed}s` }}>
        {[0, 1].map((copy) => (
          <div key={copy} aria-hidden={copy ? true : undefined} className="flex shrink-0">
            {children}
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

function Kicker({ className = "" }: { className?: string }) {
  return <p className={`text-[11px] uppercase tracking-[0.24em] text-paper/45 ${className}`}>Trusted by</p>;
}

export function TrustedBy({ variant = "drift" }: { variant?: TrustedStyle }) {
  if (!clients.length) return null;

  // 1. Two rows drifting in opposite directions, logo and name, faded at both edges.
  if (variant === "drift") {
    const item = (c: (typeof clients)[number], i: number) => (
      <Link key={`${c.name}-${i}`} href={href} className="group/item flex items-center gap-3 px-7 text-lg text-paper/50 transition-colors hover:text-paper sm:px-10 sm:text-xl">
        <Logo c={c} size={30} />
        <span className="whitespace-nowrap font-display font-medium tracking-[-0.02em]">{label(c)}</span>
      </Link>
    );
    return (
      <div>
        <Kicker className="mb-8" />
        <div className="space-y-6">
          <Drift>{clients.map(item)}</Drift>
          <Drift reverse speed={46}>{[...clients].reverse().map(item)}</Drift>
        </div>
      </div>
    );
  }

  // 2. One slow row of names set large in the serif, parted by small crescents.
  if (variant === "serif") {
    const item = (c: (typeof clients)[number], i: number) => (
      <span key={`${c.name}-${i}`} className="flex items-center">
        <Link href={href} className="group/item serif whitespace-nowrap px-6 text-[clamp(2rem,4vw,3.4rem)] italic leading-none text-paper/35 transition-colors duration-300 hover:text-accent sm:px-9">
          {label(c)}
        </Link>
        <span aria-hidden className="size-3 rounded-full shadow-[inset_-4px_-2px_0_0_var(--brand)]" />
      </span>
    );
    return (
      <div>
        <Kicker className="mb-6" />
        <Drift speed={60}>{clients.map(item)}</Drift>
      </div>
    );
  }

  // 3. Still: a ruled grid, one brand per cell, logo above name. Nothing moves.
  if (variant === "grid") {
    return (
      <div>
        <Kicker className="mb-5" />
        <ul className="grid grid-cols-2 border-l border-t border-line lg:grid-cols-4">
          {clients.map((c) => (
            <li key={c.name} className="border-b border-r border-line">
              <Link href={href} className="group/item flex h-full flex-col gap-5 p-5 text-paper/55 transition-colors duration-300 hover:bg-paper/[0.03] hover:text-paper sm:p-7">
                <Logo c={c} size={44} />
                <span className="font-display text-lg font-medium leading-tight tracking-[-0.02em]">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // 4. Still: a sentence that carries on from the statement, with each brand's logo set into the line.
  if (variant === "sentence") {
    return (
      <p className="max-w-4xl font-display text-[clamp(1.4rem,2.6vw,2.4rem)] font-medium leading-[1.35] tracking-[-0.025em] text-paper/40">
        Trusted by{" "}
        {clients.map((c, i) => (
          <Fragment key={c.name}>
          <span className="whitespace-nowrap">
            <Link href={href} className="group/item inline-flex items-center gap-2 align-middle text-paper/75 transition-colors hover:text-paper">
              <Logo c={c} size={34} className="inline-block" />
              <span>{label(c)}</span>
            </Link>
            {i < clients.length - 1 ? "," : "."}
          </span>
          {i === clients.length - 2 ? " and " : " "}
          </Fragment>
        ))}
        <Link href={href} className="whitespace-nowrap text-accent underline decoration-accent/40 underline-offset-[0.2em] transition hover:decoration-accent">
          See their work
        </Link>
      </p>
    );
  }

  // 5. One row of outlined chips drifting by, with a still link at the end.
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-8">
      <Kicker className="shrink-0" />
      <div className="min-w-0 flex-1">
        <Drift speed={36}>
          {clients.map((c, i) => (
            <Link
              key={`${c.name}-${i}`}
              href={href}
              className="group/item mr-3 flex items-center gap-2.5 rounded-full border border-line py-1.5 pl-1.5 pr-5 text-paper/60 transition-colors hover:border-brand/60 hover:text-paper"
            >
              <Logo c={c} size={30} />
              <span className="whitespace-nowrap">{label(c)}</span>
            </Link>
          ))}
        </Drift>
      </div>
      <Link href={href} className="shrink-0 text-sm text-paper/70 transition-colors hover:text-paper">
        See their work →
      </Link>
    </div>
  );
}
