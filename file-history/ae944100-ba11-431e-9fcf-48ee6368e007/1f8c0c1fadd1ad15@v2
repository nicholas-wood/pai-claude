---
name: _OUTLOOK
description: Draft a fully-formatted email into Outlook for Mac — opens a ready-to-review compose window, never sends. Drives classic Outlook via AppleScript with HTML content so paragraphs, bullet lists, and numbered lists render correctly; degrades to a plain-text mailto draft if only New Outlook is present. Pulls recipient addresses from CONTACTS.md and writes in Nick's email voice. USE WHEN draft an email, write an email to X, email X about Y, open a draft in Outlook, compose an email, reply to X, send an email (draft it for review). NOT FOR actually transmitting mail unattended (this is draft-only), Gmail/web mail (no Outlook desktop), or bulk/broadcast sends (use _BROADCAST). Mac only — requires osascript.
---

# _OUTLOOK

Open a formatting-correct email draft in Outlook for Mac. You write the message in Nick's voice as lightweight Markdown; the tool converts it to clean HTML and opens an editable Outlook compose window for Nick to review and send. **It never sends on its own** — that boundary is deliberate (PAI autonomy: `send_external_message` must ask).

## Voice Notification

**When executing a workflow, do BOTH:**

1. **Send voice notification**:
   ```bash
   curl -s -X POST http://localhost:31337/notify \
     -H "Content-Type: application/json" \
     -d '{"message": "Running DraftEmail in the Outlook skill"}' \
     > /dev/null 2>&1 &
   ```

2. **Output text notification**:
   ```
   Running **DraftEmail** in **_OUTLOOK**...
   ```

**Full documentation:** `~/.claude/PAI/DOCUMENTATION/Notifications/NotificationSystem.md`

## Workflow Routing

| Workflow | Trigger | File |
|----------|---------|------|
| **DraftEmail** | "draft an email", "email X about Y", "write an email", "open a draft" | `Workflows/DraftEmail.md` |

## How It Works

`Tools/DraftOutlook.ts` is the engine. Two paths, chosen automatically:

1. **Classic Outlook (primary)** — AppleScript via `osascript` sets the message `content` as **HTML**, so rich formatting survives. This is the only path that renders paragraphs and lists properly.
2. **New Outlook / fallback** — if the AppleScript path errors (New Outlook is not scriptable), the tool opens a `mailto:` draft instead. **Plain text only**: paragraphs survive as blank lines and lists as `-`/`1.` prefixes, but there is no bold, italic, or true list markup. The tool prints a warning when this happens.

Author the body in Markdown. Supported and tested: paragraphs (blank-line separated), bullet lists (`- ` / `* `), numbered lists (`1. `), **bold**, *italic*, and `[links](url)`. Headings degrade to bold paragraphs. A single newline inside a paragraph becomes a `<br>` (good for sign-offs).

## Examples

**Example 1: Draft from a natural request**
```
User: "Draft an email to Sarah thanking her for the proposal, with the three changes I mentioned as bullets."
→ Resolve "Sarah" → address from CONTACTS.md (confirm if ambiguous)
→ Write the body as Markdown in Nick's voice, changes as a bullet list
→ bun Tools/DraftOutlook.ts --to sarah@... --subject "Proposal feedback" --body-file /tmp/draft.md
→ Outlook compose window opens, formatted, for Nick to review and send
```

**Example 2: Multi-recipient with a numbered next-steps list**
```
User: "Email the board the decision and list the next steps in order."
→ Body has a paragraph then a 1./2./3. list
→ Tool emits <ol><li>… ; draft opens with a real numbered list
```

**Example 3: New Outlook only**
```
→ AppleScript path errors → tool warns and opens a mailto plain-text draft
→ Tell Nick formatting is degraded and why; offer to install classic Outlook if he wants rich drafts
```

## Gotchas

- **New Outlook for Mac is not AppleScript-scriptable.** This is the single biggest failure mode. The "new" redesigned Outlook (now the default) dropped most AppleScript support, so the rich-HTML path only works on **classic Outlook** ("Outlook" → menu → *Revert to Legacy Outlook*, or older builds). The tool auto-falls back to plain-text mailto and warns — but if Nick expects bold/lists, he must be on classic Outlook. Don't claim formatting worked on the fallback path.
- **Draft-only, always.** The tool has no send path. Never add one without an explicit ask — sending external mail unattended violates PAI autonomy.
- **Never built the draft? Verify by looking.** This tool runs on the **Mac only** (`osascript`/`open` don't exist on Linux). From a Linux session you can only `--dry-run` (prints HTML + AppleScript). The live "draft opened" check must happen on the Mac.
- **Body via `--body-file`, not `--body`, for anything multi-line.** Shell-escaping newlines and quotes through `--body` is fragile. Write the Markdown to a temp file and pass `--body-file`. (`--body` does convert a literal `\n` to a newline as a convenience, but files are safer.)
- **Recipient resolution is yours, not the tool's.** The tool takes raw addresses. Resolve names → addresses from `~/.claude/PAI/USER/CONTACTS.md` before calling, and confirm with Nick if a name is ambiguous or the address isn't on file.
- **Account selection is not wired.** The draft opens from Outlook's default account. If Nick needs a specific From account, he picks it in the compose window. (Add `--account` support later if this becomes routine.)
- **HTML is single-lined on purpose.** AppleScript string literals can't span raw newlines, so the converter emits one-line HTML and escapes `"`/`\`. Don't "prettify" the HTML with newlines — it'll break the AppleScript.
- **`mailto:` body length.** Some setups truncate very long `mailto:` URLs. The fallback is for short notes; long formatted emails need the classic-Outlook path.

## Skill Type

Type 4 (Business Process automation) over a deterministic tool wrapper — anti-fragile per BPE: it does something the model cannot do from text alone (drive `osascript`, convert to Outlook-safe HTML, enforce draft-only).
