"use client";

import Link from "next/link";
import { Crescent } from "@/components/Crescent";
import { useEffect } from "react";

// Shown if a page throws at runtime. Same tone as the 404: calm, on-brand, with a way back.
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="relative grid min-h-dvh place-items-center overflow-hidden px-5 text-center">
      <Crescent className="absolute left-1/2 top-1/2 size-[60vmin] -translate-x-1/2 -translate-y-1/2" color="var(--brand)" dx={-4.2} dy={2.5} />
      <div className="relative">
        <h1 className="font-display text-[clamp(3rem,11vw,9rem)] font-bold leading-[0.85] tracking-[-0.05em]">
          That didn&apos;t
          <br />
          load right.
        </h1>
        <p className="mx-auto mt-8 max-w-sm text-paper/70">Something slipped out of orbit, and nothing you did. Try again, or head back to the studio.</p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={reset} className="rounded-full bg-paper px-7 py-4 font-medium text-ink transition-colors hover:bg-brand">
            Try again
          </button>
          <Link href="/" className="rounded-full px-7 py-4 font-medium text-paper transition-colors bg-paper/[0.07] hover:bg-paper/15">
            Back to the studio
          </Link>
        </div>
        {error.digest && <p className="mt-10 text-sm text-muted">Ref {error.digest}</p>}
      </div>
    </main>
  );
}
