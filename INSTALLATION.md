# Install Karate & Azure Progress Hub v1.9.4

## 1. Back up the current app

1. Open the existing app.
2. Go to **Settings → Backup and restore**.
3. Select **Export backup** and save the JSON file.
4. Complete a OneDrive or Supabase sync.
5. Keep a backup copy of the current GitHub repository.

## 2. Download and extract

1. Download `karate-azure-progress-hub-v1.9.4.zip`.
2. Right-click the ZIP and select **Extract All**.
3. Open the extracted `karate-azure-progress-hub-v1.9.4` folder.

## 3. Preserve cloud configuration

Before replacing files:

- preserve production values in `js/microsoft-config.js`;
- preserve `js/config.js` if it exists in the deployed repository;
- do not change Supabase project URL, publishable key, table or authentication settings;
- never add a Microsoft client secret or Supabase service-role key.

## 4. Upload to GitHub

1. Open the GitHub repository that hosts the app.
2. Select **Add file → Upload files**.
3. Upload every file and folder from the extracted v1.9.4 folder.
4. Allow matching files to be replaced.
5. Reapply your existing `js/microsoft-config.js` values if necessary.
6. Confirm any separate `js/config.js` remains present.
7. Commit with:

```text
Update AZ-104 roadmap to v1.9.4
```

## 5. Wait for GitHub Pages

1. Open the repository **Actions** tab.
2. Wait for the Pages deployment to complete successfully.
3. Open the live app URL.

## 6. Refresh the PWA safely

1. Close all app tabs and installed app windows.
2. Open the live website.
3. Press `Ctrl + F5`.
4. If an old cached release remains, open:

```text
https://YOUR-GITHUB-NAME.github.io/YOUR-REPOSITORY/repair.html
```

The repair page removes only Progress Hub service-worker registrations and caches. It does not clear localStorage.

5. Reopen the app.
6. In **Settings**, confirm:

```text
App version 1.9.4
State schema 8
```

Do not clear browser site data.

## 7. Verify the AZ-104 roadmap

Open **AZ-104** and confirm:

1. **Prerequisites for Azure administrators** shows completed.
2. It contains only:
   - Introduction to Azure Cloud Shell
   - Deploy Azure infrastructure by using JSON ARM templates
3. **Manage identities and governance in Azure** is the current/next path.
4. **Understand Microsoft Entra ID** is the current module.
5. **Create, configure, and manage identities** is module 2.
6. Storage, compute, networking, and monitor/backup follow in the supplied order.
7. Each module shows **Microsoft Learn module completed**.
8. Mastery remains separate under Learn, Understand, Perform, Test, Review and Retain.

## 8. Verify existing information

Confirm that these remain present:

- daily history and evidence;
- karate, Jion and 3rd Dan records;
- intensive programme and monthly/weekly goals;
- notes and reviews;
- Microsoft/OneDrive configuration;
- Supabase configuration and login.

## 9. Confirm cloud sync

### OneDrive

1. Open **Settings → Cloud synchronisation**.
2. Confirm Microsoft OneDrive is selected and the account appears.
3. Select **Sync OneDrive now**.

### Supabase

1. Confirm the existing project URL and publishable key.
2. Sign in through the app.
3. Complete a normal sync.

No Supabase schema update is required.

## Local testing

Run `run-local.bat`, then open:

```text
http://localhost:8080/
```
