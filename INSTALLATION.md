
## Configuration handling in this release

This ZIP already contains the exact valid cloud integration files from the latest uploaded project. Upload the complete extracted contents. Do not copy the old root-level `microsoft-config.js`; it was corrupt and is intentionally omitted. The app uses `js/microsoft-config.js`. Its client ID fields are blank in the uploaded project, so any Microsoft settings currently used by the app are stored in browser local storage unless you later enter them into that file. Do not clear site data.

# Install Karate & Azure Progress Hub v1.9.6

## Cause of the failure

The repository root `index.html` was the Support Operations Runbook page instead of the Progress Hub page. GitHub Pages therefore opened the wrong interface. The root app assets and cloud integrations were otherwise intact.

## Before uploading

1. Do not clear browser site data. Local-only progress may be stored there.
2. Export a JSON backup from the current app if the Progress Hub can still be opened from another device or URL.
3. Complete a OneDrive or Supabase sync where possible.
4. Preserve the deployed values in `js/microsoft-config.js`.
5. Preserve `js/config.js` if your repository contains it. The release does not create or replace that file.

## Upload to GitHub

1. Extract `karate-azure-progress-hub-v1.9.6.zip`.
2. Open the extracted `karate-azure-progress-hub-v1.9.6` folder.
3. Open the GitHub repository used by GitHub Pages.
4. Upload every file and folder from the extracted directory to the repository root.
5. Allow matching files to be replaced.
6. Confirm the root `index.html` title contains `Karate & Azure Progress Hub`, not `Support Operations Runbook`.
7. Confirm the Runbook remains under `Runbook/index.html`.
8. Reapply your Microsoft client ID and redirect URI to `js/microsoft-config.js` if required.
9. Commit with `Repair Progress Hub root page with v1.9.6`.
10. Wait for the GitHub Pages deployment to complete successfully.

## Clear only the old app cache

After deployment, open this address using your actual GitHub Pages path:

```text
https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/repair.html
```

The repair page unregisters the old service worker and deletes only caches beginning with `ka-progress-hub-`. It does not clear localStorage or stored progress.

## Validate the result

1. Open the normal GitHub Pages address.
2. Confirm the left navigation shows Today, Weekly Plan, Cloud Programme, AZ-104, 3rd Dan, Kata, Progress, Notes & Reviews, and Settings.
3. Open Settings and confirm App version 1.9.6 and State schema 8.
4. Confirm existing progress remains present.
5. Test OneDrive or Supabase synchronisation.
6. The Support Operations Runbook remains available at `/Runbook/`.

## Rollback

If deployment fails, restore the previous repository backup. Do not delete browser storage. The v1.9.6 update does not change the state schema or cloud database.
