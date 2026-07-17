# Project Context — Karate & Azure Progress Hub

## Current release

- Application version: **1.9.3**
- State schema: **7**
- Architecture: static HTML, CSS, and JavaScript PWA
- Build step: none
- Primary timezone: Pacific/Auckland

## v1.9.3 repair baseline

The user-provided deployment archive had cross-assigned file contents: `index.html` contained `vendor/msal-browser.min.js`, `service-worker.js` contained Markdown documentation, and several other root assets were similarly misnamed. Version 1.9.3 restores the intact v1.9.2 application baseline, changes only the application/cache version, retains the optional MSAL redirect bridge files, and adds a non-destructive `repair.html` cache reset page. State schema 7 and all data contracts are unchanged.

## Product purpose

The app coordinates Microsoft cloud study, Jion kata, and JKA 3rd Dan preparation around André’s available days:

- Monday–Thursday: no scheduled study or karate work.
- Friday night: Azure/Microsoft cloud study only.
- Saturday: flexible Azure, Jion kata, and 3rd Dan work.
- Sunday: flexible Azure, Jion kata, and 3rd Dan work.

Saturday and Sunday have no fixed clock time or required order. Each weekend date has one combined day plan containing three clearly separated required focus blocks.

## Scheduling invariants

1. Monday to Thursday generate recovery/unscheduled plans.
2. Friday generates Azure only.
3. Saturday and Sunday each show Azure, Jion kata, and 3rd Dan training.
4. Weekend blocks have no fixed start time and may be completed in any order.
5. Weekend completion records Azure practical evidence, kata correction/retention, and Dan 3 right/left ratings in one form.
6. Historical tasks are saved snapshots and are not rewritten.
7. Schema-7 migration replaces only unstarted future schedule records; completed or started records remain intact.
8. Missed Friday work reschedules to another Friday Azure day. Missed weekend work reschedules to another combined Saturday or Sunday.
9. The Weekly Plan remains a rolling seven-day view beginning on the current `Pacific/Auckland` date.

## Intensive programme model

The programme target is 30–42 months with a normal 10–14 hour weekly commitment:

- 8–11 technical hours;
- 2–3 German hours;
- 16-hour maximum normal week;
- three-hour maximum uninterrupted technical session;
- recovery week after 6–8 intensive weeks.

Certification sequence:

`AZ-104 → SC-300 → MD-102 → MS-102 → AZ-700 → Bicep and Terraform → Terraform Associate 004 → AZ-305 → SC-500`

Continuous skills:

PowerShell, Microsoft Graph, Azure CLI, Git, CI/CD, Exchange Online, SharePoint Online, Microsoft Teams, Linux fundamentals, and German to B2.

Each phase follows Foundation, Learn and Understand, Perform and Build, Test and Diagnose, and Exam and Retention. Short phases use integrated stage labels while preserving all five outcome types.

## State schema 7

Schema 7 retains the `intensiveProgramme` model and adds the Friday/weekend scheduling template:

- programme targets and sustainability limits;
- ten phase records;
- continuous-skill competency records;
- 42 monthly plans;
- five weekly goals per programme month;
- detailed weekly records indexed by Monday date;
- five specialised session records distributed across Friday, Saturday, and Sunday;
- a combined weekend task type that links Azure, Jion, and 3rd Dan evidence;
- German weekly record;
- quality and burnout ratings;
- warning, pace, recovery, forecast, and exam-readiness inputs;
- career milestones and final completion standards.

Migration uses `mergeDefaults()` and is additive. Existing schema-6 Azure modules, mastery stages, labs, karate records, roadmap, notes, weekly reviews, OneDrive state, and Supabase state remain valid. Past and progressed daily records are retained; only unstarted future schedule records are regenerated using the new template.

## Protected areas

Do not replace, remove, or redesign these unless André explicitly requests it:

1. Existing Supabase authentication functions and state contract in `app.js`.
2. `supabase-schema.sql`, the `user_app_state` table, and its RLS policies.
3. Microsoft authentication, MSAL runtime, and OneDrive app-folder integration.
4. OneDrive permission `Files.ReadWrite.AppFolder` and filename `karate-azure-progress-state.json`.
5. Existing local, OneDrive, and Supabase user data.
6. `js/microsoft-config.js` after production values are entered.
7. `js/config.js` if it exists in a deployed repository. This release does not contain it.
8. Existing authentication keys and browser-stored configuration.

Never add client secrets, passwords, service-role keys, access tokens, or refresh tokens to browser source code.

## Main files

- `index.html`: application shell, navigation, dialogs, and versioned asset references.
- `styles.css`: responsive dashboard, Azure, karate, roadmap, and intensive-programme styles.
- `app.js`: state, migration, scheduling, tasks, mastery, karate, intensive programme, reports, local backup, OneDrive, and Supabase.
- `service-worker.js`: offline cache.
- `manifest.webmanifest`: PWA metadata.
- `js/microsoft-config.js`: public SPA client ID, authority, and redirect URI only.
- `vendor/msal-browser.min.js`: pinned MSAL Browser runtime.
- `supabase-schema.sql`: protected Supabase table and RLS definition.
- `MICROSOFT-ONEDRIVE-SETUP.md`: Microsoft Entra setup.
- `INSTALLATION.md`: deployment/update guide.
- `tests/smoke-test.cjs`: state, migration, scheduling, rendering, mastery, and intensive-programme tests.
- `tests/onedrive-sync-test.cjs`: mocked OneDrive read/write/conflict tests.

## Current seeded Azure position

- Certification: AZ-104
- Module: Deploy Azure infrastructure by using JSON ARM templates
- Four of seven units complete
- Unit 5 next: Add parameters and outputs to an ARM template
- Preferred tool: PowerShell
- Learn and Perform partial
- Understand, Test, Review, and Retain not complete

Unit completion does not automatically equal mastery.

## Current seeded karate position

- Current kata: Jion
- Sequence known
- Grading readiness not demonstrated
- Embusen, stances, transitions, rhythm, timing, kime, speed/power, kiai, technical questions, and reliable grading performance remain separately assessed

Sequence knowledge does not equal grading readiness.

## Release validation

Before packaging a release:

1. Run JavaScript syntax checks.
2. Run smoke and OneDrive tests.
3. Verify Monday–Thursday are unscheduled, Friday is Azure only, and Saturday/Sunday each show Azure, Jion, and 3rd Dan blocks.
4. Verify one task per day and no fixed task times.
5. Verify schema-6 state migrates to schema 7 without data loss or rewriting progressed records.
6. Verify all 42 programme months, ten phases, five weekly sessions, monthly templates, and German records render.
7. Verify warning thresholds, recovery-week controls, forecast, and exam booking gate.
8. Verify AZ-104 and Jion seeded progress is unchanged.
9. Compare protected file hashes against the source release.
10. Check for embedded secrets.
11. Verify the service-worker cache and asset query strings are version 1.9.3.
12. Test ZIP integrity.
13. Test live Microsoft and Supabase login only in the deployed environment with valid credentials.
