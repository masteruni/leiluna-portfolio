"use client";

import Image from "next/image";
import Link from "next/link";
import { recent } from "@/content/recent";
import { clients } from "@/content/site";
import { useAnchor } from "@/lib/anchor";

// The brands we've worked with as a slow strip of logos and names that loops (it pauses under the mouse and stays
// still with reduced motion). It links to Recent work. Driven by `clients` in src/content/site.ts. (Worded as
// "Trusted by", never "now working with": the site doesn't say which clients are current.)
export function ClientLoop({ className = "" }: { className?: string }) {
  const anchor = useAnchor();
  if (!clients.length) return null;
  const run = (copy: number) =>
    clients.map((c) => (
      <span key={`${copy}-${c.name}`} aria-hidden={copy ? true : undefined} className="flex shrink-0 items-center gap-2.5 pr-10">
        <Image src={c.logo} alt="" width={28} height={28} className="size-7 rounded-full object-cover ring-1 ring-line" />
        <span className="whitespace-nowrap">{c.name}</span>
      </span>
    ));
  return (
    <Link
      href={recent.length ? "/#recent" : "/#work"}
      onClick={anchor}
      className={`client-loop group flex w-full min-w-0 items-center gap-5 text-sm text-paper/70 transition-colors hover:text-paper ${className}`}
    >
      <span className="shrink-0 text-[11px] uppercase tracking-[0.24em] text-paper/45">Trusted by</span>
      <span className="min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <span className="client-loop-track flex w-max">
          {run(0)}
          {run(1)}
        </span>
      </span>
    </Link>
  );
}
