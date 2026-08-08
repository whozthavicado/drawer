"use client";

import { useState } from "react";
import { displayTitle, type Note } from "@/lib/notes";
import { deleteNote } from "@/app/actions";
import { CopyButton } from "./copy-button";
import { NoteEditor } from "./note-editor";

export function NoteList({ notes }: { notes: Note[] }) {
  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = notes.filter((n) =>
    (n.title + " " + n.content).toLowerCase().includes(query.toLowerCase()),
  );

  function handleDelete(id: string) {
    if (window.confirm("¿Borrar esta nota? No se puede deshacer.")) {
      deleteNote(id);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          placeholder="Buscar…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[44px] flex-1 rounded-lg border border-border bg-card px-3 py-2 text-foreground placeholder:text-muted-foreground/60"
        />
        <button
          onClick={() => setCreating(true)}
          className="min-h-[44px] cursor-pointer rounded-lg bg-primary px-4 font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          Nueva nota
        </button>
      </div>

      {creating ? <NoteEditor onClose={() => setCreating(false)} /> : null}

      <ul className="flex flex-col gap-3">
        {filtered.map((note) =>
          editingId === note.id ? (
            <li key={note.id}>
              <NoteEditor note={note} onClose={() => setEditingId(null)} />
            </li>
          ) : (
            <li
              key={note.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{displayTitle(note)}</p>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {note.content}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <CopyButton text={note.content} />
                <button
                  onClick={() => setEditingId(note.id)}
                  className="min-h-[44px] cursor-pointer rounded-lg border border-border px-3 text-sm text-foreground transition-colors hover:bg-muted"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="min-h-[44px] cursor-pointer rounded-lg border border-destructive/40 px-3 text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  Borrar
                </button>
              </div>
            </li>
          ),
        )}
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {notes.length === 0
              ? "Todavía no tienes notas."
              : "Sin resultados."}
          </p>
        ) : null}
      </ul>
    </div>
  );
}
