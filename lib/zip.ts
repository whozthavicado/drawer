export function suggestZipName(files: { name: string }[]): string {
  if (files.length === 1) {
    const base = files[0].name.replace(/\.[^./]+$/, "");
    return `${base}.zip`;
  }
  return "archivos.zip";
}

export function stripZipExtension(name: string): string {
  return name.replace(/\.zip$/i, "");
}
