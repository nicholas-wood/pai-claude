---
name: project-claude-tree-migrated-from-mac
description: ~/.claude was copied from a Mac; stale /Users/nicholaswood paths break PAI and plugins on this Linux box
metadata: 
  node_type: memory
  type: project
  originSessionId: 95e3b54a-bf98-4cea-86b6-97b0682d6d71
---

Nick's `~/.claude` tree was migrated from a Mac (`/Users/nicholaswood/...`) to this Linux box (`/home/nicholas-wood/...`, home dir has a hyphen). The files transferred fine but several configs hardcoded the old macOS absolute path.

Fixed 2026-06-03 (this session): `plugins/known_marketplaces.json` (installLocation) and `plugins/installed_plugins.json` (installPath) → caused `/doctor` plugin "cache-miss". And `settings.json` `PAI_DIR` + `PAI_CONFIG_DIR` → was causing the MODE classifier to fail every turn with `EACCES mkdir '/Users'`. settings.json now uses `${HOME}` (portable).

**Still pointing at /Users (not yet fixed, lower priority):** `daemon.lock`, `daemon/roster.json`, `PAI/USER/Routines/weekly-review.md`. ~60 append-only history/log files (PRDs, transcripts, OBSERVABILITY/LEARNING jsonl) also contain the old path — these are *records*, leave them.

**How to apply:** If PAI inference, the daemon, or plugins misbehave, first `grep -rl /Users/nicholaswood ~/.claude` and check whether a *live* config (not a log) still has the stale path. settings.json env changes need a session restart to take effect.
