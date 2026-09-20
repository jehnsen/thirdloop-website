import { cache } from "react";
import {
  DatabaseNotConfiguredError,
  getSql,
  isDatabaseConfigured,
} from "@/lib/db";
import type { PricingTier } from "@/lib/pricing";

/**
 * The pricing tiers, stored in Neon. Mirrors `product-store.ts` — see the
 * notes there on why reads degrade to an empty list without a database and
 * writes do not.
 */

type PricingTierRow = {
  id: string;
  name: string;
  price: string;
  cadence: string;
  description: string;
  features: string[];
  cta: string;
  accent: string;
  featured: boolean;
  enabled: boolean;
};

function toTier(row: PricingTierRow): PricingTier {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    cadence: row.cadence,
    description: row.description,
    features: row.features ?? [],
    cta: row.cta,
    accent: row.accent,
    featured: row.featured,
    enabled: row.enabled,
  };
}

async function selectTiers(): Promise<PricingTier[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, name, price, cadence, description, features, cta, accent,
           featured, enabled
      FROM pricing_tiers
     ORDER BY position, name
  `) as PricingTierRow[];

  return rows.map(toTier);
}

/** Memoised per request. Empty without a database, so `next build` succeeds. */
export const getAllPricingTiers = cache(async (): Promise<PricingTier[]> => {
  if (!isDatabaseConfigured()) return [];
  return selectTiers();
});

/** Reads for the admin dashboard, where an empty list must not be a guess. */
export async function getAllPricingTiersForAdmin(): Promise<PricingTier[]> {
  if (!isDatabaseConfigured()) throw new DatabaseNotConfiguredError();
  return getAllPricingTiers();
}

export async function getPricingTierById(id: string) {
  return (await getAllPricingTiers()).find((tier) => tier.id === id);
}

export async function getPublishedPricingTiers() {
  return (await getAllPricingTiers()).filter((tier) => tier.enabled);
}

type MutationError = "not-found" | "id-taken";

export type PricingMutationResult =
  | { ok: true }
  | { ok: false; error: MutationError };

const UNIQUE_VIOLATION = "23505";

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: string }).code === UNIQUE_VIOLATION
  );
}

function affected(rows: unknown): number {
  return Array.isArray(rows) ? rows.length : 0;
}

/**
 * Clears the badge from every other tier. The schema allows only one featured
 * tier, so this runs before featuring a tier rather than letting the unique
 * index reject the write.
 */
async function unfeatureOthers(id: string) {
  const sql = getSql();
  await sql`
    UPDATE pricing_tiers
       SET featured = false, updated_at = now()
     WHERE featured AND id <> ${id}
  `;
}

export async function insertPricingTier(
  tier: PricingTier,
): Promise<PricingMutationResult> {
  const sql = getSql();
  try {
    if (tier.featured) await unfeatureOthers(tier.id);
    await sql`
      INSERT INTO pricing_tiers (
        id, name, price, cadence, description, features, cta, accent,
        featured, enabled, position
      ) VALUES (
        ${tier.id}, ${tier.name}, ${tier.price}, ${tier.cadence},
        ${tier.description}, ${JSON.stringify(tier.features)}::jsonb,
        ${tier.cta}, ${tier.accent}, ${tier.featured}, ${tier.enabled},
        (SELECT COALESCE(MAX(position), 0) + 1 FROM pricing_tiers)
      )
    `;
    return { ok: true };
  } catch (error) {
    if (isUniqueViolation(error)) return { ok: false, error: "id-taken" };
    throw error;
  }
}

/** Replaces the tier currently at `id`; the new data may rename it. */
export async function replacePricingTier(
  id: string,
  tier: PricingTier,
): Promise<PricingMutationResult> {
  const sql = getSql();
  try {
    if (tier.featured) await unfeatureOthers(tier.id);
    const rows = await sql`
      UPDATE pricing_tiers SET
        id          = ${tier.id},
        name        = ${tier.name},
        price       = ${tier.price},
        cadence     = ${tier.cadence},
        description = ${tier.description},
        features    = ${JSON.stringify(tier.features)}::jsonb,
        cta         = ${tier.cta},
        accent      = ${tier.accent},
        featured    = ${tier.featured},
        enabled     = ${tier.enabled},
        updated_at  = now()
      WHERE id = ${id}
      RETURNING id
    `;
    return affected(rows) > 0 ? { ok: true } : { ok: false, error: "not-found" };
  } catch (error) {
    if (isUniqueViolation(error)) return { ok: false, error: "id-taken" };
    throw error;
  }
}

export async function removePricingTier(
  id: string,
): Promise<PricingMutationResult> {
  const sql = getSql();
  const rows = await sql`
    DELETE FROM pricing_tiers WHERE id = ${id} RETURNING id
  `;
  return affected(rows) > 0 ? { ok: true } : { ok: false, error: "not-found" };
}

export async function setPricingTierEnabled(
  id: string,
  enabled: boolean,
): Promise<PricingMutationResult> {
  const sql = getSql();
  const rows = await sql`
    UPDATE pricing_tiers
       SET enabled = ${enabled}, updated_at = now()
     WHERE id = ${id}
    RETURNING id
  `;
  return affected(rows) > 0 ? { ok: true } : { ok: false, error: "not-found" };
}
