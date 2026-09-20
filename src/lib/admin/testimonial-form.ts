import { testimonialAccentOptions, type Testimonial } from "@/lib/testimonials";

export type TestimonialFormField =
  | "id"
  | "quote"
  | "name"
  | "company"
  | "accent";

export type TestimonialFormErrors = Partial<
  Record<TestimonialFormField, string>
>;

export type TestimonialFormState = {
  message?: string;
  errors?: TestimonialFormErrors;
};

export const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function parseTestimonialForm(
  formData: FormData,
):
  | { ok: true; testimonial: Testimonial }
  | { ok: false; errors: TestimonialFormErrors } {
  const errors: TestimonialFormErrors = {};

  const id = text(formData, "id");
  const quote = text(formData, "quote");
  const name = text(formData, "name");
  const company = text(formData, "company");
  const accent = text(formData, "accent");

  function checkLength(
    field: TestimonialFormField,
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
  checkLength("quote", "Quote", quote, 800);
  checkLength("name", "Attribution", name, 120);
  checkLength("company", "Company", company, 120, false);

  if (!errors.id && !ID_PATTERN.test(id)) {
    errors.id = "Use lowercase letters, numbers and single hyphens only.";
  }

  if (!testimonialAccentOptions.some((option) => option.value === accent)) {
    errors.accent = "Choose an accent colour.";
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    testimonial: {
      id,
      quote,
      name,
      company,
      accent,
      enabled: formData.get("enabled") === "on",
    },
  };
}
