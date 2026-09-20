import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ServicesTable } from "@/components/admin/services-table";
import { Notice, PageHeader, buttonClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { getAllServicesForAdmin } from "@/lib/service-store";

export const metadata: Metadata = { title: "Services" };

const notices = {
  created: "Service created.",
  updated: "Changes saved — the public pages now show the update.",
  deleted: "Service deleted.",
};

type Props = { searchParams: Promise<{ notice?: string | string[] }> };

export default async function AdminServicesPage({ searchParams }: Props) {
  await requireAdmin();

  const [{ notice }, services] = await Promise.all([
    searchParams,
    getAllServicesForAdmin(),
  ]);
  const message =
    typeof notice === "string" && Object.hasOwn(notices, notice)
      ? notices[notice as keyof typeof notices]
      : null;
  const visibleCount = services.filter((service) => service.enabled).length;

  return (
    <>
      <PageHeader
        title="Services"
        description={`${services.length} in the portfolio · ${visibleCount} visible on the site`}
        actions={
          <Link href="/admin/services/new" className={buttonClass("primary")}>
            <Plus aria-hidden className="size-4" />
            Add service
          </Link>
        }
      />
      {message ? <Notice>{message}</Notice> : null}
      <ServicesTable services={services} />
    </>
  );
}
