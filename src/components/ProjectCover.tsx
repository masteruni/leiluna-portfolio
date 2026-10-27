"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Format, Project } from "@/content/projects";

export const formatAspect: Record<Format, string> = {
  reel: "aspect-[9/16]",
  square: "aspect-square",
  wide: "aspect-video",
  portrait: "aspect-[4/5]",
};

const formatLabel: Record<Format, string> = {
  reel: "9:16 · Reel",
  square: "1:1 · Post",
  wide: "16:9 · Video",
  portrait: "4:5 · Feed",
};

// Shows the real cover image/video when provided, otherwise generated gradient art from the project's palette.
export function ProjectCover({
  project,
  format = project.format,
  variant = 0,
  priority,
  className = "",
}: {
  project: Project;
  format?: Format;
  variant?: number;
  priority?: boolean;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [a, b] = project.palette;
  const angle = 135 + variant * 70;

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-ink-2 ${formatAspect[format]} ${className}`}
      onMouseEnter={() => videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => videoRef.current?.pause()}
    >
      {project.cover ? (
        <Image
          src={project.cover}
          alt={`${project.title} for ${project.client}`}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div
          aria-hidden
          className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
          style={{
            background: `radial-gradient(circle at ${20 + variant * 30}% 20%, ${a} 0%, transparent 55%),
              radial-gradient(circle at 85% ${80 - variant * 20}%, ${b} 0%, transparent 50%),
              linear-gradient(${angle}deg, color-mix(in oklab, ${a} 35%, var(--ink)) 0%, var(--ink-2) 100%)`,
          }}
        >
          <span className="absolute -bottom-[0.18em] -right-[0.05em] font-display text-[11rem] font-bold leading-none text-ink/25 mix-blend-overlay sm:text-[14rem]">
            {project.client.replace(/^@/, "").charAt(0)}
          </span>
          <span className="absolute left-5 top-5 max-w-[70%] font-display text-2xl font-semibold leading-tight text-ink/80">
            {project.title}
          </span>
        </div>
      )}

      {project.video && (
        <video
          ref={videoRef}
          src={project.video}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}

      <span className="absolute bottom-4 left-4 rounded-full bg-ink/70 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-paper backdrop-blur">
        {formatLabel[format]}
      </span>
    </div>
  );
}
