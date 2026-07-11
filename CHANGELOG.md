# Changelog

All notable changes to Karate & Azure Progress Hub are recorded here.

## [1.8.0] — 2026-07-12

### Added

- Editable alternating Azure, karate, rest, Azure-review, and karate-review day types.
- One prominent main task per day with start, checklist, evidence, completion, missed, and reschedule actions.
- Category-safe missed-task rescheduling that never creates a second task on a date.
- Current Azure, Jion, and 3rd Dan grading-focus cards.
- Six-stage Azure mastery records with date, evidence, notes, confidence, and review date.
- Expandable AZ-104 paths, modules, units, practical evidence, and separate content/mastery percentages.
- Current ARM-template progress at Unit 5 of 7 with PowerShell evidence requirements.
- Full 3rd Dan Kihon, Kata, and Kumite tracking with separate right/left ratings.
- Jion grading-readiness checklist that separates sequence knowledge from technical readiness.
- Expandable six-month roadmap with monthly goals, weekly goals, evidence, and completion status.
- Progress report with completed, partial, outstanding, current-focus, and on-track indicators.
- Azure and karate completion forms and a dedicated rescheduling dialog.
- `INSTALLATION.md` for updating local and GitHub Pages installations.

### Changed

- State schema increased from version 4 to version 5 using an additive migration.
- Weekly Plan now edits day focus types rather than showing a fixed programme.
- Today and Progress layouts prioritise evidence-based progress and future goals.
- PWA assets and cache references updated to version 1.8.0.

### Preserved

- Existing Supabase authentication and `user_app_state` contract.
- Microsoft login, restricted OneDrive app-folder permission, and backup filename.
- Existing local and cloud progress records.
- Existing `supabase-schema.sql` and `js/microsoft-config.js` files.

## [1.7.0] — 2026-07-11

### Added

- Microsoft sign-in using MSAL Browser for a static single-page application.
- Microsoft Graph OneDrive app-folder storage using `Files.ReadWrite.AppFolder`.
- Automatic OneDrive synchronisation with local/remote timestamp comparison.
- Manual OneDrive pull, push and sync controls.
- Active cloud-provider selection: Local only, Microsoft OneDrive or Supabase.
- Public deployment configuration in `js/microsoft-config.js`.
- Pinned official MSAL Browser 5.17.0 runtime and licence in `vendor/`.
- Microsoft Entra and OneDrive setup guide.
- Provider-specific account badge and synchronisation status.

### Preserved

- Existing Supabase email/password authentication behaviour and database contract.
- Existing `supabase-schema.sql` contents and row-level security policies.
- Existing local storage key, state schema version 4 and progress records.
- Offline-first operation and JSON backup/import compatibility.

### Changed

- PWA cache and asset references updated to version 1.7.0.
- Settings reorganised to show the active cloud provider and separate OneDrive and Supabase controls.
- Network reconnect, visibility and periodic sync actions now follow the selected cloud provider.

## [1.6.0] — 2026-07-11

### Added

- Adaptive priority engine for Azure topics, 3rd Dan grading sections and kata.
- Prominent Today panels for the current kata and grading focus.
- Azure mastery levels from introduced through exam ready.
- Learned, recalled, practised, troubleshot and verified evidence per Azure topic.
- Active-recall questions, custom questions, result history and automatic next-review dates.
- Structured Azure lab journal with objective, configuration, failure, diagnosis, result, cleanup and commands.
- 3rd Dan quality ratings for stance, balance, hip movement, technique path, timing, speed and power, breathing, and both sides.
- Kata section tracking for sequence, embusen, kiai, rhythm, power and relaxation, and bunkai.
- Kata retention actions that extend or shorten review intervals based on performance.
- Adaptive focus summaries in the Weekly Plan.

### Changed

- Removed fixed task start and finish times from the active programme and settings.
- Replaced multiple daily blocks with one main task for every normal and minimum day.
- Reframed daily recommendations as guidance inside the single task rather than additional tasks.
- Progress reporting now separates completion, mastery, practical evidence and retention.
- State schema increased from version 3 to 4 with additive migration.
- PWA cache and asset references updated to version 1.6.0.

### Fixed

- Connected all new mastery controls to saved state and cloud synchronisation.
- Removed a duplicated 3rd Dan summary section from the development branch.
- Added responsive styling for mastery, recall, assessment and retention controls.
- Corrected the duplicated date/time CSS selector.

### Compatibility

- Existing Supabase authentication functions and `user_app_state` synchronisation remain unchanged.
- `supabase-schema.sql` remains unchanged.
- Existing local storage, JSON backups and cloud data remain compatible.
- No `js/config.js` existed in this archive; none was created or replaced.

## [1.4.0] — 2026-07-11

### Added

- Previous, Today and Next controls for reviewing or recording any daily session.
- Previous, current and next week navigation in Weekly Plan.
- Open-day actions from the Weekly Plan.
- Per-day normal/minimum programme mode storage through state schema version 3.
- `PROJECT_CONTEXT.md` for architecture, protected areas and continuation guidance.
- Dependency-free Node smoke tests for state migration, historical mode stability and kata grouping.
- Consistent dark styling for date and time inputs.
- Accessible labels for timer, sync and dialog-close icon buttons.

### Changed

- Weekly Plan now shows the saved mode and completion for each date.
- Historical completion remains stable when the default programme mode changes.
- Completed planned kata now appear in sequence-known and retention rather than planned kata.
- Focus timer calculations now use a target timestamp to reduce browser-throttling drift.
- Text-area autosave now uses separate debounce timers for each field.
- Backup object URLs are revoked after a short delay for better browser reliability.
- General notes reject whitespace-only submissions.
- PWA cache and asset references updated to version 1.4.0.

### Fixed

- Viewing weekly or progress screens no longer creates unsaved empty daily records.
- Weekly pre-start text now uses the configured programme start date instead of a hard-coded date.
- Existing daily completion no longer changes when switching between normal and minimum defaults.
- Planned kata marked complete no longer remain incorrectly under Planned kata.

### Compatibility

- Existing local storage, backups, Supabase authentication and `user_app_state` data remain compatible.
- No changes were made to `supabase-schema.sql` or the Supabase authentication functions.
- This archive contains no `js/config.js`; none was created or replaced.

## [1.3.1] — 2026-07-11

### Fixed

- Versioned asset URLs and network-first app loading reduce stale PWA cache problems.

## [1.3.0] — 2026-07-11

### Changed

- Replaced the evening schedule with the morning programme.
- Set the programme start date to Saturday 11 July 2026.
- Preserved existing study, syllabus, kata, note and review data during migration.
