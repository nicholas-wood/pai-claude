---
task: Extract linear-tracking into its own standalone project
slug: 20260530-074030_extract-linear-tracking-project
effort: standard
phase: complete
progress: 10/10
mode: interactive
started: 2026-05-30T07:40:30Z
updated: 2026-05-30T07:43:30Z
---

## Context

`linear-tracking` (a Linear-CSV → GitHub-issues sync tool for the LIMSOC engagement, remote
`github.com/nicholas-wood/lsv`) currently lives inside `limsoc-national-ims/code/`. Nick wants it
promoted to its own standalone workspace project.

It is a self-contained git repo (limsoc itself is NOT a git repo), so relocation is a plain `mv` that
preserves history, branch, remote, and working tree — no submodule/subtree surgery.

**Decisions (from user):**
- Name: `linear-tracking`
- Scaffold: **Minimal** — `~/Documents/workspace/linear-tracking/` with `overview.md` + `code/linear-tracking/`. No agents/context scaffold.
- Pending changes: **commit locally first** (no push), then move from a clean tree.

### Risks
- Committing the dirty tree pulls in tracked `.DS_Store` files + many untracked report HTML — acceptable, repo already tracks `.DS_Store`.
- Stale pointer in `limsoc/context/references.md:23` must be redirected, else dangling reference.

## Criteria
- [x] ISC-1: New dir exists at ~/Documents/workspace/linear-tracking/
- [x] ISC-2: Repo working tree committed clean before move (no push)
- [x] ISC-3: Folder relocated to linear-tracking/code/linear-tracking
- [x] ISC-4: No longer present under limsoc-national-ims/code/
- [x] ISC-5: Inner git repo intact — 3 commits, remote lsv, branch main
- [x] ISC-6: overview.md created at new project root
- [x] ISC-7: limsoc/context/references.md pointer redirected to new location
- [x] ISC-A1: No git history rewritten (only a new commit added)
- [x] ISC-A2: Nothing pushed to remote
- [x] ISC-A3: lsv remote URL unchanged

## Verification
- ISC-1/6: `ls` confirms `~/Documents/workspace/linear-tracking/` and its `overview.md`.
- ISC-3/4/5: toplevel now `linear-tracking/code/linear-tracking`, 3 commits, branch main, 0 dirty; absent from limsoc/code (only brief-poc remains).
- ISC-2: commit `0a47184` added; `git status` clean.
- ISC-7: references.md old `../code/linear-tracking` line replaced with redirect note.
- ISC-A1: original commits `5ee683b`/`a5aa51d` preserved, only one new commit on top — no rewrite.
- ISC-A2/A3: no `git push` run; remote still `github.com/nicholas-wood/lsv`.

## Decisions
- Plain `mv` chosen over git subtree split: limsoc is not a repo, so the inner repo is already standalone.
- No code authored → /simplify not applicable; task is right-sized for main thread (no agent delegation).
