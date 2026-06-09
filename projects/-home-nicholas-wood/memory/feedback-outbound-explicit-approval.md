---
name: feedback-outbound-explicit-approval
description: "All outbound communication or posting on Nick's behalf — across any tool, skill, agent, or MCP — requires single-action explicit approval per action. Drafting is free; sending is not."
metadata: 
  node_type: memory
  type: feedback
  originSessionId: b571332e-aad4-4bfa-8105-f749de8c64dc
---

# Outbound actions require single-action explicit approval

**Rule.** Nothing leaves Nick's name without his explicit word for that specific action. Drafting, reading, searching, filling fields — all free. Sending, posting, submitting, publishing, replying, liking, following, sharing — never, unless Nick has said "send" / "post" / "do it" for *this* action in *this* turn. Approval is per-action and does not carry forward to the next outbound step, even if it looks identical.

**Why.** Nick wants control over what gets transmitted under his identity. A general standing approval ("you can send things") is exactly the wrong shape — it removes the human check that makes outbound traffic auditable and reversible-by-prevention. Set 2026-06-09 after he saw that the Interceptor skill, as installed, can click Send / Post / Submit on real logged-in sessions with no guard. He chose a behavioural rule over a hard `permissions.deny` block so drafting flows stay frictionless; the trade-off only works if the behavioural rule is firm.

**How to apply.**

*Free — no ask needed:*
- Open, read, navigate, search, screenshot, inspect, scrape, view network logs, view inboxes / feeds / threads
- Fill form fields, compose message bodies, write the draft itself
- Save drafts to the service's own draft store (Gmail auto-save, LinkedIn draft, etc.)
- Accept cookie / consent banners on pages opened for reading
- Search-box submissions whose action is "fetch results" (Google, in-app search)

*Must ask, single action only:*
- Any click on Send / Post / Submit / Publish / Reply / Tweet / Confirm / Like / Follow / Share / Subscribe / Buy / Pay / Apply
- Pressing Enter inside a chat, compose, comment, or DM input
- `interceptor chatgpt send`, LinkedIn posting flows, Gmail MCP send, Slack send, Notion writes that publish, any equivalent on any tool
- Form submissions that transmit to a third party (anything that isn't a search)
- Cookie / header / eval changes that mutate Nick's session or trigger side-effect network calls
- Marking emails read, archiving, starring, deleting — *until inbox-handling rules are explicitly defined* (interim default: ask)

*Mechanics:*
- "Draft this email / post / message" means: write it, leave it staged, do not press Send. Tell Nick the draft is ready and what the next single click would be.
- One approval covers one action. "Yes, send" approves *this* send. The next outbound action — even an identical follow-up — needs its own ask.
- Applies across every surface: Interceptor, Browser, Gmail/Calendar/Drive/Notion MCPs, ChatGPT bridge, future agents, any new skill that grows an outbound capability. The rule is the principle; the tool list is non-exhaustive.
- If a workflow seems to require the assistant to chain multiple outbound actions, stop and surface the chain to Nick before any of them — do not approve one then proceed.

Linked: [[feedback-nick-communication-rules]] (general communication standards). Interceptor skill customization at `~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/Interceptor/PREFERENCES.md` references this rule so the skill loads it at invocation time.
