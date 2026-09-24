# Google sign-in on Cloudflare

This deployment uses Google OAuth and D1-backed, revocable sessions. Sites identity headers are not accepted. Google access tokens are not stored. Google subject IDs determine ownership; existing Sites records are not automatically reassigned by email.

## Required setup
1. In Google Auth Platform configure branding and audience, then create a Web application OAuth client.
2. Register `https://YOUR-PATHLY-HOST/api/auth/callback/google` as an authorized redirect URI. While the consent app is in Testing, add your Google account as a test user.
3. In Cloudflare Worker Settings → Variables and Secrets configure runtime values:
   - `APP_URL`: the exact HTTPS origin, without a subpath.
   - `GOOGLE_CLIENT_ID`: the Google web client ID.
   - `GOOGLE_CLIENT_SECRET`: a Cloudflare Secret, never committed to GitHub.
4. After building, initialize auth tables:
   ```sh
   npx wrangler d1 execute DB --remote --config dist/server/wrangler.json --file drizzle/0001_google_auth.sql
   ```
   A new database also needs `drizzle/0000_great_zarek.sql` first. Existing data is preserved; the auth migration is idempotent.
5. Deploy and test consent, cancellation, refresh, logout and two-account data isolation. Missing setup fails closed with a friendly message.

Sessions expire after seven days and use Secure, HttpOnly, SameSite=Lax cookies. Logout is same-origin POST and revokes the server session. OAuth state is browser-bound, expires in ten minutes and is consumed once. Expired rows are pruned at sign-in. Delete a user's auth_sessions rows to revoke all their sessions.

Use a separate HTTPS development host and OAuth client for local testing; no mock-login bypass is enabled. Real Google consent must be verified after credentials are configured. Existing Sites data needs a separately verified ownership migration before reassignment.

Reference: https://developers.google.com/identity/protocols/oauth2/web-server


