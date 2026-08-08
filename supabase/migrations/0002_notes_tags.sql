-- Adds tag filtering to notes, per the Nocturne mockup's tag chips
-- (prompts/snippets/ideas/etc.) on the notes list.
alter table public.notes add column tags text[] not null default '{}';
