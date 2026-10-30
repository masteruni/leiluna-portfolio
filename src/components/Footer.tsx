"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { useLenis } from "lenis/react";
import { profileLinks, site } from "@/content/site";
import { useAnchor } from "@/lib/anchor";

const explore = [
  { href: "/#work", label: "Work" },
  { href: "/#library", label: "Library" },
  { href: "/#services", label: "Services" },
  { href: "/#studio", label: "Studio" },
  { href: "/#contact", label: "Contact" },
];

// The year is read on the client only: a prerendered page may not read the clock (cacheComponents).
const noSubscribe = () => () => {};
const currentYear = () => new Date().getFullYear();
const noYear = () => null;

// The last chapter: a full rose field whose headline is the way to get in touch.
export function Footer() {
  const lenis = useLenis();
  const anchor = useAnchor();
  const year = useSyncExternalStore(noSubscribe, currentYear, noYear);
  const [user, domain] = site.email.split("@");

  return (
    <footer data-chapter="rose" className="ch-field ch-rose relative z-10 flex min-h-[90svh] flex-col px-5 pt-10 sm:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-start justify-between gap-x-10 gap-y-6 text-[15px]">
        <div className="max-w-sm">
          <p className="font-display text-lg font-semibold tracking-tight">leiluna studio</p>
          <p className="mt-2">{site.description}</p>
        </div>
        <p className="max-w-[16rem]">
          {site.location}. We reply to every brief within {site.replyTime}.
        </p>
        <button
          type="button"
          onClick={() => (lenis ? lenis.scrollTo(0, { duration: 2 }) : window.scrollTo({ top: 0 }))}
          className="underline-offset-4 hover:underline"
        >
          Back to the top ↑
        </button>
      </div>

      <div className="mx-auto mt-auto w-full max-w-7xl pt-24">
        <a
          href={`mailto:${site.email}`}
          className="group block font-display text-[clamp(2.75rem,10.5vw,10rem)] font-bold leading-[0.9] tracking-[-0.05em]"
        >
          <span className="block">{user}</span>
          <span className="block transition-transform duration-500 ease-[var(--ease-out)] group-hover:translate-x-4">@{domain}</span>
        </a>

        <div className="mt-12 grid gap-4 py-8 text-sm sm:grid-cols-3 sm:items-end">
          <nav aria-label="Footer" className="flex flex-wrap gap-x-5 gap-y-2">
            {explore.map((l) => (
              <Link key={l.href} href={l.href} onClick={anchor} className="underline-offset-4 hover:underline">
                {l.label}
              </Link>
            ))}
            {profileLinks.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                {s.label} ↗
              </a>
            ))}
          </nav>
          <p className="sm:text-center">Your story. Our creative orbit.</p>
          <p className="sm:text-right">
            © {year ? `${year} ` : ""}
            {site.name}. All work shown is protected.
          </p>
        </div>
      </div>
    </footer>
  );
}
