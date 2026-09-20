import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { deleteTestimonial } from "@/app/admin/actions";
import { EntityDeleteButton } from "@/components/admin/entity-controls";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { getTestimonialById } from "@/lib/testimonial-store";

export const metadata: Metadata = { title: "Edit testimonial" };

type Props = { params: Promise<{ id: string }> };

export default async function EditTestimonialPage({ params }: Props) {
  await requireAdmin();

  const { id } = await params;
  const testimonial = await getTestimonialById(id);
  if (!testimonial) notFound();

  return (
    <>
      <PageHeader
        back={{ href: "/admin/testimonials", label: "Testimonials" }}
        title={testimonial.name}
        description={
          testimonial.enabled ? "Visible on the site" : "Hidden from the site"
        }
      />

      <TestimonialForm testimonial={testimonial} />

      <section className="mt-10 flex flex-col gap-4 rounded-2xl border border-red-400/20 bg-red-500/5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <h2 className="text-sm font-semibold text-cream">
            Delete this testimonial
          </h2>
          <p className="mt-1 text-sm text-mist">
            Removes it from the site for good. To take it off the site for now,
            switch off “Visible on site” instead.
          </p>
        </div>
        <div className="shrink-0">
          <EntityDeleteButton
            id={testimonial.id}
            label={testimonial.name}
            noun="testimonial"
            action={deleteTestimonial}
          />
        </div>
      </section>
    </>
  );
}
