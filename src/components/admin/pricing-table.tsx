"use client";

import { Pencil, Sparkles } from "lucide-react";
import Link from "next/link";
import {
  deletePricingTier,
  setPricingTierVisibility,
} from "@/app/admin/actions";
import {
  EntityDeleteButton,
  EntityVisibilityToggle,
} from "@/components/admin/entity-controls";
import { buttonClass, iconButtonClass } from "@/components/admin/ui";
import type { PricingTier } from "@/lib/pricing";

/*
 * Columns drop out as the screen narrows (features count, then price) so the
 * name, visibility switch, edit and delete always fit without scrolling.
 */
export function PricingTable({ tiers }: { tiers: PricingTier[] }) {
  if (tiers.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-hair/20 bg-ink-800/70 px-6 py-16 text-center">
        <p className="text-sm text-mist">No pricing tiers yet.</p>
        <Link href="/admin/pricing/new" className={buttonClass("secondary")}>
          Add your first tier
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-hair/20 bg-ink-800/70">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Pricing tiers</caption>
          <thead>
            <tr className="border-b border-hair/15 text-xs text-mist/70">
              <th scope="col" className="px-3 py-3 font-medium sm:px-5">
                Tier
              </th>
              <th scope="col" className="hidden px-4 py-3 font-medium md:table-cell">
                Price
              </th>
              <th scope="col" className="hidden px-4 py-3 font-medium xl:table-cell">
                Features
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
            {tiers.map((tier) => (
              <tr key={tier.id} className="transition-colors hover:bg-white/2">
                <td className="px-3 py-3 sm:px-5">
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden
                      className="hidden size-9 shrink-0 items-center justify-center rounded-lg border border-hair/20 sm:inline-flex"
                      style={{
                        background: `color-mix(in oklab, ${tier.accent} 16%, transparent)`,
                      }}
                    >
                      <span
                        className="size-3 rounded-full"
                        style={{ background: tier.accent }}
                      />
                    </span>
                    <div className="min-w-0">
                      <Link
                        href={`/admin/pricing/${tier.id}/edit`}
                        className="font-medium text-cream hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-flux-400"
                      >
                        {tier.name}
                      </Link>
                      {tier.featured ? (
                        <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-loop-500/15 px-2 py-0.5 text-[0.65rem] font-medium text-loop-200">
                          <Sparkles aria-hidden className="size-2.5" />
                          Most requested
                        </span>
                      ) : null}
                      <div className="mt-0.5 text-xs text-mist/70 md:hidden">
                        {tier.price}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 whitespace-nowrap text-mist md:table-cell">
                  {tier.price}
                  {tier.cadence ? (
                    <span className="text-mist/60"> / {tier.cadence}</span>
                  ) : null}
                </td>
                <td className="hidden px-4 py-3 whitespace-nowrap text-mist xl:table-cell">
                  {tier.features.length}
                </td>
                <td className="px-3 py-3 sm:px-4">
                  <EntityVisibilityToggle
                    id={tier.id}
                    label={tier.name}
                    enabled={tier.enabled}
                    action={setPricingTierVisibility}
                  />
                </td>
                <td className="px-3 py-3 sm:px-5">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/pricing/${tier.id}/edit`}
                      aria-label={`Edit ${tier.name}`}
                      title="Edit"
                      className={iconButtonClass}
                    >
                      <Pencil aria-hidden className="size-4" />
                    </Link>
                    <EntityDeleteButton
                      id={tier.id}
                      label={tier.name}
                      noun="tier"
                      action={deletePricingTier}
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
