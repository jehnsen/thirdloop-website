# 3rdLoop Solutions — Website

Marketing site for 3rdLoop Solutions: web & mobile development, intelligent
automation, AI solutions and business/technical consultancy.

Built with **Next.js 16** (App Router), **React 19**, **Tailwind CSS v4** and
**Framer Motion**.

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # eslint
npx tsc --noEmit # typecheck
```

## Structure

```
src/
├── app/
│   ├── layout.tsx        # metadata, fonts, JSON-LD, skip link
│   ├── page.tsx          # home — section composition order
│   ├── products/
│   │   ├── page.tsx      # products index (filterable grid)
│   │   └── [slug]/
│   │       └── page.tsx  # product detail (statically generated)
│   ├── team/
│   │   └── page.tsx      # team page
│   └── globals.css       # design tokens, keyframes, custom utilities
├── components/
│   ├── layout/           # navbar, footer
│   ├── sections/         # one file per page section
│   └── ui/               # reusable primitives
└── lib/
    ├── products.ts       # product catalogue — single source for both routes
    ├── team.ts           # team members + working principles
    ├── site.ts           # business info, nav links
    └── utils.ts          # cn() class merger
```

## Products

`/products` lists everything in `src/lib/products.ts`; `/products/[slug]`
renders the detail page. Both read from that one file, and detail pages are
statically generated via `generateStaticParams` — **to add a product, append an
entry to the `products` array**. No route files need touching. An unknown slug
404s.

Each entry drives the whole detail page: `challenge` / `approach` prose,
`features`, `stack`, `outcomes`, and the `facts` panel. `url` is optional —
omit it and the "Visit site" button disappears.

Note on nav links: `navLinks` in `site.ts` marks each entry `hash` or `route`.
Hash links get a `/` prefix when rendered off the home page so they still
resolve — keep that flag correct when adding links. "Stack" was moved out of
the main nav into `footerExtraLinks` to keep the nav on one row — it's still
reachable from the home page and the footer.

## Team

`/team` renders from `src/lib/team.ts`, and a two-card teaser on the home page
reads from the same array. Add a member by appending an entry.

**Photos:** there are none. `AvatarMonogram` renders a gradient monogram from
each member's `initials` in a reserved square — swap it for a `next/image`
component once headshots exist and the layout won't move.

**`links` is empty for both members.** Add LinkedIn/GitHub entries and the
chips appear automatically; leave it empty and nothing renders.

## Content you need to replace

The copy is written to be production-ready, but a few things are **placeholders
and must be swapped before launch**:

| What | Where | Note |
| --- | --- | --- |
| Case studies | `src/components/sections/work.tsx` | Client names, metrics and descriptions are **invented examples**. Replace with real engagements or remove the section. |
| Testimonials | `src/components/sections/testimonials.tsx` | **Invented quotes.** Replace with real, attributable feedback. |
| Hero / counter stats | `hero.tsx`, `differentiators.tsx` | "40+ products", "12k hours", "99.9% uptime" are illustrative. |
| Pricing | `src/components/sections/pricing.tsx` | Confirm the tiers and starting figures match your actual model. |
| Email, phone, socials | `src/lib/site.ts` | Currently `hello@3rdloopsolutions.com` and placeholder social URLs. |
| Domain | `src/lib/site.ts` (`url`) | Used for canonical URLs and OpenGraph metadata. |
| Product descriptions | `src/lib/products.ts` | **Review every entry.** See below. |

### About the product copy

Samahuzai, Agrivia and BackHaul were written from their live sites, so the
features and business model described there reflect what those sites actually
say. The rest is **inferred from the product names you supplied**:

- **Mekanikomo.R** and **Agri Supplies POS** — the challenge, features and
  workflow are a reasonable reading of what those apps would do, not a
  description of what you built. Correct them against the real scope.
- **AdminSuite** — the live URL is login-gated, so only the DepEd school-management
  framing is confirmed. The feature list is deliberately general; replace it with
  the real modules.
- **RAG Chatbot** — describes the standard architecture we'd build. Adjust to
  match your actual implementation and any real deployments.
- **Status labels** (`Live` / `Demo` / `In development`) are guesses based on
  which URLs you provided. Verify each one.

Publishing invented client names, quotes or metrics as if they were real would
be misleading to prospects — treat the table above as a launch blocker.

## Wiring up the contact form

`src/components/sections/contact.tsx` currently simulates submission with a
timeout — **it does not send anything**. Replace the body of `handleSubmit`
with a call to your handler, e.g. a Next.js route handler at
`src/app/api/contact/route.ts`, or a service like Resend, Formspree or
Web3Forms.

## Design system

Tokens live in `src/app/globals.css` under `@theme`:

- **Colors** — `ink-*` (backgrounds), `loop-*` (primary blue), `flux-*` (teal
  accent), `plasma-*` (violet accent)
- **Animations** — `animate-marquee`, `animate-drift`, `animate-pulse-ring`,
  `animate-float`, `animate-grid-fade`
- **Utilities** — `text-gradient`, `glass-panel`, `mask-fade-x`, `mask-fade-b`

Motion helpers (`Reveal`, `StaggerGroup`, `AnimatedHeadline`, shared `EASE`)
live in `src/components/ui/motion-primitives.tsx`. All animation respects
`prefers-reduced-motion`.

## Accessibility

Skip link, keyboard-focusable controls with visible focus rings, ARIA-wired
tabs and accordions, `sr-only` text behind animated headlines, and reduced
motion support. Re-check contrast if you change the palette — several muted
text tokens sit close to the AA threshold.
