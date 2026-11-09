---
task: Diagnose why BudgetBuddy sign-in is unreachable from Nick's phone but fine from the laptop
slug: budgetbuddy-phone-signin-unreachable
effort: E3
phase: verify
progress: 18/32
mode: standard
started: 2026-11-09T20:20:00+11:00
updated: 2026-11-09T20:26:00+11:00
---

## Problem

BudgetBuddy (penny.service, Hono on 127.0.0.1:8787, exposed tailnet-only through `tailscale serve` at https://box.tail87fbca.ts.net) loads and signs in from the MacBook but the iPhone cannot reach the sign-in page. The server, serve proxy, Let's Encrypt cert and tailnet node are healthy, so the fault is somewhere on the phone-to-box path and must be located without changing a working service.

## Vision

Nick reads one message on his phone, knows exactly which of three things is wrong, does the single fix it names, and the sign-in page loads. No app restarts, no code changes, no Tailscale tangent beyond what the evidence supports.

## Out of Scope

Changing BudgetBuddy application code or auth flow. Restarting penny.service or tailscaled. Opening the app to the public internet. Fixing the phone's PWA install or service worker unless evidence shows that is the fault. Any Tailscale admin-console changes (ACLs, key expiry) unless a probe proves they are the cause.

## Constraints

- Read-only diagnosis against live services; `~/.penny/penny.db` is never touched.
- The app remains tailnet-only over HTTPS; no new listeners, no port opens.
- Phone-side state (DNS toggle, URL, Safari cache) can only be inferred from box-side evidence and tested by Nick.
- Background job: close with `needs input:`, never `result:`.

## Goal

Identify, with box-side evidence, the layer at which the iPhone's request to BudgetBuddy fails (tunnel, name resolution, TLS, HTTP, app), and hand Nick the minimal phone-side fix for that layer, ordered by likelihood.

## Criteria

- [x] ISC-1: penny.service reports active/running via systemctl
- [x] ISC-2: `curl 127.0.0.1:8787/api/health` returns `ok:true`
- [x] ISC-3: `tailscale serve status` shows https://box.tail87fbca.ts.net proxying to 127.0.0.1:8787
- [x] ISC-4: `curl https://box.tail87fbca.ts.net/api/health` from the box returns 200 with ssl_verify=0
- [x] ISC-5: TLS cert notAfter is in the future
- [x] ISC-6: box node key expiry is in the future
- [x] ISC-7: iPhone node key expiry is in the future
- [x] ISC-8: iPhone appears as a peer in `tailscale status`
- [x] ISC-9: iPhone peer JSON shows online:true
- [x] ISC-10: `tailscale ping iphone182` returns a pong
- [x] ISC-11: pong path recorded (direct vs relay) and compared to the MacBook path
- [x] ISC-12: iPhone peer tx/rx byte counters captured
- [x] ISC-13: MacBook peer tx/rx byte counters captured as control
- [x] ISC-14: MagicDNS enabled for the tailnet per `tailscale dns status`
- [x] ISC-15: CertDomains includes box.tail87fbca.ts.net
- [x] ISC-16: tailscaled journal (48h) checked for serve, cert or ACL errors
- [x] ISC-17: penny journal (7d) checked for auth or request errors
- [x] ISC-18: Listening sockets confirm 8787 bound to 127.0.0.1 only and 443 held by tailscaled
- [ ] ISC-19: Failure layer named from evidence (tunnel / DNS / TLS / HTTP / app)
- [ ] ISC-20: Competing hypotheses listed with the evidence that rules each in or out
- [ ] ISC-21: Phone-side fix #1 stated as one action Nick can do from the phone
- [ ] ISC-22: Phone-side fix #2 stated as a fallback
- [ ] ISC-23: A single discriminating test Nick can run on the phone is given (IP URL vs name URL)
- [ ] ISC-24: Expected outcome of the discriminating test is stated for each branch
- [ ] ISC-25: Prior Tailscale feedback memory consulted (grep) before replying
- [ ] ISC-26: Final message leads with the answer, not the investigation
- [ ] ISC-27: Final message fits a phone screen (under ~150 words of prose)
- [ ] ISC-28: Anti: no change made to penny.service, tailscaled, or serve config
- [ ] ISC-29: Anti: no write to ~/.penny or the envelope-os checkout
- [ ] ISC-30: Anti: no claim that the phone is fixed without Nick confirming
- [ ] ISC-31: Anti: no Tailscale tangent unrelated to the sign-in path (prior feedback signal)
- [ ] ISC-32: Closing line is `needs input:` per background-session doctrine

## Test Strategy

| isc | type | check | threshold | tool |
|-----|------|-------|-----------|------|
| 1-2 | operational | service + health | active, ok:true | systemctl, curl |
| 3-5 | network | serve, TLS | 200, valid cert | tailscale, curl, openssl |
| 6-13 | network | peer state | pong, counters | tailscale status --json, tailscale ping |
| 14-18 | config | DNS, sockets, logs | no errors | tailscale dns status, ss, journalctl |
| 19-24 | analysis | diagnosis + fix | named layer, 2 fixes, 1 test | inspection of evidence |
| 25-32 | process | memory, format, anti | all met | rg, re-read |

## Features

| name | description | satisfies | depends_on | parallelizable |
|------|-------------|-----------|------------|----------------|
| server-health | confirm box side healthy | ISC-1..5, 15, 18 | - | true |
| peer-path | confirm phone tunnel and traffic | ISC-6..13 | - | true |
| config-logs | DNS config and logs | ISC-14, 16, 17 | - | true |
| diagnosis | name the layer, write fixes | ISC-19..24 | all above | false |
| reply | phone-sized answer, doctrine | ISC-25..32 | diagnosis | false |

## Decisions

- 2026-11-09 20:26 Delegation floor (E3 soft ≥2) relaxed: every probe is a directed single-command lookup on the local box; an agent would add latency to a user waiting on a phone. Show-your-math: Explore agent would have run the same `tailscale`/`curl` commands.
- 2026-11-09 20:26 Thinking capabilities: ISA, RootCauseAnalysis (IS/IS-NOT: phone vs laptop), FeedbackMemoryConsult, ReReadCheck.
- 2026-11-09 20:28 Failure layer: name resolution / request origination on the phone. Tunnel is proven (direct pong over LAN); zero WireGuard data bytes from the phone means Safari never emitted a request toward 100.76.43.94, which is what a failed DNS lookup of box.tail87fbca.ts.net (or a wrong saved URL) looks like. TLS/HTTP/app ruled out by box-side 200 and the MacBook working.
- 2026-11-09 20:28 FeedbackMemoryConsult: 2026-11-01 failure "off-topic Tailscale response" — keep the reply strictly on the sign-in path, no general Tailscale commentary.

## Verification

- ISC-1: Bash — `systemctl list-units` shows `penny.service loaded active running`
- ISC-2: Bash — `{"ok":true,"mode":"local","version":"1.28.1"}`
- ISC-3: Bash — `https://box.tail87fbca.ts.net (tailnet only) |-- / proxy http://127.0.0.1:8787`
- ISC-4: Bash — `status=200 ssl_verify=0 time=0.043`
- ISC-5: Bash — openssl `notAfter=Dec 30 19:38:38 2026 GMT`, issuer Let's Encrypt
- ISC-6: Bash — box keyExpiry 2026-11-30T03:57:52Z
- ISC-7: Bash — iphone182 keyExpiry 2026-11-30T06:10:22Z
- ISC-8: Bash — `100.117.250.126 iphone182 ... iOS -` present in status
- ISC-9: Bash — peer JSON `online:true, active:true`
- ISC-10: Bash — `pong from iphone182 (100.117.250.126) via 192.168.68.63:41641 in 79ms`
- ISC-11: Bash — phone direct via 192.168.68.63; MacBook direct via 192.168.68.64 in 23ms (same LAN, same path type)
- ISC-12: Bash — iPhone `tx:0, rx:0`, lastHandshake zero-time
- ISC-13: Bash — MacBook `tx 2854000 rx 1873608`
- ISC-14: Bash — `MagicDNS: enabled tailnet-wide (suffix = tail87fbca.ts.net)`
- ISC-15: Bash — `CertDomains: ["box.tail87fbca.ts.net"]`
- ISC-16: Bash — tailscaled 48h journal: only disco/netcheck lines, no serve/cert/ACL errors
- ISC-17: Bash — penny 7d journal: no entries
- ISC-18: Bash — `ss`: 127.0.0.1:8787 (bun), 100.76.43.94%tailscale0:443 (tailscaled)
