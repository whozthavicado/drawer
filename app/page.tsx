import { createClient } from "@/lib/supabase/server";
import { NoteList } from "@/components/note-list";
import type { Note } from "@/lib/notes";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .order("updated_at", { ascending: false })
    .returns<Note[]>();

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold">Drawer</h1>
      <NoteList notes={notes ?? []} />
    </main>
  );
}
