---
name: gotcha-word-pdf-ligature-ats
description: Word for macOS PDF export garbles ti/tf ligatures for ATS parsers — always verify application PDFs with pdftotext before submission
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 033e832d-429b-42ba-93e9-e697c0b09707
---

Always verify job-application PDFs with `pdftotext` before calling them submission-ready. Word for macOS (Quartz PDFContext producer) embeds ligature glyphs with a broken ToUnicode CMap: "ti" extracts as "A", "tf" as "H" (practice→pracAce, platform→plaHorm, national→naAonal). Visually perfect in any viewer; gibberish to every ATS parser.

**Why:** Found 2026-06-12 on Nick's Virgin Australia cover letter. Two re-exports (including font change to Calibri) did NOT fix it; only Format → Font → Advanced → Ligatures: None, then re-export, produced a clean file. The CV from the same machine was unaffected — the bug is per-document, so each PDF must be checked individually.

**How to apply:** Whenever a PDF is destined for a recruiter/ATS: `pdftotext -layout file.pdf - | grep -E 'pracA|Ame |plaHorm|naA|applicaA'` (hits = corrupted) and `pdffonts file.pdf` (multiple/unexpected fonts are a smell). Related: [[gotcha-onedrive-rclone-push]].
