"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createNote(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const title = String(formData.get("title") ?? "");
  const content = String(formData.get("content") ?? "");

  const { error } = await supabase
    .from("notes")
    .insert({ user_id: user.id, title, content });
  if (error) throw new Error(error.message);

  revalidatePath("/");
}

export async function updateNote(id: string, formData: FormData) {
  const supabase = await createClient();
  const title = String(formData.get("title") ?? "");
  const content = String(formData.get("content") ?? "");

  const { error } = await supabase
    .from("notes")
    .update({ title, content })
    .eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
}

export async function deleteNote(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
}
