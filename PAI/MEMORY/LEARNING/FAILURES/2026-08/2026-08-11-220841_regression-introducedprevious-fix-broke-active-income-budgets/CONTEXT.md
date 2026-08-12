---
capture_type: FAILURE_ANALYSIS
timestamp: 2026-08-11 22:08:41 PST
rating: 3
description: regression-introducedprevious-fix-broke-active-income-budgets
session_id: cb80c131-2daa-417e-bbc4-8dc173fae87a
---

# Failure Analysis: regression introducedprevious fix broke active income budgets

**Date:** 2026-08-11
**Rating:** 3/10
**Summary:** Regression introduced—previous fix broke active income budgets

---

## What Happened

Nick is reporting that the budget history backfill iteration (v1.13.0) introduced a regression: his active income budgets have disappeared. The terse, factual message signals frustration without elaboration—he's discovered a problem with the 'improvement' and needs it fixed. This is a clear miss despite good intentions. The implication: the backfill logic may have overwritten or deleted active budget entries while importing historical data. Nick trusted the iteration; now a core feature is broken.

---

## Conversation Summary

**USER:** link parsing present in paginate: True
client events ok
16: * Link header. paginate() follows rel="next" until the header stops offering
191:      url = nextLink(res.headers.get("link"));
198:   * (array of transactions) at a time; follows the Link rel="next" header until
227:      next = parseNextLink(res.headers.get("Link"));

**USER:** 264:export function parseNextLink(linkHeader: string | null): string | null {
265-  if (!linkHeader) return null;
266-  for (const part of linkHeader.split(",")) {
267-    const match = part.match(/<([^>]+)>\s*;\s*rel="?next"?/i);
268-    if (match && match[1]) return match[1].trim();
269-  }
270-  return null;
271-}
272-
ok
scripts/backfill-budget-history.ts(112,20): error TS2339: Property 'category' does not exist on type '{ expense?: { periods?: { start_date?: string; end_date?: string; forec...

**USER:** history module ok

**USER:** script rewritten
[backfill] events 2023-07-01..2026-08-12 (budget series occurrences)
[backfill] 1695 events fetched

Savings (env-savings): SKIPPED — concurrent budget series overlap; import by hand if needed

Gas (env-gas): SKIPPED — concurrent budget series overlap; import by hand if needed

Salary (inc-salary) [income] — takeover 2026-06-01:
  2023-07-01 .. 2023-09-30  6363.61/mo
  2023-10-01 .. 2024-06-30  6269.21/mo
  2024-08-01 .. 2024-12-31  7323.26/mo
  2025-01-01 .. 2026-05-31  7454.60...

**USER:** [backfill] backup written: /home/nicholas-wood/.penny/penny.pre-history-backfill.db
[backfill] events 2023-07-01..2026-08-12 (budget series occurrences)
[backfill] 1695 events fetched

Savings (env-savings): SKIPPED — concurrent budget series overlap; import by hand if needed

Gas (env-gas): SKIPPED — concurrent budget series overlap; import by hand if needed

Salary (inc-salary) [income] — takeover 2026-06-01:
  2023-07-01 .. 2023-09-30  6363.61/mo
  2023-10-01 .. 2024-06-30  6269.21/mo
  2024-...

**USER:** BUDGET PAGE row: {
 "id": "575bffc3-334e-42cd-83cb-883898d06484",
 "parentId": null,
 "name": "Relocation",
 "group": "",
 "rolloverRule": "roll_carry",
 "targetType": "no_target",
 "targetAmountCents": 0,
 "type": "expense",
 "active": true,
 "archived": false,
 "period": "monthly",
 "rolloverStart": "2026-07-01",
 "carryoverCents": 0,
 "ownCarryoverCents": 0,
 "allocationCents": 0,
 "ownAllocationCents": 0,
 "totalCents": 0,
 "leftCents": -163775,
 "depth": 0
}
CATEGORY PAGE monthly overview: ...

**USER:** budgetpage ok
 441 pass
 0 fail
[0m[2m[35m$[0m [2m[1mtsc -p tsconfig.json --noEmit && tsc -p web/tsconfig.json --noEmit && tsc -p web/tsconfig.test.json --noEmit[0m
[0m[2m[35m$[0m [2m[1meslint web/src[0m

**USER:** [32m✓ built in 7.02s[39m
active
v1.13.0 (47b4280 · 2026-08-12)
ok
267b10e budgetbuddy ISA: ISC-208..210
1d144c9 budgetbuddy v1.13.0: PocketSmith budget-history backfill (events→series eras→versions; 6 historical budgets imported incl. Salary's 1/1/25 era + 3 earlier; Savings/Gas skipped on concurrent series); budget-page edit path passes rolloverStart (unset-vs-set modal split)

**ASSISTANT:** ━━━ 📃 SUMMARY ━━━

🔄 ITERATION on: missing pre-2025 budget history, plus the Relocation discrepancies you spotted mid-run

📃 CONTENT:

**Budget history imported — live as v1.13.0.** You were right: BudgetBuddy had only ever seeded current amounts. I built a backfill that reads PocketSmith's **budget event series** (rate + cadence + start date — not the monthly forecast, which smears your fortnightly salary into month-by-month noise) and reconstructs true budget eras. Applied with an automatic...

**USER:** My active income budgets aren't there anymore

---

## Tool Calls (422 total)

- **Bash**: {"command":"cd ~/Documents/workspace/projects/envelope-os && python3 - <<'EOF'\np='src/ingest/client.ts'; s=open(p).read()\nold=\"\"\"  async trendAnalysis(\n    pocketsmithUserId: number,\n    input:...
- **Bash**: {"command":"cd ~/Documents/workspace/projects/envelope-os && sed -n '/Event: {/,/};/p' src/ingest/pocketsmith/schema.d.ts | grep -E \"@description|\\?:\" | head -30","description":"Event schema fields...
- **Bash**: {"command":"cd ~/Documents/workspace/projects/envelope-os && python3 - <<'EOF'\n# client: paginated events listing\np='src/ingest/client.ts'; s=open(p).read()\nold=\"\"\"  /**\n   * Page through a use...
- **Bash**: {"command":"cd ~/Documents/workspace/projects/envelope-os && rg -n \"function parseNextLink\" -A 8 src/ingest/client.ts | head -10 && python3 - <<'EOF'\np='src/ingest/client.ts'; s=open(p).read()\ns=s...
- **Bash**: {"command":"cd ~/Documents/workspace/projects/envelope-os && python3 - <<'EOF'\n# budget-history: eras from event series (with period labels)\np='src/ingest/budget-history.ts'; s=open(p).read()\nold=\...
- **Bash**: {"command":"cd ~/Documents/workspace/projects/envelope-os && python3 - <<'EOF'\np='scripts/backfill-budget-history.ts'; s=open(p).read()\n\nold=\"\"\"import { erasFromMonthly, planHistoryMerge, type M...
- **Bash**: {"command":"cd ~/Documents/workspace/projects/envelope-os && timeout 600 bun run scripts/backfill-budget-history.ts --apply 2>&1 | tail -20 && bun -e '\nimport {Database} from \"bun:sqlite\";\nconst d...
- **Bash**: {"command":"cd ~/Documents/workspace/projects/envelope-os && cp ~/.penny/penny.db /tmp/pex.db && cp ~/.penny/penny.db-wal /tmp/pex.db-wal 2>/dev/null; bun -e '\nimport { SqliteStore } from \"./src/sto...
- **Bash**: {"command":"cd ~/Documents/workspace/projects/envelope-os && python3 - <<'EOF'\np='web/src/pages/BudgetPage.tsx'; s=open(p).read()\nold=\"\"\"      monthlyCents: row.ownAllocationCents ?? row.allocati...
- **Bash**: {"command":"cd ~/Documents/workspace/projects/envelope-os && python3 -c \"\ns=open('package.json').read(); open('package.json','w').write(s.replace('\\\"version\\\": \\\"1.12.2\\\"','\\\"version\\\": ...

---

## Files in This Capture

| File | Description |
|------|-------------|
| `CONTEXT.md` | This analysis document |
| `transcript.jsonl` | Full raw conversation (2843 entries) |
| `sentiment.json` | Sentiment analysis metadata |
| `tool-calls.json` | Extracted tool invocations (422 calls) |

---

## Learning System Notes

This failure has been captured for retroactive analysis. The learning system should:

1. Review the full transcript for root cause
2. Identify systemic issues that contributed
3. Determine if this failure type has occurred before
4. Propose improvements to prevent recurrence

**Action Required:** This capture needs manual review to extract learnings.
