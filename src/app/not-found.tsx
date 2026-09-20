import { ArrowRight, CompassIcon, SearchX } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { PageBackdrop } from "@/components/ui/backdrop";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { Reveal } from "@/components/ui/motion-primitives";
import { Container } from "@/components/ui/section";
import { navLinks } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist or has moved.",
  robots: { index: false, follow: true },
};

/** Root-level 404: rendered for any unmatched URL across the app. */
export default function NotFound() {
  return (
    <>
      <PageBackdrop theme="home" />
      <Navbar />
      <main id="main">
        <section className="relative flex min-h-[calc(100vh-1px)] items-center py-32 sm:py-40">
          <Container>
            <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
              <Reveal>
                <span className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] text-flux-500 uppercase">
                  <SearchX className="size-3.5" aria-hidden />
                  Error 404
                </span>
              </Reveal>

              <Reveal delay={0.06}>
                <h1 className="mt-6 font-display text-7xl font-bold tracking-tight text-gradient sm:text-8xl">
                  404
                </h1>
              </Reveal>

              <Reveal delay={0.12}>
                <h2 className="mt-4 font-display text-2xl font-bold tracking-tight text-cream sm:text-3xl">
                  This page has drifted out of orbit
                </h2>
              </Reveal>

              <Reveal delay={0.18}>
                <p className="mt-4 max-w-md text-base leading-relaxed text-mist sm:text-lg">
                  The page you&apos;re looking for doesn&apos;t exist, was
                  moved, or the link is out of date. Let&apos;s get you back
                  on track.
                </p>
              </Reveal>

              <Reveal delay={0.24}>
                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
                  <MagneticButton href="/" variant="primary">
                    Back to home
                    <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </MagneticButton>
                  <MagneticButton href="/products" variant="secondary">
                    View products
                  </MagneticButton>
                </div>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-hair/20 pt-8">
                  <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-mist/70 uppercase">
                    <CompassIcon className="size-3.5" aria-hidden />
                    Or find your way
                  </span>
                  {navLinks
                    .filter((link) => link.kind === "route")
                    .map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="font-mono text-[11px] tracking-[0.15em] text-mist uppercase transition-colors duration-200 hover:text-flux-400"
                      >
                        {link.label}
                      </Link>
                    ))}
                </div>
              </Reveal>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
