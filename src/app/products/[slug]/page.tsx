import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, ExternalLink } from "lucide-react";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PageBackdrop } from "@/components/ui/backdrop";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/ui/motion-primitives";
import { Container, Section } from "@/components/ui/section";
import { ProductIcon } from "@/components/ui/product-icon";
import { SpotlightCard } from "@/components/ui/spotlight-card";
import {
  getPublishedProduct,
  getPublishedProducts,
} from "@/lib/product-store";
import { productStatusStyles } from "@/lib/products";
import { cn } from "@/lib/utils";

type Params = { params: Promise<{ slug: string }> };

// Same reasoning as the products index: without this, a product added after
// the last deploy has no static page and DB edits never reach the site.
export const revalidate = 300;

export async function generateStaticParams() {
  const products = await getPublishedProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);

  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.summary,
    openGraph: {
      title: `${product.name} — 3rdLoop Solutions`,
      description: product.summary,
    },
  };
}

export default async function ProductDetailPage({ params }: Params) {
  const { slug } = await params;
  const products = await getPublishedProducts();
  const index = products.findIndex((p) => p.slug === slug);

  if (index === -1) notFound();

  const product = products[index];
  const next = products[(index + 1) % products.length];

  return (
    <>
      <PageBackdrop theme="products" />
      <Navbar />
      <main id="main">
        {/* Hero */}
        <Section className="pt-36 pb-12 sm:pt-44 sm:pb-16">
          <Container>
            <Reveal>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 text-sm text-mist transition-colors hover:text-cream"
              >
                <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                All products
              </Link>
            </Reveal>

            <div className="mt-9 grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
              <div>
                <Reveal delay={0.05}>
                  <div className="flex flex-wrap items-center gap-3">
                    <div
                      className="inline-flex size-13 items-center justify-center rounded-xl border border-hair/20"
                      style={{
                        background: `color-mix(in oklab, ${product.accent} 16%, transparent)`,
                      }}
                    >
                      <ProductIcon
                        icon={product.icon}
                        className="size-6"
                        style={{ color: product.accent }}
                      />
                    </div>
                    <span
                      className={cn(
                        "rounded-full border px-3 py-1 text-xs font-medium",
                        productStatusStyles[product.status],
                      )}
                    >
                      {product.status}
                    </span>
                    <span className="rounded-full border border-hair/20 bg-white/4 px-3 py-1 text-xs text-mist">
                      {product.category}
                    </span>
                  </div>
                </Reveal>

                <Reveal delay={0.1}>
                  <h1 className="mt-7 text-4xl font-display font-semibold tracking-tight text-balance text-cream sm:text-5xl sm:leading-[1.08]">
                    {product.name}
                  </h1>
                </Reveal>

                <Reveal delay={0.15}>
                  <p className="mt-4 text-lg leading-relaxed text-pretty text-mist sm:text-xl">
                    {product.tagline}
                  </p>
                </Reveal>

                {product.url ? (
                  <Reveal delay={0.2}>
                    <div className="mt-8">
                      <MagneticButton
                        href={product.url}
                        className="px-6 py-3"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit {product.status === "Demo" ? "demo" : "site"}
                        <ExternalLink className="size-4" />
                      </MagneticButton>
                    </div>
                  </Reveal>
                ) : null}
              </div>

              {/* Fact panel */}
              <Reveal delay={0.18}>
                <dl className="glass-panel divide-y divide-hair/15 rounded-2xl">
                  {product.facts.map((fact) => (
                    <div
                      key={fact.label}
                      className="flex items-baseline justify-between gap-4 px-6 py-4"
                    >
                      <dt className="text-xs tracking-wide text-mist/70 uppercase">
                        {fact.label}
                      </dt>
                      <dd className="text-right text-sm font-medium text-cream">
                        {fact.value}
                      </dd>
                    </div>
                  ))}
                  <div className="flex items-baseline justify-between gap-4 px-6 py-4">
                    <dt className="text-xs tracking-wide text-mist/70 uppercase">
                      Industry
                    </dt>
                    <dd className="text-right text-sm font-medium text-cream">
                      {product.industry}
                    </dd>
                  </div>
                </dl>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* Challenge + approach */}
        <Section className="py-8 sm:py-12">
          <Container>
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
              <Reveal>
                <SpotlightCard className="h-full" glowColor={product.accent}>
                  <div className="p-8 sm:p-9">
                    <h2 className="font-mono text-[11px] tracking-[0.25em] text-mist/70 uppercase">
                      The challenge
                    </h2>
                    <p className="mt-5 leading-relaxed text-pretty text-mist">
                      {product.challenge}
                    </p>
                  </div>
                </SpotlightCard>
              </Reveal>

              <Reveal delay={0.08}>
                <SpotlightCard className="h-full" glowColor={product.accent}>
                  <div className="p-8 sm:p-9">
                    <h2 className="font-mono text-[11px] tracking-[0.25em] text-mist/70 uppercase">
                      Our approach
                    </h2>
                    <p className="mt-5 leading-relaxed text-pretty text-mist">
                      {product.approach}
                    </p>
                  </div>
                </SpotlightCard>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* Features */}
        <Section className="py-14 sm:py-20">
          <Container>
            <Reveal>
              <h2 className="text-2xl font-display font-semibold tracking-tight text-cream sm:text-3xl">
                What it does
              </h2>
            </Reveal>

            <StaggerGroup
              className="mt-10 grid gap-5 sm:grid-cols-2"
              staggerChildren={0.08}
            >
              {product.features.map((feature, i) => (
                <StaggerItem key={feature.title} className="h-full">
                  <div className="glass-panel h-full rounded-2xl p-6 transition-colors duration-500 hover:border-hair/35">
                    <span
                      className="font-mono text-xs tracking-[0.2em]"
                      style={{ color: product.accent }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-base leading-snug font-semibold text-balance text-cream">
                      {feature.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-pretty text-mist">
                      {feature.body}
                    </p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </Container>
        </Section>

        {/* Outcomes + stack */}
        <Section className="py-8 sm:py-12">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              <Reveal>
                <h2 className="text-2xl font-display font-semibold tracking-tight text-cream sm:text-3xl">
                  What it changes
                </h2>
                <ul className="mt-7 space-y-4">
                  {product.outcomes.map((outcome) => (
                    <li
                      key={outcome}
                      className="flex items-start gap-3 text-[0.95rem] leading-relaxed text-mist"
                    >
                      <Check
                        className="mt-1 size-4 shrink-0"
                        style={{ color: product.accent }}
                      />
                      {outcome}
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.08}>
                <h2 className="text-2xl font-display font-semibold tracking-tight text-cream sm:text-3xl">
                  Built with
                </h2>
                <ul className="mt-7 flex flex-wrap gap-2">
                  {product.stack.map((tech) => (
                    <li
                      key={tech}
                      className="glass-panel rounded-full px-4 py-2 text-sm text-mist"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </Container>
        </Section>

        {/* Next product + CTA */}
        <Section className="pt-16 pb-24 sm:pt-20 sm:pb-32">
          <Container>
            <div className="grid gap-6 lg:grid-cols-2">
              <Reveal>
                <SpotlightCard glowColor={next.accent} className="h-full">
                  <Link
                    href={`/products/${next.slug}`}
                    className="flex h-full flex-col justify-between gap-6 p-8 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-flux-400"
                  >
                    <span className="font-mono text-[11px] tracking-[0.25em] text-mist/70 uppercase">
                      Next product
                    </span>
                    <div>
                      <h3 className="text-xl font-display font-semibold tracking-tight text-cream">
                        {next.name}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-pretty text-mist">
                        {next.tagline}
                      </p>
                    </div>
                    <span
                      className="inline-flex items-center gap-1.5 text-sm font-medium"
                      style={{ color: next.accent }}
                    >
                      View details
                      <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </SpotlightCard>
              </Reveal>

              <Reveal delay={0.08}>
                <div className="flex h-full flex-col justify-between gap-6 rounded-2xl border border-hair/20 bg-ink-800/60 p-8 backdrop-blur-sm">
                  <div>
                    <h3 className="text-xl font-display font-semibold tracking-tight text-balance text-cream">
                      Want something like this built for you?
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-pretty text-mist">
                      Tell us what you&apos;re running today and we&apos;ll
                      scope it — starting with a fixed-price discovery.
                    </p>
                  </div>
                  <div>
                    <MagneticButton href="/#contact" className="px-6 py-3">
                      Start a conversation
                      <ArrowUpRight className="size-4" />
                    </MagneticButton>
                  </div>
                </div>
              </Reveal>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
