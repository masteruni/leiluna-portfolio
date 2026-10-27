import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-line px-5 pt-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 text-sm text-muted sm:flex-row">
        <p>
          © {site.fullName}. Designed &amp; built with intention.
        </p>
        <Link href="/#" className="transition hover:text-paper">
          Back to top ↑
        </Link>
      </div>
      <p
        aria-hidden
        className="mt-6 select-none text-center font-display text-[24vw] font-bold leading-[0.75] tracking-[-0.05em] text-ink-3"
      >
        {site.name}
      </p>
    </footer>
  );
}
