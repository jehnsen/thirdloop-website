import type { Metadata } from "next";
import { PricingForm } from "@/components/admin/pricing-form";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "New tier" };

export default async function NewPricingTierPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader
        back={{ href: "/admin/pricing", label: "Pricing" }}
        title="New tier"
        description="Tiers appear in the pricing section on the home page."
      />
      <PricingForm />
    </>
  );
}
