import { pricingAccentOptions, type PricingTier } from "@/lib/pricing";

export type PricingFormField =
  | "id"
  | "name"
  | "price"
  | "cadence"
  | "description"
  | "features"
  | "cta"
  | "accent";

export type PricingFormErrors = Partial<Record<PricingFormField, string>>;

export type PricingFormState = {
  message?: string;
  errors?: PricingFormErrors;
};

export const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function lines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function parsePricingForm(
  formData: FormData,
):
  | { ok: true; tier: PricingTier }
  | { ok: false; errors: PricingFormErrors } {
  const errors: PricingFormErrors = {};

  const id = text(formData, "id");
  const name = text(formData, "name");
  const price = text(formData, "price");
  const cadence = text(formData, "cadence");
  const description = text(formData, "description");
  const cta = text(formData, "cta");
  const accent = text(formData, "accent");
  const features = lines(text(formData, "features"));

  function checkLength(
    field: PricingFormField,
    label: string,
    value: string,
    max: number,
    required = true,
  ) {
    if (required && !value) errors[field] = `${label} is required.`;
    else if (value.length > max)
      errors[field] = `${label} must be ${max} characters or fewer.`;
  }

  checkLength("id", "Identifier", id, 60);
  checkLength("name", "Name", name, 80);
  checkLength("price", "Price", price, 60);
  checkLength("cadence", "Cadence", cadence, 60, false);
  checkLength("description", "Description", description, 600, false);
  checkLength("cta", "Button label", cta, 60, false);

  if (!errors.id && !ID_PATTERN.test(id)) {
    errors.id = "Use lowercase letters, numbers and single hyphens only.";
  }

  if (!pricingAccentOptions.some((option) => option.value === accent)) {
    errors.accent = "Choose an accent colour.";
  }

  if (features.length === 0) {
    errors.features = "List at least one feature.";
  } else if (features.some((item) => item.length > 160)) {
    errors.features = "Each feature is limited to 160 characters.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    tier: {
      id,
      name,
      price,
      cadence,
      description,
      features,
      cta,
      accent,
      featured: formData.get("featured") === "on",
      enabled: formData.get("enabled") === "on",
    },
  };
}
