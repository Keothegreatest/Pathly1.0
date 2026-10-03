# Applicant stories refinement

The public stories directory now uses a compact editorial introduction, connected-journey graphics, clearer applicant identity, existing metrics, and a before / insight / next-step narrative. All ten profiles remain explicitly illustrative; no customer claims, metrics, or admissions results were invented.

Reusable `StoryJourneyMap`, `ApplicantMetrics`, and `StoriesCTA` components live in `app/marketing/story-presentation.tsx`. Shared story cards improve the homepage preview as well as the directory. The detail page uses the same visual language. Styling is scoped in `app/applicant-stories.css` and reuses existing brand tokens.

The filter assistance button focuses the applicant-type control. Cards provide one keyboard-accessible story link with a full-card pointer target. The final profile CTA uses the existing `/app` entry route. URL filters, history, refresh, and retained-filter return links remain intact.

Verification passed: TypeScript, ESLint, stories and marketing unit checks, production build, stories browser suite, and marketing browser regression suite. Browser checks covered 375, 430, 768, 1024, 1280, and 1440 widths, 3/2/1-column layouts, mobile chip scrolling, keyboard interaction, reduced motion, empty results, all ten detail routes, and absence of browser errors or public-page private-storage reads. Desktop and mobile screenshots were reviewed.

No dependencies, database schema, authentication, private application logic, or new personal-data collection changed. Local production behavior was verified; the Cloudflare deployment was not verified as part of this change.
