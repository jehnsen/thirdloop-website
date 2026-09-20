"use client";

import { Pencil } from "lucide-react";
import Link from "next/link";
import {
  deleteTestimonial,
  setTestimonialVisibility,
} from "@/app/admin/actions";
import {
  EntityDeleteButton,
  EntityVisibilityToggle,
} from "@/components/admin/entity-controls";
import { buttonClass, iconButtonClass } from "@/components/admin/ui";
import type { Testimonial } from "@/lib/testimonials";

export function TestimonialsTable({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  if (testimonials.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-hair/20 bg-ink-800/70 px-6 py-16 text-center">
        <p className="text-sm text-mist">No testimonials yet.</p>
        <Link href="/admin/testimonials/new" className={buttonClass("secondary")}>
          Add your first testimonial
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-hair/20 bg-ink-800/70">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Testimonials</caption>
          <thead>
            <tr className="border-b border-hair/15 text-xs text-mist/70">
              <th scope="col" className="px-3 py-3 font-medium sm:px-5">
                Quote
              </th>
              <th scope="col" className="hidden px-4 py-3 font-medium md:table-cell">
                Attribution
              </th>
              <th scope="col" className="px-3 py-3 font-medium sm:px-4">
                On site
              </th>
              <th scope="col" className="px-3 py-3 sm:px-5">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hair/15">
            {testimonials.map((item) => (
              <tr key={item.id} className="transition-colors hover:bg-white/2">
                <td className="px-3 py-3 sm:px-5">
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-1 hidden h-8 w-1 shrink-0 rounded-full sm:block"
                      style={{ background: item.accent }}
                    />
                    <div className="min-w-0">
                      <Link
                        href={`/admin/testimonials/${item.id}/edit`}
                        className="line-clamp-2 max-w-md font-medium text-cream hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flux-400"
                      >
                        {item.quote}
                      </Link>
                      <div className="mt-1 text-xs text-mist/70 md:hidden">
                        {item.name}
                        {item.company ? ` · ${item.company}` : ""}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <div className="text-cream">{item.name}</div>
                  {item.company ? (
                    <div className="mt-0.5 text-xs text-mist/70">
                      {item.company}
                    </div>
                  ) : null}
                </td>
                <td className="px-3 py-3 sm:px-4">
                  <EntityVisibilityToggle
                    id={item.id}
                    label={item.name}
                    enabled={item.enabled}
                    action={setTestimonialVisibility}
                  />
                </td>
                <td className="px-3 py-3 sm:px-5">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/testimonials/${item.id}/edit`}
                      aria-label={`Edit testimonial from ${item.name}`}
                      title="Edit"
                      className={iconButtonClass}
                    >
                      <Pencil aria-hidden className="size-4" />
                    </Link>
                    <EntityDeleteButton
                      id={item.id}
                      label={item.name}
                      noun="testimonial"
                      action={deleteTestimonial}
                      compact
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
