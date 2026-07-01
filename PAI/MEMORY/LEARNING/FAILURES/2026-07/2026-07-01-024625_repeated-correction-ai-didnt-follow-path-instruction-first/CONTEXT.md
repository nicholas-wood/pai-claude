---
capture_type: FAILURE_ANALYSIS
timestamp: 2026-07-01 02:46:25 PST
rating: 3
description: repeated-correction-ai-didnt-follow-path-instruction-first
session_id: 6fd2be19-e374-4bb7-8cc1-78aa745175de
---

# Failure Analysis: repeated correction ai didnt follow path instruction first

**Date:** 2026-07-01
**Rating:** 3/10
**Summary:** Repeated correction, AI didn't follow path instruction first time

---

## What Happened

Nick had to correct the file location twice. The AI acknowledged the path ('Got it — that locks the shape') but still wrote to ~/Documents/workspace/projects/lsv-comms/... instead of lifesaving/lsv/lsv-comms-officer. The terse repetition signals clear frustration: AI failed to execute, forcing a re-correction. This is a 'that's not what I said' moment, indicating the instruction wasn't properly internalized or executed.

---

## Conversation Summary

**USER:** Your questions have been answered: "Where should the MVP (first-pass) line sit? You flagged maps/notifications/prediction as 'is this first pass?' repeatedly — I need the committed v1 boundary so Primary/Secondary/Tertiary become real phases."="The form to capture SRR, linking it to a patrol/unit, being able to review the entered data, from patrol, field and dispatch views should all be in the first path along with minimal updates to reporting. This would be including the SRR in a patrol report,...

**ASSISTANT:** Got it — that locks the shape. Before I write, let me place this in the right project folder.

**USER:** ---
accessbuddy
byd-shark-6
envelope-os
inkwell
life-os-console
lifesaveroncall
oc-ev-energy

**ASSISTANT:** No existing LSV comms folder — I'll create one and write the redraft as markdown source there (source stays in the workspace; the `.docx` export goes to OneDrive only once you've blessed the content).

Your answers lock the shape cleanly. Writing the redraft now.

**USER:** created

**USER:** File created successfully at: /home/nicholas-wood/Documents/workspace/projects/lsv-comms/srr-feature-brief/LIMSOC-BRIEF-LSV-2026-005-SRR.md (file state is current in your context — no need to Read it back)

**ASSISTANT:** Redraft written to `~/Documents/workspace/projects/lsv-comms/srr-feature-brief/LIMSOC-BRIEF-LSV-2026-005-SRR.md`, same section structure as Flynn's original.

**What the redraft fixes (all 30 comments resolved):**
- **Reframed as a feature, not an integration** — Overview now says we rebuild the SLSA SRR *experience* natively and replicate the research-backed model exactly, not build a new tool.
- **Problem Statement rewritten** to the real current state: reliance on the ops app, no persistence/...

**USER:** This should be under lifesaving/lsv/lsv-comms-officer

**USER:** ---projects---
accessbuddy
byd-shark-6
envelope-os
inkwell
life-os-console
lifesaveroncall
lsv-comms
oc-ev-energy
---top level---
_bases/
docx-export-proofs/
lifesaving/
pai/
personal/
projects/
references/
Shell cwd was reset to /home/nicholas-wood/.claude

**USER:** === lifesaving/ ===
total 20
drwxrwxr-x  5 nicholas-wood nicholas-wood 4096 Jun 18 14:50 .
drwxr-xr-x 12 nicholas-wood nicholas-wood 4096 Jun 29 13:54 ..
drwxrwxr-x  3 nicholas-wood nicholas-wood 4096 Jun 18 14:50 lsv
drwxrwxr-x  3 nicholas-wood nicholas-wood 4096 Jun 18 14:50 slsa
drwxrwxr-x  3 nicholas-wood nicholas-wood 4096 Jun 18 14:50 smlsc
=== lifesaving/lsv (if exists) ===
total 12
drwxrwxr-x 3 nicholas-wood nicholas-wood 4096 Jun 18 14:50 .
drwxrwxr-x 5 nicholas-wood nicholas-wood 4096 ...

---

## Tool Calls (12 total)

- **Bash**: {"command":"cd \"$CLAUDE_JOB_DIR/tmp\"; which pandoc && pandoc srr.docx -t markdown --track-changes=all 2>/dev/null | head -5 && echo \"PANDOC_OK\" || echo \"NO_PANDOC\"","description":"Check pandoc a...
- **Bash**: {"command":"cd \"$CLAUDE_JOB_DIR/tmp\"/srr; python3 - <<'PY'\nimport re, xml.etree.ElementTree as ET\nns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}\nW='{%s}'%ns['w']\n\n# ---...
- **Bash**: {"command":"cd \"$CLAUDE_JOB_DIR/tmp\"/srr; python3 - <<'PY'\nimport xml.etree.ElementTree as ET\nns={'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}\nW='{%s}'%ns['w']\ntree=ET.par...
- **Read**: {"file_path":"/home/nicholas-wood/OneDrive/00_Inbox/Screenshot 2026-07-01 at 13.52.38.png"}...
- **AskUserQuestion**: {"questions":[{"question":"Where should the MVP (first-pass) line sit? You flagged maps/notifications/prediction as 'is this first pass?' repeatedly — I need the committed v1 boundary so Primary/Secon...
- **Bash**: {"command":"fd -t d -i 'lsv|comms|srr|surf.risk' ~/Documents/workspace 2>/dev/null | head; echo \"---\"; ls ~/Documents/workspace/projects 2>/dev/null","description":"Find LSV comms workspace folder"}...
- **Bash**: {"command":"mkdir -p ~/Documents/workspace/projects/lsv-comms/srr-feature-brief; echo created","description":"Create LSV comms SRR project folder"}...
- **Write**: {"file_path":"/home/nicholas-wood/Documents/workspace/projects/lsv-comms/srr-feature-brief/LIMSOC-BRIEF-LSV-2026-005-SRR.md","content":"# LIMSOC FEATURE BRIEF\n\n## Surf Risk Rating in LIMSOC\n\n| Fie...
- **Bash**: {"command":"cd ~/Documents/workspace; fd -t d -i 'lifesaving|lsv' . 2>/dev/null | head -20; echo \"---projects---\"; ls projects 2>/dev/null; echo \"---top level---\"; ls -d */ 2>/dev/null","descripti...
- **Bash**: {"command":"cd ~/Documents/workspace/lifesaving; echo \"=== lifesaving/ ===\"; ls -la; echo \"=== lifesaving/lsv (if exists) ===\"; ls -la lsv 2>/dev/null || echo \"no lsv dir yet\"; echo \"=== find c...

---

## Files in This Capture

| File | Description |
|------|-------------|
| `CONTEXT.md` | This analysis document |
| `transcript.jsonl` | Full raw conversation (117 entries) |
| `sentiment.json` | Sentiment analysis metadata |
| `tool-calls.json` | Extracted tool invocations (12 calls) |

---

## Learning System Notes

This failure has been captured for retroactive analysis. The learning system should:

1. Review the full transcript for root cause
2. Identify systemic issues that contributed
3. Determine if this failure type has occurred before
4. Propose improvements to prevent recurrence

**Action Required:** This capture needs manual review to extract learnings.
