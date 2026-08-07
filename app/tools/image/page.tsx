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
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Convertir imagen</h1>

      <div className="mb-4 flex gap-2">
        {(["png", "jpeg", "webp"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFormat(f)}
            className={`rounded border px-3 py-1.5 text-sm ${
              format === f
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-neutral-300"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <input type="file" accept="image/*" onChange={handleFile} />

      {status ? <p className="mt-4 text-sm text-neutral-600">{status}</p> : null}
    </main>
  );
}
