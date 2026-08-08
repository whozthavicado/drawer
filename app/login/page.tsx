"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setStatus("error");
      return;
    }
    window.location.href = "/";
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-4 px-6">
      <h1 className="text-2xl font-semibold">Drawer</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          required
          placeholder="tu@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border border-neutral-300 px-3 py-2"
        />
        <input
          type="password"
          required
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border border-neutral-300 px-3 py-2"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded bg-neutral-900 px-3 py-2 text-white disabled:opacity-50"
        >
          {status === "sending" ? "Entrando…" : "Entrar"}
        </button>
        {status === "error" ? (
          <p className="text-sm text-red-600">
            Correo o contraseña incorrectos — intenta de nuevo.
          </p>
        ) : null}
      </form>
    </main>
  );
}
