"use client";

import Link from "next/link";
import { useEffect } from "react";

// Shown if a page throws at runtime. Same tone as the 404: calm, on-brand, with a way back.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="relative grid min-h-dvh place-items-center overflow-hidden px-5 text-center">
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 size-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ boxShadow: "inset -2.5vmin 1.5vmin 0 0 var(--brand), 0 0 120px -30px var(--brand)" }}
      />
      <div className="relative">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">Something slipped out of orbit</p>
        <h1 className="mt-6 font-display text-[clamp(3rem,11vw,9rem)] font-bold leading-[0.85] tracking-[-0.05em]">
          That didn&apos;t
          <br />
          <span className="serif font-normal text-accent">load right.</span>
        </h1>
        <p className="mx-auto mt-8 max-w-sm text-paper/60">Nothing you did. Try again, or head back to the studio.</p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={reset} className="rounded-full bg-paper px-7 py-4 font-medium text-ink transition-colors hover:bg-brand hover:text-on-brand">
            Try again
          </button>
          <Link href="/" className="rounded-full border border-line px-7 py-4 font-medium text-paper transition-colors hover:border-paper">
            Back to the studio
          </Link>
        </div>
        {error.digest && <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.25em] text-muted">Ref {error.digest}</p>}
      </div>
    </main>
  );
}
