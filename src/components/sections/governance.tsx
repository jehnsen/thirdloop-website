import {
  ClipboardCheck,
  Clock,
  Eye,
  Layers,
  Lock,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/ui/motion-primitives";
import { Container, Section, SectionHeader } from "@/components/ui/section";

type Commitment = {
  icon: LucideIcon;
  title: string;
  body: string;
};

const commitments: Commitment[] = [
  {
    icon: ShieldCheck,
    title: "Data Privacy by Design",
    body: "Built against the Data Privacy Act and National Privacy Commission guidance from the first line of code — data minimization, purpose limitation, and audit trails, not a policy added after a complaint.",
  },
  {
    icon: Eye,
    title: "Human Oversight on Every AI Decision",
    body: "AI drafts, classifies, and recommends; a named person approves anything touching a citizen, tenant, or legal record. Every action is logged and attributable to a person, not a model.",
  },
  {
    icon: Clock,
    title: "99.9% Monitored Uptime",
    body: "Production systems run on redundant, continuously monitored infrastructure with defined recovery targets — the reliability bar a public-facing or investor-grade service is held to.",
  },
  {
    icon: Lock,
    title: "Data Residency You Control",
    body: "You decide where data lives and who can access it. Source code, data, and infrastructure stay with you — nothing is locked into a proprietary format we alone control.",
  },
  {
    icon: Layers,
    title: "Scales Without Re-platforming",
    body: "The same architecture running a single HOA or MSME today is designed to carry a province-wide rollout or an enterprise account tomorrow, without a rebuild.",
  },
  {
    icon: ClipboardCheck,
    title: "Audit-Ready by Default",
    body: "Every workflow leaves a record — who approved what, when, and on what basis — so a board, auditor, or oversight body can review activity without a special request.",
  },
];

export function Governance() {
  return (
    <Section
      id="governance"
      className="panel-light border-y border-slate-200 py-20 sm:py-24"
    >
      <Container>
        <SectionHeader
          tone="light"
          eyebrow="Technology & governance"
          title={
            <>
              Built for the People Who{" "}
              <span className="text-gradient">Have to Answer for It</span>
            </>
          }
          description="Boards, investors, and public officials don’t ask what framework we used — they ask who is accountable when something goes wrong, where the data lives, and whether the system still runs under pressure. Every platform decision is made against those questions first."
        />

        <Reveal delay={0.1}>
          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2 lg:grid-cols-3">
            {commitments.map((commitment) => {
              const Icon = commitment.icon;

              return (
                <article
                  key={commitment.title}
                  className="group bg-white p-7 transition-colors duration-200 hover:bg-slate-50"
                >
                  <Icon aria-hidden className="size-5 text-flux-600" />
                  <h3 className="mt-5 font-display text-base font-semibold tracking-tight text-balance text-panel-ink lg:text-lg">
                    {commitment.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-pretty text-panel-muted lg:text-sm">
                    {commitment.body}
                  </p>
                </article>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
