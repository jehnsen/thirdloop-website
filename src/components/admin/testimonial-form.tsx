"use client";

import { CircleAlert, LoaderCircle, Quote } from "lucide-react";
import Link from "next/link";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { saveTestimonial } from "@/app/admin/actions";
import {
  Field,
  FieldError,
  Panel,
  buttonClass,
  inputClass,
} from "@/components/admin/ui";
import { slugify } from "@/lib/admin/product-form";
import type {
  TestimonialFormField,
  TestimonialFormState,
} from "@/lib/admin/testimonial-form";
import {
  testimonialAccentOptions,
  type Testimonial,
} from "@/lib/testimonials";
import { cn } from "@/lib/utils";

const textareaClass = cn(inputClass, "resize-y leading-relaxed");

export function TestimonialForm({
  testimonial,
}: {
  testimonial?: Testimonial;
}) {
  const [state, formAction, pending] = useActionState<
    TestimonialFormState,
    FormData
  >(saveTestimonial, {});
  const errors = state.errors ?? {};

  const [name, setName] = useState(testimonial?.name ?? "");
  const [id, setId] = useState(testimonial?.id ?? "");
  // A new testimonial's identifier follows the attribution until edited.
  const [idTouched, setIdTouched] = useState(Boolean(testimonial));
  const [quote, setQuote] = useState(testimonial?.quote ?? "");
  const [company, setCompany] = useState(testimonial?.company ?? "");
  const [accent, setAccent] = useState<string>(
    testimonial?.accent ?? testimonialAccentOptions[0].value,
  );
  const [enabled, setEnabled] = useState(testimonial?.enabled ?? true);

  const formRef = useRef<HTMLFormElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  // After a rejected save, move focus to the first problem so it isn't missed.
  useEffect(() => {
    if (!state.message) return;
    const firstInvalid = formRef.current?.querySelector<HTMLElement>(
      '[aria-invalid="true"]',
    );
    (firstInvalid ?? messageRef.current)?.focus();
  }, [state]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    // Dispatching from a transition rather than `<form action>` stops React
    // resetting the fields, so a rejected save keeps what was typed.
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  }

  function describe(field: TestimonialFormField, hasHint = false) {
    return {
      id: field,
      "aria-invalid": errors[field] ? true : undefined,
      "aria-describedby": errors[field]
        ? `${field}-error`
        : hasHint
          ? `${field}-hint`
          : undefined,
    };
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate>
      {testimonial ? (
        <input type="hidden" name="originalId" value={testimonial.id} />
      ) : null}

      {state.message ? (
        <div
          ref={messageRef}
          tabIndex={-1}
          role="alert"
          className="mb-6 flex items-center gap-2.5 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-300 focus:outline-none"
        >
          <CircleAlert aria-hidden className="size-4 shrink-0" />
          {state.message}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="flex flex-col gap-6">
          <Panel title="Quote">
            <Field id="quote" label="What they said" error={errors.quote}>
              <textarea
                {...describe("quote")}
                name="quote"
                rows={6}
                value={quote}
                onChange={(event) => setQuote(event.target.value)}
                className={textareaClass}
                placeholder="They spent the first two weeks understanding our operation…"
              />
            </Field>
          </Panel>

          <Panel
            title="Attribution"
            description="Shown under the quote. Use a role rather than a personal name unless you have permission."
          >
            <div className="flex flex-col gap-5">
              <Field id="name" label="Role or name" error={errors.name}>
                <input
                  {...describe("name")}
                  name="name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (!idTouched) setId(slugify(event.target.value));
                  }}
                  className={inputClass}
                  placeholder="Operations Director"
                />
              </Field>

              <Field
                id="company"
                label="Company line"
                error={errors.company}
                optional
              >
                <input
                  {...describe("company")}
                  name="company"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  className={inputClass}
                  placeholder="Freight & logistics client"
                />
              </Field>

              <Field
                id="id"
                label="Identifier"
                error={errors.id}
                hint="Used internally to reference this testimonial. Lowercase, hyphens."
              >
                <input
                  {...describe("id", true)}
                  name="id"
                  value={id}
                  onChange={(event) => {
                    setIdTouched(true);
                    setId(event.target.value);
                  }}
                  className={cn(inputClass, "font-mono")}
                  placeholder="operations-director"
                />
              </Field>
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Publishing">
            <label className="flex cursor-pointer items-start justify-between gap-4">
              <span>
                <span className="block text-sm font-medium text-cream">
                  Visible on site
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-mist/70">
                  {enabled
                    ? "Shown in the client feedback section."
                    : "Hidden from visitors."}
                </span>
              </span>
              <input
                type="checkbox"
                role="switch"
                name="enabled"
                checked={enabled}
                onChange={(event) => setEnabled(event.target.checked)}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className="mt-0.5 inline-flex h-5.5 w-10 shrink-0 items-center rounded-full border border-hair/30 bg-white/8 transition-colors peer-checked:border-flux-400/50 peer-checked:bg-flux-500/70 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-flux-400 after:size-4 after:translate-x-0.5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5"
              />
            </label>
          </Panel>

          <Panel title="Appearance">
            <div className="flex flex-col gap-6">
              <div
                aria-hidden
                className="rounded-xl border border-hair/20 bg-white/3 p-4"
              >
                <Quote className="size-5 opacity-40" style={{ color: accent }} />
                <p className="mt-3 line-clamp-4 text-xs leading-relaxed text-mist">
                  {quote || "The quote will appear here."}
                </p>
                <div className="mt-3 border-t border-hair/20 pt-3">
                  <div className="truncate text-xs font-medium text-cream">
                    {name || "Role or name"}
                  </div>
                  {company ? (
                    <div className="mt-0.5 truncate text-[0.7rem] text-mist/70">
                      {company}
                    </div>
                  ) : null}
                </div>
              </div>

              <fieldset>
                <legend className="text-sm font-medium text-cream">
                  Accent colour
                </legend>
                <div className="mt-2.5 flex flex-wrap gap-2.5">
                  {testimonialAccentOptions.map((option) => (
                    <label key={option.value} title={option.label}>
                      <input
                        type="radio"
                        name="accent"
                        value={option.value}
                        checked={accent === option.value}
                        onChange={() => setAccent(option.value)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden
                        className="block size-7 cursor-pointer rounded-full ring-offset-2 ring-offset-ink-900 transition-shadow peer-checked:ring-2 peer-checked:ring-white/80 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-flux-400"
                        style={{ background: option.value }}
                      />
                      <span className="sr-only">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.accent ? (
                  <FieldError className="mt-2">{errors.accent}</FieldError>
                ) : null}
              </fieldset>
            </div>
          </Panel>
        </div>
      </div>

      <div className="sticky bottom-4 z-20 mt-6 flex items-center justify-between gap-3 rounded-2xl border border-hair/20 bg-ink-800/90 px-4 py-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <p className="min-w-0 truncate text-xs text-mist/80">
          {testimonial ? (
            <>
              Editing{" "}
              <span className="font-mono text-mist">{testimonial.id}</span>
            </>
          ) : (
            "New testimonial"
          )}
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          <Link
            href="/admin/testimonials"
            className={buttonClass("ghost", "px-3.5 py-2")}
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={pending}
            className={buttonClass("primary", "px-4.5 py-2")}
          >
            {pending ? (
              <LoaderCircle aria-hidden className="size-4 animate-spin" />
            ) : null}
            {testimonial ? "Save changes" : "Create testimonial"}
          </button>
        </div>
      </div>
    </form>
  );
}
