import { cache } from "react";
import { getSql, isDatabaseConfigured } from "@/lib/db";

/**
 * Site-wide on/off switches, stored as one row per key in `settings`. Mirrors
 * the other stores' degrade-without-a-database story: public reads fall back
 * to the default (everything on) so a fresh clone or preview deploy without
 * the Neon integration still renders normally.
 */

export type SettingKey = "chatbot_enabled";

/** What a missing row means for each key — i.e. behaviour before anyone has
 * ever touched this setting. */
const DEFAULTS: Record<SettingKey, boolean> = {
  chatbot_enabled: true,
};

type SettingsRow = { key: string; value: boolean };

const selectSettings = cache(async (): Promise<Record<string, boolean>> => {
  if (!isDatabaseConfigured()) return {};
  const sql = getSql();
  const rows = (await sql`SELECT key, value FROM settings`) as SettingsRow[];
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
});

/** Memoised per request, like the other `getAll*` reads. */
export async function getSiteSettings(): Promise<Record<SettingKey, boolean>> {
  const stored = await selectSettings();
  return {
    chatbot_enabled: stored.chatbot_enabled ?? DEFAULTS.chatbot_enabled,
  };
}

export async function isChatbotEnabled(): Promise<boolean> {
  const settings = await getSiteSettings();
  return settings.chatbot_enabled;
}

export async function setSetting(key: SettingKey, value: boolean) {
  const sql = getSql();
  await sql`
    INSERT INTO settings (key, value, updated_at)
    VALUES (${key}, ${value}, now())
    ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = now()
  `;
}
