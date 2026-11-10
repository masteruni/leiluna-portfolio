import { manifesto } from "@/content/site";
import { LitText } from "./LitText";

// The studio statement lights up word by word as you scroll through it. It stands on its own: no label, no accent
// words, the full width of the page.
export function Manifesto() {
  return (
    <section id="studio" className="relative px-5 pb-16 pt-10 sm:px-10 md:pb-24 md:pt-20">
      <div className="mx-auto max-w-7xl">
        <LitText
          text={manifesto}
          className="max-w-6xl font-display text-[clamp(1.9rem,4.6vw,4.5rem)] font-medium leading-[1.06] tracking-[-0.035em]"
        />
      </div>
    </section>
  );
}
