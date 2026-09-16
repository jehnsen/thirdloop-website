import type { Metadata } from "next";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ProductsGrid } from "@/components/sections/products-grid";
import { PageBackdrop } from "@/components/ui/backdrop";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Reveal } from "@/components/ui/motion-primitives";
import { Container, Eyebrow, Section } from "@/components/ui/section";
import { getPublishedProducts } from "@/lib/product-store";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Web apps, AI solutions and internal tools built by 3rdLoop Solutions — from booking platforms and marketplaces to RAG assistants and point-of-sale systems.",
  openGraph: {
    title: "Products — 3rdLoop Solutions",
    description:
      "Web apps, AI solutions and internal tools built by 3rdLoop Solutions.",
  },
};

export default async function ProductsPage() {
  const products = await getPublishedProducts();
  const liveCount = products.filter((p) => p.url).length;

  return (
    <>
      <PageBackdrop theme="products" />
      <Navbar />
      <main id="main">
        <Section className="pt-36 pb-8 sm:pt-44 sm:pb-10">
          <Container>
            <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
              <Reveal>
                <Eyebrow>Our products</Eyebrow>
              </Reveal>
              <Reveal delay={0.06}>
                <h1 className="text-4xl font-display font-semibold tracking-tight text-balance text-cream sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                  Apps and solutions{" "}
                  <span className="text-gradient">we&apos;ve shipped</span>
                </h1>
              </Reveal>
              <Reveal delay={0.12}>
                <p className="text-base leading-relaxed text-pretty text-mist sm:text-lg">
                  Booking platforms, marketplaces, AI assistants and internal
                  tools — built for real operations across automotive,
                  agriculture, education and logistics. {liveCount} of them are
                  live or publicly demoable right now.
                </p>
              </Reveal>
            </div>
          </Container>
        </Section>

        <Section className="pt-4 pb-24 sm:pt-6 sm:pb-32">
          <Container>
            <ProductsGrid products={products} />

            <Reveal delay={0.15}>
              <div className="mt-20 flex flex-col items-center gap-6 rounded-3xl border border-hair/20 bg-ink-800/60 px-8 py-14 text-center backdrop-blur-sm">
                <h2 className="max-w-xl text-2xl font-display font-semibold tracking-tight text-balance text-cream sm:text-3xl">
                  Need something like these for{" "}
                  <span className="text-gradient">your operation?</span>
                </h2>
                <p className="max-w-xl leading-relaxed text-pretty text-mist">
                  Most of these started as a process someone was running on
                  spreadsheets and group chats. Tell us what yours looks like
                  and we&apos;ll scope it with you.
                </p>
                <MagneticButton href="/#contact" className="mt-2 px-7 py-3.5">
                  Start a conversation
                </MagneticButton>
              </div>
            </Reveal>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
