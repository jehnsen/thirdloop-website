"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteProduct } from "@/app/admin/actions";
import { buttonClass, iconButtonClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/** Two-step delete: the first click asks, the second one deletes. */
export function DeleteProductButton({
  slug,
  name,
  compact = false,
}: {
  slug: string;
  name: string;
  /** icon-only trigger, for table rows */
  compact?: boolean;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`Delete ${name}`}
        title="Delete"
        className={
          compact
            ? cn(iconButtonClass, "hover:bg-red-500/10 hover:text-red-300")
            : buttonClass("dangerOutline")
        }
      >
        <Trash2 aria-hidden className="size-4" />
        {compact ? null : "Delete product"}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label={`Confirm deleting ${name}`}
      className="inline-flex items-center gap-1"
      onKeyDown={(event) => {
        if (event.key === "Escape") setConfirming(false);
      }}
    >
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => deleteProduct(slug))}
        className={buttonClass("danger", compact ? "px-3 py-1.5 text-xs" : "")}
      >
        {pending ? (
          <LoaderCircle aria-hidden className="size-3.5 animate-spin" />
        ) : null}
        {compact ? "Delete" : "Yes, delete it"}
      </button>
      <button
        type="button"
        // Land on the safe choice so a stray Enter doesn't delete.
        autoFocus
        disabled={pending}
        onClick={() => setConfirming(false)}
        className={buttonClass("ghost", compact ? "px-3 py-1.5 text-xs" : "")}
      >
        Cancel
      </button>
    </div>
  );
}
