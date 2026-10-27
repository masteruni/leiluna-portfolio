import { Download } from "lucide-react";
import { experience, site } from "@/content/site";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

export function Experience() {
  return (
    <section id="experience" className="px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index="05"
          label="Experience"
          title="Where I've been posting."
          aside={
            <a
              href={site.resumeUrl}
              download
              className="group inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm font-medium transition hover:border-brand-2 hover:bg-brand-2 hover:text-ink"
            >
              <Download size={16} className="transition group-hover:translate-y-0.5" /> Download CV
            </a>
          }
        />
        <ul className="border-t border-line">
          {experience.map((e, i) => (
            <Reveal key={e.role + e.period} as="li" delay={i * 0.05}>
              <div className="group grid gap-2 border-b border-line py-8 transition hover:bg-ink-2/60 md:grid-cols-[180px_1fr_1fr] md:gap-8 md:px-4">
                <p className="font-mono text-sm text-muted">{e.period}</p>
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight transition group-hover:text-brand">
                    {e.role}
                  </h3>
                  <p className="mt-1 text-muted">{e.company}</p>
                </div>
                <p className="leading-relaxed text-muted">{e.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
