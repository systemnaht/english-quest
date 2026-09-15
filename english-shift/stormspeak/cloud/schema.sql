-- StormSpeak 2.0 cloud schema baseline
-- Dedicated Supabase project only. Do not apply to the existing finance/coaching project.

create extension if not exists pgcrypto with schema extensions;

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;

-- Opt in to explicit Data API exposure for this dedicated project.
alter default privileges for role postgres in schema public
  revoke select, insert, update, delete on tables from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke execute on functions from anon, authenticated, service_role, public;
alter default privileges for role postgres in schema public
  revoke usage, select on sequences from anon, authenticated, service_role;

create table public.adult_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.learner_profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text not null check (char_length(display_name) between 1 and 80),
  cefr_track text not null default 'A1',
  ui_language text not null default 'de',
  curriculum_version text not null default 'stormspeak-a1-v1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.learner_access (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learner_profiles(id) on delete cascade,
  auth_user_id uuid not null references auth.users(id) on delete cascade,
  access_role text not null check (access_role in ('parent','child_device')),
  device_label text,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);
create unique index learner_access_active_unique
  on public.learner_access(learner_id, auth_user_id, access_role)
  where revoked_at is null;
create index learner_access_user_idx on public.learner_access(auth_user_id, learner_id) where revoked_at is null;
create index learner_access_learner_idx on public.learner_access(learner_id, access_role) where revoked_at is null;

create table public.learning_goals (
  id text primary key,
  cefr text not null default 'A1',
  domain_key text not null,
  title_de text not null,
  description_de text,
  language_pattern text,
  curriculum_version text not null default 'stormspeak-a1-v1',
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index learning_goals_curriculum_idx on public.learning_goals(curriculum_version, cefr, domain_key) where is_active;

create table public.learning_goal_prerequisites (
  goal_id text not null references public.learning_goals(id) on delete cascade,
  prerequisite_goal_id text not null references public.learning_goals(id) on delete restrict,
  primary key (goal_id, prerequisite_goal_id),
  check (goal_id <> prerequisite_goal_id)
);

create table public.learner_goal_state (
  learner_id uuid not null references public.learner_profiles(id) on delete cascade,
  goal_id text not null references public.learning_goals(id) on delete cascade,
  learning_state text not null default 'NEW' check (learning_state in ('NEW','INTRODUCED','LEARNING','UNSTABLE','MASTERED','REVIEW_DUE')),
  mastery_score numeric(5,2) not null default 0 check (mastery_score between 0 and 100),
  meaningful_attempts integer not null default 0 check (meaningful_attempts >= 0),
  first_try_correct integer not null default 0 check (first_try_correct >= 0),
  contexts_seen integer not null default 0 check (contexts_seen >= 0),
  task_types_seen integer not null default 0 check (task_types_seen >= 0),
  first_seen_at timestamptz,
  last_practiced_at timestamptz,
  mastered_at timestamptz,
  next_review_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (learner_id, goal_id)
);
create index learner_goal_review_idx on public.learner_goal_state(learner_id, next_review_at) where next_review_at is not null;

create table public.learning_sessions (
  id uuid primary key,
  learner_id uuid not null references public.learner_profiles(id) on delete cascade,
  source_auth_user_id uuid not null references auth.users(id) on delete restrict,
  mode text not null default 'standard',
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  client_created_at timestamptz not null,
  server_created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);
create index learning_sessions_learner_idx on public.learning_sessions(learner_id, started_at desc);
create index learning_sessions_source_idx on public.learning_sessions(source_auth_user_id, started_at desc);

create table public.ai_missions (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learner_profiles(id) on delete cascade,
  session_id uuid references public.learning_sessions(id) on delete set null,
  model text not null,
  curriculum_version text not null,
  learning_goal_ids text[] not null default '{}',
  rationale jsonb not null default '{}'::jsonb,
  mission_payload jsonb not null,
  created_at timestamptz not null default now()
);
create index ai_missions_learner_idx on public.ai_missions(learner_id, created_at desc);

create table public.exercises (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid not null references public.learner_profiles(id) on delete cascade,
  mission_id uuid references public.ai_missions(id) on delete set null,
  primary_goal_id text not null references public.learning_goals(id) on delete restrict,
  task_type text not null,
  context_key text not null,
  difficulty_band smallint not null default 0 check (difficulty_band between 0 and 4),
  exercise_payload jsonb not null,
  expected_payload jsonb not null,
  curriculum_version text not null,
  created_at timestamptz not null default now()
);
create index exercises_learner_idx on public.exercises(learner_id, created_at desc);
create index exercises_goal_idx on public.exercises(primary_goal_id, context_key, task_type);

create table public.attempts (
  id uuid primary key,
  learner_id uuid not null references public.learner_profiles(id) on delete cascade,
  session_id uuid not null references public.learning_sessions(id) on delete cascade,
  exercise_id uuid references public.exercises(id) on delete set null,
  exercise_key text not null,
  goal_id text references public.learning_goals(id) on delete restrict,
  source_auth_user_id uuid not null references auth.users(id) on delete restrict,
  task_type text not null,
  context_key text,
  evidence_kind text not null default 'practice' check (evidence_kind in ('new','review','transfer','remediation','practice','legacy')),
  correct boolean not null,
  first_try_correct boolean not null,
  hints_used integer not null default 0 check (hints_used >= 0),
  retry_count integer not null default 0 check (retry_count >= 0),
  learner_answer text,
  expected_answer text,
  response_ms integer check (response_ms is null or response_ms >= 0),
  answered_at timestamptz not null,
  client_created_at timestamptz not null,
  server_created_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);
create index attempts_learner_time_idx on public.attempts(learner_id, answered_at desc);
create index attempts_goal_idx on public.attempts(learner_id, goal_id, answered_at desc);
create index attempts_session_idx on public.attempts(session_id, answered_at);

create table public.review_queue (
  learner_id uuid not null references public.learner_profiles(id) on delete cascade,
  goal_id text not null references public.learning_goals(id) on delete cascade,
  due_at timestamptz not null,
  reason text not null,
  priority smallint not null default 50 check (priority between 0 and 100),
  updated_at timestamptz not null default now(),
  primary key (learner_id, goal_id)
);
create index review_queue_due_idx on public.review_queue(learner_id, due_at, priority desc);

create table public.motivation_state (
  learner_id uuid primary key references public.learner_profiles(id) on delete cascade,
  xp integer not null default 0 check (xp >= 0),
  level integer not null default 1 check (level >= 1),
  streak integer not null default 0 check (streak >= 0),
  updated_at timestamptz not null default now()
);

create table public.motivation_events (
  id uuid primary key,
  learner_id uuid not null references public.learner_profiles(id) on delete cascade,
  session_id uuid references public.learning_sessions(id) on delete set null,
  event_type text not null,
  points integer not null default 0,
  created_at timestamptz not null,
  metadata jsonb not null default '{}'::jsonb
);
create index motivation_events_learner_idx on public.motivation_events(learner_id, created_at desc);

-- Transitional bridge: cloud backup of the existing localStorage state.
-- This is NOT authoritative mastery data and will be removed after the new Learning Engine is fully migrated.
create table public.legacy_state_snapshots (
  learner_id uuid primary key references public.learner_profiles(id) on delete cascade,
  source_auth_user_id uuid not null references auth.users(id) on delete restrict,
  state_json jsonb not null,
  client_updated_at timestamptz not null,
  server_updated_at timestamptz not null default now()
);

create table private.pairing_tokens (
  id uuid primary key default gen_random_uuid(),
  token_hash text not null unique,
  learner_id uuid not null references public.learner_profiles(id) on delete cascade,
  parent_user_id uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create index pairing_tokens_expiry_idx on private.pairing_tokens(expires_at) where used_at is null;

-- RLS helper. It lives in a non-exposed schema and always checks auth.uid().
create or replace function private.has_learner_access(p_learner_id uuid, p_roles text[])
returns boolean
language sql
stable
security definer
set search_path = pg_catalog, public
as $$
  select (select auth.uid()) is not null
     and exists (
       select 1
       from public.learner_access la
       where la.learner_id = p_learner_id
         and la.auth_user_id = (select auth.uid())
         and la.revoked_at is null
         and la.access_role = any(p_roles)
     );
$$;
revoke all on function private.has_learner_access(uuid, text[]) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.has_learner_access(uuid, text[]) to authenticated;

-- Service-only RPCs for server endpoints. SECURITY INVOKER on purpose.
create or replace function public.stormspeak_create_learner(
  p_parent_user_id uuid,
  p_display_name text
) returns uuid
language plpgsql
security invoker
set search_path = pg_catalog, public
as $$
declare
  v_learner_id uuid := gen_random_uuid();
begin
  insert into public.learner_profiles(id, display_name) values (v_learner_id, p_display_name);
  insert into public.learner_access(learner_id, auth_user_id, access_role)
    values (v_learner_id, p_parent_user_id, 'parent');
  insert into public.motivation_state(learner_id) values (v_learner_id);
  return v_learner_id;
end;
$$;

create or replace function public.stormspeak_create_pairing_token(
  p_token_hash text,
  p_learner_id uuid,
  p_parent_user_id uuid,
  p_expires_at timestamptz
) returns uuid
language plpgsql
security invoker
set search_path = pg_catalog, public, private
as $$
declare
  v_id uuid;
begin
  if not exists (
    select 1 from public.learner_access
    where learner_id = p_learner_id
      and auth_user_id = p_parent_user_id
      and access_role = 'parent'
      and revoked_at is null
  ) then
    raise exception 'parent_not_linked';
  end if;
  insert into private.pairing_tokens(token_hash, learner_id, parent_user_id, expires_at)
  values (p_token_hash, p_learner_id, p_parent_user_id, p_expires_at)
  returning id into v_id;
  return v_id;
end;
$$;

create or replace function public.stormspeak_redeem_pairing_token(
  p_token_hash text,
  p_child_auth_user_id uuid,
  p_device_label text
) returns uuid
language plpgsql
security invoker
set search_path = pg_catalog, public, private
as $$
declare
  v_token private.pairing_tokens%rowtype;
begin
  select * into v_token
  from private.pairing_tokens
  where token_hash = p_token_hash
  for update;

  if v_token.id is null then
    raise exception 'pairing_token_invalid';
  end if;
  if v_token.used_at is not null then
    raise exception 'pairing_token_used';
  end if;
  if v_token.expires_at <= now() then
    raise exception 'pairing_token_expired';
  end if;

  update private.pairing_tokens set used_at = now() where id = v_token.id;

  insert into public.learner_access(learner_id, auth_user_id, access_role, device_label)
  values (v_token.learner_id, p_child_auth_user_id, 'child_device', nullif(left(p_device_label, 120), ''))
  on conflict do nothing;

  return v_token.learner_id;
end;
$$;

revoke all on function public.stormspeak_create_learner(uuid, text) from public, anon, authenticated;
revoke all on function public.stormspeak_create_pairing_token(text, uuid, uuid, timestamptz) from public, anon, authenticated;
revoke all on function public.stormspeak_redeem_pairing_token(text, uuid, text) from public, anon, authenticated;
grant execute on function public.stormspeak_create_learner(uuid, text) to service_role;
grant execute on function public.stormspeak_create_pairing_token(text, uuid, uuid, timestamptz) to service_role;
grant execute on function public.stormspeak_redeem_pairing_token(text, uuid, text) to service_role;

-- Explicit Data API grants.
grant select, insert, update on public.adult_profiles to authenticated;
grant select, update on public.learner_profiles to authenticated;
grant select on public.learner_access to authenticated;
grant select on public.learning_goals, public.learning_goal_prerequisites to authenticated;
grant select on public.learner_goal_state, public.ai_missions, public.exercises, public.review_queue, public.motivation_state, public.motivation_events to authenticated;
grant select, insert, update on public.learning_sessions to authenticated;
grant select, insert on public.attempts to authenticated;
grant select, insert, update on public.legacy_state_snapshots to authenticated;

grant select, insert, update, delete on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;
grant select, insert, update, delete on private.pairing_tokens to service_role;

-- Enable RLS everywhere in the exposed public schema.
alter table public.adult_profiles enable row level security;
alter table public.learner_profiles enable row level security;
alter table public.learner_access enable row level security;
alter table public.learning_goals enable row level security;
alter table public.learning_goal_prerequisites enable row level security;
alter table public.learner_goal_state enable row level security;
alter table public.learning_sessions enable row level security;
alter table public.ai_missions enable row level security;
alter table public.exercises enable row level security;
alter table public.attempts enable row level security;
alter table public.review_queue enable row level security;
alter table public.motivation_state enable row level security;
alter table public.motivation_events enable row level security;
alter table public.legacy_state_snapshots enable row level security;

-- Parent profile: permanent accounts only.
create policy adult_profile_select_own on public.adult_profiles
for select to authenticated
using ((select auth.uid()) = id and coalesce(((select auth.jwt())->>'is_anonymous')::boolean, false) = false);
create policy adult_profile_insert_own on public.adult_profiles
for insert to authenticated
with check ((select auth.uid()) = id and coalesce(((select auth.jwt())->>'is_anonymous')::boolean, false) = false);
create policy adult_profile_update_own on public.adult_profiles
for update to authenticated
using ((select auth.uid()) = id and coalesce(((select auth.jwt())->>'is_anonymous')::boolean, false) = false)
with check ((select auth.uid()) = id and coalesce(((select auth.jwt())->>'is_anonymous')::boolean, false) = false);

create policy learner_profiles_select_linked on public.learner_profiles
for select to authenticated
using ((select private.has_learner_access(id, array['parent','child_device'])));
create policy learner_profiles_update_parent on public.learner_profiles
for update to authenticated
using ((select private.has_learner_access(id, array['parent'])))
with check ((select private.has_learner_access(id, array['parent'])));

create policy learner_access_select_linked on public.learner_access
for select to authenticated
using (
  auth_user_id = (select auth.uid())
  or (select private.has_learner_access(learner_id, array['parent']))
);

create policy goals_read_authenticated on public.learning_goals
for select to authenticated using (true);
create policy prerequisites_read_authenticated on public.learning_goal_prerequisites
for select to authenticated using (true);

create policy goal_state_select_linked on public.learner_goal_state
for select to authenticated
using ((select private.has_learner_access(learner_id, array['parent','child_device'])));

create policy sessions_select_linked on public.learning_sessions
for select to authenticated
using ((select private.has_learner_access(learner_id, array['parent','child_device'])));
create policy sessions_insert_child on public.learning_sessions
for insert to authenticated
with check (
  source_auth_user_id = (select auth.uid())
  and (select private.has_learner_access(learner_id, array['child_device']))
);
create policy sessions_update_own_child on public.learning_sessions
for update to authenticated
using (
  source_auth_user_id = (select auth.uid())
  and (select private.has_learner_access(learner_id, array['child_device']))
)
with check (
  source_auth_user_id = (select auth.uid())
  and (select private.has_learner_access(learner_id, array['child_device']))
);

create policy ai_missions_select_linked on public.ai_missions
for select to authenticated
using ((select private.has_learner_access(learner_id, array['parent','child_device'])));
create policy exercises_select_linked on public.exercises
for select to authenticated
using ((select private.has_learner_access(learner_id, array['parent','child_device'])));

create policy attempts_select_linked on public.attempts
for select to authenticated
using ((select private.has_learner_access(learner_id, array['parent','child_device'])));
create policy attempts_insert_child on public.attempts
for insert to authenticated
with check (
  source_auth_user_id = (select auth.uid())
  and (select private.has_learner_access(learner_id, array['child_device']))
  and exists (
    select 1 from public.learning_sessions s
    where s.id = session_id
      and s.learner_id = attempts.learner_id
      and s.source_auth_user_id = (select auth.uid())
  )
  and (
    exercise_id is null
    or exists (
      select 1 from public.exercises e
      where e.id = exercise_id
        and e.learner_id = attempts.learner_id
        and (attempts.goal_id is null or e.primary_goal_id = attempts.goal_id)
    )
  )
);

create policy review_queue_select_linked on public.review_queue
for select to authenticated
using ((select private.has_learner_access(learner_id, array['parent','child_device'])));
create policy motivation_state_select_linked on public.motivation_state
for select to authenticated
using ((select private.has_learner_access(learner_id, array['parent','child_device'])));
create policy motivation_events_select_linked on public.motivation_events
for select to authenticated
using ((select private.has_learner_access(learner_id, array['parent','child_device'])));

create policy legacy_snapshot_select_linked on public.legacy_state_snapshots
for select to authenticated
using ((select private.has_learner_access(learner_id, array['parent','child_device'])));
create policy legacy_snapshot_insert_child on public.legacy_state_snapshots
for insert to authenticated
with check (
  source_auth_user_id = (select auth.uid())
  and (select private.has_learner_access(learner_id, array['child_device']))
);
create policy legacy_snapshot_update_child on public.legacy_state_snapshots
for update to authenticated
using (
  source_auth_user_id = (select auth.uid())
  and (select private.has_learner_access(learner_id, array['child_device']))
)
with check (
  source_auth_user_id = (select auth.uid())
  and (select private.has_learner_access(learner_id, array['child_device']))
);

-- No authenticated UPDATE/DELETE grants exist for attempts or authoritative mastery tables.
-- The Learning Engine and pairing endpoints write those via service_role on the server only.
