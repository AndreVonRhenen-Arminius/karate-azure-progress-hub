# Project Context — Karate & Azure Progress Hub

## Current baseline

- Application version: **1.8.0**
- State schema version: **5**
- Programme start date: **11 July 2026**
- Deployment model: static GitHub Pages Progressive Web App
- Cloud providers: local-only, Microsoft OneDrive app folder, or existing Supabase
- Primary user: André
- Main purposes:
  - AZ-104 learning, practical evidence, active recall and spaced revision
  - JKA 3rd Dan syllabus assessment and grading preparation
  - Kata section learning and retention scheduling
  - One flexible task per day
  - Automatic rollover of unfinished tasks
  - Notes, weekly reviews, progress and optional OneDrive or Supabase synchronisation

## Protected areas

Do not replace, remove or redesign the following unless André explicitly requests it:

1. Existing Supabase authentication behaviour in `app.js`.
2. Supabase project configuration, publishable/anon key storage or cloud table contract.
3. Existing local, Supabase or OneDrive progress data.
4. `js/config.js`, if present in a deployed project copy.
5. The `user_app_state` table structure and row-level security policies in `supabase-schema.sql`.
6. Configured production values in `js/microsoft-config.js`.

Never add a Supabase service-role key, Microsoft client secret, access token or refresh token to browser code.

## Architecture

- `index.html` — app shell, navigation, dialogs and versioned PWA assets.
- `styles.css` — dark responsive UI, mastery controls and rollover indicators.
- `app.js` — programme definitions, rollover queue, adaptive priorities, state, backups, timer, Microsoft Graph/OneDrive sync and Supabase sync.
- `js/microsoft-config.js` — public Microsoft SPA client configuration; never contains secrets.
- `vendor/msal-browser.min.js` — pinned MSAL Browser runtime.
- `service-worker.js` — offline cache and network-first update behaviour.
- `manifest.webmanifest` — installable PWA metadata.
- `supabase-schema.sql` — existing single-row-per-user cloud state table and RLS policies.
- `tests/smoke-test.cjs` — state, migration, rollover and rendering checks.
- `tests/onedrive-sync-test.cjs` — mocked OneDrive read/write and conflict checks.

The application has no build step. Local state remains the working copy even when a cloud provider is selected.

## State and compatibility

Local state key:

`ka_progress_hub_state_v1`

State schema version 5 is additive. It adds:

- `settings.rolloverEnabled`
- `settings.rolloverStartDate`
- `daily[date].taskSourceDate`
- `daily[date].taskPlanMode`

Older state is merged through `mergeDefaults()` rather than replaced.

When a version 4 or earlier state is upgraded:

- rollover is enabled;
- rollover begins on the upgrade date;
- existing daily records retain their original date and programme mode;
- older historical progress is not rearranged.

## Version 1.8.0 rollover behaviour

- The schedule is treated as an ordered task queue.
- Each calendar date shows one task.
- An unfinished task remains at the front of the queue on the following day.
- Later tasks shift forward one date for every missed day.
- A carried task displays its original planned date.
- A task advances when all checklist items are complete or its result is completed, completed with difficulty, or skipped.
- A partial or not-completed result does not advance the queue.
- A skipped task advances but contributes zero completion progress.
- Future Weekly Plan cards assume each unsaved future task will be completed on the date shown.
- A task assignment is frozen once progress is recorded for that date.
- Date-key arithmetic uses UTC-safe calculations so rollover remains consistent outside the Pacific/Auckland device timezone.
- Minimum-mode recovery tasks do not permanently block later carried tasks.

## Version 1.7.0 cloud behaviour retained

- Microsoft sign-in remains optional and does not replace Supabase authentication.
- Microsoft Graph permission remains `Files.ReadWrite.AppFolder`.
- OneDrive stores `karate-azure-progress-state.json` in the app-specific folder.
- Local and remote `updatedAt` values are compared before replacement.
- Only the selected provider receives automatic updates.
- Manual force-pull and force-push actions require confirmation.
- No client secret, service-role key or access token is committed.

## Version 1.6.0 mastery behaviour retained

- No fixed task start or finish times.
- Every normal and minimum day contains one main task.
- Today prominently shows the current kata and 3rd Dan grading priority.
- Azure recommendations use mastery, completion, recall, practical evidence and review dates.
- Karate recommendations use ratings, checkpoints and practice recency.
- Kata recommendations use section mastery, confidence and retention dates.

## Validation

Before release:

1. Run `node --check app.js`.
2. Run `node --check service-worker.js`.
3. Run `node tests/smoke-test.cjs`.
4. Run `node tests/onedrive-sync-test.cjs`.
5. Confirm every programme day still contains one task and no fixed time.
6. Confirm an unfinished Saturday task appears on Sunday.
7. Confirm completing that task on Sunday places Sunday’s original task on Monday.
8. Confirm a partial result continues carrying the same task.
9. Confirm **Skipped — move on** advances the queue but does not count as completed.
10. Confirm carried tasks display the original planned date on Today and Weekly Plan.
11. Confirm existing version 4 daily records retain their original task date during migration.
12. Confirm viewing Today or Weekly Plan does not create empty daily records.
13. Confirm Azure mastery, 3rd Dan ratings and kata retention still save correctly.
14. Verify local progress survives reload.
15. Verify JSON backup import receives state version 5.
16. Verify Supabase sign-in, pull and push without changing its configuration or schema.
17. Verify Microsoft sign-in, OneDrive pull and OneDrive push.
18. Verify the installed PWA refreshes to cache version 1.8.0.

## Development priorities after 1.8.0

- Add optional manual queue reordering without deleting progress.
- Add optional exam and grading target dates.
- Add exportable Azure lab and interview-evidence reports.
- Add full browser automation if a test framework is introduced.
- Keep future migrations additive and backward compatible.
