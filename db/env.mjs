/**
 * Minimal .env.local reader, so the db scripts can run under plain `node`
 * without pulling in a dependency. Next.js loads these files itself at
 * runtime; these scripts run outside it.
 *
 * Real environment variables always win, matching Next.js's own precedence.
 */
import { readFileSync } from "node:fs";
import path from "node:path";

const FILES = [".env.local", ".env"];

export function loadEnv(cwd = process.cwd()) {
  for (const file of FILES) {
    let contents;
    try {
      contents = readFileSync(path.join(cwd, file), "utf8");
    } catch {
      continue;
    }

    for (const line of contents.split(/\r?\n/)) {
      const match = /^\s*(?:export\s+)?([\w.-]+)\s*=\s*(.*)$/.exec(line);
      if (!match) continue;

      const [, key, rawValue] = match;
      if (key in process.env) continue;

      // Strip matching surrounding quotes; leave the value otherwise as-is.
      const value = rawValue.trim().replace(/^(['"])([\s\S]*)\1$/, "$2");
      process.env[key] = value;
    }
  }
}
