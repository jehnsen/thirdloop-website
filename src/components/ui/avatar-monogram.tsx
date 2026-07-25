import { cn } from "@/lib/utils";

/**
 * Gradient monogram used in place of a photograph. Swap this for a real
 * <Image> once headshots are available — the layout reserves a square.
 */
export function AvatarMonogram({
  initials,
  accent,
  className,
}: {
  initials: string;
  accent: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-white/10",
        className,
      )}
      style={{
        background: `linear-gradient(150deg, color-mix(in oklab, ${accent} 28%, transparent) 0%, var(--color-ink-800) 55%, color-mix(in oklab, ${accent} 12%, transparent) 100%)`,
      }}
    >
      {/* concentric loop motif, echoing the logo */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        className="absolute inset-0 size-full opacity-45"
      >
        <circle
          cx="50"
          cy="38"
          r="26"
          fill="none"
          stroke="white"
          strokeOpacity="0.12"
          strokeWidth="0.7"
        />
        <circle
          cx="36"
          cy="58"
          r="26"
          fill="none"
          stroke="white"
          strokeOpacity="0.09"
          strokeWidth="0.7"
        />
        <circle
          cx="64"
          cy="58"
          r="26"
          fill="none"
          stroke={accent}
          strokeOpacity="0.4"
          strokeWidth="0.9"
        />
      </svg>

      <div
        aria-hidden
        className="absolute -inset-8 opacity-60 blur-2xl"
        style={{
          background: `radial-gradient(circle at 30% 25%, color-mix(in oklab, ${accent} 30%, transparent), transparent 60%)`,
        }}
      />

      <span
        className="relative z-10 text-4xl font-semibold tracking-tight text-white/85 sm:text-5xl"
        aria-hidden
      >
        {initials}
      </span>
    </div>
  );
}
