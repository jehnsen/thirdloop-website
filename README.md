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

Copy `.env.example` to `.env.local` and fill it in, then create the tables
and load the starting catalogue:

```bash
npm run db:migrate   # apply db/schema.sql
npm run db:seed      # load products + services (skips rows already there)
```

See [Database](#database) and [Admin dashboard](#admin-dashboard).

## Structure

```
data/
└── products.json         # original catalogue — seed data only, not read at runtime
db/
├── schema.sql            # products + services tables
├── migrate.mjs           # npm run db:migrate
├── seed.mjs              # npm run db:seed
├── seed-services.json    # starting service portfolio
├── seed-pricing.json     # starting pricing tiers
└── seed-testimonials.json # starting client feedback
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

## Database

Products, services, pricing tiers and testimonials are stored in
[Neon](https://neon.tech) (serverless
Postgres), reached over HTTP with `@neondatabase/serverless` — there is no
connection pool to keep warm, which suits serverless hosting.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon connection string. Vercel's Neon integration sets this for you. |

`POSTGRES_URL` and `DATABASE_URL_UNPOOLED` are accepted as fallbacks.

```bash
npm run db:migrate          # create tables and indexes (safe to re-run)
npm run db:seed             # insert starting rows, skipping any already there
npm run db:seed -- --force  # overwrite existing rows from the seed files
```

`db/schema.sql` keeps scalar fields as real columns so they can be filtered
and ordered in SQL, and repeated sub-records (`facts`, `features`,
`deliverables`) as `jsonb` — those are always read and written whole with
their parent row.

Reads go through the `*-store.ts` modules in `src/lib` (`product-store`,
`service-store`, `pricing-store`, `testimonial-store`).
They return an **empty** catalogue when no `DATABASE_URL` is set, so
`next build` still succeeds on a fresh clone or a preview deploy; writes and
the admin dashboard require a real connection and fail loudly without one.

## Services

The service portfolio on the home page is database-backed and managed at
`/admin/services`, mirroring products: add, edit, delete, and a switch to show
or hide one. Each service has a title, summary, icon, accent colour, a list of
deliverables and a one-line outcome. Hiding a service keeps its content and
just removes it from the home page; the trailing "Not sure which you need?"
card numbers itself after the last visible service.

## Pricing and client feedback

Both sections on the home page are database-backed and managed from the admin
dashboard — `/admin/pricing` and `/admin/testimonials` — with the same
add / edit / delete / show-hide controls as products and services.

Pricing tiers carry a name, price, cadence, description, feature list, button
label and accent. One tier at a time can hold the **"Most requested"** badge:
switching it on for a tier clears it from whichever tier had it, and the
database enforces the rule with a partial unique index rather than trusting
the application to get it right.

Testimonials carry the quote, an attribution line, an optional company line
and an accent. Prefer a role ("Operations Director") over a personal name
unless you have permission to publish it.

Hiding a tier or a testimonial keeps its content and just removes it from the
home page. With every tier hidden the pricing section disappears entirely
rather than rendering an empty heading; testimonials behave the same way.

## Products

The catalogue lives in Postgres (Neon) and is managed from the admin
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

`/admin` is a password-protected area for managing the site's content:

- **Dashboard** — catalogue totals, breakdowns by status and category, and the
  products whose detail pages have gaps.
- **Products** — search and filter the catalogue, show or hide a product with
  a switch, and delete one (with a confirm step).
- **Services** — the same, for the service portfolio on the home page.
- **Pricing** — engagement tiers, including which one carries the
  "Most requested" badge.
- **Feedback** — client testimonials shown on the home page.
- **Add / edit** — every field that appears on the public pages, with a live
  icon and accent preview. Input is validated on the server.

Hiding a product keeps all of its content. It just stops appearing on
`/products`, and its page returns 404 until it's switched back on. Hiding a
service removes it from the home page and keeps its content.

### Setup

Copy `.env.example` to `.env.local`, fill it in, and restart the server:

| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | The sign-in password. Changing it signs out every session. |
| `ADMIN_SESSION_SECRET` | 32+ random characters used to sign the session cookie. |
| `DATABASE_URL` | Neon connection string — see [Database](#database). |

If either admin value is missing, the sign-in page says so and nobody can
sign in.
Sessions last 8 hours. In production the session cookie is `Secure`, so the
site has to be served over HTTPS.

### How access is checked

`src/proxy.ts` redirects signed-out visitors to `/admin/login`, but that is
only the first gate. Every admin page and every server action in
`src/app/admin/actions.ts` checks the session again before it reads or changes
anything. Server actions can be called directly, bypassing the UI, so keep
that pattern when adding admin features.

### Deploying

Changes are written to Postgres, so the dashboard works on serverless hosts
such as Vercel — no persistent filesystem required. Set the environment
variables from [Database](#database) on the host, and run `npm run db:migrate`
against the production database once before the first deploy.

Because the dashboard writes to whichever database `DATABASE_URL` points at, a
local dev server pointed at the production database edits the live catalogue.
Use a separate Neon branch for development if that isn't what you want.

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

Tokens live in `src/app/globals.css` under `@theme`.

**Type** — three faces, loaded in `layout.tsx` via `next/font`:

| Utility | Face | Used for |
| --- | --- | --- |
| `font-display` | Space Grotesk | every headline |
| `font-sans` | DM Sans | body copy (the default) |
| `font-mono` | JetBrains Mono | eyebrows, nav, buttons, numerals, labels |

Mono text is always uppercase with wide tracking (`tracking-[0.15em]` to
`tracking-[0.3em]`) at small sizes — that letterspaced label is the signature
of the look, so keep it for new labels rather than reaching for small sans.

**Colour**

- `ink-*` — the navy surface stack, darkest first (`ink-900` is the page)
- `flux-*` — teal, the primary accent and default CTA colour
- `loop-*` — signal blue, the secondary accent
- `plasma-*` — indigo, used sparingly for product accents
- `hair` — hairline borders, always at low opacity (`border-hair/20`)
- `mist` — muted body copy on navy; `cream` — primary text on navy
- `panel-ink` / `panel-muted` — heading and body text inside the white bands

**Layout rhythm** — the page alternates: navy sections separated by hairline
rules, with a pair of white bands (`panel-light`) breaking up the middle.
Cards in the white bands sit in a hairline grid — `gap-px` over a
`bg-slate-200` parent — so the 1px gaps read as rules rather than borders.

**Utilities** — `page-bg` (the fixed three-radial wash), `panel-light`,
`bg-brand-gradient`, `text-gradient`, `glass-panel`, `mask-fade-x`,
`mask-fade-b`

**Route tints** — `PageBackdrop` takes a `theme` prop (`home`, `products`,
`team`, `admin`) that shifts the glow colours per route, so the palette moves
as you navigate.

Motion helpers (`Reveal`, `StaggerGroup`, `AnimatedHeadline`, shared `EASE`)
live in `src/components/ui/motion-primitives.tsx`. All animation respects
`prefers-reduced-motion`.

## Accessibility

Skip link, keyboard-focusable controls with visible focus rings, ARIA-wired
tabs and accordions, `sr-only` text behind animated headlines, and reduced
motion support. Re-check contrast if you change the palette — several muted
text tokens sit close to the AA threshold.
