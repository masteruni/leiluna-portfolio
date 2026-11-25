import { manifesto } from "@/content/site";
import { Eyebrow } from "@/components/Eyebrow";
import { TrustedBy, type TrustedStyle } from "@/components/TrustedBy";

// Temporary: the five "Trusted by" styles for the studio section, to choose from.
const styles: TrustedStyle[] = ["drift", "serif", "grid", "sentence", "chips"];
export default function Page() {
  return (
    <main className="py-10">
      {styles.map((v, i) => (
        <section key={v} id={`s${i + 1}`} className="relative border-b border-line px-5 pb-16 pt-10 sm:px-10 md:pb-20 md:pt-16">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[180px_1fr]">
            <Eyebrow id="studio" />
            <div className="min-w-0">
              <p className="font-display text-[clamp(1.9rem,4.4vw,4.4rem)] font-medium leading-[1.08] tracking-[-0.03em]">{manifesto}</p>
              <div className="mt-14 md:mt-20">
                <TrustedBy variant={v} />
              </div>
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
