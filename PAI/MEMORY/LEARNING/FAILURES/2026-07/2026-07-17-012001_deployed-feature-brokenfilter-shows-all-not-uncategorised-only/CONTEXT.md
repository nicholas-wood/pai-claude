---
capture_type: FAILURE_ANALYSIS
timestamp: 2026-07-17 01:20:01 PST
rating: 3
description: deployed-feature-brokenfilter-shows-all-not-uncategorised-only
session_id: 91e67a6d-5522-45e0-8559-3c6b865c459d
---

# Failure Analysis: deployed feature brokenfilter shows all not uncategorised only

**Date:** 2026-07-17
**Rating:** 3/10
**Summary:** Deployed feature broken—filter shows all, not uncategorised only

---

## What Happened

Nick is reporting a functional defect in v1.4.4 that was just deployed. The UI correctly displays '7 transactions needing categorisation,' but clicking that link returns *all* transactions instead of filtering to only the 7 uncategorised ones. This is a clear miss between intended behavior and actual behavior. The tone is calm but frustrated—the feature doesn't work as promised. Needs debugging before this counts as a successful deployment.

---

## Conversation Summary

**USER:** The file /home/nicholas-wood/Documents/workspace/projects/envelope-os/web/src/pages/transactions.carryover.test.tsx has been updated successfully. (file state is current in your context — no need to Read it back)

**USER:** The file /home/nicholas-wood/Documents/workspace/projects/envelope-os/web/src/pages/transactions.carryover.test.tsx has been updated successfully. (file state is current in your context — no need to Read it back)

**USER:** [0m[32m 1 pass[0m
[0m[2m 0 fail[0m
 6 expect() calls
Ran 1 test across 1 file. [0m[2m[[1m829.00ms[0m[2m][0m
Shell cwd was reset to /home/nicholas-wood/.claude

**ASSISTANT:** Passing, and it proves the key invariant — the adjustment shows in the list but stays out of the money-in/out totals. Full gates, then deploy.

**USER:** [0m[2m 0 fail[0m
 1183 expect() calls
Ran 355 tests across 68 files. [0m[2m[[1m3.66s[0m[2m][0m
[0m[2m[35m$[0m [2m[1mtsc -p tsconfig.json --noEmit && tsc -p web/tsconfig.json --noEmit && tsc -p web/tsconfig.test.json --noEmit[0m
[0m[2m[35m$[0m [2m[1meslint web/src[0m
GATES OK
Shell cwd was reset to /home/nicholas-wood/.claude

**USER:** 3 files changed, 182 insertions(+), 37 deletions(-)
 create mode 100644 projects/envelope-os/web/src/pages/transactions.carryover.test.tsx
[32m✓ built in 6.95s[39m
{"ok":true,"mode":"local"}
Shell cwd was reset to /home/nicholas-wood/.claude

**ASSISTANT:** Deployed as v1.4.4 — gates green (355 tests), rebuilt, restarted, health confirmed.

Carryover adjustments now appear **inline in the main Transactions page list**, exactly as you asked — each one is its own dated row alongside the real transactions, showing the envelope name and the signed change (e.g. your 16 July Presents adjustment as **+$678.65**), marked with a small "Manual" pen badge so it reads honestly as an adjustment rather than a purchase.

Three design choices I locked in, since th...

**USER:** There are 7 transactions showing as needing to be categorised. But when I click on that, I just gen a gneeral list of all transactions rather than just the uncategorised ones

**ASSISTANT:** Let me trace the "to be categorised" link and how the Transactions page reads its filters — the link almost certainly isn't passing an uncategorised filter, and the page may not support one.

**USER:** === the uncategorised summary link on BudgetPage ===
          )}

          {/* Uncategorised summary: unmapped transactions sit outside every budget. */}
          {grid.uncategorisedCount > 0 && (
            <Link
              to="/transactions"
              className="flex items-center justify-between gap-3 rounded-lg border border-dashed bg-card px-4 py-3 text-sm hover:bg-accent"
            >
              <span className="font-medium">
                {grid.uncategorisedCount} transact...

---

## Tool Calls (216 total)

- **Bash**: {"command":"cd /home/nicholas-wood/Documents/workspace/projects/envelope-os && ls web/src/pages/transactions*.test.tsx 2>/dev/null && head -40 web/src/pages/transactions.search.test.tsx","description"...
- **Write**: {"file_path":"/home/nicholas-wood/Documents/workspace/projects/envelope-os/web/src/pages/transactions.carryover.test.tsx","content":"/**\n * Carryover adjustments interleave into the main transactions...
- **Bash**: {"command":"cd /home/nicholas-wood/Documents/workspace/projects/envelope-os && bun test web/src/pages/transactions.carryover.test.tsx 2>&1 | tail -18","description":"Run the new carryover-in-list test...
- **Bash**: {"command":"cd /home/nicholas-wood/Documents/workspace/projects/envelope-os && bun test web/src/pages/transactions.carryover.test.tsx 2>&1 | grep -iE \"unable to find|Carryover adjustment|Money|findBy...
- **Edit**: {"replace_all":false,"file_path":"/home/nicholas-wood/Documents/workspace/projects/envelope-os/web/src/pages/transactions.carryover.test.tsx","old_string":"    expect(screen.getByText(\"2026-07-16\"))...
- **Edit**: {"replace_all":false,"file_path":"/home/nicholas-wood/Documents/workspace/projects/envelope-os/web/src/pages/transactions.carryover.test.tsx","old_string":"    // Money-in is 0 and money-out is −$50.0...
- **Bash**: {"command":"cd /home/nicholas-wood/Documents/workspace/projects/envelope-os && bun test web/src/pages/transactions.carryover.test.tsx 2>&1 | tail -5","description":"Re-run the carryover-in-list test"}...
- **Bash**: {"command":"cd /home/nicholas-wood/Documents/workspace/projects/envelope-os && bun test 2>&1 | tail -3 && bun run typecheck 2>&1 | tail -1 && bun run lint 2>&1 | tail -1 && echo \"GATES OK\"","descrip...
- **Bash**: {"command":"cd /home/nicholas-wood/Documents/workspace/projects/envelope-os && python3 -c \"import json; d=json.load(open('package.json')); d['version']='1.4.4'; open('package.json','w').write(json.du...
- **Bash**: {"command":"cd /home/nicholas-wood/Documents/workspace/projects/envelope-os && echo \"=== the uncategorised summary link on BudgetPage ===\" && sed -n '276,300p' web/src/pages/BudgetPage.tsx && echo \...

---

## Files in This Capture

| File | Description |
|------|-------------|
| `CONTEXT.md` | This analysis document |
| `transcript.jsonl` | Full raw conversation (2786 entries) |
| `sentiment.json` | Sentiment analysis metadata |
| `tool-calls.json` | Extracted tool invocations (216 calls) |

---

## Learning System Notes

This failure has been captured for retroactive analysis. The learning system should:

1. Review the full transcript for root cause
2. Identify systemic issues that contributed
3. Determine if this failure type has occurred before
4. Propose improvements to prevent recurrence

**Action Required:** This capture needs manual review to extract learnings.
