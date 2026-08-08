"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { swapExtension, mimeForFormat, type ImageFormat } from "@/lib/image";
import { addRecentConversion } from "@/lib/recent-conversions";

const FORMATS: { value: ImageFormat; label: string }[] = [
  { value: "png", label: "PNG" },
  { value: "jpeg", label: "JPEG" },
  { value: "webp", label: "WebP" },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImageToolPage() {
  const [format, setFormat] = useState<ImageFormat>("jpeg");
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    originalName: string;
    toExt: string;
    size: number;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setConverting(true);
    setError(null);
    setResult(null);

    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(bitmap, 0, 0);

    canvas.toBlob(
      (blob) => {
        setConverting(false);
        if (!blob) {
          setError("No se pudo convertir esta imagen.");
          return;
        }
        const name = swapExtension(file.name, format);
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();
        URL.revokeObjectURL(url);

        const fromExt = file.name.includes(".")
          ? file.name.split(".").pop()!.toUpperCase()
          : "?";
        const toExt = format.toUpperCase();
        setResult({ originalName: file.name, toExt, size: blob.size });
        addRecentConversion({ filename: name, label: `${fromExt} → ${toExt}` });
      },
      mimeForFormat(format),
      0.92,
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-mono text-2xl font-semibold">Convertir imagen</h1>

      <div className="card flex flex-col gap-5 p-5">
        <div className="seg">
          {FORMATS.map((f) => (
            <label key={f.value} className="seg-opt">
              <input
                type="radio"
                name="format"
                checked={format === f.value}
                onChange={() => setFormat(f.value)}
              />
              {f.label}
            </label>
          ))}
        </div>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-10 text-center transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)]"
          style={{ borderColor: "var(--divider)" }}
        >
          <i className="ph ph-upload-simple" style={{ fontSize: 26, color: "var(--muted-foreground)" }} />
          <span className="text-sm text-muted-foreground">
            {converting ? "Convirtiendo…" : "Elegir imagen"}
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </button>

        {result ? (
          <div
            className="flex items-center gap-3 rounded-lg p-3"
            style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)" }}
          >
            <i className="ph ph-check" style={{ fontSize: 18, color: "var(--accent)" }} />
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-mono">
                {result.originalName} → .{result.toExt.toLowerCase()}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatSize(result.size)} — descargado
              </p>
            </div>
          </div>
        ) : null}

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </main>
  );
}
