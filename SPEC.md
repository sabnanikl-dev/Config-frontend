# SPEC.md — Config-frontend

Stable implementation contract for autonomous agents. When docs, issues, and this spec disagree, **this document is the source of truth** for what the product is and is supposed to do. Update it deliberately.

---

## 1. Product Purpose

Config-frontend is an internal wizard-style web app that generates a `project-config` document describing a new project.

- **Output**: a single serialized config (YAML, JSON, or Markdown-with-frontmatter) that downstream systems — primarily **Hermes** — consume to scaffold a new repo, open starter issues, and seed agent workflow.
- **Scope**: supports a broad range of app types. Site-style projects (landing pages, marketing sites) and app-style projects (dashboards, kanban boards, admin panels, internal tools) are **both first-class**. Section chips and page types cover both.
- **Non-goals**: Config-frontend does **not** execute scaffolding, call APIs, persist to a database, or authenticate users. It is a pure config generator — schema-in-browser, file-out.

---

## 2. Primary User Flows

### Flow A — Generate a new project config (happy path)
1. User navigates to `/new`
2. Steps through the wizard:
   1. **Project Info** — name, repo, description, domain, owner
   2. **Brand** — seven hex colors + heading/body typography
   3. **Pages** — add/remove/reorder pages; each page has slug, optional `type`, sections (chips + custom), description
   4. **App Shape** — capabilities (chips + custom), data models (list), integrations (list), agent workflow hints
   5. **Tech Stack** — framework, deploy target, SSR flag, plugins, CMS
   6. **Review & Export** — summary + full YAML preview + download (YAML / JSON / Markdown)
3. User downloads the config and hands it to Hermes for scaffolding

### Flow B — Add a custom section to a page
From the Pages step, click `+ custom` on any page → type a name → Enter. The custom section becomes a togglable chip persisted in `content.pages[n].sections`.

### Flow C — Add a custom capability
Same pattern as Flow B, but on the App Shape step under Capabilities.

### Flow D — Re-export a config
Configs are not persisted. A user re-entering `/new` starts from defaults. Future work: allow importing an existing YAML to prefill the wizard.

---

## 3. Schema / Domain Model

The canonical schema lives in [`src/lib/config/schema.ts`](src/lib/config/schema.ts) (Zod). The shape below describes field meaning, not syntax. All fields are required unless marked optional; string arrays default to `[]` in `defaultConfig`.

### `project`
Identity of the project. Used by Hermes for repo creation and documentation headers.
- `name` — human-readable project name
- `repo` — GitHub repo slug (no owner prefix)
- `description` — one-sentence project description
- `domain` — target production domain (may be empty pre-launch)
- `owner` — GitHub owner/org

### `brand`
Visual identity, consumed by scaffold generators to set up Tailwind `@theme` tokens and default typography.
- `colors.{primary,secondary,accent,background,foreground,muted,border}` — validated hex
- `typography.{heading,body}` — CSS font-family strings

### `content.pages[]`
Ordered list of pages. Each becomes a route in the scaffold and a starter GitHub issue.
- `slug` — URL path segment (required, non-empty)
- `type` (optional) — semantic page role: `landing | dashboard | settings | list | detail | board | admin`. Signals to the scaffold whether to generate marketing-style or app-shell-style layouts.
- `sections[]` — ordered section identifiers. May include built-in names (`hero`, `footer`, `kanban-board`, …) **or custom names** added via the UI. Scaffold may map built-ins to components and treat customs as stubs.
- `description` — optional notes for the page

### `content.assets[]`
Reserved for future asset/image references. Currently unused but schema-stable.

### `app`
App-shape hints. Scaffolders use these to scaffold capability modules, data model stubs, and integration wiring. Empty arrays are valid for site-style projects.
- `capabilities[]` — non-visual features: `auth`, `search`, `filters`, `drag-and-drop`, `notifications`, `realtime`, `automation`, etc. May include custom values.
- `dataModels[]` — domain entity names: `task`, `project`, `user`, `comment`. Not a full schema — just naming hints.
- `integrations[]` — third-party services: `slack`, `github`, `stripe`, `linear`.

### `tech`
Technical stack preferences for the scaffold.
- `framework` — `next | astro | vite`
- `deploy` — `vercel | netlify | cloudflare | static | docker`
- `ssr` — boolean; whether server rendering is expected
- `plugins[]` — free-form list (e.g. `trpc`, `next-auth`)
- `cms` — `none | sanity | contentful | markdown`

### `agents`
Declares which agents own which roles on the scaffolded project.
- `lead` — `claude-code | codex | hermes`
- `reviewer` — `claude-code | codex | hermes`
- `workflow.builder` — free-text note on who builds features
- `workflow.updater` — free-text note on who updates task state
- `workflow.escalation` — free-text escalation/blocker rules

---

## 4. Constraints

- **Framework**: Next.js 15 App Router.
- **Export mode**: static export friendly. No server actions, no dynamic API routes in the production bundle.
- **Package manager**: pnpm. `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm lint`.
- **Language**: TypeScript 5.7 **strict**. No `any` without explicit justification. Prefer Zod inference over hand-written types for schema-derived shapes.
- **Styling**: Tailwind CSS v4 with `@theme` tokens. No CSS-in-JS.
- **Validation**: Zod via `@hookform/resolvers/zod`. All new schema fields must be added to both `ProjectConfigSchema` and `defaultConfig` (required fields with empty defaults are preferred over `.default()` to keep `z.input === z.output` for React Hook Form).
- **Stability**: the generated YAML/JSON must be deterministic for identical input (no timestamps, no random IDs).
- **Machine-usability**: the config is the contract. Field names, enum values, and shape are considered **public API** — breaking changes require a `SPEC.md` update and a schema migration note.
- **App-type parity**: dashboards, internal tools, and kanban-style apps must be representable **without** custom workarounds. If a reasonable real-world case can't be expressed, that's a schema bug.

---

## 5. UX Expectations

- The wizard must be usable by non-technical users. Favor clear labels and sensible defaults over flexibility.
- Schema breadth matters more than pixel polish. If a field is missing, that's a product defect; if spacing is 2px off, that's not.
- Validation errors must be inline and human-readable. Never silently drop input.
- Custom-entry UX (custom sections, custom capabilities) must match built-in entry UX — same chip style, same toggle/remove behavior, same deduplication guard.
- Export formats (YAML / JSON / Markdown-with-frontmatter) must all round-trip the same data. Markdown adds a human summary but does not lose fields.
- Future asset/image inputs should slot into `content.assets[]` without reshaping the schema.

---

## 6. Integration Expectations

- **Primary consumer**: Hermes reads the exported config to scaffold a new repo, seed issues, and configure its own agent workflow from `agents.workflow`.
- **Scaffold signal**: `content.pages[].type` and `app.capabilities[]` together are the scaffold's richest signal for layout and module selection. Downstream tools should treat both as required context even though `type` is schema-optional.
- **Agent planning signal**: `agents.workflow.{builder,updater,escalation}` is free-form on purpose — Hermes parses it as natural-language guidance, not structured rules.
- **Symphony compatibility**: this spec is designed to serve as the contract for OpenAI Symphony-style autonomous execution. An agent should be able to read this file, the Zod schema, and `AGENTS.md` and understand the product without reconstructing context from closed issues or merged PRs.
- **Review gate**: every config change is expected to be reviewed by Hermes before downstream scaffolding acts on it. Config-frontend does not ship configs to Hermes directly.

---

## 7. Non-Goals (Explicit)

These are **out of scope** and should not be added without updating this document first:
- Server-side persistence of configs
- User authentication
- Multi-user editing or sharing
- Direct scaffold execution from the frontend
- Runtime API calls to external services

---

## 8. References

- [`AGENTS.md`](AGENTS.md) — agent collaboration rules, branch naming, PR/review process
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — directory layout, dependency direction, server/client split
- [`src/lib/config/schema.ts`](src/lib/config/schema.ts) — canonical Zod schema and default config
- [`docs/workflows/index.md`](docs/workflows/index.md) — PR and review workflow
- [OpenAI Symphony](https://github.com/openai/symphony) — the spec-driven execution model this document targets
