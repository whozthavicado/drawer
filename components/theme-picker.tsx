"use client";

import { useEffect, useState } from "react";
import { isThemeId, THEME_STORAGE_KEY, THEMES, type ThemeId } from "@/lib/theme";

export function ThemePicker() {
  const [active, setActive] = useState<ThemeId>("nocturne");

  useEffect(() => {
    // Reading localStorage in a lazy useState initializer would run during
    // SSR too (no localStorage there), causing a hydration mismatch — this
    // has to stay a post-mount effect.
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
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
      <div>
        <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]">
          Tema
        </div>
        <p className="text-[12.5px] text-muted-foreground">
          Cambia el acento de Drawer. El fondo se mantiene oscuro.
        </p>
      </div>
      <div className="flex flex-wrap gap-2.5">
        {THEMES.map((theme) => {
          const isActive = active === theme.id;
          const swatchBackground =
            theme.id === "bernumeno"
              ? "linear-gradient(135deg, #141414 48%, #c8a24a 48%)"
              : theme.swatch;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => applyTheme(theme.id)}
              aria-pressed={isActive}
              className={isActive ? "btn" : "btn btn-secondary"}
              style={
                isActive
                  ? { borderColor: theme.swatch, color: "var(--foreground)" }
                  : undefined
              }
            >
              <span
                className="h-4 w-4 rounded-[5px]"
                style={{
                  background: swatchBackground,
                  boxShadow: isActive
                    ? `0 0 0 3px color-mix(in srgb, ${theme.swatch} 28%, transparent)`
                    : undefined,
                }}
              />
              {theme.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
