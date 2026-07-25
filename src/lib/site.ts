export const site = {
  name: "3rdLoop Solutions",
  shortName: "3rdLoop",
  tagline: "Build. Automate. Compound.",
  description:
    "3rdLoop Solutions designs and ships web platforms, mobile apps, intelligent automations and AI systems — backed by the architecture and operating consultancy that makes them last.",
  url: "https://3rdloopsolutions.com",
  email: "hello@3rdloopsolutions.com",
  phone: "+63 917 000 0000",
  location: "Remote-first · Serving clients worldwide",
  socials: [
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "GitHub", href: "https://github.com" },
    { label: "X", href: "https://x.com" },
  ],
} as const;

/**
 * `hash` links scroll to a section on the home page; they need a `/` prefix
 * when the user is on any other route. `route` links are real pages.
 */
export const navLinks = [
  { label: "Services", href: "#services", kind: "hash" },
  { label: "Products", href: "/products", kind: "route" },
  { label: "Team", href: "/team", kind: "route" },
  { label: "Process", href: "#process", kind: "hash" },
  { label: "Work", href: "#work", kind: "hash" },
  { label: "Pricing", href: "#pricing", kind: "hash" },
  { label: "FAQ", href: "#faq", kind: "hash" },
] as const;

/** Extra destinations surfaced in the footer but not the main nav. */
export const footerExtraLinks = [
  { label: "Stack", href: "/#stack" },
  { label: "Contact", href: "/#contact" },
] as const;
