"use client";

import { useState, type FormEvent } from "react";
import { createNote, updateNote } from "@/app/actions";
import type { Note } from "@/lib/notes";

export function NoteEditor({
  note,
  onClose,
}: {
  note?: Note;
  onClose: () => void;
}) {
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
      setError("No se pudo guardar — intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 sm:p-6">
      <div className="field">
        <label htmlFor="note-title">Título</label>
        <input
          id="note-title"
          className="input"
          placeholder="Título (opcional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="note-tags">Tags (separados por coma)</label>
        <input
          id="note-tags"
          className="input"
          placeholder="prompts, ideas"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </div>
      <div className="field">
        <label htmlFor="note-content">Contenido</label>
        <textarea
          id="note-content"
          className="input font-mono"
          placeholder="Escribe tu nota, prompt o idea…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={12}
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="btn btn-primary-filled">
          {saving ? "Guardando…" : "Guardar"}
        </button>
        <button type="button" onClick={onClose} className="btn btn-ghost">
          Cancelar
        </button>
      </div>
    </form>
  );
}
