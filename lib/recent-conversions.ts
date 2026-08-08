const STORAGE_KEY = "drawer:recent-conversions";
const MAX_ENTRIES = 20;
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

export type RecentConversion = {
  filename: string;
  label: string;
  timestamp: number;
};

function readAll(): RecentConversion[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (entry): entry is RecentConversion =>
        entry &&
        typeof entry.filename === "string" &&
        typeof entry.label === "string" &&
        typeof entry.timestamp === "number",
    );
  } catch {
    return [];
  }
}

function pruneExpired(entries: RecentConversion[]): RecentConversion[] {
  const cutoff = Date.now() - MAX_AGE_MS;
  return entries.filter((entry) => entry.timestamp >= cutoff);
}

function writeAll(entries: RecentConversion[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function addRecentConversion(
  entry: Omit<RecentConversion, "timestamp">,
): void {
  const next = pruneExpired(readAll());
  next.unshift({ ...entry, timestamp: Date.now() });
  writeAll(next.slice(0, MAX_ENTRIES));
}

export function getRecentConversions(): RecentConversion[] {
  const pruned = pruneExpired(readAll());
  writeAll(pruned);
  return pruned;
}
