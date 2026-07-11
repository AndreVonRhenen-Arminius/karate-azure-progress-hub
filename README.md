# Karate & Azure Progress Hub — v1.8.0

An installable, offline-first Progressive Web App for AZ-104 study, JKA 3rd Dan preparation, kata learning and retention, practical evidence, progress tracking, and optional Microsoft OneDrive or Supabase synchronisation.

## Version 1.8.0

This release adds an automatic daily task queue.

- Every date still contains only one flexible task.
- An unfinished task moves to the next day automatically.
- All later tasks shift forward in their original order.
- Example: an unfinished Saturday task becomes Sunday’s task, and Sunday’s planned task moves to Monday.
- A partially completed or explicitly not-completed task remains at the front of the queue.
- Selecting **Skipped — move on** advances the queue without counting the task as completed.
- Carried tasks show their original planned date on Today and Weekly Plan.
- Future dates are projected on the assumption that each shown future task will be completed that day.
- Existing history is not rearranged when upgrading from an earlier release. Rollover begins from the upgrade date.

## Daily mastery programme

- One flexible main task per day with no fixed start time.
- Automatic task rollover for missed or unfinished days.
- Prominent Azure, kata and 3rd Dan grading priorities.
- Azure mastery levels, active recall, spaced reviews and lab journals.
- 3rd Dan technical ratings across both sides and core quality measures.
- Kata section learning and retention scheduling.
- Normal and minimum-week modes.

## Microsoft OneDrive storage

Version 1.8.0 retains the Microsoft sign-in and OneDrive app-folder system from version 1.7.0.

The app requests only the delegated Microsoft Graph permission:

`Files.ReadWrite.AppFolder`

OneDrive creates a dedicated folder for the application under the user's `Apps` folder. The progress file is:

`karate-azure-progress-state.json`

No Microsoft client secret is used or required. The public Application client ID can be entered in Settings or placed in `js/microsoft-config.js`.

See `MICROSOFT-ONEDRIVE-SETUP.md` for the Entra registration steps.

## Updating an existing GitHub Pages installation

Upload the contents of this folder to the root of the existing repository and commit the replacements.

Do not delete or overwrite:

- an existing `js/config.js` file;
- configured values in `js/microsoft-config.js`;
- Supabase project configuration or authentication code;
- existing local, Supabase or OneDrive data.

After GitHub Pages redeploys:

1. Open the website and refresh it once.
2. Close and reopen an installed PWA if it still shows the previous version.
3. Open **Settings → Programme settings**.
4. Confirm **Automatic task rollover** is enabled.
5. Confirm the rollover start date.
6. Test one unfinished task and verify it appears on the following day.

## Data compatibility

- Local storage key: `ka_progress_hub_state_v1`
- State schema: version 5
- OneDrive configuration key: `ka_progress_hub_microsoft_config_v1`
- Active cloud provider key: `ka_progress_hub_cloud_provider_v1`
- Existing Supabase configuration key: `ka_progress_hub_cloud_config_v1`
- Existing Supabase table: `user_app_state`

State version 5 adds only rollover settings and task-assignment metadata. Existing Azure, syllabus, kata, daily, note, review and cloud records are preserved through `mergeDefaults()`.

## Rollover rules

A task advances when either condition is met:

- every checklist item is complete; or
- the result is **Completed**, **Completed with difficulty**, or **Skipped — move on**.

A task stays in the queue when its result is:

- Not recorded;
- Not completed — carry over; or
- Partially completed — carry over.

Recovery tasks in minimum mode do not permanently block the queue.

## Local testing

On Windows, run `run-local.bat`, then open:

`http://localhost:8080/`

Static checks:

```text
node --check app.js
node --check service-worker.js
node tests/smoke-test.cjs
node tests/onedrive-sync-test.cjs
```

## Main files

- `PROJECT_CONTEXT.md` — architecture, migration and protected areas
- `CHANGELOG.md` — release history
- `MICROSOFT-ONEDRIVE-SETUP.md` — Entra and OneDrive setup instructions
- `index.html` — application shell
- `app.js` — programme, rollover queue, mastery logic and cloud synchronisation
- `js/microsoft-config.js` — public Microsoft SPA configuration
- `vendor/msal-browser.min.js` — pinned Microsoft MSAL Browser runtime
- `styles.css` — responsive interface
- `manifest.webmanifest` — PWA metadata
- `service-worker.js` — offline cache and update handling
- `supabase-schema.sql` — unchanged Supabase table and security policies
- `tests/smoke-test.cjs` — state, rollover and rendering checks
- `tests/onedrive-sync-test.cjs` — mocked Microsoft Graph read/write checks
