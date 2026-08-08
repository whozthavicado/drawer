"use client";

import { useMemo, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

function passwordStrength(password: string): { filled: number; label: string } {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const filled = checks.filter(Boolean).length;
  const label = filled <= 1 ? "Débil" : filled <= 3 ? "Regular" : "Fuerte";
  return { filled, label };
}

export default function AccountPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const strength = useMemo(() => passwordStrength(password), [password]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMessage(null);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) {
      setStatus("error");
      setErrorMessage("No se pudo verificar tu sesión — intenta iniciar sesión de nuevo.");
      return;
    }

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (reauthError) {
      setStatus("error");
      setErrorMessage("La contraseña actual no es correcta.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus("error");
      setErrorMessage("Algo salió mal — intenta de nuevo.");
      return;
    }

    setStatus("saved");
    setCurrentPassword("");
    setPassword("");
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <main className="mx-auto max-w-sm px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-mono text-2xl font-semibold">Cuenta</h1>

      <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-4 sm:p-5">
        <div className="field">
          <label htmlFor="current-password">Contraseña actual</label>
          <input
            id="current-password"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="input"
          />
        </div>

        <div className="field">
          <label htmlFor="password">Nueva contraseña</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </div>

        {password ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-[3px] flex-1 rounded-full"
                  style={{
                    background:
                      i < strength.filled
                        ? "var(--accent)"
                        : "color-mix(in srgb, var(--foreground) 14%, transparent)",
                  }}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{strength.label}</p>
          </div>
        ) : null}

        <button type="submit" disabled={status === "saving"} className="btn btn-primary-filled">
          {status === "saving" ? "Guardando…" : "Guardar contraseña"}
        </button>

        {status === "saved" ? (
          <p className="text-sm" style={{ color: "#7fd8a8" }}>
            Contraseña actualizada. Ya puedes usarla para entrar.
          </p>
        ) : null}
        {status === "error" ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : null}
      </form>

      <button type="button" onClick={handleSignOut} className="btn btn-secondary btn-block mt-4">
        Cerrar sesión
      </button>
    </main>
  );
}
