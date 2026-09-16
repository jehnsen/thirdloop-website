import { cn } from "@/lib/utils";

type Theme = "home" | "products" | "team" | "admin";

/**
 * Fixed ambient wash behind every page: the ink base plus three soft radials.
 * Each route gets its own tint, so the palette shifts as you move around.
 */
export function PageBackdrop({ theme = "home" }: { theme?: Theme }) {
  return (
    <div
      aria-hidden
      className={cn("page-bg pointer-events-none fixed inset-0 -z-10", `theme-${theme}`)}
    />
  );
}

/** Hairline rule used between major sections. */
export function GlowDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "mx-auto h-px w-full max-w-7xl bg-linear-to-r from-transparent via-hair/25 to-transparent",
        className,
      )}
    />
  );
}
