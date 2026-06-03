---
name: reference-pulse-dir-casing
description: The Pulse app dir is canonically PULSE (uppercase); Mac case-insensitivity hides mismatches that break on the Linux box
metadata: 
  node_type: memory
  type: reference
  originSessionId: aa57fd93-cb32-4a60-8608-0a6e4850db78
---

The Pulse application directory is canonically `~/.claude/PAI/PULSE` (UPPERCASE). Git tracks 203 files under `PAI/PULSE/` and zero under `PAI/Pulse/`; the launchd plist (`WorkingDirectory ...PAI/PULSE`) and `pulse.ts` internals all use `PULSE`. Note `PAI/DOCUMENTATION/Pulse/` (mixed-case) is a different, unrelated dir.

**Trap:** macOS is case-insensitive, so `PAI/Pulse` and `PAI/PULSE` resolve identically on the Mac and any casing mistake is invisible there. The Linux home box (`pai-claude` clone) is case-sensitive - only `PULSE` exists, so a `Pulse` reference fails with "No such file or directory" (broke `bun install` and `manage.sh` during box setup).

**Rule:** always write `PAI/PULSE` in scripts, systemd units, Pulse jobs, and docs. Never "correct" it to `Pulse`. When editing PAI files that will run on the box, assume case-sensitive. Relates to [[reference-pai-host-repo-gitignore]] (box = pai-claude on Ubuntu).