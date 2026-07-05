-- Run this once in Supabase > SQL Editor.
-- It creates one private JSON state record per signed-in user.

create table if not exists public.user_app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_app_state enable row level security;

create policy "Users can read their own app state"
on public.user_app_state
for select
using ((select auth.uid()) = user_id);

create policy "Users can insert their own app state"
on public.user_app_state
for insert
with check ((select auth.uid()) = user_id);

create policy "Users can update their own app state"
on public.user_app_state
for update
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_user_app_state_updated_at on public.user_app_state;
create trigger set_user_app_state_updated_at
before update on public.user_app_state
for each row execute function public.set_updated_at();
