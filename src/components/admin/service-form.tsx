"use client";

import { CircleAlert, LoaderCircle } from "lucide-react";
import Link from "next/link";
import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { saveService } from "@/app/admin/actions";
import {
  Field,
  FieldError,
  Panel,
  buttonClass,
  inputClass,
} from "@/components/admin/ui";
import { ProductIcon } from "@/components/ui/product-icon";
import { slugify } from "@/lib/admin/product-form";
import type { ServiceFormField, ServiceFormState } from "@/lib/admin/service-form";
import { productIconNames, type ProductIconName } from "@/lib/product-icons";
import { serviceAccentOptions, type Service } from "@/lib/services";
import { cn } from "@/lib/utils";

const textareaClass = cn(inputClass, "resize-y leading-relaxed");

export function ServiceForm({ service }: { service?: Service }) {
  const [state, formAction, pending] = useActionState<ServiceFormState, FormData>(
    saveService,
    {},
  );
  const errors = state.errors ?? {};

  const [title, setTitle] = useState(service?.title ?? "");
  const [id, setId] = useState(service?.id ?? "");
  // A new service's identifier follows its title until edited by hand.
  // Existing identifiers never change on their own.
  const [idTouched, setIdTouched] = useState(Boolean(service));
  const [icon, setIcon] = useState<ProductIconName>(service?.icon ?? "Workflow");
  const [color, setColor] = useState<string>(
    service?.color ?? serviceAccentOptions[0].value,
  );
  const [enabled, setEnabled] = useState(service?.enabled ?? true);

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

  function describe(field: ServiceFormField, hasHint = false) {
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
      {service ? <input type="hidden" name="originalId" value={service.id} /> : null}

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
              <Field id="title" label="Title" error={errors.title}>
                <input
                  {...describe("title")}
                  name="title"
                  value={title}
                  onChange={(event) => {
                    setTitle(event.target.value);
                    if (!idTouched) setId(slugify(event.target.value));
                  }}
                  className={inputClass}
                  placeholder="Web Development"
                />
              </Field>

              <Field
                id="id"
                label="Identifier"
                error={errors.id}
                hint="Used internally to reference this service. Lowercase, hyphens."
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
                  placeholder="web-development"
                />
              </Field>

              <Field
                id="summary"
                label="Summary"
                error={errors.summary}
                hint="The paragraph shown on the service card."
              >
                <textarea
                  {...describe("summary", true)}
                  name="summary"
                  rows={4}
                  defaultValue={service?.summary}
                  className={textareaClass}
                />
              </Field>
            </div>
          </Panel>

          <Panel
            title="Deliverables"
            description="One per line. These appear as the bulleted list on the card."
          >
            <Field id="deliverables" label="Deliverables" error={errors.deliverables}>
              <textarea
                {...describe("deliverables")}
                name="deliverables"
                rows={6}
                defaultValue={service?.deliverables.join("\n")}
                className={cn(textareaClass, "font-mono text-xs")}
                placeholder={"Next.js / React application builds\nDesign systems & component libraries"}
              />
            </Field>
          </Panel>

          <Panel
            title="Outcome"
            description="The single line printed under the card, in small caps."
          >
            <Field id="outcomes" label="Outcome" error={errors.outcomes} optional>
              <input
                {...describe("outcomes")}
                name="outcomes"
                defaultValue={service?.outcomes}
                className={inputClass}
                placeholder="Sub-second loads, Lighthouse 95+, zero-downtime deploys."
              />
            </Field>
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
                    ? "Listed in the services section on the home page."
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
                className="flex items-center gap-3 rounded-xl border border-hair/20 bg-white/3 p-3.5"
              >
                <span
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-hair/20"
                  style={{
                    background: `color-mix(in oklab, ${color} 16%, transparent)`,
                  }}
                >
                  <ProductIcon icon={icon} className="size-5" style={{ color }} />
                </span>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-cream">
                    {title || "Service title"}
                  </div>
                  <div className="mt-0.5 truncate font-mono text-xs text-mist/70">
                    {id || "identifier"}
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
                  {serviceAccentOptions.map((option) => (
                    <label key={option.value} title={option.label}>
                      <input
                        type="radio"
                        name="color"
                        value={option.value}
                        checked={color === option.value}
                        onChange={() => setColor(option.value)}
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
                {errors.color ? (
                  <FieldError className="mt-2">{errors.color}</FieldError>
                ) : null}
              </fieldset>
            </div>
          </Panel>
        </div>
      </div>

      <div className="sticky bottom-4 z-20 mt-6 flex items-center justify-between gap-3 rounded-2xl border border-hair/20 bg-ink-800/90 px-4 py-3 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
        <p className="min-w-0 truncate text-xs text-mist/80">
          {service ? (
            <>
              Editing <span className="font-mono text-mist">{service.id}</span>
            </>
          ) : (
            "New service"
          )}
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          <Link href="/admin/services" className={buttonClass("ghost", "px-3.5 py-2")}>
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
            {service ? "Save changes" : "Create service"}
          </button>
        </div>
      </div>
    </form>
  );
}
