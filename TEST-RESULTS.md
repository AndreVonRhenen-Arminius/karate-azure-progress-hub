# Release Validation — v1.9.1

## Passed

- `node --check app.js`
- `node --check service-worker.js`
- `node tests/smoke-test.cjs`
- `node tests/onedrive-sync-test.cjs`
- Schema 5 → 6 additive migration
- Existing custom daily, note, kata, Azure, roadmap and cloud-compatible data preservation
- Monday/Wednesday/Friday/Sunday Microsoft cloud schedule
- Tuesday/Thursday/Saturday Jion and Dan 3 schedule
- One main task per day and no fixed task times
- Rolling seven-day planner begins on its selected start date and produces seven consecutive calendar dates
- Weekly Plan uses today plus the next six days by default and supports automatic New Zealand date rollover
- AZ-104 ARM Unit 5 starting position
- Jion sequence/readiness separation
- Six Azure mastery stages
- Forty-two programme months and ten phases
- Five specialised weekly session records
- German, quality, warnings, recovery and exam-booking rules
- OneDrive mocked read, write, first-use, forced pull and push behaviour
- Protected file hash comparison
- Protected Microsoft/OneDrive/Supabase function comparison
- Static asset and manifest validation
- ZIP integrity

## Requires deployed-environment confirmation

- Real Microsoft login and OneDrive synchronisation
- Real Supabase login and synchronisation
- GitHub Pages service-worker update behaviour
- Final visual review on the user’s desktop and mobile devices
