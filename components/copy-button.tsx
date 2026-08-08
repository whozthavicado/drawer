"use client";

import { useState } from "react";

export function CopyButton({
  text,
  iconOnly = false,
  className = "",
  label = "Copiar",
  onCopied,
}: {
  text: string;
  iconOnly?: boolean;
  className?: string;
  label?: string;
  onCopied?: () => void;
}) {
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
        aria-label="Copiar"
        title={state === "copied" ? "Copiado" : state === "error" ? "Error" : "Copiar"}
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
      {state === "copied" ? "Copiado" : state === "error" ? "Error" : label}
    </button>
  );
}
