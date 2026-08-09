"use client";

import { useLanguage } from "./language-provider";

export function LanguagePicker() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <div className="card flex flex-col gap-3 p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <i className="ph ph-translate" style={{ fontSize: 16, color: "var(--accent)" }} />
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--accent)]">
          {t("language.label")}
        </div>
      </div>
      <p className="text-[12.5px] text-muted-foreground">{t("language.description")}</p>
      <button
        type="button"
        onClick={toggleLang}
        aria-label={t("language.label")}
        className="btn btn-secondary self-start"
      >
        <i className="ph ph-translate" style={{ fontSize: 16 }} />
        {lang === "es" ? t("language.en") : t("language.es")}
      </button>
    </div>
  );
}
