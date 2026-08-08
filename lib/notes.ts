export type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
};

export function parseTags(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split(",")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    ),
  );
}

export function displayTitle(note: { title: string; content: string }): string {
  if (note.title.trim()) return note.title;
  const firstLine = note.content.split("\n")[0]?.trim() ?? "";
  if (!firstLine) return "(nota vacía)";
  return firstLine.length > 60 ? firstLine.slice(0, 60) + "…" : firstLine;
}
