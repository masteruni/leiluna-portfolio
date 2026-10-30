import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Starfield } from "@/components/Starfield";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="night relative grid min-h-dvh place-items-center overflow-hidden px-5 text-center">
        <Starfield />
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 size-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
          style={{ boxShadow: "inset 2.5vmin -1.5vmin 0 0 var(--brand), 0 0 120px -30px var(--brand)" }}
        />
        <div className="relative">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-brand">404 · Lost in space</p>
          <h1 className="mt-6 font-display text-[clamp(3rem,11vw,9rem)] font-bold leading-[0.85] tracking-[-0.05em]">
            This page
            <br />
            <span className="serif font-normal text-brand">left orbit.</span>
          </h1>
          <Link
            href="/"
            className="mt-12 inline-block rounded-full bg-paper px-7 py-4 font-medium text-ink transition-colors hover:bg-brand hover:text-on-brand"
          >
            Back to the studio
          </Link>
        </div>
      </main>
    </>
  );
}
