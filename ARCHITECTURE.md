# Architecture

## Technology Decisions

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 15 (App Router) | SSR, server actions, file-based routing, best-in-class React framework |
| Language | TypeScript 5.7 (strict mode) | Type safety, better AI agent code generation, fewer runtime bugs |
| Styling | Tailwind CSS v4 | Utility-first, design tokens in CSS, auto-purge, no runtime overhead |
| Package Manager | pnpm | Fastest install, strict node_modules (no phantom deps), disk efficient |
| Linting | ESLint 9 (flat config) + next/core-web-vitals | Modern flat config, catches React/Next anti-patterns |
| Formatting | Prettier 3 + tailwindcss plugin | Consistent formatting, auto-sorts Tailwind classes |
| Deployment | Vercel | Zero-config for Next.js, edge functions, preview deployments |
| CI | GitHub Actions | Typecheck + lint + format + build on every PR |

## Directory Architecture

```
src/
├── app/              # Next.js App Router (file-based routing)
│   ├── (site)/       # Route group for customer-facing pages
│   └── layout.tsx    # Root HTML, metadata, providers
├── components/       
│   ├── ui/           # Reusable UI primitives (buttons, inputs, cards)
│   └── layout/       # Layout components (header, footer, sidebar)
├── lib/              
│   ├── config/       # Runtime configuration (site metadata, env vars)
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Pure utility functions (no side effects)
│   └── api/          # API clients, server actions, data fetching
├── styles/
│   └── globals.css   # Tailwind configuration, design tokens (@theme)
└── types/            # Shared TypeScript interfaces and types
```

## Dependency Direction

Dependencies flow forward only:

```
types → config → utils → hooks → components → app/pages
```

- `types/` has zero dependencies
- `config/` depends only on `types/`
- `utils/` depends only on `types/` (pure functions)
- `hooks/` depends on `utils/`, `config/`
- `components/ui/` depends on `types/`, `utils/`, `styles/`
- `components/layout/` depends on `ui/`, `hooks/`
- `app/` depends on `components/`, `hooks/`, `config/`

**Never violate directionality.** A component should never import from `app/`. A hook should never import a component.

## Server vs Client Components

- **Server Components (default):** Data fetching, CMS queries, heavy computations, database access
- **Client Components (`use client`):** Interactive UI (forms, animations, hooks like `useState`/`useEffect`)
- **Rule:** Push `use client` as close to the leaves as possible. Never mark an entire page as client.

## State Management

- **URL as source of truth:** Search params for filters, pagination, sorting
- **React hooks:** `useState` for local component state, `useReducer` for complex state
- **No global state library yet:** Add Zustand or Jotai only when needed. Don't preempt.
- **Server actions:** Form submissions and mutations via Next.js `action` prop
