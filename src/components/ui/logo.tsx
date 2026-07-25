import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

/** Three interlocking loops — the "3rd loop" is the highlighted one. */
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
          <stop stopColor="var(--color-loop-400)" />
          <stop offset="0.55" stopColor="var(--color-flux-400)" />
          <stop offset="1" stopColor="var(--color-plasma-400)" />
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="8.5" stroke="white" strokeOpacity="0.28" strokeWidth="2" />
      <circle cx="26" cy="14" r="8.5" stroke="white" strokeOpacity="0.28" strokeWidth="2" />
      <circle
        cx="20"
        cy="25"
        r="8.5"
        stroke="url(#loop-grad)"
        strokeWidth="2.4"
        strokeLinecap="round"
        className="[stroke-dasharray:54] [stroke-dashoffset:0]"
      />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-loop-400",
        className,
      )}
      aria-label={`${site.name} — home`}
    >
      <LogoMark className="transition-transform duration-500 group-hover:rotate-180" />
      <span className="text-[0.98rem] font-semibold tracking-tight text-white">
        3rdLoop
        <span className="ml-1 font-normal text-white/45">Solutions</span>
      </span>
    </Link>
  );
}
