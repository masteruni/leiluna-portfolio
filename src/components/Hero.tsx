import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { site } from "@/content/site";
import { PhoneReel } from "./PhoneReel";
import { Reveal } from "./Reveal";
import { RoleTicker } from "./RoleTicker";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-16 pt-32 sm:px-8 md:pt-40">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--brand-3), transparent)" }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.35fr_1fr]">
        <div>
          <Reveal>
            {site.available && (
              <p className="mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-ink-2/60 px-3 py-1.5 text-xs text-paper/80">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-2 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-brand-2" />
                </span>
                Open for new projects · {site.location}
              </p>
            )}
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="font-display text-[clamp(3.5rem,13vw,10rem)] font-bold leading-[0.82] tracking-[-0.04em]">
              {site.name}
              <span className="text-brand">.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-6 font-display text-2xl font-medium leading-tight sm:text-3xl">
              <RoleTicker roles={site.roles} />
            </p>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              <span className="text-paper">{site.tagline}</span> Strategy, short-form video and design under one roof,
              built for the feed and backed by the numbers.
            </p>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/#work"
                className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3.5 font-medium text-ink transition hover:bg-brand-2"
              >
                See the work
                <ArrowDownRight size={18} className="transition-transform group-hover:rotate-[-45deg]" />
              </Link>
              <Link
                href="/#contact"
                className="rounded-full border border-line px-6 py-3.5 font-medium transition hover:border-paper/40 hover:bg-paper/5"
              >
                Start a project
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} y={40}>
          <PhoneReel />
        </Reveal>
      </div>
    </section>
  );
}
