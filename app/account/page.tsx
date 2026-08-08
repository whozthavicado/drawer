"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AccountPage() {
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setStatus(error ? "error" : "saved");
    if (!error) setPassword("");
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-mono text-2xl font-semibold">Cuenta</h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:p-5"
      >
        <label className="text-sm text-muted-foreground" htmlFor="password">
          Nueva contraseña
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="min-h-[44px] rounded-lg border border-border bg-background px-3 py-2 text-foreground"
        />
        <button
          type="submit"
          disabled={status === "saving"}
          className="min-h-[44px] cursor-pointer rounded-lg bg-primary px-4 font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === "saving" ? "Guardando…" : "Guardar contraseña"}
        </button>
        {status === "saved" ? (
          <p className="text-sm text-emerald-500">
            Contraseña actualizada. Ya puedes usarla para entrar.
          </p>
        ) : null}
        {status === "error" ? (
          <p className="text-sm text-destructive">
            Algo salió mal — intenta de nuevo.
          </p>
        ) : null}
      </form>

      <button
        type="button"
        onClick={handleSignOut}
        className="mt-4 min-h-[44px] w-full cursor-pointer rounded-lg border border-border px-4 text-foreground transition-colors hover:bg-muted"
      >
        Cerrar sesión
      </button>
    </main>
  );
}
