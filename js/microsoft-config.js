/*
 * Microsoft OneDrive configuration for Karate & Azure Progress Hub.
 *
 * The client ID is a public identifier for a Microsoft Entra single-page
 * application. Never add a client secret, certificate or access token here.
 *
 * You can leave clientId empty and enter it later in Settings, or set it here
 * once so every device using the deployed app receives the same configuration.
 */
window.KA_MICROSOFT_CONFIG = Object.freeze({
  clientId: '',
  authority: 'https://login.microsoftonline.com/common',
  redirectUri: '' // Example: https://YOUR-SITE/redirect.html
});
