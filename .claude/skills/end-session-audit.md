# End Session Audit

**Required before any agent signs off from a work session.**

## Checklist
- [ ] All local changes are committed (`git status` clean)
- [ ] Changes are pushed to remote (`git log` matches origin)
- [ ] PR is created or updated for this work
- [ ] PR body describes changes and links to Issue
- [ ] No untracked or stash'd files with relevant work
- [ ] `npm install` + `npm run build` passes locally
- [ ] No `console.log` or debug code left in committed files
- [ ] Branch naming follows convention: `fe/<agent>-<description>`

## If you find uncommitted work
1. Commit it: `git add -A && git commit -m "<description>"`
2. Push: `git push origin <branch>`
3. Open or update PR
