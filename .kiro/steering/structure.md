# Project Structure

## Folder Layout

```
WebsiteBuilder/
├── app/                          # Next.js App Router root
│   ├── layout.tsx                # Root layout: font loading, metadata, body wrapper
│   ├── page.tsx                  # App entry point — single source of truth for all state
│   ├── theme.ts                  # Color palette definitions (colorPalettes object)
│   └── globals.css               # Global CSS
├── components/
│   ├── Header.tsx                # Top app bar: project name, viewport toggle, action buttons
│   ├── canvas/                   # Live preview pane (read-only render)
│   │   ├── Canvas.tsx            # Injects CSS custom properties, composes section renderers
│   │   └── sections/             # One render component per section
│   │       ├── Hero.tsx
│   │       ├── About.tsx
│   │       ├── Projects.tsx
│   │       └── Contact.tsx
│   └── sidebar/                  # Editor pane (write path)
│       ├── Sidebar.tsx           # Composes ThemeEditor, HeaderEditor, section editors
│       ├── ThemeEditor.tsx       # Palette + font dropdowns
│       ├── HeaderEditor.tsx      # Logo upload
│       └── sectionEditor/        # One editor panel per section
│           ├── HeroEditor.tsx
│           ├── AboutEditor.tsx
│           ├── ProjectsEditor.tsx
│           └── ContactEditor.tsx
├── .kiro/
│   ├── steering/                 # AI steering rules
│   └── specs/                    # Feature specs (requirements, design, tasks)
└── public/                       # Static assets
```

## Key Conventions

### Naming Symmetry
Canvas section renderers and their sidebar editor panels use symmetric names:
- `components/canvas/sections/Hero.tsx` ↔ `components/sidebar/sectionEditor/HeroEditor.tsx`
- Same pattern for About, Projects, Contact.

### State Architecture
`app/page.tsx` is the **single source of truth**. It owns `EditorState` via `useState` and passes it down:
- **Canvas** receives `editor` as read-only props — it only renders.
- **Sidebar** and its children receive `editor` + `setEditor` — they are the write path.
- No React context, no external store — all state flows through explicit props.

### Shared Types Module
All canonical TypeScript types (`EditorState`, section types, `OpenState`) must be defined in a **single shared module** and imported everywhere. Do not redeclare these types locally in individual component files.

### `isOpen` / Accordion Pattern
A single `OpenState` string (or `null`) tracks which sidebar panel is open. Only one panel is open at a time. Values: `"heroSection"`, `"aboutSection"`, `"font"`, `"palette"`, `"page"`, `"menu"`, `"view"`, `null`.

### Theming
Always use CSS custom properties (`var(--color-main)`, `var(--text-muted)`, etc.) for colors in section components — never hard-code hex values. The palette is injected by `Canvas.tsx` based on `editor.theme`.

### State Updates
Use the immutable spread pattern for nested state:
```ts
setEditor(prev => ({
  ...prev,
  sections: {
    ...prev.sections,
    hero: { ...prev.sections.hero, field: value }
  }
}));
```

### Client Components
All components use `"use client"` — there are no server components outside the root layout.

### Tailwind Conditional Classes
Use template literals with ternaries for conditional classes. There is no `clsx` or `cn` utility in this project.
