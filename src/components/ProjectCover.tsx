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

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-ink-2 ${formatAspect[format]} ${className}`}
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
        <div aria-hidden className="absolute inset-0 transition-transform duration-[1.2s] ease-[var(--ease-out)] group-hover:scale-[1.06]">
          <div
            className="absolute inset-0"
            style={{ background: `radial-gradient(120% 80% at ${30 + variant * 20}% 0%, color-mix(in oklab, ${a} 22%, transparent), transparent 60%), var(--ink-2)` }}
          />
          {/* planet */}
          <div
            className="absolute aspect-square rounded-full"
            style={{
              width: "115%",
              left: `${[-35, 20, -10, 30, -25][variant % 5]}%`,
              top: `${[45, 55, 62, 40, 50][variant % 5]}%`,
              background: `radial-gradient(circle at 50% 0%, color-mix(in oklab, ${b} 55%, var(--ink)) 0%, var(--ink) 38%)`,
              boxShadow: `0 -2px 0 0 color-mix(in oklab, ${a} 90%, white), 0 -18px 60px -6px ${a}, inset 0 18px 40px -20px ${b}`,
            }}
          />
          <span className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.25em] text-paper/60">
            {project.client}
          </span>
          <span className="serif absolute bottom-12 left-5 right-5 text-[clamp(1.8rem,3vw,2.6rem)] leading-none text-paper">
            {project.title}
          </span>
        </div>
      )}

      {project.video && (
        <video controlsList="nodownload noplaybackrate noremoteplayback" disablePictureInPicture disableRemotePlayback
          ref={videoRef}
          src={project.video}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}

      <span className="absolute bottom-4 left-5 font-mono text-[10px] uppercase tracking-widest text-paper/60">
        {formatLabel[format]}
      </span>
    </div>
  );
}
