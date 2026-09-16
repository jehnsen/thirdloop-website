"use client";

import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/motion-primitives";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { cn } from "@/lib/utils";

const groups = [
  {
    label: "Frontend",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "React Native", "Expo"],
  },
  {
    label: "Backend & Data",
    items: ["Node.js", "Python", "PostgreSQL", "Redis", "Prisma", "tRPC"],
  },
  {
    label: "AI & Automation",
    items: ["OpenAI", "LangGraph", "Vector DBs", "Temporal", "n8n"],
  },
  {
    label: "Infrastructure",
    items: ["AWS", "Vercel", "Docker", "Terraform", "GitHub Actions", "Cloudflare"],
  },
];

const marqueeItems = [
  "Next.js",
  "React Native",
  "TypeScript",
  "OpenAI",
  "PostgreSQL",
  "AWS",
  "Tailwind",
  "Python",
  "REST APIs",
  "Vercel",
  "Docker",
  "LangGraph",
  "Node.js",
  "PHP",
  "MySQL",
  "Redis",
  "Prisma",
  "n8n",
  "Serverless",
  "Microservices",
  "Vector Embeddings",
  "Git"
];

function Marquee({ reverse = false }: { reverse?: boolean }) {
  return (
    <div className="mask-fade-x flex overflow-hidden">
      <div
        className={cn(
          "flex shrink-0 items-center gap-4 pr-4",
          reverse ? "animate-marquee-slow flex-row-reverse" : "animate-marquee",
        )}
      >
        {[...marqueeItems, ...marqueeItems].map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="glass-panel rounded-full px-5 py-2.5 text-sm whitespace-nowrap text-mist"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Stack() {
  return (
    <Section id="stack">
      <Container>
        <SectionHeader
          eyebrow="Our toolkit"
          title={
            <>
              Boring technology,{" "}
              <span className="text-gradient">used exceptionally well</span>
            </>
          }
          description="We pick tools your next engineer will already know. No bespoke frameworks, no lock-in you didn't agree to."
        />

        <StaggerGroup
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
          staggerChildren={0.09}
        >
          {groups.map((group) => (
            <StaggerItem key={group.label}>
              <div className="glass-panel h-full rounded-2xl p-6 transition-colors duration-500 hover:border-hair/35">
                <h3 className="font-mono text-[11px] tracking-[0.25em] text-loop-300 uppercase">
                  {group.label}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm text-mist"
                    >
                      <span className="size-1 rounded-full bg-white/25" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>

      <Reveal delay={0.1} className="mt-14 space-y-4">
        <Marquee />
        <Marquee reverse />
      </Reveal>
    </Section>
  );
}
