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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <input
          placeholder="Buscar…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded border border-neutral-300 px-3 py-2"
        />
        <button
          onClick={() => setCreating(true)}
          className="rounded bg-neutral-900 px-3 py-2 text-white"
        >
          Nueva nota
        </button>
      </div>

      {creating ? (
        <NoteEditor onClose={() => setCreating(false)} />
      ) : null}

      <ul className="flex flex-col gap-2">
        {filtered.map((note) =>
          editingId === note.id ? (
            <li key={note.id}>
              <NoteEditor note={note} onClose={() => setEditingId(null)} />
            </li>
          ) : (
            <li
              key={note.id}
              className="flex items-start justify-between gap-3 rounded border border-neutral-200 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{displayTitle(note)}</p>
                <p className="truncate text-sm text-neutral-500">
                  {note.content}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <CopyButton text={note.content} />
                <button
                  onClick={() => setEditingId(note.id)}
                  className="rounded border border-neutral-300 px-2 py-1 text-xs hover:bg-neutral-100"
                >
                  Editar
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="rounded border border-red-300 px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  Borrar
                </button>
              </div>
            </li>
          ),
        )}
        {filtered.length === 0 ? (
          <p className="text-sm text-neutral-500">
            {notes.length === 0 ? "Todavía no tienes notas." : "Sin resultados."}
          </p>
        ) : null}
      </ul>
    </div>
  );
}
