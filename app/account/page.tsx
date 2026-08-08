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
    <main className="mx-auto max-w-sm px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Cuenta</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="text-sm text-neutral-600" htmlFor="password">
          Nueva contraseña
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border border-neutral-300 px-3 py-2"
        />
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded bg-neutral-900 px-3 py-2 text-white disabled:opacity-50"
        >
          {status === "saving" ? "Guardando…" : "Guardar contraseña"}
        </button>
        {status === "saved" ? (
          <p className="text-sm text-green-700">
            Contraseña actualizada. Ya puedes usarla para entrar.
          </p>
        ) : null}
        {status === "error" ? (
          <p className="text-sm text-red-600">
            Algo salió mal — intenta de nuevo.
          </p>
        ) : null}
      </form>
      <button
        type="button"
        onClick={handleSignOut}
        className="mt-4 rounded border border-neutral-300 px-3 py-2 text-neutral-900"
      >
        Cerrar sesión
      </button>
    </main>
  );
}
