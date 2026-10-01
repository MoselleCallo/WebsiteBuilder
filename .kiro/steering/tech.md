# Tech Stack

## Core
| Layer | Choice |
|---|---|
| Framework | Next.js 13.5.1 (App Router) |
| UI | React 18.2.0 |
| Language | TypeScript 5.2.2 |
| Styling | Tailwind CSS 3.3.3 |
| Linting | ESLint 8.49.0 (`next/core-web-vitals` only) |

No external UI component libraries — all UI is hand-built with Tailwind utility classes.  
No state management library — pure React `useState` with prop drilling.

## Fonts
Loaded via `next/font/google` in `app/layout.tsx`: **Inter**, **Poppins**, **Montserrat**.  
Exposed as CSS variables: `--font-inter`, `--font-poppins`, `--font-montserrat`.  
Tailwind extends `fontFamily` with these variables (`font-inter`, `font-poppins`, `font-montserrat`).

## Theming
Color palettes are defined in `app/theme.ts` as a `colorPalettes` object (typed `as const`).  
`Canvas.tsx` injects the active palette as CSS custom properties via an inline `style` prop.  
Sections consume colors through `bg-[var(--color-main)]`, `text-[var(--text-main)]`, etc. — never hard-coded.

## Common Commands
```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # Run ESLint
```

> For dev/build commands that run long, start them in a terminal manually rather than via a tool call.

## Configuration Files
- `next.config.js` — minimal, no custom config
- `tailwind.config.ts` — only extends `fontFamily`
- `postcss.config.js` — standard Tailwind/Autoprefixer setup
- `.eslintrc.json` — extends `next/core-web-vitals` only
- `tsconfig.json` — standard Next.js TypeScript config; path alias `@/` maps to the workspace root
