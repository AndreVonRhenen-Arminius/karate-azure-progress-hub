# Project Context — Karate & Azure Progress Hub

## Current baseline

- Application version: **1.8.0**
- State schema version: **5**
- Programme start date: **11 July 2026**
- Deployment: static GitHub Pages Progressive Web App
- Cloud providers: local-only, Microsoft OneDrive app folder, or Supabase
- Primary user: André

## Main behaviour

1. Every date has exactly one main task.
2. Azure and karate cannot be generated as main tasks on the same date.
3. Day types are editable: Azure, Karate, Rest, Azure Review, or Karate Review.
4. No fixed task start times are displayed.
5. Future tasks are generated from the weekly day-type pattern.
6. A task becomes a historical snapshot when progress is recorded.
7. Changing a day containing progress requires confirmation and clears that day only.
8. Missed tasks are rescheduled to a compatible future day without stacking tasks.
9. Current-focus cards do not create extra daily tasks.

## Protected areas

Do not replace, remove, or redesign these unless André explicitly requests it:

1. Existing Supabase authentication functions in `app.js`.
2. Supabase project configuration or browser-stored publishable key.
3. The `user_app_state` table and RLS policies in `supabase-schema.sql`.
4. Microsoft authentication and OneDrive app-folder integration.
5. Existing local, OneDrive, or Supabase progress data.
6. `js/microsoft-config.js` after production values have been entered.
7. `js/config.js` if it exists in a deployed copy. This archive does not contain it.

Never add client secrets, access tokens, refresh tokens, service-role keys, or passwords to browser source code.

## Architecture

- `index.html`: shell, navigation, timer, completion, reschedule, and confirmation dialogs.
- `styles.css`: restrained dark interface with Azure, karate, status, roadmap, and responsive styles.
- `app.js`: state schema, migrations, scheduling, task generation, Azure mastery, karate assessments, roadmap, reports, rendering, backups, OneDrive sync, and Supabase sync.
- `js/microsoft-config.js`: public Microsoft SPA client configuration only.
- `vendor/msal-browser.min.js`: pinned MSAL Browser runtime.
- `service-worker.js`: offline assets and network-first update behaviour.
- `manifest.webmanifest`: PWA metadata.
- `supabase-schema.sql`: existing cloud state table and policies.

There is no build step.

## State schema version 5

Version 5 adds:

- `settings.weeklyDayTypes`
- `scheduleOverrides`
- one saved task snapshot per daily record
- task status, result, evidence, completion data, and rescheduling metadata
- `azureFocus`
- Azure units and six detailed mastery-stage records
- full 3rd Dan Kihon, Kata, and Kumite assessments
- Jion grading-readiness fields
- six-month expandable roadmap with monthly and weekly goals

Migration is additive through `mergeDefaults()`. Unknown collection entries are retained. Existing notes, labs, daily data, kata data, syllabus records, and reviews are not reset.

## Current seeded progress

### Azure

- Certification: AZ-104
- Path: Prerequisites for Azure administrators
- Module: Deploy Azure infrastructure by using JSON ARM templates
- Units complete: 4 of 7
- Current unit: Unit 5 — Add parameters and outputs to an ARM template
- Preferred tool: PowerShell
- Learn: partial
- Perform: partial
- Understand, Test, Review, Retain: not completed

### Karate

- Current kata: Jion
- Sequence: known
- Grading readiness: not yet demonstrated
- Only “Complete sequence known” starts at grading-standard level
- Embusen, stances, transitions, rhythm, timing, kime, speed/power, kiai, questions, and reliable grading performance remain unassessed

## Roadmap behaviour

- Six monthly sections begin in July 2026.
- Each month contains monthly outcomes and four or five expandable weeks.
- Every week contains at least one Azure and one karate outcome.
- Goals require manual completion and can store evidence.
- Roadmap progress contributes to report status but does not directly mark Azure mastery or karate readiness.

## Cloud behaviour

- Local state remains the working copy.
- Only the selected cloud provider receives automatic updates.
- OneDrive uses `Files.ReadWrite.AppFolder` and `karate-azure-progress-state.json`.
- Supabase uses the existing `user_app_state` contract.
- Local and remote `updatedAt` values are compared before replacement.
- Force pull and force push require confirmation.
- The app remains usable when offline.

## Release validation

Before packaging:

1. Run JavaScript syntax checks.
2. Run smoke and OneDrive tests.
3. Confirm all principal views render.
4. Confirm Today and Week previews do not create daily records.
5. Confirm one task per day and category-safe rescheduling.
6. Confirm old version-4 state migrates to version 5 without losing custom data.
7. Confirm current ARM and Jion progress values.
8. Confirm monthly and weekly roadmap rendering.
9. Confirm completion and reschedule dialogs exist.
10. Confirm service-worker references match version 1.8.0.
11. Confirm `supabase-schema.sql` and `js/microsoft-config.js` are unchanged.
12. Confirm the existing Supabase/Microsoft cloud block is unchanged.
13. Confirm there are no embedded secrets.
14. Confirm ZIP integrity.
15. Perform live Supabase and Microsoft sign-in checks only in the deployed environment with valid configuration.
