"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setStatus(error ? "error" : "sent");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold">Drawer</h1>
      {status === "sent" ? (
        <p className="text-sm text-neutral-600">
          Te mandamos un enlace a {email}. Ábrelo desde este mismo
          dispositivo o cópialo en el navegador donde quieras entrar.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border border-neutral-300 px-3 py-2"
          />
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded bg-neutral-900 px-3 py-2 text-white disabled:opacity-50"
          >
            {status === "sending" ? "Enviando…" : "Enviar enlace"}
          </button>
          {status === "error" ? (
            <p className="text-sm text-red-600">
              Algo salió mal — intenta de nuevo.
            </p>
          ) : null}
        </form>
      )}
    </main>
  );
}
