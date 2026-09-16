"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Card whose border + background follow the cursor with a radial spotlight.
 * The glow is driven by motion values so it never triggers React re-renders.
 */
export function SpotlightCard({
  children,
  className,
  glowColor = "var(--color-flux-500)",
  radius = 340,
}: {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  const background = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, color-mix(in oklab, ${glowColor} 18%, transparent), transparent 70%)`;
  const borderBackground = useMotionTemplate`radial-gradient(${radius}px circle at ${mouseX}px ${mouseY}px, color-mix(in oklab, ${glowColor} 70%, transparent), transparent 65%)`;

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  function handleLeave() {
    mouseX.set(-9999);
    mouseY.set(-9999);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-hair/20 bg-ink-800/60 backdrop-blur-sm transition-colors duration-500",
        className,
      )}
    >
      {/* animated border */}
      <motion.div
        aria-hidden
        style={{ background: borderBackground }}
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="absolute inset-px rounded-[calc(var(--radius-2xl)-1px)] bg-ink-800/85" />
      {/* inner glow */}
      <motion.div
        aria-hidden
        style={{ background }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
