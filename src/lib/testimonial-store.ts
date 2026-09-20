import { cache } from "react";
import {
  DatabaseNotConfiguredError,
  getSql,
  isDatabaseConfigured,
} from "@/lib/db";
import type { Testimonial } from "@/lib/testimonials";

/**
 * Client testimonials, stored in Neon. Mirrors `product-store.ts` — see the
 * notes there on why reads degrade to an empty list without a database and
 * writes do not.
 */

type TestimonialRow = {
  id: string;
  quote: string;
  name: string;
  company: string;
  accent: string;
  enabled: boolean;
};

function toTestimonial(row: TestimonialRow): Testimonial {
  return {
    id: row.id,
    quote: row.quote,
    name: row.name,
    company: row.company,
    accent: row.accent,
    enabled: row.enabled,
  };
}

async function selectTestimonials(): Promise<Testimonial[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, quote, name, company, accent, enabled
      FROM testimonials
     ORDER BY position, name
  `) as TestimonialRow[];

  return rows.map(toTestimonial);
}

/** Memoised per request. Empty without a database, so `next build` succeeds. */
export const getAllTestimonials = cache(async (): Promise<Testimonial[]> => {
  if (!isDatabaseConfigured()) return [];
  return selectTestimonials();
});

/** Reads for the admin dashboard, where an empty list must not be a guess. */
export async function getAllTestimonialsForAdmin(): Promise<Testimonial[]> {
  if (!isDatabaseConfigured()) throw new DatabaseNotConfiguredError();
  return getAllTestimonials();
}

export async function getTestimonialById(id: string) {
  return (await getAllTestimonials()).find((item) => item.id === id);
}

export async function getPublishedTestimonials() {
  return (await getAllTestimonials()).filter((item) => item.enabled);
}

type MutationError = "not-found" | "id-taken";

export type TestimonialMutationResult =
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

export async function insertTestimonial(
  testimonial: Testimonial,
): Promise<TestimonialMutationResult> {
  const sql = getSql();
  try {
    await sql`
      INSERT INTO testimonials (
        id, quote, name, company, accent, enabled, position
      ) VALUES (
        ${testimonial.id}, ${testimonial.quote}, ${testimonial.name},
        ${testimonial.company}, ${testimonial.accent}, ${testimonial.enabled},
        (SELECT COALESCE(MAX(position), 0) + 1 FROM testimonials)
      )
    `;
    return { ok: true };
  } catch (error) {
    if (isUniqueViolation(error)) return { ok: false, error: "id-taken" };
    throw error;
  }
}

/** Replaces the testimonial currently at `id`; the new data may rename it. */
export async function replaceTestimonial(
  id: string,
  testimonial: Testimonial,
): Promise<TestimonialMutationResult> {
  const sql = getSql();
  try {
    const rows = await sql`
      UPDATE testimonials SET
        id         = ${testimonial.id},
        quote      = ${testimonial.quote},
        name       = ${testimonial.name},
        company    = ${testimonial.company},
        accent     = ${testimonial.accent},
        enabled    = ${testimonial.enabled},
        updated_at = now()
      WHERE id = ${id}
      RETURNING id
    `;
    return affected(rows) > 0 ? { ok: true } : { ok: false, error: "not-found" };
  } catch (error) {
    if (isUniqueViolation(error)) return { ok: false, error: "id-taken" };
    throw error;
  }
}

export async function removeTestimonial(
  id: string,
): Promise<TestimonialMutationResult> {
  const sql = getSql();
  const rows = await sql`DELETE FROM testimonials WHERE id = ${id} RETURNING id`;
  return affected(rows) > 0 ? { ok: true } : { ok: false, error: "not-found" };
}

export async function setTestimonialEnabled(
  id: string,
  enabled: boolean,
): Promise<TestimonialMutationResult> {
  const sql = getSql();
  const rows = await sql`
    UPDATE testimonials
       SET enabled = ${enabled}, updated_at = now()
     WHERE id = ${id}
    RETURNING id
  `;
  return affected(rows) > 0 ? { ok: true } : { ok: false, error: "not-found" };
}
