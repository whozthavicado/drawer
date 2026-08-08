import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { addRecentConversion, getRecentConversions } from "./recent-conversions";

const DAY_MS = 24 * 60 * 60 * 1000;

// A minimal in-memory Storage polyfill, standing in for `localStorage`.
// Deliberately NOT using vitest's jsdom environment here: jsdom 30's bundled
// undici requires Node 22+ APIs (`webidl.util.markAsUncloneable`) that don't
// exist on this project's Node 20 baseline, which crashes the whole test
// file before a single test runs. `recent-conversions.ts` only touches the
// bare `localStorage` global (see readAll/writeAll) — it never needs a DOM —
// so a plain object satisfying the Storage shape used here is enough.
class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string) {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string) {
    this.store.set(key, value);
  }
  clear() {
    this.store.clear();
  }
}

describe("recent-conversions", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", new MemoryStorage());
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("adds an entry and returns it newest-first", () => {
    vi.setSystemTime(1_000_000);
    addRecentConversion({ filename: "a.zip", label: "Comprimido" });
    vi.setSystemTime(1_000_100);
    addRecentConversion({ filename: "b.png", label: "PNG → JPEG" });

    const recents = getRecentConversions();
    expect(recents.map((r) => r.filename)).toEqual(["b.png", "a.zip"]);
    expect(recents[0].timestamp).toBe(1_000_100);
  });

  it("prunes entries older than 24 hours", () => {
    vi.setSystemTime(0);
    addRecentConversion({ filename: "old.zip", label: "Comprimido" });

    vi.setSystemTime(DAY_MS + 1);
    addRecentConversion({ filename: "new.zip", label: "Comprimido" });

    const recents = getRecentConversions();
    expect(recents.map((r) => r.filename)).toEqual(["new.zip"]);
  });

  it("caps the list at 20 entries", () => {
    vi.setSystemTime(0);
    for (let i = 0; i < 25; i++) {
      vi.setSystemTime(i);
      addRecentConversion({ filename: `file-${i}.zip`, label: "Comprimido" });
    }

    const recents = getRecentConversions();
    expect(recents).toHaveLength(20);
    expect(recents[0].filename).toBe("file-24.zip");
    expect(recents.at(-1)?.filename).toBe("file-5.zip");
  });
});
