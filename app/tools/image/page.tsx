"use client";

import { useState, type ChangeEvent } from "react";
import { swapExtension, mimeForFormat, type ImageFormat } from "@/lib/image";

export default function ImageToolPage() {
  const [format, setFormat] = useState<ImageFormat>("jpeg");
  const [status, setStatus] = useState("");

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("Convirtiendo…");

    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setStatus("No se pudo convertir esta imagen.");
          return;
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = swapExtension(file.name, format);
        a.click();
        URL.revokeObjectURL(url);
        setStatus("Listo.");
      },
      mimeForFormat(format),
      0.92,
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-mono text-2xl font-semibold">Convertir imagen</h1>

      <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
        <div className="mb-4 flex gap-2">
          {(["png", "jpeg", "webp"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`min-h-[44px] cursor-pointer rounded-lg border px-4 text-sm font-medium transition-colors ${
                format === f
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:bg-muted"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="block w-full text-sm text-muted-foreground file:mr-3 file:min-h-[44px] file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-4 file:font-medium file:text-primary-foreground hover:file:opacity-90"
        />
      </div>

      {status ? <p className="mt-4 text-sm text-muted-foreground">{status}</p> : null}
    </main>
  );
}
