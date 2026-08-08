"use client";

import { useState, type ChangeEvent } from "react";
import JSZip from "jszip";
import { suggestZipName, stripZipExtension } from "@/lib/zip";

export default function ZipToolPage() {
  const [status, setStatus] = useState("");

  async function handleCompress(e: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setStatus("Comprimiendo…");

    const zip = new JSZip();
    for (const file of files) {
      zip.file(file.name, await file.arrayBuffer());
    }
    const blob = await zip.generateAsync({ type: "blob" });
    downloadBlob(blob, suggestZipName(files));
    setStatus("Listo.");
  }

  async function handleDecompress(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus(`Descomprimiendo ${stripZipExtension(file.name)}…`);

    const zip = await JSZip.loadAsync(file);
    const entries = Object.values(zip.files).filter((f) => !f.dir);
    for (const entry of entries) {
      const blob = await entry.async("blob");
      downloadBlob(blob, entry.name);
    }
    setStatus(`Listo — ${entries.length} archivo(s) descargado(s).`);
  }

  function downloadBlob(blob: Blob, name: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-6 sm:px-6 sm:py-10">
      <h1 className="mb-6 font-mono text-2xl font-semibold">ZIP</h1>

      <div className="flex flex-col gap-4">
        <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 className="mb-3 font-medium">Comprimir</h2>
          <input
            type="file"
            multiple
            onChange={handleCompress}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:min-h-[44px] file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-4 file:font-medium file:text-primary-foreground hover:file:opacity-90"
          />
        </section>

        <section className="rounded-xl border border-border bg-card p-4 sm:p-5">
          <h2 className="mb-3 font-medium">Descomprimir</h2>
          <input
            type="file"
            accept=".zip"
            onChange={handleDecompress}
            className="block w-full text-sm text-muted-foreground file:mr-3 file:min-h-[44px] file:cursor-pointer file:rounded-lg file:border-0 file:bg-accent file:px-4 file:font-medium file:text-accent-foreground hover:file:opacity-90"
          />
        </section>
      </div>

      {status ? <p className="mt-4 text-sm text-muted-foreground">{status}</p> : null}
    </main>
  );
}
