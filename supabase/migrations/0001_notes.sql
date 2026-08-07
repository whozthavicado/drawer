create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default '',
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notes enable row level security;

create policy "select own notes" on public.notes
  for select using (auth.uid() = user_id);

create policy "insert own notes" on public.notes
  for insert with check (auth.uid() = user_id);

create policy "update own notes" on public.notes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "delete own notes" on public.notes
  for delete using (auth.uid() = user_id);

create index notes_user_id_updated_at_idx on public.notes (user_id, updated_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger notes_set_updated_at
before update on public.notes
for each row execute function public.set_updated_at();
