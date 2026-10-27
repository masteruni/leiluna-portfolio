import Image from "next/image";
import { about, site } from "@/content/site";
import { Reveal } from "./Reveal";

// Set to "/me.jpg" after adding your photo to /public/me.jpg
const photo: string | null = null;

export function About() {
  return (
    <section id="about" className="px-5 py-24 sm:px-8">
      <div className="mx-auto grid max-w-6xl items-start gap-16 lg:grid-cols-[0.9fr_1.1fr]">
        {/* polaroid */}
        <Reveal className="mx-auto w-full max-w-sm lg:sticky lg:top-28">
          <div className="relative -rotate-3 rounded-2xl bg-paper p-3 pb-14 shadow-2xl shadow-black/50 transition duration-500 hover:rotate-0">
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-lg"
              style={{ background: "linear-gradient(160deg, var(--brand-3), var(--brand) 60%, var(--brand-2))" }}
            >
              {photo ? (
                <Image src={photo} alt={`Portrait of ${site.name}`} fill sizes="384px" className="object-cover" />
              ) : (
                <span className="absolute inset-0 grid place-items-center font-display text-[9rem] font-bold text-ink/30">
                  {site.name.charAt(0)}
                </span>
              )}
            </div>
            <p className="absolute bottom-4 left-0 right-0 text-center font-display text-lg font-semibold text-ink">
              hi, it&apos;s me ✦
            </p>
            {/* tape */}
            <span className="absolute -top-3 left-1/2 h-7 w-28 -translate-x-1/2 rotate-2 bg-brand-2/80" aria-hidden />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted">
              <span className="text-brand">(04)</span> About
            </p>
            <p className="font-display text-3xl font-medium leading-[1.15] tracking-tight sm:text-4xl">{about.intro}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
              {about.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mb-4 mt-12 font-mono text-xs uppercase tracking-[0.2em] text-muted">Toolkit</p>
            <ul className="flex flex-wrap gap-2">
              {about.tools.map((t, i) => (
                <li
                  key={t}
                  className={`rounded-full border px-4 py-2 text-sm transition hover:-translate-y-0.5 ${
                    i % 5 === 0 ? "border-brand/40 text-brand" : "border-line"
                  }`}
                >
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
