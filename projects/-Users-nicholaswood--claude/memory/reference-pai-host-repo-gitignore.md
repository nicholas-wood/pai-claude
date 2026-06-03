---
name: reference-pai-host-repo-gitignore
description: Secret hygiene for the ~/.claude git repo (pai-claude) + the .gitignore inline-comment gotcha
metadata: 
  node_type: memory
  type: reference
  originSessionId: aa57fd93-cb32-4a60-8608-0a6e4850db78
---

`~/.claude` is backed up as private GitHub repo `nicholas-wood/pai-claude` (the home-box DR pivot). `~/Documents/workspace` is `nicholas-wood/life-os`. Both kept current by the daily `git-autocommit` Pulse job (`PAI/TOOLS/GitAutoCommit.ts`, 23:30) — see [[feedback-working-docs-in-workspace]].

**Secret-bearing paths in `~/.claude` that MUST be gitignored** (GitHub push protection blocks on the PATs): `/backups/` (copies of `.claude.json` with live GitHub PATs), `.claude.json*`, `.credentials.json*`, `.env`, `**/*.pem|*.key|*.p12`, `PAI/MEMORY/SECURITY/`. Also exclude runtime churn: `/projects/` (session transcripts — can contain chat-leaked secrets), `/shell-snapshots/`, `/statsig/`, `/todos/`, plus build/log/state (`**/node_modules/`, `PAI/Pulse/Observability/out/`, `*.log`, `PAI/Pulse/logs/`, `PAI/Pulse/state/`). `PAI/USER/Config/PAI_CONFIG.yaml` is SAFE — it holds env-var names, not keys.

**Gotcha:** `.gitignore` does NOT support inline trailing comments. `/projects/   # transcripts` becomes a literal pattern that matches nothing, silently leaving the dir tracked. Comments must be on their own line. Always verify after writing: `git ls-files | grep -cE '^projects/|^backups/'` must be 0, and `git grep -lIE 'ghp_|github_pat_|sk-ant-' HEAD` must be empty, BEFORE pushing.

**Why:** a push of `~/.claude` was blocked twice by PATs in `backups/`; the first corrective `.gitignore` had the inline-comment bug and would have pushed 451 transcripts. Verify-before-claiming caught it ([[feedback-verify-before-claiming-done]]).