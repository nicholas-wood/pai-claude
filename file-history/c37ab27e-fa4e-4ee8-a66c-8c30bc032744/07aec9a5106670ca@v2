---
name: reference-perplexity-library-import-flow
description: "Where the perplexity.ai Library importer lives, what it does, and how it gets at the data"
metadata: 
  node_type: memory
  type: reference
  originSessionId: c37ab27e-fa4e-4ee8-a66c-8c30bc032744
---

The perplexity.ai Library importer is `~/.claude/PAI/TOOLS/PerplexityImport.ts` (bun, TypeScript). It exists because the Perplexity Sonar API key (`pplx-…`, used by [[PerplexityResearcher]] / `PAI/TOOLS/Perplexity.ts`) is stateless and cannot read Nick's account-side data — Library, threads, tasks, history.

How it works:

- SSHes to the `mac` host and drives `interceptor` (PAI's Chrome-extension automation, installed at `~/Projects/interceptor` on the Mac, symlinked into `~/.bun/bin/`).
- Opens `https://www.perplexity.ai/library` in the real, logged-in Chrome session — bypasses Cloudflare because it IS the human's browser.
- Parses the accessibility tree for `link "<title>" href="/computer/tasks/<uuid>"` rows. For each, navigates the tab, captures the transcript text, strips the left-nav/cookie-banner cruft, and writes one markdown file per task to `~/.claude/PAI/MEMORY/RESEARCH/perplexity/<date>__<id-prefix>__<slug>.md`.
- Idempotent on the 8-char UUID prefix encoded in the filename. `--force` re-imports; `--thread <url|uuid>` does one-offs; `--dry-run` lists without writing; `--probe` dumps the raw library tree for debugging when Perplexity changes their DOM.

Usage cadence: re-run any time you want a fresh sync. The Library on Perplexity is the source of truth; this just mirrors it into PAI MEMORY so it shows up in `Research`, `ContextSearch`, and `Knowledge` flows.

Gotchas embedded in the code:

- `interceptor tab new` doesn't reliably make the new tab the daemon's active target. Script does explicit `tab switch <id>` after each `tab new` — without it, `tree`/`text` route to the wrong tab and return empty.
- Library page only surfaces three Computer (Comet) tasks for this account so far; URL pattern is `/computer/tasks/<uuid>`. Parser also accepts `/search/<slug>` (classic Perplexity threads) but Nick has none of those yet — if he starts using them, the same regex picks them up.
- Interceptor on the Mac is at `~/Projects/interceptor` (slop-browser repo, currently v0.16.9). Binaries symlinked into `~/.bun/bin/` (the Mac has no Homebrew, but `~/.bun/bin` is on PATH). Native messaging manifest already symlinked at `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.interceptor.host.json`. The macOS Swift bridge is NOT installed — not needed for in-page web scraping. Rebuild procedure: `~/.claude/skills/Interceptor/Workflows/Update.md`.

Companion tools:

- [[reference-outlook-mac-applescript-drafting]] — sibling pattern (SSH `mac`, drive a Mac-side tool, return output).
- `PAI/TOOLS/Perplexity.ts` (Sonar API CLI) — different layer: live web search, not account history.
