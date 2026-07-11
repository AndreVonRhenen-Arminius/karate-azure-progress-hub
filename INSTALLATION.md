# Install or Update Karate & Azure Progress Hub v1.8.0

These instructions assume the app is hosted with GitHub Pages. They also cover local Windows testing.

## Before updating

1. Open the existing app.
2. Go to **Settings → Backup and restore**.
3. Select **Export backup** and keep the JSON file.
4. Check the active cloud provider and confirm the latest sync completed.
5. Make a copy of the current GitHub repository or download its current ZIP.
6. If your repository contains a configured `js/microsoft-config.js`, keep a copy of it.
7. If your repository contains `js/config.js`, do not replace or delete it.

## Install the update on GitHub Pages

1. Download and extract `karate-azure-progress-hub-v1.8.0.zip`.
2. Open the extracted `karate-azure-progress-hub-v1.8.0` folder.
3. Open your app repository on GitHub.
4. Upload the new project files to the repository root, replacing files with the same names.
5. Preserve your existing Microsoft values:
   - compare the new `js/microsoft-config.js` with your deployed copy;
   - keep your existing client ID and redirect URI if already configured.
6. Preserve any separate `js/config.js` from your repository. The release ZIP does not include that file.
7. Commit the files with a message such as:

   `Update Progress Hub to v1.8.0`

8. Open **Repository Settings → Pages** and confirm GitHub Pages still deploys from the intended branch and root folder.
9. Wait for the GitHub Actions/Pages deployment to show as successful.
10. Open the live app URL.

## Refresh the installed PWA

1. Close every open app tab and installed PWA window.
2. Reopen the website in the browser.
3. Press `Ctrl + F5` once on Windows to force an asset refresh.
4. Close and reopen the installed PWA again.
5. Open **Settings** and confirm it shows:

   `App version 1.8.0 · State schema 5`

The old app data should migrate automatically. Do not clear site data.

## Confirm your data

1. Open **Today** and confirm one main task is shown.
2. Open **Weekly Plan** and confirm each date has one editable focus type.
3. Open **AZ-104** and confirm:
   - current module is the ARM-template module;
   - 4 of 7 units are complete;
   - Unit 5 is next;
   - content completion and mastery are separate.
4. Open **Kata** and confirm Jion shows:
   - sequence known;
   - grading readiness not automatically complete;
   - all technical checks available.
5. Open **Progress** and expand the current month and week.
6. Confirm existing notes, labs, daily history, kata progress, and reviews are present.

## Confirm Microsoft OneDrive

1. Open **Settings → Cloud synchronisation**.
2. Confirm **Microsoft OneDrive** is still selected if that is your preferred provider.
3. Confirm the Microsoft account is signed in.
4. Select **Sync OneDrive now**.
5. Check that the sync status reports success.
6. Do not use force pull or force push unless you know which copy is authoritative.

If the Microsoft client ID is missing, follow `MICROSOFT-ONEDRIVE-SETUP.md` and enter the same client ID and exact GitHub Pages redirect URI used previously.

## Confirm Supabase

If Supabase is your active provider:

1. Open **Settings → Supabase**.
2. Confirm the existing project URL and publishable/anon key remain configured.
3. Sign in using the existing account.
4. Run a normal sync.
5. Confirm existing cloud data loads before making major changes.

No change to `supabase-schema.sql` is required.

## Local Windows test

1. Extract the ZIP.
2. Double-click `run-local.bat`.
3. Open `http://localhost:8080/`.
4. Do not open `index.html` directly from File Explorer because Microsoft authentication and PWA behaviour require HTTP or HTTPS.
5. For local Microsoft login, ensure `http://localhost:8080/` is registered as a Single-page application redirect URI in Microsoft Entra.

## First-use setup in v1.8.0

1. Open **Settings → Alternating programme settings**.
2. Choose the default type for each weekday.
3. Select **Save programme settings**.
4. Open **Weekly Plan** to make date-specific changes.
5. Open **Progress** and expand the current month.
6. Review the monthly goals and the current weekly goals.
7. Tick a roadmap goal only after adding appropriate evidence.

## Troubleshooting

### The old interface still appears

- Close all app windows.
- Open the website in the browser and use `Ctrl + F5`.
- Remove only the installed PWA shortcut/app, not the browser site data, then reinstall from the refreshed website.
- Confirm `service-worker.js` contains cache version `ka-progress-hub-v1.8.0`.

### Progress appears missing

- Do not create new records immediately.
- Check the active cloud provider.
- Use the JSON backup exported before the update if needed.
- With OneDrive, compare local and remote timestamps before using force pull/push.
- With Supabase, sign in and run a normal pull/sync.

### Microsoft redirect error

Make sure these are identical, including the trailing slash:

- the live browser URL;
- the SPA redirect URI in Microsoft Entra;
- the redirect URI in app Settings or `js/microsoft-config.js`.

### A day has the wrong task type

Open **Weekly Plan** and change that date’s focus type. If the day already contains progress, the app asks before replacing that day’s saved task.
