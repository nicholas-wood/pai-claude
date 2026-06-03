# Cross-Feedback Harvester — Design Sketch

## 1. Problem statement

Learning signals today are logged per-domain — Algorithm runs emit their own signals, System work emits others — and durable feedback memory files only get written when a human happens to notice a pattern and decides it is worth codifying. Nothing sweeps the *whole* corpus to find themes that recur across all 12+ projects and every session. The "verify before claiming done" rule is the proof: the same failure shape appeared three times in one session before Nick had to point at the conversation. Synthesis across the corpus is currently manual, reactive, and lossy — patterns that span domains are exactly the ones a per-domain logger can never see.

## 2. Inputs to mine (paths confirmed against the live tree 2026-06-03)

- **LEARNING sentiment signals** — `PAI/MEMORY/LEARNING/ALGORITHM/{YYYY-MM}/` and `PAI/MEMORY/LEARNING/SYSTEM/{YYYY-MM}/`. One markdown file per signal, named `{ts}_LEARNING_sentiment-rating-{N}.md`. Split by domain — this split is exactly why cross-cutting themes go unseen, so the harvester must merge both trees.
- **Rating stream** — `PAI/MEMORY/LEARNING/SIGNALS/ratings.jsonl`. One JSON line per rating: `{timestamp, rating, session_id, source (implicit|explicit), sentiment_summary, confidence}`. This is also where satisfaction lands — there is no separate SatisfactionCapture dir; the hook writes implicit-source rows here. (Note: many rows currently read `sentiment_summary: "Inference failed: Timeout"` with `confidence: 0.3` — the harvester must filter low-confidence/failed-inference rows or it will cluster noise.)
- **Failure-pattern log** — `PAI/MEMORY/LEARNING/FAILURES/{YYYY-MM}/`. One entry per failure, named `{ts}_{slug}` where the slug is the one-line pattern (e.g. `previous-answer-was-based-on-template-content-not`). Highest-signal input for correction themes.
- **Feedback memory files** — every `feedback-*.md` in `projects/-Users-nicholaswood--claude/memory/` (the global memory dir; also the dedup target). No project-scoped memory dirs exist yet, but glob defensively.
- **Work / session context** — `PAI/MEMORY/STATE/work.json` (task, phase, progress, effort) and `STATE/session-names.json` (session_id → name), to attach project/session provenance to each signal. Per-run ISAs live at `PAI/MEMORY/WORK/{slug}/ISA.md`.

## 3. The loop

1. **Trigger:** daily cron (Nick's call — daily, not weekly, so themes surface within a day of recurring rather than sitting for a week). Cadence is cheap because the dedup step (5) means re-runs over an unchanged corpus produce no new candidates. Use the same scheduling mechanism the other harvesters use.
2. **Collect:** read all LEARNING signals + feedback files + failure log + satisfaction data + ISA/state context into one normalised set of records, each tagged with source, project, session, and timestamp.
3. **Cluster by root cause:** group records by underlying cause, not surface wording — via embeddings (cosine similarity over signal text) or an LLM clustering pass for the fuzzier cases. The unit is "same root cause," so "claimed migration complete" and "claimed delegation done" land in one cluster.
4. **Filter to recurring cross-cutting themes:** keep clusters that recur across N+ distinct projects or sessions (e.g. N=3). Single-project, single-session noise is dropped.
5. **Dedup against existing rules:** for each surviving cluster, check whether a durable feedback file already covers it. If yes, skip (optionally bump its evidence count); if no, it is a promotion candidate.
6. **Promote:** draft a new `feedback-*.md` for each approved candidate and append its line to `MEMORY.md`.

The "verify before claiming done" rule is the canonical worked example: three same-shape failures in one session would have clustered automatically and surfaced as a promotion candidate, instead of relying on a human to notice and hand-write the file.

## 4. Output

A ranked list of **proposed durable rules**, each with:
- the proposed rule text (name + description + body draft),
- an **evidence count** (how many records fed the cluster),
- **provenance** — which sessions and projects the evidence came from,
- a dedup note confirming no existing rule covers it.

This is **presented to Nick for approval before anything is written**. Promoting a rule is consequential — it changes standing behaviour across every session — so the harvester never auto-commits new feedback files. Writing happens only on approval. (Bumping evidence counts on existing rules can be lower-friction / auto.)

## 5. Where it fits in PAI

A **Tool** (TypeScript, run with `bun`) invoked by a **daily cron**, sitting alongside the existing harvest tooling rather than a hook. Both precedents confirmed present in `PAI/Tools/`:
- `Tools/KnowledgeHarvester.ts` → `MEMORY/KNOWLEDGE/` — the closest structural analogue (periodic sweep that promotes into a durable store).
- `Tools/SessionHarvester.ts` (`--mine`) → `KNOWLEDGE/_harvest-queue/` — precedent for the queue-then-approve pattern; this harvester should write candidates to a review queue and require approval before committing to `feedback-*.md` + `MEMORY.md`. (`HarvestExecutor.ts` also exists and is worth reading for the execution shape.)

Working name: `Tools/FeedbackHarvester.ts`. It reads the inputs in §2, runs the loop in §3, and drops approval candidates into a queue for Nick.
