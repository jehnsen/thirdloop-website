"use client";

import { LoaderCircle, Lock } from "lucide-react";
import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";
import { buttonClass, FieldError, inputClass } from "@/components/admin/ui";

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    login,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {next ? <input type="hidden" name="next" value={next} /> : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-white/80">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "password-error" : undefined}
          className={inputClass}
        />
        {state.error ? (
          <div role="alert">
            <FieldError id="password-error">{state.error}</FieldError>
          </div>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={pending}
        className={buttonClass("primary", "w-full py-3")}
      >
        {pending ? (
          <LoaderCircle aria-hidden className="size-4 animate-spin" />
        ) : (
          <Lock aria-hidden className="size-4" />
        )}
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
