import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Contact } from "@/components/sections/contact";
import { Differentiators } from "@/components/sections/differentiators";
import { Faq } from "@/components/sections/faq";
import { Governance } from "@/components/sections/governance";
import { Hero } from "@/components/sections/hero";
import { Pricing } from "@/components/sections/pricing";
import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";
import { Stack } from "@/components/sections/stack";
import { TeamTeaser } from "@/components/sections/team-teaser";
import { Testimonials } from "@/components/sections/testimonials";
import { Work } from "@/components/sections/work";
import { GlowDivider, PageBackdrop } from "@/components/ui/backdrop";
import { getPublishedPricingTiers } from "@/lib/pricing-store";
import { getPublishedServices } from "@/lib/service-store";
import { getPublishedTestimonials } from "@/lib/testimonial-store";

export default async function Home() {
  // One round trip each, in parallel — they don't depend on each other.
  const [services, testimonials, tiers] = await Promise.all([
    getPublishedServices(),
    getPublishedTestimonials(),
    getPublishedPricingTiers(),
  ]);

  return (
    <>
      <PageBackdrop theme="home" />
      <Navbar />
      <main id="main">
        <Hero />
        <Services services={services} />
        <Governance />
        <Differentiators />
        <Process />
        <GlowDivider />
        {/* <Work /> */}
        <Stack />
        
        <TeamTeaser />
        <Testimonials testimonials={testimonials} />
        <Pricing tiers={tiers} />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
