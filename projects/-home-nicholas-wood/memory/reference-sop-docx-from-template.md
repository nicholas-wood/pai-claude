---
name: reference-sop-docx-from-template
description: "Pattern for generating an LSV-style SOP .docx from markdown using python-docx on Mac, preserving the SOP 5.11 template's headers/footers/styles. Pinning runs to Arial 10pt overrides template style traps."
metadata: 
  node_type: memory
  type: reference
  originSessionId: b4b0bd7f-dd75-4316-a5e0-be83a4f906a1
---

When Nick needs an LSV SOP rendered as a Word .docx that visually matches the LSV template, use python-docx on the Mac (not Linux — see [[reference-onedrive-rclone-linux-cache]]).

**Style template:** `~/OneDrive/06_Lifesaving/LSV/Reference/SOP-Templates/SOP 5.11 - PRE Activation V1.docx`. Open with python-docx, clear body content (preserve final `<w:sectPr>`), rebuild paragraphs using the template's `Title`, `heading 1`, `heading 2`, `heading 3`, `List Paragraph`, and `Table Grid` styles. Headers, footer, theme, numbering, fonts inherit automatically.

**Three traps in this specific template:**

1. **`List Paragraph` style forces Times New Roman + 12pt** (`<w:rFonts ascii="Times New Roman"/><w:sz val="24"/>` in `styles.xml`). Bullets inherit this and look wrong against Arial body. Fix: pin every run to Arial + 10pt by setting `run.font.name`, `run.font.size = Pt(10)`, and writing `<w:rFonts>` with `ascii/hAnsi/cs/eastAsia="Arial"` directly on the run's `rPr`.
2. **`Normal` style has no `space_after`** — paragraphs render flush against each other. Set `paragraph.paragraph_format.space_after = Pt(6)` (120 twips) on every body and bullet paragraph to match the template's actual body spacing.
3. **Footer text is split across many `<w:t>` runs** (e.g. `SOP` + ` ` + `5` + `.` + `11` + ` – ` + `Public Rescue Equipment` + ` Activation`). Don't join-and-rewrite — you'll lose the run structure (and visible spaces around fields like Page X of Y). Instead, per-run replace by exact text match: `{"5": "1", "11": "4.1", "Public Rescue Equipment": "Patrolling Areas", " Activation": "", "Emergency": "Patrol"}`.

**Audience table format (from this template):** roles are columns, knowledge levels (Basic Awareness / Working Knowledge / Expert Knowledge) are rows. 4 rows × (1 + N roles) cols. Header row and first column both bolded. Don't transpose it — Nick will catch it.

**Working script:** `~/.claude/jobs/<job-id>/build_sop_docx.py` (this job preserved one) — has all the helpers (`_style_run`, `_style_body_para`, `make_table`, footer per-run replace) wired up. Reusable shape for any future SOP build.

**Output path convention:** drop the .docx next to the source markdown in the relevant project OneDrive folder, with matching name (e.g. `SOP X.Y - Title V0.1.docx` alongside `SOP X.Y - Title V0.1.md`). The .md stays the source of truth; the .docx is for sharing with reviewers.
