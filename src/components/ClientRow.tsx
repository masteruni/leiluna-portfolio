import Image from "next/image";
import Link from "next/link";
import { recent } from "@/content/recent";
import { clients } from "@/content/site";

// The brands we've worked with, as a quiet row of grey logos and names under the hero's numbers; they take their
// colour on hover. Links to Recent work. Driven by `clients` in src/content/site.ts. (Worded as "Trusted by", never
// "now working with": the site doesn't say which clients are current.)
export function ClientRow() {
  if (!clients.length) return null;
  return (
    <Link
      href={recent.length ? "/#recent" : "/#work"}
      className="group flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-paper/55 transition-colors duration-300 hover:text-paper/85"
    >
      <span className="flex items-center gap-4 max-sm:basis-full max-sm:justify-center">
        <span className="text-[11px] uppercase tracking-[0.24em] text-paper/40">Trusted by</span>
        <span aria-hidden className="h-px w-10 bg-line max-sm:hidden" />
      </span>
      {clients.map((c) => (
        <span key={c.name} className="flex items-center gap-2">
          <Image
            src={c.logo}
            alt=""
            width={22}
            height={22}
            className="size-[22px] rounded-full object-cover opacity-80 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
          />
          <span className="whitespace-nowrap">{"short" in c && c.short ? c.short : c.name}</span>
        </span>
      ))}
    </Link>
  );
}
