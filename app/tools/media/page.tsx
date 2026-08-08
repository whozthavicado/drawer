"use client";

import { useState, type ChangeEvent } from "react";
import { swapMediaExtension } from "@/lib/media";

const PRESETS = [
  { label: "MP4 → MP3", from: "mp4", to: "mp3" },
  { label: "MOV → MP4", from: "mov", to: "mp4" },
  { label: "WAV → MP3", from: "wav", to: "mp3" },
] as const;

export default function MediaToolPage() {
  const [preset, setPreset] = useState<(typeof PRESETS)[number]>(PRESETS[0]);
  const [status, setStatus] = useState("");
  const [ready, setReady] = useState(false);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus("Cargando el conversor (solo la primera vez, ~25-30MB)…");

    // Dynamic import: this is the ONLY place in the app that pulls in
    // ffmpeg.wasm, so no other route's bundle pays for it.
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { fetchFile, toBlobURL } = await import("@ffmpeg/util");

    const ffmpeg = new FFmpeg();
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });
    setReady(true);

    setStatus("Convirtiendo…");
    const inputName = `input.${preset.from}`;
    const outputName = `output.${preset.to}`;
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    await ffmpeg.exec(["-i", inputName, outputName]);
    const data = await ffmpeg.readFile(outputName);

    const blob = new Blob([new Uint8Array(data as Uint8Array)], {
      type: `application/octet-stream`,
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = swapMediaExtension(file.name, preset.to);
    a.click();
    URL.revokeObjectURL(url);
    setStatus("Listo.");
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-2 text-2xl font-semibold">Convertir audio/video</h1>
      <p className="mb-6 text-sm text-neutral-500">
        La primera conversión descarga el conversor (~25-30MB) y tarda más;
        las siguientes son más rápidas.
      </p>

      <div className="mb-4 flex flex-col gap-2">
        {PRESETS.map((p) => (
          <label key={p.label} className="flex items-center gap-2">
            <input
              type="radio"
              name="preset"
              checked={preset.label === p.label}
              onChange={() => setPreset(p)}
            />
            {p.label}
          </label>
        ))}
      </div>

      <input type="file" accept={`.${preset.from}`} onChange={handleFile} />

      {status ? <p className="mt-4 text-sm text-neutral-600">{status}</p> : null}
      {ready ? (
        <p className="mt-1 text-xs text-neutral-400">Conversor cargado.</p>
      ) : null}
    </main>
  );
}
