# Pathly

A pre-health journey and application-planning workspace built with React, Vinext and Cloudflare Workers/D1.

## Authentication

Google sign-in replaces the previous Sites/ChatGPT login. See [Google authentication setup](docs/google-auth.md) for required Google OAuth credentials, Cloudflare runtime variables, redirect URI, and the auth database migration. No credentials belong in this repository. Records remain scoped to the authenticated account. Existing Sites owners are not automatically linked to Google accounts by email.

## Development and build

Use Node 22.13 or later, then `npm ci` and `npm run build`. The generated Worker configuration is `dist/server/wrangler.json`. `DB` points to the configured Cloudflare D1 UUID. The auth tables must be initialized before Google sign-in can succeed. Local development does not provide fake authentication; use a separate HTTPS OAuth development host/client.

## Database setup

For a new database, after building:

```sh
npx wrangler d1 execute DB --remote --config dist/server/wrangler.json --file drizzle/0000_great_zarek.sql
npx wrangler d1 execute DB --remote --config dist/server/wrangler.json --file drizzle/0001_google_auth.sql
```

Run the first migration only if the records table does not already exist. The second migration is safe to repeat and does not modify student records. Authentication tables use explicit SQL; preserve these tables when changing database tooling.

## Checks

```sh
npx tsc --noEmit
npm run lint
node tests/google-auth.cjs
node tests/record-integrity.cjs
node tests/dashboard-state.cjs
node tests/workspace-intelligence.cjs
npm run build
```

OAuth tests use test-only provider responses. Live Google consent, production credentials, and callback-domain registration require separate verification in the configured deployment.

