---
name: project-lsv-first-aid-form-analysis
description: "LSV first aid form upgrade analysis (2025/26): report + artifact locations and headline findings for the exec/conference deck"
metadata: 
  node_type: memory
  type: project
  originSessionId: 379c203c-5071-4a12-956b-fe7864d0221f
  modified: 2026-08-09T11:44:57.937Z
---

On 2026-08-09 I analysed `First Aid Form Data.xlsx` (OneDrive 00_Inbox) for Nick's LSV first aid form upgrade evaluation. Everything re-derived from raw season sheets (7,406 cases, 2020/21 to 2025/26); the colleague's 25/26 crunch reconciled exactly, but the Year 2 Year sheet's prior-season formulas are broken (totals show 1; negative captured counts).

- Report: `~/Documents/workspace/projects/lsv-first-aid-form/FirstAidFormAnalysis2025-26.md` (analysis scripts in `analysis/`)
- Artifact (conference visual): https://claude.ai/code/artifact/2ccce9a8-6a50-4edf-8e32-91c045e7765b
- Headlines: 87.1% of cases documented within 1h of treatment (unmeasurable under old form); median 4 min open-to-final-edit, 95.0% completion; conditional branches answered 96.6–100%; unidentified patients halved (27.9%→14.0%); all 7 resus cases carry 11/12-field clinical timelines vs 14/28 any-detail under old form; SAMPLE capture 6–7% is the top training target; DOB/address/nationality declines are by-design (optional group), not member failure.
- No satisfaction survey exists in the data; satisfaction claims must stay behavioural. Related: [[feedback-lsv-proposal-register]].
