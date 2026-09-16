"use client";

import { CircleAlert, LoaderCircle, Plus, X } from "lucide-react";
import Link from "next/link";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { saveProduct } from "@/app/admin/actions";
import {
  Field,
  FieldError,
  Panel,
  StatusBadge,
  buttonClass,
  iconButtonClass,
  inputClass,
} from "@/components/admin/ui";
import { ProductIcon } from "@/components/ui/product-icon";
import {
  slugify,
  type ProductFormField,
  type ProductFormState,
} from "@/lib/admin/product-form";
import { productIconNames, type ProductIconName } from "@/lib/product-icons";
import {
  productAccentOptions,
  productCategoryOptions,
  productStatusOptions,
  type Product,
  type ProductStatus,
} from "@/lib/products";
import { cn } from "@/lib/utils";

const textareaClass = cn(inputClass, "resize-y leading-relaxed");

function withKeys<T extends object>(items: T[]) {
  return items.map((item, index) => ({ ...item, key: index }));
}

function nextKey(items: { key: number }[]) {
  return items.reduce((max, item) => Math.max(max, item.key), -1) + 1;
}

function EmptyRows({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-hair/20 px-4 py-6 text-center text-sm text-mist/70">
      {children}
    </p>
  );
}

function AddRowButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={buttonClass("secondary", "px-3 py-1.5 text-xs")}
    >
      <Plus aria-hidden className="size-3.5" />
      {children}
    </button>
  );
}

export function ProductForm({ product }: { product?: Product }) {
  const [state, formAction, pending] = useActionState<ProductFormState, FormData>(
    saveProduct,
    {},
  );
  const errors = state.errors ?? {};

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  // A new product's slug follows its name until edited by hand. Existing
  // slugs never change on their own — they're live URLs.
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [status, setStatus] = useState<ProductStatus>(
    product?.status ?? "In development",
  );
  const [icon, setIcon] = useState<ProductIconName>(product?.icon ?? "Sparkles");
  const [accent, setAccent] = useState<string>(
    product?.accent ?? productAccentOptions[2].value,
  );
  const [enabled, setEnabled] = useState(product?.enabled ?? true);
  const [facts, setFacts] = useState(() => withKeys(product?.facts ?? []));
  const [features, setFeatures] = useState(() => withKeys(product?.features ?? []));

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

  function describe(field: ProductFormField, hasHint = false) {
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
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-6">
      {product ? (
        <input type="hidden" name="originalSlug" value={product.slug} />
      ) : null}

      {state.message ? (
        <div
          ref={messageRef}
          tabIndex={-1}
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 focus:outline-none"
        >
          <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {state.message}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="flex min-w-0 flex-col gap-6">
          <Panel
            title="Basics"
            description="Shown on the products index card and at the top of the detail page."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="name" label="Name" error={errors.name} className="sm:col-span-2">
                <input
                  {...describe("name")}
                  name="name"
                  required
                  maxLength={120}
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (!slugTouched) setSlug(slugify(event.target.value));
                  }}
                  className={inputClass}
                />
              </Field>

              <Field
                id="slug"
                label="URL slug"
                error={errors.slug}
                hint={
                  product
                    ? "Changing this moves the public page — links to the old URL will 404."
                    : "Filled in from the name. Lowercase letters, numbers and hyphens."
                }
                className="sm:col-span-2"
              >
                <div className="flex rounded-xl border border-hair/20 bg-ink-800/80 transition-colors focus-within:border-flux-400 focus-within:ring-2 focus-within:ring-flux-400/30 hover:border-hair/35 has-[[aria-invalid=true]]:border-red-400/70">
                  <span
                    aria-hidden
                    className="flex items-center pl-3.5 font-mono text-xs text-mist/70 select-none"
                  >
                    /products/
                  </span>
                  <input
                    {...describe("slug", true)}
                    name="slug"
                    required
                    maxLength={80}
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    value={slug}
                    onChange={(event) => {
                      setSlug(event.target.value);
                      setSlugTouched(true);
                    }}
                    spellCheck={false}
                    autoCapitalize="none"
                    autoComplete="off"
                    className="min-w-0 flex-1 bg-transparent py-2.5 pr-3.5 pl-0.5 font-mono text-sm text-cream focus:outline-none"
                  />
                </div>
              </Field>

              <Field
                id="tagline"
                label="Tagline"
                error={errors.tagline}
                className="sm:col-span-2"
              >
                <input
                  {...describe("tagline")}
                  name="tagline"
                  required
                  maxLength={200}
                  defaultValue={product?.tagline}
                  className={inputClass}
                />
              </Field>

              <Field
                id="summary"
                label="Summary"
                hint="One paragraph for the index card."
                error={errors.summary}
                className="sm:col-span-2"
              >
                <textarea
                  {...describe("summary", true)}
                  name="summary"
                  required
                  maxLength={600}
                  rows={3}
                  defaultValue={product?.summary}
                  className={textareaClass}
                />
              </Field>

              <Field id="industry" label="Industry" error={errors.industry}>
                <input
                  {...describe("industry")}
                  name="industry"
                  required
                  maxLength={80}
                  placeholder="e.g. Automotive services"
                  defaultValue={product?.industry}
                  className={inputClass}
                />
              </Field>

              <Field
                id="url"
                label="Website"
                optional
                hint="Adds a “Visit site” button."
                error={errors.url}
              >
                <input
                  {...describe("url", true)}
                  name="url"
                  type="url"
                  inputMode="url"
                  placeholder="https://"
                  defaultValue={product?.url}
                  className={inputClass}
                />
              </Field>
            </div>
          </Panel>

          <Panel title="Story" description="The two prose cards on the detail page.">
            <div className="grid gap-5">
              <Field
                id="challenge"
                label="The challenge"
                optional
                error={errors.challenge}
              >
                <textarea
                  {...describe("challenge")}
                  name="challenge"
                  maxLength={4000}
                  rows={5}
                  defaultValue={product?.challenge}
                  className={textareaClass}
                />
              </Field>
              <Field
                id="approach"
                label="Our approach"
                optional
                error={errors.approach}
              >
                <textarea
                  {...describe("approach")}
                  name="approach"
                  maxLength={4000}
                  rows={5}
                  defaultValue={product?.approach}
                  className={textareaClass}
                />
              </Field>
            </div>
          </Panel>

          <Panel
            title="Features"
            description="Numbered cards under “What it does”."
            actions={
              <AddRowButton
                onClick={() =>
                  setFeatures((rows) => [
                    ...rows,
                    { key: nextKey(rows), title: "", body: "" },
                  ])
                }
              >
                Add feature
              </AddRowButton>
            }
          >
            {features.length === 0 ? (
              <EmptyRows>No features yet.</EmptyRows>
            ) : (
              <ol className="flex flex-col gap-3">
                {features.map((feature, index) => (
                  <li
                    key={feature.key}
                    className="flex gap-3 rounded-xl border border-hair/15 bg-white/2 p-3 sm:p-4"
                  >
                    <span
                      aria-hidden
                      className="w-5 shrink-0 pt-3 font-mono text-xs text-mist/70"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="grid min-w-0 flex-1 gap-2.5">
                      <label htmlFor={`feature-title-${feature.key}`} className="sr-only">
                        Feature {index + 1} title
                      </label>
                      <input
                        id={`feature-title-${feature.key}`}
                        name="featureTitle"
                        maxLength={120}
                        placeholder="Title"
                        defaultValue={feature.title}
                        className={inputClass}
                      />
                      <label htmlFor={`feature-body-${feature.key}`} className="sr-only">
                        Feature {index + 1} description
                      </label>
                      <textarea
                        id={`feature-body-${feature.key}`}
                        name="featureBody"
                        maxLength={600}
                        rows={2}
                        placeholder="What it does and why it matters"
                        defaultValue={feature.body}
                        className={textareaClass}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFeatures((rows) => rows.filter((row) => row.key !== feature.key))
                      }
                      aria-label={`Remove feature ${index + 1}`}
                      title="Remove"
                      className={cn(iconButtonClass, "mt-1 shrink-0")}
                    >
                      <X aria-hidden className="size-4" />
                    </button>
                  </li>
                ))}
              </ol>
            )}
            {errors.features ? (
              <FieldError className="mt-3">{errors.features}</FieldError>
            ) : null}
          </Panel>

          <Panel
            title="Key facts"
            description="Label and value pairs in the panel beside the detail page title. Industry is added automatically."
            actions={
              <AddRowButton
                onClick={() =>
                  setFacts((rows) => [
                    ...rows,
                    { key: nextKey(rows), label: "", value: "" },
                  ])
                }
              >
                Add fact
              </AddRowButton>
            }
          >
            {facts.length === 0 ? (
              <EmptyRows>No facts yet.</EmptyRows>
            ) : (
              <ul className="flex flex-col gap-2.5">
                {facts.map((fact, index) => (
                  <li key={fact.key} className="flex items-start gap-2">
                    <div className="grid min-w-0 flex-1 gap-2 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
                      <label htmlFor={`fact-label-${fact.key}`} className="sr-only">
                        Fact {index + 1} label
                      </label>
                      <input
                        id={`fact-label-${fact.key}`}
                        name="factLabel"
                        maxLength={40}
                        placeholder="Label, e.g. Client"
                        defaultValue={fact.label}
                        className={inputClass}
                      />
                      <label htmlFor={`fact-value-${fact.key}`} className="sr-only">
                        Fact {index + 1} value
                      </label>
                      <input
                        id={`fact-value-${fact.key}`}
                        name="factValue"
                        maxLength={120}
                        placeholder="Value"
                        defaultValue={fact.value}
                        className={inputClass}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setFacts((rows) => rows.filter((row) => row.key !== fact.key))
                      }
                      aria-label={`Remove fact ${index + 1}`}
                      title="Remove"
                      className={cn(iconButtonClass, "mt-1 shrink-0")}
                    >
                      <X aria-hidden className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {errors.facts ? (
              <FieldError className="mt-3">{errors.facts}</FieldError>
            ) : null}
          </Panel>

          <Panel
            title="Stack & outcomes"
            description="Chips under “Built with” and the checklist under “What it changes”."
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="stack"
                label="Built with"
                optional
                hint="One technology per line. The first three show on the index card."
              >
                <textarea
                  id="stack"
                  aria-describedby="stack-hint"
                  name="stack"
                  rows={6}
                  defaultValue={product?.stack.join("\n")}
                  className={textareaClass}
                />
              </Field>
              <Field id="outcomes" label="What it changes" optional hint="One outcome per line.">
                <textarea
                  id="outcomes"
                  aria-describedby="outcomes-hint"
                  name="outcomes"
                  rows={6}
                  defaultValue={product?.outcomes.join("\n")}
                  className={textareaClass}
                />
              </Field>
            </div>
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
                      ? "Listed on /products with its own page."
                      : "Hidden from visitors — its page returns 404."}
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

              <Field id="status" label="Status" error={errors.status}>
                <select
                  {...describe("status")}
                  name="status"
                  value={status}
                  onChange={(event) => setStatus(event.target.value as ProductStatus)}
                  className={inputClass}
                >
                  {productStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field id="category" label="Category" error={errors.category}>
                <select
                  {...describe("category")}
                  name="category"
                  defaultValue={product?.category ?? productCategoryOptions[0]}
                  className={inputClass}
                >
                  {productCategoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </Panel>

          <Panel title="Appearance">
            <div className="flex flex-col gap-6">
              <div
                aria-hidden
                className="flex items-center gap-3 rounded-xl border border-hair/20 bg-white/3 p-3.5"
              >
                <span
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-hair/20"
                  style={{
                    background: `color-mix(in oklab, ${accent} 16%, transparent)`,
                  }}
                >
                  <ProductIcon icon={icon} className="size-5" style={{ color: accent }} />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-cream">
                    {name || "Product name"}
                  </div>
                  <div className="mt-1.5">
                    <StatusBadge status={status} />
                  </div>
                </div>
              </div>

              <fieldset>
                <legend className="text-sm font-medium text-cream">Icon</legend>
                <div className="mt-2.5 grid grid-cols-8 gap-1.5 sm:grid-cols-12 lg:grid-cols-6">
                  {productIconNames.map((option) => (
                    <label key={option} title={option}>
                      <input
                        type="radio"
                        name="icon"
                        value={option}
                        checked={icon === option}
                        onChange={() => setIcon(option)}
                        className="peer sr-only"
                      />
                      <span className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-hair/20 text-mist/80 transition-colors peer-checked:border-loop-400/70 peer-checked:bg-loop-500/15 peer-checked:text-cream peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-flux-400 hover:border-hair/35 hover:text-cream">
                        <ProductIcon icon={option} aria-hidden className="size-4" />
                      </span>
                      <span className="sr-only">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.icon ? (
                  <FieldError className="mt-2">{errors.icon}</FieldError>
                ) : null}
              </fieldset>

              <fieldset>
                <legend className="text-sm font-medium text-cream">
                  Accent colour
                </legend>
                <div className="mt-2.5 flex flex-wrap gap-2.5">
                  {productAccentOptions.map((option) => (
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

      <div className="sticky bottom-4 z-20 flex items-center justify-between gap-3 rounded-2xl border border-hair/20 bg-ink-800/90 px-4 py-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <p className="min-w-0 truncate text-xs text-mist/80">
          {product ? (
            <>
              Editing{" "}
              <span className="font-mono text-mist">/products/{product.slug}</span>
            </>
          ) : (
            "New product"
          )}
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          <Link href="/admin/products" className={buttonClass("ghost", "px-3.5 py-2")}>
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
            {product ? "Save changes" : "Create product"}
          </button>
        </div>
      </div>
    </form>
  );
}
