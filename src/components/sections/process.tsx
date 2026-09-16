"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/ui/motion-primitives";
import { Container, Section, SectionHeader } from "@/components/ui/section";

const steps = [
  {
    number: "01",
    title: "Discover",
    duration: "Week 1",
    body: "We map your workflows, systems and constraints — then agree on the single metric this engagement has to move. No proposal until we understand the machine.",
    points: ["Stakeholder interviews", "System & data audit", "Success metric defined"],
  },
  {
    number: "02",
    title: "Architect",
    duration: "Week 2",
    body: "You get a written target-state design: architecture, integrations, build-vs-buy calls and a sequenced roadmap. It's yours whether or not we build it.",
    points: ["Target-state architecture", "Roadmap & estimates", "Risk register"],
  },
  {
    number: "03",
    title: "Build",
    duration: "Weeks 3–10",
    body: "Two-week increments with working software at the end of each. You see progress in a staging environment continuously, not in a slide deck at the end.",
    points: ["Bi-weekly demos", "CI/CD from day one", "Shared backlog access"],
  },
  {
    number: "04",
    title: "Automate",
    duration: "Overlapping",
    body: "As the core lands, we wire in the automations and AI that remove manual steps — each one measured against the hours it gives back.",
    points: ["Pipeline instrumentation", "AI evaluation harness", "Hours-saved tracking"],
  },
  {
    number: "05",
    title: "Compound",
    duration: "Ongoing",
    body: "Handover with documentation and training, then an optional retainer. Every loop through the system should make the next one cheaper.",
    points: ["Runbooks & docs", "Team enablement", "Quarterly reviews"],
  },
];

export function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 60%"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Section id="process">
      <Container>
        <SectionHeader
          eyebrow="How we work"
          title={
            <>
              A process built to{" "}
              <span className="text-gradient">de-risk the build</span>
            </>
          }
          description="Fixed checkpoints, visible progress and an architecture document you own from week two. You always know what's coming next and what it costs."
        />

        <div ref={containerRef} className="relative mt-16 sm:mt-20">
          {/* progress rail */}
          <div
            aria-hidden
            className="absolute top-2 bottom-2 left-[1.4rem] w-px bg-white/8 sm:left-1/2 sm:-translate-x-1/2"
          >
            <motion.div
              style={{ scaleY: lineScale }}
              className="h-full w-full origin-top bg-linear-to-b from-loop-500 via-flux-400 to-plasma-500"
            />
          </div>

          <ol className="space-y-10 sm:space-y-14">
            {steps.map((step, index) => {
              const isRight = index % 2 === 1;
              return (
                <li key={step.number} className="relative">
                  <div className="grid gap-6 sm:grid-cols-2 sm:gap-12">
                    <Reveal
                      delay={0.05}
                      className={`pl-14 sm:pl-0 ${
                        isRight
                          ? "sm:col-start-2 sm:pl-12"
                          : "sm:col-start-1 sm:row-start-1 sm:pr-12 sm:text-right"
                      }`}
                    >
                      <div className="glass-panel rounded-2xl p-6 transition-colors duration-500 hover:border-hair/35 sm:p-7">
                        <div
                          className={`flex items-baseline gap-3 ${
                            isRight ? "" : "sm:flex-row-reverse"
                          }`}
                        >
                          <span className="font-mono text-xs tracking-[0.2em] text-loop-300">
                            {step.number}
                          </span>
                          <h3 className="text-xl font-display font-semibold tracking-tight text-cream">
                            {step.title}
                          </h3>
                          {/* pushed to the outer edge on whichever side the card sits */}
                          <span
                            className={`rounded-full border border-hair/20 px-2.5 py-0.5 text-[0.65rem] whitespace-nowrap text-mist/80 ${
                              isRight ? "ml-auto" : "ml-auto sm:mr-auto sm:ml-0"
                            }`}
                          >
                            {step.duration}
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-pretty text-mist">
                          {step.body}
                        </p>
                        <ul
                          className={`mt-4 flex flex-wrap gap-2 ${
                            isRight ? "" : "sm:justify-end"
                          }`}
                        >
                          {step.points.map((point) => (
                            <li
                              key={point}
                              className="rounded-full bg-white/5 px-2.5 py-1 text-[0.68rem] text-mist"
                            >
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </Reveal>
                  </div>

                  {/* node marker */}
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.45, delay: 0.1 }}
                    className="absolute top-7 left-[1.4rem] z-10 flex size-3 -translate-x-1/2 items-center justify-center rounded-full bg-ink-950 sm:left-1/2"
                  >
                    <span className="size-3 rounded-full border-2 border-loop-400 bg-ink-950" />
                    <span className="absolute size-3 animate-pulse-ring rounded-full bg-loop-400/60" />
                  </motion.span>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
