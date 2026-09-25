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
