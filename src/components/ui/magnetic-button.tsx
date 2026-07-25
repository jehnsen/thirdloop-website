"use client";

import { motion, useMotionTemplate, useSpring } from "framer-motion";
import { useRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-loop-500 text-white shadow-[0_10px_40px_-12px_var(--color-loop-500)] hover:bg-loop-400",
  secondary:
    "glass-panel text-white/90 hover:text-white hover:border-white/20",
  ghost: "text-white/70 hover:text-white",
};

type MagneticButtonProps = {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  className?: string;
  /** how far the button drifts toward the cursor, in px */
  strength?: number;
  /** fires on both the anchor and button renderings */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** anchor-only, applied when `href` is set */
  target?: string;
  rel?: string;
} & Omit<ComponentPropsWithoutRef<"button">, "ref" | "onClick">;

export function MagneticButton({
  children,
  href,
  variant = "primary",
  className,
  strength = 6,
  target,
  rel,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 260, damping: 18 });
  const y = useSpring(0, { stiffness: 260, damping: 18 });
  const transform = useMotionTemplate`translate3d(${x}px, ${y}px, 0)`;

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    x.set((relX / rect.width) * strength * 2);
    y.set((relY / rect.height) * strength * 2);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  const classes = cn(
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-medium tracking-tight transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-loop-400",
    variantStyles[variant],
    className,
  );

  const inner = (
    <>
      <span
        aria-hidden
        className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full"
      />
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </>
  );

  const { onClick, ...buttonProps } = props;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ transform }}
      className={cn("inline-block", className?.includes("w-full") && "w-full")}
    >
      {href ? (
        <a
          href={href}
          className={classes}
          onClick={onClick}
          target={target}
          rel={rel}
        >
          {inner}
        </a>
      ) : (
        <button className={classes} onClick={onClick} {...buttonProps}>
          {inner}
        </button>
      )}
    </motion.div>
  );
}
