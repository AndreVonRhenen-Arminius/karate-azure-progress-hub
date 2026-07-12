# Karate & Azure Progress Hub — v1.9.1

An offline-first Progressive Web App for two coordinated goals:

1. JKA kata and 3rd Dan training on Tuesday, Thursday, and Saturday.
2. An intensive 30–42 month Microsoft cloud career programme on Monday, Wednesday, Friday, and Sunday.

The app retains one main task per day, local-first data storage, Microsoft login and OneDrive backup, Supabase synchronisation, AZ-104 mastery records, Jion and grading records, evidence, history, and monthly/weekly progress reporting.

## Rolling seven-day plan

The Weekly Plan opens on the current New Zealand date and shows that date plus the next six days. The displayed dates roll forward automatically when the `Pacific/Auckland` date changes, including when the app remains open across midnight. Previous and future seven-day ranges can still be reviewed manually, and **Start today** returns the planner to the live rolling range. Progress remains stored against the actual calendar date.

## Fixed weekly programme

| Day | Main focus |
|---|---|
| Monday | Microsoft Cloud Study — Learn and Understand |
| Tuesday | Post-class Jion and 3rd Dan training |
| Wednesday | Microsoft Cloud Study — Guided Lab |
| Thursday | Post-class Jion and 3rd Dan training |
| Friday | Microsoft Cloud Study — Independent Lab |
| Saturday | Dedicated Jion and 3rd Dan training |
| Sunday | Microsoft Cloud Study — Test, Review, Portfolio and Automation |

No fixed clock times are displayed. Each day contains one main objective, an estimated duration, checklist, evidence, confidence, and result.

## Intensive Microsoft cloud programme

### Target

- Completion range: 30–42 months.
- Normal target: 10–14 total hours per week.
- Technical target: 8–11 hours per week.
- German target: 2–3 hours per week.
- Maximum normal workload: 16 total hours per week.
- Maximum uninterrupted technical session: 3 hours.
- Recovery week: after 6–8 intensive weeks.

### Certification sequence

`AZ-104 → SC-300 → MD-102 → MS-102 → AZ-700 → Bicep and Terraform → Terraform Associate 004 → AZ-305 → SC-500`

### Continuous skills

PowerShell, Microsoft Graph, Azure CLI, Git, CI/CD, Exchange Online, SharePoint Online, Microsoft Teams, Linux fundamentals, and German to B2.

### Five-stage phase model

1. Foundation
2. Learn and Understand
3. Perform and Build
4. Test and Diagnose
5. Exam and Retention

Each phase records progress, objectives, exam date, required labs, independent performance, weak areas, practice scores, portfolio completion, retention, and exam result.

### Weekly records

The Cloud Programme view includes five connected sessions across four technical days:

- Learn and Understand
- Guided Lab
- Independent Lab
- Test and Review
- Portfolio and Automation

Each session stores its relevant modules, documentation, terminology, lab resources, possible cost, commands, errors, troubleshooting, validation, cleanup, scores, evidence, confidence, and duration.

German is tracked separately by level, days studied, vocabulary, grammar, listening, speaking, reading, writing, technical topic, and total time.

### Monthly and 42-month roadmap

Every month contains:

- knowledge goals;
- 4–8 lab target;
- at least two independent repetitions;
- at least two assessed sessions;
- top-three weak-area improvement;
- one portfolio milestone;
- one relevant automation/deployment improvement;
- 8–12 German hours;
- five expandable weekly plans;
- a monthly review.

The completion forecast recalculates from weighted phase progress and recorded weekly history.

### Quality controls

The app monitors:

- two low-technical-hour weeks;
- two weeks without a lab;
- three weeks without an assessment;
- three weeks of increasing weak areas;
- two weeks below 90 German minutes;
- two low-energy weeks;
- weeks over 16 hours;
- sessions over three hours.

Energy, concentration, enjoyment, sleep impact, family impact, confidence, stress, and rushed-lab behaviour are rated from 1–5. A 25% reduced next week can be created when capacity is low.

### Exam booking gate

A phase is not ready to book based only on its target date. The gate requires:

- all major objectives studied;
- at least 80% of required labs complete;
- important tasks performed independently;
- no critical weak areas;
- three recent scores of at least 80%;
- portfolio substantially complete;
- delayed retention check passed.

## Existing progress retained

- AZ-104 ARM-template module remains at Unit 5 of 7.
- Azure content completion and six-stage mastery remain separate.
- Jion sequence remains known but not automatically grading-ready.
- Kihon, Kata, and Kumite evidence and right/left ratings remain available.
- Existing daily history, notes, labs, reviews, cloud data, and settings are retained through an additive migration.

## Cloud storage

Available providers remain:

- Local device only
- Microsoft OneDrive app folder
- Supabase

OneDrive permission remains `Files.ReadWrite.AppFolder` and the state file remains `karate-azure-progress-state.json`.

## Data compatibility

- Local state key: `ka_progress_hub_state_v1`
- State schema: version 6
- Microsoft configuration key: `ka_progress_hub_microsoft_config_v1`
- Active provider key: `ka_progress_hub_cloud_provider_v1`
- Supabase configuration key: `ka_progress_hub_cloud_config_v1`
- Supabase table: `user_app_state`

Schema 6 is additive. It adds the intensive programme while retaining existing version-5 data and unknown custom entries.

## Installation

Read `INSTALLATION.md` before replacing the deployed files. Export a JSON backup and preserve any production `js/config.js` and configured `js/microsoft-config.js` first.

## Local test

Run `run-local.bat`, then open `http://localhost:8080/`.

Validation commands:

```text
node --check app.js
node --check service-worker.js
node tests/smoke-test.cjs
node tests/onedrive-sync-test.cjs
```
