# Install or Update Karate & Azure Progress Hub v1.9.0

These instructions update an existing GitHub Pages installation without replacing Microsoft login, OneDrive backup, Supabase configuration, or saved progress.

## Part 1 — Create a safe backup

1. Open the current live app.
2. Open **Settings**.
3. Under **Backup and restore**, select **Export backup**.
4. Save the JSON file somewhere safe.
5. Check the current cloud provider.
6. If using OneDrive, select **Sync OneDrive now** and confirm success.
7. If using Supabase, sign in and complete a normal sync.
8. Download a ZIP of the current GitHub repository or create a backup branch.
9. Copy your current `js/microsoft-config.js` if it contains your Microsoft client ID and redirect URI.
10. Preserve `js/config.js` if your repository contains one. The release ZIP does not include that file.

## Part 2 — Extract the update

1. Download `karate-azure-progress-hub-v1.9.0.zip`.
2. Right-click it and select **Extract All**.
3. Open the extracted `karate-azure-progress-hub-v1.9.0` folder.
4. Confirm it contains `index.html`, `app.js`, `styles.css`, `service-worker.js`, `js`, `vendor`, and `tests`.

## Part 3 — Preserve production configuration

Before uploading:

1. Open the extracted `js/microsoft-config.js`.
2. Compare it with your deployed copy.
3. Keep your existing production client ID, authority, and exact redirect URI.
4. Do not add a Microsoft client secret.
5. If your repository has `js/config.js`, leave that file in the repository and do not overwrite it.
6. Do not alter your Supabase URL, publishable key, authentication settings, table, or RLS policies.

## Part 4 — Optional local test

1. Double-click `run-local.bat`.
2. Open `http://localhost:8080/`.
3. Do not double-click `index.html`; Microsoft login and PWA behaviour require HTTP or HTTPS.
4. Check that the app displays version **1.9.0** and schema **6** in Settings.
5. Confirm the weekly plan shows:
   - Monday: Microsoft Cloud Study
   - Tuesday: Karate
   - Wednesday: Microsoft Cloud Study
   - Thursday: Karate
   - Friday: Microsoft Cloud Study
   - Saturday: Karate
   - Sunday: Microsoft Cloud Study
6. Open **Cloud Programme** and confirm the intensive roadmap appears.

For local Microsoft login, `http://localhost:8080/` must already be registered as a Single-page application redirect URI in Microsoft Entra.

## Part 5 — Upload to GitHub

1. Open the GitHub repository that hosts the app.
2. Open the repository root.
3. Select **Add file → Upload files**.
4. Drag in all files and folders from the extracted v1.9.0 folder.
5. Allow GitHub to replace files with matching names.
6. Confirm your configured `js/microsoft-config.js` values are still present.
7. Confirm any separate `js/config.js` is still present.
8. Commit with a message such as:

   `Update Karate and Cloud Progress Hub to v1.9.0`

## Part 6 — Confirm deployment

1. Open the repository **Actions** tab.
2. Wait for the GitHub Pages deployment to complete successfully.
3. Open **Settings → Pages**.
4. Confirm the correct branch and root folder are still selected.
5. Open the live app URL.

## Part 7 — Refresh the installed PWA

1. Close every browser tab and installed app window for this app.
2. Reopen the live website in a browser.
3. On Windows, press `Ctrl + F5` once.
4. Close the browser tab.
5. Reopen the installed PWA.
6. Open **Settings** and confirm:

   `App version 1.9.0 · State schema 6`

Do not clear browser site data. Schema 6 migrates the saved state automatically.

## Part 8 — Confirm existing data

Check that these remain present:

1. Previous daily history and evidence.
2. AZ-104 learning paths, units, mastery stages, labs, scores, and reviews.
3. ARM-template progress at Unit 5 of 7.
4. Jion, Kihon, Kata, Kumite, right/left ratings, and instructor notes.
5. Notes and weekly reviews.
6. Microsoft or Supabase account settings.
7. Existing monthly/weekly roadmap records.

If data appears missing, do not immediately create replacement records. Check the active cloud provider and compare local/cloud timestamps first.

## Part 9 — Confirm the new weekly schedule

1. Open **Weekly Plan**.
2. Confirm Monday, Wednesday, Friday, and Sunday are Microsoft cloud study days.
3. Confirm Tuesday and Thursday show post-class Jion and 3rd Dan training.
4. Confirm Saturday shows dedicated Jion and 3rd Dan training.
5. Confirm each date shows only one main task.
6. Confirm no fixed clock time appears.

Date-specific overrides remain possible, but replacing a date that already has progress requires confirmation.

## Part 10 — Configure the intensive programme

1. Open **Cloud Programme**.
2. Confirm AZ-104 is the active phase.
3. Review the weekly workload standard.
4. Open the current weekly record.
5. Set the current phase stage and target progress.
6. Enter this week’s five connected session objectives.
7. Set technical and German targets.
8. Record German on at least five days.
9. Open the current month in the 42-month roadmap.
10. Fill in its detailed knowledge, lab, assessment, portfolio/automation, and German plan.
11. Enter evidence before marking monthly goals complete.

## Part 11 — Use recovery and pace controls

1. Record weekly energy, concentration, sleep impact, family impact, confidence, stress, and whether labs were rushed.
2. When the dashboard recommends a lower workload, select **Apply a 25% reduced target next week**.
3. After 6–8 intensive weeks, select **Schedule next week as recovery**.
4. A recovery week sets a six-hour technical target, keeps German active, and prioritises review, one weak lab, documentation, and planning.

## Part 12 — Confirm OneDrive

1. Open **Settings → Cloud synchronisation**.
2. Confirm **Microsoft OneDrive** remains selected if it is your chosen provider.
3. Confirm your Microsoft account is displayed.
4. Select **Sync OneDrive now**.
5. Confirm success.
6. Check that the OneDrive app-folder file remains `karate-azure-progress-state.json`.

Use force pull or force push only when you know which copy should replace the other.

## Part 13 — Confirm Supabase

If using Supabase:

1. Open **Settings → Supabase**.
2. Confirm the existing project URL and publishable key remain configured.
3. Sign in using the existing account.
4. Run a normal sync.
5. Confirm cloud data loads.

No database migration or change to `supabase-schema.sql` is required.

## Troubleshooting

### Old version still appears

1. Close all app windows.
2. Open the website in the browser.
3. Press `Ctrl + F5`.
4. Reopen the installed app.
5. Confirm `service-worker.js` uses cache `ka-progress-hub-v1.9.0`.

### Microsoft redirect error

Confirm these are identical, including the trailing slash:

- live browser URL;
- SPA redirect URI in Microsoft Entra;
- redirect URI in `js/microsoft-config.js` or app Settings.

### Progress appears missing

1. Stop entering new data.
2. Check the active provider.
3. Sign in to the same account used previously.
4. Compare local and cloud update timestamps.
5. Use the exported JSON backup only after confirming it is the correct copy.

### A task appears on the wrong day

Open **Weekly Plan** and change the date’s focus type. The app will warn before replacing recorded progress.
