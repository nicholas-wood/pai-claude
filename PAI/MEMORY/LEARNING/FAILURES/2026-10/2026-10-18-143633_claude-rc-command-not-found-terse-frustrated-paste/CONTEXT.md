---
capture_type: FAILURE_ANALYSIS
timestamp: 2026-10-18 14:36:33 PST
rating: 3
description: claude-rc-command-not-found-terse-frustrated-paste
session_id: 67e0d5e8-4400-45ff-b0f6-cbaab29b7192
---

# Failure Analysis: claude rc command not found terse frustrated paste

**Date:** 2026-10-18
**Rating:** 3/10
**Summary:** Terse paste of a failed command; implicit frustration

---

## What Happened

Nick pasted the shell output 'claude rc' → 'claude: command not found' with no question or comment. The previous response was a status report on merging PR #115 and releasing v1.22.1, which doesn't address the command he ran. Because he is pasting an error back without adding words, this reads as a terse redirect: the reply ignored the actual context of his terminal action. The likely cause is that 'claude rc' is not a valid subcommand, or the Claude CLI is not on PATH in this shell. Lesson: when a user pastes a raw error, answer the error directly first and avoid long unrelated status summaries.

---

## Conversation Summary

**USER:** nicholas-wood@nicholas-wood-XPS-13-9360:~$ claude rc
claude: command not found

---

## Tool Calls (0 total)

No tool calls recorded

---

## Files in This Capture

| File | Description |
|------|-------------|
| `CONTEXT.md` | This analysis document |
| `transcript.jsonl` | Full raw conversation (30 entries) |
| `sentiment.json` | Sentiment analysis metadata |
| `tool-calls.json` | Extracted tool invocations (0 calls) |

---

## Learning System Notes

This failure has been captured for retroactive analysis. The learning system should:

1. Review the full transcript for root cause
2. Identify systemic issues that contributed
3. Determine if this failure type has occurred before
4. Propose improvements to prevent recurrence

**Action Required:** This capture needs manual review to extract learnings.
