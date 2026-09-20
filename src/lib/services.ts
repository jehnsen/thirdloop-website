import type { ProductIconName } from "@/lib/product-icons";

/**
 * Service accents reuse the same brand tokens as products (see `@theme` in
 * globals.css), so the two catalogues stay visually consistent.
 */
export const serviceAccentOptions = [
  { label: "Loop 400", value: "var(--color-loop-400)" },
  { label: "Loop 500", value: "var(--color-loop-500)" },
  { label: "Flux 400", value: "var(--color-flux-400)" },
  { label: "Flux 500", value: "var(--color-flux-500)" },
  { label: "Plasma 400", value: "var(--color-plasma-400)" },
  { label: "Plasma 500", value: "var(--color-plasma-500)" },
] as const;

export type Service = {
  /** stable identifier, also the URL segment in the admin dashboard */
  id: string;
  title: string;
  /** one-paragraph description shown on the card */
  summary: string;
  /** key into `productIcons` — shared registry with products */
  icon: ProductIconName;
  /** one of `serviceAccentOptions` */
  color: string;
  /** what the engagement actually delivers */
  deliverables: string[];
  /** the result a client can expect, shown as the card footer */
  outcomes: string;
  /** disabled services stay in the catalogue but are left off the public site */
  enabled: boolean;
};
