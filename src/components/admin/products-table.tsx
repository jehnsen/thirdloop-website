"use client";

import { ExternalLink, Pencil, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import {
  StatusBadge,
  buttonClass,
  iconButtonClass,
  inputClass,
} from "@/components/admin/ui";
import { VisibilityToggle } from "@/components/admin/visibility-toggle";
import { ProductIcon } from "@/components/ui/product-icon";
import type { Product } from "@/lib/products";
import { cn } from "@/lib/utils";

const filters = [
  { value: "all", label: "All" },
  { value: "visible", label: "Visible" },
  { value: "hidden", label: "Hidden" },
] as const;

type Filter = (typeof filters)[number]["value"];

function matchesFilter(product: Product, filter: Filter) {
  if (filter === "visible") return product.enabled;
  if (filter === "hidden") return !product.enabled;
  return true;
}

/*
 * Columns drop out as the screen narrows (category, then status, then the
 * icon, slug and view link) so the name, visibility switch, edit and delete
 * always fit without scrolling sideways.
 */
export function ProductsTable({ products }: { products: Product[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter(
      (product) =>
        matchesFilter(product, filter) &&
        (!needle ||
          [product.name, product.slug, product.industry, product.category].some(
            (value) => value.toLowerCase().includes(needle),
          )),
    );
  }, [products, query, filter]);

  return (
    <div className="rounded-2xl border border-hair/20 bg-ink-800/70">
      <div className="flex flex-col gap-3 border-b border-hair/15 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-80">
          <label htmlFor="product-search" className="sr-only">
            Search products
          </label>
          <Search
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-mist/70"
          />
          <input
            id="product-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, slug or industry"
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
            const count = products.filter((p) => matchesFilter(p, option.value)).length;

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
            {products.length === 0
              ? "No products yet."
              : "No products match those filters."}
          </p>
          {products.length === 0 ? (
            <Link href="/admin/products/new" className={buttonClass("secondary")}>
              Add your first product
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
            <caption className="sr-only">Products</caption>
            <thead>
              <tr className="border-b border-hair/15 text-xs text-mist/70">
                <th scope="col" className="px-3 py-3 font-medium sm:px-5">
                  Product
                </th>
                <th scope="col" className="hidden px-4 py-3 font-medium xl:table-cell">
                  Category
                </th>
                <th scope="col" className="hidden px-4 py-3 font-medium md:table-cell">
                  Status
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
              {rows.map((product) => (
                <tr key={product.slug} className="transition-colors hover:bg-white/2">
                  <td className="px-3 py-3 sm:px-5">
                    <div className="flex items-center gap-3">
                      <span
                        className="hidden size-9 shrink-0 items-center justify-center rounded-lg border border-hair/20 sm:inline-flex"
                        style={{
                          background: `color-mix(in oklab, ${product.accent} 16%, transparent)`,
                        }}
                      >
                        <ProductIcon
                          icon={product.icon}
                          aria-hidden
                          className="size-4"
                          style={{ color: product.accent }}
                        />
                      </span>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/products/${product.slug}/edit`}
                          className="font-medium text-cream hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flux-400"
                        >
                          {product.name}
                        </Link>
                        <div className="hidden max-w-56 truncate font-mono text-xs text-mist/70 sm:block">
                          /products/{product.slug}
                        </div>
                        <div className="mt-1.5 md:hidden">
                          <StatusBadge status={product.status} />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 whitespace-nowrap text-mist xl:table-cell">
                    {product.category}
                  </td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <StatusBadge status={product.status} />
                  </td>
                  <td className="px-3 py-3 sm:px-4">
                    <VisibilityToggle
                      slug={product.slug}
                      name={product.name}
                      enabled={product.enabled}
                    />
                  </td>
                  <td className="px-3 py-3 sm:px-5">
                    <div className="flex items-center justify-end gap-1">
                      {product.enabled ? (
                        <a
                          href={`/products/${product.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`View ${product.name} on the site (opens in a new tab)`}
                          title="View on site"
                          className={cn(iconButtonClass, "hidden sm:inline-flex")}
                        >
                          <ExternalLink aria-hidden className="size-4" />
                        </a>
                      ) : (
                        <span aria-hidden className="hidden size-8 sm:block" />
                      )}
                      <Link
                        href={`/admin/products/${product.slug}/edit`}
                        aria-label={`Edit ${product.name}`}
                        title="Edit"
                        className={iconButtonClass}
                      >
                        <Pencil aria-hidden className="size-4" />
                      </Link>
                      <DeleteProductButton
                        slug={product.slug}
                        name={product.name}
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
