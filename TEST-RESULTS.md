# Test Results — Karate & Azure Progress Hub v1.9.6

Date: 17 July 2026

## Fault confirmed

The uploaded repository root `index.html` was byte-for-byte identical to `Runbook/index.html`. It referenced `data.js` and the Runbook interface while the repository root contained the Progress Hub `app.js` and `styles.css`. This incompatible file combination caused GitHub Pages to display the Support Operations Runbook shell instead of the Progress Hub.

## Repair completed

- Restored the correct Progress Hub root `index.html`.
- Kept the user’s current Support Operations Runbook files under `Runbook/`.
- Advanced application and service-worker cache references from 1.9.4 to 1.9.6.
- Updated `repair.html` to reload v1.9.6.
- Added regression checks preventing the root page from being replaced by the Runbook page again.
- Left state schema 8 unchanged.

## Automated validation

| Check | Result |
|---|---|
| `node --check app.js` | Passed |
| `node --check service-worker.js` | Passed |
| File-integrity regression test | Passed |
| State and rendering smoke test | Passed |
| Mock OneDrive synchronisation test | Passed |
| Manifest JSON validation | Passed |
| Root Progress Hub / Runbook separation | Passed |
| All root and Runbook static assets returned HTTP 200 | Passed |
| ZIP integrity | Passed |

## Protected files verified unchanged

The following files are byte-for-byte unchanged from the uploaded repository:

- `js/microsoft-config.js`
- `supabase-schema.sql`
- `vendor/msal-browser.min.js`
- `vendor/msal-redirect-bridge.min.js`

The Progress Hub `app.js` logic is unchanged apart from the version constant changing from 1.9.4 to 1.9.6.

## Data compatibility

- State schema remains 8.
- Local browser progress remains compatible.
- Existing OneDrive backup data remains compatible.
- Existing Supabase data remains compatible.
- No database migration is required.

## Deployment validation still required

After upload to GitHub Pages, run `repair.html` once and confirm live Microsoft sign-in, OneDrive synchronisation, and Supabase synchronisation with the deployed credentials.
