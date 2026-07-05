# Karate & Azure Progress Hub

An installable, offline-first Progressive Web App for André's weekly family, AZ-104, 3rd Dan and kata programme.

## Included

- Today dashboard with tick-off tasks and notes
- Monday-to-Sunday plan
- Six AZ-104 learning paths and module tracking
- 3rd Dan kihon and kumite tracking
- Kata sequence and retention tracking
- Progress dashboard
- Weekly reviews and general notes
- Minimum-week mode
- Session timer
- JSON backup and restore
- Optional Supabase account and cloud synchronisation
- Installable PWA for Android and Windows

## 1. Test it on a Windows laptop

1. Extract the ZIP completely. Do not run it from inside the ZIP.
2. Double-click `run-local.bat`.
3. Windows PowerShell starts the included local server; Python is not required.
4. The app opens at `http://localhost:8080`.
5. Keep the PowerShell window open while using the app. Press `Ctrl+C` in that window to stop it.

It can be used locally immediately. Cloud sync requires the Supabase steps below. Do not open `index.html` directly with `file://`; service workers and installation require a local web server or HTTPS hosting.

## 2. Create the cloud database

1. Create a free Supabase project.
2. Open **SQL Editor**.
3. Copy and run all SQL from `supabase-schema.sql`.
4. Open **Project Settings > API**.
5. Copy the **Project URL** and **publishable/anon key**.
6. In the app, open **Settings > Cloud synchronisation**.
7. Paste the URL and key, then select **Save cloud configuration**.
8. Create an account with your email and password.
9. Sign in on your phone and laptop with the same account.

The SQL enables Row Level Security so each authenticated user can read and update only their own record.

## 3. Host it so it can be installed on both devices

The PWA must be hosted over HTTPS. Suitable options include GitHub Pages, Netlify, Cloudflare Pages or another static HTTPS host.

### Simple Netlify method

1. Sign in to Netlify.
2. Drag the extracted app folder into the manual deployment area.
3. Open the generated HTTPS site.
4. On Android Chrome, open the browser menu and choose **Install app** or **Add to Home screen**.
5. On Microsoft Edge, open the Apps menu and choose **Install this site as an app**.

### GitHub Pages method

1. Create a new GitHub repository.
2. Upload all files from this folder to the repository root.
3. Open repository **Settings > Pages**.
4. Deploy from the main branch and root folder.
5. Open the generated HTTPS address and install the app.

## 4. How synchronisation works

- Every change is saved immediately on the current device.
- When signed in and online, changes are uploaded after a short delay.
- When the app opens or returns to the foreground, it checks for newer cloud data.
- If offline, continue using the app. It syncs after the connection returns.
- The most recently updated full app state is used.
- Use **Export backup** regularly for an additional copy.

## 5. Important security notes

- Use only the Supabase publishable/anon key in the browser app.
- Never paste a Supabase service-role key into the app.
- Keep Row Level Security enabled.
- Use a strong, unique password.

## 6. Resetting

Settings contains a **Reset all local data** button. This does not automatically delete the cloud row. To replace cloud data, reset locally and then use **Push local to cloud**.
