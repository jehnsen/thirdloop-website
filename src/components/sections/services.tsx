import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/ui/motion-primitives";
import { ProductIcon } from "@/components/ui/product-icon";
import { Container, Section, SectionHeader } from "@/components/ui/section";
import type { Service } from "@/lib/services";

export function Services({ services }: { services: Service[] }) {
  // Nothing to show while the portfolio is empty — don't render a bare heading.
  if (services.length === 0) return null;

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
            {services.map((service, index) => (
              <article
                key={service.id}
                className="group flex flex-col bg-white p-7 transition-colors duration-200 hover:bg-slate-50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] tracking-[0.2em] text-flux-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <ProductIcon
                    icon={service.icon}
                    aria-hidden
                    className="size-4"
                    style={{ color: service.color }}
                  />
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

                {service.outcomes ? (
                  <p className="mt-auto pt-5 font-mono text-[10px] leading-relaxed tracking-[0.12em] text-slate-500 uppercase">
                    {service.outcomes}
                  </p>
                ) : null}
              </article>
            ))}

            <article className="flex flex-col justify-between gap-6 bg-white p-7 transition-colors duration-200 hover:bg-slate-50">
              <div>
                <span className="font-mono text-[11px] tracking-[0.2em] text-flux-600">
                  {String(services.length + 1).padStart(2, "0")}
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
