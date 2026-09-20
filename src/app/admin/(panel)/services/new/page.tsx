import type { Metadata } from "next";
import { ServiceForm } from "@/components/admin/service-form";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "New service" };

export default async function NewServicePage() {
  await requireAdmin();

  return (
    <>
      <PageHeader
        back={{ href: "/admin/services", label: "Services" }}
        title="New service"
        description="Services appear in the portfolio section on the home page."
      />
      <ServiceForm />
    </>
  );
}
