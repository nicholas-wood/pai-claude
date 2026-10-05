---
name: gotcha-two-pulse-daemons-mac-linux
description: Pulse runs on BOTH the Mac (launchd com.pai.pulse) and the Linux box (systemd pulse.service); fixes on one do not reach the other, and Nick hears the Mac's voice alerts
metadata:
  type: project
---

Two independent Pulse daemons exist: Linux (`systemctl --user`, `pulse.service`) and the Mac (launchd `com.pai.pulse`, plist in `~/Library/LaunchAgents`, stop/start with `launchctl unload|load`). Each has its own `PAI/PULSE/state/state.json`, logs and `PULSE.toml`.

On 2026-10-05 "memory-consolidation still failing every 30 mins" was the Mac instance: it still ran the June code, so the 2026-08-23 fix (see [[gotcha-pulse-latch-voice-quota]]) had only landed on Linux. Fixed by copying `pulse.ts` and `Assistant/checks/heartbeat.ts` to the Mac, converting only the job block in the Mac `PULSE.toml` to `type = "script"`, deleting the latched state entry while the daemon was stopped, and reloading. Backups: `*.bak-20261005` on the Mac.

**Why:** the first diagnosis pass checked only Linux, found everything green, and told Nick nothing was failing. He had to repeat the report.

**How to apply:** when Nick reports a Pulse or Jarvis alert that Linux state does not show, check `ssh mac` before concluding it is not failing. Do not copy the Linux `PULSE.toml` to the Mac wholesale: its `log-rotation` job uses GNU `stat -c%s`, which fails on macOS. Still open as of 2026-10-05: the Mac `~/.claude` git checkout has not fetched since 2026-07-27 and is diverged (125 ahead, 38 behind), so fixes do not sync; both daemons poll the same Telegram bot and produce constant 409 conflicts; `life-morning-brief` runs on both.
