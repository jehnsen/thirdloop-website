import { neon } from "@neondatabase/serverless";

/**
 * Neon connection for the catalogue.
 *
 * `neon()` speaks Postgres over HTTP, so there is no pool to keep alive
 * between invocations — the right shape for serverless hosting, where each
 * request may land on a cold instance.
 *
 * Vercel's Neon integration sets DATABASE_URL automatically. The others are
 * accepted so a project wired up before the rename still works.
 */
const CONNECTION_VARS = [
  "DATABASE_URL",
  "POSTGRES_URL",
  "DATABASE_URL_UNPOOLED",
] as const;

function connectionString() {
  for (const name of CONNECTION_VARS) {
    const value = process.env[name];
    if (value) return value;
  }
  return null;
}

export function isDatabaseConfigured() {
  return connectionString() !== null;
}

/**
 * Thrown when the app is asked for catalogue data without a database behind
 * it. Callers that can degrade (the public pages at build time) catch this;
 * the admin dashboard lets it surface, because silently showing an empty
 * catalogue there would invite someone to "re-add" everything.
 */
export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super(
      `No database connection string. Set ${CONNECTION_VARS[0]} — on Vercel, add the Neon integration; locally, copy it into .env.local.`,
    );
    this.name = "DatabaseNotConfiguredError";
  }
}

let client: ReturnType<typeof neon> | null = null;

/**
 * The tagged-template query function, e.g. sql`SELECT ...`.
 *
 * Interpolations become bound parameters, never string-concatenated SQL, so
 * user input can't alter the statement.
 */
export function getSql() {
  const url = connectionString();
  if (!url) throw new DatabaseNotConfiguredError();
  // One client per process; cheap to build, but no reason to rebuild it.
  client ??= neon(url);
  return client;
}
