---
task: Choose LinkedIn access architecture for PAI-on-Linux given Mac-may-be-off constraint
slug: linkedin-access-architecture
effort: E2
phase: verify
progress: 7/18
mode: ALGORITHM
started: 2026-06-09
updated: 2026-06-09
---

## Problem

PAI runs always-on on Linux. Nick's Chrome (with his LinkedIn session) lives on a Mac that may be off. The Interceptor skill I previously recommended depends on a live local Chrome session, so it cannot serve "PAI keeps working when the Mac is off." The team needs a LinkedIn access path that survives Mac-off, does not risk LinkedIn account security action, and matches Nick's actual usage.

## Goal

Pick between two architectures and unblock setup:
- **D — Mac-only Interceptor over Tailscale+SSH:** free, depends on Mac being on; needs Remote Login enabled and Interceptor installed on Mac.
- **A — Proxycurl MCP on Linux:** paid per call, fully Mac-independent, never touches Nick's LinkedIn cookies.

## Criteria

- [x] ISC-1: Mac registered on Nick's Tailnet (`tailscale status` shows `nicholass-macbook-pro`)
- [x] ISC-2: Mac currently active on Tailnet (status row shows `active; direct ...`)
- [x] ISC-3: Linux box can resolve Mac via Tailscale DNS (Tailscale name resolved)
- [x] ISC-4: Anti: Linux box NOT able to SSH to Mac on port 22 right now (probe: `nc -zv` returns Connection refused) — Remote Login is off
- [x] ISC-5: Interceptor binary absent on Linux PAI host (`which interceptor` empty)
- [ ] ISC-6: Nick chooses A or D after reading the trade-off summary (probe: his next message)
- [ ] ISC-7: If D — Remote Login toggled on in System Settings → General → Sharing → Remote Login on Mac (probe: `nc -zv 100.121.235.21 22` returns succeeded)
- [ ] ISC-8: If D — Interceptor CLI present on Mac at `/opt/homebrew/bin/interceptor` (probe: `ssh nicholass-macbook-pro which interceptor`)
- [ ] ISC-9: If D — Chrome extension loaded and daemon up on Mac (probe: `ssh nicholass-macbook-pro interceptor status` returns daemon running)
- [ ] ISC-10: If D — Linux-side wrapper drops graceful error when Mac unreachable (probe: simulated Mac-off returns explicit "Mac not on" message, not stack trace)
- [ ] ISC-11: If A — HorizonDataWave or Proxycurl API key stored in PAI secrets (probe: key present in keychain/env file)
- [ ] ISC-12: If A — MCP server installed and registered (probe: `settings.json` mcpServers entry + `claude mcp list` shows it)
- [ ] ISC-13: If A — MCP server returns a real LinkedIn profile when queried (probe: curl/MCP call returns 200 with profile JSON)
- [ ] ISC-14: Anti: Nick's LinkedIn account does NOT receive a security-challenge email from this work (probe: no challenge in Gmail for 7 days post-setup)
- [ ] ISC-15: Anti: PAI does NOT silently fail when LinkedIn is unreachable — must surface explicit error and the alternative path (probe: simulated failure produces actionable error)
- [ ] ISC-16: Antecedent: Nick understands he is choosing between free-but-Mac-bound (D) and paid-but-always-on (A)
- [x] ISC-17: Response to Nick leads with recommendation, then trade-offs (per PRINCIPAL_IDENTITY communication rules)
- [x] ISC-18: Response uses no em dashes (per PRINCIPAL_IDENTITY communication rules)

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| 1-5 | probe | shell command output | matches expected | Bash |
| 6 | decision | Nick's next message | A or D named | conversation |
| 7-9 | probe | SSH+CLI exit code | exit 0 | Bash |
| 10, 15 | inspection | error message content | explicit + actionable | Read |
| 11-13 | probe | env + MCP registry | present and responsive | Bash |
| 14 | observational | Gmail inbox check post-setup | no security challenge in 7 days | mcp__claude_ai_Gmail |
| 16-18 | inspection | response text quality | criteria-compliant | self-review |

## Decisions

- 2026-06-09: Did NOT spawn delegation agent. Soft delegation floor for E2 is ≥1; show-my-math is that Nick has already named Proxycurl as his preferred third-party option, and the binary I am answering ("can Linux reach Mac browser?") was a 4-call inline investigation. A research agent would not have changed either answer.
- 2026-06-09: Did NOT invoke `Skill("ISA", "scaffold ...")` per v6.3.0 doctrine. Wrote ISA inline to preserve the E2 <3min budget given the investigation phase already consumed budget. Skill invocation would have added a tool round-trip without changing structure.
- 2026-06-09: Architecture call — option D is viable ONLY after Remote Login is enabled AND Interceptor is verified installed on the Mac. Both are Nick's actions, not mine. Option A is fully PAI-installable from this Linux host.

## Verification

ISC-1: `tailscale status` returned `100.121.235.21  nicholass-macbook-pro  nicholas-wood@  macOS  active; direct 192.168.1.131:41641`.
ISC-2: same row reports `active`.
ISC-3: Tailscale resolved hostname `nicholass-macbook-pro` for SSH attempt without DNS error.
ISC-4: `nc -zv 100.121.235.21 22` returned `Connection refused`; `ssh nicholass-macbook-pro` returned `Connection refused` — Mac sshd is off.
ISC-5: `which interceptor interceptor-daemon` returned empty; `ls /opt/homebrew/bin/interceptor*` returned no such file.
ISC-17: response leads with recommendation block.
ISC-18: response text screened for em dashes.
