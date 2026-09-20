import { cache } from "react";
import {
  DatabaseNotConfiguredError,
  getSql,
  isDatabaseConfigured,
} from "@/lib/db";
import type { Service } from "@/lib/services";

/**
 * The service portfolio, stored in Neon alongside the products. Mirrors
 * `product-store.ts` — see the notes there on why reads degrade to an empty
 * list without a database and writes do not.
 */

type ServiceRow = {
  id: string;
  title: string;
  summary: string;
  icon: string;
  color: string;
  deliverables: string[];
  outcomes: string;
  enabled: boolean;
};

function toService(row: ServiceRow): Service {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    icon: row.icon as Service["icon"],
    color: row.color,
    deliverables: row.deliverables ?? [],
    outcomes: row.outcomes,
    enabled: row.enabled,
  };
}

async function selectServices(): Promise<Service[]> {
  const sql = getSql();
  const rows = (await sql`
    SELECT id, title, summary, icon, color, deliverables, outcomes, enabled
      FROM services
     ORDER BY position, title
  `) as ServiceRow[];

  return rows.map(toService);
}

/** Memoised per request. Empty without a database, so `next build` succeeds. */
export const getAllServices = cache(async (): Promise<Service[]> => {
  if (!isDatabaseConfigured()) return [];
  return selectServices();
});

/** Reads for the admin dashboard, where an empty list must not be a guess. */
export async function getAllServicesForAdmin(): Promise<Service[]> {
  if (!isDatabaseConfigured()) throw new DatabaseNotConfiguredError();
  return getAllServices();
}

export async function getServiceById(id: string) {
  return (await getAllServices()).find((service) => service.id === id);
}

export async function getPublishedServices() {
  return (await getAllServices()).filter((service) => service.enabled);
}

type MutationError = "not-found" | "id-taken";

export type ServiceMutationResult =
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

export async function insertService(
  service: Service,
): Promise<ServiceMutationResult> {
  const sql = getSql();
  try {
    await sql`
      INSERT INTO services (
        id, title, summary, icon, color, deliverables, outcomes, enabled, position
      ) VALUES (
        ${service.id}, ${service.title}, ${service.summary}, ${service.icon},
        ${service.color}, ${JSON.stringify(service.deliverables)}::jsonb,
        ${service.outcomes}, ${service.enabled},
        (SELECT COALESCE(MAX(position), 0) + 1 FROM services)
      )
    `;
    return { ok: true };
  } catch (error) {
    if (isUniqueViolation(error)) return { ok: false, error: "id-taken" };
    throw error;
  }
}

/** Replaces the service currently at `id`; the new data may rename it. */
export async function replaceService(
  id: string,
  service: Service,
): Promise<ServiceMutationResult> {
  const sql = getSql();
  try {
    const rows = await sql`
      UPDATE services SET
        id           = ${service.id},
        title        = ${service.title},
        summary      = ${service.summary},
        icon         = ${service.icon},
        color        = ${service.color},
        deliverables = ${JSON.stringify(service.deliverables)}::jsonb,
        outcomes     = ${service.outcomes},
        enabled      = ${service.enabled},
        updated_at   = now()
      WHERE id = ${id}
      RETURNING id
    `;
    return affected(rows) > 0 ? { ok: true } : { ok: false, error: "not-found" };
  } catch (error) {
    if (isUniqueViolation(error)) return { ok: false, error: "id-taken" };
    throw error;
  }
}

export async function removeService(
  id: string,
): Promise<ServiceMutationResult> {
  const sql = getSql();
  const rows = await sql`DELETE FROM services WHERE id = ${id} RETURNING id`;
  return affected(rows) > 0 ? { ok: true } : { ok: false, error: "not-found" };
}

export async function setServiceEnabled(
  id: string,
  enabled: boolean,
): Promise<ServiceMutationResult> {
  const sql = getSql();
  const rows = await sql`
    UPDATE services
       SET enabled = ${enabled}, updated_at = now()
     WHERE id = ${id}
    RETURNING id
  `;
  return affected(rows) > 0 ? { ok: true } : { ok: false, error: "not-found" };
}
