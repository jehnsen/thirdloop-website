"use client";

import { useInView } from "framer-motion";
import { GitBranch, Layers, LineChart, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/motion-primitives";
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
    <Section className="panel-light border-b border-slate-200 py-20 sm:py-24">
      <Container>
        <SectionHeader
          tone="light"
          eyebrow="Core values"
          title={
            <>
              What guides <span className="text-gradient">every loop.</span>
            </>
          }
          meta="Principles over process"
          description="First you build it. Then you refine it. The third pass is where a system starts giving time back instead of consuming it."
        />

        <Reveal delay={0.1}>
          <div className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;

              return (
                <article
                  key={pillar.title}
                  className="group bg-white p-7 transition-colors duration-200 hover:bg-slate-50 lg:p-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] tracking-[0.2em] text-flux-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Icon aria-hidden className="size-4 text-flux-600" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold tracking-tight text-balance text-panel-ink lg:text-lg">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-pretty text-panel-muted lg:text-sm">
                    {pillar.body}
                  </p>
                </article>
              );
            })}
          </div>
        </Reveal>

        {/* <Reveal delay={0.16}>
          <dl className="mt-12 grid grid-cols-2 gap-8 border-t border-slate-200 pt-10 lg:grid-cols-4">
            {counters.map((counter) => (
              <div key={counter.label}>
                <dt className="sr-only">{counter.label}</dt>
                <dd>
                  <span className="block font-display text-3xl font-bold tracking-tight text-panel-ink sm:text-4xl">
                    <Counter
                      value={counter.value}
                      suffix={counter.suffix}
                      decimals={counter.decimals}
                    />
                  </span>
                  <span className="mt-2 block font-mono text-[10px] leading-snug tracking-[0.15em] text-slate-500 uppercase">
                    {counter.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal> */}
      </Container>
    </Section>
  );
}
