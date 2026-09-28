# Pathly product polish — 28 September 2026

## Experience

- Public hero now explains the product directly with Capture → Connect → Act. A three-column “What is Pathly?” section follows it. The strongest real product previews and interactive authored demos remain; redundant marketing sections and the annotated dashboard/terracotta spotlight were removed.
- Student Stories has ten illustrative journeys, six local contextual SVG illustrations, responsive next/image rendering, and one clear disclosure per page. The repetitive badges are gone. Outcomes describe preparation rather than invented admissions successes. URL filters, history, refresh, keyboard controls, and related stories remain intact.
- Pre-Nursing was removed only from the public stories collection. Workspace pathways and profile setup retain it.
- Startup preserves the sidebar, header, route context, and navigation while browser storage is read. Missing storage uses inline recovery. Genuine empty workspaces still receive the existing name-entry flow.
- Record saves update optimistically, dismiss the form immediately, persist in the background, and lock only that record. Failed changes roll back without affecting other records; entered data remains in an inline recovery area with retry, review, and draft download. Refresh/close warns when a write or recovery draft is outstanding.
- Routine success toasts and milestone success dialogs no longer interrupt saves. Quick capture follows the same background-save contract. Deletion confirmation closes before the actual delete; failures retain the record and provide an inline explanation.
- Setup autosaves in a nonmodal panel, with no timed “building a plan” sequence. Finish later remains available during a write and its deferred state is saved afterward. Ask Pathly shows its locally generated response immediately while conversation persistence runs, restoring the question if persistence fails.
- Removed unused skeleton/spinner components, shimmer styles, and transform-based hover/press feedback. Deliberate form/discard/delete dialogs remain; no dialog is introduced to wait for persistence.
- Fixed server/client route initialization so direct workspace refreshes do not cause hydration mismatches. Restored the footer purpose anchor after removing the old section.

## Verification

Passed TypeScript (`tsc --noEmit`), ESLint, production Vinext build, and all seven required unit suites:
`record-integrity`, `dashboard-state`, `workspace-intelligence`, `personalization`, `copilot`, `marketing`, `stories`.

Production-bundle browser coverage:
- Marketing: six viewport sizes, real preview images, five Ask demos, six example views, mobile navigation, anchors, reduced motion, and intact entry routes.
- Stories: ten detail routes, filtering combinations, shareable URLs, back/forward, refresh, removed Noah route, invalid routes, image decoding, keyboard access, mobile layout, and zero public reads of private browser storage.
- Workspace: populated dashboard, long text, four viewport sizes, quick-action destinations, recommendation explanations, and retained Pre-Nursing setup.
- Nonblocking operations: delayed initial storage reads, navigation during writes, optimistic records, no loading/success overlay, injected storage failure, rollback, preserved draft across navigation, retry, refresh persistence, and failed task-toggle recovery.

Screenshots are generated locally in `work/`: `editorial-hero.png`, `editorial-375.png`, `stories-1440.png`, `stories-375.png`, `instant-saving-desktop.png`, `instant-workspace-desktop.png`, and `instant-workspace-mobile.png`. Browser scripts are committed; generated screenshots are not application assets.

## Supabase / security status

**Code prepared, not deployed.** There is no configured Supabase project, Auth connection, or Postgres runtime in this environment. `supabase/schema.sql` is an inactive schema source; `supabase/tests/ownership.sql` covers ownership CRUD, spoofed inserts, owner reassignment, and anonymous denial for every proposed private table. These database integration tests were **not executed**. No production RLS claim is made.

The current app remains IndexedDB-based and has no account-level isolation or cross-device sync. People sharing a browser profile can open its records. Export guidance remains visible. Public marketing uses static fixtures and never reads student data.

No live database schema or data was modified. No dependencies, authentication providers, service keys, public metrics, or customer claims were added. See `supabase/README.md` for configuration, CLI-generated migration instructions, required validation/concurrency work, object audit, and rollout prerequisites. Cloudflare deployment is not verified by the local production tests.

## Exact changed files

- `app/app/page.tsx`
- `app/ask-pathly-copilot.tsx`
- `app/connected-workspace.tsx`
- `app/copilot.css`
- `app/editor.tsx`
- `app/editorial.css`
- `app/entry-screen.tsx`
- `app/globals.css`
- `app/guided-setup.tsx`
- `app/marketing.css`
- `app/marketing.tsx`
- `app/marketing/ask-pathly-demo.tsx`
- `app/marketing/scroll-hero.tsx`
- `app/marketing/stories-data.ts`
- `app/marketing/student-stories.tsx`
- `app/marketing/what-is-pathly.tsx`
- `app/page.tsx`
- `app/pathly.tsx`
- `app/personalization.css`
- `app/record-detail.tsx`
- `app/scroll-story.css`
- `app/stories.css`
- `app/stories/[id]/page.tsx`
- `app/stories/page.tsx`
- `app/tutorial.css`
- `app/workspace-polish.css`
- `components/ui/attachment.tsx`
- `components/ui/sidebar.tsx`
- `components/ui/sonner.tsx`
- `docs/2026-09-28-product-polish.md`
- `public/stories/adaptive.svg`
- `public/stories/clinical.svg`
- `public/stories/dental.svg`
- `public/stories/planning.svg`
- `public/stories/rehabilitation.svg`
- `public/stories/research.svg`
- `supabase/README.md`
- `supabase/schema.sql`
- `supabase/tests/ownership.sql`
- `tests/marketing-browser.cjs`
- `tests/marketing.cjs`
- `tests/nonblocking-browser.cjs`
- `tests/qa-repair-browser.cjs`
- `tests/stories-browser.cjs`
- `tests/stories.cjs`

## Removed files

- `app/marketing/product-reveal.tsx`
- `components/ui/skeleton.tsx`
- `components/ui/spinner.tsx`
