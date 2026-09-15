# StormSpeak 2.0 — Learning Model and Mastery Rules

Status: Step 2 complete

This document defines what StormSpeak knows about a learner, how evidence is stored, how mastery is calculated, when review becomes due, and what the AI Tutor is allowed to teach next.

The model is deliberately independent of the current UI. The existing StormSpeak design can remain unchanged while the learning system evolves underneath it.

## 1. Core principle

StormSpeak does not treat a correct answer as proof that something is learned.

A learning goal becomes reliable only after the child can use it:
- more than once
- in more than one task type
- in more than one context
- after some time has passed

The system therefore stores evidence, not only scores.

## 2. Main learning objects

### Learner Profile

One child has one learning profile.

The learner profile contains high-level information needed by the learning system:
- current CEFR track, initially A1
- active curriculum area
- preferred contexts/themes
- UI/help language
- current learning-goal states
- review queue
- skill tendencies
- recent session summary
- motivation metrics such as XP/streak, kept separate from mastery

The learner profile must never be the only place where raw learning evidence is stored. Raw attempts are kept separately so mastery can be recalculated later.

### Learning Goal

A Learning Goal is the smallest meaningful curriculum unit StormSpeak tracks as knowledge.

Examples:
- greet someone and introduce yourself
- say what you have
- say what you need
- ask where something is
- tell the time
- describe a daily routine
- ask a simple question with `Can I ...?`
- describe what somebody is doing

A Learning Goal is more important than an individual sentence.

One goal may have many phrases and many contexts.

Example:

Learning goal: ask for something politely
Pattern: `Can I have ...?`
Contexts:
- home: `Can I have some water?`
- school: `Can I have a pencil?`
- restaurant: `Can I have a burger?`
- gaming: `Can I have the shield?`

The child is learning the goal, not memorising one sentence.

### Phrase / Chunk

A phrase is an approved example or useful language chunk attached to one or more learning goals.

Examples:
- `I'm ready.`
- `Where is the ...?`
- `I usually ...`
- `Can I have ...?`

Phrases support the learning goal. They are not themselves the authoritative progress unit unless a future curriculum explicitly marks one as a fixed phrase that must be memorised.

### Context

Context describes the real situation in which language is used.

Initial context families:
- school
- home
- family
- friends
- food and drinks
- shopping
- sport / football
- hobbies
- travel
- town and directions
- time and daily routine
- feelings and needs
- plans and invitations
- gaming

Contexts are reusable across many learning goals.

### Exercise

An Exercise is one concrete task shown to the child.

The AI Tutor may generate exercises, but every exercise must reference:
- one primary learning goal
- a task type
- a context
- a difficulty band
- the expected answer or accepted answer set
- the curriculum version used to create it

### Attempt

An Attempt is the atomic learning evidence.

Every answered exercise creates an attempt record.

An attempt should contain at least:
- learner id
- session id
- learning goal id
- exercise id
- task type
- context
- timestamp
- correct / incorrect
- first-attempt correctness
- hints used
- retry count
- learner answer
- expected answer
- response time when available
- whether the task was new, review, transfer or remediation
- AI/model metadata when the task was AI-generated

Attempts are append-only learning evidence. They should not be overwritten when mastery changes.

## 3. Skill dimensions

StormSpeak tracks knowledge from several angles instead of one global percentage.

Initial dimensions:

### Recognition
Can the child recognise the correct meaning or sentence?

Typical tasks:
- meaning choice
- matching

### Listening
Can the child understand the target when hearing it?

Typical tasks:
- hear sentence and choose it
- hear situation and choose response

### Construction
Can the child build the language correctly from parts?

Typical tasks:
- word/chunk ordering
- missing word

### Production
Can the child produce the language without seeing the answer?

Typical tasks:
- type the sentence
- answer a situation

### Transfer
Can the child use the same learning goal in a different context?

Example:
The child learned `Can I have ...?` with food and later succeeds with a school-supplies situation.

Transfer is especially important because StormSpeak should teach usable English, not memorised screens.

Future dimensions may include pronunciation and free speech, but Step 2 does not require them yet.

## 4. Learning-goal states

Every learner-goal pair has exactly one primary learning state.

### NEW
The goal has never been trained.

### INTRODUCED
The goal has been shown, but there is not enough evidence yet.

### LEARNING
There is successful evidence, but the goal is not yet reliable.

### UNSTABLE
The child has shown some success, but recent errors or inconsistent performance indicate weakness.

### MASTERED
There is enough varied evidence and at least one delayed successful review.

### REVIEW_DUE
The goal was previously mastered or stable, but its scheduled retention review is due.

`MASTERED` is therefore not permanent. Knowledge can become due for review without erasing the historical fact that it was mastered before.

## 5. Mastery score

Each learning goal receives a deterministic mastery score from 0 to 100.

The score is calculated from stored attempts. The AI Tutor does not set this number.

### Evidence strength by task type

Initial weighting:
- recognition / meaning: 0.70
- listening: 0.85
- construction: 1.00
- contextual response: 1.10
- free typed production: 1.20
- future spoken production: 1.25

Correct answers create positive evidence. Incorrect answers create negative evidence.

### Assistance penalty

A correct answer with help is weaker evidence than an unaided correct answer.

Initial rule:
- first try, no hint: 100% evidence value
- correct after one hint: maximum 75%
- correct after retry: maximum 60%
- answer revealed/copied: practice only, no mastery credit

This means the app can still praise the child while keeping the mastery calculation honest.

### Evidence diversity

Repeatedly answering the exact same task must not inflate mastery indefinitely.

Evidence receives stronger value when it includes:
- different task types
- different wording
- different contexts
- production instead of recognition
- delayed review

Near-duplicate tasks contribute diminishing additional evidence.

## 6. Conditions for MASTERED

A goal may become MASTERED only when all minimum conditions are satisfied.

Initial StormSpeak 2.0 rule:
- mastery score >= 80
- at least 6 meaningful attempts
- at least 4 correct first-try attempts
- evidence from at least 3 task types
- at least 1 productive task (`type` or contextual response) correct without answer reveal
- evidence from at least 2 contexts when the goal supports multiple contexts
- at least 1 successful delayed review after the initial learning session

This prevents one easy multiple-choice round from turning a goal into 100% mastery.

The exact numeric thresholds may later be tuned from real usage, but changing thresholds must not require changing the data model.

## 7. Review scheduling

StormSpeak uses spaced review, but the schedule remains deterministic.

Initial successful review ladder:
- first review: about 1 day later
- second: about 3 days later
- third: about 7 days later
- fourth: about 14 days later
- fifth: about 30 days later

If a review is answered correctly without help, the goal moves to the next interval.

If a review is wrong:
- mark the goal UNSTABLE
- place it back into the near-term review queue
- do not erase previous historical mastery
- require fresh successful evidence before restoring stable mastery

A severe cluster of errors can shorten the interval further.

## 8. Mission composition

The Learning Engine, not the AI alone, decides the mix of goals in a mission.

Default 6-task mission target:
- 2 tasks: due review / weak material
- 2 tasks: current active learning goal(s)
- 1 task: new material, only if prerequisites allow it
- 1 task: transfer or mixed retrieval from older material

This is a target mix, not an inflexible quota.

If the review queue is overloaded, the engine may temporarily increase review tasks. If no review is due, more new/current material may be used.

The same exact exercise should not be repeated in the next round after a correct answer unless there is a specific pedagogical reason.

Wrong answers should return later in a changed but equivalent form whenever possible.

Example:
Wrong: `Where is the chest?`
Later review should ideally test the same goal in a new situation such as `Where is my bag?` rather than simply replaying the identical screen.

## 9. Prerequisites and progression

Learning goals can depend on other goals.

Example:
- basic `I + verb` statements
  -> daily routine with `I usually ...`
  -> questions about routine
  -> short dialogue about routine

The Learning Engine owns prerequisite checks.

The AI Tutor receives only goals that are currently allowed.

The AI must not skip prerequisites just because it can generate a harder task.

## 10. What the AI Tutor receives

For mission generation, the AI receives a restricted teaching brief rather than unrestricted access to the learner database.

Typical brief:
- learner level: A1
- allowed learning goals
- current goal states
- selected weak patterns
- due-review targets
- recently used contexts to avoid over-repetition
- preferred themes
- German as instruction language
- difficulty band
- safety/content rules

The AI then creates fresh exercises inside those boundaries.

It may vary story, setting and wording.

It may not:
- declare mastery
- unlock curriculum goals
- change prerequisite relationships
- delete attempts
- decide review dates directly
- invent curriculum goals outside the allowed set

## 11. How StormSpeak chooses the next learning goal

The Learning Engine uses a deterministic priority order.

Priority 1 — overdue review
Goals whose review date is due or overdue.

Priority 2 — unstable goals
Goals with recent errors or weak first-try performance.

Priority 3 — current learning goals
Goals already introduced but not yet mastered.

Priority 4 — next eligible new goal
A new goal whose prerequisites are satisfied.

Priority 5 — transfer practice
Previously strong goals tested in a new context to prove flexible use.

The engine can pass a small set of candidates to the AI Tutor. The AI may choose presentation/context among those candidates, but it cannot bypass the priority constraints.

## 12. Progress calculation

StormSpeak permanently separates XP, progress and mastery.

### XP
Motivation only.

XP can reward:
- starting sessions
- completing missions
- persistence
- streaks
- correct answers

XP never unlocks curriculum knowledge by itself.

### Curriculum progress
Progress answers: how much of an area has been learned to a meaningful level?

A simple initial area-progress calculation may use weighted goal states:
- NEW = 0
- INTRODUCED = 0.20
- LEARNING = 0.50
- UNSTABLE = 0.45
- MASTERED = 1.00
- REVIEW_DUE = 0.90

The exact UI percentage is derived from these states across the goals in that curriculum area.

### Mastery
Mastery belongs to one learning goal and is based on evidence.

The Parent Dashboard should expose both the state and the underlying evidence summary, not only a percentage.

## 13. Parent-visible learning summary

The model must support parent questions such as:
- What did my child practise today?
- Which goals were newly introduced?
- Which goals became mastered?
- Which goals became unstable?
- What is due for review?
- Which contexts were used?
- Which task types cause the most difficulty?
- What did the child actually type/select?
- What will the system probably focus on next?

The dashboard should prefer understandable labels such as `Fragen nach der Uhrzeit` over internal IDs.

## 14. Example learner-goal record

Conceptual example only; final database schema belongs to Step 3.

```json
{
  "learning_goal_id": "a1.daily_routine.tell_time",
  "state": "LEARNING",
  "mastery_score": 67,
  "meaningful_attempts": 5,
  "first_try_correct": 3,
  "task_types_seen": ["meaning", "listening", "type"],
  "contexts_seen": ["school", "home"],
  "last_attempt_at": "2026-09-15T08:20:00Z",
  "next_review_at": "2026-09-16T08:20:00Z",
  "review_stage": 0
}
```

This summary record is derived from attempts and can be rebuilt if the mastery algorithm changes.

## 15. Example attempt record

```json
{
  "learning_goal_id": "a1.daily_routine.tell_time",
  "task_type": "type",
  "context": "school",
  "correct": true,
  "first_try": true,
  "hints_used": 0,
  "retry_count": 0,
  "learner_answer": "I start school at eight.",
  "expected_answer": "I start school at eight.",
  "purpose": "learning"
}
```

## 16. Extensibility rules

The model must support future additions without redesigning the core:
- A2 and higher levels
- pronunciation
- speech recognition
- writing tasks
- teacher-created goals
- school curriculum alignment
- additional UI languages
- additional child profiles
- parent summaries over longer periods

New task types may define their own evidence weights, but they must still produce standard Attempt evidence.

New topics should reuse existing learning goals where possible instead of duplicating the same language pattern for each theme.

## 17. Migration from current StormSpeak

Current phrase mastery and task-rotation history are valuable but do not map perfectly to the new model.

Migration principle:
- keep existing historical correct/incorrect counts where possible
- map current phrases to future Learning Goals
- treat old evidence as lower-confidence legacy evidence
- do not automatically mark a new goal MASTERED solely because the old phrase score was high
- keep XP/streak/session history as motivation history

Detailed migration is implemented later after the cloud schema exists.

## Step 2 completion criteria

Step 2 is complete when these rules are accepted as the learning-system baseline:
- Learning Goal is the main knowledge unit
- attempts are append-only evidence
- mastery is deterministic, not assigned by AI
- mastery needs varied and delayed evidence
- exact repeated tasks do not inflate mastery
- wrong material returns, preferably in a changed context/form
- spaced review is part of the core model
- prerequisites control progression
- AI receives only allowed learning targets
- mission composition mixes review, active learning, new material and transfer
- XP remains separate from curriculum progress and mastery
- the model is independent of topic and therefore extendable

Step 3 will translate this learning model into the cloud data model, authentication model and parent-child permissions.