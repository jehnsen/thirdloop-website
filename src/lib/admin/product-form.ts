import { isProductIconName } from "@/lib/product-icons";
import {
  productAccentOptions,
  productCategoryOptions,
  productStatusOptions,
  type Product,
  type ProductCategory,
  type ProductStatus,
} from "@/lib/products";

export type ProductFormField =
  | "name"
  | "slug"
  | "tagline"
  | "summary"
  | "category"
  | "status"
  | "url"
  | "icon"
  | "accent"
  | "industry"
  | "challenge"
  | "approach"
  | "facts"
  | "features";

export type ProductFormErrors = Partial<Record<ProductFormField, string>>;

export type ProductFormState = {
  message?: string;
  errors?: ProductFormErrors;
};

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .slice(0, 80)
    .replace(/^-+|-+$/g, "");
}

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function textList(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((value) => (typeof value === "string" ? value.trim() : ""));
}

function lines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Zips two repeated inputs into rows, dropping rows left entirely blank. */
function rows(first: string[], second: string[]) {
  const result: [string, string][] = [];
  for (let i = 0; i < Math.max(first.length, second.length); i++) {
    const a = first[i] ?? "";
    const b = second[i] ?? "";
    if (a || b) result.push([a, b]);
  }
  return result;
}

function isOneOf<T extends string>(options: readonly T[], value: string): value is T {
  return (options as readonly string[]).includes(value);
}

export function parseProductForm(
  formData: FormData,
): { ok: true; product: Product } | { ok: false; errors: ProductFormErrors } {
  const errors: ProductFormErrors = {};

  function checkLength(
    field: ProductFormField,
    label: string,
    value: string,
    max: number,
    required = true,
  ) {
    if (required && !value) errors[field] = `${label} is required.`;
    else if (value.length > max)
      errors[field] = `${label} must be ${max} characters or fewer.`;
  }

  const name = text(formData, "name");
  const slug = text(formData, "slug");
  const tagline = text(formData, "tagline");
  const summary = text(formData, "summary");
  const industry = text(formData, "industry");
  const challenge = text(formData, "challenge");
  const approach = text(formData, "approach");
  const url = text(formData, "url");
  const category = text(formData, "category");
  const status = text(formData, "status");
  const icon = text(formData, "icon");
  const accent = text(formData, "accent");

  checkLength("name", "Name", name, 120);
  checkLength("slug", "Slug", slug, 80);
  checkLength("tagline", "Tagline", tagline, 200);
  checkLength("summary", "Summary", summary, 600);
  checkLength("industry", "Industry", industry, 80);
  checkLength("challenge", "Challenge", challenge, 4000, false);
  checkLength("approach", "Approach", approach, 4000, false);

  if (!errors.slug && !SLUG_PATTERN.test(slug)) {
    errors.slug = "Use lowercase letters, numbers and single hyphens only.";
  }

  if (url) {
    let valid = false;
    try {
      valid = ["http:", "https:"].includes(new URL(url).protocol);
    } catch {}
    if (!valid) errors.url = "Enter a full address starting with https://";
  }

  if (!isOneOf(productCategoryOptions, category)) {
    errors.category = "Choose a category.";
  }
  if (!isOneOf(productStatusOptions, status)) {
    errors.status = "Choose a status.";
  }
  if (!isProductIconName(icon)) {
    errors.icon = "Choose an icon.";
  }
  if (!productAccentOptions.some((option) => option.value === accent)) {
    errors.accent = "Choose an accent colour.";
  }

  const facts = rows(textList(formData, "factLabel"), textList(formData, "factValue"));
  if (facts.some(([label, value]) => !label || !value)) {
    errors.facts = "Every fact needs both a label and a value.";
  } else if (facts.some(([label, value]) => label.length > 40 || value.length > 120)) {
    errors.facts = "Fact labels are limited to 40 characters and values to 120.";
  }

  const features = rows(
    textList(formData, "featureTitle"),
    textList(formData, "featureBody"),
  );
  if (features.some(([title, body]) => !title || !body)) {
    errors.features = "Every feature needs both a title and a description.";
  } else if (features.some(([title, body]) => title.length > 120 || body.length > 600)) {
    errors.features =
      "Feature titles are limited to 120 characters and descriptions to 600.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    product: {
      slug,
      name,
      tagline,
      summary,
      category: category as ProductCategory,
      status: status as ProductStatus,
      enabled: formData.get("enabled") === "on",
      ...(url ? { url } : {}),
      icon: icon as Product["icon"],
      accent,
      industry,
      facts: facts.map(([label, value]) => ({ label, value })),
      challenge,
      approach,
      features: features.map(([title, body]) => ({ title, body })),
      stack: lines(text(formData, "stack")),
      outcomes: lines(text(formData, "outcomes")),
    },
  };
}
