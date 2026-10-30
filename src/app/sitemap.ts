import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // A fixed date from the content (not the build clock), so prerendering stays deterministic.
  const lastModified = new Date(site.updated);
  return [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({ url: `${site.url}/work/${p.slug}`, lastModified, changeFrequency: "yearly" as const, priority: 0.8 })),
  ];
}
