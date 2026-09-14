import type { Metadata } from "next";
import { ProductForm } from "@/components/admin/product-form";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "New product" };

export default async function NewProductPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader
        back={{ href: "/admin/products", label: "Products" }}
        title="New product"
        description="Only the Basics are required — the detail page sections can be filled in later."
      />
      <ProductForm />
    </>
  );
}
