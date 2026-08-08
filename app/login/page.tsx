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
    <main className="mx-auto flex min-h-[calc(100dvh-57px)] max-w-sm flex-col justify-center px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
        <h1 className="mb-1 font-mono text-2xl font-semibold">Drawer</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          Tu cajón de notas, prompts y herramientas.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm text-muted-foreground">
              Correo
            </label>
            <input
              id="email"
              type="email"
              required
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="min-h-[44px] rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground/60"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm text-muted-foreground"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="min-h-[44px] rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground/60"
            />
          </div>
          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-2 min-h-[44px] cursor-pointer rounded-lg bg-primary px-4 font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "sending" ? "Entrando…" : "Entrar"}
          </button>
          {status === "error" ? (
            <p className="text-sm text-destructive">
              Correo o contraseña incorrectos — intenta de nuevo.
            </p>
          ) : null}
        </form>
      </div>
    </main>
  );
}
