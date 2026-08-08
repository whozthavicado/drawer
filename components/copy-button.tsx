"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<"idle" | "copied" | "error">("idle");

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("error");
    }
    setTimeout(() => setState("idle"), 1500);
  }

  return (
    <button
      onClick={handleClick}
      className={`min-h-[44px] cursor-pointer rounded-lg border px-3 text-sm transition-colors ${
        state === "error"
          ? "border-destructive/40 text-destructive"
          : "border-border text-foreground hover:bg-muted"
      }`}
    >
      {state === "copied" ? "Copiado" : state === "error" ? "Error" : "Copiar"}
    </button>
  );
}
