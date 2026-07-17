# Project Context — Karate & Azure Progress Hub

## Current release

- Application version: **1.9.4**
- State schema: **8**
- Architecture: static HTML, CSS and JavaScript PWA
- Build step: none
- Primary timezone: `Pacific/Auckland`

## Product schedule

- Monday–Thursday: unscheduled/recovery.
- Friday: Azure/Microsoft cloud study only.
- Saturday: flexible Azure, Jion kata and 3rd Dan work.
- Sunday: flexible Azure, Jion kata and 3rd Dan work.
- Weekend work has no fixed time.
- Historical tasks remain saved against their original calendar dates.

## AZ-104 roadmap contract

The AZ-104 page must display these paths in this order:

1. Prerequisites for Azure administrators
2. Manage identities and governance in Azure
3. Implement and manage storage in Azure
4. Deploy and manage Azure compute resources
5. Configure and manage virtual networks
6. Monitor and back up Azure resources

The exact module order is defined in `DEFAULT_AZ_PATHS` in `app.js`.

Current seeded position:

- Prerequisites content completed:
  - Introduction to Azure Cloud Shell
  - Deploy Azure infrastructure by using JSON ARM templates
- Current path: Manage identities and governance in Azure
- Immediate next module: Understand Microsoft Entra ID
- Following module: Create, configure, and manage identities
- Remaining paths: not started unless later user evidence exists

Content completion and mastery remain separate. Each topic retains the six stages:

`Learn → Understand → Perform → Test → Review → Retain`

A module-level checkbox may complete all Microsoft Learn content units, but must not mark Understand, Perform, Test, Review or Retain complete.

When a module becomes content-complete, `setAzureFocusToNextIncomplete()` advances the current focus in catalogue order. `updateAzurePathStatus()` derives path status from module content.

## Schema 8 migration

Schema 8:

- installs the exact ordered module catalogue;
- marks the two prerequisite modules content-complete;
- moves the current focus to `az-identities-entra-overview`;
- retains the existing ARM module ID for compatibility;
- maps compatible legacy module names into the new catalogue;
- maps existing Azure lab module references where possible;
- removes obsolete placeholder modules from the active catalogue;
- preserves Azure mastery evidence, daily data, kata/Dan records, notes, roadmap, intensive programme, OneDrive state and Supabase state.

## Protected areas

Do not replace or redesign unless explicitly requested:

1. Supabase authentication functions and state contract in `app.js`.
2. `supabase-schema.sql`, `user_app_state` and RLS policies.
3. Microsoft authentication, MSAL and OneDrive app-folder integration.
4. OneDrive permission `Files.ReadWrite.AppFolder` and filename `karate-azure-progress-state.json`.
5. Existing local, OneDrive and Supabase data.
6. Production values in `js/microsoft-config.js`.
7. `js/config.js` if it exists in a deployed repository.

Never add client secrets, service-role keys, passwords or tokens to browser source.

## Main files

- `index.html`: application shell and versioned assets.
- `styles.css`: dashboard and tracker styles.
- `app.js`: state, migrations, scheduling, Azure/Karate logic and cloud integrations.
- `service-worker.js`: offline cache.
- `repair.html`: non-destructive service-worker/cache repair.
- `js/microsoft-config.js`: public Microsoft SPA configuration only.
- `supabase-schema.sql`: protected Supabase schema.
- `tests/smoke-test.cjs`: state, migration, order and rendering tests.
- `tests/file-integrity-test.cjs`: core file-content regression tests.
- `tests/onedrive-sync-test.cjs`: mocked OneDrive tests.

## Release validation

1. Run JavaScript syntax checks.
2. Run all three Node test files.
3. Confirm the six learning paths and every module are in the required order.
4. Confirm prerequisites show completed and Entra ID is current.
5. Confirm module checkboxes update content only and auto-advance.
6. Confirm schema-7 data migrates to schema 8 without removing unrelated records.
7. Confirm Friday/weekend scheduling remains unchanged.
8. Verify Microsoft configuration and Supabase schema hashes are unchanged.
9. Verify authentication and sync function bodies are unchanged.
10. Test ZIP integrity and a rendered browser load.
