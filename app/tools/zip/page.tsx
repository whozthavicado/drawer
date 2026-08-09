"use client";

import { useRef, useState, type ChangeEvent } from "react";
import JSZip from "jszip";
import { suggestZipName } from "@/lib/zip";
import { addRecentConversion } from "@/lib/recent-conversions";
import { useLanguage } from "@/components/language-provider";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

type ZipEntry = { name: string; size: number };

export default function ZipToolPage() {
  const { t } = useLanguage();
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [compressing, setCompressing] = useState(false);

  const [archive, setArchive] = useState<JSZip | null>(null);
  const [archiveName, setArchiveName] = useState("");
  const [entries, setEntries] = useState<ZipEntry[]>([]);
  const [extracting, setExtracting] = useState(false);

  const compressInputRef = useRef<HTMLInputElement>(null);
  const decompressInputRef = useRef<HTMLInputElement>(null);

  function handleStageFiles(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setStagedFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  }

  function removeStagedFile(index: number) {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleCreateZip() {
    if (stagedFiles.length === 0) return;
    setCompressing(true);
    try {
      const zip = new JSZip();
      for (const file of stagedFiles) {
        zip.file(file.name, await file.arrayBuffer());
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const name = suggestZipName(stagedFiles);
      downloadBlob(blob, name);
      addRecentConversion({ filename: name, label: t("toolZip.labelCompressed") });
      setStagedFiles([]);
    } finally {
      setCompressing(false);
    }
  }

  async function handleChooseZip(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const zip = await JSZip.loadAsync(file);
    const zipEntries = Object.values(zip.files)
      .filter((f) => !f.dir)
      .map((f) => ({ name: f.name, size: (f as unknown as { _data?: { uncompressedSize?: number } })._data?.uncompressedSize ?? 0 }));

    setArchive(zip);
    setArchiveName(file.name);
    setEntries(zipEntries);
  }

  async function handleExtractAll() {
    if (!archive) return;
    setExtracting(true);
    try {
      const files = Object.values(archive.files).filter((f) => !f.dir);
      for (const entry of files) {
        const blob = await entry.async("blob");
        downloadBlob(blob, entry.name);
      }
      addRecentConversion({ filename: archiveName, label: t("toolZip.labelDecompressed") });
      clearArchive();
    } finally {
      setExtracting(false);
    }
  }

  function clearArchive() {
    setArchive(null);
    setArchiveName("");
    setEntries([]);
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-mono text-2xl font-semibold">{t("toolZip.title")}</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Comprimir */}
        <section className="card flex flex-col gap-4 p-5">
          <h2 className="font-medium">{t("toolZip.compressTitle")}</h2>

          <button
            type="button"
            onClick={() => compressInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-10 text-center transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)]"
            style={{ borderColor: "var(--divider)" }}
          >
            <i className="ph ph-upload-simple" style={{ fontSize: 26, color: "var(--muted-foreground)" }} />
            <span className="text-sm text-muted-foreground">{t("toolZip.chooseFiles")}</span>
            <input
              ref={compressInputRef}
              type="file"
              multiple
              onChange={handleStageFiles}
              className="hidden"
            />
          </button>

          {stagedFiles.length > 0 ? (
            <ul className="flex flex-col gap-1.5">
              {stagedFiles.map((file, i) => (
                <li
                  key={`${file.name}-${i}`}
                  className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm"
                >
                  <span className="min-w-0 truncate font-mono">{file.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatSize(file.size)}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeStagedFile(i)}
                    aria-label={t("toolZip.removeAria", { name: file.name })}
                    className="btn btn-ghost btn-icon shrink-0"
                  >
                    <i className="ph ph-x" style={{ fontSize: 16 }} />
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          <button
            type="button"
            onClick={handleCreateZip}
            disabled={stagedFiles.length === 0 || compressing}
            className="btn btn-primary-filled"
          >
            {compressing ? t("toolZip.compressing") : t("toolZip.createZip")}
          </button>
        </section>

        {/* Descomprimir */}
        <section className="card flex flex-col gap-4 p-5">
          <h2 className="font-medium">{t("toolZip.decompressTitle")}</h2>

          {!archive ? (
            <button
              type="button"
              onClick={() => decompressInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-2 rounded-lg border py-10 text-center transition-colors"
              style={{
                borderStyle: "dashed",
                borderColor: "color-mix(in srgb, var(--accent) 45%, transparent)",
                background: "color-mix(in srgb, var(--accent) 8%, transparent)",
              }}
            >
              <i className="ph ph-file-zip" style={{ fontSize: 26, color: "var(--accent)" }} />
              <span className="text-sm text-muted-foreground">{t("toolZip.chooseZip")}</span>
              <input
                ref={decompressInputRef}
                type="file"
                accept=".zip"
                onChange={handleChooseZip}
                className="hidden"
              />
            </button>
          ) : (
            <>
              <p className="truncate font-mono text-sm">{archiveName}</p>
              <ul className="flex max-h-56 flex-col gap-1.5 overflow-y-auto">
                {entries.map((entry) => (
                  <li
                    key={entry.name}
                    className="flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-sm"
                  >
                    <span className="min-w-0 truncate font-mono">{entry.name}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {formatSize(entry.size)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleExtractAll}
                  disabled={extracting}
                  className="btn btn-primary-filled"
                >
                  {extracting ? t("toolZip.decompressing") : t("toolZip.extractAll")}
                </button>
                <button type="button" onClick={clearArchive} className="btn btn-secondary">
                  {t("toolZip.clear")}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
