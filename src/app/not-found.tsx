import Link from "next/link";
import { Nav } from "@/components/Nav";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="grid min-h-dvh place-items-center px-5 text-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">Error 404</p>
          <h1 className="mt-4 font-display text-[clamp(3rem,12vw,9rem)] font-bold leading-[0.85] tracking-[-0.04em]">
            This post
            <br />
            <span className="text-outline">was deleted.</span>
          </h1>
          <Link
            href="/"
            className="mt-10 inline-block rounded-full bg-paper px-6 py-3.5 font-medium text-ink transition hover:bg-brand-2"
          >
            Back to the feed
          </Link>
        </div>
      </main>
    </>
  );
}
