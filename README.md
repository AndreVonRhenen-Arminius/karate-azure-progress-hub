# Karate & Azure Progress Hub — v1.6.0

An installable, offline-first Progressive Web App for André's AZ-104 study, JKA 3rd Dan preparation, kata learning and retention, notes, practical evidence, progress tracking and optional Supabase cloud synchronisation.

## Version 1.6.0

This release changes the app from a completion tracker into an adaptive mastery coach.

- Removes fixed study and training start times.
- Uses one main task per day in both normal and minimum programmes.
- Shows the current kata focus and 3rd Dan grading section prominently on Today.
- Selects the next Azure, kata and grading priorities from weak, incomplete or overdue work.
- Adds Azure mastery levels, evidence, active recall and spaced review dates.
- Adds a structured Azure practical-lab journal.
- Adds technical quality ratings for 3rd Dan syllabus work.
- Breaks kata into sections and schedules retention reviews.
- Builds the Weekly Plan from the same adaptive priority logic.
- Preserves existing local storage, backups, Supabase authentication and cloud data.

See `CHANGELOG.md` for the detailed release record and `PROJECT_CONTEXT.md` before continuing development.

## Flexible single-task programme

- Programme starts Saturday 11 July 2026.
- Every date has one main task rather than several timed blocks.
- Tasks can be completed whenever they fit the day.
- Tuesday and Thursday combine personal karate development with dojo-day context.
- Friday remains deliberately lighter.
- Saturday contains the main combined Azure and kata development task.
- Sunday contains review, recall and kata retention.
- A reduced minimum-week mode remains available.

The Today page also displays the current kata and grading priorities. These are focus guidance inside the daily task, not additional required tasks.

## Azure mastery workflow

Each Azure topic can now record:

- learning material completed;
- mastery level from 0 to 5;
- learned, recalled, practised, troubleshot and verified evidence;
- active-recall result;
- last and next review date;
- custom recall questions;
- linked practical lab evidence.

Recall results schedule the next review automatically. Practical lab entries increase mastery and record troubleshooting evidence.

## Karate mastery workflow

3rd Dan syllabus cards now record technical quality for stance, balance, hip movement, technique path, timing, speed and power, breathing, and both sides. The app uses these ratings, incomplete checkpoints and practice recency to identify the grading section needing the most attention.

Kata cards now track individual sections such as the opening, direction changes, final sequence, embusen, kiai, rhythm, power and relaxation, and bunkai. Clean performances increase the retention interval; mistakes schedule the kata again sooner.

## Updating an existing GitHub Pages installation

Upload the contents of this folder to the root of the existing `karate-azure-progress-hub` GitHub repository and commit the replacements. GitHub Pages will redeploy automatically.

The installed Android and Windows PWAs normally do not need to be reinstalled. Close and reopen them after deployment. Refresh the website once if an older cached version remains visible.

## Data and cloud compatibility

The existing Supabase project, authentication flow and `user_app_state` table remain compatible. Version 1.6.0 migrates older app state additively while preserving study, syllabus, kata, daily, note and review data.

Use only the Supabase project URL and publishable/anon key in the browser app. Never place a service-role or secret key in browser code.

## Local testing

On Windows, double-click `run-local.bat`, then open:

`http://localhost:8080`

Static and smoke checks:

```text
node --check app.js
node --check service-worker.js
node tests/smoke-test.cjs
```

## Files

- `PROJECT_CONTEXT.md` — current architecture, data rules and protected areas
- `CHANGELOG.md` — release history
- `index.html` — application shell
- `app.js` — schedule, mastery logic, state migration, timer and cloud sync
- `styles.css` — responsive desktop and phone layout
- `manifest.webmanifest` — installable PWA definition
- `service-worker.js` — offline cache and update handling
- `supabase-schema.sql` — existing Supabase table and security policies
- `UPDATE-v1.6.txt` — concise deployment and testing instructions
- `tests/smoke-test.cjs` — dependency-free migration, priority and rendering checks
- `run-local.bat` and `local-server.ps1` — optional Windows local test server
