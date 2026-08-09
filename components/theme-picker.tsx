"use client";

import { useEffect, useState } from "react";
import { isThemeId, THEME_STORAGE_KEY, THEMES, type ThemeId } from "@/lib/theme";

export function ThemePicker() {
  const [active, setActive] = useState<ThemeId>("nocturne");

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeId(stored)) setActive(stored);
  }, []);

  function applyTheme(id: ThemeId) {
    setActive(id);
    localStorage.setItem(THEME_STORAGE_KEY, id);
    if (id === "nocturne") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", id);
    }
  }

  return (
    <div className="card flex flex-col gap-3 p-4 sm:p-5">
      <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]">
        Tema
      </div>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            type="button"
            onClick={() => applyTheme(theme.id)}
            aria-pressed={active === theme.id}
            className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-xs transition-colors ${
              active === theme.id
                ? "border-[var(--accent)]"
                : "border-border hover:bg-[color-mix(in_srgb,var(--foreground)_5%,transparent)]"
            }`}
          >
            <span
              className="h-8 w-8 rounded-full border border-white/10"
              style={{
                background: `radial-gradient(circle at 35% 30%, ${theme.swatch}, ${theme.background})`,
              }}
            />
            {theme.label}
          </button>
        ))}
      </div>
    </div>
  );
}
