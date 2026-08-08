"use client";

import { useState, type ChangeEvent } from "react";
import { swapMediaExtension } from "@/lib/media";

const PRESETS = [
  { label: "MP4 → MP3", from: "mp4", to: "mp3" },
  { label: "MOV → MP4", from: "mov", to: "mp4" },
  { label: "WAV → MP3", from: "wav", to: "mp3" },
] as const;

type Phase = "idle" | "loading" | "converting" | "done";

export default function MediaToolPage() {
  const [preset, setPreset] = useState<(typeof PRESETS)[number]>(PRESETS[0]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhase("loading");
    setProgress(0);

    // Dynamic import: this is the ONLY place in the app that pulls in
    // ffmpeg.wasm, so no other route's bundle pays for it.
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { fetchFile, toBlobURL } = await import("@ffmpeg/util");

    const ffmpeg = new FFmpeg();
    ffmpeg.on("progress", ({ progress }) => {
      setProgress(Math.min(100, Math.max(0, Math.round(progress * 100))));
    });

    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    setPhase("converting");
    setProgress(0);
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
    setPhase("done");
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Convertir audio/video</h1>

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

      {phase !== "idle" ? (
        <div className="mt-4">
          <p className="mb-1 text-sm text-neutral-600">
            {phase === "loading" && "Preparando…"}
            {phase === "converting" && `Convirtiendo… ${progress}%`}
            {phase === "done" && "Listo."}
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200">
            <div
              className={`h-full bg-neutral-900 transition-all duration-200 ${
                phase === "loading" ? "w-1/3 animate-pulse" : ""
              }`}
              style={phase === "converting" || phase === "done" ? { width: `${phase === "done" ? 100 : progress}%` } : undefined}
            />
          </div>
        </div>
      ) : null}
    </main>
  );
}
