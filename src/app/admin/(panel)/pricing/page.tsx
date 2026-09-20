import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PricingTable } from "@/components/admin/pricing-table";
import { Notice, PageHeader, buttonClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { getAllPricingTiersForAdmin } from "@/lib/pricing-store";

export const metadata: Metadata = { title: "Pricing" };

const notices = {
  created: "Tier created.",
  updated: "Changes saved — the public pages now show the update.",
  deleted: "Tier deleted.",
};

type Props = { searchParams: Promise<{ notice?: string | string[] }> };

export default async function AdminPricingPage({ searchParams }: Props) {
  await requireAdmin();

  const [{ notice }, tiers] = await Promise.all([
    searchParams,
    getAllPricingTiersForAdmin(),
  ]);
  const message =
    typeof notice === "string" && Object.hasOwn(notices, notice)
      ? notices[notice as keyof typeof notices]
      : null;
  const visibleCount = tiers.filter((tier) => tier.enabled).length;

  return (
    <>
      <PageHeader
        title="Pricing"
        description={`${tiers.length} tiers · ${visibleCount} visible on the site`}
        actions={
          <Link href="/admin/pricing/new" className={buttonClass("primary")}>
            <Plus aria-hidden className="size-4" />
            Add tier
          </Link>
        }
      />
      {message ? <Notice>{message}</Notice> : null}
      <PricingTable tiers={tiers} />
    </>
  );
}
