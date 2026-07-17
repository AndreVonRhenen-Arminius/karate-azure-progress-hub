# Microsoft sign-in and OneDrive setup

Version 1.9.1 requires a Microsoft Entra single-page application registration before Microsoft sign-in can work.

## 1. Register the application

1. Open the Microsoft Entra admin centre.
2. Go to **Identity → Applications → App registrations**.
3. Select **New registration**.
4. Name it `Karate Azure Progress Hub`.
5. For broad personal and organisational account support, choose **Accounts in any organisational directory and personal Microsoft accounts**. A single-tenant registration can be used instead when only one organisation should sign in.
6. Complete the registration.
7. Copy the **Application (client) ID**. This is the value entered into the app. Do not create or use a client secret.

## 2. Configure the Single-page application platform

1. Open the app registration's **Authentication** page.
2. Select **Add a platform**.
3. Choose **Single-page application**.
4. Add the exact deployed app URL, including its path and trailing slash when applicable. Example:

   `https://YOUR-GITHUB-NAME.github.io/karate-azure-progress-hub/`

5. For local testing, also add:

   `http://localhost:8080/`

6. Save the changes.

The redirect URL shown under **Settings → Microsoft application** must exactly match one of these registered SPA URLs.

## 3. Add Microsoft Graph permission

1. Open **API permissions** in the app registration.
2. Select **Add a permission**.
3. Choose **Microsoft Graph**.
4. Choose **Delegated permissions**.
5. Add:

   `Files.ReadWrite.AppFolder`

6. Save the permission.

Depending on the Microsoft 365 tenant's consent policy, an administrator may need to approve the permission for work or school accounts.

## 4. Configure the deployed app

Use either method below.

### Method A — Settings screen

1. Open the app.
2. Go to **Settings → Microsoft OneDrive**.
3. Enter the Application (client) ID.
4. Leave the authority as:

   `https://login.microsoftonline.com/common`

5. Confirm the redirect URI.
6. Save the configuration and allow the app to reload.

### Method B — Deployment configuration file

Edit `js/microsoft-config.js`:

```javascript
window.KA_MICROSOFT_CONFIG = Object.freeze({
  clientId: 'YOUR-APPLICATION-CLIENT-ID',
  authority: 'https://login.microsoftonline.com/common',
  redirectUri: 'https://YOUR-GITHUB-NAME.github.io/karate-azure-progress-hub/'
});
```

The client ID is a public application identifier. Never place a client secret, certificate, refresh token or access token in this file.

## 5. Sign in and initialise OneDrive

1. Open **Settings**.
2. Set **Active sync provider** to **Microsoft OneDrive**.
3. Select **Use selected provider**.
4. Select **Sign in with Microsoft**.
5. Approve access to the app folder.

On first use, the app creates or updates:

`OneDrive/Apps/Karate Azure Progress Hub/karate-azure-progress-state.json`

The visible app-folder name is based on the display name configured in Microsoft Entra and may differ slightly.

## 6. Test the synchronisation

1. Change one Azure or karate progress item.
2. Wait for the sidebar to show a successful OneDrive sync.
3. Select **Sync OneDrive now** in Settings.
4. Open the app on a second device using the same URL and Microsoft account.
5. Sign in and confirm the progress loads.

Use **Pull OneDrive to this device** only when the cloud copy should replace local data. Use **Push this device to OneDrive** only when the local copy should replace the cloud file.

## Security design

- Authentication uses MSAL Browser and the OAuth 2.0 authorisation code flow with PKCE.
- No client secret is stored in the PWA.
- Microsoft Graph access is delegated to the signed-in user.
- `Files.ReadWrite.AppFolder` limits file access to the application's own OneDrive folder.
- Local data remains available offline.
- Supabase authentication and data remain separate and unchanged.
