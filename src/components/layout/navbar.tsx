"use client";

import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/logo";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { EASE } from "@/components/ui/motion-primitives";
import { navLinks } from "@/lib/site";
import { cn } from "@/lib/utils";

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
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "transition-all duration-500",
            scrolled
              ? "border-b border-white/8 bg-ink-950/70 backdrop-blur-xl"
              : "border-b border-transparent",
          )}
        >
          <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:h-18 lg:px-8">
            <Logo />

            <ul className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={resolveHref(link)}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm transition-colors duration-300",
                      active === link.href
                        ? "text-white"
                        : "text-white/55 hover:text-white",
                    )}
                  >
                    {active === link.href ? (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full border border-white/10 bg-white/6"
                        transition={{ duration: 0.45, ease: EASE }}
                      />
                    ) : null}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <MagneticButton
                href={onHome ? "#contact" : "/#contact"}
                className="hidden px-5 py-2.5 text-[0.83rem] sm:inline-flex"
              >
                Start a project
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>

              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                className="glass-panel inline-flex size-10 items-center justify-center rounded-full text-white lg:hidden"
              >
                {open ? <X className="size-5" /> : <Menu className="size-5" />}
              </button>
            </div>
          </nav>
        </div>

        <motion.div
          style={{ scaleX: progress }}
          className="h-px origin-left bg-linear-to-r from-loop-500 via-flux-400 to-plasma-500"
        />
      </motion.header>

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
                      className="flex items-baseline gap-4 border-b border-white/6 py-4 text-3xl font-medium tracking-tight text-white/80 transition-colors hover:text-white"
                    >
                      <span className="font-mono text-xs text-loop-400">
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
                <MagneticButton
                  href={onHome ? "#contact" : "/#contact"}
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  Start a project
                  <ArrowUpRight className="size-4" />
                </MagneticButton>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
