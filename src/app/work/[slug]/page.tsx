import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CountUp } from "@/components/CountUp";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Contact } from "@/components/Contact";
import { LineReveal } from "@/components/LineReveal";
import { Footer } from "@/components/Footer";
import { Nav } from "@/components/Nav";
import { ProjectCover } from "@/components/ProjectCover";
import { Reveal } from "@/components/Reveal";
import { getProject, projects } from "@/content/projects";

// Break a title into two lines: at a comma if it has one, otherwise in the middle.
function titleLines(title: string) {
  const comma = title.indexOf(", ");
  if (comma > 0) return [title.slice(0, comma + 1), title.slice(comma + 2)];
  const words = title.split(" ");
  const half = Math.ceil(words.length / 2);
  return [words.slice(0, half).join(" "), words.slice(half).join(" ")].filter(Boolean);
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const title = `${project.title} · ${project.client}`;
  return {
    title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title,
      description: project.summary,
      type: "article",
      url: `/work/${project.slug}`,
      ...(project.cover ? { images: [{ url: project.cover, alt: `${project.title} for ${project.client}` }] } : {}),
    },
    twitter: { card: "summary_large_image", title, description: project.summary },
  };
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
      <main id="main" className="pt-32 md:pt-40">
        <article className="mx-auto max-w-7xl px-5 sm:px-10 xl:box-content">
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
                <h1 className="mt-5 font-display text-[clamp(3.2rem,9vw,8rem)] font-bold leading-[0.88] tracking-[-0.045em]">
                  <LineReveal inView lines={titleLines(project.title)} />
                </h1>
                <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">{project.summary}</p>
              </Reveal>

              <Reveal delay={0.1}>
                <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-line pt-6">
                  {project.metrics.map((m) => (
                    <div key={m.label} className="flex flex-col-reverse justify-end">
                      <dt className="mt-2 text-xs text-muted sm:text-sm">{m.label}</dt>
                      <dd className="font-display text-3xl font-semibold tracking-tight text-brand sm:text-5xl">
                        <CountUp value={m.value} />
                      </dd>
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
                  <p className="serif mt-4 text-3xl leading-tight sm:text-5xl">{project.challenge}</p>
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
                  <p className="serif mt-4 text-3xl leading-tight text-brand-2 sm:text-5xl">{project.results}</p>
                </section>
              </Reveal>
            </div>

            <Reveal>
              <div className="space-y-8 lg:sticky lg:top-28">
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
              </div>
            </Reveal>
          </div>

          {/* gallery: real media from `project.gallery`, or generated placeholders until a cover is added */}
          {project.gallery?.length ? (
            <div className="mt-24 columns-1 gap-4 sm:columns-2 lg:columns-3">
              {project.gallery.map((src, i) => (
                <Reveal key={src} delay={(i % 3) * 0.08} className="mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-ink-2">
                  {/\.(mp4|webm|mov)$/i.test(src) ? (
                    <video controlsList="nodownload noplaybackrate noremoteplayback" disablePictureInPicture disableRemotePlayback src={src} autoPlay muted loop playsInline preload="metadata" className="block h-auto w-full" />
                  ) : (
                    <Image
                      src={src}
                      alt={`${project.title}, image ${i + 1}`}
                      width={1200}
                      height={1500}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="block h-auto w-full"
                    />
                  )}
                </Reveal>
              ))}
            </div>
          ) : (
            !project.cover && (
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
            )
          )}

          <Link
            href={`/work/${next.slug}`}
            data-cursor="Next"
            className="group mt-32 flex items-end justify-between gap-6 border-y border-line py-12"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">Next project</p>
              <p className="mt-3 font-display text-5xl font-bold tracking-[-0.04em] transition group-hover:text-brand sm:text-8xl">
                {next.title}
              </p>
            </div>
            <span className="grid size-14 shrink-0 place-items-center rounded-full border border-line transition group-hover:rotate-45 group-hover:bg-brand group-hover:text-ink">
              <ArrowUpRight />
            </span>
          </Link>
        </article>
        <Contact />
      </main>
      <Footer />
    </>
  );
}
