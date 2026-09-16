import {
  ArrowRight,
  Bot,
  Compass,
  Globe,
  Smartphone,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/motion-primitives";
import { Container, Section, SectionHeader } from "@/components/ui/section";

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
  return (
    <Section
      id="services"
      className="panel-light border-y border-slate-200 py-20 sm:py-24"
    >
      <Container>
        <SectionHeader
          tone="light"
          eyebrow="(A) — Service portfolio"
          title={
            <>
              Five disciplines, <span className="text-gradient">one team.</span>
            </>
          }
          meta="Strategy to execution"
          description="Most agencies hand you a build and walk away. We cover the strategy, the software and the automation that connects them."
        />

        <Reveal delay={0.1}>
          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.id}
                  className="group flex flex-col bg-white p-7 transition-colors duration-200 hover:bg-slate-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-flux-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon aria-hidden className="size-4 text-flux-600" />
                  </div>

                  <h3 className="mt-4 font-display text-base font-semibold tracking-tight text-panel-ink lg:text-lg">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-panel-muted lg:text-sm">
                    {service.summary}
                  </p>

                  <ul className="mt-5 space-y-2 border-t border-slate-200 pt-4">
                    {service.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-xs leading-relaxed text-panel-muted"
                      >
                        <ArrowRight
                          aria-hidden
                          className="mt-0.5 size-3 shrink-0 text-flux-600"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-auto pt-5 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-slate-500 uppercase">
                    {service.outcomes}
                  </p>
                </article>
              );
            })}

            <article className="flex flex-col justify-between gap-6 bg-white p-7 transition-colors duration-200 hover:bg-slate-50">
              <div>
                <span className="font-mono text-[11px] tracking-[0.2em] text-flux-600">
                  06
                </span>
                <h3 className="mt-4 font-display text-base font-semibold tracking-tight text-panel-ink lg:text-lg">
                  Not sure which you need?
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-panel-muted lg:text-sm">
                  Most engagements start as a mix. Tell us what you&rsquo;re running
                  today and we&rsquo;ll scope the shortest path to a result.
                </p>
              </div>
              <Link
                href="#contact"
                className="group/cta inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-flux-600 uppercase transition-colors hover:text-flux-500"
              >
                Start a conversation
                <ArrowRight
                  aria-hidden
                  className="size-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5"
                />
              </Link>
            </article>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
