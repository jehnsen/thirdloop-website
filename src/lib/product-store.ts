import { readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { Product } from "@/lib/products";

/**
 * The catalogue lives in a JSON file so the admin dashboard can edit it at
 * runtime. That needs a writable filesystem and a single server process —
 * replace these functions with database calls before deploying to serverless
 * hosting, where the filesystem is read-only.
 */
const DATA_FILE = path.join(process.cwd(), "data", "products.json");

async function readProducts(): Promise<Product[]> {
  return JSON.parse(await readFile(DATA_FILE, "utf8")) as Product[];
}

async function writeProducts(products: Product[]) {
  const json = `${JSON.stringify(products, null, 2)}\n`;
  const temp = `${DATA_FILE}.tmp`;

  // Write-then-rename so a crash mid-write can't leave a truncated catalogue.
  await writeFile(temp, json, "utf8");
  try {
    await rename(temp, DATA_FILE);
  } catch {
    // Windows refuses to replace a file another process has open.
    await writeFile(DATA_FILE, json, "utf8");
    await unlink(temp).catch(() => {});
  }
}

/** Memoised per request, so metadata and page renders share one read. */
export const getAllProducts = cache(readProducts);

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

let queue: Promise<unknown> = Promise.resolve();

/**
 * Runs read-modify-write cycles one at a time, so two saves landing together
 * can't silently overwrite each other.
 */
function mutate(
  change: (products: Product[]) => Product[] | MutationError,
): Promise<MutationResult> {
  const run = queue.then(async (): Promise<MutationResult> => {
    const next = change(await readProducts());
    if (typeof next === "string") return { ok: false, error: next };
    await writeProducts(next);
    return { ok: true };
  });
  queue = run.catch(() => {});
  return run;
}

export function insertProduct(product: Product) {
  return mutate((products) =>
    products.some((p) => p.slug === product.slug)
      ? "slug-taken"
      : [...products, product],
  );
}

/** Replaces the product currently at `slug`; the new data may rename it. */
export function replaceProduct(slug: string, product: Product) {
  return mutate((products) => {
    const index = products.findIndex((p) => p.slug === slug);
    if (index === -1) return "not-found";
    if (products.some((p, i) => i !== index && p.slug === product.slug)) {
      return "slug-taken";
    }
    return products.map((p, i) => (i === index ? product : p));
  });
}

export function removeProduct(slug: string) {
  return mutate((products) =>
    products.some((p) => p.slug === slug)
      ? products.filter((p) => p.slug !== slug)
      : "not-found",
  );
}

export function setProductEnabled(slug: string, enabled: boolean) {
  return mutate((products) =>
    products.some((p) => p.slug === slug)
      ? products.map((p) => (p.slug === slug ? { ...p, enabled } : p))
      : "not-found",
  );
}
