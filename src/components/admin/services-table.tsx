"use client";

import { Pencil, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DeleteServiceButton } from "@/components/admin/delete-service-button";
import { buttonClass, iconButtonClass, inputClass } from "@/components/admin/ui";
import { ServiceVisibilityToggle } from "@/components/admin/service-visibility-toggle";
import { ProductIcon } from "@/components/ui/product-icon";
import type { Service } from "@/lib/services";
import { cn } from "@/lib/utils";

const filters = [
  { value: "all", label: "All" },
  { value: "visible", label: "Visible" },
  { value: "hidden", label: "Hidden" },
] as const;

type Filter = (typeof filters)[number]["value"];

function matchesFilter(service: Service, filter: Filter) {
  if (filter === "visible") return service.enabled;
  if (filter === "hidden") return !service.enabled;
  return true;
}

/*
 * Columns drop out as the screen narrows (deliverables, then the icon and
 * identifier) so the title, visibility switch, edit and delete always fit
 * without scrolling sideways.
 */
export function ServicesTable({ services }: { services: Service[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return services.filter(
      (service) =>
        matchesFilter(service, filter) &&
        (!needle ||
          [service.title, service.id, service.summary].some((value) =>
            value.toLowerCase().includes(needle),
          )),
    );
  }, [services, query, filter]);

  return (
    <div className="rounded-2xl border border-hair/20 bg-ink-800/70">
      <div className="flex flex-col gap-3 border-b border-hair/15 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-80">
          <label htmlFor="service-search" className="sr-only">
            Search services
          </label>
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-mist/70"
          />
          <input
            id="service-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title or identifier"
            className={cn(inputClass, "pl-10")}
          />
        </div>

        <div
          role="group"
          aria-label="Filter by visibility"
          className="inline-flex self-start rounded-full border border-hair/20 bg-ink-950/60 p-1"
        >
          {filters.map((option) => {
            const active = option.value === filter;
            const count = services.filter((s) =>
              matchesFilter(s, option.value),
            ).length;

            return (
              <button
                key={option.value}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(option.value)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flux-400",
                  active ? "bg-white/10 text-cream" : "text-mist hover:text-cream",
                )}
              >
                {option.label}
                <span className="text-mist/70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <p className="text-sm text-mist">
            {services.length === 0
              ? "No services yet."
              : "No services match those filters."}
          </p>
          {services.length === 0 ? (
            <Link href="/admin/services/new" className={buttonClass("secondary")}>
              Add your first service
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
              className={buttonClass("ghost", "py-2")}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Services</caption>
            <thead>
              <tr className="border-b border-hair/15 text-xs text-mist/70">
                <th scope="col" className="px-3 py-3 font-medium sm:px-5">
                  Service
                </th>
                <th scope="col" className="hidden px-4 py-3 font-medium xl:table-cell">
                  Deliverables
                </th>
                <th scope="col" className="px-3 py-3 font-medium sm:px-4">
                  On site
                </th>
                <th scope="col" className="px-3 py-3 sm:px-5">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hair/15">
              {rows.map((service) => (
                <tr key={service.id} className="transition-colors hover:bg-white/2">
                  <td className="px-3 py-3 sm:px-5">
                    <div className="flex items-center gap-3">
                      <span
                        className="hidden size-9 shrink-0 items-center justify-center rounded-lg border border-hair/20 sm:inline-flex"
                        style={{
                          background: `color-mix(in oklab, ${service.color} 16%, transparent)`,
                        }}
                      >
                        <ProductIcon
                          icon={service.icon}
                          aria-hidden
                          className="size-4"
                          style={{ color: service.color }}
                        />
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/services/${service.id}/edit`}
                          className="font-medium text-cream hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flux-400"
                        >
                          {service.title}
                        </Link>
                        <div className="hidden max-w-56 truncate font-mono text-xs text-mist/70 sm:block">
                          {service.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 whitespace-nowrap text-mist xl:table-cell">
                    {service.deliverables.length}
                  </td>
                  <td className="px-3 py-3 sm:px-4">
                    <ServiceVisibilityToggle
                      id={service.id}
                      title={service.title}
                      enabled={service.enabled}
                    />
                  </td>
                  <td className="px-3 py-3 sm:px-5">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/services/${service.id}/edit`}
                        aria-label={`Edit ${service.title}`}
                        title="Edit"
                        className={iconButtonClass}
                      >
                        <Pencil aria-hidden className="size-4" />
                      </Link>
                      <DeleteServiceButton
                        id={service.id}
                        title={service.title}
                        compact
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
