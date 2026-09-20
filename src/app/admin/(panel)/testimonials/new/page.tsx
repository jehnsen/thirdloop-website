import type { Metadata } from "next";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "New testimonial" };

export default async function NewTestimonialPage() {
  await requireAdmin();

  return (
    <>
      <PageHeader
        back={{ href: "/admin/testimonials", label: "Testimonials" }}
        title="New testimonial"
        description="Testimonials appear in the client feedback section on the home page."
      />
      <TestimonialForm />
    </>
  );
}
