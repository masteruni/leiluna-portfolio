"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { site } from "@/content/site";
import { Reveal } from "./Reveal";

export function Contact() {
  const [copied, setCopied] = useState(false);

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
    <section id="contact" className="relative overflow-hidden px-5 py-32 sm:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-[500px] w-[1000px] -translate-x-1/2 translate-y-1/2 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(closest-side, var(--brand), transparent)" }}
      />
      <div className="relative mx-auto max-w-6xl text-center">
        <Reveal>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.2em] text-muted">
            <span className="text-brand">(07)</span> Contact
          </p>
          <h2 className="font-display text-[clamp(3rem,10vw,8.5rem)] font-bold leading-[0.85] tracking-[-0.04em]">
            Let&apos;s make your
            <br />
            feed <span className="italic text-brand-2">unskippable.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`mailto:${site.email}?subject=Project%20inquiry`}
              className="group inline-flex items-center gap-2 rounded-full bg-paper px-7 py-4 text-lg font-medium text-ink transition hover:bg-brand-2"
            >
              {site.email}
              <ArrowUpRight size={20} className="transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
            <button
              type="button"
              onClick={copy}
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-4 text-sm transition hover:border-paper/40"
            >
              {copied ? <Check size={16} className="text-brand-2" /> : <Copy size={16} />}
              {copied ? "Copied!" : "Copy email"}
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <ul className="mt-14 flex flex-wrap justify-center gap-x-8 gap-y-3">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1 text-paper/70 transition hover:text-paper"
                >
                  {s.label}
                  <ArrowUpRight size={14} className="opacity-0 transition group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
