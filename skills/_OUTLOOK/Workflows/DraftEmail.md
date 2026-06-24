# DraftEmail Workflow

Open a formatting-correct email draft in Outlook for Mac. Draft-only — Nick reviews and sends.

## Voice Notification

```bash
curl -s -X POST http://localhost:31337/notify \
  -H "Content-Type: application/json" \
  -d '{"message": "Running DraftEmail in the Outlook skill"}' \
  > /dev/null 2>&1 &
```

Running **DraftEmail** in **_OUTLOOK**...

## Step 1: Resolve recipients

- Map any names in the request to addresses from `~/.claude/PAI/USER/CONTACTS.md`.
- If a name is ambiguous or not on file, **ask Nick** rather than guessing.
- Collect `to`, and `cc`/`bcc` if mentioned.

## Step 2: Write the body in Nick's voice as Markdown

- Match Nick's email register: direct, warm where appropriate, no filler, Australian English, no em dashes. See `~/.claude/PAI/USER/WRITINGSTYLE.md` and `~/.claude/PAI/USER/CONTACTS.md` for relationship tone.
- Use the Markdown the converter supports:
  - Blank line between paragraphs.
  - `- ` or `* ` for bullet lists.
  - `1. ` for numbered lists.
  - `**bold**`, `*italic*`, `[text](url)`.
  - Single newline inside a paragraph = a line break (use for sign-offs).
- Write the body to a temp file so newlines/quotes survive cleanly:

```bash
cat > /tmp/outlook-draft.md <<'EOF'
Hi Sarah,

Thanks for sending the proposal through. Three changes before we lock it:

- Add a third pricing tier
- Tighten the Phase 2 timeline
- Pull the appendix forward

Happy to talk it through tomorrow.

Nick
EOF
```

## Step 3: Open the draft

```bash
bun ~/.claude/skills/_OUTLOOK/Tools/DraftOutlook.ts \
  --to "sarah@example.com" \
  --subject "Proposal feedback" \
  --body-file /tmp/outlook-draft.md
```

### Intent-to-Flag Mapping

| User says | Flag | Effect |
|-----------|------|--------|
| names a second/third recipient | `--cc "a@b.com,c@d.com"` | adds CC recipients |
| "blind copy", "bcc" | `--bcc "a@b.com"` | adds BCC recipients |
| (multi-line body — always) | `--body-file /tmp/outlook-draft.md` | safe newline/quote handling |
| (one-liner only) | `--body "..."` | inline body; `\n` becomes a newline |
| "plain text", "simple", "no formatting" | `--plain` | force the mailto plain-text path |
| "show me what it'll generate", "don't open it yet" | `--dry-run` | print HTML + AppleScript, run nothing |

## Step 4: Confirm and report

- On success the tool prints `✓ Draft opened in Outlook (HTML, …)`. Tell Nick the draft is open for review.
- If it prints the **New Outlook fallback warning**, tell Nick the draft opened as **plain text** (no bold/lists) because classic Outlook isn't available, and ask whether that's fine or he wants the rich path.
- **Never send.** The tool cannot send; do not work around that.

## Step 5 (Linux sessions only): dry-run

If running from Linux (no `osascript`), you can only validate generation:

```bash
bun ~/.claude/skills/_OUTLOOK/Tools/DraftOutlook.ts --to x@y.com --subject "Test" --body-file /tmp/outlook-draft.md --dry-run
```

This prints the HTML and AppleScript so you can check the formatting, but the actual draft must be opened on the Mac.
