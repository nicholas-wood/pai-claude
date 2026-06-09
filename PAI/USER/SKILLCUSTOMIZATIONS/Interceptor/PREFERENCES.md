# Interceptor — User Preferences

## Outbound actions: explicit approval required (HIGHEST PRIORITY)

This skill operates inside Nick's real, logged-in Chrome sessions. Anything it does is attributable to him.

**Rule:** every outbound action requires Nick's explicit, single-action approval. Drafting is fine; transmitting is not. The full rule lives in the global feedback memory at `~/.claude/projects/-home-nicholas-wood/memory/feedback-outbound-explicit-approval.md` and applies across every tool, not just Interceptor. Read it before running any workflow that could click a Send / Post / Submit / Publish / Reply button.

**Quick reference for this skill specifically:**

Free without asking (use these freely):
- `interceptor open`, `read`, `tree`, `text`, `html`, `find`, `state`, `diff`, `inspect`, `screenshot`, `tabs`, `status`
- `interceptor net log`, `net headers`, `sse log`, `sse streams`
- `interceptor scroll`, `hover`, `wait`, `back`, `forward`, `navigate`
- `interceptor type <ref> "text"` to *draft* in a compose / form field — drafting only, do not press Send afterwards
- `interceptor monitor` (recording user actions, not initiating them)
- `interceptor canvas log/objects/read/ocr`, `scene list/profile/selected/text`

Must surface to Nick and get explicit "send" / "post" / "do it" before invoking, every single time:
- `interceptor click` on any Send / Post / Submit / Publish / Reply / Tweet / Confirm / Like / Follow / Share / Subscribe / Buy / Pay / Apply button
- `interceptor keys "Enter"` (or any keyboard shortcut) inside a chat / compose / comment / DM input
- `interceptor act <ref>` when the act includes form submission to a third party
- `interceptor chatgpt send` — always
- `interceptor linkedin` posting flows — always
- `interceptor scene insert` if the document is shared / published / collaborative
- `interceptor cookies set`, `headers add`, `override`, `eval` (with side effects) — surface first
- Email actions (mark read, archive, star, delete) — surface first, until inbox-handling rules exist

**Draft pattern.** When Nick asks for a "draft", the deliverable is: message composed and visible in the compose field, cursor positioned, screenshot showing the draft + the unpressed Send button. Then stop. Report what the next single action would be. Wait.

**Approval scope.** Approval is per action. "Yes send" approves *this* send only. The next outbound action — even an identical follow-up — needs its own approval. If a workflow appears to need a chain of outbound actions, surface the whole chain first; do not approve one then proceed.

**No silent retry.** If an outbound action fails, do not retry without re-asking.
