import { TrustedBy } from "./TrustedBy";

// The studio section: the brands we've worked with, under a centred "Trusted by", in two rows drifting past in
// opposite directions.
export function Manifesto() {
  return (
    <section id="studio" className="relative px-5 py-16 sm:px-10 md:py-24">
      <div className="mx-auto max-w-6xl">
        <TrustedBy />
      </div>
    </section>
  );
}
