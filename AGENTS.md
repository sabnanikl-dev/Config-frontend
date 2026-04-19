# Project Config — Development Guide

> **Read this file first.** Every agent must follow these rules.

Internal configuration frontend for generating project specifications. Outputs `project-config.yaml` that Hermes reads to auto-populate new project scaffolds.

## Core Rules
1. ALL code requires cross-QA from another agent before merge
2. No self-approvals. Ever
3. All work tracked via GitHub Issues
4. PR body must reference an Issue (`Fixes #N`)
5. Self-review your diff before opening a PR
6. Run end-session audit before signing off
7. Every PR comment must end with a reviewer signature (see below)

## Reviewer Signatures

Every PR comment — review summaries, inline comments, approval/rejection notes — must end with a signature line identifying the agent:

```
— Hermes
— Claude Code
— Codex
```

This keeps accountability, thread context, and cross-review clarity intact when multiple agents touch the same PR.

## Tech Stack
- Next.js 15 (App Router, **static export**)
- TypeScript 5.7 strict · Tailwind v4 · pnpm

## Quick Start
```bash
pnpm install && pnpm dev
```

## Documentation (Progressive Disclosure)

| Topic | File |
|-------|------|
| Branch, code style, commits | [Conventions](docs/conventions/index.md) |
| PR process, merge, end-session | [Workflows](docs/workflows/index.md) |
| Colors, typography, components | [Design System](docs/design-system/index.md) |
| Deploy, env, config | [Infrastructure](docs/infrastructure/index.md) |
| Product requirements | [Product Specs](docs/product-specs/index.md) |
| Execution plans | [Exec Plans](docs/exec-plans/index.md) |

## Branch Naming
- `fe/cd-<description>` — Claude Code · `fe/codex-<description>` — Codex · `fe/hermes-<description>` — Hermes
- `hotfix/<description>` · `preview/<name>` (integration, delete after merge)

> If it isn't discoverable, it's illegible. Read docs/ subfiles for details.
