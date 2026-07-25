"use client";

import { Check, Sparkles } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { StaggerGroup, StaggerItem } from "@/components/ui/motion-primitives";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Advisory",
    price: "From $4k",
    cadence: "per engagement",
    description:
      "A fixed-scope architecture or operating-model review. You walk away with a written plan, whether or not we build it.",
    features: [
      "Discovery workshops",
      "Target-state architecture doc",
      "Sequenced roadmap & estimates",
      "Build-vs-buy recommendations",
      "Two follow-up sessions",
    ],
    cta: "Book a review",
    accent: "var(--color-flux-500)",
  },
  {
    name: "Build",
    price: "From $18k",
    cadence: "per project",
    description:
      "End-to-end delivery of a web platform, mobile app or automation suite — architected, built, deployed and documented.",
    features: [
      "Everything in Advisory",
      "Full design & engineering team",
      "Bi-weekly demos in staging",
      "CI/CD, monitoring & tests",
      "Handover docs + team training",
      "30 days post-launch support",
    ],
    cta: "Start a project",
    accent: "var(--color-loop-500)",
    featured: true,
  },
  {
    name: "Partner",
    price: "From $6k",
    cadence: "per month",
    description:
      "An embedded team on retainer. Continuous delivery across product, automation and AI with a roadmap we own together.",
    features: [
      "Dedicated squad allocation",
      "Rolling quarterly roadmap",
      "Priority support & SLAs",
      "Ongoing automation buildout",
      "Quarterly business reviews",
      "Cancel with 30 days' notice",
    ],
    cta: "Talk retainer",
    accent: "var(--color-plasma-500)",
  },
];

export function Pricing() {
  return (
    <Section id="pricing">
      <Container>
        <SectionHeader
          eyebrow="Engagement models"
          title={
            <>
              Clear scope,{" "}
              <span className="text-gradient">clear numbers</span>
            </>
          }
          description="Every engagement starts with a fixed-price discovery so you know the cost before committing to the build. Final pricing depends on scope — these are starting points."
        />

        <StaggerGroup
          className="mt-14 grid items-start gap-6 lg:grid-cols-3"
          staggerChildren={0.11}
        >
          {tiers.map((tier) => (
            <StaggerItem key={tier.name} className="h-full">
              <SpotlightCard
                glowColor={tier.accent}
                className={cn(
                  "h-full",
                  tier.featured && "lg:-mt-4 lg:scale-[1.03]",
                )}
              >
                <div className="flex h-full flex-col p-8">
                  {tier.featured ? (
                    <span className="mb-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-loop-500/15 px-3 py-1 text-[0.68rem] font-medium text-loop-200">
                      <Sparkles className="size-3" />
                      Most requested
                    </span>
                  ) : null}

                  <h3 className="text-lg font-semibold tracking-tight text-white">
                    {tier.name}
                  </h3>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-semibold tracking-tight text-white">
                      {tier.price}
                    </span>
                    <span className="text-sm text-white/40">
                      {tier.cadence}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-pretty text-white/55">
                    {tier.description}
                  </p>

                  <ul className="mt-7 space-y-3 border-t border-white/8 pt-6">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-white/65"
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0"
                          style={{ color: tier.accent }}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 pt-2">
                    <MagneticButton
                      href="#contact"
                      variant={tier.featured ? "primary" : "secondary"}
                      className="w-full"
                    >
                      {tier.cta}
                    </MagneticButton>
                  </div>
                </div>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <p className="mt-8 text-center text-sm text-white/35">
          Not sure which fits? Book a free 30-minute call and we&apos;ll tell you
          straight — including if we&apos;re not the right team.
        </p>
      </Container>
    </Section>
  );
}
