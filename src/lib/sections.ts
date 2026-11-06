import { recent } from "@/content/recent";
import { testimonials } from "@/content/site";

export type SectionId = "studio" | "formats" | "services" | "work" | "recent" | "library" | "proof" | "process" | "founders" | "testimonials" | "faq" | "contact";

// The homepage in order. Section numbers ("(03)") come from this one list, so adding or removing a section
// never leaves the numbers out of step. Recent work and Testimonials only count once they have
// something to show.
export const sections: { id: SectionId; label: string }[] = [
  { id: "studio", label: "The studio" },
  { id: "formats", label: "Pick a format" },
  { id: "services", label: "Services, five orbits" },
  { id: "work", label: "Selected work" },
  ...(recent.length ? [{ id: "recent" as const, label: "Recent work" }] : []),
  { id: "library", label: "The library" },
  { id: "proof", label: "Proof, not promises" },
  { id: "process", label: "How we work" },
  { id: "founders", label: "The founders" },
  ...(testimonials.length ? [{ id: "testimonials" as const, label: "Kind words" }] : []),
  { id: "faq", label: "Good questions" },
  { id: "contact", label: "Contact" },
];

export function sectionNumber(id: SectionId) {
  const i = sections.findIndex((s) => s.id === id);
  return `(${String(Math.max(i, 0) + 1).padStart(2, "0")})`;
}
