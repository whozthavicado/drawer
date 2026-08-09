"use client";

import { useState, type FormEvent } from "react";
import { createNote, updateNote } from "@/app/actions";
import type { Note } from "@/lib/notes";
import { useLanguage } from "./language-provider";

export function NoteEditor({
  note,
  onClose,
}: {
  note?: Note;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const [title, setTitle] = useState(note?.title ?? "");
  const [content, setContent] = useState(note?.content ?? "");
  const [tags, setTags] = useState(note?.tags.join(", ") ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const formData = new FormData();
    formData.set("title", title);
    formData.set("content", content);
    formData.set("tags", tags);
    try {
      if (note) {
        await updateNote(note.id, formData);
      } else {
        await createNote(formData);
      }
      onClose();
    } catch {
      setError(t("notes.editorSaveError"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex h-full flex-col gap-4 p-5 sm:p-6"
    >
      <div className="field flex-none">
        <label htmlFor="note-title">{t("notes.editorTitleLabel")}</label>
        <input
          id="note-title"
          className="input"
          placeholder={t("notes.editorTitlePlaceholder")}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="field flex-none">
        <label htmlFor="note-tags">{t("notes.editorTagsLabel")}</label>
        <input
          id="note-tags"
          className="input"
          placeholder={t("notes.editorTagsPlaceholder")}
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <div className="field flex flex-1 flex-col">
        <label htmlFor="note-content">{t("notes.editorContentLabel")}</label>
        <textarea
          id="note-content"
          className="input flex-1 font-mono"
          style={{ resize: "none" }}
          placeholder={t("notes.editorContentPlaceholder")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      {error ? <p className="flex-none text-sm text-destructive">{error}</p> : null}
      <div className="flex flex-none gap-2">
        <button type="submit" disabled={saving} className="btn btn-primary-filled">
          {saving ? t("notes.saving") : t("notes.save")}
        </button>
        <button type="button" onClick={onClose} className="btn btn-ghost">
          {t("notes.cancel")}
        </button>
      </div>
    </form>
  );
}
