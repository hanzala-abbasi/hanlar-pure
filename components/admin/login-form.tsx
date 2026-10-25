"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <form action={action} className="space-y-4">
      <label htmlFor="password" className="block text-xs uppercase tracking-[0.2em] text-white/70">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        className="w-full border border-white/20 bg-charcoal px-4 py-3 text-white outline-none focus:border-gold"
        aria-describedby={state?.error ? "login-error" : undefined}
      />
      {state?.error && (
        <p id="login-error" role="alert" className="text-sm text-red-400">
          {state.error}
        </p>
      )}
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Checking..." : "Log in"}
      </Button>
    </form>
  );
}
