"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Compass,
  Globe,
  Smartphone,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { EASE, Reveal } from "@/components/ui/motion-primitives";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { cn } from "@/lib/utils";

type Service = {
  id: string;
  icon: LucideIcon;
  title: string;
  summary: string;
  color: string;
  deliverables: string[];
  outcomes: string;
};

const services: Service[] = [
  {
    id: "web",
    icon: Globe,
    title: "Web Development",
    summary:
      "Marketing sites, SaaS dashboards and internal platforms built on modern React — fast, accessible, and made to be extended.",
    color: "var(--color-loop-500)",
    deliverables: [
      "Next.js / React application builds",
      "Design systems & component libraries",
      "Headless CMS + commerce integrations",
      "Performance, SEO & accessibility passes",
    ],
    outcomes: "Sub-second loads, Lighthouse 95+, zero-downtime deploys.",
  },
  {
    id: "mobile",
    icon: Smartphone,
    title: "Mobile Apps",
    summary:
      "Cross-platform iOS and Android products that feel native — one codebase, shipped to both stores with confidence.",
    color: "var(--color-flux-500)",
    deliverables: [
      "React Native & Expo applications",
      "Offline-first sync and local storage",
      "Push, deep links & in-app payments",
      "App Store / Play Store release pipelines",
    ],
    outcomes: "Native-feel UX with a single team and one release cadence.",
  },
  {
    id: "automation",
    icon: Workflow,
    title: "Intelligent Automation",
    summary:
      "We find the repetitive work draining your team and replace it with reliable, observable pipelines that run themselves.",
    color: "var(--color-plasma-500)",
    deliverables: [
      "Workflow mapping & bottleneck analysis",
      "API integrations across your tool stack",
      "Document, data & reporting pipelines",
      "Monitoring, alerting and audit trails",
    ],
    outcomes: "Thousands of manual hours removed from the calendar each year.",
  },
  {
    id: "ai",
    icon: Bot,
    title: "AI Solutions",
    summary:
      "Applied AI that earns its place — retrieval assistants, document intelligence and agents wired into your real systems.",
    color: "var(--color-loop-400)",
    deliverables: [
      "RAG assistants over your own knowledge base",
      "Document extraction & classification",
      "Agentic workflows with human checkpoints",
      "Evaluation harnesses and guardrails",
    ],
    outcomes: "Measurable accuracy, traceable answers, controlled cost.",
  },
  {
    id: "consulting",
    icon: Compass,
    title: "Business & Technical Consultancy",
    summary:
      "How your business should run: operating model, system architecture, workflows and the roadmap that connects them.",
    color: "var(--color-flux-400)",
    deliverables: [
      "Architecture reviews & target-state design",
      "Operating model and workflow redesign",
      "Tooling strategy and build-vs-buy calls",
      "Team structure, rituals & delivery process",
    ],
    outcomes: "A written plan your team can execute without us in the room.",
  },
];

export function Services() {
  const [activeId, setActiveId] = useState(services[0].id);
  const active = services.find((s) => s.id === activeId) ?? services[0];

  return (
    <Section id="services">
      <Container>
        <SectionHeader
          eyebrow="What we do"
          title={
            <>
              Five disciplines,{" "}
              <span className="text-gradient">one delivery team</span>
            </>
          }
          description="Most agencies hand you a build and walk away. We cover the strategy, the software and the automation that connects them — so the system you get keeps paying for itself."
        />

        {/* Tab rail */}
        <Reveal delay={0.1} className="mt-14">
          <div className="mask-fade-x -mx-6 overflow-x-auto px-6 pb-2 lg:mx-0 lg:overflow-visible lg:px-0">
            <div
              role="tablist"
              aria-label="Services"
              className="flex min-w-max gap-2 lg:min-w-0 lg:justify-center"
            >
              {services.map((service) => {
                const Icon = service.icon;
                const isActive = service.id === activeId;
                return (
                  <button
                    key={service.id}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${service.id}`}
                    id={`tab-${service.id}`}
                    onClick={() => setActiveId(service.id)}
                    className={cn(
                      "relative inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm whitespace-nowrap transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-loop-400",
                      isActive
                        ? "text-white"
                        : "text-white/50 hover:text-white/85",
                    )}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="service-tab"
                        className="absolute inset-0 rounded-full border border-white/12 bg-white/7"
                        transition={{ duration: 0.4, ease: EASE }}
                      />
                    ) : null}
                    <Icon
                      className="relative z-10 size-4"
                      style={{ color: isActive ? service.color : undefined }}
                    />
                    <span className="relative z-10">{service.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Active service panel */}
        <Reveal delay={0.16} className="mt-8">
          <SpotlightCard glowColor={active.color} className="p-1">
            <motion.div
              key={active.id}
              id={`panel-${active.id}`}
              role="tabpanel"
              aria-labelledby={`tab-${active.id}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: EASE }}
              className="grid gap-10 p-8 sm:p-11 lg:grid-cols-[1fr_1px_1fr] lg:gap-12"
            >
              <div>
                <div
                  className="inline-flex size-12 items-center justify-center rounded-xl border border-white/10"
                  style={{
                    background: `color-mix(in oklab, ${active.color} 16%, transparent)`,
                  }}
                >
                  <active.icon
                    className="size-6"
                    style={{ color: active.color }}
                  />
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white">
                  {active.title}
                </h3>
                <p className="mt-3.5 leading-relaxed text-pretty text-white/55">
                  {active.summary}
                </p>
                <p
                  className="mt-6 border-l-2 pl-4 text-sm leading-relaxed text-white/70"
                  style={{ borderColor: active.color }}
                >
                  {active.outcomes}
                </p>
              </div>

              <div
                aria-hidden
                className="hidden bg-linear-to-b from-transparent via-white/10 to-transparent lg:block"
              />

              <div>
                <p className="font-mono text-[0.68rem] tracking-[0.22em] text-white/35 uppercase">
                  What you get
                </p>
                <ul className="mt-5 space-y-3.5">
                  {active.deliverables.map((item, index) => (
                    <motion.li
                      key={item}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.5,
                        ease: EASE,
                        delay: 0.1 + index * 0.07,
                      }}
                      className="group flex items-start gap-3 text-[0.94rem] text-white/70"
                    >
                      <ArrowRight
                        className="mt-1 size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                        style={{ color: active.color }}
                      />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </SpotlightCard>
        </Reveal>
      </Container>
    </Section>
  );
}
