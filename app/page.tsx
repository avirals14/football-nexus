import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import FanPulseSection from "@/components/fan-pulse-section";
import ModulesSection from "@/components/modules-section";
import RoadmapSection from "@/components/roadmap-section";
import BuildInPublicSection from "@/components/build-in-public-section";
import CtaSection from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <section id="features">
          <FanPulseSection />
          <ModulesSection />
        </section>
        <section id="roadmap">
          <RoadmapSection />
        </section>
        <section id="community">
          <BuildInPublicSection />
        </section>
        <CtaSection />
      </main>
      <Footer />
    </>
  );
}
