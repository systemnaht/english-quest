# StormSpeak 2.0 — Cloud, Auth and Parent Access Model

Status: Step 3 complete

This document defines the persistent cloud model for StormSpeak 2.0: authentication, parent-child linkage, cross-device sync, authoritative learning data, Row Level Security boundaries and the data flow between the child app, AI tutor, learning engine and parent dashboard.

It builds on:
- Step 1: architecture baseline
- Step 2: learning model and mastery rules

## 1. Cloud ownership decision

StormSpeak 2.0 should use a dedicated Supabase project instead of sharing the existing Supabase project that currently contains finance and coaching data.

Reasons:
- child learning data is a separate security domain
- simpler RLS and auditability
- safer future changes to Auth settings
- easier backup/export and deletion
- avoids accidental coupling with finance/coaching tables
- easier to expand StormSpeak independently later

The existing Supabase project is therefore not modified by Step 3.

## 2. Authentication model

StormSpeak separates adult identity from child learning identity.

### Parent

A parent is a permanent Supabase Auth user.

Recommended sign-in methods:
- email magic link / OTP
- email + password if desired later

The parent account is the durable administrative identity.

### Child

The child does not need an email address or phone number.

Each child device uses a Supabase anonymous Auth user. Anonymous users still receive a real auth user ID and authenticated session, but no PII is required.

A child device is linked to one learner profile through a one-time parent-approved pairing flow.

Important separation:
- auth user = who/which device is connected
- learner profile = whose learning history is being updated

This allows multiple child devices to access the same learner profile without making the learner profile itself dependent on one device session.

## 3. Pairing flow

Recommended flow:

1. Parent signs into Parent Dashboard.
2. Parent creates or selects the child learner profile.
3. Parent taps "Gerät verbinden".
4. Server creates a short-lived one-time pairing code/token.
5. Child device creates an anonymous Supabase Auth session.
6. Child enters/scans the pairing code.
7. A protected server endpoint validates:
   - pairing token exists
   - token is not expired
   - token is not already used
   - requesting parent owns the learner profile
8. Server inserts a learner-access relation for the anonymous auth user.
9. Pairing token is invalidated.
10. Child device can now sync only the assigned learner profile.

Pairing tokens must never be stored as plaintext after creation. Store only a cryptographic hash plus expiry and used-at timestamp.

## 4. Core tables

Names below are logical names for the future SQL schema.

### adult_profiles

Purpose: application profile for permanent parent users.

Columns:
- `user_id uuid primary key references auth.users(id)`
- `display_name text`
- `locale text default 'de-DE'`
- `created_at timestamptz`
- `updated_at timestamptz`

Do not duplicate the parent's email here unless the product later needs it outside Auth.

### learner_profiles

Purpose: the child-facing learning identity.

Columns:
- `id uuid primary key`
- `display_name text`
- `current_cefr text default 'A1'`
- `school_grade smallint nullable`
- `ui_language text default 'de'`
- `learning_language text default 'en'`
- `timezone text default 'Europe/Berlin'`
- `preferred_contexts jsonb default '[]'`
- `status text default 'active'`
- `created_at timestamptz`
- `updated_at timestamptz`

Privacy rule:
- no exact date of birth required
- no child email required
- no phone number required
- no school name required
- no full legal name required

Use only the minimum information needed for the learning experience.

### learner_access

Purpose: authorization relation between auth users and learner profiles.

Columns:
- `id uuid primary key`
- `learner_id uuid references learner_profiles(id)`
- `user_id uuid references auth.users(id)`
- `access_role text`
- `created_at timestamptz`
- `revoked_at timestamptz nullable`

Allowed roles initially:
- `parent`
- `child_device`

Constraints:
- unique active `(learner_id, user_id)` relation
- a child-device relation must point to exactly one learner profile unless intentionally changed later

This table is the core of all RLS ownership checks.

### pairing_tokens

Purpose: temporary device-linking workflow.

This should live in a non-public/private schema or be accessible only through server-side functions.

Columns:
- `id uuid primary key`
- `learner_id uuid`
- `created_by uuid`
- `token_hash text unique`
- `expires_at timestamptz`
- `used_at timestamptz nullable`
- `created_at timestamptz`

Client applications must never be able to list pairing tokens.

## 5. Curriculum tables

Curriculum is versioned structured data and is shared between learners.

### curriculum_versions
- `id uuid primary key`
- `version text unique`
- `status text` (`draft`, `active`, `retired`)
- `created_at timestamptz`

### curriculum_domains
- `id uuid primary key`
- `curriculum_version_id uuid`
- `cefr_level text`
- `slug text`
- `title_de text`
- `sort_order int`

Examples:
- school
- home
- family
- friends
- football
- food
- shopping
- travel
- gaming

### learning_goals
- `id uuid primary key`
- `curriculum_version_id uuid`
- `domain_id uuid`
- `slug text`
- `title_de text`
- `description_de text`
- `target_pattern text`
- `difficulty_band smallint`
- `active boolean`
- `sort_order int`

### learning_goal_prerequisites
- `learning_goal_id uuid`
- `prerequisite_goal_id uuid`

Primary key:
- `(learning_goal_id, prerequisite_goal_id)`

### contexts
- `id uuid primary key`
- `slug text unique`
- `title_de text`
- `category text`

### phrases
- `id uuid primary key`
- `curriculum_version_id uuid`
- `english text`
- `german text`
- `is_fixed_phrase boolean default false`

### learning_goal_phrases
- `learning_goal_id uuid`
- `phrase_id uuid`
- `role text`

Possible roles:
- `example`
- `core_chunk`
- `transfer_example`

### learning_goal_contexts
- `learning_goal_id uuid`
- `context_id uuid`
- `weight numeric`

These mappings allow one learning goal to be practised in many everyday situations.

## 6. Learner state tables

### learner_goal_state

Purpose: current deterministic state for each learner × learning goal.

Columns:
- `learner_id uuid`
- `learning_goal_id uuid`
- `state text`
- `mastery_score numeric(5,2)`
- `attempt_count int`
- `first_try_correct_count int`
- `distinct_task_type_count int`
- `distinct_context_count int`
- `successful_delayed_reviews int`
- `last_attempt_at timestamptz nullable`
- `last_success_at timestamptz nullable`
- `next_review_at timestamptz nullable`
- `mastered_at timestamptz nullable`
- `updated_at timestamptz`

Primary key:
- `(learner_id, learning_goal_id)`

Allowed state values:
- `NEW`
- `INTRODUCED`
- `LEARNING`
- `UNSTABLE`
- `MASTERED`
- `REVIEW_DUE`

Important:
- clients may read this table
- clients do not directly set mastery score/state
- writes come from trusted Learning Engine/server logic

### learner_skill_state

Purpose: aggregate tendencies across dimensions from Step 2.

Columns:
- `learner_id uuid`
- `skill_dimension text`
- `score numeric(5,2)`
- `evidence_count int`
- `updated_at timestamptz`

Dimensions initially:
- recognition
- listening
- construction
- production
- transfer

This table is informative and adaptive, not the authoritative curriculum completion record.

## 7. Session and exercise history

### learning_sessions

Purpose: one learning visit/mission session.

Columns:
- `id uuid primary key`
- `learner_id uuid`
- `started_at timestamptz`
- `completed_at timestamptz nullable`
- `source text`
- `mission_type text`
- `curriculum_version_id uuid`
- `device_user_id uuid nullable`
- `xp_earned int default 0`
- `metadata jsonb default '{}'`

Possible source values:
- `ai`
- `static_fallback`
- `parent_assigned`

### ai_missions

Purpose: store exactly what the AI generated and what learning targets were supplied.

Columns:
- `id uuid primary key`
- `learner_id uuid`
- `session_id uuid nullable`
- `curriculum_version_id uuid`
- `primary_goal_ids uuid[]`
- `review_goal_ids uuid[]`
- `transfer_goal_ids uuid[]`
- `model_name text`
- `prompt_version text`
- `mission_payload jsonb`
- `created_at timestamptz`

This gives the parent dashboard and developers an audit trail of what was actually taught.

### exercises

Purpose: one concrete exercise shown to the child.

Columns:
- `id uuid primary key`
- `session_id uuid`
- `mission_id uuid nullable`
- `learner_id uuid`
- `learning_goal_id uuid`
- `context_id uuid nullable`
- `task_type text`
- `difficulty_band smallint`
- `position int`
- `exercise_payload jsonb`
- `expected_answer jsonb`
- `created_at timestamptz`

The payload may contain generated wording/options, but the canonical target learning goal must be a real curriculum goal ID.

### attempts

Purpose: append-only evidence of what happened on an exercise.

Columns:
- `id uuid primary key`
- `client_attempt_id uuid unique`
- `learner_id uuid`
- `session_id uuid`
- `exercise_id uuid`
- `learning_goal_id uuid`
- `task_type text`
- `context_id uuid nullable`
- `attempted_at timestamptz`
- `is_correct boolean`
- `is_first_try boolean`
- `hints_used int default 0`
- `retry_number int default 0`
- `learner_answer jsonb`
- `expected_answer jsonb`
- `response_time_ms int nullable`
- `evidence_kind text`
- `evidence_weight numeric(5,3)`
- `device_user_id uuid`
- `created_at timestamptz`

Evidence kinds:
- `new`
- `practice`
- `review`
- `transfer`
- `remediation`

Critical rule:
- attempts are append-only
- no normal client update/delete
- mastery can always be recomputed from attempts

`client_attempt_id` provides idempotency for offline/retry sync and prevents one answer from being counted twice.

## 8. Motivation tables

XP is separate from mastery.

### motivation_state
- `learner_id uuid primary key`
- `xp bigint default 0`
- `level int default 1`
- `streak_days int default 0`
- `last_active_date date nullable`
- `updated_at timestamptz`

### motivation_events
- `id uuid primary key`
- `learner_id uuid`
- `session_id uuid nullable`
- `event_type text`
- `xp_delta int`
- `created_at timestamptz`

This makes XP auditable without letting XP influence mastery.

## 9. Parent dashboard data

The parent dashboard reads the authoritative tables rather than maintaining a second copy of learning state.

Parent dashboard queries should derive:
- sessions per day/week
- total learning time
- attempts and first-try accuracy
- goals introduced this week
- goals mastered
- goals in `UNSTABLE`
- goals with `next_review_at <= now()`
- repeated error patterns
- current skill tendencies
- exact phrases/contexts practised
- upcoming AI learning priorities

Optional cached summaries may be introduced later for performance, but raw attempts and goal state remain authoritative.

## 10. Authorization / RLS model

All exposed learner tables use RLS.

Authorization is based on `learner_access`, never editable user metadata.

Conceptual helper checks:

- `has_parent_access(auth.uid(), learner_id)`
- `has_child_device_access(auth.uid(), learner_id)`
- `has_any_learner_access(auth.uid(), learner_id)`

Implementation must avoid unsafe public `SECURITY DEFINER` functions. Prefer normal RLS predicates or tightly controlled private-schema functions only when needed.

### RLS matrix

#### adult_profiles
Parent:
- select own row
- update own row

Child device:
- no access

#### learner_profiles
Parent:
- select linked learner
- update non-authoritative preferences/settings for linked learner

Child device:
- select assigned learner
- no administrative update

#### learner_access
Parent:
- read access relations for linked learner
- revoke child-device relations through trusted server action

Child device:
- read only its own active relation if needed
- cannot grant itself access to another learner

Direct arbitrary INSERT is forbidden.

#### curriculum tables
Authenticated parent/child:
- SELECT active curriculum data

No client INSERT/UPDATE/DELETE.

#### learner_goal_state
Parent:
- SELECT linked learner

Child device:
- SELECT assigned learner

Writes:
- trusted Learning Engine only

#### learning_sessions
Parent:
- SELECT linked learner

Child device:
- SELECT assigned learner
- INSERT session for assigned learner
- only limited updates required to close its own active session, preferably through trusted API

#### ai_missions / exercises
Parent:
- SELECT linked learner

Child device:
- SELECT assigned learner

Writes:
- trusted server only

#### attempts
Parent:
- SELECT linked learner

Child device:
- SELECT assigned learner if the UI needs history
- INSERT for assigned learner only
- no UPDATE
- no DELETE

Server validates that exercise/session/goal all belong to the same learner before accepting evidence.

#### motivation_state
Parent + child:
- SELECT linked/assigned learner

Writes:
- trusted server only

#### pairing_tokens
No Data API access from normal clients.
Server-only.

## 11. Data API grants

Do not assume new public tables are automatically available through the Supabase Data API.

For every table exposed to clients, explicitly grant only required operations to `authenticated`, then rely on RLS for row-level authorization.

Example principle:
- curriculum: authenticated SELECT
- attempts: authenticated SELECT + INSERT
- learner_goal_state: authenticated SELECT only
- pairing tokens: no authenticated client grants

No learner data is exposed to unauthenticated `anon` requests.

## 12. Cloud sync rules

The cloud is the source of truth.

### On app launch
1. Restore/create Auth session.
2. Resolve `learner_access`.
3. Load learner profile.
4. Load active curriculum version.
5. Load learner-goal state and due reviews.
6. Load current motivation state.
7. Learning Engine selects allowed targets.
8. AI Tutor generates/loads next mission.

### On every answer
1. Child app creates a UUID `client_attempt_id`.
2. App submits attempt.
3. Server validates learner/session/exercise relation.
4. Attempt is appended.
5. Learning Engine recalculates affected learning-goal state.
6. Updated state is returned/synced.
7. Parent dashboard sees the new evidence.

### Offline/retry handling

The child app may keep a temporary local outbound queue.

Rules:
- cloud remains authoritative
- each attempt has stable `client_attempt_id`
- retries use the same ID
- server ignores duplicate attempt IDs
- raw attempts are merged append-only
- mastery is recalculated from cloud evidence, never last-write-wins from two devices

This avoids corrupted progress when the same learner uses more than one device.

## 13. AI data boundary

The AI Tutor should receive only what it needs to generate a useful mission.

Allowed learner context:
- active CEFR level
- permitted learning goals
- mastery states/scores relevant to those goals
- recent error summaries
- preferred context categories
- recent task-type balance
- curriculum version

Do not send unnecessary personal information such as parent email, legal name, exact birth date or unrelated account data to the AI provider.

AI output is stored with:
- model name
- prompt version
- curriculum version
- selected goal IDs
- generated mission payload

This supports debugging and future model changes.

## 14. Parent control model

The parent should be able to:
- view learning history
- view strengths/weaknesses
- see concrete material practised
- pair/revoke child devices
- choose allowed/preferred context families
- later optionally set weekly learning preferences

The parent should not normally edit raw attempts or manually set mastery percentages.

If a future "reset learning goal" feature is added, it should create an auditable administrative event rather than deleting historical evidence silently.

## 15. Security invariants

These are non-negotiable:

1. No service-role or secret key in the browser.
2. Every exposed learner-data table has RLS enabled.
3. `TO authenticated` alone is never considered authorization; policies also check learner linkage.
4. Authorization does not use editable `user_metadata`.
5. Anonymous child users are explicitly distinguished from permanent parent users when role-sensitive actions are involved.
6. Child devices cannot grant themselves access to learner profiles.
7. Attempts are append-only.
8. Mastery writes come only from trusted learning logic.
9. Pairing tokens are short-lived, one-time and hashed.
10. No public/unauthenticated access to child learning data.
11. Views used by the dashboard must not accidentally bypass RLS.
12. Parent account cannot see a learner unless a valid parent linkage exists.

## 16. Recommended physical Supabase separation

Because the currently connected Supabase project already contains finance and coaching tables, StormSpeak should get its own project before Step 3 is physically deployed.

Recommended project characteristics:
- dedicated StormSpeak project
- EU region
- Supabase Auth enabled
- anonymous sign-ins enabled for child-device sessions
- permanent email auth for parent
- explicit Data API grants
- RLS on every exposed table
- separate production secrets

Creating this project is intentionally not part of the architecture-only Step 3 because project creation can have billing implications and requires explicit organization/cost confirmation.

## 17. Step 3 completion criteria

Step 3 is complete when these are fixed decisions:
- dedicated StormSpeak cloud project
- parent = permanent Auth identity
- child = learner profile, not PII-heavy account
- child devices use anonymous Auth and pairing
- parent-child/device relationships are stored in `learner_access`
- attempts are append-only raw evidence
- learner-goal state is server-calculated and cloud-backed
- curriculum is versioned structured data
- cloud is the source of truth across devices
- RLS is based on actual learner linkage
- parent dashboard reads the same authoritative learning data
- AI receives only learning-relevant context
- XP remains separate from mastery

The next implementation step is Step 4: create the dedicated Supabase project, deploy the first schema/RLS migration, and connect StormSpeak to cloud sync without changing the existing visual design.
