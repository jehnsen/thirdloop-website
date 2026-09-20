import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { setChatbotVisibility } from "@/app/admin/actions";
import { EntityVisibilityToggle } from "@/components/admin/entity-controls";
import { PageHeader, Panel, buttonClass } from "@/components/admin/ui";
import { ProductIcon } from "@/components/ui/product-icon";
import { requireAdmin } from "@/lib/admin/auth";
import { getAllProductsForAdmin } from "@/lib/product-store";
import {
  productCategoryOptions,
  productStatusOptions,
  type Product,
} from "@/lib/products";
import { getSiteSettings } from "@/lib/settings-store";

export const metadata: Metadata = { title: "Dashboard" };

const listFormat = new Intl.ListFormat("en", { type: "conjunction" });

/** Detail-page sections that would render empty on the public site. */
function missingSections(product: Product) {
  const missing: string[] = [];
  if (!product.challenge) missing.push("challenge");
  if (!product.approach) missing.push("approach");
  if (product.features.length === 0) missing.push("features");
  if (product.outcomes.length === 0) missing.push("outcomes");
  return missing;
}

/** Single-series horizontal bars: one hue, values labelled at the bar tip. */
function Breakdown({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; count: number }[];
}) {
  const max = Math.max(1, ...rows.map((row) => row.count));

  return (
    <Panel title={title}>
      <ul className="flex flex-col gap-3">
        {rows.map((row) => (
          <li
            key={row.label}
            className="grid grid-cols-[8rem_minmax(0,1fr)] items-center gap-3 text-sm"
          >
            <span className="truncate text-mist">{row.label}</span>
            <span className="flex h-6 items-center gap-2 border-l border-hair/25">
              <span
                aria-hidden
                className="h-3 rounded-r-sm bg-loop-400"
                style={{ width: `calc((100% - 2.5rem) * ${row.count / max})` }}
              />
              <span className="font-medium text-cream">
                {row.count}
                <span className="sr-only"> products</span>
              </span>
            </span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [products, settings] = await Promise.all([
    getAllProductsForAdmin(),
    getSiteSettings(),
  ]);
  const visibleCount = products.filter((product) => product.enabled).length;
  const withGaps = products
    .map((product) => ({ product, missing: missingSections(product) }))
    .filter(({ missing }) => missing.length > 0);

  const stats = [
    { label: "Products", value: products.length, detail: "in the catalogue" },
    {
      label: "Visible on site",
      value: visibleCount,
      detail: `${products.length - visibleCount} hidden`,
    },
    {
      label: "With a site link",
      value: products.filter((product) => product.url).length,
      detail: "live or demo URL",
    },
    {
      label: "Detail pages with gaps",
      value: withGaps.length,
      detail: "empty sections",
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="An overview of the products catalogue."
        actions={
          <>
            <Link href="/admin/products" className={buttonClass("secondary")}>
              Manage products
            </Link>
            <Link href="/admin/products/new" className={buttonClass("primary")}>
              <Plus aria-hidden className="size-4" />
              Add product
            </Link>
          </>
        }
      />

      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-hair/20 bg-ink-800/70 p-5"
          >
            <dt className="text-xs text-mist">{stat.label}</dt>
            <dd className="mt-2 text-3xl font-display font-semibold tracking-tight text-cream">
              {stat.value}
            </dd>
            <dd className="mt-1 text-xs text-mist/70">{stat.detail}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Breakdown
          title="Products by status"
          rows={productStatusOptions.map((status) => ({
            label: status,
            count: products.filter((product) => product.status === status).length,
          }))}
        />
        <Breakdown
          title="Products by category"
          rows={productCategoryOptions.map((category) => ({
            label: category,
            count: products.filter((product) => product.category === category)
              .length,
          }))}
        />
      </div>

      <Panel
        title="Site settings"
        description="Global switches for the public site. Changes apply everywhere immediately."
        className="mt-6"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-cream">Chatbot widget</p>
            <p className="mt-0.5 text-xs text-mist/80">
              The floating chat toggle shown in the corner of every public
              page.
            </p>
          </div>
          <EntityVisibilityToggle
            id="chatbot"
            label="the chatbot widget"
            enabled={settings.chatbot_enabled}
            action={setChatbotVisibility}
          />
        </div>
      </Panel>

      <Panel
        title="Detail pages with gaps"
        description="These sections show up as empty on the public product page until they're filled in."
        className="mt-6"
      >
        {withGaps.length === 0 ? (
          <p className="text-sm text-mist">
            Every product has a complete detail page.
          </p>
        ) : (
          <ul className="-my-3 divide-y divide-hair/15">
            {withGaps.map(({ product, missing }) => (
              <li
                key={product.slug}
                className="flex items-center justify-between gap-4 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-hair/20"
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
                    <p className="truncate text-sm font-medium text-cream">
                      {product.name}
                      {product.enabled ? null : (
                        <span className="ml-2 text-xs font-normal text-mist/70">
                          Hidden
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-mist/80">
                      Missing {listFormat.format(missing)}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/admin/products/${product.slug}/edit`}
                  aria-label={`Edit ${product.name}`}
                  className={buttonClass("ghost", "shrink-0 px-3.5 py-1.5 text-xs")}
                >
                  Edit
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
