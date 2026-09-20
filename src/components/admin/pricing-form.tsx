"use client";

import { CircleAlert, LoaderCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { savePricingTier } from "@/app/admin/actions";
import {
  Field,
  FieldError,
  Panel,
  buttonClass,
  inputClass,
} from "@/components/admin/ui";
import { slugify } from "@/lib/admin/product-form";
import type { PricingFormField, PricingFormState } from "@/lib/admin/pricing-form";
import { pricingAccentOptions, type PricingTier } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const textareaClass = cn(inputClass, "resize-y leading-relaxed");

export function PricingForm({ tier }: { tier?: PricingTier }) {
  const [state, formAction, pending] = useActionState<PricingFormState, FormData>(
    savePricingTier,
    {},
  );
  const errors = state.errors ?? {};

  const [name, setName] = useState(tier?.name ?? "");
  const [id, setId] = useState(tier?.id ?? "");
  // A new tier's identifier follows its name until edited by hand. Existing
  // identifiers never change on their own.
  const [idTouched, setIdTouched] = useState(Boolean(tier));
  const [price, setPrice] = useState(tier?.price ?? "");
  const [accent, setAccent] = useState<string>(
    tier?.accent ?? pricingAccentOptions[0].value,
  );
  const [featured, setFeatured] = useState(tier?.featured ?? false);
  const [enabled, setEnabled] = useState(tier?.enabled ?? true);

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

  function describe(field: PricingFormField, hasHint = false) {
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
      {tier ? <input type="hidden" name="originalId" value={tier.id} /> : null}

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
          <Panel title="Basics">
            <div className="flex flex-col gap-5">
              <Field id="name" label="Name" error={errors.name}>
                <input
                  {...describe("name")}
                  name="name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (!idTouched) setId(slugify(event.target.value));
                  }}
                  className={inputClass}
                  placeholder="Build"
                />
              </Field>

              <Field
                id="id"
                label="Identifier"
                error={errors.id}
                hint="Used internally to reference this tier. Lowercase, hyphens."
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
                  placeholder="build"
                />
              </Field>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="price"
                  label="Price"
                  error={errors.price}
                  hint="Free text — can read “From $13k” or “Custom”."
                >
                  <input
                    {...describe("price", true)}
                    name="price"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    className={inputClass}
                    placeholder="From $13k"
                  />
                </Field>

                <Field
                  id="cadence"
                  label="Cadence"
                  error={errors.cadence}
                  optional
                >
                  <input
                    {...describe("cadence")}
                    name="cadence"
                    defaultValue={tier?.cadence}
                    className={inputClass}
                    placeholder="per project"
                  />
                </Field>
              </div>

              <Field
                id="description"
                label="Description"
                error={errors.description}
                optional
              >
                <textarea
                  {...describe("description")}
                  name="description"
                  rows={3}
                  defaultValue={tier?.description}
                  className={textareaClass}
                />
              </Field>
            </div>
          </Panel>

          <Panel
            title="Features"
            description="One per line. These appear as the checklist on the card."
          >
            <Field id="features" label="Features" error={errors.features}>
              <textarea
                {...describe("features")}
                name="features"
                rows={7}
                defaultValue={tier?.features.join("\n")}
                className={cn(textareaClass, "font-mono text-xs")}
                placeholder={"Discovery workshops\nTarget-state architecture doc"}
              />
            </Field>
          </Panel>

          <Panel title="Call to action">
            <Field id="cta" label="Button label" error={errors.cta} optional>
              <input
                {...describe("cta")}
                name="cta"
                defaultValue={tier?.cta}
                className={inputClass}
                placeholder="Start a project"
              />
            </Field>
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Publishing">
            <div className="flex flex-col gap-5">
              <label className="flex cursor-pointer items-start justify-between gap-4">
                <span>
                  <span className="block text-sm font-medium text-cream">
                    Visible on site
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-mist/70">
                    {enabled
                      ? "Shown in the pricing section."
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

              <label className="flex cursor-pointer items-start justify-between gap-4 border-t border-hair/15 pt-5">
                <span>
                  <span className="block text-sm font-medium text-cream">
                    Most requested
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-mist/70">
                    Highlights this tier. Turning it on removes the badge from
                    whichever tier has it now.
                  </span>
                </span>
                <input
                  type="checkbox"
                  role="switch"
                  name="featured"
                  checked={featured}
                  onChange={(event) => setFeatured(event.target.checked)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-5.5 w-10 shrink-0 items-center rounded-full border border-hair/30 bg-white/8 transition-colors peer-checked:border-loop-400/50 peer-checked:bg-loop-500/70 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-flux-400 after:size-4 after:translate-x-0.5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5"
                />
              </label>
            </div>
          </Panel>

          <Panel title="Appearance">
            <div className="flex flex-col gap-6">
              <div
                aria-hidden
                className="rounded-xl border border-hair/20 bg-white/3 p-4"
              >
                {featured ? (
                  <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-loop-500/15 px-2.5 py-0.5 text-[0.65rem] font-medium text-loop-200">
                    <Sparkles className="size-2.5" />
                    Most requested
                  </span>
                ) : null}
                <div className="truncate text-sm font-semibold text-cream">
                  {name || "Tier name"}
                </div>
                <div className="mt-1 text-lg font-display font-semibold text-cream">
                  {price || "From $0"}
                </div>
                <div
                  className="mt-3 h-1 w-14 rounded-full"
                  style={{ background: accent }}
                />
              </div>

              <fieldset>
                <legend className="text-sm font-medium text-cream">
                  Accent colour
                </legend>
                <div className="mt-2.5 flex flex-wrap gap-2.5">
                  {pricingAccentOptions.map((option) => (
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
          {tier ? (
            <>
              Editing <span className="font-mono text-mist">{tier.id}</span>
            </>
          ) : (
            "New tier"
          )}
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          <Link href="/admin/pricing" className={buttonClass("ghost", "px-3.5 py-2")}>
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
            {tier ? "Save changes" : "Create tier"}
          </button>
        </div>
      </div>
    </form>
  );
}
