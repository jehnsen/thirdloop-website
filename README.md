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

To use the admin dashboard, also copy `.env.example` to `.env.local` and fill
it in — see [Admin dashboard](#admin-dashboard).

## Structure

```
data/
└── products.json         # product catalogue — edited through /admin
src/
├── proxy.ts              # sends signed-out visitors from /admin to the login page
├── app/
│   ├── layout.tsx        # metadata, fonts, JSON-LD, skip link
│   ├── page.tsx          # home — section composition order
│   ├── products/
│   │   ├── page.tsx      # products index (filterable grid)
│   │   └── [slug]/
│   │       └── page.tsx  # product detail (statically generated)
│   ├── admin/
│   │   ├── actions.ts    # server actions: sign in/out, save, delete, show/hide
│   │   ├── login/        # sign-in page
│   │   └── (panel)/      # dashboard, product list, new/edit pages
│   ├── team/
│   │   └── page.tsx      # team page
│   └── globals.css       # design tokens, keyframes, custom utilities
├── components/
│   ├── admin/            # admin UI: nav, products table, product form
│   ├── layout/           # navbar, footer
│   ├── sections/         # one file per page section
│   └── ui/               # reusable primitives
└── lib/
    ├── admin/            # session signing, auth checks, form validation
    ├── product-store.ts  # reads and writes data/products.json
    ├── products.ts       # Product type + category/status/accent options
    ├── product-icons.ts  # icons a product can use
    ├── team.ts           # team members + working principles
    ├── site.ts           # business info, nav links
    └── utils.ts          # cn() class merger
```

## Products

The catalogue lives in `data/products.json` and is managed from the admin
dashboard at `/admin`. `/products` lists every **visible** product and
`/products/[slug]` renders its detail page. Both are statically generated and
revalidated whenever a product is saved, shown, hidden or deleted, so changes
go live without a rebuild. A hidden or unknown slug 404s.

Each entry drives the whole detail page: `challenge` / `approach` prose,
`features`, `stack`, `outcomes`, and the `facts` panel. `url` is optional —
leave it empty and the "Visit site" button disappears. The dashboard lists
products whose detail page still has empty sections.

Note on nav links: `navLinks` in `site.ts` marks each entry `hash` or `route`.
Hash links get a `/` prefix when rendered off the home page so they still
resolve — keep that flag correct when adding links. "Stack" was moved out of
the main nav into `footerExtraLinks` to keep the nav on one row — it's still
reachable from the home page and the footer.

## Admin dashboard

`/admin` is a password-protected area for managing products:

- **Dashboard** — catalogue totals, breakdowns by status and category, and the
  products whose detail pages have gaps.
- **Products** — search and filter the catalogue, show or hide a product with
  a switch, and delete one (with a confirm step).
- **Add / edit** — every field that appears on the product pages, with a live
  icon and accent preview. Input is validated on the server.

Hiding a product keeps all of its content. It just stops appearing on
`/products`, and its page returns 404 until it's switched back on.

### Setup

Copy `.env.example` to `.env.local`, fill in both values, and restart the
server:

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | The sign-in password. Changing it signs out every session. |
| `ADMIN_SESSION_SECRET` | 32+ random characters used to sign the session cookie. |

If either is missing, the sign-in page says so and nobody can sign in.
Sessions last 8 hours. In production the session cookie is `Secure`, so the
site has to be served over HTTPS.

### How access is checked

`src/proxy.ts` redirects signed-out visitors to `/admin/login`, but that is
only the first gate. Every admin page and every server action in
`src/app/admin/actions.ts` checks the session again before it reads or changes
anything. Server actions can be called directly, bypassing the UI, so keep
that pattern when adding admin features.

### Hosting constraint — read before deploying

Changes are written to `data/products.json` on the server's disk. That works
on a single long-running Node server (`npm run start` on a VPS, or Docker with
`data/` on a persistent volume). It does **not** work on serverless hosts such
as Vercel, where the filesystem is read-only and isn't shared between
instances. To deploy there, replace the read/write functions in
`src/lib/product-store.ts` with database calls — nothing else needs to change.

Edits made against a local dev server change `data/products.json` in your
working tree, so they can be reviewed and committed like any other change.

To offer another icon in the picker, add it to `src/lib/product-icons.ts`.

## Team

`/team` renders from `src/lib/team.ts`, and a two-card teaser on the home page
reads from the same array. Add a member by appending an entry.

**Photos:** `AvatarMonogram` renders a real headshot when a member has a
`photo` path, and falls back to a gradient monogram built from their `initials`
when they don't. Both occupy the same square, so adding a photo never shifts
the layout.

To add one: drop a square image in `public/team/`, then set `photo` on that
member in `src/lib/team.ts`. Jehnsen's entry has the line ready and commented
out — uncomment it once the file is in place. See `public/team/README.md` for
sizing requirements.

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
| Product descriptions | `/admin` (stored in `data/products.json`) | **Review every entry.** See below. |

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
