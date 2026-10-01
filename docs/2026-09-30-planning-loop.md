# Pathly planning loop — September 30, 2026

## Audit and scope

Inspected the Vinext/Next application, public and workspace routes, browser persistence and validation, prepared database schemas, profile/setup, dashboard selectors, deterministic recommendations, copilot context, record forms/details, school comparison, and existing regression suites before editing.

The working application is deliberately a **browser-local workspace**, not an authenticated cloud account. `/login` and `/signup` redirect to `/app`. IndexedDB persists records, preferences and conversations. The legacy remote records API is disabled. D1 and prepared Supabase files are not an active account/data service. No schema, authentication provider, remote API or analytics dependency is changed in this work.

### P0: activation and correctness

- Nine required setup screens delayed useful guidance. Replaced with four core questions and a starting-plan result. Previous answers are preserved; goals, capacity, concern, approach, success preferences and a personal hours target remain optional.
- Home repeated its top priority above the priority list, while quick actions competed for attention. A concise current-position summary now leads into at most three recommendations. Quick actions follow the priorities.
- Ask Pathly used Home's truncated priority list to answer prerequisite questions. Topic-specific school/reflection/timeline queries now examine the relevant records independently of dashboard ranking.
- School labels called every unreviewed requirement a gap. Shared evidence logic separates explicitly missing, in-progress, unreviewed, recommended, unclassified and unsourced information.
- Optional hours-field blur could consume the next-step click during autosave. The field now saves with Continue/Finish later.

### P1: useful return loop

- Log hours from an experience with one numeric field. The existing optimistic save, version conflict protection and recoverable draft mechanism remain in charge. Category/linked goals and Home derive from the updated record.
- Reflection entry leads with the reflection text and writing status. Optional prompts/date/themes/application use remain available. Application writing already surfaces these same reflections; no generated essay or fabricated experience is added.
- Previous-visit timestamps support a modest local update count. This is not analytics, an activity event log, or a historical hours delta.
- Readiness retains category-specific statuses instead of replacing them with generic labels. No admission probability, competitiveness score or unsupported “on track” assessment is introduced.

### P2: consistency and maintainability

- Reusable RecommendationCard, PlanningSummary, QuickHours and SchoolComparison components keep page markup smaller.
- Mobile school comparison uses stacked program summaries and expandable details; desktop retains its comparison table and all existing fields.
- Existing typography, forest/cream tokens, dialog primitives and five main workflows are reused. No new dependency, blocking loading screen or success modal.

## Principal files

- `guided-setup.tsx`, `personalization.ts`: four-question setup, starting results, legacy profile fallback.
- `home-dashboard.tsx`, `dashboard-state.ts`, `planning-summary.tsx`, `planning-status.ts`, `recommendation-card.tsx`: evidence-led Home hierarchy and local return context.
- `school-evidence.ts`, `journey.ts`, `record-detail.tsx`, `school-comparison.tsx`: consistent requirement semantics and mobile comparison.
- `planning-answer.ts`, `copilot-context.ts`, `recommendations.ts`: topic-specific grounded guidance and more cautious requirement language.
- `experience-hours.ts`, `quick-hours.tsx`, `pathly.tsx`: fast hours entry using existing save behavior; record detail resolves current data after updates.
- `editor.tsx`, `model.ts`, `home-dashboard.css`: simpler reflection form and shared responsive styling.

## Verification

Run existing record-integrity, dashboard-state, workspace-intelligence, personalization, copilot, marketing and stories suites, plus `planning-loop.cjs`. The new suite covers school evidence distinctions, school/reflection answers when urgent Home tasks crowd out relevant actions, timeline uncertainty, legacy profiles, valid/invalid hours additions, linked goal updates, reflection resolution and visit boundaries.

Browser coverage: `planning-browser.cjs` exercises actual new-user setup → personalized recommendation → goal, mobile experience/hours/reflection/school entry, automatic Home/goal updates, mobile comparison, five workspace routes at 1440, 1366, 768, 430 and 375 pixels, and persisted state after refresh. Existing nonblocking and QA suites protect latency/failure recovery, navigation, public/private separation and prior visual fixes. Typecheck, lint and production build are required before publishing.

### Final results

Passed TypeScript checking, ESLint, production build, all eight logic/data suites, and the planning, nonblocking, QA-repair, marketing and stories browser suites. The planning browser test also completed real goal editing and deletion. Visually inspected the final populated desktop Home, mobile Home and mobile comparison screenshots. No horizontal overflow or browser exceptions occurred in the tested flows. Cloudflare deployment status was not verified by these local checks.

## Remaining limitations / next steps

- Cross-device accounts, cloud backup, account isolation and logout do not exist in the current local-only product. Do not market these as available. Browser clearing/device loss can remove records; keep export guidance visible. A production cloud rollout needs actual provisioning, RLS/ownership verification, migration/import and recovery testing.
- No authoritative school catalog or automatically verified requirements exists. Every comparison is limited to student-entered records and sources. Hours categorization cannot certify a program's definition of eligible patient-care experience.
- Record timestamps cannot establish steady growth, historical hours added, deleted activity, or completion trends. Add a deliberate event model only when that product need is justified.
- Ask Pathly remains a deterministic local planning guide. It does not judge essay quality or know admissions outcomes.
- The first-session flow is shorter, but the 3–5-minute activation target needs real student usability measurement; automated tests do not prove it.
- No existing analytics provider was found. No student records or behavioral events are sent to a third party by these changes.
- Continue extracting the remaining large workspace JSX opportunistically; avoid an unrelated rewrite.
