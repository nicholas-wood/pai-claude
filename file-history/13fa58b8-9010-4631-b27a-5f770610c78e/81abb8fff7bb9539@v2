---
name: gotcha-envelope-os-shared-checkout-concurrent-sessions
description: "BudgetBuddy (envelope-os) checkout is often mid-feature from another session: never restart penny or commit whole files; build the live bundle from a clean worktree at HEAD"
metadata: 
  node_type: memory
  type: project
  originSessionId: 13fa58b8-9010-4631-b27a-5f770610c78e
  modified: 2026-09-13T02:19:39.703Z
---

The envelope-os checkout at `~/Documents/workspace/projects/envelope-os` is a shared working tree inside the `~/Documents/workspace` monorepo, and Nick runs parallel sessions on it. On 2026-09-13 a v1.27.0 schedules build was in flight (store/schema/contract/server + web pages modified, typecheck broken in HistoryPage.tsx) while I fixed the edit-category parent bug.

**Why:** the prior incident (9efc194 swept unrelated v1.25 chat WIP; reverted in 5bc6afa) and the v1.24.2 note "NOT restarted" both came from this. A `systemctl --user restart penny` exposes foreign unfinished server code and schema migrations live; a plain `vite build` bundles foreign half-done UI; `git add <file>` sweeps foreign hunks.

**How to apply:**
- Run `git status --short` before any build or commit and assume foreign hunks are present.
- Stage hunk-by-hunk: `git diff --relative <file> | awk` to keep your hunks, then `git apply --cached --directory=projects/envelope-os <patch>` (the repo root is `~/Documents/workspace`; without `--directory` git apply from the subdir silently ignores the patch and `--check` still exits 0).
- Deploy the frontend from a clean worktree: `git worktree add <tmp> HEAD`, symlink `node_modules`, `bunx vite build`, `rsync -a --delete` into the live `web/dist` (the live process serves dist per request, shell is no-store).
- Server-side changes stay un-deployed until the other session restarts penny; record them as DEFERRED-VERIFY with the follow-up probe. Related: [[gotcha-radix-select-dialog-touch]] (harness pattern), [[project-budgetbuddy-v1250-chat]].
