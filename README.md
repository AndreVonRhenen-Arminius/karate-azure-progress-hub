# Karate & Azure Progress Hub — v1.7.0

An installable, offline-first Progressive Web App for AZ-104 study, JKA 3rd Dan preparation, kata learning and retention, notes, practical evidence, progress tracking, and optional Microsoft OneDrive or Supabase synchronisation.

## Version 1.7.0

This release adds Microsoft sign-in and OneDrive storage without replacing the existing Supabase system.

- Sign in with a Microsoft personal, work or school account supported by the Entra app registration.
- Store the complete app state in OneDrive's restricted application folder.
- Automatically synchronise local changes when OneDrive is the active provider.
- Compare local and remote `updatedAt` timestamps before replacing data.
- Manually pull OneDrive data to the device or push the device copy to OneDrive.
- Select Local only, Microsoft OneDrive or Supabase as the active sync provider.
- Continue working offline; queued local changes synchronise after reconnecting.
- Keep the existing Supabase authentication, schema and data contract unchanged.
- Preserve state schema version 4 and all existing study and karate records.

See `MICROSOFT-ONEDRIVE-SETUP.md` for the required Microsoft Entra app registration.

## Daily mastery programme

- One flexible main task per day with no fixed start time.
- Prominent Azure, kata and 3rd Dan grading priorities.
- Azure mastery levels, active recall, spaced reviews and lab journals.
- 3rd Dan technical ratings across both sides and core quality measures.
- Kata section learning and retention scheduling.
- Normal and minimum-week modes.

## Microsoft OneDrive storage

The app requests only the delegated Microsoft Graph permission:

`Files.ReadWrite.AppFolder`

OneDrive creates a dedicated folder for the application under the user's `Apps` folder. The progress file is:

`karate-azure-progress-state.json`

No Microsoft client secret is used or required in this browser-based single-page application. The application client ID is public configuration and can be entered in Settings or placed in `js/microsoft-config.js`.

## Updating an existing GitHub Pages installation

Upload the contents of this folder to the root of the existing repository and commit the replacements. Do not delete or overwrite any separate `js/config.js` file if one exists in the deployed repository.

After GitHub Pages redeploys:

1. Open the website and refresh it once.
2. Open **Settings → Microsoft OneDrive**.
3. Enter the Microsoft application client ID and exact SPA redirect URI.
4. Select **Microsoft OneDrive** as the active provider.
5. Choose **Sign in with Microsoft**.
6. Confirm the initial cloud copy is saved or loaded.

Installed PWAs normally update after being closed and reopened.

## Data compatibility

- Local storage key: `ka_progress_hub_state_v1`
- State schema: version 4
- OneDrive configuration key: `ka_progress_hub_microsoft_config_v1`
- Active cloud provider key: `ka_progress_hub_cloud_provider_v1`
- Existing Supabase configuration key: `ka_progress_hub_cloud_config_v1`
- Existing Supabase table: `user_app_state`

The OneDrive file contains the same additive application state used by local backups and Supabase. Existing Azure, syllabus, kata, daily, note and review data are preserved through `mergeDefaults()`.

## Local testing

On Windows, run `run-local.bat`, then open:

`http://localhost:8080/`

Add that exact URL as a Single-page application redirect URI in the Microsoft Entra app registration when testing Microsoft sign-in locally.

Static checks:

```text
node --check app.js
node --check service-worker.js
node tests/smoke-test.cjs
node tests/onedrive-sync-test.cjs
```

## Main files

- `PROJECT_CONTEXT.md` — architecture, state rules and protected areas
- `CHANGELOG.md` — release history
- `MICROSOFT-ONEDRIVE-SETUP.md` — Entra and OneDrive setup instructions
- `index.html` — application shell
- `app.js` — programme, mastery logic, state, Microsoft Graph and Supabase sync
- `js/microsoft-config.js` — public Microsoft SPA configuration
- `vendor/msal-browser.min.js` — pinned Microsoft MSAL Browser 5.17.0 runtime
- `vendor/MSAL-LICENSE.txt` — MSAL Browser licence
- `styles.css` — responsive interface
- `manifest.webmanifest` — PWA metadata
- `service-worker.js` — offline cache and update handling
- `supabase-schema.sql` — unchanged Supabase table and security policies
- `tests/smoke-test.cjs` — dependency-free state and rendering checks
- `tests/onedrive-sync-test.cjs` — mocked Microsoft Graph read/write and conflict checks
