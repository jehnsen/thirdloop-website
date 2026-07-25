"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Play, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { EASE } from "@/components/ui/motion-primitives";
import { Container } from "@/components/ui/section";
import { OrbitDiagram } from "./orbit-diagram";

const headline = [
  { plain: "We build software" },
  { plain: "that scales with" },
  { plain: "you — and ", accent: "compounds." },
];

const stats = [
  { value: "40+", label: "Products shipped" },
  { value: "12k", label: "Manual hours automated / yr" },
  { value: "99.9%", label: "Uptime across deployments" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const orbitY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  // Cursor-follow glow behind the headline.
  const glowX = useSpring(useMotionValue(50), { stiffness: 60, damping: 20 });
  const glowY = useSpring(useMotionValue(40), { stiffness: 60, damping: 20 });
  const glow = useMotionTemplate`radial-gradient(600px circle at ${glowX}% ${glowY}%, rgba(51,129,251,0.16), transparent 65%)`;

  useEffect(() => {
    function onMove(event: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      glowX.set(((event.clientX - rect.left) / rect.width) * 100);
      glowY.set(((event.clientY - rect.top) / rect.height) * 100);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [glowX, glowY]);

  return (
    <section
      ref={ref}
      id="top"
      className="relative flex min-h-svh items-center overflow-hidden pt-28 pb-24 sm:pt-32 xl:pb-32"
    >
      <motion.div
        aria-hidden
        style={{ background: glow }}
        className="pointer-events-none absolute inset-0"
      />

      <Container className="relative z-10">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          <motion.div style={{ y: contentY, opacity: contentOpacity }}>
            <motion.a
              href="#services"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
              className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 py-1.5 pr-4 pl-1.5 text-xs text-white/70 transition-colors hover:border-white/20 hover:text-white"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full bg-loop-500/15 px-2.5 py-1 font-medium text-loop-200">
                <Sparkles className="size-3" />
                AI-native
              </span>
              Engineering + automation under one roof
              <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>

            <h1 className="mt-7 text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl lg:text-6xl lg:leading-[1.05]">
              <span className="sr-only">
                {headline.map((l) => l.plain + (l.accent ?? "")).join(" ")}
              </span>
              <span aria-hidden>
                {headline.map((line, lineIndex) => (
                  <span key={line.plain} className="block overflow-hidden pb-1">
                    <motion.span
                      className="block"
                      initial={{ y: "108%" }}
                      animate={{ y: "0%" }}
                      transition={{
                        duration: 0.95,
                        ease: EASE,
                        delay: 0.25 + lineIndex * 0.11,
                      }}
                    >
                      {line.plain}
                      {line.accent ? (
                        <span className="text-gradient">{line.accent}</span>
                      ) : null}
                    </motion.span>
                  </span>
                ))}
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
              className="mt-6 max-w-xl text-base leading-relaxed text-pretty text-white/55 sm:text-lg"
            >
              3rdLoop Solutions designs, builds and operates web platforms,
              mobile apps, intelligent automations and AI systems — with the
              architecture and process consultancy that keeps them compounding
              long after launch.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.72 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <MagneticButton href="#contact" className="px-7 py-3.5">
                Book a discovery call
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </MagneticButton>
              <MagneticButton
                href="#work"
                variant="secondary"
                className="px-7 py-3.5"
              >
                <Play className="size-3.5 fill-current" />
                See our work
              </MagneticButton>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
              className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/8 pt-8"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                      {stat.value}
                    </span>
                    <span className="mt-1.5 block text-[0.7rem] leading-snug text-white/45 sm:text-xs">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </motion.dl>
          </motion.div>

          <motion.div style={{ y: orbitY }} className="relative">
            <OrbitDiagram />
          </motion.div>
        </div>
      </Container>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="pointer-events-none absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 xl:flex"
      >
        <span className="text-[0.65rem] tracking-[0.25em] text-white/35 uppercase">
          Scroll
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-white/12">
          <motion.span
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 h-4 bg-linear-to-b from-transparent via-loop-400 to-transparent"
          />
        </span>
      </motion.div>
    </section>
  );
}
