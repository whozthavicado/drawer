"use client";

import { useState } from "react";
import { useLanguage } from "./language-provider";

export function CopyButton({
  text,
  iconOnly = false,
  className = "",
  label,
  onCopied,
}: {
  text: string;
  iconOnly?: boolean;
  className?: string;
  label?: string;
  onCopied?: () => void;
}) {
  const { t } = useLanguage();
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
      onCopied?.();
    } catch {
      setState("error");
    }
    setTimeout(() => setState("idle"), 1500);
  }

  if (iconOnly) {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={t("notes.copy")}
        title={
          state === "copied"
            ? t("notes.copied")
            : state === "error"
              ? t("notes.copyError")
              : t("notes.copy")
        }
        className={`btn btn-icon ${
          state === "error" ? "text-destructive" : "btn-ghost"
        } ${className}`}
      >
        <i
          className={`ph ${state === "copied" ? "ph-check" : "ph-copy"}`}
          style={{ fontSize: 18 }}
        />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`btn btn-primary-filled ${className}`}
    >
      <i className={`ph ${state === "copied" ? "ph-check" : "ph-copy"}`} style={{ fontSize: 16 }} />
      {state === "copied"
        ? t("notes.copied")
        : state === "error"
          ? t("notes.copyError")
          : (label ?? t("notes.copy"))}
    </button>
  );
}
