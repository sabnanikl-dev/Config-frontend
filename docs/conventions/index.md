# Conventions

Code style, naming, and formatting rules all agents must follow.

## Branch Naming

See [AGENTS.md](../../AGENTS.md) for branch naming table. Key rule: **always include agent prefix.**

## Code Style

- **Single quotes** for strings (consistent with JSX)
- **2-space indent** (Next.js convention)
- **100 char max line length**
- **Named exports preferred** over default exports for components
- **Interface naming:** `XxxProps` for component props, `XxxConfig` for configuration objects
- **File naming:** kebab-case for files (`data-fetcher.ts`), PascalCase for components (`DataTable.tsx`)
- **No barrel re-exports** unless explicitly needed (import directly from the source file)

## Commit Convention

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

body (optional)
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
Scope: optional, e.g., `feat(ui)`, `fix(auth)`, `docs(workflow)`

## Forbidden

- ❌ `console.log()` in committed code (use `console.warn`/`console.error` only)
- ❌ Hardcoded inline styles (`style={{ ... }}`) — use Tailwind classes
- ❌ Hardcoded color hex values outside `globals.css` `@theme` block
- ❌ Tailwind arbitrary values `[]` — extend the config instead
- ❌ `any` type (use `unknown` or define a proper type)
- ❌ `@ts-ignore` without a comment explaining why
- ❌ Unused imports (linted)
