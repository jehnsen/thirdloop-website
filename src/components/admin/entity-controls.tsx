"use client";

import { LoaderCircle, Trash2 } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { buttonClass, iconButtonClass } from "@/components/admin/ui";
import { cn } from "@/lib/utils";

/*
 * Generic versions of the visibility switch and the two-step delete, taking
 * the server action as a prop. Products and services predate these and keep
 * their own copies; newer sections share these.
 */

export function EntityVisibilityToggle({
  id,
  label,
  enabled,
  action,
}: {
  id: string;
  /** the thing's name, for the accessible label */
  label: string;
  enabled: boolean;
  action: (id: string, enabled: boolean) => Promise<void>;
}) {
  // Flips immediately; falls back to the server value if the save fails.
  const [optimisticEnabled, setOptimisticEnabled] = useOptimistic(enabled);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !optimisticEnabled;
    startTransition(async () => {
      setOptimisticEnabled(next);
      await action(id, next);
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimisticEnabled}
      aria-label={`Show ${label} on the public site`}
      onClick={toggle}
      disabled={pending}
      className="inline-flex items-center gap-2.5 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-flux-400 disabled:cursor-wait"
    >
      <span
        aria-hidden
        className={cn(
          "inline-flex h-5.5 w-10 shrink-0 items-center rounded-full border transition-colors",
          optimisticEnabled
            ? "border-flux-400/50 bg-flux-500/70"
            : "border-hair/25 bg-white/8",
        )}
      >
        <span
          className={cn(
            "size-4 rounded-full bg-white shadow transition-transform",
            optimisticEnabled ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </span>
      <span
        aria-hidden
        className={cn(
          "hidden w-12 text-left text-xs xl:inline-block",
          optimisticEnabled ? "text-flux-300" : "text-mist/80",
        )}
      >
        {optimisticEnabled ? "Visible" : "Hidden"}
      </span>
    </button>
  );
}

/** Two-step delete: the first click asks, the second one deletes. */
export function EntityDeleteButton({
  id,
  label,
  noun,
  action,
  compact = false,
}: {
  id: string;
  label: string;
  /** what the thing is called in the button, e.g. "tier" */
  noun: string;
  action: (id: string) => Promise<void>;
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
        aria-label={`Delete ${label}`}
        title="Delete"
        className={
          compact
            ? cn(iconButtonClass, "hover:bg-red-500/10 hover:text-red-300")
            : buttonClass("dangerOutline")
        }
      >
        <Trash2 aria-hidden className="size-4" />
        {compact ? null : `Delete ${noun}`}
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label={`Confirm deleting ${label}`}
      className="inline-flex items-center gap-1"
      onKeyDown={(event) => {
        if (event.key === "Escape") setConfirming(false);
      }}
    >
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => action(id))}
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
