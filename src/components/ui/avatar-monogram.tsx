import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Team portrait. Renders the headshot at `photo` when one is supplied,
 * otherwise falls back to a gradient monogram. Both occupy the same square,
 * so adding a photo never shifts the surrounding layout.
 */
export function AvatarMonogram({
  initials,
  accent,
  photo,
  name,
  className,
  sizes = "(min-width: 1024px) 240px, 160px",
  priority = false,
}: {
  initials: string;
  accent: string;
  photo?: string;
  /** used for the image alt text when a photo is present */
  name?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex aspect-square items-center justify-center overflow-hidden rounded-2xl border border-hair/20",
        className,
      )}
      style={{
        background: `linear-gradient(150deg, color-mix(in oklab, ${accent} 28%, transparent) 0%, var(--color-ink-800) 55%, color-mix(in oklab, ${accent} 12%, transparent) 100%)`,
      }}
    >
      {photo ? (
        <>
          <Image
            src={photo}
            alt={name ? `${name} — portrait` : ""}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
          />
          {/* light accent tint so photos sit in the same visual family */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-35 mix-blend-soft-light"
            style={{
              background: `linear-gradient(150deg, color-mix(in oklab, ${accent} 55%, transparent) 0%, transparent 65%)`,
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 ring-1 ring-white/10 ring-inset"
          />
        </>
      ) : (
        <>
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
            className="relative z-10 text-4xl font-display font-semibold tracking-tight text-cream sm:text-5xl"
            aria-hidden
          >
            {initials}
          </span>
        </>
      )}
    </div>
  );
}
