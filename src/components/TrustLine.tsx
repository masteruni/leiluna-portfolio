"use client";

import Link from "next/link";
import { recent } from "@/content/recent";
import { clients } from "@/content/site";
import { useAnchor } from "@/lib/anchor";
import { AnimatedTooltip } from "./ui/animated-tooltip";

// Social proof at the moment of decision: sits right under a "Start a project" button and names brands we've worked
// with, as a row of overlapping client logos. It links to Recent work, where their latest pieces are. (Worded as
// "Trusted by", never "now working with": the site doesn't say which clients are current.)
// Driven by `clients` in src/content/site.ts (newest first), so it stays current as clients change.
// The line only has room to name two of them; with a mouse, each logo names its brand in a tooltip.
export function TrustLine({ align = "start", className = "" }: { align?: "start" | "center"; className?: string }) {
  const anchor = useAnchor();
  if (!clients.length) return null;
  const [a, b] = clients.map((c) => ("short" in c && c.short ? c.short : c.name));
  const rest = clients.length - 2;
  const names = clients.length === 1 ? a : rest > 0 ? `${a}, ${b} and ${rest} more` : `${a} and ${b}`;

  return (
    <Link
      href={recent.length ? "/#recent" : "/#work"}
      onClick={anchor}
      className={`group inline-flex items-center gap-3 text-sm text-paper/60 transition-colors hover:text-paper pointer-coarse:min-h-11 ${
        align === "center" ? "flex-col justify-center text-center sm:flex-row sm:text-left" : ""
      } ${className}`}
    >
      <AnimatedTooltip
        items={clients.slice(0, 4).map((c) => ({ name: c.name, image: c.logo }))}
        className="shrink-0 -space-x-2"
        itemClassName="transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-0.5 first:group-hover:translate-x-0"
        imageClassName="size-7 ring-2 ring-ink"
      />
      <span>
        Trusted by <span className="text-paper/85 group-hover:text-paper">{names}</span>
      </span>
    </Link>
  );
}
