import { TrustedBy, type TrustedStyle } from "@/components/TrustedBy";

// Temporary: five "Trusted by" styles to choose from.
const styles: TrustedStyle[] = ["spotlight", "orbit", "outline", "cards", "sweep"];
export default function Page() {
  return (
    <main className="py-10">
      {styles.map((v, i) => (
        <section key={v} id={`s${i + 1}`} className="relative border-b border-line px-5 py-16 sm:px-10 md:py-24">
          <div className="mx-auto max-w-6xl">
            <TrustedBy variant={v} />
          </div>
        </section>
      ))}
    </main>
  );
}
