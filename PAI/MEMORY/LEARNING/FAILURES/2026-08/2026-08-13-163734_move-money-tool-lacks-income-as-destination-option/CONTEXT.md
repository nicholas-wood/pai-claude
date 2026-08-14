---
capture_type: FAILURE_ANALYSIS
timestamp: 2026-08-13 16:37:34 PST
rating: 3
description: move-money-tool-lacks-income-as-destination-option
session_id: c13342da-4599-4c46-a505-a161c247ba31
---

# Failure Analysis: move money tool lacks income as destination option

**Date:** 2026-08-13
**Rating:** 3/10
**Summary:** Feature gap identified: move money tool lacks Income as destination

---

## What Happened

Nick is identifying a critical limitation in the move money tool that was just shipped. He needs to move excess from 'adhoc' to 'rental' because he won't receive income this month, but the move money tool doesn't include 'Income' as a destination category. This is a clear miss—the previous response celebrated the v1.22.0 release without addressing this actual use-case requirement. Nick had to circle back and explicitly point out the gap after the feature shipped. This signals the feature doesn't fully meet his needs.

---

## Conversation Summary

**USER:** [0m[1mbun test [0m[2mv1.3.14 (0d9b296a)[0m
[0m
test/budget-move.test.ts:
 [0m[1m98 |[0m       amountCents: [0m[33m3000[0m,
 [0m[1m99 |[0m       scope: [0m[32m"this_month"[0m,
[0m[1m100 |[0m     })[0m[2m;[0m
[0m[1m101 |[0m     expect(res.ok)[0m[3m[1m.toBe[0m([0m[33mtrue[0m)[0m[2m;[0m
[0m[1m102 |[0m     // Left was 15000 − 10000 = 5000; the movement folds into received → 2000.
[0m[1m103 |[0m     expect(res.fromLeftCents)[0m[3m[1m.toBe[0m([0m[33m2000...

**USER:** 859:      const receivedCents = hasIncomeMappings ? receivedFor(i.id) : i.actualCents;

**USER:** The file /home/nicholas-wood/Documents/workspace/projects/envelope-os/src/envelope/service.ts has been updated successfully. (file state is current in your context — no need to Read it back)

**USER:** [0m[31m 1 fail[0m
 79 expect() calls
Ran 18 tests across 2 files. [0m[2m[[1m482.00ms[0m[2m][0m
test/income-expected-day.test.ts(133,48): error TS2345: Argument of type '{ id: string; categoryId: string; envelopeId: string; effectiveFrom: string; effectiveTo: null; }' is not assignable to parameter of type 'CategoryMapping'.
  Property 'userId' is missing in type '{ id: string; categoryId: string; envelopeId: string; effectiveFrom: string; effectiveTo: null; }' but required in type 'Cate...

**USER:** ok
[0m[31merror[0m[2m:[0m [1m[2mexpect([0m[31mreceived[0m[2m).[0mtoBe[2m([0m[32mexpected[0m[2m)[0m

Expected: [32m2000[0m
Received: [31m5000[0m
[0m
[0m      [2mat [0m[0m[2m<anonymous>[0m[2m ([0m[0m[36m[2m/home/nicholas-wood/Documents/workspace/projects/envelope-os/[0m[36mtest/budget-move.test.ts[0m[2m:[0m[33m103[0m[2m:[33m31[0m[2m)[0m
[0m[31m✗[0m [0mmove FROM an income envelope (owner request 2026-08-14)[2m >[0m[1m moving the excess conserves:...

**USER:** patched
[0m[2m 0 fail[0m
 79 expect() calls
Ran 18 tests across 2 files. [0m[2m[[1m469.00ms[0m[2m][0m
[0m[2m[35m$[0m [2m[1mtsc -p tsconfig.json --noEmit && tsc -p web/tsconfig.json --noEmit && tsc -p web/tsconfig.test.json --noEmit[0m
[0m[2m 0 fail[0m
 1691 expect() calls
Ran 477 tests across 82 files. [0m[2m[[1m6.40s[0m[2m][0m

**ASSISTANT:** All 477 green. Shipping v1.22.0 with ISA records:

**USER:** [32m✓ built in 6.91s[39m
 9 files changed, 241 insertions(+), 13 deletions(-)
"v1.22.0 (fd29357 · 2026-08-13)"
unallocated: 0.00 zeroBasedAlert: [0m[33mfalse[0m
Buffer: carryover 303.28 alloc 0.00 left 1716.03
WIDGET DELTA: 0.00 (cash 66523.94 card 4423.25 left 62100.69 awaiting 0.00)

**ASSISTANT:** ━━━ 📃 SUMMARY ━━━

🔄 ITERATION on: income moves + early-arrival smarts, both approved and shipped

📃 CONTENT:

**v1.22.0 is live, and your salary just live-verified the new smarts:** the engine now shows **awaiting $0** with the salary in the bank — the early arrival (14th, expected the 17th) is being recognised against August immediately, exactly as you asked. Left is no longer inflated, and if a future month's pay is late, the deficit still won't show until the 17th — the expected day's onl...

**USER:** On the move money, I want to be able yo move the excess from adhoc to my rental category, because I know I won’t receive that this month. Income is not in the to field of the move money tool.

---

## Tool Calls (416 total)

- **Bash**: {"command":"cd ~/Documents/workspace/projects/envelope-os && cat >> test/budget-move.test.ts <<'EOF'\n\ndescribe(\"move FROM an income envelope (owner request 2026-08-14)\", () => {\n  async function ...
- **Bash**: {"command":"cd ~/Documents/workspace/projects/envelope-os && bun test test/budget-move.test.ts 2>&1 | rg -B1 -A8 \"✗\" | head -20","description":"Inspect the failing income-move test"}...
- **Bash**: {"command":"cd ~/Documents/workspace/projects/envelope-os && bun test test/budget-move.test.ts 2>&1 | sed -n '/moving the excess conserves/,+14p' | rg \"Expected|Received|throw|Error\" | head -6","des...
- **Bash**: {"command":"cd ~/Documents/workspace/projects/envelope-os && bun test test/budget-move.test.ts 2>&1 | sed -n '1,60p' | rg -v \"^\\[0m.1m[0-9]+ \\|\" | head -25","description":"Raw failure output"}...
- **Bash**: {"command":"cd ~/Documents/workspace/projects/envelope-os && rg -n \"const receivedCents = hasIncomeMappings\" src/envelope/service.ts","description":"Locate received computation"}...
- **Edit**: {"replace_all":false,"file_path":"/home/nicholas-wood/Documents/workspace/projects/envelope-os/src/envelope/service.ts","old_string":"      const receivedCents = hasIncomeMappings ? receivedFor(i.id) ...
- **Bash**: {"command":"cd ~/Documents/workspace/projects/envelope-os && bun test test/budget-move.test.ts test/income-expected-day.test.ts 2>&1 | tail -3 && bun run typecheck 2>&1 | tail -2 && bun test 2>&1 | ta...
- **Bash**: {"command":"cd ~/Documents/workspace/projects/envelope-os && python3 - <<'EOF'\ns = open(\"test/income-expected-day.test.ts\").read()\ns = s.replace('''    await t.store.upsertMapping(LOCAL_USER_ID, {...
- **Bash**: {"command":"cd ~/Documents/workspace/projects/envelope-os && python3 - <<'EOF'\ns = open(\"test/budget-move.test.ts\").read()\ns = s.replace('describe(\"move FROM an income envelope (owner request 202...
- **Bash**: {"command":"cd ~/Documents/workspace/projects/envelope-os && python3 - <<'EOF'\ns = open(\"ISA.md\").read()\nmarker = \"Cross-cutting:\\n\\n- [x] ISC-237:\"\nblock = \"\"\"### Income moves + early-arr...

---

## Files in This Capture

| File | Description |
|------|-------------|
| `CONTEXT.md` | This analysis document |
| `transcript.jsonl` | Full raw conversation (2729 entries) |
| `sentiment.json` | Sentiment analysis metadata |
| `tool-calls.json` | Extracted tool invocations (416 calls) |

---

## Learning System Notes

This failure has been captured for retroactive analysis. The learning system should:

1. Review the full transcript for root cause
2. Identify systemic issues that contributed
3. Determine if this failure type has occurred before
4. Propose improvements to prevent recurrence

**Action Required:** This capture needs manual review to extract learnings.
