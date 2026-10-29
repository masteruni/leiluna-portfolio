import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    ...projects.map((p) => ({ url: `${site.url}/work/${p.slug}`, lastModified, changeFrequency: "yearly" as const, priority: 0.8 })),
  ];
}
