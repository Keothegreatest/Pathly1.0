# Ask Pathly reasoning layer — October 1, 2026

## Audit and implementation

The existing Vinext/Next application stores the workspace in browser IndexedDB. There is no authenticated server-side student identity or cloud record store. The existing assistant provider was a stub; local answers and the deterministic recommendation engine were working. The implementation preserves those systems and the viewport-bound assistant drawer.

The work proceeds through derived student intelligence, bounded retrieval, a typed server provider, deterministic recommendation integration, recent conversational continuity, separate confirmed planning memory, and evidence UI. No major dependency or database migration was introduced.

- `student-intelligence.ts` derives category totals, profile preferences, linked records, writing metadata, school requirement evidence, goals, deadlines and update recency from current records. It distinguishes documented data, preferences, recommendations, inference and unknowns. Timestamps never imply historical hours gained or changed responsibilities.
- `assistant-retrieval.ts` ranks exact named entities and their links ahead of topic/category and recency matches. It selects at most twelve entities, fifty-five facts, twelve allowlisted actions and four recent messages. Writing excerpts are bounded and topic-dependent. This is deterministic lexical/entity retrieval, not semantic embeddings.
- `planning-synthesis.ts` provides a transparent local interpretation of urgency, selected priorities, capacity and prior conversational focus. Specialized existing school/reflection/timeline answers retain priority. The deterministic recommendation engine remains unchanged.
- `lib/assistant` implements a real OpenAI Responses HTTP adapter with strict structured output, bounded responses, evidence/action ID validation, refusal/incomplete-response handling and timeouts. No provider SDK or client credential was added. Model actions resolve to existing local destinations; models cannot write records or invent actionable routes.
- Optional external reasoning first previews the exact redacted question and selected payload, then requires an explicit send. Turnstile is loaded only after approval. Normal local questions never call the model. Failure leaves local planning available and provides a labeled fallback. Unrelated navigation stays usable.
- Planning decisions are separate `{id, text, updated}` records, at most eight of 240 characters. Explicit Save is required, including for model candidates. Students can edit/remove them. Clearing chat does not clear decisions. No arbitrary transcript is converted into memory, and no cross-device persistence is claimed.

## Server activation

External reasoning deliberately reports unavailable until all configuration is present. Never put secrets in `NEXT_PUBLIC_*`, source control, screenshots or browser storage.

1. Create a Cloudflare Turnstile widget for the production hostname.
2. Configure Worker runtime secrets `OPENAI_API_KEY` and `TURNSTILE_SECRET_KEY` through Cloudflare's secret management.
3. Configure Worker runtime values `TURNSTILE_SITE_KEY`, `PATHLY_ASSISTANT_MODEL` (a model supporting Responses strict JSON schema), and `PATHLY_ASSISTANT_ORIGIN` (exact HTTPS origin, no trailing slash/path).
4. Set the build environment variable `PATHLY_ASSISTANT_RATE_NAMESPACE` to a positive numeric namespace unique within your Cloudflare account. The existing Vite Cloudflare config generates `ASSISTANT_RATE_LIMITER`, six requests per sixty seconds per IP. Verify this binding in the generated deployment configuration before deploying. There is no placeholder namespace.
5. Deploy and verify `/api/assistant` reports availability. Exercise a real Turnstile challenge and a small consented fictional record request, including refusal/failure and fallback. Review provider spending controls before enabling broad access.

The route validates same-origin requests, Cloudflare client IP, rate limiting, a bounded strict JSON request, consent, and Turnstile hostname/action before contacting OpenAI. This is an abuse boundary for the existing account-free product, not authentication or proof that client-submitted records are true. Cloudflare rate counters are local/approximate; this is not a global spending cap. A paid or account-based rollout needs actual identity, quotas and owner isolation rather than pretending the current browser-local product has accounts.

## Privacy and reasoning limits

Provider requests use `store:false`; this is not a promise of zero provider retention. The privacy page now explains optional external transmission and separate local decisions. Profile names, direct supervisor/contact details and full local destination records are omitted. Email/phone patterns are redacted, but names or sensitive information inside free text can remain; the reviewed payload and explicit consent are necessary. Exports currently contain workspace records, not chat or planning memory.

Records, prior messages and memories are placed in untrusted user context, never system instructions. The provider has no browsing, tools or mutation privileges. Schema/ID checks and conservative numeric/claim checks reject several unsupported output classes, but cannot prove semantic truth or eliminate prompt injection. Live model red-team evaluation and ongoing quality review are still required. Source metadata is student-entered traceability, not independent verification of school policy. Pathly does not predict admission or certify competitiveness.

## Verification

Passed TypeScript, ESLint and production build; all existing eight logic suites plus `assistant-intelligence.cjs`. Provider and endpoint tests use controlled responses rather than paid live calls. Coverage includes named/linked retrieval, bounded context, privacy minimization, malicious record isolation, allowed evidence/actions, rejected quantitative/admissions claims, incomplete/provider failures, explicit consent, origin, rate limit, challenge hostname and request bounds.

Three fictional profiles yield different semester priorities: the early pre-med student receives a reflection/documentation step; the busy pre-PA student receives the documented Biology requirement action; the pre-pharmacy student receives the explicitly selected research priority. Follow-up comparisons retain the earlier focus and distinguish missing documentation from absent experience.

Passed browser suites: assistant, drawer layout, planning, nonblocking saves, QA repair, marketing and stories. The assistant suite checks memory CRUD/refresh, separation from clear-chat, follow-up continuity, unavailable configuration, no POST before consent, reviewed model output, confirmation-only suggested memory, and provider-failure fallback. Model/Turnstile responses are mocked in browser tests. Drawer bounds, fixed header/composer, history-only scrolling, keyboard Escape, reduced motion and stable desktop layout pass at 1920, 1440, 1366, 768, 430 and 375 pixels. Final desktop/mobile screenshots were visually reviewed.

No live model credential, production Turnstile challenge or Cloudflare deployment was verified in this task. The provider integration is implemented, but external reasoning is not declared activated or live-tested.

## Reference contracts

- [OpenAI structured outputs](https://developers.openai.com/api/docs/guides/structured-outputs)
- [Cloudflare Turnstile server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
- [Cloudflare Workers rate limiting](https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/)
