"use client";

import { Quote } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/ui/motion-primitives";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";

const testimonials = [
  {
    quote:
      "They spent the first two weeks understanding our operation instead of pitching us a stack. The architecture doc alone changed how we planned the next 18 months.",
    name: "Operations Director",
    company: "Freight & logistics client",
    accent: "var(--color-loop-500)",
  },
  {
    quote:
      "The automation work paid for itself in under five months. What impressed me more was the handover — my team runs and extends it without calling them.",
    name: "Head of Technology",
    company: "Clinical SaaS client",
    accent: "var(--color-flux-500)",
  },
  {
    quote:
      "Genuinely honest about what AI would and wouldn't solve for us. They talked us out of two features we'd budgeted for. That built more trust than any demo.",
    name: "Managing Partner",
    company: "Financial services client",
    accent: "var(--color-plasma-500)",
  },
];

export function Testimonials() {
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
            <StaggerItem key={testimonial.company} className="h-full">
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
                    <div className="mt-0.5 text-xs text-mist/70">
                      {testimonial.company}
                    </div>
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
