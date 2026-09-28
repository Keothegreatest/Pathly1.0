-- PREPARED ONLY: not connected to the browser-local application.
-- Copy into a CLI-generated migration; see README.md. Apply in a disposable
-- Supabase environment and run ownership.sql before any production rollout.
begin;
create table public.workspace_records (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  id text not null check (length(id) between 1 and 128),
  kind text not null check (kind in ('profile','experience','reflection','story','school','requirement','goal','letter','essay','task','capture','schoolNote')),
  data jsonb not null default '{}'::jsonb check (jsonb_typeof(data) = 'object'),
  version integer not null default 1 check (version > 0),
  updated timestamptz not null default now(),
  primary key (user_id, id)
);
create unique index workspace_one_profile on public.workspace_records(user_id) where kind = 'profile';
create table public.workspace_preferences (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade primary key,
  has_completed_onboarding boolean not null default false,
  milestones jsonb not null default '[]'::jsonb check (jsonb_typeof(milestones) = 'array'),
  updated timestamptz not null default now()
);
create table public.workspace_conversations (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade primary key,
  messages jsonb not null default '[]'::jsonb check (jsonb_typeof(messages) = 'array' and jsonb_array_length(messages) <= 30),
  updated timestamptz not null default now()
);
-- Composite/primary indexes already lead with user_id for every ownership lookup.

alter table public.workspace_records enable row level security;
alter table public.workspace_records force row level security;
revoke all on public.workspace_records from public, anon, authenticated;
grant select, insert, update, delete on public.workspace_records to authenticated;
create policy workspace_records_select_own on public.workspace_records
  for select to authenticated using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy workspace_records_insert_own on public.workspace_records
  for insert to authenticated 
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy workspace_records_update_own on public.workspace_records
  for update to authenticated using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy workspace_records_delete_own on public.workspace_records
  for delete to authenticated using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

alter table public.workspace_preferences enable row level security;
alter table public.workspace_preferences force row level security;
revoke all on public.workspace_preferences from public, anon, authenticated;
grant select, insert, update, delete on public.workspace_preferences to authenticated;
create policy workspace_preferences_select_own on public.workspace_preferences
  for select to authenticated using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy workspace_preferences_insert_own on public.workspace_preferences
  for insert to authenticated 
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy workspace_preferences_update_own on public.workspace_preferences
  for update to authenticated using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy workspace_preferences_delete_own on public.workspace_preferences
  for delete to authenticated using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

alter table public.workspace_conversations enable row level security;
alter table public.workspace_conversations force row level security;
revoke all on public.workspace_conversations from public, anon, authenticated;
grant select, insert, update, delete on public.workspace_conversations to authenticated;
create policy workspace_conversations_select_own on public.workspace_conversations
  for select to authenticated using ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy workspace_conversations_insert_own on public.workspace_conversations
  for insert to authenticated 
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy workspace_conversations_update_own on public.workspace_conversations
  for update to authenticated using ((select auth.uid()) is not null and (select auth.uid()) = user_id)
  with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);
create policy workspace_conversations_delete_own on public.workspace_conversations
  for delete to authenticated using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

commit;
