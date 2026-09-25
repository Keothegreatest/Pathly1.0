# Personalized planning

The nine-question assessment extends the existing `profile` record. Selections and the current step save through the same validated, versioned IndexedDB service as other records. `Finish later` defers automatic reopening; completed and legacy workspaces can open **Your Pathly plan** from the profile menu. No D1 migration or new account system is required.

`personalization.ts` parses partial/legacy profiles, validates answers, maps profession-specific language, and proposes goals. `dashboard-state.ts` combines these suggestions with evidence-based record recommendations. Recorded urgent deadlines and requirement gaps take precedence. Weekly capacity limits the number of visible actions. Self-reported starting points are always distinguished from documented experiences.

Goals are suggestions until the student reviews and saves the existing goal editor. `goal-progress.ts` is the shared calculation for manual, linked-experience and category-hour progress. Clinical targets are personal goals, not admissions requirements. Milestone receipts persist in the same browser workspace so ordinary edits do not repeatedly celebrate completed targets.

## Ask Pathly

The shipped assistant is an explicitly labeled **local, deterministic planning guide**, not generative AI. It supports focused questions about recorded progress, selected priorities, research, reflection prompts, school planning and clinical-hour targets. It acknowledges unsupported requests and missing information. It cannot research schools, predict admission or evaluate competitiveness.

- `assistant-context.ts`: structured context from the current workspace; scoped context helper for a future provider.
- `assistant-service.ts`: understandable local intent/rule handling and factual responses.
- `assistant-types.ts`: typed messages and proposed destinations.
- `ask-pathly-copilot.tsx` and `copilot-parts.tsx`: persistent floating conversation UI, accessible controls and explicit review actions.
- `copilot-context.ts`: page-aware prompts, selected-recommendation explanations and the local message service boundary.
- `lib/assistant/provider.ts`: isolated server-side provider interface; currently returns no provider.
- `/api/assistant`: returns 503 while unconfigured and fails closed if a provider is added without an access policy.

No user information is sent to an AI provider. The latest 30 messages persist in this browser's workspace. A failed history read disables sending rather than overwriting unavailable history. Actions open existing editors; they never silently save suggested changes.

Before enabling generative AI, implement a real server-side provider, secret management, abuse/rate controls appropriate to anonymous visitors, explicit data-sharing disclosure, narrow context selection, response validation and end-to-end tests. Do not expose a paid model endpoint just by adding a credential. The current guide remains usable without this integration.

## Persistence and verification

Workspace shape adds optional `conversation` and `milestones` fields; existing records remain intact. Profile fields are additive. Data is browser/origin-local, not account-level or cross-device storage. Clearing site data removes it. The existing journey export exports records, not assistant history or milestone receipts.

`tests/personalization.cjs` covers medicine, PA and dental profiles, capacity, missing data, validation, recommendation ordering, goal acceptance, live targets and milestone crossings. Existing record-integrity, dashboard-state and workspace-intelligence suites remain applicable. Browser checks cover nine-step completion, refresh/resume, deferred and legacy onboarding, explicit goal review, persistent conversation, mobile bounds, reduced motion and the disabled model endpoint.

## Public website and copilot

`/` is now the public website; `/app` contains the existing name-based workspace. `/login` and `/signup` redirect to `/app` because this version intentionally has no accounts. Old `/?view=…&tab=…` bookmarks redirect to their `/app` equivalents. IndexedDB is origin-scoped, so changing the path preserves saved data.

The copilot remains mounted across workspace navigation, keeping the draft and recent messages. Its open/minimized preference is stored as a boolean in localStorage. Desktop is nonmodal so sidebar navigation remains available; mobile uses the shared modal focus trap and follows the visual viewport. Editing dialogs temporarily hide it without discarding state.

New conversation and confirmed Clear conversation write only the conversation field through the existing transaction service. They do not delete records or reset onboarding. Message action buttons open existing forms for explicit review/save. The public preview uses labeled example records, existing dashboard components, and the same local response service; it never reads or writes personal workspace data.

The Privacy, Terms and Help pages explain current behavior. The Terms page is product-use guidance, not a complete commercial legal agreement; have appropriate launch policies reviewed before offering contractual services.
