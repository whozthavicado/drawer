"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { isLang, LANG_STORAGE_KEY, translate, type Lang } from "@/lib/i18n";

type LanguageContextValue = {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("es");

  useEffect(() => {
    // Reading localStorage in a lazy useState initializer would run during
    // SSR too (no localStorage there), causing a hydration mismatch — this
    // has to stay a post-mount effect.
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (isLang(stored)) setLang(stored);
  }, []);

  function toggleLang() {
    setLang((prev) => {
      const next: Lang = prev === "es" ? "en" : "es";
      localStorage.setItem(LANG_STORAGE_KEY, next);
      document.documentElement.lang = next;
      return next;
    });
  }

  function t(key: string, vars?: Record<string, string | number>) {
    return translate(lang, key, vars);
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
