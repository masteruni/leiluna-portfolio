"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { categories, projects } from "@/content/projects";
import { ProjectCover } from "./ProjectCover";
import { SectionHeader } from "./SectionHeader";

export function Work() {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const shown = filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter));

  return (
    <section id="work" className="px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          index="01"
          label="Selected work"
          title={
            <>
              Content that <span className="italic text-brand">stops thumbs</span> and moves numbers.
            </>
          }
          aside={
            <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  aria-pressed={filter === c}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    filter === c
                      ? "border-paper bg-paper text-ink"
                      : "border-line text-paper/70 hover:border-paper/40 hover:text-paper"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          }
        />

        {/* Masonry so each card keeps its real content format (reel, post, video…) */}
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          <AnimatePresence mode="popLayout">
            {shown.map((p, i) => (
              <motion.article
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, delay: i * 0.04 }}
                className="mb-6 break-inside-avoid"
              >
                <Link href={`/work/${p.slug}`} className="group block">
                  <div className="relative">
                    <ProjectCover project={p} />
                    {/* metrics reveal */}
                    <div className="pointer-events-none absolute inset-x-3 bottom-3 flex translate-y-3 justify-between gap-2 rounded-2xl bg-ink/80 p-3 opacity-0 backdrop-blur-md transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      {p.metrics.map((m) => (
                        <div key={m.label} className="min-w-0">
                          <p className="font-display text-lg font-bold leading-none text-brand-2">{m.value}</p>
                          <p className="mt-1 truncate text-[11px] text-muted">{m.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-xl font-semibold tracking-tight">{p.title}</h3>
                      <p className="mt-1 text-sm text-muted">
                        {p.client} · {p.year}
                      </p>
                    </div>
                    <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line transition group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand group-hover:text-ink">
                      <ArrowUpRight size={18} />
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.categories.map((c) => (
                      <span key={c} className="rounded-full bg-ink-3 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-paper/70">
                        {c}
                      </span>
                    ))}
                  </div>
                </Link>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
