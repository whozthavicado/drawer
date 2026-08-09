"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { swapMediaExtension } from "@/lib/media";
import { addRecentConversion } from "@/lib/recent-conversions";
import { useLanguage } from "@/components/language-provider";

const PRESETS = [
  { label: "MP4 → MP3", from: "mp4", to: "mp3" },
  { label: "MOV → MP4", from: "mov", to: "mp4" },
  { label: "WAV → MP3", from: "wav", to: "mp3" },
] as const;

type Phase = "idle" | "loading" | "converting" | "done" | "error";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaToolPage() {
  const { t } = useLanguage();
  const [preset, setPreset] = useState<(typeof PRESETS)[number]>(PRESETS[0]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setActiveFile(file);
    setPhase("loading");
    setProgress(0);
    setError(null);

    try {
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
      const name = swapMediaExtension(file.name, preset.to);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
      setPhase("done");
      addRecentConversion({ filename: name, label: preset.label });
    } catch (err) {
      console.error(err);
      setPhase("error");
      setError(t("toolMedia.error"));
    }
  }

  function reset() {
    setPhase("idle");
    setProgress(0);
    setError(null);
    setActiveFile(null);
  }

  const isWorking = phase === "loading" || phase === "converting";

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-mono text-2xl font-semibold">{t("toolMedia.title")}</h1>

      <div className="card flex flex-col gap-5 p-5">
        <div className="seg flex-wrap sm:flex-nowrap">
          {PRESETS.map((p) => (
            <label key={p.label} className="seg-opt">
              <input
                type="radio"
                name="preset"
                checked={preset.label === p.label}
                onChange={() => setPreset(p)}
                disabled={isWorking}
              />
              {p.label}
            </label>
          ))}
        </div>

        {phase === "idle" ? (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-10 text-center transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)]"
            style={{ borderColor: "var(--divider)" }}
          >
            <i className="ph ph-upload-simple" style={{ fontSize: 26, color: "var(--muted-foreground)" }} />
            <span className="text-sm text-muted-foreground">{t("toolMedia.choose")}</span>
          </button>
        ) : null}

        <input
          ref={inputRef}
          type="file"
          accept={`.${preset.from}`}
          onChange={handleFile}
          className="hidden"
        />

        {isWorking && activeFile ? (
          <div className="card flex flex-col gap-3 p-4" style={{ boxShadow: "none", border: "1px solid var(--divider)" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] text-[var(--accent)]">
                <i className="ph ph-waveform" style={{ fontSize: 20 }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono text-sm">{activeFile.name}</p>
                <p className="text-xs text-muted-foreground">{formatSize(activeFile.size)}</p>
              </div>
            </div>

            <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: "var(--divider)" }}>
              <div
                className="h-full transition-all duration-200"
                style={
                  phase === "loading"
                    ? {
                        width: "35%",
                        backgroundImage:
                          "linear-gradient(115deg, var(--accent) 25%, var(--accent-400) 25%, var(--accent-400) 50%, var(--accent) 50%, var(--accent) 75%, var(--accent-400) 75%)",
                        backgroundSize: "28px 28px",
                        animation: "barber 1.1s linear infinite",
                      }
                    : {
                        width: `${progress}%`,
                        backgroundImage:
                          "linear-gradient(115deg, var(--accent) 25%, var(--accent-400) 25%, var(--accent-400) 50%, var(--accent) 50%, var(--accent) 75%, var(--accent-400) 75%)",
                        backgroundSize: "28px 28px",
                        animation: "barber 1.1s linear infinite",
                      }
                }
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {phase === "loading" ? t("toolMedia.preparing") : t("toolMedia.converting", { n: progress })}
            </p>
          </div>
        ) : null}

        {phase === "done" && activeFile ? (
          <div
            className="flex items-center gap-3 rounded-lg p-3"
            style={{ background: "color-mix(in srgb, var(--accent) 10%, transparent)" }}
          >
            <i className="ph ph-check" style={{ fontSize: 18, color: "var(--accent)" }} />
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-mono">
                {swapMediaExtension(activeFile.name, preset.to)}
              </p>
              <p className="text-xs text-muted-foreground">{t("toolMedia.downloaded")}</p>
            </div>
          </div>
        ) : null}

        {phase === "done" ? (
          <button type="button" onClick={reset} className="btn btn-secondary self-start">
            {t("toolMedia.convertAnother")}
          </button>
        ) : null}

        {phase === "error" ? (
          <div
            className="flex flex-col gap-3 rounded-lg p-4"
            style={{
              border: "1px solid color-mix(in srgb, var(--destructive) 40%, transparent)",
              background: "color-mix(in srgb, var(--destructive) 8%, transparent)",
            }}
          >
            <div className="flex items-center gap-2">
              <i className="ph ph-warning" style={{ fontSize: 18, color: "var(--destructive)" }} />
              <p className="text-sm text-destructive">{error}</p>
            </div>
            <button type="button" onClick={reset} className="btn btn-secondary self-start">
              {t("toolMedia.retry")}
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
