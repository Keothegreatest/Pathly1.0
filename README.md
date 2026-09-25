# Pathly — personal browser workspace

Pathly opens without an account. Visitors enter a first or preferred name once, which can later be edited in Profile & preferences. Names personalize the workspace; they are not passwords or account identifiers.

Records and tutorial preferences are saved in IndexedDB on this browser and origin. There are no sign-in providers, OAuth secrets, cookies or remote record requests. Anyone using this browser profile can open its workspace. Other devices/browsers have separate data. Private browsing, clearing site storage or changing the website domain can remove access to these records. Use the existing Export journey action regularly; exports are backups, not an automatic cross-device sync service.

Existing Cloudflare D1 data is left intact. The old records/preferences APIs return 410 and do not expose D1 data. Google and ChatGPT login handlers are removed. The Worker no longer needs a D1 binding or Google credentials for normal operation. Existing server data has not been silently imported into an anonymous visitor's browser.

## Build

Use Node 22.13 or later, `npm ci`, then `npm run build`. Deploy the generated Worker with `dist/server/wrangler.json`. No auth setup or database migration is required for this version.

## Checks

```sh
npx tsc --noEmit
npm run lint
node tests/record-integrity.cjs
node tests/dashboard-state.cjs
node tests/workspace-intelligence.cjs
node tests/personalization.cjs
node tests/copilot.cjs
npm run build
```

The browser storage service uses atomic IndexedDB transactions, record versions, relationship checks and explicit errors when storage is unavailable or full. A name is not an access-control mechanism. Do not change the old server APIs to return all records without authentication.

## Personalized planning

New workspaces can complete a resumable nine-question assessment. Home adapts to selected priorities and capacity, suggested goals require explicit acceptance, and hour targets use documented experience totals. Returning users can open **Your Pathly plan** from the profile menu.

**Ask Pathly is a local rules-based planning guide, not a connected language model.** Conversation history stays in this browser; proposed changes open existing editors for review. See [personalization architecture and provider requirements](docs/personalization.md) before enabling generative AI.

The public product website is at `/`; open the workspace at `/app`. Legacy workspace query links and `/login` / `/signup` redirect into the name-based entry flow. Ask Pathly is a global floating panel inside the workspace, with page-aware prompts, recommendation explanations, and conversation-only reset controls. Public previews use clearly labeled illustrative records and never save them to a visitor’s workspace.
