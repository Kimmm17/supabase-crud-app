-- Ledger: tasks table, constraints, timestamps, and RLS
-- Paste this entire file into the Supabase SQL Editor and run it.
-- Dashboard → SQL Editor → New query → Run

-- Enable UUID generation (usually already available)
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Table
-- ---------------------------------------------------------------------------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo',
  priority text not null default 'medium',
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tasks_title_length check (char_length(btrim(title)) between 1 and 200),
  constraint tasks_status_check check (status in ('todo', 'in_progress', 'done')),
  constraint tasks_priority_check check (priority in ('low', 'medium', 'high'))
);

comment on table public.tasks is 'Per-user work items managed by the Ledger CRUD app.';

create index if not exists tasks_user_id_idx on public.tasks (user_id);
create index if not exists tasks_status_idx on public.tasks (user_id, status);
create index if not exists tasks_created_at_idx on public.tasks (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- Keep updated_at in sync
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tasks_set_updated_at on public.tasks;
create trigger tasks_set_updated_at
before update on public.tasks
for each row
execute procedure public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Users can only read/write their own rows. The anon/publishable key is
-- safe in the browser because these policies are enforced by Postgres.
-- Never use the service_role key in frontend code — it bypasses RLS.
-- ---------------------------------------------------------------------------
alter table public.tasks enable row level security;

drop policy if exists "tasks_select_own" on public.tasks;
create policy "tasks_select_own"
on public.tasks
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "tasks_insert_own" on public.tasks;
create policy "tasks_insert_own"
on public.tasks
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "tasks_update_own" on public.tasks;
create policy "tasks_update_own"
on public.tasks
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "tasks_delete_own" on public.tasks;
create policy "tasks_delete_own"
on public.tasks
for delete
to authenticated
using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Realtime: broadcast inserts/updates/deletes to subscribed clients
-- ---------------------------------------------------------------------------
alter table public.tasks replica identity full;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'tasks'
  ) then
    alter publication supabase_realtime add table public.tasks;
  end if;
end
$$;
