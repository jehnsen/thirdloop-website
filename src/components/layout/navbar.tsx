"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { EASE } from "@/components/ui/motion-primitives";
import { navLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

const ctaClass =
  "group inline-flex items-center gap-2 rounded-full border border-flux-500/40 bg-flux-500/5 px-4 py-2 font-mono text-[11px] tracking-[0.18em] text-flux-500 uppercase transition-colors duration-200 hover:bg-flux-500/15 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-flux-400";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const { scrollY, scrollYProgress } = useScroll();
  const pathname = usePathname();
  const onHome = pathname === "/";

  // Off the home page the highlighted item is the route itself, which is
  // derivable from the pathname — only section tracking needs state.
  const active = onHome
    ? activeSection
    : (navLinks.find(
        (link) => link.kind === "route" && pathname.startsWith(link.href),
      )?.href ?? "");

  /** Hash links only resolve on the home page; prefix them elsewhere. */
  function resolveHref(link: (typeof navLinks)[number]) {
    return link.kind === "hash" && !onHome ? `/${link.href}` : link.href;
  }

  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    restDelta: 0.001,
  });

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 24);
  });

  // Highlight the nav item for the section currently in view (home page only).
  useEffect(() => {
    if (!onHome) return;

    const sections = navLinks
      .filter((link) => link.kind === "hash")
      .map((link) => document.querySelector(link.href))
      .filter((el): el is Element => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: [0, 0.25, 0.6] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [onHome]);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={cn(
            "border-b transition-colors duration-300",
            scrolled
              ? "border-hair/20 bg-ink-800/70 backdrop-blur-xl"
              : "border-transparent",
          )}
        >
          <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
            <Logo />

            <ul className="hidden items-center gap-7 lg:flex">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={resolveHref(link)}
                    className={cn(
                      "relative py-1 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors duration-200",
                      active === link.href
                        ? "text-cream"
                        : "text-mist hover:text-cream",
                    )}
                  >
                    {link.label}
                    {active === link.href ? (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-0.5 left-0 h-px w-full bg-flux-500"
                        transition={{ duration: 0.4, ease: EASE }}
                      />
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <Link
                href={onHome ? "#contact" : "/#contact"}
                className={cn(ctaClass, "hidden sm:inline-flex")}
              >
                Start a project
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>

              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="inline-flex size-10 items-center justify-center rounded-full border border-hair/25 text-cream transition-colors hover:bg-white/5 lg:hidden"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </nav>
        </div>

        <motion.div
          style={{ scaleX: progress }}
          className="h-px origin-left bg-linear-to-r from-loop-500 to-flux-500"
        />
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-ink-950/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex h-full flex-col justify-center overflow-y-auto px-8 py-24">
              <ul className="space-y-1">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: EASE,
                      delay: 0.08 + index * 0.06,
                    }}
                  >
                    <Link
                      href={resolveHref(link)}
                      onClick={() => setOpen(false)}
                      className="flex items-baseline gap-4 border-b border-hair/15 py-4 font-display text-3xl font-semibold tracking-tight text-cream/90 transition-colors hover:text-cream"
                    >
                      <span className="font-mono text-xs text-flux-500">
                        0{index + 1}
                      </span>
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.45 }}
                className="mt-10"
              >
                <Link
                  href={onHome ? "#contact" : "/#contact"}
                  onClick={() => setOpen(false)}
                  className={cn(ctaClass, "w-full justify-center py-3")}
                >
                  Start a project
                  <ArrowRight className="size-3.5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
