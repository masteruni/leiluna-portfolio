import Link from "next/link";
import type { CSSProperties } from "react";
import { recent } from "@/content/recent";
import { clients } from "@/content/site";

// "Trusted by": the brands we've worked with. Their logos are shown as one-colour marks (white on transparent PNGs in
// /public/clients/marks, used as a mask so CSS sets the colour). Each links to Recent work. Driven by `clients` in
// src/content/site.ts. (Worded as "Trusted by", never "now working with": the site doesn't say which clients are
// current.) The list is given once as plain links for screen readers; the decorative copies are hidden from them.
export type TrustedStyle = "spotlight" | "orbit" | "outline" | "cards" | "sweep";
type Client = (typeof clients)[number];

const href = recent.length ? "/#recent" : "/#work";
const label = (c: Client) => ("short" in c && c.short ? c.short : c.name);

// The client's logo as a one-colour mark, in the current text colour.
export function Mark({ c, className = "", style }: { c: Client; className?: string; style?: CSSProperties }) {
  const src = "mark" in c && c.mark ? c.mark : c.logo;
  return (
    <span
      aria-hidden
      className={`block shrink-0 bg-current ${className}`}
      style={{
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        ...style,
      }}
    />
  );
}

function Heading({ className = "" }: { className?: string }) {
  return <h2 className={`text-center font-display text-[clamp(1.9rem,3.6vw,3rem)] font-semibold tracking-[-0.03em] ${className}`}>Trusted by</h2>;
}

function ReaderList() {
  return (
    <ul className="sr-only">
      {clients.map((c) => (
        <li key={c.name}>
          <Link href={href}>{c.name}</Link>
        </li>
      ))}
    </ul>
  );
}

// A row that drifts sideways and loops: the set twice over, held twice, so moving it by half has no seam.
function Drift({ children, reverse = false, speed, className = "trust-mask" }: { children: React.ReactNode; reverse?: boolean; speed: number; className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className={`trust-drift flex w-max ${reverse ? "trust-drift-reverse" : ""}`} style={{ animationDuration: `${speed}s` }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0">
            {children}
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}

// the second row starts partway through the list, so the same brand doesn't sit above itself
const shifted = () => [...clients.slice(Math.ceil(clients.length / 2)), ...clients.slice(0, Math.ceil(clients.length / 2))];

export function TrustedBy({ variant = "spotlight" }: { variant?: TrustedStyle }) {
  if (!clients.length) return null;

  // 1. Spotlight: two rows drifting in opposite directions, dim at the edges and lit as they pass under a soft pink
  //    glow in the middle.
  if (variant === "spotlight") {
    const row = (list: Client[]) =>
      list.map((c, i) => (
        <Link key={`${c.name}-${i}`} href={href} tabIndex={-1} className="flex items-center gap-4 px-8 text-paper transition-colors duration-300 hover:text-accent sm:px-12">
          <Mark c={c} className="size-10 sm:size-12" />
          <span className="whitespace-nowrap font-display text-lg font-semibold tracking-[-0.02em] sm:text-xl">{label(c)}</span>
        </Link>
      ));
    return (
      <div className="relative">
        <Heading />
        <ReaderList />
        <div aria-hidden className="relative mt-10 md:mt-14">
          <div className="pointer-events-none absolute inset-x-[25%] inset-y-[-30%] bg-[radial-gradient(ellipse_at_center,rgb(234_106_142/0.22),transparent_65%)]" />
          <div className="space-y-8 md:space-y-10">
            <Drift speed={44} className="trust-spot">{row(clients)}</Drift>
            <Drift speed={52} reverse className="trust-spot">{row(shifted())}</Drift>
          </div>
        </div>
      </div>
    );
  }

  // 2. Orbit: the marks travel round "Trusted by" on a tilted ring, like moons. Still with reduced motion.
  if (variant === "orbit") {
    return (
      <div className="relative">
        <ReaderList />
        <div aria-hidden className="trust-ring relative mx-auto aspect-[2.4/1] w-full max-w-5xl max-sm:aspect-[1.4/1]">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
            <ellipse cx="50" cy="50" rx="46" ry="38" fill="none" stroke="var(--line)" vectorEffect="non-scaling-stroke" />
            <ellipse cx="50" cy="50" rx="46" ry="38" fill="none" stroke="var(--brand)" strokeOpacity="0.5" strokeDasharray="2 10" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <Heading className="text-[clamp(2.4rem,5vw,4.4rem)]!" />
              <Link href={href} className="pointer-events-auto mt-3 inline-block text-sm text-paper/60 transition-colors hover:text-paper">
                See their work →
              </Link>
            </div>
          </div>
          {clients.map((c, i) => (
            <Link
              key={c.name}
              href={href}
              tabIndex={-1}
              className="trust-orbit group absolute left-0 top-0 z-10 flex flex-col items-center gap-2 text-paper transition-colors hover:text-accent"
              style={{ animationDelay: `${(-60 / clients.length) * i}s` }}
            >
              <span className="grid size-16 place-items-center rounded-full border border-line bg-ink sm:size-20">
                <Mark c={c} className="size-9 sm:size-11" />
              </span>
              <span className="whitespace-nowrap text-xs text-paper/60 group-hover:text-paper max-sm:hidden">{label(c)}</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // 3. Big names: the names set huge and faint, drifting past with each mark between in pink; hovering lights a name.
  if (variant === "outline") {
    return (
      <div>
        <Heading />
        <ReaderList />
        <div aria-hidden className="mt-10 md:mt-14">
          <Drift speed={50}>
            {clients.map((c, i) => (
              <Link key={`${c.name}-${i}`} href={href} tabIndex={-1} className="group flex items-center gap-8 px-6 sm:gap-10 sm:px-8">
                <Mark c={c} className="size-12 text-brand sm:size-16" />
                <span className="trust-outline whitespace-nowrap font-display text-[clamp(3rem,7vw,6.5rem)] font-bold leading-none tracking-[-0.04em]">
                  {label(c)}
                </span>
              </Link>
            ))}
          </Drift>
        </div>
      </div>
    );
  }

  // 4. Cards: still. One tall card per brand, its mark large in the middle; on hover a pink glow rises behind it.
  if (variant === "cards") {
    return (
      <div>
        <Heading />
        <ul className="mt-10 grid grid-cols-2 gap-3 md:mt-14 lg:grid-cols-4 lg:gap-4">
          {clients.map((c) => (
            <li key={c.name}>
              <Link
                href={href}
                className="group relative flex aspect-[4/5] flex-col overflow-hidden rounded-3xl border border-line bg-ink-2/60 p-5 transition-colors duration-500 hover:border-brand/50 sm:p-6"
              >
                <span aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 translate-y-1/3 bg-[radial-gradient(ellipse_at_bottom,rgb(234_106_142/0.35),transparent_70%)] opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100" />
                <span className="relative grid flex-1 place-items-center">
                  <Mark c={c} className="size-20 text-paper/85 transition duration-500 group-hover:scale-105 group-hover:text-paper sm:size-24" />
                </span>
                <span className="relative flex items-end justify-between gap-3">
                  <span className="font-display text-base font-semibold leading-tight tracking-[-0.02em] sm:text-lg">{c.name}</span>
                  <span aria-hidden className="text-paper/40 transition group-hover:translate-x-0.5 group-hover:text-accent">→</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // 5. Sweep: still. The marks large in one line, with a pink light passing across them every few seconds; the
  //    names sit quietly underneath.
  return (
    <div>
      <Heading />
      <ul className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-y-10 md:mt-14 lg:grid-cols-4">
        {clients.map((c, i) => (
          <li key={c.name} className="lg:border-l lg:border-line lg:first:border-l-0">
            <Link href={href} className="group flex flex-col items-center gap-4 text-center">
              <Mark c={c} className="trust-sweep size-20 sm:size-24" style={{ animationDelay: `${i * 0.18}s` }} />
              <span className="text-sm text-paper/55 transition-colors group-hover:text-paper">{label(c)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
