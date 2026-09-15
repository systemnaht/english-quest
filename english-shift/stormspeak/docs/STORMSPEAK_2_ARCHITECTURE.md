# StormSpeak 2.0 — Architecture Baseline

Status: Step 1 complete

## Product definition

StormSpeak 2.0 is a personal AI English tutor for a child, presented through the existing StormSpeak gaming-style interface. The visual design, world map, zones, XP and game feel remain. The learning system beneath the interface is rebuilt around AI, a deterministic learning engine, cloud persistence and a parent dashboard.

Core principle:

> Gaming outside, personal AI English teacher inside.

## Non-negotiable product rules

1. The app is everyday-English first, not gaming-only.
2. AI becomes the main teaching engine.
3. Learning state is cloud-backed and available across devices.
4. A parent account can inspect learning activity, progress, strengths and weak areas.
5. The system must be modular so that new topics, skills, task types and later CEFR levels can be added without rewriting the app.
6. The existing StormSpeak visual design remains the visual shell.
7. XP is motivational only. XP does not determine mastery or curriculum progression.
8. AI does not own the truth about mastery. Mastery, repetition and progression are calculated by deterministic application logic.

## System layers

### 1. Child App

The current StormSpeak interface remains the child-facing shell.

Responsibilities:
- show missions and tasks
- collect answers
- play listening prompts
- show feedback
- show XP, level, streak and world progress
- request the next learning step from the learning system
- sync progress to the cloud

The Child App must not contain the authoritative learning state only in browser localStorage.

### 2. AI Tutor

The AI Tutor becomes the primary teaching layer.

Responsibilities:
- generate contextual exercises from approved learning goals
- vary everyday contexts while training the same language pattern
- adapt wording and task difficulty to the learner profile
- re-use weak language in new contexts
- introduce new material only when allowed by the curriculum and learning engine
- explain mistakes in simple German
- create missions that mix revision and new learning

The AI Tutor may propose learning activities, but may not directly set mastery percentages, unlock levels, erase learning history or decide that a skill is mastered without evidence recorded by the Learning Engine.

### 3. Learning Engine

The Learning Engine is the authoritative learning logic.

Responsibilities:
- decide what is due for repetition
- calculate mastery from answer history
- distinguish new / learning / unstable / mastered / due-for-review states
- select which learning goals the AI Tutor is allowed to work on next
- protect against endless repetition or skipping prerequisites
- separate motivation metrics from real learning progress

The Learning Engine must be deterministic and testable.

### 4. Curriculum Engine

The curriculum is structured data, not a hard-coded sequence of finished exercises.

Curriculum structure:

CEFR level -> domain/topic -> learning goal -> language pattern -> prerequisites -> vocabulary/chunks -> allowed task types -> mastery rules

Example:

- Level: A1
- Domain: School
- Learning goal: talk about the daily school routine
- Pattern: I usually ...
- Prerequisites: basic I + verb statements
- Chunks: I usually get up..., I go to school..., I do my homework...
- Contexts: school morning, timetable, after-school routine, home

The same language goal can appear in several contexts. Gaming is one possible context, not the curriculum itself.

### 5. Cloud / Profile Layer

Cloud storage becomes the source of truth for persistent learning data.

Planned platform: Supabase/Postgres.

Responsibilities:
- authentication
- child profile
- parent-child relationship
- session history
- answer history
- learning-goal mastery
- review queue
- AI-generated mission history
- cross-device synchronization
- parent dashboard data

Security requirements:
- child and parent permissions are separate
- a parent may read only linked child profiles
- exposed tables use Row Level Security
- service-role credentials never exist in the client
- authorization is based on server-side ownership/linkage data, not editable client metadata

### 6. Parent Dashboard

The Parent Dashboard is a separate view over the same learning data.

It should answer useful questions rather than only show gamification numbers.

Examples:
- How often did the child learn this week?
- How much time was spent?
- Which learning goals were introduced?
- Which language patterns are secure?
- Which ones are weak or due for review?
- What mistakes recur?
- What is the AI Tutor planning to focus on next?
- Which concrete phrases/situations were practised?

XP and level may be shown, but they are secondary.

## Topic model

StormSpeak keeps its existing gaming world visually, but learning content becomes broadly everyday-oriented.

Initial everyday domains:
- school
- home
- family
- friends
- food and drinks
- shopping
- hobbies
- sport / football
- travel
- town and directions
- time and daily routine
- feelings and simple needs
- plans and invitations
- gaming

Gaming remains a motivational context among many.

## Data flow

Child opens StormSpeak
-> cloud profile is loaded
-> Learning Engine evaluates mastery, due reviews and prerequisites
-> Learning Engine selects the next learning goal(s)
-> AI Tutor receives only the allowed learning targets plus relevant learner context
-> AI Tutor generates a mission
-> Child answers tasks
-> answers are stored
-> Learning Engine recalculates mastery/review state
-> cloud profile is updated
-> Parent Dashboard can read the updated learning state

## Separation of concepts

StormSpeak 2.0 must permanently separate these three concepts:

### XP
Gamification and motivation only.

### Progress
How much of a curriculum area has been covered / completed.

### Mastery
How reliably the child can understand and use a specific learning goal, based on evidence from multiple attempts and contexts.

XP must never unlock curriculum content by itself.

## Extensibility rule

Adding a new topic should primarily mean adding curriculum data, not rewriting application logic.

Future extensions should fit into the same architecture:
- new everyday domains
- new A1 learning goals
- A2 and later levels
- new task types
- speech recognition/pronunciation
- teacher/coach views
- more detailed parent reports
- additional languages for UI/help text

## Current-to-2.0 migration principle

The existing production app is not replaced in one large rewrite.

Migration order:
1. architecture baseline
2. learning model and mastery schema
3. cloud schema + auth + parent-child relation
4. sync layer
5. AI Tutor orchestration
6. parent dashboard
7. migrate existing task rotation into the new Learning Engine
8. gradually move old localStorage-only state to cloud-backed state

Production design should remain stable during this transition.

## Step 1 completion criteria

Step 1 is complete when the following are accepted as fixed architecture decisions:
- existing visual design remains
- everyday English becomes the main content direction
- AI Tutor is the main teaching layer
- deterministic Learning Engine controls mastery/repetition/progression
- structured Curriculum Engine limits and guides AI
- cloud becomes the persistent source of truth
- parent access is a first-class part of the product
- XP is separated from real learning progress
- the system is modular and extendable

These decisions are the foundation for Step 2: the learner model and mastery data structure.
