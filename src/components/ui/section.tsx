import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion-primitives";

export function Section({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn("relative scroll-mt-32 py-20 sm:py-28", className)}
    >
      {children}
    </section>
  );
}

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}

/** Mono, letterspaced, rule-led label that opens every section. */
export function Eyebrow({
  children,
  className,
  tone = "dark",
}: {
  children: ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] uppercase",
        tone === "light" ? "text-flux-600" : "text-flux-500",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "h-px w-8",
          tone === "light" ? "bg-flux-600/50" : "bg-flux-500/50",
        )}
      />
      {children}
    </span>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  /** short mono note pinned to the right on wide screens */
  meta,
  align = "left",
  tone = "dark",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: string;
  align?: "center" | "left";
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10",
        align === "center" && "md:flex-col md:items-center",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-col gap-4",
          align === "center"
            ? "mx-auto max-w-3xl items-center text-center"
            : "max-w-2xl",
        )}
      >
        {eyebrow ? (
          <Reveal>
            <Eyebrow tone={tone}>{eyebrow}</Eyebrow>
          </Reveal>
        ) : null}
        <Reveal delay={0.06}>
          <h2
            className={cn(
              "font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.05]",
              tone === "light" ? "text-panel-ink" : "text-cream",
            )}
          >
            {title}
          </h2>
        </Reveal>
        {description ? (
          <Reveal delay={0.12}>
            <p
              className={cn(
                "text-base leading-relaxed text-pretty sm:text-lg",
                tone === "light" ? "text-panel-muted" : "text-mist",
              )}
            >
              {description}
            </p>
          </Reveal>
        ) : null}
      </div>

      {meta ? (
        <Reveal delay={0.18}>
          <p
            className={cn(
              "hidden max-w-[24ch] font-mono text-[11px] tracking-[0.15em] uppercase md:block",
              tone === "light" ? "text-slate-500" : "text-mist/70",
            )}
          >
            {meta}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
