"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/language-provider";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "error" | "check-email"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage(null);
    const supabase = createClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setStatus("error");
        setErrorMessage(t("login.errorWrongCredentials"));
        return;
      }
      window.location.href = "/";
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setStatus("error");
      setErrorMessage(error.message || t("login.errorSignupGeneric"));
      return;
    }
    if (data.session) {
      // Email confirmation is off — the account is ready to use right away.
      window.location.href = "/";
      return;
    }
    // Email confirmation is still on in Supabase — the account exists but
    // needs the confirmation link before it can sign in.
    setStatus("check-email");
  }

  function toggleMode() {
    setMode((m) => (m === "signin" ? "signup" : "signin"));
    setStatus("idle");
    setErrorMessage(null);
  }

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-57px)] max-w-sm flex-col justify-center px-4 py-10 sm:px-6">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
        <h1 className="mb-1 font-mono text-2xl font-semibold">Drawer</h1>
        <p className="mb-6 text-sm text-muted-foreground">{t("login.subtitle")}</p>

        {status === "check-email" ? (
          <p className="text-sm text-muted-foreground">
            {t("login.checkEmail").split("{email}")[0]}
            <strong>{email}</strong>
            {t("login.checkEmail").split("{email}")[1]}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm text-muted-foreground">
                {t("login.emailLabel")}
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder={t("login.emailPlaceholder")}
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
                {t("login.passwordLabel")}
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={mode === "signup" ? 6 : undefined}
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
              {status === "sending"
                ? mode === "signin"
                  ? t("login.signingIn")
                  : t("login.creatingAccount")
                : mode === "signin"
                  ? t("login.signIn")
                  : t("login.signUp")}
            </button>
            {status === "error" ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}
          </form>
        )}

        {status !== "check-email" ? (
          <button
            type="button"
            onClick={toggleMode}
            className="mt-5 w-full text-center text-sm text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            {mode === "signin" ? t("login.toggleToSignup") : t("login.toggleToSignin")}
          </button>
        ) : null}
      </div>
    </main>
  );
}
