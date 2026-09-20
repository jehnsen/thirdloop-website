"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { EASE } from "@/components/ui/motion-primitives";
import { Container, Eyebrow } from "@/components/ui/section";
import { OrbitDiagram } from "./orbit-diagram";

const headline = [
  { plain: "Technology and AI," },
  { plain: "built so a person is" },
  { plain: "", accent: "always in the loop." },
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
  const glow = useMotionTemplate`radial-gradient(600px circle at ${glowX}% ${glowY}%, rgba(0,184,169,0.16), transparent 65%)`;

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
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
            >
              <Eyebrow>Human-in-the-loop engineering</Eyebrow>
            </motion.div>

            <h1 className="mt-6 max-w-[21ch] font-display text-4xl font-bold leading-[1.02] tracking-tight text-balance text-cream sm:text-5xl lg:text-[3.4rem]">
              <span className="sr-only">
                {headline.map((l) => l.plain + (l.accent ?? "")).join(" ")}
              </span>
              <span aria-hidden>
                {headline.map((line, lineIndex) => (
                  <span
                    key={line.plain + (line.accent ?? "")}
                    className="block overflow-hidden pb-1"
                  >
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
              className="mt-7 max-w-[46ch] text-base leading-relaxed text-pretty text-mist sm:text-lg"
            >
              We design, automate, and ship production software and AI
              workflows for engineering teams — without trading away human
              judgment.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.72 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <MagneticButton href="#contact">
                Book a discovery call
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </MagneticButton>
              {/* <MagneticButton href="#services" variant="secondary">
                Explore capabilities
              </MagneticButton> */}
            </motion.div>

            {/* <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
              className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-hair/25 pt-6"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="block font-display text-2xl font-semibold tracking-tight text-cream sm:text-3xl">
                      {stat.value}
                    </span>
                    <span className="mt-1.5 block font-mono text-[10px] leading-snug tracking-[0.2em] text-mist uppercase">
                      {stat.label}
                    </span>
                  </dd>
                </div>
              ))}
            </motion.dl> */}
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
        <span className="font-mono text-[9px] tracking-[0.3em] text-mist/70 uppercase">
          Scroll
        </span>
        <span className="relative h-10 w-px overflow-hidden bg-hair/25">
          <motion.span
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-x-0 h-4 bg-linear-to-b from-transparent via-flux-400 to-transparent"
          />
        </span>
      </motion.div>
    </section>
  );
}
