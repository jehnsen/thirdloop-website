"use client";

import { useOptimistic, useTransition } from "react";
import { setServiceVisibility } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export function ServiceVisibilityToggle({
  id,
  title,
  enabled,
}: {
  id: string;
  title: string;
  enabled: boolean;
}) {
  // Flips immediately; falls back to the server value if the save fails.
  const [optimisticEnabled, setOptimisticEnabled] = useOptimistic(enabled);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !optimisticEnabled;
    startTransition(async () => {
      setOptimisticEnabled(next);
      await setServiceVisibility(id, next);
    });
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={optimisticEnabled}
      aria-label={`Show ${title} on the public site`}
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
