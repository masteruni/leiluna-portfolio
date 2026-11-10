"use client";

import Link from "next/link";
import { founders } from "@/content/site";
import { useAnchor } from "@/lib/anchor";
import { AnimatedTooltip } from "./ui/animated-tooltip";

// Half of what the studio offers is who does the work: two founders, hands-on. This line says so in one glance,
// with their faces, right where a visitor decides (under the hero's buttons, and again at the contact section),
// and links to the founders section. A companion to TrustLine, which names the clients.
// Driven by `founders` in src/content/site.ts; it only shows once every founder has a photo.
export function FoundersLine({ align = "start", className = "" }: { align?: "start" | "center"; className?: string }) {
  const anchor = useAnchor();
  const people = founders.filter((f) => f.photo);
  if (!people.length || people.length !== founders.length) return null;
  const names = people.map((f) => f.name);
  const list = names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names[0];

  return (
    <Link
      href="/#founders"
      onClick={anchor}
      className={`group inline-flex items-center gap-3 text-sm text-paper/60 transition-colors hover:text-paper pointer-coarse:min-h-11 ${
        align === "center" ? "flex-col justify-center text-center sm:flex-row sm:text-left" : ""
      } ${className}`}
    >
      <AnimatedTooltip
        items={people.map((f) => ({ name: f.fullName, image: f.photo!, face: f.face }))}
        size={32}
        className="shrink-0 -space-x-2"
        itemClassName="transition-transform duration-300 ease-[var(--ease-out)] group-hover:translate-x-0.5 first:group-hover:translate-x-0"
        imageClassName="size-8 bg-brand-3 ring-2 ring-ink"
      />
      <span>
        You work directly with <span className="text-paper/85 group-hover:text-paper">{list}</span>
      </span>
    </Link>
  );
}
