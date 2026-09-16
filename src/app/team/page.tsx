import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AvatarMonogram } from "@/components/ui/avatar-monogram";
import { PageBackdrop } from "@/components/ui/backdrop";
import { MagneticButton } from "@/components/ui/magnetic-button";
import {
  Reveal,
  StaggerGroup,
  StaggerItem,
} from "@/components/ui/motion-primitives";
import { Container, Eyebrow, Section } from "@/components/ui/section";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import { team, teamPrinciples } from "@/lib/team";

export const metadata: Metadata = {
  title: "Team",
  description:
    "The people behind 3rdLoop Solutions — Michael Manabat (CEO), decades of business analysis and project management in banking, and Jehnsen Enrique (CTO), 15+ years in software engineering and applied AI.",
  openGraph: {
    title: "Team — 3rdLoop Solutions",
    description:
      "The people behind 3rdLoop Solutions: senior practitioners doing the actual work.",
  },
};

export default function TeamPage() {
  return (
    <>
      <PageBackdrop theme="team" />
      <Navbar />
      <main id="main">
        {/* Intro */}
        <Section className="pt-36 pb-10 sm:pt-44 sm:pb-12">
          <Container>
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
              <Reveal>
                <Eyebrow>The team</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h1 className="text-4xl font-display font-semibold tracking-tight text-balance text-cream sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                  Small by design,{" "}
                  <span className="text-gradient">senior by default</span>
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="text-base leading-relaxed text-pretty text-mist sm:text-lg">
                  Five practitioners covering the whole span of an engagement —
                  the business analysis that works out what should be built, and
                  the engineering that builds it. The people you meet on the
                  first call are the people who do the work.
                </p>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* Members */}
        <Section className="py-8 sm:py-12">
          <Container>
            <div className="space-y-8">
              {team.map((member, index) => (
                <Reveal key={member.slug} delay={index * 0.08}>
                  <SpotlightCard glowColor={member.accent} radius={520}>
                    <article className="grid gap-10 p-8 sm:p-11 lg:grid-cols-[auto_1fr] lg:gap-14 lg:p-12">
                      {/* Portrait + facts — tracks alongside the longer bio */}
                      <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:w-60 lg:self-start">
                        <AvatarMonogram
                          initials={member.initials}
                          accent={member.accent}
                          photo={member.photo}
                          name={member.name}
                          priority={index === 0}
                          className="w-40 lg:w-full"
                        />
                        <dl className="space-y-3">
                          {member.facts.map((fact) => (
                            <div
                              key={fact.label}
                              className="flex items-baseline justify-between gap-4 border-b border-hair/20 pb-2.5"
                            >
                              <dt className="text-[0.68rem] tracking-wide text-mist/70 uppercase">
                                {fact.label}
                              </dt>
                              <dd className="text-right text-xs font-medium text-cream">
                                {fact.value}
                              </dd>
                            </div>
                          ))}
                        </dl>

                        {member.links.length ? (
                          <ul className="flex flex-wrap gap-2">
                            {member.links.map((link) => (
                              <li key={link.label}>
                                <a
                                  href={link.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group inline-flex items-center gap-1.5 rounded-full border border-hair/20 bg-white/4 px-3 py-1.5 text-xs text-mist transition-colors hover:border-hair/35 hover:text-cream"
                                >
                                  {link.label}
                                  <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>

                      {/* Body */}
                      <div>
                        <span
                          className="font-mono text-[11px] tracking-[0.25em] uppercase"
                          style={{ color: member.accent }}
                        >
                          {member.role}
                        </span>
                        <h2 className="mt-2.5 text-3xl font-display font-semibold tracking-tight text-cream sm:text-4xl">
                          {member.name}
                        </h2>
                        <p className="mt-3.5 text-base leading-relaxed text-pretty text-mist sm:text-lg">
                          {member.tagline}
                        </p>

                        {member.bio.length > 0 ? (
                        <div className="mt-7 space-y-4 border-t border-hair/20 pt-7">
                          {member.bio.map((paragraph) => (
                            <p
                              key={paragraph.slice(0, 40)}
                              className="text-[0.95rem] leading-relaxed text-pretty text-mist"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                        ) : null}

                        {member.focus.length > 0 || member.expertise.length > 0 ? (
                        <div className="mt-8 grid gap-8 border-t border-hair/20 pt-7 sm:grid-cols-2">
                          {member.focus.length > 0 ? (
                          <div>
                            <h3 className="font-mono text-[0.66rem] tracking-[0.2em] text-mist/70 uppercase">
                              Owns
                            </h3>
                            <ul className="mt-4 space-y-2.5">
                              {member.focus.map((item) => (
                                <li
                                  key={item}
                                  className="flex items-start gap-2.5 text-sm leading-snug text-mist"
                                >
                                  <Check
                                    className="mt-0.5 size-3.5 shrink-0"
                                    style={{ color: member.accent }}
                                  />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                          ) : null}

                          {member.expertise.length > 0 ? (
                          <div>
                            <h3 className="font-mono text-[0.66rem] tracking-[0.2em] text-mist/70 uppercase">
                              Expertise
                            </h3>
                            <ul className="mt-4 flex flex-wrap gap-1.5">
                              {member.expertise.map((skill) => (
                                <li
                                  key={skill}
                                  className="rounded-full border border-hair/20 bg-white/4 px-2.5 py-1 text-[0.68rem] text-mist"
                                >
                                  {skill}
                                </li>
                              ))}
                            </ul>
                          </div>
                          ) : null}
                        </div>
                        ) : null}
                      </div>
                    </article>
                  </SpotlightCard>
                </Reveal>
              ))}
            </div>
          </Container>
        </Section>

        {/* How we work */}
        <Section className="py-16 sm:py-24">
          <Container>
            <Reveal>
              <h2 className="max-w-2xl text-2xl font-display font-semibold tracking-tight text-balance text-cream sm:text-3xl">
                What working with a team this size{" "}
                <span className="text-gradient">actually means</span>
              </h2>
            </Reveal>

            <StaggerGroup
              className="mt-10 grid gap-5 lg:grid-cols-3"
              staggerChildren={0.1}
            >
              {teamPrinciples.map((principle, i) => (
                <StaggerItem key={principle.title} className="h-full">
                  <div className="glass-panel h-full rounded-2xl p-7 transition-colors duration-500 hover:border-hair/35">
                    <span className="font-mono text-xs tracking-[0.2em] text-loop-300">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3.5 text-lg leading-snug font-semibold text-balance text-cream">
                      {principle.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-pretty text-mist">
                      {principle.body}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </Container>
        </Section>

        {/* CTA */}
        <Section className="pt-4 pb-24 sm:pb-32">
          <Container>
            <Reveal>
              <div className="flex flex-col items-center gap-6 rounded-3xl border border-hair/20 bg-ink-800/60 px-8 py-14 text-center backdrop-blur-sm">
                <h2 className="max-w-xl text-2xl font-display font-semibold tracking-tight text-balance text-cream sm:text-3xl">
                  Talk to the people who&apos;ll{" "}
                  <span className="text-gradient">do the work</span>
                </h2>
                <p className="max-w-xl leading-relaxed text-pretty text-mist">
                  The first call is a free 30-minute conversation with both of
                  us — no account manager in between, no deck.
                </p>
                <div className="mt-2 flex flex-wrap justify-center gap-3">
                  <MagneticButton href="/#contact" className="px-7 py-3.5">
                    Book a discovery call
                    <ArrowUpRight className="size-4" />
                  </MagneticButton>
                  <Link
                    href="/products"
                    className="glass-panel inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-cream transition-colors hover:border-hair/35 hover:text-cream"
                  >
                    See what we&apos;ve built
                  </Link>
                </div>
              </div>
            </Reveal>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
