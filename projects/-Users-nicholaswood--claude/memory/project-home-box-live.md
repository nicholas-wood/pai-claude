---
name: project-home-box-live
description: The Ubuntu home box is the live PAI host as of 2026-06-03; the Mac is cold standby
metadata: 
  node_type: memory
  type: project
  originSessionId: aa57fd93-cb32-4a60-8608-0a6e4850db78
---

As of 2026-06-03, the always-on **Ubuntu box** (`nicholas-wood-XPS-13-9360`, Tailscale name `box`, IP 100.76.43.94) is the **live PAI host**. The Mac's Pulse is stopped; the Mac is now a thin client / cold standby. Nick works from the box going forward.

**Repos (both private GitHub, kept current by the daily `git-autocommit` Pulse job at 23:30):**
- `~/.claude` → `github.com/nicholas-wood/pai-claude`
- `~/Documents/workspace` → `github.com/nicholas-wood/life-os`

**Access from Mac/phone:**
- Pulse dashboard: `https://box.tail87fbca.ts.net` (Tailscale Serve, tailnet-only HTTPS).
- Drive Claude: Claude app / claude.ai/code (Remote Control, account nicholas.h.wood@outlook.com), or `rc`/`rcmobile` (mosh+tmux), or `pulseweb` (SSH tunnel). Mac aliases live in `~/.zshrc`.
- Drop files for the box: OneDrive (box mounts it at `~/OneDrive`), or `boxmount` → `box:~/inbox` (needs FUSE-T on the Mac).

**Box specifics:** Pulse + cadence under systemd user units (`Linger=yes`, survives reboot); deps pinned in `PAI/PULSE/package.json`; canonical dir casing is `PULSE` (see [[reference-pulse-dir-casing]]); secret/churn hygiene in [[reference-pai-host-repo-gitignore]]. Full runbook: `~/Documents/workspace/pai/home-box.md`. Remaining: restic backup timer, delete `~/.claude.template-install.bak`.