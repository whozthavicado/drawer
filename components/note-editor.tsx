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
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    formData.set("title", title);
    formData.set("content", content);
    if (note) {
      await updateNote(note.id, formData);
    } else {
      await createNote(formData);
    }
    setSaving(false);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded border border-neutral-300 p-3">
      <input
        placeholder="Título (opcional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded border border-neutral-200 px-2 py-1"
      />
      <textarea
        placeholder="Escribe tu nota, prompt o idea…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="rounded border border-neutral-200 px-2 py-1"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded bg-neutral-900 px-3 py-1.5 text-white disabled:opacity-50"
        >
          {saving ? "Guardando…" : "Guardar"}
        </button>
        <button type="button" onClick={onClose} className="rounded px-3 py-1.5">
          Cancelar
        </button>
      </div>
    </form>
  );
}
