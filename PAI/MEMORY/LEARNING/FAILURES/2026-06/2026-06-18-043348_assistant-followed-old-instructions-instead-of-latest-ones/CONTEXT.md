---
capture_type: FAILURE_ANALYSIS
timestamp: 2026-06-18 04:33:48 PST
rating: 3
description: assistant-followed-old-instructions-instead-of-latest-ones
session_id: e9555133-0a69-4296-9c45-24eb67f89680
---

# Failure Analysis: assistant followed old instructions instead of latest ones

**Date:** 2026-06-18
**Rating:** 3/10
**Summary:** Terse correction: follow latest instructions, not conflicting older ones

---

## What Happened

Nick is redirecting the AI with a pointed correction about methodology. The message implies the AI was following outdated or conflicting guidance when newer instructions existed. This is a classic 'that's not what I said' correction—brief, direct, no elaboration, signaling the AI took the wrong approach. The confidence is high because context shows the previous response was incomplete and potentially drawing from mixed sources. Not angry, but clear dissatisfaction requiring immediate course correction.

---

## Conversation Summary

**USER:** wrote templates/coverletter.md (11 lines)

**USER:** File created successfully at: /home/nicholas-wood/.claude/PAI/TOOLS/DocxExport/templates/resume.md (file state is current in your context — no need to Read it back)

**ASSISTANT:** Let me confirm the authoring templates themselves export cleanly (final end-to-end sanity), and re-run the full harness.

**USER:** === export the authoring templates ===
✓ wrote /tmp/tmpl-cover.docx (from coverletter template: /home/nicholas-wood/.claude/PAI/TOOLS/DocxExport/profiles/coverletter.template.docx)
✓ wrote /tmp/tmpl-resume.docx (from resume template: /home/nicholas-wood/.claude/PAI/TOOLS/DocxExport/profiles/resume.template.docx)
=== validate both outputs ===
tmpl-cover.docx p-balanced: [0m[33mtrue[0m r-balanced: [0m[33mtrue[0m badAmp: [0m[33mfalse[0m paras: [0m[33m8[0m
tmpl-resume.docx p-balanced: [...

**ASSISTANT:** Everything works end-to-end: authoring templates export to valid docx, all 24 regression checks pass. The tool is complete. Let me record this as durable memory so future sessions use it instead of re-failing at docx formatting.

**USER:** File created successfully at: /home/nicholas-wood/.claude/projects/-home-nicholas-wood--claude/memory/reference-docx-export-tool.md (file state is current in your context — no need to Read it back)

**USER:** 1	- [Claude tree migrated from Mac](project-claude-tree-migrated-from-mac.md) — stale /Users paths break PAI + plugins on Linux; grep before debugging
2	- [Outreach message tone](feedback-outreach-message-tone.md) — warm "Hi X, I applied but wanted to say hi" open + collaborative close; not terse
3	- [Word PDF ligature ATS bug](gotcha-word-pdf-ligature-ats.md) — Word macOS PDFs garble ti/tf for ATS; always pdftotext-verify before submission
4	- [OneDrive rclone push](gotcha-onedrive-rclone-push....

**USER:** The file /home/nicholas-wood/.claude/projects/-home-nicholas-wood--claude/memory/MEMORY.md has been updated successfully. (file state is current in your context — no need to Read it back)

**ASSISTANT:** Done. Here's where it landed.

## What I built

`~/.claude/PAI/TOOLS/DocxExport/` — a bun/TypeScript md→docx exporter using **template surgery**: it keeps your original `.docx` as the style template, preserves every part (`styles.xml`, `theme`, `fontTable`, `settings.xml` with the ligature flag, `numbering`, headers/footers) **byte-for-byte**, and regenerates only the body by cloning the template's exact property blocks. Fidelity is a consequence of reusing your originals, not something re-deriv...

**USER:** You should follow the latest ones where there are discrepencies.

---

## Tool Calls (93 total)

- **Bash**: {"command":"cd /home/nicholas-wood/.claude/PAI/TOOLS/DocxExport\nbun src/selftest.ts","description":"Run the regression harness"}...
- **Bash**: {"command":"cd /home/nicholas-wood/.claude/PAI/TOOLS/DocxExport\nbun src/render.ts .work/out-cover.docx  .work/render/out-cover.html  \"EXPORTED — Cover Letter (final)\"\nbun src/render.ts .work/out-r...
- **Read**: {"file_path":"/home/nicholas-wood/.claude/PAI/TOOLS/DocxExport/.work/render/shot-out-resume.png"}...
- **Write**: {"file_path":"/home/nicholas-wood/.claude/PAI/TOOLS/DocxExport/README.md","content":"# DocxExport — markdown → .docx, formatting-faithful\n\nExports Nick's resumes and cover letters from markdown to `...
- **Bash**: {"command":"cd /home/nicholas-wood/.claude/PAI/TOOLS/DocxExport\nmkdir -p templates\n# .gitignore\ncat > .gitignore <<'EOF'\nnode_modules/\n.work/\n*.docx.bak\nEOF\n# Cover letter template\ncat > temp...
- **Write**: {"file_path":"/home/nicholas-wood/.claude/PAI/TOOLS/DocxExport/templates/resume.md","content":"# Nicholas Wood\n0427 081 551 | nicholas.h.wood@outlook.com | linkedin.com/in/nicholas-wood/\n\n**One-lin...
- **Bash**: {"command":"cd /home/nicholas-wood/.claude/PAI/TOOLS/DocxExport\necho \"=== export the authoring templates ===\"\nbun src/export.ts coverletter templates/coverletter.md /tmp/tmpl-cover.docx 2>&1 | tai...
- **Write**: {"file_path":"/home/nicholas-wood/.claude/projects/-home-nicholas-wood--claude/memory/reference-docx-export-tool.md","content":"---\nname: reference-docx-export-tool\ndescription: Formatting-faithful ...
- **Read**: {"file_path":"/home/nicholas-wood/.claude/projects/-home-nicholas-wood--claude/memory/MEMORY.md"}...
- **Edit**: {"replace_all":false,"file_path":"/home/nicholas-wood/.claude/projects/-home-nicholas-wood--claude/memory/MEMORY.md","old_string":"- [Job application selection criteria](feedback-job-application-selec...

---

## Files in This Capture

| File | Description |
|------|-------------|
| `CONTEXT.md` | This analysis document |
| `transcript.jsonl` | Full raw conversation (666 entries) |
| `sentiment.json` | Sentiment analysis metadata |
| `tool-calls.json` | Extracted tool invocations (93 calls) |

---

## Learning System Notes

This failure has been captured for retroactive analysis. The learning system should:

1. Review the full transcript for root cause
2. Identify systemic issues that contributed
3. Determine if this failure type has occurred before
4. Propose improvements to prevent recurrence

**Action Required:** This capture needs manual review to extract learnings.
