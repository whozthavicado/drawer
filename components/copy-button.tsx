"use client";

import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      onClick={handleClick}
      className="rounded border border-neutral-300 px-2 py-1 text-xs hover:bg-neutral-100"
    >
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}
