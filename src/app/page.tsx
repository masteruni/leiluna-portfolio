import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Founders } from "@/components/Founders";
import { Hero } from "@/components/Hero";
import { Library } from "@/components/Library";
import { Manifesto } from "@/components/Manifesto";
import { Nav } from "@/components/Nav";
import { Numbers } from "@/components/Numbers";
import { Orbits } from "@/components/Orbits";
import { Phases } from "@/components/Phases";
import { Pillars } from "@/components/Pillars";
import { Voices } from "@/components/Voices";
import { WorkReel } from "@/components/WorkReel";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Pillars />
        <Manifesto />
        <Orbits />
        <WorkReel />
        <Library />
        <Numbers />
        <Phases />
        <Founders />
        <Voices />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
