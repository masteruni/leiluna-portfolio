import { manifesto } from "@/content/site";
import { Eyebrow } from "./Eyebrow";
import { LitText } from "./LitText";

// The studio statement lights up word by word as you scroll through it.
export function Manifesto() {
  return (
    <section id="studio" className="relative px-5 pb-16 pt-10 sm:px-10 md:pb-20 md:pt-16">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[180px_1fr]">
        <Eyebrow id="studio" />
        <LitText
          text={manifesto}
          accent={["orbiting.", "stop"]}
          className="font-display text-[clamp(1.9rem,4.4vw,4.4rem)] font-medium leading-[1.08] tracking-[-0.03em]"
        />
      </div>
    </section>
  );
}
