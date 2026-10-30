import Link from "next/link";
import { Crescent } from "@/components/Crescent";
import { Nav } from "@/components/Nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="relative grid min-h-dvh place-items-center overflow-hidden px-5 text-center">
        <Crescent className="absolute left-1/2 top-1/2 size-[60vmin] -translate-x-1/2 -translate-y-1/2" color="var(--brand)" dx={4.2} dy={-2.5} />
        <div className="relative">
          <h1 className="font-display text-[clamp(3rem,11vw,9rem)] font-bold leading-[0.85] tracking-[-0.05em]">
            This page
            <br />
            left orbit.
          </h1>
          <p className="mx-auto mt-8 max-w-sm text-paper/70">Error 404: there&apos;s nothing at this address any more.</p>
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
