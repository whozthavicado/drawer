"use client";

import { useMemo, useState } from "react";
import { displayTitle, type Note } from "@/lib/notes";
import { deleteNote } from "@/app/actions";
import { CopyButton } from "./copy-button";
import { NoteEditor } from "./note-editor";
import { DeleteDialog } from "./delete-dialog";
import { useLanguage } from "./language-provider";

type Mode = "view" | "edit" | "create";

export function NoteList({ notes }: { notes: Note[] }) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("view");
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);
  const [toast, setToast] = useState(false);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => n.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [notes]);

  const filtered = notes.filter((n) => {
    const matchesQuery = (n.title + " " + n.content)
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesTag = !activeTag || n.tags.includes(activeTag);
    return matchesQuery && matchesTag;
  });

  const selected = notes.find((n) => n.id === selectedId) ?? null;

  function selectNote(note: Note) {
    setSelectedId(note.id);
    setMode("view");
  }

  function startCreate() {
    setSelectedId(null);
    setMode("create");
  }

  function startEdit(note: Note) {
    setSelectedId(note.id);
    setMode("edit");
  }

  function closeEditor() {
    setMode("view");
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    deleteNote(deleteTarget.id);
    if (selectedId === deleteTarget.id) {
      setSelectedId(null);
      setMode("view");
    }
    setDeleteTarget(null);
  }

  function showToast() {
    setToast(true);
    setTimeout(() => setToast(false), 1500);
  }

  const editingNote = mode === "edit" ? (selected ?? undefined) : undefined;
  const isEditorOpen = mode !== "view";

  return (
    <div className="flex flex-1 flex-col md:h-screen md:flex-row">
      {/* List pane */}
      <div className="flex w-full flex-col gap-4 p-4 sm:p-6 md:h-screen md:w-[372px] md:flex-none md:overflow-y-auto md:border-r md:border-border md:p-5">
        <input
          placeholder={t("notes.search")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="input"
        />

        {allTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className={`tag tag-outline ${!activeTag ? "is-active" : ""}`}
            >
              {t("notes.allTags")}
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`tag tag-outline ${activeTag === tag ? "is-active" : ""}`}
              >
                {tag}
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            {t("notes.count", { filtered: filtered.length, total: notes.length })}
          </p>
          <button
            type="button"
            onClick={startCreate}
            className="btn btn-primary-filled hidden md:inline-flex"
          >
            <i className="ph ph-plus" style={{ fontSize: 16 }} />
            {t("notes.new")}
          </button>
        </div>

        <ul className="flex flex-col gap-2 md:gap-0.5">
          {filtered.map((note) => {
            const isSelected = mode === "view" && note.id === selectedId;
            return (
              <li key={note.id}>
                {/* Desktop row */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => selectNote(note)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") selectNote(note);
                  }}
                  className={`hidden w-full cursor-pointer items-start gap-2 rounded-lg px-2.5 py-2.5 text-left transition-colors md:flex ${
                    isSelected
                      ? "bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]"
                      : "hover:bg-[color-mix(in_srgb,var(--foreground)_6%,transparent)]"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{displayTitle(note)}</p>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {note.content || "—"}
                    </p>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <CopyButton text={note.content} iconOnly onCopied={showToast} />
                  </div>
                </div>

                {/* Mobile card */}
                <div className="card flex flex-col gap-3 p-4 md:hidden">
                  <div>
                    <p className="truncate font-medium">{displayTitle(note)}</p>
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {note.content || "—"}
                    </p>
                  </div>
                  {note.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {note.tags.map((tag) => (
                        <span key={tag} className="tag tag-accent">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="flex items-center gap-2">
                    <CopyButton
                      text={note.content}
                      label={t("notes.copy")}
                      className="btn-block flex-1"
                      onCopied={showToast}
                    />
                    <button
                      type="button"
                      onClick={() => startEdit(note)}
                      aria-label={t("notes.editAria")}
                      className="btn btn-icon btn-secondary"
                    >
                      <i className="ph ph-pencil-simple" style={{ fontSize: 18 }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(note)}
                      aria-label={t("notes.deleteAria")}
                      className="btn btn-icon btn-danger"
                    >
                      <i className="ph ph-trash" style={{ fontSize: 18 }} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {notes.length === 0 ? t("notes.empty") : t("notes.noResults")}
            </p>
          ) : null}
        </ul>
      </div>

      {/* Right pane (desktop only) */}
      <div className="hidden md:flex md:h-screen md:flex-1 md:flex-col md:overflow-y-auto">
        {isEditorOpen ? (
          <NoteEditor note={editingNote} onClose={closeEditor} />
        ) : selected ? (
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h4 className="truncate text-xl">{displayTitle(selected)}</h4>
                {selected.tags.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {selected.tags.map((tag) => (
                      <span key={tag} className="tag tag-accent">
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <CopyButton text={selected.content} label={t("notes.copyNote")} onCopied={showToast} />
                <button
                  type="button"
                  onClick={() => startEdit(selected)}
                  aria-label={t("notes.editAria")}
                  className="btn btn-icon btn-secondary"
                >
                  <i className="ph ph-pencil-simple" style={{ fontSize: 18 }} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(selected)}
                  aria-label={t("notes.deleteAria")}
                  className="btn btn-icon btn-danger"
                >
                  <i className="ph ph-trash" style={{ fontSize: 18 }} />
                </button>
              </div>
            </div>
            <div className="my-5 border-t border-border" />
            <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {selected.content}
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center text-muted-foreground">
            <i className="ph ph-note" style={{ fontSize: 32 }} />
            <p className="text-sm">{t("notes.selectPrompt")}</p>
          </div>
        )}
      </div>

      {/* Mobile floating "new note" button */}
      <button
        type="button"
        onClick={startCreate}
        aria-label={t("notes.new")}
        className="btn btn-primary-filled btn-icon fixed bottom-5 right-5 z-30 md:hidden"
        style={{ boxShadow: "var(--shadow-md)" }}
      >
        <i className="ph ph-plus" style={{ fontSize: 22 }} />
      </button>

      {/* Mobile full-screen editor overlay */}
      {isEditorOpen ? (
        <div className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-background md:hidden">
          <div className="flex h-[52px] flex-none items-center gap-2 border-b border-border px-4">
            <span className="font-medium">
              {mode === "edit" ? t("notes.editTitle") : t("notes.newTitle")}
            </span>
            <button
              type="button"
              onClick={closeEditor}
              aria-label={t("notes.closeAria")}
              className="btn btn-icon btn-ghost ml-auto"
            >
              <i className="ph ph-x" style={{ fontSize: 20 }} />
            </button>
          </div>
          <NoteEditor note={editingNote} onClose={closeEditor} />
        </div>
      ) : null}

      {deleteTarget ? (
        <DeleteDialog
          noteTitle={displayTitle(deleteTarget)}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      ) : null}

      {toast ? (
        <div
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-surface px-4 py-2 text-sm md:bottom-5"
          style={{ boxShadow: "var(--shadow-md)" }}
        >
          {t("notes.copiedToast")}
        </div>
      ) : null}
    </div>
  );
}
