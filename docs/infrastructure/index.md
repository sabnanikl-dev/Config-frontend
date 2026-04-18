# Infrastructure

## Development
```bash
pnpm install && pnpm dev      # http://localhost:3000
pnpm build                     # Static export → out/ folder
pnpm typecheck && pnpm lint    # CI checks
```

## Deployment
**Static export** — `pnpm build` generates portable `out/` folder.
- Vercel: Framework preset Next.js, output is `out/`
- Netlify: Build `pnpm build`, publish `out`
- Cloudflare Pages: Build `pnpm build`, output `out`
- Any static host: Upload `out/`

## CI
`.github/workflows/pr-checks.yml` → typecheck + lint + format + build on every PR.
