import { cn } from "@/lib/utils";

/** Fixed dot-grid + aurora wash that sits behind the whole page. */
export function PageBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950"
    >
      <div className="absolute inset-0 animate-grid-fade [background-image:radial-gradient(circle_at_center,rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute -top-40 -left-32 size-[38rem] animate-drift rounded-full bg-loop-600/22 blur-[130px]" />
      <div className="absolute top-1/3 -right-40 size-[34rem] animate-drift-slow rounded-full bg-plasma-600/16 blur-[140px]" />
      <div className="absolute bottom-0 left-1/3 size-[30rem] animate-drift rounded-full bg-flux-600/12 blur-[150px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_20%,var(--color-ink-950)_78%)]" />
    </div>
  );
}

/** Thin animated separator used between major sections. */
export function GlowDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "mx-auto h-px w-full max-w-6xl bg-linear-to-r from-transparent via-white/15 to-transparent",
        className,
      )}
    />
  );
}
