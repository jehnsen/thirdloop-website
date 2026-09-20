/** Testimonial accents reuse the same brand tokens as the other catalogues. */
export const testimonialAccentOptions = [
  { label: "Loop 400", value: "var(--color-loop-400)" },
  { label: "Loop 500", value: "var(--color-loop-500)" },
  { label: "Flux 400", value: "var(--color-flux-400)" },
  { label: "Flux 500", value: "var(--color-flux-500)" },
  { label: "Plasma 400", value: "var(--color-plasma-400)" },
  { label: "Plasma 500", value: "var(--color-plasma-500)" },
] as const;

export type Testimonial = {
  /** stable identifier, also the URL segment in the admin dashboard */
  id: string;
  quote: string;
  /** who said it — a role rather than a person, e.g. "Operations Director" */
  name: string;
  /** the second caption line, e.g. "Freight & logistics client" */
  company: string;
  /** one of `testimonialAccentOptions` */
  accent: string;
  /** disabled testimonials stay in the catalogue but are left off the site */
  enabled: boolean;
};
