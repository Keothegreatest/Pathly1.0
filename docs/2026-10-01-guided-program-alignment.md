# Guided planning and Program Alignment

## Architecture and scope

Inspected the current browser-local workspace, school fields and linked requirements, school evidence selectors, comparison/detail views, recommendation engine, derived student intelligence, copilot retrieval/synthesis, provider contract, consent UI and regression tests before editing. This extends the existing architecture; no database, dependency or account system was added.

Ask Pathly now offers three to four page-aware questions and two to four allowlisted follow-ups. The normal interface has no question composer. Saved conversations remain readable, and the existing editable planning decisions remain separate from chat. Choosing another question preserves the conversation. Evidence and record actions remain available alongside answers.

`guided-planning.ts` owns the intent catalog and dispatch. Structured questions use existing deterministic logic or shared selectors. One bounded planning-tradeoffs intent can use the existing provider when configured. Its server request requires that exact intent and approved question; arbitrary question payloads are rejected. The provider, retrieval, redaction, Turnstile, rate limiting, evidence/action validation and fallback are preserved.

Students see a single Pathly response identity. Provider routing is not a product mode. An inline consent step displays selected context before any model transmission, with an option to continue without sharing. Consent is requested for every transmitted payload rather than assuming approval for future changed records. When the provider is unavailable, the guided answer remains available from saved information. No blocking loading screen was introduced.

## Shared program evidence

`getProgramAlignment()` combines the existing `getSchoolEvidence()` with documented experience totals, optional academic/test fields, school-specific expectations, linked letters, linked writing, tasks and deadlines. Schools, comparisons and guided answers use this same result. The derived intelligence layer includes these facts for bounded provider retrieval.

- Counts describe saved records or explicitly entered checklist statuses, never admission odds.
- Completed and not-applicable prerequisites are distinguished.
- Global experience hours are displayed as documented hours; they do not certify that a program accepts those hours.
- Letter plans are separate from confirmed/submitted letters. Only school-linked letters and materials enter the program-specific totals.
- Free-form program expectations are displayed without inventing numeric thresholds. A numeric clinical field permits an arithmetic comparison, accompanied by source/eligible-hours caveats.
- Missing data remains unknown, not proof of absent preparation. No GPA-scale conversion, exam equivalence or admissions judgment is inferred.
- The full comparison retains existing school details and adds neutral alignment rows. Chat summaries cover up to three saved programs and explicitly direct larger lists to the full comparison.

Source quality is separate from preparation. A valid entered HTTP(S) URL and review date provide traceability, not independent verification. Missing/invalid dates, future dates, and dates older than 365 days show “Needs verification.” The one-year threshold is a transparent planning reminder, not a claim about when a program changes policy. Existing recommendations now use the same source-quality check, including addressed requirements that need renewed verification.

## Interface

Program Alignment is expandable on school cards and available in the school detail panel. Students can inspect recorded preparation, program information, planning interpretation and individual requirement sources, then open the exact record needing attention. Ask Pathly includes a program selector for Schools and resolves actions through the existing record navigation layer.

The existing cream/forest tokens, detail panels, typography and drawer structure are retained. The former composer CSS is removed. Header and guided controls remain visible, with conversation content as the drawer's main scroll region. Planning-memory text fields are for explicitly saved decisions, not arbitrary chat questions.

## Verification and limitations

Added `program-alignment.cjs` and `program-alignment-browser.cjs`; updated existing assistant, layout and planning tests for the guided controls. Tests cover factual counts/hours, school-linked records, missing documentation, stale/unsourced evidence, source-driven recommendations, program scope, consistent Schools/copilot conclusions, requirement deep links, no composer, guided follow-ups, consent, provider failure and rejected admissions predictions. Existing privacy/provider safeguards continue to be exercised.

The existing data remains student-entered. Pathly has no independent school catalog or policy verification service, cross-device accounts, or historical activity log. Clinical categorization cannot establish program-defined patient-care eligibility. Live model credentials and production Turnstile were not available for live provider testing; external reasoning still requires the setup described in `2026-10-01-ask-pathly.md`.

An audit found no active admission scoring system to remove. Existing honest uncertainty/disclaimer copy is retained. User-facing implementation labels and the “not a connected language model” message were removed from the copilot. Model validation additionally rejects common “likely/unlikely to get in,” numerical admission-probability and competitiveness-score claims; these checks are safeguards, not proof of semantic truth.

## Final verification results

Passed TypeScript checking, ESLint, production build, all ten logic suites, and the assistant, program-alignment, drawer-layout, planning, nonblocking, QA-repair, marketing and stories browser suites. Desktop and mobile screenshots were visually inspected. The final reading-position adjustment opens each new answer at its beginning while preserving fixed guided controls. Provider behavior was tested with controlled responses, not live production credentials. No schema migration or deployment verification was performed.
