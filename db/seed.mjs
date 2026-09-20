/**
 * Loads the starting catalogue into Neon: products from data/products.json
 * (the file the old filesystem store used) and services from
 * db/seed-services.json.
 *
 *   npm run db:seed          -- insert missing rows, leave existing ones alone
 *   npm run db:seed -- --force   -- overwrite rows that already exist
 *
 * Without --force this is safe to re-run: rows already in the database keep
 * whatever the admin dashboard has since changed them to.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { loadEnv } from "./env.mjs";

loadEnv();

const force = process.argv.includes("--force");

const url =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.DATABASE_URL_UNPOOLED;

if (!url) {
  console.error(
    "No DATABASE_URL. Add it to .env.local, or run with:\n" +
      "  DATABASE_URL='postgresql://...' npm run db:seed",
  );
  process.exit(1);
}

const root = path.join(import.meta.dirname, "..");
const sql = neon(url);

async function readJson(file) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

const products = (await readJson(path.join(root, "data", "products.json"))) ?? [];
const services =
  (await readJson(path.join(import.meta.dirname, "seed-services.json"))) ?? [];
const pricingTiers =
  (await readJson(path.join(import.meta.dirname, "seed-pricing.json"))) ?? [];
const testimonials =
  (await readJson(path.join(import.meta.dirname, "seed-testimonials.json"))) ?? [];

// ON CONFLICT turns the "already there" case into a no-op (or an overwrite
// with --force), so seeding never half-fails partway through a list.
const onProductConflict = force
  ? sql.unsafe(`DO UPDATE SET
      name = EXCLUDED.name, tagline = EXCLUDED.tagline,
      summary = EXCLUDED.summary, category = EXCLUDED.category,
      status = EXCLUDED.status, enabled = EXCLUDED.enabled,
      url = EXCLUDED.url, icon = EXCLUDED.icon, accent = EXCLUDED.accent,
      industry = EXCLUDED.industry, facts = EXCLUDED.facts,
      challenge = EXCLUDED.challenge, approach = EXCLUDED.approach,
      features = EXCLUDED.features, stack = EXCLUDED.stack,
      outcomes = EXCLUDED.outcomes, position = EXCLUDED.position,
      updated_at = now()`)
  : sql.unsafe("DO NOTHING");

let productCount = 0;
for (const [index, product] of products.entries()) {
  const rows = await sql`
    INSERT INTO products (
      slug, name, tagline, summary, category, status, enabled, url, icon,
      accent, industry, facts, challenge, approach, features, stack, outcomes,
      position
    ) VALUES (
      ${product.slug}, ${product.name}, ${product.tagline}, ${product.summary},
      ${product.category}, ${product.status}, ${product.enabled ?? true},
      ${product.url ?? null}, ${product.icon}, ${product.accent},
      ${product.industry}, ${JSON.stringify(product.facts ?? [])}::jsonb,
      ${product.challenge ?? ""}, ${product.approach ?? ""},
      ${JSON.stringify(product.features ?? [])}::jsonb,
      ${JSON.stringify(product.stack ?? [])}::jsonb,
      ${JSON.stringify(product.outcomes ?? [])}::jsonb,
      ${index}
    )
    ON CONFLICT (slug) ${onProductConflict}
    RETURNING slug
  `;
  if (rows.length > 0) productCount++;
}

const onServiceConflict = force
  ? sql.unsafe(`DO UPDATE SET
      title = EXCLUDED.title, summary = EXCLUDED.summary,
      icon = EXCLUDED.icon, color = EXCLUDED.color,
      deliverables = EXCLUDED.deliverables, outcomes = EXCLUDED.outcomes,
      enabled = EXCLUDED.enabled, position = EXCLUDED.position,
      updated_at = now()`)
  : sql.unsafe("DO NOTHING");

let serviceCount = 0;
for (const [index, service] of services.entries()) {
  const rows = await sql`
    INSERT INTO services (
      id, title, summary, icon, color, deliverables, outcomes, enabled, position
    ) VALUES (
      ${service.id}, ${service.title}, ${service.summary}, ${service.icon},
      ${service.color}, ${JSON.stringify(service.deliverables ?? [])}::jsonb,
      ${service.outcomes ?? ""}, ${service.enabled ?? true}, ${index}
    )
    ON CONFLICT (id) ${onServiceConflict}
    RETURNING id
  `;
  if (rows.length > 0) serviceCount++;
}

const onPricingConflict = force
  ? sql.unsafe(`DO UPDATE SET
      name = EXCLUDED.name, price = EXCLUDED.price,
      cadence = EXCLUDED.cadence, description = EXCLUDED.description,
      features = EXCLUDED.features, cta = EXCLUDED.cta,
      accent = EXCLUDED.accent, featured = EXCLUDED.featured,
      enabled = EXCLUDED.enabled, position = EXCLUDED.position,
      updated_at = now()`)
  : sql.unsafe("DO NOTHING");

// Featured tiers are seeded last: the schema allows only one, so clearing the
// flag first keeps a re-seed from colliding with whatever is already featured.
if (pricingTiers.some((tier) => tier.featured)) {
  await sql`UPDATE pricing_tiers SET featured = false WHERE featured`;
}

let pricingCount = 0;
for (const [index, tier] of pricingTiers.entries()) {
  const rows = await sql`
    INSERT INTO pricing_tiers (
      id, name, price, cadence, description, features, cta, accent,
      featured, enabled, position
    ) VALUES (
      ${tier.id}, ${tier.name}, ${tier.price}, ${tier.cadence ?? ""},
      ${tier.description ?? ""}, ${JSON.stringify(tier.features ?? [])}::jsonb,
      ${tier.cta ?? ""}, ${tier.accent}, ${tier.featured ?? false},
      ${tier.enabled ?? true}, ${index}
    )
    ON CONFLICT (id) ${onPricingConflict}
    RETURNING id
  `;
  if (rows.length > 0) pricingCount++;
}

const onTestimonialConflict = force
  ? sql.unsafe(`DO UPDATE SET
      quote = EXCLUDED.quote, name = EXCLUDED.name,
      company = EXCLUDED.company, accent = EXCLUDED.accent,
      enabled = EXCLUDED.enabled, position = EXCLUDED.position,
      updated_at = now()`)
  : sql.unsafe("DO NOTHING");

let testimonialCount = 0;
for (const [index, item] of testimonials.entries()) {
  const rows = await sql`
    INSERT INTO testimonials (
      id, quote, name, company, accent, enabled, position
    ) VALUES (
      ${item.id}, ${item.quote}, ${item.name}, ${item.company ?? ""},
      ${item.accent}, ${item.enabled ?? true}, ${index}
    )
    ON CONFLICT (id) ${onTestimonialConflict}
    RETURNING id
  `;
  if (rows.length > 0) testimonialCount++;
}

const verb = force ? "written" : "inserted";
console.log(
  `Products:     ${productCount}/${products.length} ${verb}.\n` +
    `Services:     ${serviceCount}/${services.length} ${verb}.\n` +
    `Pricing:      ${pricingCount}/${pricingTiers.length} ${verb}.\n` +
    `Testimonials: ${testimonialCount}/${testimonials.length} ${verb}.` +
    (force ? "" : "\n\nRows that already existed were left untouched (--force overwrites)."),
);
