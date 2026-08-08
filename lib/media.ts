export function swapMediaExtension(filename: string, newExt: string): string {
  const base = filename.includes(".")
    ? filename.replace(/\.[^./]+$/, "")
    : filename;
  return `${base}.${newExt}`;
}
