# Public homepage: editorial student journey

The public homepage tells a student-centered story: recognize scattered information, see the whole journey, preserve meaningful experiences, decide what to do next, and prepare over time. The visual reference informed typography scale, whitespace and restraint; no reference-site text, graphics or layout were copied.

## Presentation and components

- `app/marketing.tsx` composes the hero, recognition, four numbered chapters, future-self section, optional demos and final CTA.
- `app/marketing/product-story.tsx` is the reusable chapter and real-interface capture component.
- `app/editorial.css` scopes the new composition to public surfaces. Forest, cream and restrained terracotta continue the existing visual system.
- `app/marketing/marketing-shell.tsx` supplies shared public navigation and the four-group footer.
- `app/page.tsx` supplies outcome-led metadata and preserves legacy workspace redirects.
- Existing `AskPathlyDemo`, `ProductDemo` and their authored fixture data remain usable under native, keyboard-accessible disclosure sections. The live application is not embedded.

The three main CTA moments consistently say **Start your journey**. Navigation uses the existing `/signup` and `/login` entry aliases. These still redirect to the name-based `/app` workspace; no authentication logic was changed. The public page explicitly explains browser-local storage and that an account is not required.

## Real product images

`public/marketing/{home,experiences,actions,application}.webp` are lossless captures of the real application, made in an isolated local browser with fictional records from the existing example dataset. They show Home, an experience card, real computed recommendations, and application preparation. Requirement records were omitted from the screenshot fixture rather than inventing verified school sources. No real student's data was used.

Captions identify the records as illustrative; values are not customer metrics or promises. The screenshots are static, use accurate dimensions to reserve layout space, have descriptive alt text, and load lazily. They are separate from the interactive examples.

## Public/private boundary

The public page never imports production assistant services, dashboard selectors, browser storage, or model providers. Screenshots are static assets. Interactive examples only change component state and use marketing-owned fictional fixtures. They never read or write a visitor's workspace, call an assistant endpoint, or run a model.

The real application and its honest local-guide disclosures remain unchanged. No provider, account system, database field, dependency or migration was added.

## Accessibility and verification

Fluid typography, mobile reflow, visible keyboard focus, semantic headings, descriptive images, native disclosure controls, readable contrast and reduced-motion behavior are retained. Real screenshots have nearby descriptions; they are not the sole way to understand a feature.

Verification includes TypeScript, lint, production build, copilot regression tests and public dependency-boundary tests. `tests/marketing-browser.cjs` covers 1920, 1440, 1366, 768, 430 and 375 pixel viewports; heading bounds; image loading; personal-data isolation; five Ask Pathly responses; six product views; mobile navigation; anchor destinations; existing entry redirects; and reduced motion.

Run the browser suite against a local dev server, providing `PATHLY_PLAYWRIGHT_MODULE` if Playwright is installed outside the project. Optional `PATHLY_BASE_URL` and `PATHLY_BROWSER_CHANNEL` configure the target and browser.

## Conversion refinement

The dashboard reveal now follows the recognition section immediately. The homepage adds a question-led “Less guessing” section, a six-stage connected journey, a before/after workspace comparison, and stronger evidence-based Next Best Actions copy. Existing product captures and interactive demos are reused.

Public sign-in links and the two closing footer sentences were removed; login/signup routes remain unchanged. Primary CTAs now consistently use “Get started.” The final example link opens the existing example disclosure before navigating to it.

The new sections live in `app/marketing/journey-benefits.tsx`, with responsive styling in `app/editorial.css`. On mobile, the journey becomes vertical and the comparison stacks. No app logic, database schema, dependency, payment flow, or screenshot data changed.

Assumption: existing `/signup` remains the correct entry point, even though this version starts a browser-local workspace without authentication. Later, validate the order and wording with real pre-health students; do not add fabricated social proof or make unsupported claims.

## Interactive product narrative

The public homepage now has two intentional sticky moments on desktop: workflow fragments resolving into the real Home interface, and a six-step product tour whose current image follows the visible story. No wheel/touch events are captured and scrolling is never locked. Existing navigation, routes, assistant logic and workspace data are unchanged.

- `scroll-hero.tsx` introduces the pre-health problem and reuses `WorkflowFragments` in recognition.
- `use-scroll-narrative.ts` coordinates scene progress with one passive scroll listener, IntersectionObserver visibility tracking, and at most one queued animation frame. DOM reads are batched before style writes; React does not render per scroll frame. Observers/listeners are cleaned up.
- `product-reveal.tsx` provides the large Home reveal and hover/focus/touch callouts. Descriptions remain available without hover.
- `scroll-product-tour.tsx` pairs Experiences, Schools, Reflections, Goals, Application and Next Best Actions with actual interface captures. Buttons provide direct keyboard-accessible navigation as an alternative to scrolling.
- `pathly-purpose.tsx` explains why the product exists and names pre-health pathways without claiming a verified requirements database.
- `scroll-story.css` scopes transforms, opacity, responsive compositions and reduced-motion fallbacks.

The comparison is explicitly an illustrative workflow, not a testimonial. No adoption numbers, admissions outcomes, generative AI claims or student endorsements were added.

Schools, reflections and goals now have real interface captures from the same isolated fictional record setup. The smaller product captures were re-exported at double pixel density as lossless WebP for clearer large previews. No live records are loaded on the public page.

Below 1000px or with reduced motion, the tour is unpinned and each story displays its own image. Scroll-scrubbed transforms are disabled; content remains readable. Motion preference changes are handled during the session. Static content also remains visible before enhancement.

Browser regression checks now include hero progress changing with scroll, all six active tour steps, keyboard dashboard callouts and switching desktop to reduced motion, alongside the previous responsive, routing, demo and storage-isolation checks.

## Student Stories

`/stories` and `/stories/[id]` are public marketing routes. The shared `student-stories.tsx` collection also powers the homepage preview; `stories-data.ts` owns the five fictional examples, program/applicant/profile taxonomy, URL parsing, filtering, and deterministic related-story ranking. No workspace records, API calls, or database changes are involved.

Filters use AND across program, applicant type, and every selected profile characteristic. Unknown query values are ignored. Query-only native history updates keep controls immediate without server requests; the URL remains the directory's source of truth and supports refresh and back/forward. Homepage preview state is local, then preserved in its directory and detail links. Detail pages retain filters in the return link.

All examples have `verified: false`. Page-level disclosures, card labels, quotes, and outcome text explicitly identify fictional content. These are not customer testimonials or admissions evidence. Replacing examples with consented real stories requires editing the centralized records AND reviewing route-level disclosure/metadata; changing a boolean alone is not a verification workflow.

Program buttons use pressed states and a checkmark, native labeled select/checkbox controls support keyboard input, results counts are announced politely, no-match states offer a reset, and transitions respect reduced motion. Controls wait for hydration before accepting edits. `StoryCollection.onChange` centralizes filter/reset interactions; story links are centralized in `StoryCard`, so future analytics can be wired there without introducing a tracking dependency today.

Validation: `node tests/stories.cjs`; `node tests/stories-browser.cjs` with PATHLY_PLAYWRIGHT_MODULE set if needed. Browser coverage includes homepage-to-directory-to-detail, history, refresh, all programs, combined filters, no matches, invalid parameters/routes, keyboard input, reduced motion, mobile navigation, six viewport widths, and zero private IndexedDB access.
