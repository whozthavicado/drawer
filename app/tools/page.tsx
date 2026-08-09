"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  getRecentConversions,
  type RecentConversion,
} from "@/lib/recent-conversions";
import { useLanguage } from "@/components/language-provider";

const EMPTY_RECENTS: RecentConversion[] = [];

let cachedKey: string | null = null;
let cachedSnapshot: RecentConversion[] = EMPTY_RECENTS;

function subscribeToRecents(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getRecentsSnapshot(): RecentConversion[] {
  const fresh = getRecentConversions();
  const key = JSON.stringify(fresh);
  if (key !== cachedKey) {
    cachedKey = key;
    cachedSnapshot = fresh;
  }
  return cachedSnapshot;
}

function getServerRecentsSnapshot(): RecentConversion[] {
  return EMPTY_RECENTS;
}

const TOOLS = [
  {
    href: "/tools/zip",
    icon: "ph-file-zip",
    titleKey: "tools.zip.title",
    descriptionKey: "tools.zip.description",
  },
  {
    href: "/tools/image",
    icon: "ph-image",
    titleKey: "tools.image.title",
    descriptionKey: "tools.image.description",
  },
  {
    href: "/tools/media",
    icon: "ph-waveform",
    titleKey: "tools.media.title",
    descriptionKey: "tools.media.description",
  },
] as const;

function relativeTime(timestamp: number, t: (key: string, vars?: Record<string, string | number>) => string): string {
  const now = Date.now();
  const diffMs = Math.max(0, now - timestamp);
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);

  const entryDate = new Date(timestamp);
  const nowDate = new Date(now);
  const isSameDay =
    entryDate.getFullYear() === nowDate.getFullYear() &&
    entryDate.getMonth() === nowDate.getMonth() &&
    entryDate.getDate() === nowDate.getDate();

  if (!isSameDay) return t("tools.relative.yesterday");
  if (diffMin < 1) return t("tools.relative.justNow");
  if (diffMin < 60) return t("tools.relative.minutes", { n: diffMin });
  return t(diffHours === 1 ? "tools.relative.hoursOne" : "tools.relative.hoursMany", { n: diffHours });
}

export default function ToolsHubPage() {
  const { t } = useLanguage();
  const recent = useSyncExternalStore(
    subscribeToRecents,
    getRecentsSnapshot,
    getServerRecentsSnapshot,
  );

  return (
    <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-10">
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-2xl font-semibold">{t("tools.title")}</h1>
        <span className="tag tag-outline">{t("tools.badge")}</span>
      </div>
      <p className="mb-8 max-w-xl text-sm text-muted-foreground">{t("tools.description")}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="card flex flex-col gap-3 p-5 transition-colors hover:bg-[color-mix(in_srgb,var(--foreground)_4%,transparent)]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] text-[var(--accent)]">
              <i className={`ph ${tool.icon}`} style={{ fontSize: 20 }} />
            </div>
            <div>
              <p className="font-medium">{t(tool.titleKey)}</p>
              <p className="text-sm text-muted-foreground">{t(tool.descriptionKey)}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="mb-3 font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          {t("tools.recent")}
        </h2>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("tools.noRecent")}</p>
        ) : (
          <ul className="flex flex-col gap-1">
            {recent.map((entry) => (
              <li
                key={`${entry.filename}-${entry.timestamp}`}
                className="flex items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm"
              >
                <span className="min-w-0 truncate font-mono">{entry.filename}</span>
                <span className="tag tag-neutral shrink-0">{entry.label}</span>
                <span className="shrink-0 text-muted-foreground">
                  {relativeTime(entry.timestamp, t)}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-xs text-muted-foreground">{t("tools.recentNote")}</p>
      </div>
    </main>
  );
}
