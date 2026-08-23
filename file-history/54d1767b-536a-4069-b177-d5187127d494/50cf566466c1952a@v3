---
name: gotcha-pulse-latch-voice-quota
description: Pulse skips jobs forever at 3 failures (now 24h-TTL retry); ElevenLabs free plan allows only Adam voice and alert spam can burn the 10k monthly TTS quota
metadata: 
  node_type: memory
  type: project
  originSessionId: 54d1767b-536a-4069-b177-d5187127d494
  modified: 2026-08-23T09:27:40.482Z
---

Pulse daemon (`PAI/PULSE/pulse.ts`, systemd user unit `pulse.service`) gotchas found during the Aug 2026 heartbeat investigation:

- The cron circuit breaker originally skipped any job at ≥3 consecutive failures **forever** (no reset). Fixed 2026-08-23: latched jobs now retry once per 24h (`LATCH_RETRY_MS`). To hand-reset a latch: stop the daemon first (state is held in memory and rewritten every tick, so live edits to `PULSE/state/state.json` get clobbered), zero `consecutiveFailures`, restart.
- The assistant heartbeat (every 30 min) had no alert dedup and announced the same latched failure 48×/day for six weeks — which exhausted the ElevenLabs free tier's 10,000-credit monthly TTS quota. Dedup added 2026-08-23 (`state/da/heartbeat-alerts.json`, 24h TTL on `Job ...` failure alerts).
- ElevenLabs free plan: only premade-category voices work via API (probe with GET /v1/voices — costs no TTS credits). Rachel `21m00Tcm4TlvDq8ikWAM`, old default `s3TPKV1kjDlVtZbl4Ksh` (professional category), and Algorithm voice `fTtv3eikoepIosk8dTZ5` all 402. Repointed 2026-08-23: main = Sarah `EXAVITQu4vr4xnSDxMaL`, algorithm/notifications = Adam `pNInz6obpgDQGcFmaJgB` (settings.json, DA_IDENTITY.md, ALGORITHM/v6.3.0.md, notification-governor.ts, TOOLS/algorithm.ts). `generateSpeech` falls back to Adam on 402.
- DA identity for the Assistant module lives at `PAI/USER/DA/_registry.yaml` (`primary: Jarvis`) — the flat-file regex can't parse DA_IDENTITY.md's `- **Name:**` bullets. Log rotation is the `log-rotation` Pulse job (daily 02:30, copy-truncate at >10MB, one .1 generation).
- `memory-consolidation` was the only `type = "claude"` job and even its "successes" were fake — spawnClaude passes `--tools ""` so the subprocess couldn't run the bun commands its prompt demanded (it hallucinated `<tool_call>` XML). Converted 2026-08-23 to `type = "script"` running SessionHarvester + LearningPatternSynthesis directly (<0.2s, $0). Avoid `type = "claude"` jobs whose prompts require tool execution.
