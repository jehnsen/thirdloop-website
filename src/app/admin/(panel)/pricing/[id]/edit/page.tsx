import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deletePricingTier } from "@/app/admin/actions";
import { EntityDeleteButton } from "@/components/admin/entity-controls";
import { PricingForm } from "@/components/admin/pricing-form";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { getPricingTierById } from "@/lib/pricing-store";

export const metadata: Metadata = { title: "Edit tier" };

type Props = { params: Promise<{ id: string }> };

export default async function EditPricingTierPage({ params }: Props) {
  await requireAdmin();

  const { id } = await params;
  const tier = await getPricingTierById(id);
  if (!tier) notFound();

  return (
    <>
      <PageHeader
        back={{ href: "/admin/pricing", label: "Pricing" }}
        title={tier.name}
        description={tier.enabled ? "Visible on the site" : "Hidden from the site"}
      />

      <PricingForm tier={tier} />

      <section className="mt-10 flex flex-col gap-4 rounded-2xl border border-red-400/20 bg-red-500/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-sm font-semibold text-cream">Delete this tier</h2>
          <p className="mt-1 text-sm text-mist">
            Removes it from the pricing section for good. To take it off the
            site for now, switch off “Visible on site” instead.
          </p>
        </div>
        <div className="shrink-0">
          <EntityDeleteButton
            id={tier.id}
            label={tier.name}
            noun="tier"
            action={deletePricingTier}
          />
        </div>
      </section>
    </>
  );
}
