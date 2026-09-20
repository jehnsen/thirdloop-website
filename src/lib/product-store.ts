import { cache } from "react";
import {
  DatabaseNotConfiguredError,
  getSql,
  isDatabaseConfigured,
} from "@/lib/db";
import type { Product } from "@/lib/products";

/**
 * The product catalogue, stored in Neon. The admin dashboard edits it at
 * runtime, so this must not rely on a writable filesystem or on two requests
 * landing on the same instance.
 *
 * Public reads go through `getAllProducts`, which returns an empty catalogue
 * when no database is configured — that keeps `next build` working on a fresh
 * clone or a preview deploy where the integration hasn't been added yet.
 * Writes always demand a real connection.
 */

/** A row as Postgres hands it back: snake_case, jsonb already parsed. */
type ProductRow = {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  category: string;
  status: string;
  enabled: boolean;
  url: string | null;
  icon: string;
  accent: string;
  industry: string;
  facts: Product["facts"];
  challenge: string;
  approach: string;
  features: Product["features"];
  stack: string[];
  outcomes: string[];
};

/**
 * `url` is optional on Product rather than nullable, so a NULL column has to
 * become an absent key — otherwise `url: null` would reach components that
 * expect `string | undefined`.
 */
function toProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    summary: row.summary,
    category: row.category as Product["category"],
    status: row.status as Product["status"],
    enabled: row.enabled,
    ...(row.url ? { url: row.url } : {}),
    icon: row.icon as Product["icon"],
    accent: row.accent,
    industry: row.industry,
    facts: row.facts ?? [],
    challenge: row.challenge,
    approach: row.approach,
    features: row.features ?? [],
    stack: row.stack ?? [],
    outcomes: row.outcomes ?? [],
  };
}

async function selectProducts(): Promise<Product[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT slug, name, tagline, summary, category, status, enabled, url, icon,
           accent, industry, facts, challenge, approach, features, stack, outcomes
      FROM products
     ORDER BY position, name
  `) as ProductRow[];

  return rows.map(toProduct);
}

/**
 * Memoised per request, so metadata and the page body share a single query.
 *
 * Without a database this resolves to an empty catalogue instead of throwing:
 * `generateStaticParams` and the page bodies run during `next build`, which
 * happens before the runtime environment exists on some hosts.
 */
export const getAllProducts = cache(async (): Promise<Product[]> => {
  if (!isDatabaseConfigured()) return [];
  return selectProducts();
});

/** Reads for the admin dashboard, where an empty list must not be a guess. */
export async function getAllProductsForAdmin(): Promise<Product[]> {
  if (!isDatabaseConfigured()) throw new DatabaseNotConfiguredError();
  return getAllProducts();
}

export async function getProductBySlug(slug: string) {
  return (await getAllProducts()).find((product) => product.slug === slug);
}

export async function getPublishedProducts() {
  return (await getAllProducts()).filter((product) => product.enabled);
}

export async function getPublishedProduct(slug: string) {
  const product = await getProductBySlug(slug);
  return product?.enabled ? product : undefined;
}

type MutationError = "not-found" | "slug-taken";

export type MutationResult = { ok: true } | { ok: false; error: MutationError };

/** Postgres raises this when a statement violates a unique constraint. */
const UNIQUE_VIOLATION = "23505";

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: string }).code === UNIQUE_VIOLATION
  );
}

/**
 * `sql` is typed as returning one of several shapes depending on how it is
 * configured, so a `RETURNING` result needs narrowing before it can be counted.
 */
function affected(rows: unknown): number {
  return Array.isArray(rows) ? rows.length : 0;
}

export async function insertProduct(product: Product): Promise<MutationResult> {
  const sql = getSql();
  try {
    await sql`
      INSERT INTO products (
        slug, name, tagline, summary, category, status, enabled, url, icon,
        accent, industry, facts, challenge, approach, features, stack, outcomes,
        position
      ) VALUES (
        ${product.slug}, ${product.name}, ${product.tagline}, ${product.summary},
        ${product.category}, ${product.status}, ${product.enabled},
        ${product.url ?? null}, ${product.icon}, ${product.accent},
        ${product.industry}, ${JSON.stringify(product.facts)}::jsonb,
        ${product.challenge}, ${product.approach},
        ${JSON.stringify(product.features)}::jsonb,
        ${JSON.stringify(product.stack)}::jsonb,
        ${JSON.stringify(product.outcomes)}::jsonb,
        -- New products land at the end of the catalogue.
        (SELECT COALESCE(MAX(position), 0) + 1 FROM products)
      )
    `;
    return { ok: true };
  } catch (error) {
    // The slug is the primary key, so a duplicate is a user error, not a fault.
    if (isUniqueViolation(error)) return { ok: false, error: "slug-taken" };
    throw error;
  }
}

/** Replaces the product currently at `slug`; the new data may rename it. */
export async function replaceProduct(
  slug: string,
  product: Product,
): Promise<MutationResult> {
  const sql = getSql();
  try {
    const rows = await sql`
      UPDATE products SET
        slug       = ${product.slug},
        name       = ${product.name},
        tagline    = ${product.tagline},
        summary    = ${product.summary},
        category   = ${product.category},
        status     = ${product.status},
        enabled    = ${product.enabled},
        url        = ${product.url ?? null},
        icon       = ${product.icon},
        accent     = ${product.accent},
        industry   = ${product.industry},
        facts      = ${JSON.stringify(product.facts)}::jsonb,
        challenge  = ${product.challenge},
        approach   = ${product.approach},
        features   = ${JSON.stringify(product.features)}::jsonb,
        stack      = ${JSON.stringify(product.stack)}::jsonb,
        outcomes   = ${JSON.stringify(product.outcomes)}::jsonb,
        updated_at = now()
      WHERE slug = ${slug}
      RETURNING slug
    `;
    return affected(rows) > 0 ? { ok: true } : { ok: false, error: "not-found" };
  } catch (error) {
    // Renaming onto a slug another product already holds.
    if (isUniqueViolation(error)) return { ok: false, error: "slug-taken" };
    throw error;
  }
}

export async function removeProduct(slug: string): Promise<MutationResult> {
  const sql = getSql();
  const rows = await sql`
    DELETE FROM products WHERE slug = ${slug} RETURNING slug
  `;
  return affected(rows) > 0 ? { ok: true } : { ok: false, error: "not-found" };
}

export async function setProductEnabled(
  slug: string,
  enabled: boolean,
): Promise<MutationResult> {
  const sql = getSql();
  const rows = await sql`
    UPDATE products
       SET enabled = ${enabled}, updated_at = now()
     WHERE slug = ${slug}
    RETURNING slug
  `;
  return affected(rows) > 0 ? { ok: true } : { ok: false, error: "not-found" };
}
