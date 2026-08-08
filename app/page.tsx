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

  return <NoteList notes={notes ?? []} />;
}
