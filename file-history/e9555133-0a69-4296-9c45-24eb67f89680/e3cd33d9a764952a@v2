---
name: ResumeExport
description: "Formatting-faithful markdown → .docx export for Nick's resumes and cover letters, using template surgery so the output matches his real Word documents exactly (font, sizes, ligatures, margins, headings, bullets, section nesting, header/footer). Wraps the proven pipeline at PAI/TOOLS/DocxExport: it keeps an original .docx as a style template, preserves every part (styles/theme/fontTable/settings/numbering/headers) byte-for-byte, and regenerates only the document body by cloning the template's exact property blocks. Resume template = the 2026-06-12 Eng CV (the submitted Virgin Australia source): 3-zone margins (title 0.5\", summary, body ~0.8\"), NoSpacing tight spacing, two-line job headers, bold-italic skill labels with tab columns, Technology lines, and Leadership/Independent-Engagements nesting. Cover-letter output is byte-identical formatting to the original. Renders straight to OneDrive or the Mac for review. USE WHEN export resume, export cover letter, resume to docx, cover letter to docx, md to docx, markdown to word resume, generate CV docx, convert resume to word, make my resume/CV file, resume export, application docx, regenerate the CV. NOT FOR writing resume/cover-letter CONTENT (use the career-positioning agent), general markdown → PDF documents (use the MD→PDF→OneDrive pipeline), or non-Nick documents."
version: 1.0.0
effort: low
---

## Customization

**Before executing, check for user customizations at:**
`~/.claude/PAI/USER/SKILLCUSTOMIZATIONS/ResumeExport/`

If this directory exists, load and apply any PREFERENCES.md (e.g. a different default template or OneDrive destination). Otherwise proceed with skill defaults.

## MANDATORY: Voice Notification (before any action)

```bash
curl -s -X POST http://localhost:31337/notify -H "Content-Type: application/json" \
  -d '{"message": "Running the ResumeExport skill to export the document to docx"}' > /dev/null 2>&1 &
```
Then output: `Running the **ResumeExport** skill to export <doc> to .docx...`

## What this does

Tool: `~/.claude/PAI/TOOLS/DocxExport/` (bun/TypeScript, no python-docx). It does **template surgery** — keeps Nick's real `.docx` as the style template, preserves every non-body part byte-for-byte, and regenerates only `word/document.xml` from markdown by cloning the template's exact property blocks. So formatting fidelity is a consequence of reusing the originals, not re-derived.

## Workflow

1. **Get the markdown.** If Nick supplies a `.md`, use it. To pull editable markdown from an existing doc: `bun src/extract.ts resume|coverletter <file.docx>`. Author resumes in the contract below (full annotated example: `templates/resume.md` and `~/Documents/workspace/docx-export-proofs/virgin-cv/virgin-cv-source.md`).

2. **Export:**
   ```bash
   cd ~/.claude/PAI/TOOLS/DocxExport
   bun src/export.ts resume      <input.md> <out.docx>
   bun src/export.ts coverletter <input.md> <out.docx>
   # --template <docx> to template from a specific original instead of the default
   ```
   Defaults: resume → the 2026-06-12 Eng CV template; cover letter → the latest letter template (both in `profiles/`).

3. **Deliver.** Never put `.md` in OneDrive — only the rendered `.docx`. Write straight to the destination:
   - OneDrive: `bun src/export.ts ... "$HOME/OneDrive/02_Career/Job_Applications/2026/<Company>/Cover Letter - Nicholas Wood.docx"` (verify with `rclone lsl`; force-push with `rclone copy` if a mount stalls — see [[gotcha-onedrive-rclone-push]]).
   - Mac review: **delete the old file first, then scp** (overwriting in place can leave Word holding a stale copy):
     ```bash
     ssh mac 'rm -f ~/Downloads/<name>.docx'
     scp -p <out.docx> "mac:/Users/nicholaswood/Downloads/<name>.docx"
     ssh mac 'ls -la ~/Downloads/<name>.docx'   # confirm a current timestamp
     ```

4. **Verify** (optional but expected for new templates): `bun src/render.ts <out.docx> out.html` → screenshot on the Mac with headless Chrome, compare to the source. Or `bun src/verify.ts <expected.docx> <out.docx>`. Regression: `bun src/selftest.ts` (24 checks).

## Markdown contract

Resume contract (full table in `~/.claude/PAI/TOOLS/DocxExport/README.md`): `# Name`; contact lines (`|`-split, emails/URLs auto-hyperlinked); plain summary paragraph; `## Section` = bold+underline header; `- **Label:** rest` skill bullets (bold-italic label, tab, italic content); `### Company` then `**Role | Dates**` two bold lines; plain intro; `- bullet`; `**Technology:** …`; `**Degree** - Institution`. Leadership and Independent Engagements descriptions/bullets auto-nest (left 284/568/1004) to match the source; Experience stays flat.

Cover-letter contract: just the letter text, paragraphs separated by blank lines; a single newline inside a paragraph = line break (sign-off); inline `**bold**`/`*italic*`. Leading spacers come from the template.

## Gotchas

- **Resume template = the Eng CV, not the Hybrid.** The Hybrid has a different structure and was the original "formatting is wrong" bug. The default `profiles/resume.template.docx` is the correct Eng/Virgin source.
- **Delete the Mac copy before re-pushing.** Re-scp over an open/stale file is the "it's not updating" symptom — `rm` first, then `scp`, then confirm timestamp.
- **docx-preview renders are approximate** — Symbol bullets show as □ and continuous section breaks render as page breaks. These are renderer artifacts, NOT defects; Word renders `•` and flows correctly. Judge the actual `.docx` in Word, not the preview image.
- **Word AppleScript docx→PDF hangs headless over SSH** — don't rely on it for verification.
- **The Mac sleeps intermittently** — `ssh mac` can time out; retry. The workspace `code/` and proof PNGs sync via git; `.docx` does not (gitignored), so scp it directly.
- Related memory: [[reference-docx-export-tool]].

## Execution Log

After completing, append one JSONL line:
```bash
echo '{"ts":"'$(date -u +%Y-%m-%dT%H:%M:%SZ)'","skill":"ResumeExport","input":"8_WORD_SUMMARY","status":"ok|error"}' >> ~/.claude/PAI/MEMORY/SKILLS/execution.jsonl
```
