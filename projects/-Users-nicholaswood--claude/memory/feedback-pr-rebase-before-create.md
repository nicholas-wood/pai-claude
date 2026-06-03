---
name: feedback-pr-rebase-before-create
description: Rebase onto origin/main and resolve conflicts before creating a PR; verify PR state before claiming it was updated
metadata: 
  node_type: memory
  type: feedback
  originSessionId: a91757da-f4cb-45be-9c7c-948cf28f317e
---

Always rebase the working branch onto origin/main and resolve conflicts BEFORE creating a PR. And always check a PR's actual state before claiming it was updated.

**Why:** Nick has repeatedly had to ask for conflict resolution after PR creation, and been told PRs were "updated" when they were already closed/merged. Both waste his time.

**How to apply:**
- Before `gh pr create`: run `git fetch origin main && git rebase origin/main`, resolve conflicts, verify the build passes, then push.
- Before claiming a PR is updated: run `gh pr view {number} --json state` to confirm it's still open.
- If a PR is already closed/merged, open a new one rather than claiming the old one was updated.
