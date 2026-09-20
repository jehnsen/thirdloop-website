import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ProductsTable } from "@/components/admin/products-table";
import { Notice, PageHeader, buttonClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { getAllProductsForAdmin } from "@/lib/product-store";

export const metadata: Metadata = { title: "Products" };

const notices = {
  created: "Product created.",
  updated: "Changes saved — the public pages now show the update.",
  deleted: "Product deleted.",
};

type Props = { searchParams: Promise<{ notice?: string | string[] }> };

export default async function AdminProductsPage({ searchParams }: Props) {
  await requireAdmin();

  const [{ notice }, products] = await Promise.all([searchParams, getAllProductsForAdmin()]);
  const message =
    typeof notice === "string" && Object.hasOwn(notices, notice)
      ? notices[notice as keyof typeof notices]
      : null;
  const visibleCount = products.filter((product) => product.enabled).length;

  return (
    <>
      <PageHeader
        title="Products"
        description={`${products.length} in the catalogue · ${visibleCount} visible on the site`}
        actions={
          <Link href="/admin/products/new" className={buttonClass("primary")}>
            <Plus aria-hidden className="size-4" />
            Add product
          </Link>
        }
      />
      {message ? <Notice>{message}</Notice> : null}
      <ProductsTable products={products} />
    </>
  );
}
