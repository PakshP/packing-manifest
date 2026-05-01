-- =====================================================================
-- The Packing Manifest — Supabase schema
-- Run this entire file in the Supabase SQL editor.
-- =====================================================================

-- 1. Table -------------------------------------------------------------
create table if not exists public.packing_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  categories jsonb not null default '[]'::jsonb,
  checked_items jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint packing_lists_user_unique unique (user_id)
);

create index if not exists packing_lists_user_id_idx
  on public.packing_lists (user_id);

-- 2. updated_at trigger -----------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_packing_lists_set_updated_at
  on public.packing_lists;

create trigger trg_packing_lists_set_updated_at
  before update on public.packing_lists
  for each row execute function public.set_updated_at();

-- 3. Row Level Security -----------------------------------------------
alter table public.packing_lists enable row level security;

drop policy if exists "packing_lists_select_own" on public.packing_lists;
create policy "packing_lists_select_own"
  on public.packing_lists
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "packing_lists_insert_own" on public.packing_lists;
create policy "packing_lists_insert_own"
  on public.packing_lists
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "packing_lists_update_own" on public.packing_lists;
create policy "packing_lists_update_own"
  on public.packing_lists
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "packing_lists_delete_own" on public.packing_lists;
create policy "packing_lists_delete_own"
  on public.packing_lists
  for delete
  to authenticated
  using (auth.uid() = user_id);
