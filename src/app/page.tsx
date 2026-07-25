import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Contact } from "@/components/sections/contact";
import { Differentiators } from "@/components/sections/differentiators";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Pricing } from "@/components/sections/pricing";
import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";
import { Stack } from "@/components/sections/stack";
import { TeamTeaser } from "@/components/sections/team-teaser";
import { Testimonials } from "@/components/sections/testimonials";
import { Work } from "@/components/sections/work";
import { GlowDivider, PageBackdrop } from "@/components/ui/backdrop";

export default function Home() {
  return (
    <>
      <PageBackdrop />
      <Navbar />
      <main id="main">
        <Hero />
        <Services />
        <GlowDivider />
        <Differentiators />
        <Process />
        <GlowDivider />
        <Work />
        <Stack />
        <GlowDivider />
        <TeamTeaser />
        <Testimonials />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
