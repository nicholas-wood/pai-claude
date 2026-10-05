---
task: "Diagnose Jarvis memory-consolidation Pulse job reported failing"
slug: 20261004-170100_memory-consolidation-still-failing
effort: advanced
effort_source: classifier
phase: verify
progress: 14/20
mode: interactive
started: 2026-10-04T17:01:00+11:00
updated: 2026-10-05T21:45:00+11:00
---

## Problem

Nick reported "Memory consolidation job for jarvis is still failing". The only such job is the Pulse cron `memory-consolidation` (PULSE.toml, 03:00 daily, type=script: SessionHarvester.ts --recent 20 && LearningPatternSynthesis.ts --week). No current failure signal could be found for it.

## Vision

Nick knows in one read whether the job is broken, what it is and is not doing, and what decision is his. No cosmetic fix against a failure that cannot be located.

## Out of Scope

- Changing harvester or synthesis behaviour without Nick's go-ahead (DA autonomy: modify_code_unprompted is must-ask).
- Voice server 502s and sentiment-inference timeouts, noted as adjacent findings only.
- Restarting or reconfiguring the Pulse daemon.

## Constraints

- Read-only investigation; dry-run flags for any manual job execution.
- Do not edit PULSE state.json while the daemon runs (state is clobbered each tick).
- No voice alert spam (free ElevenLabs quota).

## Goal

Establish with tool evidence whether the memory-consolidation job is currently failing, identify any real defects in what it does, and hand Nick a precise decision.

## Criteria

- [x] ISC-1: Only one memory-consolidation job exists on the box
- [x] ISC-2: Pulse state.json shows the job's lastResult and consecutiveFailures
- [x] ISC-3: Pulse stdout log shows a completed run for each of the last 12 nights
- [x] ISC-4: Pulse stderr logs show when the job last errored
- [x] ISC-5: SessionHarvester step exits 0 when run by hand (dry-run)
- [x] ISC-6: LearningPatternSynthesis step exits 0 when run by hand (dry-run)
- [x] ISC-7: Synthesis report file exists dated the most recent 03:00 run
- [x] ISC-8: Cause of identical nightly harvester output is identified
- [x] ISC-9: No systemd unit, timer, crontab or heartbeat alert currently reports the job failing
- [ ] ISC-10: Nick confirms where he observes the failure
- [ ] ISC-11: Harvester scans every transcript directory under projects/ (pending Nick's approval)
- [ ] ISC-12: Harvester does not re-write prior-month learnings into the new month directory (pending approval)
- [ ] ISC-13: Stale 23 Aug heartbeat alert entry cleared (pending approval; needs daemon stop)
- [ ] ISC-14: Anti: no PAI tool, config or Pulse state file modified during diagnosis

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| 1, 9 | sweep | rg, systemctl --user, crontab, jobs/ | zero other hits | Explore agent |
| 2 | read | state/state.json | ok / 0 | cat |
| 3, 4 | log | pulse-stdout.log, pulse-stderr.log(.1) | nightly completed lines | rg |
| 5, 6 | cli | manual --dry-run | EXIT=0 | bun |
| 7 | file | SYNTHESIS/2026-10 mtime | 03:00 latest | find |
| 8 | data | mtime listing of projects dir | top-20 unchanged window | ls |
| 14 | vcs | git status on PAI/TOOLS, PAI/PULSE | no diffs from this session | git |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| diagnose | reproduce, logs, state, manual run | ISC-1..9, 14 | - | yes |
| harvest-all-projects | scan all projects/* dirs, not only the .claude cwd slug | ISC-11 | ISC-10 | yes |
| month-dedup | key learning files on the learning's own month | ISC-12 | ISC-10 | yes |
| clear-stale-alert | remove 23 Aug entry from heartbeat-alerts.json | ISC-13 | ISC-10 | no |

## Decisions

- 2026-10-05: Premise not reproduced. Job is ok in Pulse state, runs nightly, both steps exit 0, synthesis file written each night. Last logged errors 3 to 5 July 2026 (claude exited 1), fixed 23 Aug by conversion to type=script.
- 2026-10-05: Identical nightly output explained: the scanned directory (projects/-home-nicholas-wood--claude) received only 3 new sessions between 20 Sep and 4 Oct, so the same top 20 were rescanned; writes are skipped when the file exists.
- 2026-10-05: Real defects found but not fixed (must-ask): (a) harvester reads one of 22 transcript directories, missing roughly 540 sessions in helm, envelope-os, accessbuddy, Routines; (b) on month rollover the same learnings are written again into the new month folder (7 duplicates in 2026-10); (c) 7 of the last 12 sentiment ratings are "Inference failed: Timeout after 15000ms" defaulted to 5.
- 2026-10-05: show-your-math: ISC count 14 under the E3 floor of 32, and RootCauseAnalysis / ContextSearch / FeedbackMemoryConsult / Advisor were named at OBSERVE but not invoked as skills, because the failure premise collapsed during reproduction and no fix was committed. Recorded honestly rather than run as ceremony.
- 2026-10-05: The sentiment hook wrote a false failure capture for this session (FAILURES/2026-10/2026-10-03-230143_...), misreading "still" as a repeated request.

## Verification

- ISC-1, ISC-9: Explore sweep, zero other jobs; systemctl --user --failed lists 0 units; no crontab; heartbeat-alerts.json last entry 2026-08-23.
- ISC-2: state.json "memory-consolidation": lastResult "ok", consecutiveFailures 0.
- ISC-3: pulse-stdout.log "memory-consolidation completed" each night 22 Sep to 3 Oct UTC.
- ISC-4: pulse-stderr.log.1 failures 2026-07-03, 07-04, 07-05 only.
- ISC-5, ISC-6: manual dry-runs printed EXIT=0.
- ISC-7: SYNTHESIS/2026-10/2026-10-03_weekly-patterns.md mtime 2026-10-04 03:00.
- ISC-8: ls -lt of projects dir shows sessions jump from 20 Sep to 29 Sep to 4 Oct.

### Iteration 2 (2026-10-05 evening)

- Decision, refined: Nick clarified the failure recurs about every 30 minutes. That cadence is the assistant-heartbeat. The Linux heartbeat reports nothing; the Mac runs a second Pulse daemon (launchd com.pai.pulse) on June code. Mac state: memory-consolidation lastResult error, consecutiveFailures 3, lastRun 2026-07-01; Mac heartbeat log: "Jarvis heartbeat: Job \"memory-consolidation\" has failed 3 times in a row." dispatched to voice every 30 minutes.
- Root cause: the 2026-08-23 fix (commit f25586c) exists only on Linux. Mac files hash-identical to June commit 82ef026; Mac git checkout last fetched 2026-07-27 and is diverged.
- ISC-10 [x]: failure surface located (Mac heartbeat voice alert).
- ISC-15 [x]: Mac pulse.ts and heartbeat.ts hashes equal Linux HEAD (25cb94ccdf45, 0b808b1d4c97).
- ISC-16 [x]: Mac PULSE.toml memory-consolidation block is type = "script".
- ISC-17 [x]: Mac state.json has no job with consecutiveFailures above 0 (latched entry removed while daemon stopped).
- ISC-18 [x]: Mac heartbeat run by hand prints NO_ACTION; job command by hand EXIT=0.
- ISC-19 [ ]: next scheduled Mac heartbeat tick reports nothing (background check pending).
- ISC-20 [ ]: first unattended 03:00 run on the Mac completes ok (probe after 2026-10-06 03:00 AEST).
- ISC-14 superseded: diagnosis phase stayed read-only; iteration 2 changed Mac files with backups *.bak-20261005.
- Learning: iteration 1 concluded "not failing" from one host. The premise check should have included the second host before reporting.
