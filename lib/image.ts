export type ImageFormat = "png" | "jpeg" | "webp";

export function swapExtension(filename: string, newExt: ImageFormat): string {
  const base = filename.includes(".")
    ? filename.replace(/\.[^./]+$/, "")
    : filename;
  return `${base}.${newExt}`;
}

export function mimeForFormat(format: ImageFormat): string {
  return { png: "image/png", jpeg: "image/jpeg", webp: "image/webp" }[format];
}
