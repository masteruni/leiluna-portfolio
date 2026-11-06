"use client";

import Image from "next/image";
import Link from "next/link";
import { clients } from "@/content/site";
import { useAnchor } from "@/lib/anchor";

// Social proof at the moment of decision: sits right under a "Start a project" button and names brands we've worked
// with, as a row of overlapping client logos. It links to Recent work, where their latest pieces are. (Worded as
// "Trusted by", never "now working with": the site doesn't say which clients are current.)
// Driven by `clients` in src/content/site.ts (newest first), so it stays current as clients change.
export function TrustLine({ align = "start", className = "" }: { align?: "start" | "center"; className?: string }) {
  const anchor = useAnchor();
  if (!clients.length) return null;
  const [a, b] = clients.map((c) => ("short" in c && c.short ? c.short : c.name));
  const rest = clients.length - 2;
  const names = clients.length === 1 ? a : rest > 0 ? `${a}, ${b} and ${rest} more` : `${a} and ${b}`;

  return (
    <Link
      href="/#recent"
      onClick={anchor}
      className={`group inline-flex items-center gap-3 text-sm text-paper/60 transition-colors hover:text-paper pointer-coarse:min-h-11 ${
        align === "center" ? "flex-col justify-center text-center sm:flex-row sm:text-left" : ""
      } ${className}`}
    >
      <span className="flex shrink-0 -space-x-2">
        {clients.slice(0, 4).map((c) => (
          <Image
            key={c.name}
            src={c.logo}
            alt=""
            width={28}
            height={28}
            className="size-7 rounded-full object-cover ring-2 ring-ink transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-0.5 first:group-hover:translate-x-0"
          />
        ))}
      </span>
      <span>
        Trusted by <span className="text-paper/85 group-hover:text-paper">{names}</span>
      </span>
    </Link>
  );
}
