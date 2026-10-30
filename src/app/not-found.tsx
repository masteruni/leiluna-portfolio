import Link from "next/link";
import { Nav } from "@/components/Nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="relative grid min-h-dvh place-items-center overflow-hidden px-5 text-center">
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 size-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ boxShadow: "inset 2.5vmin -1.5vmin 0 0 var(--brand), 0 0 120px -30px var(--brand)" }}
        />
        <div className="relative">
          <p className="text-sm text-brand">404 · Lost in space</p>
          <h1 className="mt-6 font-display text-[clamp(3rem,11vw,9rem)] font-bold leading-[0.85] tracking-[-0.05em]">
            This page
            <br />
            <span className="serif font-normal text-brand">left orbit.</span>
          </h1>
          <Link
            href="/"
            className="mt-12 inline-block rounded-full bg-paper px-7 py-4 font-medium text-ink transition-colors hover:bg-brand"
          >
            Back to the studio
          </Link>
        </div>
      </main>
    </>
  );
}
