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
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const formData = new FormData();
    formData.set("title", title);
    formData.set("content", content);
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
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
    >
      <input
        placeholder="Título (opcional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="min-h-[44px] rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground/60"
      />
      <textarea
        placeholder="Escribe tu nota, prompt o idea…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
        className="rounded-lg border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground/60"
      />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="min-h-[44px] cursor-pointer rounded-lg bg-primary px-4 font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Guardando…" : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="min-h-[44px] cursor-pointer rounded-lg px-4 text-muted-foreground transition-colors hover:bg-muted"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
