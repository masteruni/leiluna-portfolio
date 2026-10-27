"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, useState } from "react";
import { site } from "@/content/site";
import { LineReveal } from "./LineReveal";
import { Magnetic } from "./Magnetic";

// The finale: a planet rises over the horizon while the call to action lands.
export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const rise = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["35%", "0%"]);
  const glow = useTransform(scrollYProgress, [0.3, 1], [0.2, 1]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${site.email}`;
    }
  };

  return (
    <section ref={ref} id="contact" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pb-40 pt-32 sm:px-10">
      {/* rising planet */}
      <motion.div aria-hidden style={{ y: rise }} className="pointer-events-none absolute left-1/2 top-[62%] w-[170vw] -translate-x-1/2 md:w-[130vw]">
        <motion.div
          style={{ opacity: glow }}
          className="aspect-square w-full rounded-full"
          // pink limb + atmosphere, like the header artwork
        >
          <div
            className="size-full rounded-full bg-ink"
            style={{
              boxShadow:
                "0 -1px 0 0 var(--brand-2), 0 -10px 40px -4px var(--brand), 0 -60px 160px -20px rgb(234 106 142 / 0.45), inset 0 30px 80px -40px rgb(234 106 142 / 0.6)",
            }}
          />
        </motion.div>
      </motion.div>

      <div className="relative mx-auto w-full max-w-7xl text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted">
          <span className="text-brand">(08)</span> Contact
        </p>
        <h2 className="mt-8 font-display text-[clamp(3.6rem,12vw,12rem)] font-bold leading-[0.85] tracking-[-0.05em]">
          <LineReveal
            inView
            lines={["Let's build", <span key="b">your <span className="serif font-normal text-brand">brand.</span></span>]}
          />
        </h2>
        <p className="mx-auto mt-8 max-w-md text-lg text-paper/60">
          Tell us about your story. We&apos;ll reply within one business day with ideas, not a sales script.
        </p>

        <div className="mt-14 flex flex-col items-center justify-center gap-6 sm:flex-row">
          <Magnetic strength={0.5}>
            <a
              href={`mailto:${site.email}?subject=New%20project%20with%20Leiluna%20Studio`}
              className="group relative grid size-44 place-items-center overflow-hidden rounded-full bg-brand text-center font-medium text-ink sm:size-52"
            >
              <span className="absolute inset-0 scale-0 rounded-full bg-paper transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-100" />
              <span className="relative text-lg leading-tight">
                Start a
                <br />
                project →
              </span>
            </a>
          </Magnetic>
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <a href={`mailto:${site.email}`} className="font-display text-2xl font-medium transition-colors hover:text-brand sm:text-3xl">
              {site.email}
            </a>
            <button type="button" onClick={copy} className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted hover:text-paper">
              {copied ? "Copied ✦" : "Copy email"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
