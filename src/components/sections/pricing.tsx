"use client";

import { Check, Sparkles } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { StaggerGroup, StaggerItem } from "@/components/ui/motion-primitives";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import type { PricingTier } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function Pricing({ tiers }: { tiers: PricingTier[] }) {
  // Nothing to show while there are no tiers — don't render a bare heading.
  if (tiers.length === 0) return null;

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
            <StaggerItem key={tier.id} className="h-full">
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

                  <h3 className="text-lg font-display font-semibold tracking-tight text-cream">
                    {tier.name}
                  </h3>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-display font-semibold tracking-tight text-cream">
                      {tier.price}
                    </span>
                    {tier.cadence ? (
                      <span className="text-sm text-mist/70">
                        {tier.cadence}
                      </span>
                    ) : null}
                  </div>

                  {tier.description ? (
                    <p className="mt-4 text-sm leading-relaxed text-pretty text-mist">
                      {tier.description}
                    </p>
                  ) : null}

                  <ul className="mt-7 space-y-3 border-t border-hair/20 pt-6">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-mist"
                      >
                        <Check
                          className="mt-0.5 size-4 shrink-0"
                          style={{ color: tier.accent }}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {tier.cta ? (
                    /* `mt-auto` keeps buttons aligned across tiers with
                       different numbers of features. */
                    <div className="mt-auto pt-10">
                      <MagneticButton
                        href="#contact"
                        variant={tier.featured ? "primary" : "secondary"}
                        className="w-full"
                      >
                        {tier.cta}
                      </MagneticButton>
                    </div>
                  ) : null}
                </div>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <p className="mt-8 text-center text-sm text-mist/70">
          Not sure which fits? Book a free 30-minute call and we&apos;ll tell you
          straight — including if we&apos;re not the right team.
        </p>
      </Container>
    </Section>
  );
}
