# Release Validation — v1.9.4

## Passed

- `node --check app.js`
- `node --check service-worker.js`
- `node tests/smoke-test.cjs`
- `node tests/file-integrity-test.cjs`
- `node tests/onedrive-sync-test.cjs`
- Manifest JSON validation
- Six-path AZ-104 order validation
- Exact module-order validation
- Prerequisite completion validation
- Current Entra ID focus validation
- Schema 7-to-8 migration validation
- Legacy Azure lab-reference mapping validation
- Daily history and karate-data preservation validation
- Friday/weekend schedule validation
- OneDrive mocked read/write/conflict validation
- Core file-content integrity validation
- ZIP integrity validation

## Protected components verified unchanged

- `supabase-schema.sql`
- `js/microsoft-config.js`
- bundled MSAL files
- Supabase authentication and sync function bodies
- Microsoft authentication and OneDrive sync function bodies

## Not tested live

Live Microsoft sign-in, OneDrive Graph access and Supabase login require the deployed application credentials and user accounts. Confirm these after deployment.
