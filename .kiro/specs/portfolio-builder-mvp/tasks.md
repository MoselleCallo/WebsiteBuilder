# Implementation Plan: Portfolio Builder MVP

## Overview

This plan brings the Portfolio Builder MVP from its current state (working Hero + About loop, stub Projects/Contact, duplicated types, blob URL images) to a fully featured application: consolidated types, all four section editors and canvas renderers, Data URI image pipeline, localStorage persistence, three-mode viewport preview, floating navigation bar, and standalone HTML export with property-based tests covering all 13 correctness properties. Tasks are ordered from highest to lowest MVP priority, so development can begin with the most critical functionality first.

---

## Tasks

- [x] 1. Create the Shared Types Module (`types/index.ts`)
  - Create `types/index.ts` and export `HeroSection`, `AboutSection`, `ProjectItem`, `ProjectsSection`, `SocialLink`, `ContactSection`, `EditorState`, `OpenState`, `ViewportMode`, and `DEFAULT_EDITOR_STATE` exactly as specified in the design's Data Models section
  - `HeroSection` must use `name`, `title`, `tagline`, `photo` fields (not the old `heading`/`desc`); layout is `"side" | "vertical" | "side-reverse"` — no `"cards"` value
  - `ProjectsSection` has an `items: ProjectItem[]` array and a fixed `layout: "cards"` field
  - `ContactSection` has `email`, `phone`, `location`, and `socialLinks: SocialLink[]` fields
  - `DEFAULT_EDITOR_STATE` initializes all fields to empty strings / null / empty arrays with `font: "inter"`, `theme: "Professional"`
  - Remove `"page"`, `"menu"`, `"view"` values from `OpenState` only after confirming zero references to those values exist in the codebase; Task 3 (type migration) must verify no file references these values before they are deleted. Add `"projectsSection"` and `"contactSection"`
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 2. Create validation utilities (`utils/validation.ts`)
  - Implement `isValidUrl`, `isValidEmail`, `isImageMimeType`, and `isImageSizeOk` in `utils/validation.ts` following the exact signatures and logic from the design's Validation Rules section
  - `isValidUrl`: uses the `URL` constructor; returns `true` only for `http:` or `https:` protocols; returns `false` for empty/whitespace strings
  - `isValidEmail`: tests `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
  - `isImageMimeType`: checks against the set `{image/jpeg, image/png, image/gif, image/webp, image/svg+xml}`
  - `isImageSizeOk`: returns `true` iff `bytes <= 5 * 1024 * 1024`
  - _Requirements: 2.9, 4.8, 5.5, 6.5, 12.1, 12.2, 12.3_

- [x] 3. Migrate all files from local type declarations to shared types
  - Update `app/page.tsx`: remove all local type declarations (`Hero`, `About`, `Projects`, `Contact`, `EditorState`, `OpenState`); import `EditorState`, `OpenState`, `ViewportMode`, `DEFAULT_EDITOR_STATE` from `@/types`
  - Update `components/Header.tsx`: remove local type declarations; import from `@/types`
  - Update `components/canvas/Canvas.tsx`: remove local type declarations; import from `@/types`; fix the name collision between the `Hero` type and the `Hero` component import (the component import should be aliased or renamed — e.g., `import HeroSection from "./sections/Hero"`)
  - Update `components/sidebar/Sidebar.tsx`: remove local type declarations; import from `@/types`
  - Update `components/sidebar/ThemeEditor.tsx`: remove local type declarations; import from `@/types`
  - Update `components/sidebar/HeaderEditor.tsx`: remove local type declarations; import from `@/types`
  - Update `components/sidebar/sectionEditor/HeroEditor.tsx`: remove local type declarations; import from `@/types`
  - Update `components/sidebar/sectionEditor/AboutEditor.tsx`: remove local type declarations; import from `@/types`
  - Verify no file references `"page"`, `"menu"`, or `"view"` as `OpenState` values before those values are removed from the type
  - After migration, run `npx tsc --noEmit` and resolve all TypeScript errors before proceeding
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 4. Migrate image uploads to the Data URI pipeline
  - [x] 4.1 Create a shared `readFileAsDataURI` helper inside `utils/imageUpload.ts` that wraps `FileReader.readAsDataURL` in a Promise, validates MIME type via `isImageMimeType` and size via `isImageSizeOk` before reading, and returns `{ dataUri: string } | { error: string }`
    - `utils/` and `types/` are new top-level directories being created in this project. Add them at the workspace root alongside `app/` and `components/` per the design spec.
  - [x] 4.2 Update `components/sidebar/HeaderEditor.tsx` logo upload to use `readFileAsDataURI`; show an inline error message string below the upload control on failure; store the Data URI in `editor.logo`
  - [x] 4.3 Update `components/sidebar/sectionEditor/HeroEditor.tsx` photo upload to use `readFileAsDataURI`; show inline error on failure; store Data URI in `editor.sections.hero.photo`
  - [x] 4.4 Update `components/sidebar/sectionEditor/AboutEditor.tsx` image upload to use `readFileAsDataURI`; show inline error on failure; store Data URI in `editor.sections.about.image`
  - Each upload control tracks `uploadError: string | null` in local component state (not in `EditorState`)
  - _Requirements: 2.4, 2.9, 3.1, 12.1, 12.2, 12.3, 12.4_

- [x] 5. Update HeroEditor and Hero canvas section for new fields
  - [x] 5.1 Rewrite `components/sidebar/sectionEditor/HeroEditor.tsx` to expose three separate text inputs: Name (`maxLength={50}`, maps to `hero.name`), Title (`maxLength={50}`, maps to `hero.title`), and Tagline (`maxLength={100}`, maps to `hero.tagline`)
    - Replace the old `heading`/`desc` inputs with these three fields
    - Update the layout selector to show three equal buttons: Side / Vertical / Side-Reverse (remove the Cards button); active state is derived from `editor.sections.hero.layout === "<value>"`
    - _Requirements: 2.1, 2.2, 2.3, 7.1_

  - [x] 5.2 Rewrite `components/canvas/sections/Hero.tsx` to read `hero.name`, `hero.title`, `hero.tagline`, `hero.photo` from `EditorState`
    - Render the name as the large `<h1>`, title below it, tagline below title
    - If name is empty, render an italicized muted placeholder text "Your Name" in the name region; same pattern for title and tagline
    - Support all three layouts: `"side"` (text left, photo right), `"vertical"` (stacked, text centered), `"side-reverse"` (photo left, text right)
    - Remove the `changeView` boolean prop entirely. Do NOT add a `viewportMode` prop — Hero renders responsively based on its container width only, which is already constrained by the Canvas viewport mode mapping.
    - If `hero.photo` is null, render a dashed placeholder box in the photo region
    - _Requirements: 2.1–2.12, 7.1, 7.2_

- [x] 6. Update AboutEditor and About canvas section
  - [x] 6.1 Rewrite `components/sidebar/sectionEditor/AboutEditor.tsx` to remove `layoutIsActive` and `setLayout` props entirely; derive all layout button active states solely from `editor.sections.about.layout`; clicking "Side" sets layout to `"side"`, "Side-Reverse" sets to `"side-reverse"`, "Vertical" sets to `"vertical"` — no separate boolean flag
    - _Requirements: 3.1, 7.1_

  - [x] 6.2 Update `components/canvas/sections/About.tsx` to remove the `layoutIsActive` prop; read `editor.sections.about.layout` directly to determine flex direction; all three layout variants (`"side"`, `"side-reverse"`, `"vertical"`) handled with conditional Tailwind classes
    - _Requirements: 3.1–3.5, 7.1, 7.2_

- [ ] 7. Implement ProjectsEditor and Projects canvas section
  - [ ] 7.1 Implement `components/sidebar/sectionEditor/ProjectsEditor.tsx`
    - "Add Project" button appends a new `ProjectItem` with `id: crypto.randomUUID()` and all string fields as empty strings, null image
    - Render each project as a collapsible card (controlled by local open state per item) with: Title input (`maxLength={100}`), Description textarea (`maxLength={500}`), Image upload using `readFileAsDataURI` with inline error, Link input with inline validation indicator (red border + error text beneath when non-empty and `!isValidUrl(link)`)
    - Delete button on each card removes the item by `id` from the `items` array
    - Layout selector shows four options (Side, Side-Reverse, Vertical, Cards) — the first three are visually greyed out and non-interactive; Cards is shown as active; a text label beneath reads "Projects always use cards layout"
    - _Requirements: 4.1, 4.2, 4.3, 4.8, 7.1, 12.1–12.4_

  - [ ] 7.2 Implement `components/canvas/sections/Projects.tsx`
    - If `items.length === 0`, render an empty fragment (nothing visible in canvas)
    - Otherwise render a responsive grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
    - Each card: image (if present, no placeholder), title (if present), description (if present), link rendered as `<a>` button only when `isValidUrl(link)` is true
    - _Requirements: 4.4, 4.5, 4.6, 4.7_

- [ ] 8. Implement ContactEditor and Contact canvas section
  - [ ] 8.1 Implement `components/sidebar/sectionEditor/ContactEditor.tsx`
    - Email input (`maxLength={254}`) with inline validation indicator: shows error when non-empty and `!isValidEmail(email)`
    - Phone input (`maxLength={254}`, optional)
    - Location input (`maxLength={254}`, optional)
    - "Add Social Link" button appends `{ id: crypto.randomUUID(), platform: "", url: "" }`
    - Each social link entry: Platform input (`maxLength={100}`) + URL input with inline validation indicator (red border + error text when non-empty and `!isValidUrl(url)`) + delete button
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.5_

  - [ ] 8.2 Implement `components/canvas/sections/Contact.tsx`
    - Render email region only when email is non-empty (omit region if empty, regardless of validation state)
    - Render phone region only when non-empty
    - Render location region only when non-empty
    - For each `SocialLink`: if `isValidUrl(url)` is true, render as `<a href={url}>` with a platform icon for recognized platforms (GitHub, LinkedIn, X/Twitter, Instagram, YouTube, Dribbble, Behance, Medium — use inline SVG icons) or text label + URL for unrecognized platforms; if URL is invalid, render platform name as text label only (no anchor)
    - _Requirements: 5.6, 6.2, 6.3, 6.4, 6.5, 6.6_

- [ ] 9. Wire Projects and Contact into Sidebar and Canvas
  - Update `components/sidebar/Sidebar.tsx`: import and render `ProjectsEditor` and `ContactEditor`; update the `OpenState` type usage to include `"projectsSection"` and `"contactSection"`; remove the old local `sect` array and `layoutIsActive`/`setLayout` props from the Sidebar (layout is now owned entirely by `EditorState`); update Sidebar's prop signature to explicitly remove `layoutIsActive` and `setLayout` from its interface — not just from internal calls
  - Update `components/canvas/Canvas.tsx`: import and render `Projects` and `Contact` section components; remove `layoutIsActive` prop entirely
  - Update `app/page.tsx`: remove the `layoutIsActive` and `setLayout` state; stop passing them to `Canvas` and `Sidebar`
  - _Requirements: 4.1–4.8, 5.1–5.8, 6.1–6.6_

- [ ] 10. Implement the FloatingNav component
  - [ ] 10.1 Create `components/canvas/FloatingNav.tsx` that accepts `editor: EditorState` as a prop
    - Compute visible sections using the pure rules from the design: hero visible when `name || title || tagline || photo`; about visible when `heading || desc || image`; projects visible when `items.length > 0`; contact visible when `email || phone || location || socialLinks.length > 0`
    - Render a `<nav>` with `position: sticky; top: 0; z-index: 50` as the **first child** inside the Canvas scroll container
    - Each `<a href="#hero">`, `<a href="#about">`, etc. using `scroll-behavior: smooth`
    - Apply theme colors via CSS custom properties (`var(--color-primary)`, etc.) inherited from the Canvas wrapper
    - _Requirements: 14.1, 14.2, 14.3, 14.6, 14.7_

  - [ ] 10.2 Render `FloatingNav` as the first child inside the scrollable div in `Canvas.tsx`, and add `id="hero"`, `id="about"`, `id="projects"`, `id="contact"` to the corresponding section wrapper elements in the Canvas
    - Add `scroll-behavior: smooth` to the canvas scroll container div
    - _Requirements: 14.1, 14.3_

- [ ] 11. Expand viewport preview from boolean to three-mode selector
  - Update `app/page.tsx`: replace `changeView: boolean` state with `viewportMode: ViewportMode` (default `"mobile"`); stop passing `changeView`/`setChangeView` to `Header` and `Canvas`; pass `viewportMode`/`setViewportMode` instead
  - Update `components/Header.tsx`: replace the single mobile-toggle button with three viewport buttons (Mobile / Tablet / Desktop) that set `viewportMode`; keep the existing icon style; highlight the active mode
  - Update `components/canvas/Canvas.tsx`: replace the `changeView` boolean width logic with the three-way mapping: `"mobile"` → `w-[375px]`, `"tablet"` → `w-[768px]`, `"desktop"` → `w-[1280px]`; pass `viewportMode` down to section components where needed and remove all remaining `changeView` references
  - Update section components (`Hero.tsx`, `About.tsx`) to remove the `changeView` prop if still present; responsive layout is now controlled by the canvas container width only
  - _Requirements: 9.1–9.7_

- [ ] 12. Create storage utilities and wire localStorage persistence
  - [ ] 12.1 Create `utils/storage.ts` with `saveEditorState(state: EditorState): void` and `loadEditorState(): EditorState | null` following the exact structural validation logic from the design's localStorage Persistence Design section
    - `loadEditorState` must validate all required keys: `sections.hero`, `sections.about`, `sections.projects`, `sections.contact`, `sections.contact.location` (undefined check), `font`, `theme` — return `null` if any are missing or if JSON.parse throws
    - All storage calls wrapped in try/catch; silent no-op when localStorage is unavailable (SSR guard)
    - _Requirements: 11.1–11.6_

  - [ ] 12.2 Update `app/page.tsx` to use persistence: initialize `editor` state with `useState<EditorState>(() => loadEditorState() ?? DEFAULT_EDITOR_STATE)`; add a `useEffect` that debounces `saveEditorState(editor)` at 500ms on every `editor` change (return the clearTimeout cleanup)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

- [ ] 13. Implement the export pipeline
  - [ ] 13.1 Create `utils/export.ts` with `escapeHtml(raw: string): string` that replaces `&`→`&amp;`, `<`→`&lt;`, `>`→`&gt;`, `"`→`&quot;`, `'`→`&#39;`
    - Create `collectInvalidLinks(state: EditorState): string[]` that returns every non-empty `ProjectItem.link` and `SocialLink.url` that fails `isValidUrl`
    - _Requirements: 13.5, 13.7_

  - [ ] 13.2 Implement `generateHTML(state: EditorState, omitInvalidLinks?: boolean): string` in `utils/export.ts`
    - The function is **pure** — no side effects, no DOM access
    - Inline all CSS (no `<link>` tags, no `@import` of external URLs); CSS must include `:root` with all theme custom properties, responsive breakpoints at 640px and 1024px, floating nav styles, section layout classes, `scroll-behavior: smooth`, and `overflow-wrap: break-word`
    - All user text passed through `escapeHtml` before insertion
    - Images embedded as their Data URI `src` values verbatim; if image is null, the region is omitted
    - Sections with no user content (per the same rules as `FloatingNav`) are omitted from the output entirely
    - Floating nav in the exported page includes only sections with content; uses `href="#section-id"` anchors; colors derived from the selected theme palette
    - Each section element has the correct `id` attribute: `id="hero"`, `id="about"`, `id="projects"`, `id="contact"`
    - Layout-aware: inspects each section's `layout` field and emits the corresponding CSS class
    - Font applied via `font-family` in `:root` using system font stacks (Inter → `system-ui, sans-serif`; Poppins → `'Trebuchet MS', sans-serif`; Montserrat → `'Century Gothic', Futura, sans-serif`) — no external font requests
    - If `omitInvalidLinks` is true, project links and social URLs that fail `isValidUrl` are rendered as text-only (no `<a>` wrapper)
    - _Requirements: 13.1–13.7, 14.4, 14.5_

  - [ ] 13.3 Create the Export Warning Modal component and wire the export flow in `app/page.tsx`
    - Add a simple modal component (inline in `page.tsx` or as `components/ExportWarningModal.tsx`) that lists invalid URLs and provides "Proceed (omit bad links)" and "Cancel" buttons
    - In `app/page.tsx`, define `onExport`: call `collectInvalidLinks(editor)`; if non-empty, open the modal; if user proceeds (or no invalid links), call `generateHTML(editor, true)`, create a `Blob`, and trigger a download via a temporary `<a download="portfolio.html">` element; revoke the object URL after click
    - Update `components/Header.tsx`: replace the "Publish" button with an "Export" button that calls the `onExport` callback; `onExport` is passed as a prop from `page.tsx`
    - _Requirements: 13.1, 13.7_

- [ ] 14. Write property-based tests for validation utilities
  - [ ]* 14.1 Write property tests for validation utilities
    - Install `fast-check` as a devDependency: `npm install --save-dev fast-check@latest` — do not pin to a specific version
    - After installing, run `npm run lint` to confirm no ESLint regressions from the new devDependency
    - Create `utils/__tests__/validation.test.ts`
    - **Property 1: Image file validation accepts all valid image MIME types** — for any MIME type in the accepted set with size ≤ 5 MB, both functions return true; outside the set or over 5 MB returns false
    - **Property 2: URL validator correctly classifies http/https URLs** — for any string parseable by `URL` constructor with `http:` or `https:` protocol, `isValidUrl` returns true; for any unparseable string or non-http(s) protocol, returns false
    - Tag: `// Feature: portfolio-builder-mvp, Property 1: Image file validation` and `Property 2: URL validator`
    - Each property runs minimum 100 iterations
    - _Requirements: 2.9, 4.8, 5.5, 12.1, 12.2, 12.3_

- [ ] 15. Write property test for FloatingNav visibility
  - [ ]* 15.1 Write property test for FloatingNav visible section computation
    - Create `components/canvas/__tests__/FloatingNav.test.ts`
    - **Property 12: Floating nav includes links only for sections with content** — for any `EditorState`, the computed visible section set equals exactly the set of sections meeting the non-empty content rules
    - Extracting the visibility logic into a standalone pure function `getVisibleSections(editor: EditorState): string[]` is recommended for testability but not required — the property test may alternatively verify the component's rendered output. The key deliverable is the passing property test, not the extraction itself.
    - Tag: `// Feature: portfolio-builder-mvp, Property 12: Floating nav section visibility`
    - _Requirements: 14.2, 14.6_

- [ ] 16. Write EditorState serialization round-trip test
  - [ ] 16.1 Write property test for EditorState serialization round-trip
    - Create `utils/__tests__/storage.test.ts`
    - **Property 8: EditorState serialization round-trip** — for any valid `EditorState` (including non-null Data URI strings in image fields), `JSON.parse(JSON.stringify(state))` produces a deeply equal object
    - Write example-based unit tests: `loadEditorState` returns null for corrupt JSON; `loadEditorState` returns null when key is absent; `loadEditorState` returns null when required key is missing from parsed object
    - Tag: `// Feature: portfolio-builder-mvp, Property 8: EditorState serialization round-trip`
    - _Requirements: 11.1, 11.2, 11.5, 11.6_

- [ ] 17. Write property tests for export utilities
  - [ ]* 17.1 Write property tests for `escapeHtml` and `collectInvalidLinks`
    - Create `utils/__tests__/export.test.ts`
    - **Property 10: escapeHtml correctly escapes all five special characters** — for any string containing `&`, `<`, `>`, `"`, `'`, `escapeHtml(s)` contains none of those literal characters; define a test-only `unescapeHtml` helper and verify round-trip recovery
    - **Property 11: collectInvalidLinks returns exactly the invalid links** — for any `EditorState`, every string in the result fails `isValidUrl`, and no valid URL appears in the result
    - Tag: `// Feature: portfolio-builder-mvp, Property 10: escapeHtml` and `Property 11: collectInvalidLinks`
    - _Requirements: 13.5, 13.7_

  - [ ]* 17.2 Write property tests for `generateHTML`
    - Add to `utils/__tests__/export.test.ts`
    - **Property 3: Empty export fields produce no corresponding HTML regions** — for any `EditorState` where `hero.name` is empty, `generateHTML` output contains no non-empty name heading element; same for `hero.title` and `hero.tagline` independently
    - **Property 9: Generated HTML contains no external stylesheet or image references** — for any `EditorState`, the output contains no `<link rel="stylesheet"`, no `@import` with an external URL, and no `<img src=` whose value does not start with `data:`
    - **Property 13: Theme CSS variables in generated HTML match the selected palette** — for any valid theme name, the output contains a `:root {` block whose `--color-main` equals `colorPalettes[t].main`, and likewise for every other CSS custom property in that palette
    - Tag each test: `// Feature: portfolio-builder-mvp, Property 3`, `Property 9`, `Property 13`
    - _Requirements: 2.10–2.12, 8.5, 8.7, 13.2, 13.3, 13.4, 14.7_

- [ ] 18. Write property tests for list operations
  - [ ]* 18.1 Write property test for project list add/remove
    - Create `utils/__tests__/projectList.test.ts`
    - **Property 4: Project list add/remove preserves all other items** — for any `ProjectsSection` with `n` items and any valid removal index `i`, removing item at index `i` produces a list of length `n - 1` with all other items in original order; adding a new item produces a list of length `n + 1` with the last element having all-empty string fields
    - Tag: `// Feature: portfolio-builder-mvp, Property 4: Project list add/remove`
    - _Requirements: 4.1, 4.2_

  - [ ]* 18.2 Write property test for social link list add/remove
    - Add to `utils/__tests__/projectList.test.ts` or create `utils/__tests__/socialLinks.test.ts`
    - **Property 5: Social link list add/remove preserves all other entries** — for any `ContactSection.socialLinks` with `n` entries and any valid removal index `i`, removing at index `i` produces a list of length `n - 1` with all other entries in original order; adding a new entry produces a list of length `n + 1`
    - Tag: `// Feature: portfolio-builder-mvp, Property 5: Social link add/remove`
    - _Requirements: 5.1, 5.2_

- [ ] 19. Checkpoint — verify the full application compiles and core flows work
  - Run `npx tsc --noEmit` and confirm zero TypeScript errors
  - Run `npx next build` and confirm a clean production build
  - Manually verify end-to-end: edit all four sections → see canvas update → upload an image → refresh page → confirm data restored → click Export → confirm HTML file downloads and opens in browser with all content
  - Ensure all tests pass (`npx vitest --run` or `npx jest --no-coverage`), ask the user if any questions arise

---

## Deferred Tasks

- **[DEFERRED] Property 7: Viewport mode preserves EditorState** — Deferred because the property is structurally guaranteed by having `viewportMode` and `editor` as independent `useState` calls — no code path can mutate `EditorState` when viewport mode changes. _Requirements: 9.7_

- **[DEFERRED] Property 6: Layout changes are section-isolated** — Deferred because the immutable spread pattern used in every `setEditor` call structurally prevents cross-section mutation — the risk this property tests against is near-zero given the existing code pattern. _Requirements: 7.3_

---

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP; all correctness properties remain testable once the core utilities exist
- Task 16.1 (EditorState serialization round-trip) is required, not optional — it tests a real failure mode where Data URI strings in nested arrays can silently corrupt on round-trip
- Property tests require `fast-check` installed as a devDependency (added in task 14.1)
- Each property test file should tag its tests with the format `// Feature: portfolio-builder-mvp, Property N: <title>` and configure `fc.assert` with `{ numRuns: 100 }` (or higher) for minimum iteration coverage
- The `layoutIsActive` boolean and `changeView` boolean are fully removed from the app after tasks 6, 9, and 11 — no component should reference them after task 11
- `URL.createObjectURL` is entirely replaced by `FileReader.readAsDataURL` after task 4 — no image field in `EditorState` should ever hold a `blob:` URL after this point
- The `generateHTML` function in task 13.2 is intentionally implemented as a pure string-building function with no DOM access — this is critical for testability (Properties 3, 9, 10, 13)
- Tasks 7, 8, and 9 can be worked in any internal order relative to each other, but all must complete before task 13 (export depends on all sections being final)
- `utils/` and `types/` are new top-level directories; create them at the workspace root alongside `app/` and `components/`

---

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2", "3"] },
    { "id": 2, "tasks": ["4.1"] },
    { "id": 3, "tasks": ["4.2", "4.3", "4.4"] },
    { "id": 4, "tasks": ["5.1", "6.1", "7.1", "8.1"] },
    { "id": 5, "tasks": ["5.2", "6.2", "7.2", "8.2"] },
    { "id": 6, "tasks": ["9", "10.1"] },
    { "id": 7, "tasks": ["10.2", "11"] },
    { "id": 8, "tasks": ["12.1"] },
    { "id": 9, "tasks": ["12.2"] },
    { "id": 10, "tasks": ["13.1"] },
    { "id": 11, "tasks": ["13.2"] },
    { "id": 12, "tasks": ["13.3"] },
    { "id": 13, "tasks": ["14.1", "15.1"] },
    { "id": 14, "tasks": ["16.1", "17.1"] },
    { "id": 15, "tasks": ["17.2", "18.1", "18.2"] }
  ]
}
```
