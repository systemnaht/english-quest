# StormSpeak 2.0 Cloud — Step 4 implementation

This directory contains the first executable cloud layer for StormSpeak 2.0.

## Safety boundary

Use a dedicated Supabase project for StormSpeak. Do not apply `schema.sql` to the existing finance/coaching project.

## What is implemented

- dedicated Postgres schema baseline
- explicit Data API grants
- RLS for parent and child-device access
- permanent parent identity + anonymous child-device identity
- one-time hashed pairing tokens
- service-only learner creation and pairing RPCs
- server APIs for parent setup and child-device pairing
- browser cloud bridge
- offline-safe pending snapshot flag
- transitional sync of the existing `stormSpeakV1` local state
- minimal parent setup page at `/stormspeak/parent/`

The transitional `legacy_state_snapshots` table is intentionally not authoritative mastery. It exists only to preserve and migrate the current trainer state while the new Learning Engine is introduced.

## Required Vercel environment variables

- `STORMSPEAK_SUPABASE_URL`
- `STORMSPEAK_SUPABASE_PUBLISHABLE_KEY`
- `STORMSPEAK_SUPABASE_SERVICE_ROLE_KEY`
- `STORMSPEAK_PAIRING_SECRET` — long random server-only secret used for HMAC hashing of pairing codes

Never expose the service-role key or pairing secret in browser code.

## Supabase Auth settings

Enable:
- email OTP / magic-link sign-in for parents
- anonymous sign-ins for child devices

Anonymous Auth users use the `authenticated` Postgres role. RLS therefore checks actual learner linkage, not merely the database role.

For production, enable CAPTCHA / abuse protection for anonymous sign-ins and review Auth rate limits.

## Activation order

1. Create dedicated Supabase project.
2. Apply and verify `schema.sql`.
3. Run Supabase security and performance advisors.
4. Enable parent email Auth and anonymous sign-ins.
5. Configure the four Vercel environment variables.
6. Deploy the implementation branch as a preview.
7. Open `/stormspeak/parent/` and sign in as parent.
8. Create a learner profile.
9. Generate a device code.
10. On the child app open `Progress -> Cloud Sync` and pair the device.
11. Confirm a row appears in `legacy_state_snapshots` after the app saves progress.
12. Confirm an unrelated authenticated user cannot read the learner profile or snapshot.

## Next migration

The next learning-engine step should replace snapshot-only synchronization with append-only `learning_sessions` + `attempts`, then calculate `learner_goal_state` server-side from those attempts.
