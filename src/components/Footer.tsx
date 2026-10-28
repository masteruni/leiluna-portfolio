"use client";

import Image from "next/image";
import { useLenis } from "lenis/react";
import { site } from "@/content/site";

export function Footer() {
  const lenis = useLenis();
  return (
    <footer className="relative z-10 border-t border-line bg-ink px-5 pt-14 sm:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 text-sm md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="max-w-xs text-paper/60">{site.description}</p>
        </div>
        <ul className="space-y-2">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noreferrer" className="text-paper/70 transition-colors hover:text-brand">
                {s.label} ↗
              </a>
            </li>
          ))}
        </ul>
        <div className="space-y-2 md:text-right">
          <a href={`mailto:${site.email}`} className="block text-paper/70 hover:text-brand">
            {site.email}
          </a>
          <button
            type="button"
            onClick={() => (lenis ? lenis.scrollTo(0, { duration: 2 }) : window.scrollTo({ top: 0 }))}
            className="text-paper/70 hover:text-brand"
          >
            Back to orbit ↑
          </button>
        </div>
      </div>

      <div className="mx-auto mt-16 max-w-7xl">
        <Image
          src="/brand/wordmark.png"
          alt={site.name}
          width={1126}
          height={424}
          className="h-auto w-full select-none opacity-90"
        />
      </div>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 py-6 font-mono text-[10px] uppercase tracking-[0.25em] text-muted sm:flex-row sm:justify-between sm:gap-10">
        <span>© {site.name}. All work shown is protected and may not be downloaded or reused without permission.</span>
        <span>Your story. Our creative orbit.</span>
      </div>
    </footer>
  );
}
