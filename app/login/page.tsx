"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <main className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl font-bold">Log in</h1>
      <form action={action} className="mt-4 flex flex-col gap-3">
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          placeholder="E-mail"
          defaultValue={state?.email}
          className="rounded border p-2"
        />
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="Password"
          className="rounded border p-2"
        />
        {state?.error && (
          <p role="alert" className="text-red-600">
            {state.error}
          </p>
        )}
        <button disabled={pending} className="rounded bg-blue-600 p-2 text-white">
          Log in
        </button>
      </form>
    </main>
  );
}
