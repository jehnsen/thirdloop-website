import type { ProductIconName } from "@/lib/product-icons";

export const productCategoryOptions = [
  "Web App",
  "Mobile App",
  "AI Solution",
  "Internal Tool",
] as const;

export type ProductCategory = (typeof productCategoryOptions)[number];

export const productStatusOptions = ["Live", "Demo", "In development"] as const;

export type ProductStatus = (typeof productStatusOptions)[number];

/** Brand tokens a product can be tinted with (see `@theme` in globals.css). */
export const productAccentOptions = [
  { label: "Loop 300", value: "var(--color-loop-300)" },
  { label: "Loop 400", value: "var(--color-loop-400)" },
  { label: "Loop 500", value: "var(--color-loop-500)" },
  { label: "Loop 600", value: "var(--color-loop-600)" },
  { label: "Flux 300", value: "var(--color-flux-300)" },
  { label: "Flux 400", value: "var(--color-flux-400)" },
  { label: "Flux 500", value: "var(--color-flux-500)" },
  { label: "Flux 600", value: "var(--color-flux-600)" },
  { label: "Plasma 400", value: "var(--color-plasma-400)" },
  { label: "Plasma 500", value: "var(--color-plasma-500)" },
  { label: "Plasma 600", value: "var(--color-plasma-600)" },
] as const;

export type Product = {
  /** URL segment — /products/[slug] */
  slug: string;
  name: string;
  tagline: string;
  /** one-paragraph summary used on the index card */
  summary: string;
  category: ProductCategory;
  status: ProductStatus;
  /** disabled products stay in the catalogue but are left off the public site */
  enabled: boolean;
  /** external site, if there is one to visit */
  url?: string;
  /** key into `productIcons` */
  icon: ProductIconName;
  /** one of `productAccentOptions` */
  accent: string;
  industry: string;
  /** short label pairs shown in the detail hero */
  facts: { label: string; value: string }[];
  /** the situation the product was built for */
  challenge: string;
  /** what was built in response */
  approach: string;
  features: { title: string; body: string }[];
  stack: string[];
  outcomes: string[];
};

export const productStatusStyles: Record<ProductStatus, string> = {
  Live: "border-flux-500/40 bg-flux-500/12 text-flux-300",
  Demo: "border-loop-400/40 bg-loop-500/15 text-loop-200",
  "In development": "border-hair/25 bg-white/5 text-mist",
};
