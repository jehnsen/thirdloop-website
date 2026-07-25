"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/motion-primitives";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";

type CaseStudy = {
  client: string;
  sector: string;
  title: string;
  body: string;
  metrics: { value: string; label: string }[];
  tags: string[];
  accent: string;
  featured?: boolean;
};

const caseStudies: CaseStudy[] = [
  {
    client: "Meridian Logistics",
    sector: "Freight & supply chain",
    title: "Replaced a 14-step manual dispatch process with one automated pipeline",
    body: "Dispatchers were rekeying order data across four systems. We mapped the flow, built an integration layer and added a document-extraction model for inbound PDFs. Orders now route themselves, with exceptions surfaced to a review queue.",
    metrics: [
      { value: "9,400", label: "Hours saved / year" },
      { value: "-72%", label: "Order-entry errors" },
      { value: "6 wks", label: "To production" },
    ],
    tags: ["Automation", "AI Extraction", "Integrations"],
    accent: "var(--color-loop-500)",
    featured: true,
  },
  {
    client: "Verdant Health",
    sector: "Clinical SaaS",
    title: "A patient platform rebuilt for scale",
    body: "Rearchitected a struggling monolith into a modular Next.js platform with an offline-capable mobile companion.",
    metrics: [
      { value: "1.2s", label: "P95 load" },
      { value: "3x", label: "Signup conversion" },
    ],
    tags: ["Web", "Mobile", "Architecture"],
    accent: "var(--color-flux-500)",
  },
  {
    client: "Northgate Capital",
    sector: "Financial services",
    title: "An AI research assistant grounded in 40k internal documents",
    body: "A retrieval assistant with citation-backed answers and an evaluation harness the team runs before every model change.",
    metrics: [
      { value: "94%", label: "Answer accuracy" },
      { value: "-60%", label: "Research time" },
    ],
    tags: ["AI", "RAG", "Evaluation"],
    accent: "var(--color-plasma-500)",
  },
  {
    client: "Atlas Field Services",
    sector: "Field operations",
    title: "Operating model redesign ahead of a 3x headcount jump",
    body: "Workflow redesign, tooling consolidation and a delivery process the team runs without external support.",
    metrics: [
      { value: "3x", label: "Headcount absorbed" },
      { value: "-40%", label: "Tooling spend" },
    ],
    tags: ["Consultancy", "Operating Model"],
    accent: "var(--color-loop-400)",
  },
];

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
        {value}
      </div>
      <div className="mt-1 text-[0.68rem] leading-snug text-white/40">
        {label}
      </div>
    </div>
  );
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-white/8 bg-white/4 px-2.5 py-1 text-[0.66rem] text-white/50"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

export function Work() {
  const [featured, ...rest] = caseStudies;

  return (
    <Section id="work">
      <Container>
        <SectionHeader
          eyebrow="Selected work"
          title={
            <>
              Outcomes we can{" "}
              <span className="text-gradient">put a number on</span>
            </>
          }
          description="A sample of recent engagements across automation, product and advisory. Names and figures shown with client permission."
        />

        {/* Featured */}
        <Reveal delay={0.08} className="mt-14">
          <SpotlightCard glowColor={featured.accent} radius={480}>
            <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:p-12">
              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                  <span className="font-medium text-white">
                    {featured.client}
                  </span>
                  <span className="text-white/25">·</span>
                  <span className="text-white/45">{featured.sector}</span>
                </div>
                <h3 className="mt-4 text-2xl font-semibold tracking-tight text-balance text-white sm:text-3xl sm:leading-tight">
                  {featured.title}
                </h3>
                <p className="mt-4 leading-relaxed text-pretty text-white/55">
                  {featured.body}
                </p>
                <div className="mt-7">
                  <Tags tags={featured.tags} />
                </div>
              </div>

              <div className="flex flex-col justify-between gap-8 lg:border-l lg:border-white/8 lg:pl-12">
                <div className="grid grid-cols-3 gap-5 lg:grid-cols-1 lg:gap-7">
                  {featured.metrics.map((metric) => (
                    <Metric key={metric.label} {...metric} />
                  ))}
                </div>
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 text-sm font-medium text-loop-300 transition-colors hover:text-loop-200"
                >
                  Discuss a similar project
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </SpotlightCard>
        </Reveal>

        {/* Grid */}
        <StaggerGroup
          className="mt-6 grid gap-6 md:grid-cols-3"
          staggerChildren={0.1}
        >
          {rest.map((study) => (
            <StaggerItem key={study.client}>
              <SpotlightCard glowColor={study.accent} className="h-full">
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex h-full flex-col p-7"
                >
                  <div className="text-[0.7rem] tracking-wide text-white/40 uppercase">
                    {study.sector}
                  </div>
                  <div className="mt-1.5 text-sm font-medium text-white">
                    {study.client}
                  </div>
                  <h3 className="mt-4 text-lg leading-snug font-semibold text-balance text-white/90">
                    {study.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-pretty text-white/50">
                    {study.body}
                  </p>

                  <div className="mt-6 flex gap-6 border-t border-white/8 pt-5">
                    {study.metrics.map((metric) => (
                      <Metric key={metric.label} {...metric} />
                    ))}
                  </div>

                  <div className="mt-5 pt-1">
                    <Tags tags={study.tags} />
                  </div>
                </motion.div>
              </SpotlightCard>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </Section>
  );
}
