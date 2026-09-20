/**
 * Applies db/schema.sql to the Neon database in DATABASE_URL.
 *
 * The schema is written with IF NOT EXISTS throughout, so this is safe to run
 * against a database that is already up to date.
 *
 *   npm run db:migrate
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
import { loadEnv } from "./env.mjs";

loadEnv();

const url =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.DATABASE_URL_UNPOOLED;

if (!url) {
  console.error(
    "No DATABASE_URL. Add it to .env.local, or run with:\n" +
      "  DATABASE_URL='postgresql://...' npm run db:migrate",
  );
  process.exit(1);
}

const schema = await readFile(
  path.join(import.meta.dirname, "schema.sql"),
  "utf8",
);

const sql = neon(url);

// The HTTP driver sends one statement per request, so the file is split on
// semicolons at the end of a line — enough for this schema, which has no
// functions or dollar-quoted bodies.
const statements = schema
  .split(/;\s*$/m)
  .map((statement) => statement.trim())
  .filter((statement) => statement && !/^(--[^\n]*\n?)*$/.test(statement));

for (const statement of statements) {
  const [label] = statement.replace(/^(--[^\n]*\n)+/, "").split("\n");
  console.log(`→ ${label.slice(0, 72)}`);
  await sql.query(statement);
}

console.log(`\nSchema applied — ${statements.length} statements.`);
