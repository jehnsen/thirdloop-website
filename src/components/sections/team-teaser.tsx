import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { AvatarMonogram } from "@/components/ui/avatar-monogram";
import { Reveal } from "@/components/ui/motion-primitives";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { team } from "@/lib/team";

export function TeamTeaser() {
  return (
    <Section>
      <Container>
        <SectionHeader
          eyebrow="Who you work with"
          title={
            <>
              The people who&apos;ll{" "}
              <span className="text-gradient">do the work</span>
            </>
          }
          description="No account managers, no bench of juniors. The two of us run discovery, design the architecture and write the code."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {team.map((member, index) => (
            <Reveal key={member.slug} delay={index * 0.08}>
              <SpotlightCard glowColor={member.accent} className="h-full">
                <Link
                  href="/team"
                  className="flex h-full items-start gap-6 p-7 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-loop-400"
                >
                  <AvatarMonogram
                    initials={member.initials}
                    accent={member.accent}
                    className="w-24 shrink-0"
                  />
                  <div>
                    <span
                      className="font-mono text-[0.64rem] tracking-[0.18em] uppercase"
                      style={{ color: member.accent }}
                    >
                      {member.role}
                    </span>
                    <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
                      {member.name}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-pretty text-white/50">
                      {member.tagline}
                    </p>
                    <span
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium"
                      style={{ color: member.accent }}
                    >
                      Read more
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}
