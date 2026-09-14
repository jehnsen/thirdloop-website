import { ArrowLeft, Check, CircleAlert } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { productStatusStyles, type ProductStatus } from "@/lib/products";
import { cn } from "@/lib/utils";

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-loop-400 disabled:cursor-not-allowed disabled:opacity-60";

const buttonVariants = {
  primary: "bg-loop-500 px-4.5 py-2.5 text-white hover:bg-loop-400",
  secondary:
    "border border-white/12 bg-white/5 px-4.5 py-2.5 text-white/85 hover:border-white/20 hover:bg-white/8 hover:text-white",
  ghost: "px-4.5 py-2.5 text-white/60 hover:bg-white/6 hover:text-white",
  danger: "bg-red-500/85 px-4.5 py-2.5 text-white hover:bg-red-500",
  dangerOutline:
    "border border-red-400/30 px-4.5 py-2.5 text-red-300 hover:border-red-400/60 hover:bg-red-500/10 hover:text-red-200",
};

export function buttonClass(
  variant: keyof typeof buttonVariants = "primary",
  className?: string,
) {
  return cn(buttonBase, buttonVariants[variant], className);
}

export const iconButtonClass =
  "inline-flex size-8 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/8 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-loop-400 disabled:opacity-50";

export const inputClass =
  "w-full rounded-xl border border-white/10 bg-ink-900/80 px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 transition-colors hover:border-white/20 focus:border-loop-400 focus:ring-2 focus:ring-loop-400/30 focus:outline-none aria-invalid:border-red-400/70";

export function PageHeader({
  title,
  description,
  back,
  actions,
}: {
  title: ReactNode;
  description?: ReactNode;
  back?: { href: string; label: string };
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back ? (
          <Link
            href={back.href}
            className="group mb-3 inline-flex items-center gap-1.5 text-sm text-white/45 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            {back.label}
          </Link>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-balance text-white sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-sm text-white/50">{description}</p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}

export function Panel({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("rounded-2xl border border-white/8 bg-ink-900/70", className)}
    >
      {title ? (
        <div className="flex items-start justify-between gap-4 border-b border-white/6 px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white">{title}</h2>
            {description ? (
              <p className="mt-1 text-xs leading-relaxed text-white/45">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="shrink-0">{actions}</div> : null}
        </div>
      ) : null}
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}

export function FieldError({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      id={id}
      className={cn("flex items-center gap-1.5 text-xs text-red-300", className)}
    >
      <CircleAlert aria-hidden className="size-3.5 shrink-0" />
      {children}
    </p>
  );
}

/**
 * Label + control + message. The control should set `id` to match, and point
 * `aria-describedby` at `${id}-error` / `${id}-hint` when those render.
 */
export function Field({
  id,
  label,
  hint,
  error,
  optional = false,
  children,
  className,
}: {
  id: string;
  label: ReactNode;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className="flex items-baseline justify-between gap-2 text-sm font-medium text-white/80"
      >
        {label}
        {optional ? (
          <span className="text-xs font-normal text-white/35">Optional</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <FieldError id={`${id}-error`}>{error}</FieldError>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs leading-relaxed text-white/40">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
        productStatusStyles[status],
      )}
    >
      {status}
    </span>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <div
      role="status"
      className="mb-6 flex items-center gap-2.5 rounded-xl border border-flux-400/25 bg-flux-500/10 px-4 py-3 text-sm text-flux-300"
    >
      <Check aria-hidden className="size-4 shrink-0" />
      {children}
    </div>
  );
}
