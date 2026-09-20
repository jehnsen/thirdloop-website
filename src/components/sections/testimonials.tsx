"use client";

import { Quote } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/ui/motion-primitives";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import type { Testimonial } from "@/lib/testimonials";

export function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  // Nothing to show while there is no feedback — don't render a bare heading.
  if (testimonials.length === 0) return null;

  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Client feedback"
          title={
            <>
              What partners say{" "}
              <span className="text-gradient">after handover</span>
            </>
          }
        />

        <StaggerGroup
          className="mt-14 grid gap-6 lg:grid-cols-3"
          staggerChildren={0.12}
        >
          {testimonials.map((testimonial) => (
            <StaggerItem key={testimonial.id} className="h-full">
              <SpotlightCard glowColor={testimonial.accent} className="h-full">
                <figure className="flex h-full flex-col p-8">
                  <Quote
                    className="size-7 shrink-0 opacity-40"
                    style={{ color: testimonial.accent }}
                  />
                  <blockquote className="mt-5 flex-1 leading-relaxed text-pretty text-mist">
                    {testimonial.quote}
                  </blockquote>
                  <figcaption className="mt-7 border-t border-hair/20 pt-5">
                    <div className="text-sm font-medium text-cream">
                      {testimonial.name}
                    </div>
                    {testimonial.company ? (
                      <div className="mt-0.5 text-xs text-mist/70">
                        {testimonial.company}
                      </div>
                    ) : null}
                  </figcaption>
                </figure>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </Section>
  );
}
