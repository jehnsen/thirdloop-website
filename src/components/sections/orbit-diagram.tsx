"use client";

import { motion } from "framer-motion";
import { Bot, Boxes, Smartphone, Workflow } from "lucide-react";
import { EASE } from "@/components/ui/motion-primitives";

const nodes = [
  { icon: Boxes, label: "Web", angle: -90, color: "var(--color-loop-400)" },
  { icon: Smartphone, label: "Mobile", angle: 0, color: "var(--color-flux-400)" },
  { icon: Workflow, label: "Automation", angle: 90, color: "var(--color-plasma-400)" },
  { icon: Bot, label: "AI", angle: 180, color: "var(--color-loop-300)" },
];

/**
 * The hero visual: a rotating ring of capability nodes around a core.
 * The ring counter-rotates its children so icons stay upright.
 */
export function OrbitDiagram() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease: EASE, delay: 0.4 }}
      className="relative mx-auto aspect-square w-full max-w-104"
    >
      {/* concentric rings */}
      {[100, 78, 56].map((size, i) => (
        <div
          key={size}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/8"
          style={{
            width: `${size}%`,
            height: `${size}%`,
            animation: `pulse-ring ${5 + i * 1.5}s ease-out infinite`,
            animationDelay: `${i * 0.9}s`,
            opacity: 0.5,
          }}
        />
      ))}
      <div className="absolute top-1/2 left-1/2 size-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/10" />
      <div className="absolute top-1/2 left-1/2 size-full -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/6" />

      {/* rotating node ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0"
      >
        {/* spokes rotate with the ring so they stay attached to the nodes */}
        <svg
          className="pointer-events-none absolute inset-0 size-full"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <defs>
            {/* radial so every spoke fades outward from the core regardless of direction */}
            <radialGradient
              id="spoke"
              gradientUnits="userSpaceOnUse"
              cx="50"
              cy="50"
              r="39"
            >
              <stop stopColor="var(--color-loop-300)" stopOpacity="0.75" />
              <stop
                offset="1"
                stopColor="var(--color-plasma-400)"
                stopOpacity="0.12"
              />
            </radialGradient>
          </defs>
          {nodes.map((node) => {
            const rad = (node.angle * Math.PI) / 180;
            return (
              <motion.line
                key={node.label}
                x1="50"
                y1="50"
                x2={50 + 39 * Math.cos(rad)}
                y2={50 + 39 * Math.sin(rad)}
                stroke="url(#spoke)"
                strokeWidth="0.6"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1, ease: EASE, delay: 1 }}
              />
            );
          })}
        </svg>

        {nodes.map((node, index) => {
          const Icon = node.icon;
          const radius = 39; // % from centre
          const rad = (node.angle * Math.PI) / 180;
          const left = 50 + radius * Math.cos(rad);
          const top = 50 + radius * Math.sin(rad);

          return (
            <motion.div
              key={node.label}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${left}%`, top: `${top}%` }}
              animate={{ rotate: -360 }}
              transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.6,
                  ease: EASE,
                  delay: 0.8 + index * 0.12,
                }}
                className="glass-panel flex size-[4.6rem] flex-col items-center justify-center gap-1 rounded-2xl"
              >
                <Icon className="size-5" style={{ color: node.color }} />
                <span className="text-[0.62rem] font-medium tracking-wide text-white/65">
                  {node.label}
                </span>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* core */}
      <motion.div
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 flex size-[38%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-white/12 bg-linear-to-br from-loop-600/35 via-ink-800 to-plasma-600/25 backdrop-blur-md"
      >
        <div className="absolute inset-0 rounded-full bg-loop-500/12 blur-2xl" />
        <span className="relative z-10 font-mono text-[0.6rem] tracking-[0.3em] text-white/45 uppercase">
          3rdLoop
        </span>
        <span className="relative z-10 mt-1 text-center text-[0.78rem] leading-tight font-semibold text-white">
          Systems
          <br />
          that learn
        </span>
      </motion.div>

    </motion.div>
  );
}
