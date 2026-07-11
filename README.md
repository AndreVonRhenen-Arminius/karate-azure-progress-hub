# Karate & Azure Progress Hub — v1.8.0

An installable, offline-first Progressive Web App for alternating AZ-104 study and JKA 3rd Dan karate training. It tracks one main task per day, Azure content and mastery separately, Jion readiness, grading evidence, monthly and weekly goals, notes, and optional Microsoft OneDrive or Supabase synchronisation.

## Version 1.8.0

This release adds the alternating progress system and evidence-based roadmap.

### Daily programme

- One main task per day.
- Azure and karate are never generated as main tasks on the same date.
- Editable day types: Azure, Karate, Rest, Azure Review, or Karate Review.
- No fixed start times.
- Prominent Today card with duration, priority, reason, status, checklist, evidence, completion form, missed status, and rescheduling.
- Missed work is moved to a suitable future day rather than stacked onto the next day.

### Current focus

- AZ-104 certification, learning path, module, unit, mastery stage, weak area, and next action.
- Jion sequence, grading readiness, correction, weaker side, practice date, and retention state.
- Current 3rd Dan section, specific technique, weakest ratings, and next training action.

### Azure progress

- Six mastery stages: Learn, Understand, Perform, Test, Review, and Retain.
- Separate content-completion and mastery percentages.
- Per-stage date, notes, evidence, confidence, and review date.
- Expandable AZ-104 learning paths, modules, and units.
- Practical lab journal, assessment scores, recall questions, and review scheduling.
- Current ARM-template position seeded at 4 of 7 units complete, with Unit 5 next.

### Karate progress

- Separate Kihon, Kata, and Kumite checklists.
- Right- and left-side ratings plus stance, balance, hips, path, timing, power, and breathing.
- Corrections, instructor feedback, evidence, practice dates, and reviews.
- Jion sequence is marked known, while all grading-standard technical checks remain outstanding until assessed.

### Roadmap and reports

- Expandable month → week roadmap for six months.
- Measurable Azure and karate goals for every month and week.
- Evidence fields and completion controls for each goal.
- Ahead, On track, Slightly behind, or Behind indicators.
- Completed, partial, and outstanding report sections.
- Evidence-based, estimated, and not-enough-evidence labels.

## Cloud storage

The existing providers remain available:

- Local device only
- Microsoft OneDrive app folder
- Supabase

Microsoft Graph permission remains restricted to:

`Files.ReadWrite.AppFolder`

OneDrive state file:

`karate-azure-progress-state.json`

The app continues to use local storage as the working copy and can operate offline.

## Updating an existing installation

Read `INSTALLATION.md` for the complete step-by-step process.

Important protections:

- Do not replace a separate production `js/config.js` if your deployed repository contains one.
- Keep your existing `js/microsoft-config.js` values if they contain your Microsoft client ID and redirect URI.
- Do not delete browser storage before confirming the updated app has loaded and synchronised.
- Export a JSON backup before updating.

## Data compatibility

- Local state key: `ka_progress_hub_state_v1`
- State schema: version 5
- Microsoft configuration key: `ka_progress_hub_microsoft_config_v1`
- Active provider key: `ka_progress_hub_cloud_provider_v1`
- Supabase configuration key: `ka_progress_hub_cloud_config_v1`
- Supabase table: `user_app_state`

Schema version 5 is additive. `mergeDefaults()` retains existing daily records, notes, Azure progress, labs, syllabus assessments, kata records, weekly reviews, and cloud data while adding the alternating schedule and roadmap.

## Local testing

On Windows, run:

`run-local.bat`

Then open:

`http://localhost:8080/`

Validation commands:

```text
node --check app.js
node --check service-worker.js
node tests/smoke-test.cjs
node tests/onedrive-sync-test.cjs
```

## Main files

- `INSTALLATION.md` — update and installation instructions
- `PROJECT_CONTEXT.md` — architecture, state rules, and protected areas
- `CHANGELOG.md` — release history
- `MICROSOFT-ONEDRIVE-SETUP.md` — Microsoft Entra and OneDrive setup
- `index.html` — app shell and dialogs
- `app.js` — scheduling, mastery, roadmap, rendering, storage, and cloud sync
- `styles.css` — desktop and mobile interface
- `js/microsoft-config.js` — public Microsoft SPA configuration
- `vendor/msal-browser.min.js` — MSAL Browser runtime
- `service-worker.js` — offline cache and update handling
- `manifest.webmanifest` — PWA metadata
- `supabase-schema.sql` — existing Supabase schema and RLS policies
- `tests/smoke-test.cjs` — state, migration, scheduling, and rendering tests
- `tests/onedrive-sync-test.cjs` — mocked OneDrive sync tests
