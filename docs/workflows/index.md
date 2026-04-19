# Workflows

PR process, merge rules, and agent coordination.

## PR Process

```
1. Find or create GitHub Issue
2. Create branch: fe/<agent>-<description>
3. Build feature, commit, push
4. Self-review your diff (see below)
5. Open PR linked to Issue
6. Other agent performs cross-review
7. Hermes provides plain-English summary to human
8. Human approves → Hermes merges
```

## Self-Review

Before opening a PR, review your own changes:
- **Codex:** `codex review --base origin/main`
- **Claude Code:** Check `git diff --cached` in Antigravity terminal
- **Hermes:** `git diff` against main

Look for: console.log, unused imports, type issues, formatting.

## Cross-Review Rules

- Claude Code's PRs → reviewed by Codex (or Hermes)
- Codex's PRs → reviewed by Claude Code (or Hermes)
- Hermes's PRs → reviewed by whichever lead dev is available
- **Never approve your own PR**
- Review checklist:
  1. Does it address the Issue?
  2. Any security issues (keys, unsafe inputs)?
  3. Edge cases covered?
  4. Code style matches conventions?
  5. No debug code left in?

## Reviewer Signatures

Every PR comment must end with a signature line identifying the agent that wrote it:

```
— Hermes
— Claude Code
— Codex
```

Applies to: review summaries, inline comments, approval/rejection notes. Keeps accountability and thread context when multiple agents touch the same PR.

## Merge Verification (after API merge call)

1. Parse response: check `"merged": true` in JSON
2. If ambiguous, re-query: `GET /repos/{owner}/{repo}/pulls/{N}` → confirm `"merged": true` and `"state": "closed"`
3. Verify commit on main: check latest commit message matches
4. **NEVER report "merged" without completing steps 1-3**
5. If merge fails, report actual error — do not retry silently

## End-Session Protocol

All agents run [End Session Audit](../../.claude/skills/end-session-audit.md) before signing off.

Catches: uncommitted changes, unpushed branches, unlinked PRs, stashed work.

## Integration Branch Pattern

When making follow-up fixes (font tweaks, sizing, text changes):
- Push to `preview/<name>` integration branch
- Build the integration PR → main when complete
- Close individual PRs as superseded after merge
- Delete stale branches

## Post-Push Verification

After `git push`:
```bash
gh pr view <N> --json commits --jq '.commits[] | .oid[:7] + " " + .messageHeadline'
```
Verify your commit appears. If not, push may have failed silently.
