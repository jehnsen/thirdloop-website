import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/** Interlocking loops, the third one picked out in the brand gradient. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={cn("size-9", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="loop-grad" x1="0" y1="0" x2="40" y2="40">
          <stop stopColor="var(--color-loop-500)" />
          <stop offset="1" stopColor="var(--color-flux-500)" />
        </linearGradient>
      </defs>
      <circle
        cx="14"
        cy="14"
        r="8.5"
        stroke="var(--color-hair)"
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      <circle
        cx="26"
        cy="14"
        r="8.5"
        stroke="var(--color-hair)"
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      <circle
        cx="20"
        cy="25"
        r="8.5"
        stroke="url(#loop-grad)"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-flux-400",
        className,
      )}
      aria-label={`${site.name} — home`}
    >
      <LogoMark className="size-8 transition-transform duration-500 group-hover:rotate-180" />
      <span className="leading-none">
        <span className="block font-display text-[15px] font-semibold tracking-tight text-cream">
          3rdLoop <span className="text-mist">Solutions</span>
        </span>
        <span className="mt-1 block font-mono text-[9px] tracking-[0.25em] text-mist uppercase">
          Build · Automate · Compound
        </span>
      </span>
    </Link>
  );
}
