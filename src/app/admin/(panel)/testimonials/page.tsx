import { Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { TestimonialsTable } from "@/components/admin/testimonials-table";
import { Notice, PageHeader, buttonClass } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/auth";
import { getAllTestimonialsForAdmin } from "@/lib/testimonial-store";

export const metadata: Metadata = { title: "Testimonials" };

const notices = {
  created: "Testimonial created.",
  updated: "Changes saved — the public pages now show the update.",
  deleted: "Testimonial deleted.",
};

type Props = { searchParams: Promise<{ notice?: string | string[] }> };

export default async function AdminTestimonialsPage({ searchParams }: Props) {
  await requireAdmin();

  const [{ notice }, testimonials] = await Promise.all([
    searchParams,
    getAllTestimonialsForAdmin(),
  ]);
  const message =
    typeof notice === "string" && Object.hasOwn(notices, notice)
      ? notices[notice as keyof typeof notices]
      : null;
  const visibleCount = testimonials.filter((item) => item.enabled).length;

  return (
    <>
      <PageHeader
        title="Testimonials"
        description={`${testimonials.length} collected · ${visibleCount} visible on the site`}
        actions={
          <Link href="/admin/testimonials/new" className={buttonClass("primary")}>
            <Plus aria-hidden className="size-4" />
            Add testimonial
          </Link>
        }
      />
      {message ? <Notice>{message}</Notice> : null}
      <TestimonialsTable testimonials={testimonials} />
    </>
  );
}
