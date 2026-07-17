# Release Validation — v1.9.3

## Root cause confirmed

The uploaded deployment archive contained cross-assigned file contents. In particular:

- `index.html` was byte-for-byte identical to `vendor/msal-browser.min.js`;
- `service-worker.js` contained Microsoft setup Markdown rather than JavaScript;
- `app.js` contained a Node smoke test rather than the application;
- `styles.css` contained README Markdown rather than CSS;
- `manifest.webmanifest` contained changelog Markdown rather than JSON.

This explains why the browser rendered minified MSAL source code.

## Passed

- `node --check app.js`
- `node --check service-worker.js`
- `node tests/smoke-test.cjs`
- `node tests/onedrive-sync-test.cjs`
- `node tests/file-integrity-test.cjs`
- `python -m json.tool manifest.webmanifest`
- HTTP response for `/` returns `Content-Type: text/html`
- `index.html` begins with `<!doctype html>`
- `index.html` is not identical to the MSAL bundle
- Versioned PWA cache updated to v1.9.3
- `repair.html` removes only Progress Hub caches and service-worker registrations
- State schema remains 7
- `app.js` differs from the intact v1.9.2 source only by the application version string
- `js/microsoft-config.js` checksum unchanged
- `supabase-schema.sql` checksum unchanged
- OneDrive mocked read, write, pull, push, and conflict tests passed
- ZIP integrity passed

## Requires deployed-environment confirmation

- GitHub Pages deployment and `/repair.html` execution
- Real Microsoft login and OneDrive synchronisation
- Real Supabase login and synchronisation
- Final desktop and mobile visual review
