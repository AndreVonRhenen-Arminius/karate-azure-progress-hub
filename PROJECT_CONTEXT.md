# Project Context — Karate & Azure Progress Hub

## Current release

- Application version: **1.9.0**
- State schema: **6**
- Architecture: static HTML, CSS, and JavaScript PWA
- Build step: none
- Primary timezone: Pacific/Auckland

## Product purpose

The app coordinates two programmes without placing Azure/Microsoft cloud and karate as main tasks on the same day:

- Microsoft cloud study: Monday, Wednesday, Friday, Sunday.
- Jion and JKA 3rd Dan training: Tuesday, Thursday, Saturday.

Tuesday and Thursday are post-karate-class Jion/Dan 3 sessions. Saturday is a dedicated Jion/Dan 3 session.

## Scheduling invariants

1. One date has exactly one main task.
2. No fixed clock time is shown.
3. Monday, Wednesday, Friday, and Sunday generate Microsoft cloud tasks.
4. Tuesday, Thursday, and Saturday generate karate tasks.
5. A short supporting skill and German activity may be embedded inside a cloud task; they do not become separate main tasks.
6. Missed work is rescheduled to the next compatible day and never stacked onto an occupied date.
7. Historical tasks are saved snapshots and are not rewritten when future priorities change.
8. The programme remains editable through weekday defaults and date-specific overrides, but existing progress requires confirmation before replacement.

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

## State schema 6

Schema 6 adds `intensiveProgramme`:

- programme targets and sustainability limits;
- ten phase records;
- continuous-skill competency records;
- 42 monthly plans;
- five weekly goals per programme month;
- detailed weekly records indexed by Monday date;
- five specialised session records;
- German weekly record;
- quality and burnout ratings;
- warning, pace, recovery, forecast, and exam-readiness inputs;
- career milestones and final completion standards.

Migration uses `mergeDefaults()` and is additive. Existing version-5 daily records, Azure modules, mastery stages, labs, karate records, roadmap, notes, weekly reviews, OneDrive state, and Supabase state remain valid.

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
3. Verify the Monday/Wednesday/Friday/Sunday study schedule and Tuesday/Thursday/Saturday karate schedule.
4. Verify one task per day and no fixed task times.
5. Verify schema-5 state migrates to schema 6 without data loss.
6. Verify all 42 programme months, ten phases, five weekly sessions, monthly templates, and German records render.
7. Verify warning thresholds, recovery-week controls, forecast, and exam booking gate.
8. Verify AZ-104 and Jion seeded progress is unchanged.
9. Compare protected file hashes against the source release.
10. Check for embedded secrets.
11. Verify the service-worker cache and asset query strings are version 1.9.0.
12. Test ZIP integrity.
13. Test live Microsoft and Supabase login only in the deployed environment with valid credentials.
