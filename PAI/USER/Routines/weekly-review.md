# Routine: Weekly Review + Daily Top-Five

> Draft routine, ready to schedule via `/schedule`. This is the operating cadence absorbed from the retired `life` project. The DA runs it; it is not a separate project or agent. Status output routes to Telegram (PAI's notification channel) (the rule carried forward from life), never to primary chat or DM.

## Daily Top-Five (proposed: 06:30 Australia/Melbourne, weekdays)

Prompt the DA runs:
1. Read `~/.claude/PAI/USER/PROJECTS/PROJECTS.md` and each active project's `ISA.md` open Criteria.
2. Scan open loops across every active front (career, AccessBuddy, LifesaverOnCall, SLCO role, SMLSC, LIMSOC close-out, personal).
3. Synthesise - do NOT enumerate - the five highest-leverage actions for today, ranked, each tied to a project and the goal it serves.
4. Post to Telegram (PAI's notification channel). Cap at five. If nothing is genuinely high-leverage, say so rather than padding.

## Weekly Review (proposed: Monday 07:00 Australia/Melbourne)

Prompt the DA runs:
1. For each active project ISA: what moved last week, what stalled, what is now unblocked or newly blocked.
2. Update each project's ISA Criteria status and Decisions where the week changed them.
3. Surface open loops older than two weeks and ask whether to drop, delegate, or do.
4. Confirm the agent roster: any agent to create (recurring need established) or retire (gone quiet)?
5. Set the week's three to five priorities. Post the digest to Telegram (PAI's notification channel).

## Constraints (from the retired life ISA)

- The DA orchestrates and reports; it does not execute project work directly. Executable work delegates to the project's registered agents.
- No competing orchestrator. This routine IS the orchestration layer, running inside the DA.
- Synthesise, do not enumerate. Five or fewer daily; three to five weekly.

## Status: LIVE (local, 2026-06-02)

Runs **locally** via launchd, not as a remote cloud agent. Reason: the cadence reads local ISAs and posts to your Slack - a cloud agent can do neither. Engine: `run-cadence.ts` (this directory), which reads every active project ISA's open Criteria, asks `Inference.ts` (Opus) to synthesise, and writes a dated digest to `MEMORY/STATE/cadence/`.

- **Engine:** `~/.claude/PAI/USER/Routines/run-cadence.ts daily|weekly` (verified working 2026-06-02).
- **Jobs:** `~/Library/LaunchAgents/com.pai.cadence.{daily,weekly}.plist` (loaded on the current Mac as interim host).
- **Schedule:** daily top-five weekdays 06:30; weekly review Monday 07:00 (local time).
- **Output:** `MEMORY/STATE/cadence/{daily,weekly}-YYYY-MM-DD.md`. Logs: `MEMORY/STATE/cadence/logs/`.

### Interim limitation
The current Mac must be awake/logged in at fire time. This is why the **home box** is the proper host - move the two plists + the runner there and the cadence runs in perpetuity.

### Telegram delivery
PAI's notification channel is Telegram (not Slack - that was dead config inherited from the retired `life` project). The runner reads `TELEGRAM_BOT_TOKEN` + chat id from `~/.claude/.env` and posts via the Bot API. Token is valid; if the send returns "chat not found", set `TELEGRAM_PRINCIPAL_CHAT_ID` in `~/.claude/.env` to your actual DM chat id with the bot (or send the bot a message first so the chat exists). Digests always write to file regardless.

### Manage
- Run now: `bun ~/.claude/PAI/USER/Routines/run-cadence.ts daily`
- Unload: `launchctl unload ~/Library/LaunchAgents/com.pai.cadence.daily.plist` (and weekly)
- Migrate to home box: copy the runner + both plists, adjust the hardcoded `/Users/nicholaswood` paths, `launchctl load -w` there.

<!-- absorbed from the retired life project, 2026-06-02; made local + live -->

