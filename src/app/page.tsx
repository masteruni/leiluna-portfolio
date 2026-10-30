import { Contact } from "@/components/Contact";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";
import { Founders } from "@/components/Founders";
import { Hero } from "@/components/Hero";
import { Library } from "@/components/Library";
import { Manifesto } from "@/components/Manifesto";
import { Nav } from "@/components/Nav";
import { Orbits } from "@/components/Orbits";
import { Phases } from "@/components/Phases";
import { Pillars } from "@/components/Pillars";
import { Proof } from "@/components/Proof";
import { SelectedWork } from "@/components/SelectedWork";
import { ShowreelPlayer, ShowreelSection } from "@/components/Showreel";
import { faqs } from "@/content/site";

// Lets search engines show the FAQ answers directly in results.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Pillars />
        <Manifesto />
        <ShowreelSection />
        <Orbits />
        <SelectedWork />
        <Library />
        <Proof />
        <Phases />
        <Founders />
        <Faq />
        <Contact />
      </main>
      <ShowreelPlayer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <Footer />
    </>
  );
}
