"use client";

import { useMemo, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { ThemePicker } from "@/components/theme-picker";
import { LanguagePicker } from "@/components/language-picker";
import { useLanguage } from "@/components/language-provider";

function passwordStrength(
  password: string,
  t: (key: string) => string,
): { filled: number; label: string } {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const filled = checks.filter(Boolean).length;
  const label =
    filled <= 1
      ? t("account.strengthWeak")
      : filled <= 3
        ? t("account.strengthRegular")
        : t("account.strengthStrong");
  return { filled, label };
}

export default function AccountPage() {
  const { t } = useLanguage();
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const strength = useMemo(() => passwordStrength(password, t), [password, t]);

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
      setErrorMessage(t("account.errorSession"));
      return;
    }

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (reauthError) {
      setStatus("error");
      setErrorMessage(t("account.errorWrongCurrent"));
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setStatus("error");
      setErrorMessage(t("account.errorGeneric"));
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
    <main className="mx-auto max-w-md px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-mono text-2xl font-semibold">{t("account.title")}</h1>

      <div className="mb-4">
        <ThemePicker />
      </div>

      <div className="mb-4">
        <LanguagePicker />
      </div>

      <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-4 sm:p-5">
        <div className="field">
          <label htmlFor="current-password">{t("account.currentPasswordLabel")}</label>
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
          <label htmlFor="password">{t("account.newPasswordLabel")}</label>
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
          {status === "saving" ? t("account.saving") : t("account.savePassword")}
        </button>

        {status === "saved" ? (
          <p className="text-sm" style={{ color: "#7fd8a8" }}>
            {t("account.saved")}
          </p>
        ) : null}
        {status === "error" ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : null}
      </form>

      <button type="button" onClick={handleSignOut} className="btn btn-secondary btn-block mt-4">
        {t("account.signOut")}
      </button>
    </main>
  );
}
