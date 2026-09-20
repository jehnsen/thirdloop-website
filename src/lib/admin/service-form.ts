import { isProductIconName } from "@/lib/product-icons";
import { serviceAccentOptions, type Service } from "@/lib/services";

export type ServiceFormField =
  | "id"
  | "title"
  | "summary"
  | "icon"
  | "color"
  | "deliverables"
  | "outcomes";

export type ServiceFormErrors = Partial<Record<ServiceFormField, string>>;

export type ServiceFormState = {
  message?: string;
  errors?: ServiceFormErrors;
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

export function parseServiceForm(
  formData: FormData,
): { ok: true; service: Service } | { ok: false; errors: ServiceFormErrors } {
  const errors: ServiceFormErrors = {};

  const id = text(formData, "id");
  const title = text(formData, "title");
  const summary = text(formData, "summary");
  const icon = text(formData, "icon");
  const color = text(formData, "color");
  const outcomes = text(formData, "outcomes");
  const deliverables = lines(text(formData, "deliverables"));

  function checkLength(
    field: ServiceFormField,
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
  checkLength("title", "Title", title, 120);
  checkLength("summary", "Summary", summary, 600);
  checkLength("outcomes", "Outcome", outcomes, 200, false);

  if (!errors.id && !ID_PATTERN.test(id)) {
    errors.id = "Use lowercase letters, numbers and single hyphens only.";
  }

  if (!isProductIconName(icon)) {
    errors.icon = "Choose an icon.";
  }
  if (!serviceAccentOptions.some((option) => option.value === color)) {
    errors.color = "Choose an accent colour.";
  }

  if (deliverables.length === 0) {
    errors.deliverables = "List at least one deliverable.";
  } else if (deliverables.some((item) => item.length > 160)) {
    errors.deliverables = "Each deliverable is limited to 160 characters.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    service: {
      id,
      title,
      summary,
      icon: icon as Service["icon"],
      color,
      deliverables,
      outcomes,
      enabled: formData.get("enabled") === "on",
    },
  };
}
