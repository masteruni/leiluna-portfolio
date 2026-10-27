import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { ProjectCover } from "@/components/ProjectCover";
import { Reveal } from "@/components/Reveal";
import { getProject, projects } from "@/content/projects";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: `${project.title} · ${project.client}`, description: project.summary };
}

export default async function CaseStudy({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.indexOf(project);
  const next = projects[(index + 1) % projects.length];
  // Landscape formats get a full-width hero; vertical ones sit beside the text.
  const isTall = project.format === "reel" || project.format === "portrait";

  return (
    <>
      <Nav />
      <main className="px-5 pt-32 sm:px-8 md:pt-40">
        <article className="mx-auto max-w-6xl">
          <Reveal>
            <Link href="/#work" className="inline-flex items-center gap-2 text-sm text-muted transition hover:text-paper">
              <ArrowLeft size={16} /> All work
            </Link>
          </Reveal>

          <div className={`mt-10 grid gap-12 ${isTall ? "lg:grid-cols-[1.2fr_0.8fr] lg:items-end" : ""}`}>
            <div>
              <Reveal>
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">
                  <span className="text-brand">{project.client}</span> · {project.year} · {project.categories.join(" / ")}
                </p>
                <h1 className="mt-5 font-display text-[clamp(3rem,9vw,7rem)] font-bold leading-[0.88] tracking-[-0.04em]">
                  {project.title}
                </h1>
                <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">{project.summary}</p>
              </Reveal>

              <Reveal delay={0.1}>
                <dl className="mt-10 grid grid-cols-3 gap-px overflow-hidden rounded-3xl border border-line bg-line">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="bg-ink p-5 sm:p-6">
                      <dt className="text-xs text-muted sm:text-sm">{m.label}</dt>
                      <dd className="mt-2 font-display text-2xl font-bold text-brand-2 sm:text-4xl">{m.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            <Reveal delay={0.15} className={isTall ? "mx-auto w-full max-w-sm" : ""}>
              <div className="group">
                <ProjectCover project={project} priority />
              </div>
            </Reveal>
          </div>

          <div className="mt-24 grid gap-16 lg:grid-cols-[1fr_280px]">
            <div className="space-y-16">
              <Reveal>
                <section>
                  <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-brand">The challenge</h2>
                  <p className="mt-4 font-display text-2xl leading-snug sm:text-3xl">{project.challenge}</p>
                </section>
              </Reveal>
              <Reveal>
                <section>
                  <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-brand">The approach</h2>
                  <ol className="mt-6 space-y-4">
                    {project.approach.map((a, i) => (
                      <li key={a} className="flex gap-5 rounded-2xl border border-line bg-ink-2 p-5">
                        <span className="font-mono text-sm text-muted">0{i + 1}</span>
                        <p className="text-lg leading-relaxed">{a}</p>
                      </li>
                    ))}
                  </ol>
                </section>
              </Reveal>
              <Reveal>
                <section>
                  <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-brand">The results</h2>
                  <p className="mt-4 font-display text-2xl leading-snug sm:text-3xl">{project.results}</p>
                </section>
              </Reveal>
            </div>

            <Reveal>
              <aside className="space-y-8 lg:sticky lg:top-28">
                <div>
                  <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Deliverables</h2>
                  <ul className="mt-3 space-y-2">
                    {project.deliverables.map((d) => (
                      <li key={d} className="border-b border-line pb-2">{d}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Platforms</h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {project.platforms.map((p) => (
                      <li key={p} className="rounded-full border border-line px-3 py-1.5 text-sm">{p}</li>
                    ))}
                  </ul>
                </div>
              </aside>
            </Reveal>
          </div>

          {/* gallery — swap these for real stills/frames */}
          <Reveal>
            <div className="mt-24 grid grid-cols-2 gap-4 md:grid-cols-3">
              <div className="group"><ProjectCover project={project} format="reel" variant={1} /></div>
              <div className="group flex flex-col gap-4">
                <ProjectCover project={project} format="square" variant={2} />
                <ProjectCover project={project} format="portrait" variant={3} />
              </div>
              <div className="group hidden md:block"><ProjectCover project={project} format="reel" variant={4} /></div>
            </div>
          </Reveal>

          <Link
            href={`/work/${next.slug}`}
            className="group mt-24 flex items-end justify-between gap-6 border-y border-line py-10"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Next project</p>
              <p className="mt-3 font-display text-4xl font-bold tracking-tight transition group-hover:text-brand sm:text-6xl">
                {next.title}
              </p>
            </div>
            <span className="grid size-14 shrink-0 place-items-center rounded-full border border-line transition group-hover:rotate-45 group-hover:bg-brand group-hover:text-ink">
              <ArrowUpRight />
            </span>
          </Link>
        </article>
      </main>
      <Contact />
      <Footer />
    </>
  );
}
