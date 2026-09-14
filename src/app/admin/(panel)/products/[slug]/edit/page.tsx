import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { ProductForm } from "@/components/admin/product-form";
import { PageHeader, buttonClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { getProductBySlug } from "@/lib/product-store";

export const metadata: Metadata = { title: "Edit product" };

type Props = { params: Promise<{ slug: string }> };

export default async function EditProductPage({ params }: Props) {
  await requireAdmin();

  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <PageHeader
        back={{ href: "/admin/products", label: "Products" }}
        title={product.name}
        description={product.enabled ? "Visible on the site" : "Hidden from the site"}
        actions={
          product.enabled ? (
            <a
              href={`/products/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("secondary")}
            >
              View on site
              <ExternalLink aria-hidden className="size-4" />
            </a>
          ) : null
        }
      />

      <ProductForm product={product} />

      <section className="mt-10 flex flex-col gap-4 rounded-2xl border border-red-400/20 bg-red-500/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-sm font-semibold text-white">Delete this product</h2>
          <p className="mt-1 text-sm text-white/50">
            Removes it from the catalogue for good. To take it off the site for
            now, switch off “Visible on site” instead.
          </p>
        </div>
        <div className="shrink-0">
          <DeleteProductButton slug={product.slug} name={product.name} />
        </div>
      </section>
    </>
  );
}
