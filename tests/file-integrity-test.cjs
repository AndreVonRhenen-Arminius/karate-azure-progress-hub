const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = path.join(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file));
const text = file => read(file).toString('utf8');

const index = text('index.html');
const app = text('app.js');
const styles = text('styles.css');
const sw = text('service-worker.js');
const msal = text('vendor/msal-browser.min.js');
const manifest = JSON.parse(text('manifest.webmanifest'));

assert.match(index.slice(0, 100).toLowerCase(), /<!doctype html>/, 'index.html must be HTML');
assert.ok(index.includes('app.js?v=1.9.4'), 'index must reference v1.9.4 app');
assert.ok(index.includes('styles.css?v=1.9.4'), 'index must reference v1.9.4 styles');
assert.notStrictEqual(index, msal, 'index.html must not contain the MSAL bundle');
assert.ok(app.includes("const APP_VERSION = '1.9.4'"), 'app version must be 1.9.4');
assert.ok(styles.includes(':root'), 'styles.css must contain CSS');
assert.ok(sw.includes("ka-progress-hub-v1.9.4"), 'service worker cache must be v1.9.4');
assert.ok(sw.includes("'./repair.html'"), 'repair page must be cached');
assert.equal(manifest.name, 'Karate & Azure Progress Hub');
assert.ok(text('supabase-schema.sql').includes('create table'), 'Supabase schema must be SQL');
assert.ok(text('js/microsoft-config.js').includes('KA_MICROSOFT_CONFIG'), 'Microsoft config must be JavaScript configuration');
assert.match(text('repair.html').slice(0, 100).toLowerCase(), /<!doctype html>/);
console.log('File integrity tests passed.');
