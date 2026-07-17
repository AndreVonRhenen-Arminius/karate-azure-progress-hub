# Repair and Install Karate & Azure Progress Hub v1.9.3

This release repairs the corrupted deployment that displayed minified Microsoft authentication code instead of the app. The repair does not change state schema 7, the study schedule, Supabase authentication, Microsoft login, OneDrive backup, or stored progress.

## 1. Protect your data and configuration

1. Do not clear browser site data.
2. If the app can still be opened on another device, export a JSON backup from **Settings → Backup and restore**.
3. Confirm the latest OneDrive or Supabase sync where possible.
4. Download a ZIP backup of the current GitHub repository.
5. Copy your deployed `js/microsoft-config.js` if it contains a Microsoft client ID or redirect URI.
6. Preserve `js/config.js` if your repository contains it. This release does not include or replace that file.

## 2. Extract the repaired release

1. Download `karate-azure-progress-hub-v1.9.3.zip`.
2. Right-click the ZIP and select **Extract All**.
3. Open the extracted `karate-azure-progress-hub-v1.9.3` folder.
4. Confirm the root contains `index.html`, `app.js`, `styles.css`, `service-worker.js`, `repair.html`, `manifest.webmanifest`, `js`, `vendor`, and `tests`.

## 3. Preserve production configuration

1. Compare the extracted `js/microsoft-config.js` with your deployed copy.
2. Keep your existing public client ID, authority, and redirect URI values.
3. Do not add a Microsoft client secret.
4. Leave any separate `js/config.js` in the repository unchanged.
5. Do not change your Supabase URL, publishable key, authentication configuration, table, or RLS policies.

## 4. Replace the corrupted GitHub files

1. Open the GitHub repository that hosts the app.
2. Open the repository root.
3. Select **Add file → Upload files**.
4. Upload every file and folder from the extracted v1.9.3 folder.
5. Allow matching files to be replaced.
6. Confirm `js/microsoft-config.js` still contains your production values.
7. Confirm any separate `js/config.js` remains in the repository.
8. Commit with: `Repair Progress Hub deployment with v1.9.3`.

The critical correction is that GitHub must receive the repaired `index.html`. It should begin with `<!doctype html>`, not `/*! @azure/msal-browser`.

## 5. Wait for GitHub Pages

1. Open the repository **Actions** tab.
2. Wait for the Pages deployment to complete successfully.
3. Open **Settings → Pages** and confirm the correct branch and root folder are still selected.

## 6. Run the non-destructive cache repair

After GitHub Pages has completed, open this address in the same browser that showed the corrupted page:

```text
https://YOUR-GITHUB-NAME.github.io/YOUR-REPOSITORY/repair.html
```

The repair page will:

- unregister old Progress Hub service workers;
- delete only caches whose names begin with `ka-progress-hub-`;
- preserve localStorage and existing local progress;
- return to the main app automatically.

Do not use the browser's **Clear site data** option unless you have already exported a backup, because that can delete local-only progress and locally saved Microsoft configuration.

## 7. Confirm the repair

1. The app should display its normal dashboard rather than JavaScript text.
2. Open **Settings**.
3. Confirm **App version 1.9.3** and **State schema 7**.
4. Open **Weekly Plan** and confirm:
   - Monday–Thursday: unscheduled/recovery;
   - Friday: Azure only;
   - Saturday: Azure, Jion kata, and 3rd Dan;
   - Sunday: Azure, Jion kata, and 3rd Dan.
5. Confirm Saturday and Sunday have no fixed scheduled time.
6. Check that previous progress, notes, Azure records, Jion records, and Dan 3 ratings are present.

## 8. Confirm cloud synchronisation

### OneDrive

1. Open **Settings → Cloud synchronisation**.
2. Confirm Microsoft OneDrive is selected and the expected Microsoft account is shown.
3. Select **Sync OneDrive now**.
4. Confirm the sync succeeds.

### Supabase

1. Confirm the existing project URL and publishable key remain configured.
2. Sign in using the existing account.
3. Complete a normal sync.

No Supabase database migration is required.

## 9. Optional local validation

1. Double-click `run-local.bat`.
2. Open `http://localhost:8080/`.
3. Confirm the dashboard loads normally.
4. Do not open `index.html` directly because Microsoft login and PWA behaviour require HTTP or HTTPS.

## Rollback

If the repaired release does not load:

1. Restore the repository backup or previous working branch.
2. Restore the saved production `js/microsoft-config.js` and any separate `js/config.js`.
3. Import the JSON backup only if local progress is missing.
4. Do not use **Push this device to OneDrive** until you have confirmed which copy is newer.
