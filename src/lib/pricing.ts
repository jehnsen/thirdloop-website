/**
 * Pricing accents reuse the same brand tokens as products and services
 * (see `@theme` in globals.css), so the catalogues stay visually consistent.
 */
export const pricingAccentOptions = [
  { label: "Loop 400", value: "var(--color-loop-400)" },
  { label: "Loop 500", value: "var(--color-loop-500)" },
  { label: "Flux 400", value: "var(--color-flux-400)" },
  { label: "Flux 500", value: "var(--color-flux-500)" },
  { label: "Plasma 400", value: "var(--color-plasma-400)" },
  { label: "Plasma 500", value: "var(--color-plasma-500)" },
] as const;

export type PricingTier = {
  /** stable identifier, also the URL segment in the admin dashboard */
  id: string;
  name: string;
  /** headline figure, e.g. "From $13k" — free text, so it can read "Custom" */
  price: string;
  /** qualifier under the price, e.g. "per project" */
  cadence: string;
  description: string;
  features: string[];
  /** button label, e.g. "Start a project" */
  cta: string;
  /** one of `pricingAccentOptions` */
  accent: string;
  /** carries the "Most requested" badge — at most one tier at a time */
  featured: boolean;
  /** disabled tiers stay in the catalogue but are left off the public site */
  enabled: boolean;
};
