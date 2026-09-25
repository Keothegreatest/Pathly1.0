# Public company website and demo boundary

## Root cause and correction

The previous `marketing-preview.tsx` imported `examples` from the application model, `getDashboardState`, `NextBestActions`, `ReadinessCard`, `CopilotResponse`, `sendAskPathlyMessage`, and `explainRecommendation`. Example records were run through production recommendation and assistant logic. That exposed operational metadata and provider disclosures in a public product presentation.

That component has been removed. Marketing now owns authored, illustrative content and presentation components. The real `/app` copilot, its calculations, storage, provider boundary, and record actions remain unchanged. The public demo is not a model integration and makes no claims about an enabled generative backend.

## Components and files

- `app/marketing.tsx`: company narrative, technology/intelligence/consulting pillars, editorial transitions, company close, and section reveal coordination.
- `app/marketing/marketing-shell.tsx`: independent public navigation/footer and original-logo lockup with the exact official tagline.
- `app/marketing/demo-data.ts`: explicitly fictional product numbers, goals, experiences and five authored responses. No application record types or services.
- `app/marketing/ask-pathly-demo.tsx`: public question selectors, context chips, narrative, statistics, priorities and links into the example workspace.
- `app/marketing/product-demo.tsx`: six selectable workspace previews; no editing or persistence.
- `app/marketing/interactive-journey.tsx`: observed scroll stages and keyboard-selectable desktop journey navigation.
- `app/marketing/connected-system.tsx`: selectable nodes with an equivalent readable explanation of each relationship.
- `app/marketing.css`: scoped public styles, cream/forest rhythm, responsive compositions, motion and focus states.
- `app/page.tsx` and `app/public-document.tsx`: public metadata and shell reuse; existing `/app` and legacy redirects are preserved.

## Data and interaction contract

Public marketing must not import production assistant code, dashboard selectors, application examples, IndexedDB services or provider code. It must not request `/api/assistant`, load a conversation, mutate a profile, or save a record. Static dependency tests enforce this recursively from both public entry components.

The default question is **Give me a progress update**. Five responses have distinct narratives, context sets, statistics and priorities. All values describe one illustrative journey, never customer or company performance. A 360 ms presentation transition follows selection; reduced-motion mode changes immediately. Timers cancel on subsequent selection/unmount. There are no background animations, model requests or model charges.

The public product preview responds only through component state. Its links either select a preview, reveal the separate demo, or enter `/app`. The actual workspace continues to show its appropriate capability disclosures. Marketing does not imply that a live language model has been enabled.

## Responsive design and accessibility

Desktop uses a split demo, horizontal journey navigation and a selectable network. Mobile uses scrolling prompt controls, workspace tabs, a vertical journey and a two-column set of system selectors. Relevant context is communicated in text as well as visual states. Controls use semantic buttons, `aria-pressed`, visible focus, touch-sized targets and live response regions. Mobile navigation supports Escape and restores focus. Every meaning remains available with motion disabled.

IntersectionObserver handles section reveals and the journey; no continuously running scroll animation loop or animation dependency is added. The public shell no longer pulls the app's sidebar, assistant or dashboard component graphs into the public demo.

## Brand and availability

The official lockup is **Your Path, Made Clear.** Existing logo artwork is retained. Public positioning is healthcare technology and consulting, starting with the journey into healthcare. No treatment, clinical advice, success rate, customer count, credential or admissions guarantee is advertised. Consulting is explicitly in development with no invented contact, booking, pricing or payment flow.

## Verification

`node tests/marketing.cjs` checks fixture consistency, five different question/context combinations, recursive public dependency isolation, forbidden operational copy, removed legacy preview, and truthful consulting/brand language.

`tests/marketing-browser.cjs` runs against a local server. It creates an isolated test browser workspace, visits public pages, and verifies the workspace remains byte-for-byte unchanged. It instruments IndexedDB and requests to verify zero public storage/assistant access. It also checks all prompts, context changes, six product views, six network nodes, journey scroll activation, desktop/mobile layouts, keyboard/touch controls, reduced motion and browser errors.

Use `PATHLY_PLAYWRIGHT_MODULE` for an externally available Playwright module (default `playwright`), `PATHLY_BASE_URL` for the server (default `http://localhost:5174`), and `PATHLY_BROWSER_CHANNEL` for an installed Chromium channel (default `msedge`). Browser evidence is written under ignored `work/`. No browser dependency was added to the application.

Validation also includes TypeScript, ESLint, the existing record/dashboard/personalization/copilot suites, and the production build. Cloudflare rollout must be verified separately against its live URL.
