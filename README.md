# Karate & Azure Progress Hub — v1.3

An installable, offline-first Progressive Web App for André's AZ-104 study, JKA 3rd Dan preparation, kata sequence learning, notes, progress tracking and Supabase cloud synchronisation.

## Morning programme

- Programme starts Saturday 11 July 2026.
- Normal start time: 5:30 am.
- Office-day sessions finish by 7:00 am so work travel can begin at 8:00 am.
- Tuesday and Thursday combine 3rd Dan work and kata before dojo in the evening.
- Friday is deliberately lighter.
- Saturday is the main AZ-104 practical and kata development morning.
- Sunday contains weekly review, kata retention and planning.
- A reduced minimum-week mode is included.

## Updating an existing GitHub Pages installation

Upload the contents of this folder to the root of the existing `karate-azure-progress-hub` GitHub repository and commit the replacements. GitHub Pages will redeploy automatically.

The installed Android and Windows PWAs do not need to be reinstalled. Close and reopen them after the GitHub deployment. Refresh once if an older cached version remains visible.

## Cloud synchronisation

The existing Supabase project and `user_app_state` table remain compatible. Version 1.3 migrates older app state to the morning schedule while preserving study, syllabus, kata, note and review data.

Use only the Supabase project URL and publishable/anon key in the app. Never place a service-role or secret key in browser code.

## Files

- `index.html` — application shell
- `app.js` — schedule, tracking, cloud sync and data migration
- `styles.css` — responsive desktop and phone layout
- `manifest.webmanifest` — installable PWA definition
- `service-worker.js` — offline cache and update handling
- `supabase-schema.sql` — Supabase table and security policies
- `UPDATE-v1.3.txt` — concise update instructions
- `run-local.bat` and `local-server.ps1` — optional Windows local test server
