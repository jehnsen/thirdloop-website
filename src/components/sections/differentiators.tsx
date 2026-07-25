"use client";

import { motion, useInView } from "framer-motion";
import { GitBranch, Layers, LineChart, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/motion-primitives";
import { Container, Section, SectionHeader } from "@/components/ui/section";

const pillars = [
  {
    icon: Layers,
    title: "Strategy and build, same team",
    body: "The people who design the architecture are the people who write the code. Nothing gets lost in a handoff between an advisory firm and a delivery shop.",
  },
  {
    icon: GitBranch,
    title: "You own everything",
    body: "Your repos, your cloud accounts, your data. No proprietary framework to license, no hosting lock-in, no dependency on us to keep the lights on.",
  },
  {
    icon: LineChart,
    title: "Measured against outcomes",
    body: "Every engagement names one metric up front — hours saved, conversion lifted, cost removed — and we report against it rather than against story points.",
  },
  {
    icon: ShieldCheck,
    title: "Honest about scope",
    body: "We turn down work we're not right for and talk clients out of features that won't pay off. It costs us revenue and it's the reason people come back.",
  },
];

const counters = [
  { value: 40, suffix: "+", label: "Products shipped end to end" },
  { value: 12, suffix: "k", label: "Manual hours automated yearly" },
  { value: 99.9, suffix: "%", label: "Uptime across deployments", decimals: 1 },
  { value: 30, suffix: "d", label: "Post-launch support included" },
];

/** Counts up to `value` once scrolled into view. */
function Counter({
  value,
  suffix,
  decimals = 0,
}: {
  value: number;
  suffix: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1500;
    const start = performance.now();
    let frame: number;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplay(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function Differentiators() {
  return (
    <Section>
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeader
            align="left"
            eyebrow="Why 3rdLoop"
            title={
              <>
                The third loop is where{" "}
                <span className="text-gradient">compounding starts</span>
              </>
            }
            description="First you build it. Then you refine it. The third pass is where a system starts giving time back instead of consuming it — that's the loop we're named for, and the one we optimise for."
            className="lg:sticky lg:top-28 lg:self-start"
          />

          <StaggerGroup className="grid gap-5 sm:grid-cols-2" staggerChildren={0.1}>
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <StaggerItem key={pillar.title} className="h-full">
                  <motion.div
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="glass-panel h-full rounded-2xl p-6 transition-colors duration-500 hover:border-white/18"
                  >
                    <div className="inline-flex size-10 items-center justify-center rounded-lg border border-white/10 bg-loop-500/12">
                      <Icon className="size-5 text-loop-300" />
                    </div>
                    <h3 className="mt-5 text-[0.98rem] leading-snug font-semibold text-balance text-white">
                      {pillar.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-pretty text-white/50">
                      {pillar.body}
                    </p>
                  </motion.div>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>

        <Reveal delay={0.1}>
          <dl className="mt-16 grid grid-cols-2 gap-8 border-t border-white/8 pt-12 lg:grid-cols-4">
            {counters.map((counter) => (
              <div key={counter.label}>
                <dt className="sr-only">{counter.label}</dt>
                <dd>
                  <span className="block text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    <Counter
                      value={counter.value}
                      suffix={counter.suffix}
                      decimals={counter.decimals}
                    />
                  </span>
                  <span className="mt-2 block text-xs leading-snug text-white/45">
                    {counter.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Container>
    </Section>
  );
}
