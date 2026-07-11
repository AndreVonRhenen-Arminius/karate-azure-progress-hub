# Project Context — Karate & Azure Progress Hub

## Current baseline

- Application version: **1.7.1**
- State schema version: **4**
- Programme start date: **11 July 2026**
- Deployment model: static GitHub Pages Progressive Web App
- Cloud providers: local-only, Microsoft OneDrive app folder, or existing Supabase
- Primary user: André
- Main purposes:
  - AZ-104 learning, practical evidence, active recall and spaced revision
  - JKA 3rd Dan syllabus assessment and grading preparation
  - Kata section learning and retention scheduling
  - One flexible task per day and adaptive weekly planning
  - Notes, weekly reviews, progress and optional OneDrive or Supabase synchronisation

## Protected areas

Do not replace, remove or redesign the following unless André explicitly requests it:

1. Existing Supabase authentication behaviour in `app.js`.
2. Supabase project configuration, publishable/anon key storage or cloud table contract.
3. Existing local or cloud progress data.
5. `js/config.js`, if it is added in a later project copy. This archive does not currently contain that file.
6. The `user_app_state` table structure and row-level security policies in `supabase-schema.sql`.
7. `js/microsoft-config.js` once a production client ID and redirect URI have been configured.

Never add a Supabase service-role key or any other server secret to browser code.

## Architecture

- `index.html` — app shell, navigation, dialogs and versioned PWA assets.
- `styles.css` — dark responsive UI for desktop and mobile.
- `app.js` — programme definitions, adaptive priorities, mastery state, rendering, event handling, backups, timer, Microsoft Graph/OneDrive sync and Supabase sync.
- `js/microsoft-config.js` — public Microsoft SPA client configuration; never contains secrets.
- `vendor/msal-browser.min.js` — pinned official MSAL Browser 5.17.0 UMD runtime.
- `vendor/MSAL-LICENSE.txt` — Microsoft MSAL Browser licence.
- `service-worker.js` — offline cache and network-first update behaviour for app assets.
- `manifest.webmanifest` — installable PWA metadata.
- `supabase-schema.sql` — existing single-row-per-user cloud state table and RLS policies.
- `run-local.bat` / `local-server.ps1` — local Windows test server.

The application has no build step. MSAL Browser 5.17.0 is vendored locally and cached by the service worker. Supabase JS continues to load as an ES module from jsDelivr only when Supabase configuration exists.

## State and compatibility

Local state key:

`ka_progress_hub_state_v1`

Supabase configuration key:

`ka_progress_hub_cloud_config_v1`

Microsoft configuration key:

`ka_progress_hub_microsoft_config_v1`

Active cloud provider key:

`ka_progress_hub_cloud_provider_v1`

Cloud table:

`user_app_state`

State schema version 4 is additive. It introduces:

- one-task-per-day checklist migration;
- Azure module mastery, evidence, review history and custom questions;
- Azure lab journal records;
- 3rd Dan technical ratings and assessment dates;
- kata section levels, retention intervals and review results.

Older state is merged by `mergeDefaults()` rather than replaced. Existing AZ-104 paths, syllabus entries, kata records, notes, daily records and weekly reviews must remain intact.

## Version 1.7.1 cloud behaviour

- Microsoft sign-in is optional and does not replace Supabase authentication.
- MSAL Browser is loaded only when a Microsoft client ID exists.
- Microsoft Graph permission is restricted to `Files.ReadWrite.AppFolder`.
- OneDrive stores `karate-azure-progress-state.json` in the app-specific folder.
- Local state remains the working copy and is always available offline.
- Only the selected provider receives automatic updates.
- Local and remote `updatedAt` values are compared before replacement.
- Manual force-pull and force-push actions require confirmation.
- Microsoft app configuration may be entered in Settings or deployed through `js/microsoft-config.js`.
- No client secret, service-role key or access token may be committed to browser code.

## Version 1.6.0 mastery behaviour

- No fixed start or finish times appear in the active programme.
- Every normal and minimum day contains exactly one main task.
- Today shows the current kata and grading-section priorities even on Azure-focused days.
- Adaptive Azure priority uses mastery, completion, recall result, practical evidence and overdue reviews.
- Adaptive 3rd Dan priority uses technical ratings, incomplete checkpoints and practice recency.
- Adaptive kata priority uses section mastery, current learning status, confidence and overdue retention.
- Active-recall results schedule reviews using increasing intervals.
- Lab journals update practical, troubleshooting and verification evidence.
- Clean kata performances lengthen retention intervals; mistakes shorten them.
- Weekly cards display the recommended focus for each date.
- Existing per-day normal/minimum mode history remains stable.

## Validation

Before release:

1. Run `node --check app.js`.
2. Run `node --check service-worker.js`.
3. Run `node tests/smoke-test.cjs`.
4. Run `node tests/onedrive-sync-test.cjs`.
5. Start the local server with `run-local.bat`.
6. Test desktop and phone widths.
7. Confirm Today displays one task, a kata focus and a grading focus.
8. Confirm an Azure recall result schedules a next review.
9. Confirm a lab journal updates the selected module evidence.
10. Confirm karate ratings change the recommended grading focus.
11. Confirm kata section changes update progress and retention actions set review dates.
12. Verify local progress survives a reload.
13. Verify an older JSON backup imports and receives state version 4.
14. Verify Supabase sign-in, pull and push without altering existing configuration.
15. Verify the installed PWA refreshes to cache version 1.7.1.
16. Register the deployed `redirect.html` URL as a Microsoft SPA redirect URI.
17. Verify Microsoft sign-in creates or reads the OneDrive app-folder state file.
18. Verify offline changes sync to OneDrive after reconnecting.
19. Switch back to Supabase and verify its existing sign-in, pull and push behaviour.

## Development priorities after 1.7.1

- Add full browser automation when a test framework is introduced.
- Add optional grading and exam target dates without changing saved collection IDs.
- Add exportable Azure lab and interview-evidence reports.
- Keep future state migrations additive and backward compatible.
