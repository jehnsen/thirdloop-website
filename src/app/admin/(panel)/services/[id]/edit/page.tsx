import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeleteServiceButton } from "@/components/admin/delete-service-button";
import { ServiceForm } from "@/components/admin/service-form";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { getServiceById } from "@/lib/service-store";

export const metadata: Metadata = { title: "Edit service" };

type Props = { params: Promise<{ id: string }> };

export default async function EditServicePage({ params }: Props) {
  await requireAdmin();

  const { id } = await params;
  const service = await getServiceById(id);
  if (!service) notFound();

  return (
    <>
      <PageHeader
        back={{ href: "/admin/services", label: "Services" }}
        title={service.title}
        description={service.enabled ? "Visible on the site" : "Hidden from the site"}
      />

      <ServiceForm service={service} />

      <section className="mt-10 flex flex-col gap-4 rounded-2xl border border-red-400/20 bg-red-500/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-sm font-semibold text-cream">Delete this service</h2>
          <p className="mt-1 text-sm text-mist">
            Removes it from the portfolio for good. To take it off the site for
            now, switch off “Visible on site” instead.
          </p>
        </div>
        <div className="shrink-0">
          <DeleteServiceButton id={service.id} title={service.title} />
        </div>
      </section>
    </>
  );
}
