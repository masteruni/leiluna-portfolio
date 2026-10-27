import { BadgeCheck, Heart } from "lucide-react";
import { testimonials } from "@/content/site";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

// Client love, styled as comments under a post.
export function Testimonials() {
  return (
    <section className="px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader index="06" label="Kind words" title={<>Read the comments<span className="text-brand">.</span></>} />
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.handle} delay={i * 0.1} className={i === 1 ? "md:mt-12" : ""}>
              <figure className="rounded-3xl border border-line bg-ink-2 p-6">
                <figcaption className="flex items-center gap-3">
                  <span
                    className="grid size-11 place-items-center rounded-full font-display font-bold text-ink"
                    style={{ background: ["var(--brand)", "var(--brand-2)", "var(--brand-3)"][i % 3] }}
                    aria-hidden
                  >
                    {t.name.charAt(0)}
                  </span>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1 text-sm font-semibold">
                      {t.handle} <BadgeCheck size={14} className="text-brand-3" aria-label="verified" />
                    </p>
                    <p className="truncate text-xs text-muted">{t.title}</p>
                  </div>
                </figcaption>
                <blockquote className="mt-5 text-lg leading-snug">&ldquo;{t.quote}&rdquo;</blockquote>
                <div className="mt-6 flex items-center gap-5 text-xs text-muted">
                  <span className="flex items-center gap-1.5">
                    <Heart size={14} fill="var(--brand)" stroke="var(--brand)" /> {t.likes}
                  </span>
                  <span>Reply</span>
                  <span>See translation</span>
                </div>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
