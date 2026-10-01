# Design Document: Portfolio Builder MVP

## Overview

The Portfolio Builder MVP is a single-page, client-side website authoring tool built on Next.js 13.5 (App Router), React 18, TypeScript, and Tailwind CSS 3.3. The user authors a portfolio in a sidebar editor and sees changes reflected in real time on a canvas preview. When satisfied, they export a fully self-contained HTML file.

This design document covers the changes and additions required to bring the MVP to completion from the current codebase state. The current code has a working Hero + About editing loop, a stub for Projects and Contact, and duplicated TypeScript types across every file. The design is organized around six cross-cutting concerns:

1. Consolidating types into a single canonical module
2. Completing the four section editors and their canvas renderers
3. Replacing `URL.createObjectURL` with Data URI storage so images survive localStorage and export
4. Wiring localStorage persistence with debounced auto-save
5. Expanding the viewport preview controls from a boolean toggle to a three-mode selector
6. Implementing the standalone HTML export pipeline

---

## Architecture

### Component Tree

```
app/page.tsx  (root "use client", owns all state)
├── components/Header.tsx
│     viewport-mode toggle, export button trigger
├── components/canvas/Canvas.tsx
│     injects CSS custom properties, renders sections
│     ├── components/canvas/FloatingNav.tsx           [NEW]
│     ├── components/canvas/sections/Hero.tsx         [MODIFY]
│     ├── components/canvas/sections/About.tsx        [MODIFY]
│     ├── components/canvas/sections/Projects.tsx     [IMPLEMENT]
│     └── components/canvas/sections/Contact.tsx      [IMPLEMENT]
└── components/sidebar/Sidebar.tsx
      ├── components/sidebar/ThemeEditor.tsx          [NO CHANGE]
      ├── components/sidebar/HeaderEditor.tsx         [MODIFY — Data URI]
      └── (section editors)
            ├── components/sidebar/sectionEditor/HeroEditor.tsx     [MODIFY]
            ├── components/sidebar/sectionEditor/AboutEditor.tsx    [MODIFY]
            ├── components/sidebar/sectionEditor/ProjectsEditor.tsx [IMPLEMENT]
            └── components/sidebar/sectionEditor/ContactEditor.tsx  [IMPLEMENT]
```

### New Utility Modules

```
types/index.ts          Shared_Types_Module — all canonical types
utils/validation.ts     isValidUrl(), isValidEmail(), isImageFile(), isImageSizeOk()
utils/storage.ts        loadEditorState(), saveEditorState()
utils/export.ts         generateHTML(), collectInvalidLinks(), escapeHtml()
```

### Data Flow

```
User interaction
      │
      ▼
Sidebar editor components
      │  calls setEditor (prop-drilled from page.tsx)
      ▼
EditorState (useState in page.tsx)
      │
      ├──► useEffect (debounced) → localStorage via utils/storage.ts
      │
      └──► Canvas (prop: editor)
                │
                ├──► FloatingNav  (derives visible sections from editor)
                └──► Section components (Hero, About, Projects, Contact)

Export button (in Header)
      │
      ▼
collectInvalidLinks(editor) → if any → ExportWarningModal → user confirm
      │
      ▼
generateHTML(editor) → Blob → URL.createObjectURL → <a download> click
```

State management uses plain `useState` + prop-drilling throughout — appropriate for this component count and a good React learning exercise. No Context or Redux is introduced.

---

## Data Models

All canonical types live in `types/index.ts`. Every other file imports from this module and declares no local duplicates.

```typescript
// types/index.ts

import { colorPalettes } from "@/app/theme";

// ── Section types ──────────────────────────────────────────────

export type HeroSection = {
  name: string;        // 0–50 chars; shown as the large heading
  title: string;       // 0–50 chars; role / job title line
  tagline: string;     // 0–100 chars; short descriptive line
  photo: string | null; // Data URI or null
  layout: "side" | "vertical" | "side-reverse";
};

export type AboutSection = {
  heading: string;     // 0–unlimited (display heading)
  desc: string;        // multi-line, preserves \n
  image: string | null; // Data URI or null
  layout: "side" | "vertical" | "side-reverse";
};

export type ProjectItem = {
  id: string;           // nanoid / crypto.randomUUID — stable React key
  title: string;        // 0–100 chars
  description: string;  // 0–500 chars
  image: string | null; // Data URI or null
  link: string;         // raw user input; validated separately
};

export type ProjectsSection = {
  items: ProjectItem[];
  layout: "cards"; // fixed — always "cards", not user-selectable
};

export type SocialLink = {
  id: string;        // stable React key
  platform: string;  // 0–100 chars; free-form
  url: string;       // raw user input; validated separately
};

export type ContactSection = {
  email: string;         // validated; required for display
  phone: string;         // optional
  location: string;      // optional
  socialLinks: SocialLink[];
};

// ── Root EditorState ──────────────────────────────────────────

export type EditorState = {
  sections: {
    hero: HeroSection;
    about: AboutSection;
    projects: ProjectsSection;
    contact: ContactSection;
  };
  font: "inter" | "poppins" | "montserrat";
  theme: keyof typeof colorPalettes;
  logo: string | null; // Data URI or null
};

// ── UI state types ────────────────────────────────────────────

export type OpenState =
  | "font"
  | "palette"
  | "heroSection"
  | "aboutSection"
  | "projectsSection"
  | "contactSection"
  | null;

export type ViewportMode = "mobile" | "tablet" | "desktop";

// ── Default state ─────────────────────────────────────────────

export const DEFAULT_EDITOR_STATE: EditorState = {
  sections: {
    hero: {
      name: "",
      title: "",
      tagline: "",
      photo: null,
      layout: "side",
    },
    about: {
      heading: "",
      desc: "",
      image: null,
      layout: "side",
    },
    projects: {
      items: [],
      layout: "cards",
    },
    contact: {
      email: "",
      phone: "",
      location: "",
      socialLinks: [],
    },
  },
  font: "inter",
  theme: "Professional",
  logo: null,
};
```

**Migration note:** The current codebase uses `heading`/`desc` for the Hero section. The migration renames these to `name`/`title`/`tagline` (splitting the single `heading` into three distinct fields per Requirement 2). The `layout` field on `HeroSection` is also corrected to `"side" | "vertical" | "side-reverse"` to match the per-section layout spec (Requirement 7.1), removing the invalid `"cards"` value that was present in the old type.

---

## Components and Interfaces

### `types/index.ts` (Shared_Types_Module)

- Single export of all types listed above.
- All other files replace their local type declarations with `import { ... } from "@/types"`.
- The `colorPalettes` import is the only cross-module dependency (needed to type `theme`).

### `utils/validation.ts`

```typescript
export function isValidUrl(value: string): boolean
  // Returns true iff value is a non-empty string that parses as a URL
  // with protocol http: or https: using the URL constructor.
  // Returns false for empty strings, relative URLs, and any other protocol.

export function isValidEmail(value: string): boolean
  // Returns true iff value matches /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  // (local-part @ domain with at least one dot in domain)

export function isImageMimeType(mimeType: string): boolean
  // Returns true iff mimeType is one of:
  // "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"

export function isImageSizeOk(bytes: number): boolean
  // Returns true iff bytes <= 5 * 1024 * 1024  (5 MB)
```

### `utils/storage.ts`

```typescript
const STORAGE_KEY = "portfolio-builder-mvp-state";

export function saveEditorState(state: EditorState): void
  // JSON.stringifies and writes to localStorage under STORAGE_KEY.
  // Silent no-op if localStorage is unavailable (SSR guard).

export function loadEditorState(): EditorState | null
  // Reads from localStorage and JSON.parses.
  // Returns null if key absent, JSON.parse throws, or the resulting
  // object fails structural validation (missing required keys).
  // Never throws.
```

### `utils/export.ts`

```typescript
export function escapeHtml(raw: string): string
  // Replaces &→&amp;  <→&lt;  >→&gt;  "→&quot;  '→&#39;

export function collectInvalidLinks(state: EditorState): string[]
  // Returns array of every link string in state that fails isValidUrl:
  //   state.sections.projects.items[*].link (if non-empty)
  //   state.sections.contact.socialLinks[*].url (if non-empty)

export function generateHTML(state: EditorState): string
  // Pure function. Returns a complete, self-contained HTML document string.
  // See "Export Pipeline" section for full specification.
```

### `app/page.tsx` (root component)

State shape changes:
- `changeView: boolean` → `viewportMode: ViewportMode` (default `"mobile"`)
- `layoutIsActive: boolean` removed — the About layout is now captured entirely in `editor.sections.about.layout`; the canvas reads layout directly from state
- `editor` gains the full `EditorState` shape with the new section types

The `useEffect` for auto-save is added here:

```typescript
useEffect(() => {
  const timer = setTimeout(() => saveEditorState(editor), 500);
  return () => clearTimeout(timer);
}, [editor]);
```

On mount, `useState` initializer attempts `loadEditorState() ?? DEFAULT_EDITOR_STATE`.

### `components/Header.tsx`

Changes:
- Accepts `viewportMode: ViewportMode` and `setViewportMode` instead of `changeView`/`setChangeView`
- Renders three viewport toggle buttons (Mobile / Tablet / Desktop icons) instead of a single toggle
- Renders an "Export" button (replacing the "Publish" stub) that calls `onExport` callback
- `onExport` is defined in `page.tsx`: runs `collectInvalidLinks`, shows modal if needed, otherwise calls `generateHTML` and triggers download

### `components/canvas/Canvas.tsx`

Changes:
- Accepts `viewportMode: ViewportMode` instead of `changeView: boolean`
- Width mapping:
  - `"mobile"` → `w-[375px]`
  - `"tablet"` → `w-[768px]`
  - `"desktop"` → `w-[1280px]`
- Removes `layoutIsActive` prop — About layout is read from `editor.sections.about.layout`
- Renders `FloatingNav` as the sticky navigation element
- Renders `Projects` and `Contact` sections

### `components/canvas/FloatingNav.tsx` (new)

Props: `editor: EditorState`, `theme: keyof typeof colorPalettes`

Logic: derives the visible section list from the editor state:
- Hero: visible if `name || title || tagline || photo`
- About: visible if `heading || desc || image`
- Projects: visible if `items.length > 0`
- Contact: visible if `email || phone || location || socialLinks.length > 0`

Renders a `<nav>` with `position: sticky; top: 0; z-index: 50` (or fixed inside the canvas scroll container) using theme CSS custom properties for colors. Each link is an `<a href="#section-id">` that triggers smooth scroll via `scroll-behavior: smooth` on the canvas container.

Section anchor IDs: `hero`, `about`, `projects`, `contact`.

### `components/canvas/sections/Hero.tsx` (modify)

- Reads `editor.sections.hero.name`, `.title`, `.tagline`, `.photo`
- Renders placeholder text (italicized, muted) when a field is empty
- Layout options: `"side"` (text left, photo right), `"vertical"` (stacked centered), `"side-reverse"` (photo left, text right)
- Photo region: if `photo` is null, renders a dashed placeholder box

### `components/canvas/sections/About.tsx` (modify)

- Remove `layoutIsActive` prop — read layout directly from `editor.sections.about.layout`
- `whitespace-pre-line` class preserved on description to keep line breaks

### `components/canvas/sections/Projects.tsx` (implement)

- If `items.length === 0`, renders nothing in the Canvas (empty fragment). The Projects section editor in the sidebar remains visible at all times so the user can always activate the "Add Project" control regardless of whether any items exist.
- Otherwise renders a responsive grid: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`
- Each `ProjectItem` card: image (if present), title (if present), description (if present), link rendered as a button/anchor (only if `isValidUrl(link)`)
- Card image: `<img src={item.image} />` when present; no placeholder shown in canvas (card simply omits the image area)

### `components/canvas/sections/Contact.tsx` (implement)

- Renders email (if non-empty and `isValidEmail(email)`), phone (if non-empty), location (if non-empty)
- Renders social links list: for each `SocialLink` with a valid URL, renders either a platform icon (for recognized platforms) or a text label + URL
- Recognized platforms with icons: GitHub, LinkedIn, X/Twitter, Instagram, YouTube, Dribbble, Behance, Medium (SVG icons inlined)
- Invalid URLs are not rendered as links (display platform name only)

### `components/sidebar/sectionEditor/HeroEditor.tsx` (modify)

- Three separate inputs: Name (maxLength 50), Title (maxLength 50), Tagline (maxLength 100)
- Layout selector: Side / Vertical / Side-Reverse (three equal buttons, replacing old Side/Vertical/Cards)
- Image upload: migrated to `FileReader.readAsDataURL` (see Image Handling Pipeline)

### `components/sidebar/sectionEditor/AboutEditor.tsx` (modify)

- Remove `layoutIsActive` / `setLayout` props — layout is entirely in EditorState
- Layout selector: Side / Side-Reverse / Vertical (three equal buttons). Each button's active visual state is derived solely from `editor.sections.about.layout === "<value>"` — no separate local toggle flag. Clicking "Side-Reverse" sets `about.layout` to `"side-reverse"` in EditorState; the button highlights because the stored value matches.
- Image upload: migrated to Data URI

### `components/sidebar/sectionEditor/ProjectsEditor.tsx` (implement)

- "Add Project" button → appends a new `ProjectItem` with `id: crypto.randomUUID()`, all fields empty
- Each project rendered as a collapsible card with:
  - Title input (maxLength 100)
  - Description textarea (maxLength 500)
  - Image upload (Data URI pipeline)
  - Link input with inline validation indicator (red border + error text if `isValidUrl` fails and input is non-empty)
  - Delete button → removes item from array by id
- Layout selector rendered showing four options ("side", "side-reverse", "vertical", "cards") — "side", "side-reverse", and "vertical" are visually disabled (greyed out, non-interactive); "cards" is shown as active. A text label beneath reads "Projects always use cards layout". The selector reads `section.projects.layout` for the active state (always `"cards"`); clicking the disabled options has no effect.

### `components/sidebar/sectionEditor/ContactEditor.tsx` (implement)

- Email input with validation indicator (shows error if non-empty and `!isValidEmail(email)`)
- Phone input (optional, maxLength 254)
- Location input (optional, maxLength 254)
- Social links list:
  - "Add Social Link" button → appends `{ id: crypto.randomUUID(), platform: "", url: "" }`
  - Each entry: Platform input (maxLength 100) + URL input with validation indicator + delete button

### `components/sidebar/HeaderEditor.tsx` (modify)

- Logo upload migrated to Data URI pipeline
- Menu editor wiring deferred (out of scope for MVP; the static input remains as-is)

### Export Warning Modal

A simple modal component rendered conditionally from `page.tsx`. Shown when `collectInvalidLinks(editor).length > 0` and the user clicks Export. Displays the list of invalid URLs. Two buttons: "Proceed (omit bad links)" → calls `generateHTML` and triggers download; "Cancel" → closes modal.

---

## Image Handling Pipeline

**Current problem:** `URL.createObjectURL` produces a blob URL (`blob:http://...`) that is session-scoped. It breaks on page reload and cannot be embedded in the exported HTML.

**New pipeline — applies to all image fields (hero photo, about image, project images, logo):**

```
User selects file
      │
      ▼
Validate: isImageMimeType(file.type) && isImageSizeOk(file.size)
      │ fail → retain previous value, show error message
      │ pass
      ▼
const reader = new FileReader();
reader.readAsDataURL(file);
reader.onload = (e) => {
  const dataUri = e.target.result as string; // "data:image/png;base64,..."
  setEditor(prev => ... set the image field to dataUri ...)
};
```

The Data URI is stored directly in `EditorState`. Because it is a plain string, it:
- Survives `JSON.stringify` / `JSON.parse` round-trips in localStorage
- Can be embedded directly as an `src` attribute in `<img>` tags in the exported HTML

**Error display:** Each image upload control tracks an `uploadError: string | null` in local component state (not in `EditorState`). The error is displayed beneath the upload control and cleared on the next successful upload.

---

## localStorage Persistence Design

### Save

In `app/page.tsx`, a `useEffect` watches `editor` state with a 500ms debounce:

```typescript
useEffect(() => {
  const timer = setTimeout(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(editor));
    } catch {
      // quota exceeded or SSR — silent
    }
  }, 500);
  return () => clearTimeout(timer);
}, [editor]);
```

### Load

The initial `useState` call uses a lazy initializer:

```typescript
const [editor, setEditor] = useState<EditorState>(() => {
  return loadEditorState() ?? DEFAULT_EDITOR_STATE;
});
```

`loadEditorState()` in `utils/storage.ts`:

```typescript
export function loadEditorState(): EditorState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Structural validation: check all required top-level keys exist
    if (!parsed?.sections?.hero || !parsed?.sections?.about ||
        !parsed?.sections?.projects || !parsed?.sections?.contact ||
        parsed?.sections?.contact?.location === undefined ||
        !parsed?.font || !parsed?.theme) {
      return null; // triggers default state + overwrites on next save
    }
    return parsed as EditorState;
  } catch {
    return null;
  }
}
```

If `loadEditorState` returns `null`, the app starts with `DEFAULT_EDITOR_STATE` and the debounced save will overwrite any corrupt data on the next state change.

### Images in Storage

Because all images are already Data URIs in `EditorState`, they are stored as strings in the JSON blob. No special handling is needed. The 5 MB per-image cap keeps the localStorage payload manageable (browsers allow 5–10 MB total).

---

## Export Pipeline

The export is triggered from `Header.tsx` via an `onExport` callback passed from `page.tsx`.

### Step 1 — Collect and warn about invalid links

```typescript
const invalid = collectInvalidLinks(editor);
if (invalid.length > 0) {
  setExportWarning(invalid); // opens the modal
  return;
}
triggerDownload(editor);
```

If the user clicks "Proceed", `triggerDownload` is called with `omitInvalidLinks = true`.

### Step 2 — Generate HTML (`utils/export.ts`)

`generateHTML(state: EditorState, omitInvalidLinks = false): string` is a **pure function** that returns a complete HTML string. Structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>[hero.name or "My Portfolio"]</title>
  <style>
    /* 1. Minimal CSS reset */
    /* 2. :root { --color-main: ...; --color-primary: ...; ... } */
    /* 3. font-family declaration using system font stack fallback for chosen font */
    /* 4. Typography + layout classes matching canvas */
    /* 5. Responsive breakpoints at 640px and 1024px */
    /* 6. Floating nav styles */
    /* 7. Section-specific styles (hero layouts, about layouts, cards grid, contact) */
    /* 8. scroll-behavior: smooth on html */
  </style>
</head>
<body style="font-family: [chosen font], sans-serif;">
  <nav class="floating-nav"> ... </nav>
  <section id="hero"> ... </section>
  <section id="about"> ... </section>  <!-- omitted if empty -->
  <section id="projects"> ... </section>  <!-- omitted if empty -->
  <section id="contact"> ... </section>  <!-- omitted if empty -->
</body>
</html>
```

**CSS strategy:** Hand-crafted CSS that mirrors the Tailwind classes used in the canvas components. No Tailwind CDN or external stylesheets. The responsive breakpoints use the same widths as the canvas (640px mobile/tablet boundary, 1024px tablet/desktop boundary).

**Font:** The selected font is applied via a `font-family` declaration in the `:root` block using a curated system font stack that closely matches each of the three choices — no external network request is issued. Inter maps to `system-ui, sans-serif`; Poppins and Montserrat each map to a geometric sans-serif system stack. This satisfies Requirement 13.4 (no network requests) and Requirement 13.2 (no external stylesheet references).

**HTML escaping:** Every piece of user-provided text (name, title, tagline, headings, descriptions, platform names) is passed through `escapeHtml()` before insertion.

**Placeholder exclusion:** Fields whose value is empty string produce no markup for that region (same as the canvas behavior).

**Image embedding:** `<img src="data:image/...;base64,...">` — images are already Data URIs in `EditorState`, so they are inserted verbatim.

**Invalid links:** If `omitInvalidLinks` is true, `ProjectItem.link` and `SocialLink.url` values that fail `isValidUrl` are rendered without the `<a href>` wrapper (text label only).

**Floating nav in export:** Same logic as `FloatingNav.tsx` — only sections with content get a nav entry. Uses `href="#section-id"` anchors.

**Layout-aware HTML:** The function inspects each section's `layout` field and emits the corresponding CSS class on the section element, which the inlined CSS interprets the same way Tailwind does on the canvas.

### Step 3 — Trigger download

```typescript
const blob = new Blob([html], { type: "text/html;charset=utf-8" });
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "portfolio.html";
a.click();
URL.revokeObjectURL(url);
```

---

## Floating Navigation Bar Design

### Canvas

`FloatingNav.tsx` renders as the **first child** inside the scrollable canvas wrapper div — the same div that has `overflow-y: auto` and `h-screen` in `Canvas.tsx`. Being a direct child of the scroll container with `position: sticky; top: 0; z-index: 50` means it sticks to the top of that container's scroll viewport as the user scrolls down through the sections. It must NOT be placed outside the scroll container (e.g. as a sibling of the canvas div in `page.tsx`), as `position: sticky` only works relative to the nearest scrolling ancestor. It reads the active theme palette via CSS custom properties on the parent wrapper.

Visible link computation (pure function, derived from `editor`):
- `hero` link: shown when `hero.name.trim() || hero.title.trim() || hero.tagline.trim() || hero.photo`
- `about` link: shown when `about.heading.trim() || about.desc.trim() || about.image`
- `projects` link: shown when `projects.items.length > 0`
- `contact` link: shown when `contact.email.trim() || contact.phone.trim() || contact.location.trim() || contact.socialLinks.length > 0`

Each `<a>` uses `href="#hero"` etc. and relies on `scroll-behavior: smooth` set on the canvas scroll container.

### Exported Page

The same logic is re-implemented as a string template inside `generateHTML`. The nav uses inline styles derived from the theme CSS variables (since there is no class system in the exported file). Section elements have `id="hero"` etc. as anchors.

---

## Responsive Design Strategy

### Canvas viewport modes

| Mode | Width applied | Trigger |
|---|---|---|
| `"mobile"` | `w-[375px]` | default on load |
| `"tablet"` | `w-[768px]` | user selects Tablet |
| `"desktop"` | `w-[1280px]` | user selects Desktop |

The viewport mode is stored in `page.tsx` state as `ViewportMode`. It only controls the canvas preview width — it does not affect the EditorState.

### Exported page breakpoints

The exported HTML uses standard `@media` queries matching Tailwind's defaults:
- `max-width: 639px` → mobile layout (single column, centered text)
- `640px–1023px` → tablet layout (narrower two-column or single-column with wider margins)
- `min-width: 1024px` → desktop layout (full side-by-side layouts)

All layouts use `max-width: 100%` on images and `overflow-wrap: break-word` on text containers to prevent horizontal overflow.

---

## Validation Rules

### URL validation

```typescript
export function isValidUrl(value: string): boolean {
  if (!value.trim()) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}
```

Applied to: `ProjectItem.link`, `SocialLink.url`

### Email validation

```typescript
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
```

Applied to: `ContactSection.email`

### Image file validation

Applied in all upload handlers before calling `FileReader.readAsDataURL`:

```typescript
const ACCEPTED_MIME_TYPES = new Set([
  "image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"
]);
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB

export function isImageMimeType(mimeType: string): boolean {
  return ACCEPTED_MIME_TYPES.has(mimeType);
}

export function isImageSizeOk(bytes: number): boolean {
  return bytes <= MAX_IMAGE_BYTES;
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

The recommended property-based testing library for this TypeScript project is **fast-check**. Add it as a development-only dependency: `npm install --save-dev fast-check`. It must NOT be added to `dependencies` — only `devDependencies` — so it is excluded from the production bundle. Each property test must run a minimum of 100 iterations.

### Property 1: Image file validation accepts all valid image MIME types

*For any* file whose MIME type is in `{image/jpeg, image/png, image/gif, image/webp, image/svg+xml}` and whose size is ≤ 5 MB, `isImageMimeType` returns true and `isImageSizeOk` returns true; for any file whose MIME type is not in that set or whose size exceeds 5 MB, the corresponding function returns false.

**Validates: Requirements 2.4, 2.9, 12.1, 12.2, 12.3**

---

### Property 2: URL validator correctly classifies http/https URLs

*For any* string that can be parsed by the `URL` constructor with `protocol === "http:"` or `"https:"`, `isValidUrl` returns true. *For any* string that cannot be parsed as a URL, or whose protocol is neither `http:` nor `https:`, `isValidUrl` returns false.

**Validates: Requirements 4.8, 5.5, 13.7**

---

### Property 3: Empty export fields produce no corresponding HTML regions

*For any* `EditorState` where `hero.name` is the empty string, the output of `generateHTML(state)` contains no non-empty name heading element. The same holds independently for `hero.title` (empty → no title region) and `hero.tagline` (empty → no tagline region).

**Validates: Requirements 2.10, 2.11, 2.12**

---

### Property 4: Project list add/remove preserves all other items

*For any* `ProjectsSection` with `n` items and any valid removal index `i`, removing item at index `i` produces a list of length `n - 1` where every element from the original list except index `i` is present in its original order. *For any* project list, adding a new item produces a list of length `n + 1` where the last element has all-empty string fields.

**Validates: Requirements 4.1, 4.2**

---

### Property 5: Social link list add/remove preserves all other entries

*For any* `ContactSection.socialLinks` with `n` entries and any valid removal index `i`, removing entry at index `i` produces a list of length `n - 1` where every entry except index `i` is present in its original order. *For any* social links list, adding a new entry produces a list of length `n + 1`.

**Validates: Requirements 5.1, 5.2**

---

### Property 6: Layout changes are section-isolated

*For any* `EditorState` and any two different sections A and B, applying a layout change to section A leaves section B's `layout` field at its prior value.

**Validates: Requirement 7.3**

---

### Property 7: Viewport mode changes preserve EditorState

*For any* `EditorState` value and any `ViewportMode`, switching the viewport mode does not alter any field in `EditorState`.

**Validates: Requirement 9.7**

---

### Property 8: EditorState serialization round-trip

*For any* valid `EditorState` (including entries with non-null Data URI image strings), `JSON.parse(JSON.stringify(state))` produces an object that is deeply equal to the original state. This guarantees that localStorage persistence and restore are lossless.

**Validates: Requirements 11.1, 11.2, 11.5, 11.6**

---

### Property 9: Generated HTML contains no external stylesheet or image references

*For any* `EditorState`, the string returned by `generateHTML(state)` contains no `<link rel="stylesheet"` element, no `@import` rule referencing an external URL, and no `<img` tag whose `src` attribute value does not start with `data:` (excluding images that are null/omitted).

**Validates: Requirements 13.2, 13.3, 13.4**

---

### Property 10: escapeHtml correctly escapes all five special characters

*For any* string `s` containing any combination of `&`, `<`, `>`, `"`, and `'`, `escapeHtml(s)` contains no literal `&`, `<`, `>`, `"`, or `'` characters (all replaced by their HTML entity equivalents). Furthermore the inverse substitution of all entities recovers the original string. Note: `unescapeHtml` is a test-only helper defined in the test file; it is not exported from `utils/export.ts`.

**Validates: Requirement 13.5**

---

### Property 11: collectInvalidLinks returns exactly the invalid links

*For any* `EditorState`, every string returned by `collectInvalidLinks(state)` fails `isValidUrl`, and no link value that passes `isValidUrl` appears in the result.

**Validates: Requirements 5.7, 13.7**

---

### Property 12: Floating nav includes links only for sections with content

*For any* `EditorState`, the set of section IDs in the computed nav link list is exactly the set of sections that have at least one non-empty, non-null user-entered content field (using the visibility rules defined in the Floating Nav section above).

**Validates: Requirements 14.2, 14.6**

---

### Property 13: Theme CSS variables in generated HTML match the selected palette

*For any* valid theme name `t` in `{Professional, Warm, Cool}`, the output of `generateHTML({ ...state, theme: t })` contains a `:root {` block whose `--color-main` value equals `colorPalettes[t].main`, and likewise for every other CSS custom property defined in that palette.

**Validates: Requirements 8.5, 8.7, 14.7**

---

## Error Handling

| Scenario | Handling |
|---|---|
| `localStorage` unavailable (SSR, private browsing) | All storage calls wrapped in try/catch; silent fail |
| Corrupt/invalid JSON in localStorage | `loadEditorState` returns null → app uses `DEFAULT_EDITOR_STATE` and overwrites on next save |
| Image file wrong type | Upload handler rejects; local `uploadError` state shows message below control; previous image value retained |
| Image file too large (> 5 MB) | Same as wrong type |
| Invalid project link URL | Inline validation indicator on the link input; Canvas renders project card without `<a>` wrapper; blocked from exporting without user acknowledgement |
| Invalid social link URL | Inline validation indicator; Canvas renders text label without link; same export gate |
| Invalid email | Validation indicator on email input; Canvas omits email region |
| Export with invalid links | Modal lists all bad links; user chooses Proceed (omit) or Cancel |
| Unknown theme value passed to Canvas | Falls back to Professional (Requirement 8.8) |
| Unknown font value passed to Canvas | Falls back to Inter (Requirement 8.9) |

---

## Testing Strategy

### Unit tests (example-based)

Focus on specific behaviors and integration points. Suggested test file locations alongside implementation files (e.g., `utils/__tests__/validation.test.ts`).

Key example-based test areas:
- `loadEditorState` returns null for corrupt JSON
- `loadEditorState` returns null for missing localStorage key
- `generateHTML` with fully empty EditorState omits all section bodies except the floating nav
- Export modal shows when `collectInvalidLinks` is non-empty
- HeroEditor maxLength enforcement (50/100 character limits)

### Property tests (universal correctness)

Use **fast-check** to implement the 13 properties defined above. Each test is tagged with a comment referencing the property:

```typescript
// Feature: portfolio-builder-mvp, Property 2: URL validator correctly classifies http/https URLs
it("validates URLs correctly for all generated inputs", () => {
  fc.assert(fc.property(fc.webUrl(), (url) => {
    expect(isValidUrl(url)).toBe(true);
  }));
  fc.assert(fc.property(fc.string(), (s) => {
    try { new URL(s); } catch { expect(isValidUrl(s)).toBe(false); }
  }));
});
```

Run with `--run` flag (e.g., `vitest --run`) for single execution in CI. Minimum 100 iterations per property.

### Integration tests

- Viewport mode toggle in Header updates Canvas width class
- Editing a section field in the sidebar updates Canvas display
- Logo upload appears in Canvas nav after selection
- Export triggers browser download (mocked `URL.createObjectURL`)
