import { process } from "@/content/site";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

export function Process() {
  return (
    <section className="px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="03" label="How I work" title="From blank calendar to viral loop." />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {process.map((p, i) => (
            <Reveal key={p.step} as="li" delay={i * 0.08} className={i % 2 ? "lg:mt-10" : ""}>
              <div className="h-full rounded-3xl border border-line bg-ink-2 p-6 transition hover:-translate-y-1 hover:border-brand/50">
                <p className="font-mono text-xs text-brand">{p.step}</p>
                <h3 className="mt-10 font-display text-2xl font-semibold">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
