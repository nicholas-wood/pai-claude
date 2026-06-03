#!/usr/bin/env bun
/**
 * FeedbackHarvester -- Mine LEARNING signals + failures for recurring cross-cutting patterns,
 * cluster by root cause, dedup against existing feedback rules, and queue surviving candidates
 * for Nick's approval before anything is written.
 *
 * Queue-then-approve: the harvester NEVER auto-writes feedback-*.md or MEMORY.md.
 * All candidates land in MEMORY/LEARNING/FEEDBACK_QUEUE/ as JSON files.
 * Nick approves individually; a separate `approve` command commits the rule.
 *
 * Commands:
 *   harvest              Scan all LEARNING signals + failures, produce candidate queue
 *   harvest --dry-run    Preview candidates without writing the queue
 *   queue                List current queue (pending + approved + rejected)
 *   approve <slug>       Promote a queued candidate to a live feedback-*.md rule
 *   reject <slug>        Mark a queued candidate as rejected (keeps it for audit)
 *   status               Summary of corpus + existing rules
 *
 * Examples:
 *   bun FeedbackHarvester.ts harvest --dry-run
 *   bun FeedbackHarvester.ts harvest
 *   bun FeedbackHarvester.ts queue
 *   bun FeedbackHarvester.ts approve verify-before-claiming
 *   bun FeedbackHarvester.ts status
 */

import { parseArgs } from "util";
import * as fs from "fs";
import * as path from "path";

// ============================================================================
// Configuration -- no hardcoded paths; everything derives from env or HOME
// ============================================================================

const HOME = process.env.HOME!;
const CLAUDE_DIR = path.join(HOME, ".claude");
const PAI_DIR = process.env.PAI_DIR || path.join(CLAUDE_DIR, "PAI");
const MEMORY_DIR = path.join(PAI_DIR, "MEMORY");
const LEARNING_DIR = path.join(MEMORY_DIR, "LEARNING");

// Signal sources
const ALGORITHM_LEARNING_DIR = path.join(LEARNING_DIR, "ALGORITHM");
const SYSTEM_LEARNING_DIR = path.join(LEARNING_DIR, "SYSTEM");
const FAILURES_DIR = path.join(LEARNING_DIR, "FAILURES");
const RATINGS_FILE = path.join(LEARNING_DIR, "SIGNALS", "ratings.jsonl");

// State / context
const STATE_DIR = path.join(MEMORY_DIR, "STATE");
const SESSION_NAMES_FILE = path.join(STATE_DIR, "session-names.json");
const WORK_FILE = path.join(STATE_DIR, "work.json");

// Dedup target: the global memory dir where feedback-*.md files live
const CURRENT_USER = process.env.USER || "nicholaswood";
const MEMORY_AUTO_DIR = path.join(
  CLAUDE_DIR,
  "projects",
  `-Users-${CURRENT_USER}--claude`,
  "memory",
);

// Queue dir -- separate from KNOWLEDGE queue; this is the feedback promotion queue
const FEEDBACK_QUEUE_DIR = path.join(MEMORY_DIR, "LEARNING", "FEEDBACK_QUEUE");

// Clustering thresholds
const MIN_RECURRENCE = 3; // minimum distinct sources (sessions/projects) for a theme to survive
const CONFIDENCE_FILTER_THRESHOLD = 0.4; // ratings rows below this are noise (inference timeouts at 0.3)
const MIN_RATING_TO_SIGNAL_ISSUE = 5; // ratings <= this are "low satisfaction" events

// ============================================================================
// Types
// ============================================================================

interface RatingRow {
  timestamp: string;
  rating: number;
  session_id: string;
  source: "implicit" | "explicit";
  sentiment_summary: string;
  confidence: number;
  comment?: string;
  response_preview?: string;
}

interface LearningSignal {
  sourcePath: string;
  sourceType: "algorithm" | "system" | "failure" | "rating";
  sessionId?: string;
  projectSlug?: string;
  timestamp: string;
  rating?: number;
  text: string; // normalised text for clustering
  rawContent: string;
}

interface Cluster {
  slug: string;             // kebab-case identifier
  theme: string;            // human-readable summary
  rootCause: string;        // distilled one-liner
  signals: LearningSignal[];
  sessionIds: Set<string>;  // distinct sessions
  projectSlugs: Set<string>; // distinct projects
  evidenceCount: number;
}

interface FeedbackCandidate {
  slug: string;
  theme: string;
  rootCause: string;
  proposedRuleName: string;
  proposedRuleBody: string;
  evidenceCount: number;
  sessions: string[];
  projects: string[];
  topExamples: string[];
  dedupNote: string;
  queuedAt: string;
  status: "pending" | "approved" | "rejected";
}

interface ExistingRule {
  slug: string;
  filePath: string;
  name: string;
  description: string;
  body: string;
}

// ============================================================================
// Helpers
// ============================================================================

function toKebab(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 60);
}

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const result: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const colonIdx = line.indexOf(":");
    if (colonIdx > 0) {
      const key = line.substring(0, colonIdx).trim();
      let value = line.substring(colonIdx + 1).trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      result[key] = value;
    }
  }
  return result;
}

function loadSessionNames(): Record<string, string> {
  if (!fs.existsSync(SESSION_NAMES_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(SESSION_NAMES_FILE, "utf-8"));
  } catch {
    return {};
  }
}

function loadWorkSessions(): Record<string, { task?: string; sessionName?: string }> {
  if (!fs.existsSync(WORK_FILE)) return {};
  try {
    const raw = JSON.parse(fs.readFileSync(WORK_FILE, "utf-8"));
    // work.json has shape { sessions: { slug: { task, sessionName, ... } } }
    return raw.sessions || {};
  } catch {
    return {};
  }
}

function sessionToProject(
  sessionId: string,
  sessionNames: Record<string, string>,
  workSessions: Record<string, { task?: string; sessionName?: string }>,
): string {
  // Try session-names.json first (id -> name)
  const name = sessionNames[sessionId];
  if (name) {
    // extract project hint from the session name (first 2 words)
    return name.split(/\s+/).slice(0, 2).join("-").toLowerCase() || "unknown";
  }
  // Try work.json by matching partial sessionId
  for (const [slug, entry] of Object.entries(workSessions)) {
    if (slug.includes(sessionId.substring(0, 8))) {
      return entry.sessionName?.split(/\s+/).slice(0, 2).join("-").toLowerCase() || "unknown";
    }
  }
  return "unknown";
}

function walkDirForMonthFiles(baseDir: string): string[] {
  const files: string[] = [];
  if (!fs.existsSync(baseDir)) return files;
  for (const month of fs.readdirSync(baseDir)) {
    const monthPath = path.join(baseDir, month);
    try {
      if (!fs.statSync(monthPath).isDirectory()) continue;
    } catch {
      continue;
    }
    for (const entry of fs.readdirSync(monthPath)) {
      files.push(path.join(monthPath, entry));
    }
  }
  return files;
}

// Failures are directories, not files
function walkFailureDirs(baseDir: string): string[] {
  const dirs: string[] = [];
  if (!fs.existsSync(baseDir)) return dirs;
  for (const month of fs.readdirSync(baseDir)) {
    const monthPath = path.join(baseDir, month);
    try {
      if (!fs.statSync(monthPath).isDirectory()) continue;
    } catch {
      continue;
    }
    for (const entry of fs.readdirSync(monthPath)) {
      const entryPath = path.join(monthPath, entry);
      try {
        if (fs.statSync(entryPath).isDirectory()) {
          dirs.push(entryPath);
        }
      } catch {
        /* skip */
      }
    }
  }
  return dirs;
}

// ============================================================================
// Signal Collection
// ============================================================================

function collectAlgorithmSignals(): LearningSignal[] {
  const signals: LearningSignal[] = [];
  for (const file of walkDirForMonthFiles(ALGORITHM_LEARNING_DIR)) {
    if (!file.endsWith(".md")) continue;
    try {
      const content = fs.readFileSync(file, "utf-8");
      const fm = parseFrontmatter(content);
      const rating = fm.rating ? parseInt(fm.rating) : undefined;
      // Strip frontmatter, collect body text
      const body = content.replace(/^---[\s\S]*?---\n*/, "").trim();
      signals.push({
        sourcePath: file,
        sourceType: "algorithm",
        sessionId: fm.session_id,
        timestamp: fm.timestamp || "",
        rating,
        text: body,
        rawContent: content,
      });
    } catch { /* skip */ }
  }
  return signals;
}

function collectSystemSignals(): LearningSignal[] {
  const signals: LearningSignal[] = [];
  for (const file of walkDirForMonthFiles(SYSTEM_LEARNING_DIR)) {
    if (!file.endsWith(".md")) continue;
    try {
      const content = fs.readFileSync(file, "utf-8");
      const fm = parseFrontmatter(content);
      const rating = fm.rating ? parseInt(fm.rating) : undefined;
      const body = content.replace(/^---[\s\S]*?---\n*/, "").trim();
      signals.push({
        sourcePath: file,
        sourceType: "system",
        sessionId: fm.session_id,
        timestamp: fm.timestamp || "",
        rating,
        text: body,
        rawContent: content,
      });
    } catch { /* skip */ }
  }
  return signals;
}

function collectFailureSignals(): LearningSignal[] {
  const signals: LearningSignal[] = [];
  for (const dir of walkFailureDirs(FAILURES_DIR)) {
    const contextFile = path.join(dir, "CONTEXT.md");
    const sentimentFile = path.join(dir, "sentiment.json");
    if (!fs.existsSync(contextFile)) continue;
    try {
      const content = fs.readFileSync(contextFile, "utf-8");
      const fm = parseFrontmatter(content);
      const slug = path.basename(dir);
      // sentiment.json has rating + session_id
      let sessionId = fm.session_id;
      let rating: number | undefined;
      if (fs.existsSync(sentimentFile)) {
        try {
          const sent = JSON.parse(fs.readFileSync(sentimentFile, "utf-8"));
          sessionId = sessionId || sent.session_id;
          rating = sent.rating;
        } catch { /* skip */ }
      }
      const body = content.replace(/^---[\s\S]*?---\n*/, "").trim();
      signals.push({
        sourcePath: dir,
        sourceType: "failure",
        sessionId,
        timestamp: fm.timestamp || "",
        rating,
        text: `FAILURE: ${slug.replace(/\d{4}-\d{2}-\d{2}-\d{6}_/, "").replace(/-/g, " ")}\n\n${body}`,
        rawContent: content,
      });
    } catch { /* skip */ }
  }
  return signals;
}

function collectRatingSignals(): LearningSignal[] {
  const signals: LearningSignal[] = [];
  if (!fs.existsSync(RATINGS_FILE)) return signals;
  try {
    const lines = fs.readFileSync(RATINGS_FILE, "utf-8").trim().split("\n");
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const row = JSON.parse(line) as RatingRow;
        // CRITICAL: filter noise rows from inference timeouts
        if (row.confidence <= CONFIDENCE_FILTER_THRESHOLD) continue;
        if (!row.sentiment_summary || row.sentiment_summary.startsWith("Inference failed")) continue;
        if (row.rating > MIN_RATING_TO_SIGNAL_ISSUE) continue; // only collect low-satisfaction rows
        signals.push({
          sourcePath: RATINGS_FILE,
          sourceType: "rating",
          sessionId: row.session_id,
          timestamp: row.timestamp,
          rating: row.rating,
          text: `Rating ${row.rating}/10: ${row.sentiment_summary}`,
          rawContent: line,
        });
      } catch { /* skip malformed */ }
    }
  } catch { /* file read error */ }
  return signals;
}

// ============================================================================
// Existing rule loading (dedup target)
// ============================================================================

function loadExistingRules(): ExistingRule[] {
  const rules: ExistingRule[] = [];
  if (!fs.existsSync(MEMORY_AUTO_DIR)) return rules;
  for (const file of fs.readdirSync(MEMORY_AUTO_DIR)) {
    if (!file.startsWith("feedback-") || !file.endsWith(".md")) continue;
    const filePath = path.join(MEMORY_AUTO_DIR, file);
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const fm = parseFrontmatter(content);
      const body = content.replace(/^---[\s\S]*?---\n*/, "").trim();
      rules.push({
        slug: file.replace(/\.md$/, ""),
        filePath,
        name: fm.name || file.replace(/\.md$/, ""),
        description: fm.description || "",
        body,
      });
    } catch { /* skip */ }
  }
  return rules;
}

// ============================================================================
// Clustering -- keyword-based root-cause grouping
// (No LLM calls here; this is a pure bun tool. Clusters are defined by
// recurring patterns in the text. If the corpus grows, an LLM pass can
// replace this, but the queue-then-approve gate is the safety net either way.)
// ============================================================================

// Root-cause patterns: each entry has a slug, a theme label, a root-cause
// statement, and regexes. A signal falls into the first matching bucket.
const ROOT_CAUSE_PATTERNS: Array<{
  slug: string;
  theme: string;
  rootCause: string;
  patterns: RegExp[];
}> = [
  {
    slug: "verify-before-claiming",
    theme: "Claiming done without verification",
    rootCause: "Assistant reports completion without checking the artefact exists or the action landed.",
    patterns: [
      /claim(?:ed|ing)?\s+(?:done|complete|finished|handed.off|delegated)/i,
      /assert(?:ed|ing)?\s+(?:complete|done|finished)/i,
      /report(?:ed|ing)?\s+(?:done|complete|handed)/i,
      /verify before claim/i,
      /never checked/i,
      /without.+verif/i,
      /didn.t.+verify/i,
      /failed to verify/i,
    ],
  },
  {
    slug: "template-content-not-real-data",
    theme: "Acting on template/placeholder content as if it were real data",
    rootCause: "Analysis or recommendations based on boilerplate or placeholder text rather than the user's actual state.",
    patterns: [
      /template content/i,
      /placeholder/i,
      /sample.+data/i,
      /not real data/i,
      /bootstrap default/i,
      /based on template/i,
      /template.+not.+actual/i,
    ],
  },
  {
    slug: "missed-question",
    theme: "Missing or misinterpreting the actual question",
    rootCause: "Response answered an adjacent or assumed question rather than what was literally asked.",
    patterns: [
      /missed the question/i,
      /not what.+asked/i,
      /asking again/i,
      /user.+asking.+again/i,
      /previous.+response.+missed/i,
      /didn.t.+answer/i,
      /failed to answer/i,
      /misunderstood/i,
    ],
  },
  {
    slug: "fragmented-incomplete-response",
    theme: "Fragmented or incomplete responses",
    rootCause: "Response was cut off, structurally fragmented, or missing a direct answer.",
    patterns: [
      /fragmented/i,
      /incomplete response/i,
      /cut off/i,
      /previous response was incomplete/i,
      /seeking clarification on unclear recommendation/i,
      /unclear recommendation/i,
      /previous response was fragmented/i,
    ],
  },
  {
    slug: "unsolicited-framing",
    theme: "Pushing a framing the user explicitly rejected",
    rootCause: "Continued recommending an approach after the user pushed back on it.",
    patterns: [
      /pushback/i,
      /over.+repeating/i,
      /keeps? suggesting/i,
      /already rejected/i,
      /wants.+not.+workstation/i,
      /not what.+wants/i,
      /user.+doesn.t want/i,
      /thin.?client/i,
    ],
  },
  {
    slug: "stale-context",
    theme: "Using stale or cached context rather than re-reading live state",
    rootCause: "Answer was based on outdated file content, logs, or memory rather than current on-disk state.",
    patterns: [
      /stale/i,
      /cached/i,
      /outdated/i,
      /old.+log/i,
      /read stale/i,
      /log.+earlier/i,
      /not re.?check/i,
      /without.+re.?read/i,
    ],
  },
  {
    slug: "over-recommending",
    theme: "Over-recommending or over-explaining beyond what was asked",
    rootCause: "Padded response with unrequested suggestions, caveats, or explanations.",
    patterns: [
      /over.?engineer/i,
      /too complex/i,
      /unnecessary/i,
      /didn.t ask/i,
      /not asked for/i,
      /unsolicited/i,
      /over.?explain/i,
    ],
  },
];

function clusterSignals(
  signals: LearningSignal[],
  sessionNames: Record<string, string>,
  workSessions: Record<string, { task?: string; sessionName?: string }>,
): Cluster[] {
  const clusterMap = new Map<string, Cluster>();

  // Initialise cluster buckets
  for (const pattern of ROOT_CAUSE_PATTERNS) {
    clusterMap.set(pattern.slug, {
      slug: pattern.slug,
      theme: pattern.theme,
      rootCause: pattern.rootCause,
      signals: [],
      sessionIds: new Set(),
      projectSlugs: new Set(),
      evidenceCount: 0,
    });
  }

  for (const signal of signals) {
    for (const pattern of ROOT_CAUSE_PATTERNS) {
      const matched = pattern.patterns.some(re => re.test(signal.text));
      if (!matched) continue;

      const cluster = clusterMap.get(pattern.slug)!;
      cluster.signals.push(signal);
      cluster.evidenceCount++;

      if (signal.sessionId) {
        cluster.sessionIds.add(signal.sessionId);
        const project = sessionToProject(signal.sessionId, sessionNames, workSessions);
        cluster.projectSlugs.add(project);
      } else {
        // Failure dirs without sessionId still count as a distinct source
        cluster.projectSlugs.add(`failure:${path.basename(signal.sourcePath).substring(0, 30)}`);
      }
    }
  }

  // Return only clusters with enough recurrence
  return Array.from(clusterMap.values()).filter(
    c => c.signals.length > 0 && (c.sessionIds.size + c.projectSlugs.size) >= MIN_RECURRENCE
  );
}

// ============================================================================
// Dedup check
// ============================================================================

function dedupCheck(cluster: Cluster, existingRules: ExistingRule[]): string {
  for (const rule of existingRules) {
    if (rule.slug === `feedback-${cluster.slug}`) {
      return `COVERED -- feedback-${cluster.slug}.md already exists.`;
    }
    // Fuzzy check: if the cluster slug keywords appear heavily in the rule body
    const slugWords = cluster.slug.split("-").filter(w => w.length > 3);
    const bodyLower = rule.body.toLowerCase();
    const hits = slugWords.filter(w => bodyLower.includes(w)).length;
    if (hits >= Math.ceil(slugWords.length * 0.6)) {
      return `LIKELY COVERED by ${rule.slug} (keyword overlap ${hits}/${slugWords.length}).`;
    }
  }
  return "NEW -- no existing rule covers this theme.";
}

// ============================================================================
// Candidate drafting
// ============================================================================

function draftCandidate(cluster: Cluster, dedupNote: string): FeedbackCandidate {
  const topExamples = cluster.signals
    .slice(0, 3)
    .map(s => s.text.split("\n").find(l => l.trim().length > 20) || s.text.substring(0, 120));

  // Build a proposed rule body that matches the feedback-*.md format
  const proposedRuleBody = `${cluster.rootCause}

**Why:** Evidence from ${cluster.evidenceCount} signal(s) across ${cluster.sessionIds.size} session(s) and ${cluster.projectSlugs.size} project(s). Recurring root cause: ${cluster.theme}.

**How to apply:** ${buildApplyGuidance(cluster.slug)}

**Evidence examples:**
${topExamples.map(e => `- "${e.substring(0, 100).replace(/\n/g, " ")}"`).join("\n")}`;

  return {
    slug: cluster.slug,
    theme: cluster.theme,
    rootCause: cluster.rootCause,
    proposedRuleName: `feedback-${cluster.slug}`,
    proposedRuleBody,
    evidenceCount: cluster.evidenceCount,
    sessions: Array.from(cluster.sessionIds),
    projects: Array.from(cluster.projectSlugs),
    topExamples,
    dedupNote,
    queuedAt: new Date().toISOString(),
    status: "pending",
  };
}

function buildApplyGuidance(slug: string): string {
  const guidance: Record<string, string> = {
    "verify-before-claiming": "Before using done, complete, handed off, delegated, or landed, verify the artefact exists or the action returned. If you cannot verify, say so explicitly rather than asserting completion.",
    "template-content-not-real-data": "Before analysing or making recommendations about a user's context, confirm you are reading their actual populated data, not a sample or template file. Look for placeholder markers like {{PLACEHOLDER}}, (sample), or skeleton comments.",
    "missed-question": "Re-read the user's message before responding. Confirm which question is being answered. If a question was already asked and not answered, answer it directly first.",
    "fragmented-incomplete-response": "Ensure responses have a direct answer before supporting detail. Never cut off mid-sentence. If context is nearly full, say so and summarise rather than truncating silently.",
    "unsolicited-framing": "If the user has rejected a framing or recommendation, drop it. Do not re-introduce it in a later turn unless the user brings it back.",
    "stale-context": "When acting on file content or log output, re-read the live file rather than relying on earlier read results. Logs especially change; re-fetch before referencing.",
    "over-recommending": "Answer what was asked. Only add unrequested advice when it is genuinely critical. Default to the minimal sufficient response.",
  };
  return guidance[slug] || "Apply the root cause analysis to avoid repeating the identified failure shape.";
}

// ============================================================================
// Queue management
// ============================================================================

function loadQueue(): FeedbackCandidate[] {
  if (!fs.existsSync(FEEDBACK_QUEUE_DIR)) return [];
  const candidates: FeedbackCandidate[] = [];
  for (const file of fs.readdirSync(FEEDBACK_QUEUE_DIR)) {
    if (!file.endsWith(".json")) continue;
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(FEEDBACK_QUEUE_DIR, file), "utf-8"));
      candidates.push(raw as FeedbackCandidate);
    } catch { /* skip malformed */ }
  }
  return candidates;
}

function saveCandidate(candidate: FeedbackCandidate): string {
  if (!fs.existsSync(FEEDBACK_QUEUE_DIR)) {
    fs.mkdirSync(FEEDBACK_QUEUE_DIR, { recursive: true });
  }
  const filename = `${candidate.slug}.json`;
  const filepath = path.join(FEEDBACK_QUEUE_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(candidate, null, 2));
  return filepath;
}

function updateCandidateStatus(slug: string, status: "approved" | "rejected"): FeedbackCandidate | null {
  const filepath = path.join(FEEDBACK_QUEUE_DIR, `${slug}.json`);
  if (!fs.existsSync(filepath)) return null;
  const candidate = JSON.parse(fs.readFileSync(filepath, "utf-8")) as FeedbackCandidate;
  candidate.status = status;
  fs.writeFileSync(filepath, JSON.stringify(candidate, null, 2));
  return candidate;
}

// ============================================================================
// Rule promotion (used by approve command)
// ============================================================================

function promoteToRule(candidate: FeedbackCandidate): string {
  if (!fs.existsSync(MEMORY_AUTO_DIR)) {
    throw new Error(`Memory dir not found: ${MEMORY_AUTO_DIR}`);
  }

  const filename = `${candidate.proposedRuleName}.md`;
  const filepath = path.join(MEMORY_AUTO_DIR, filename);

  if (fs.existsSync(filepath)) {
    throw new Error(`Rule already exists: ${filepath}`);
  }

  const today = new Date().toISOString().split("T")[0];
  const content = `---
name: ${candidate.proposedRuleName}
description: "${candidate.theme}"
metadata:
  node_type: memory
  type: feedback
  harvestedAt: ${candidate.queuedAt}
  approvedAt: ${new Date().toISOString()}
  evidenceCount: ${candidate.evidenceCount}
---

${candidate.proposedRuleBody}

---
*Promoted from FeedbackHarvester queue on ${today}. Evidence: ${candidate.evidenceCount} signal(s) across ${candidate.sessions.length} session(s).*
`;

  fs.writeFileSync(filepath, content);

  // Append to MEMORY.md index
  const memoryMdPath = path.join(MEMORY_AUTO_DIR, "MEMORY.md");
  if (fs.existsSync(memoryMdPath)) {
    const existing = fs.readFileSync(memoryMdPath, "utf-8");
    const indexLine = `- [${candidate.theme}](${filename}) -- ${candidate.rootCause.substring(0, 80)}`;
    if (!existing.includes(filename)) {
      const separator = existing.endsWith("\n") ? "" : "\n";
      fs.appendFileSync(memoryMdPath, `${separator}${indexLine}\n`);
    }
  }

  return filepath;
}

// ============================================================================
// Commands
// ============================================================================

function cmdHarvest(dryRun: boolean): void {
  console.log("FeedbackHarvester -- corpus scan");
  console.log("-".repeat(50));

  // Verify source dirs exist
  const sourceDirs = [
    { label: "ALGORITHM signals", dir: ALGORITHM_LEARNING_DIR },
    { label: "SYSTEM signals", dir: SYSTEM_LEARNING_DIR },
    { label: "FAILURES", dir: FAILURES_DIR },
  ];
  for (const { label, dir } of sourceDirs) {
    const exists = fs.existsSync(dir);
    console.log(`  ${exists ? "ok" : "MISSING"} ${label}: ${dir}`);
    if (!exists) {
      console.log(`  WARNING: ${label} dir not found -- skipping that source.`);
    }
  }
  const ratingsExists = fs.existsSync(RATINGS_FILE);
  console.log(`  ${ratingsExists ? "ok" : "MISSING"} Ratings JSONL: ${RATINGS_FILE}`);
  console.log();

  // Collect
  const algorithmSignals = collectAlgorithmSignals();
  const systemSignals = collectSystemSignals();
  const failureSignals = collectFailureSignals();
  const ratingSignals = collectRatingSignals();

  console.log(`  Algorithm signals: ${algorithmSignals.length}`);
  console.log(`  System signals: ${systemSignals.length}`);
  console.log(`  Failure signals: ${failureSignals.length}`);
  console.log(`  Rating signals (low-satisfaction, conf > ${CONFIDENCE_FILTER_THRESHOLD}): ${ratingSignals.length}`);

  const allSignals = [...algorithmSignals, ...systemSignals, ...failureSignals, ...ratingSignals];
  console.log(`  Total: ${allSignals.length} signals\n`);

  if (allSignals.length === 0) {
    console.log("Nothing to analyse -- corpus is empty.");
    return;
  }

  // Load context for provenance
  const sessionNames = loadSessionNames();
  const workSessions = loadWorkSessions();

  // Cluster
  const clusters = clusterSignals(allSignals, sessionNames, workSessions);
  console.log(`  Clusters surviving MIN_RECURRENCE (${MIN_RECURRENCE}): ${clusters.length}`);

  if (clusters.length === 0) {
    console.log("No themes reached the recurrence threshold. Nothing to queue.");
    return;
  }

  // Load existing rules for dedup
  const existingRules = loadExistingRules();
  console.log(`  Existing feedback rules: ${existingRules.length}\n`);

  // Load existing queue to avoid re-queuing
  const existingQueue = loadQueue();
  const queuedSlugs = new Set(existingQueue.map(c => c.slug));

  let queuedCount = 0;
  let skippedDedup = 0;
  let skippedAlreadyQueued = 0;

  for (const cluster of clusters) {
    const dedupNote = dedupCheck(cluster, existingRules);
    const alreadyCovered = dedupNote.startsWith("COVERED");

    if (alreadyCovered) {
      skippedDedup++;
      console.log(`  [SKIP dedup] ${cluster.slug}: ${dedupNote}`);
      continue;
    }

    if (queuedSlugs.has(cluster.slug)) {
      skippedAlreadyQueued++;
      console.log(`  [SKIP queue] ${cluster.slug}: already in queue`);
      continue;
    }

    const candidate = draftCandidate(cluster, dedupNote);

    if (dryRun) {
      console.log(`\n  [DRY RUN] Would queue: ${candidate.proposedRuleName}`);
      console.log(`    Theme: ${cluster.theme}`);
      console.log(`    Evidence: ${cluster.evidenceCount} signals, ${cluster.sessionIds.size} sessions, ${cluster.projectSlugs.size} projects`);
      console.log(`    Dedup: ${dedupNote}`);
    } else {
      const queuePath = saveCandidate(candidate);
      console.log(`\n  [QUEUED] ${candidate.proposedRuleName}`);
      console.log(`    Theme: ${cluster.theme}`);
      console.log(`    Evidence: ${cluster.evidenceCount} signals, ${cluster.sessionIds.size} sessions, ${cluster.projectSlugs.size} projects`);
      console.log(`    Queue file: ${path.relative(MEMORY_AUTO_DIR, queuePath)}`);
      queuedCount++;
    }
  }

  console.log("\n" + "-".repeat(50));
  if (dryRun) {
    console.log(`Dry run complete. ${clusters.length} clusters, ${skippedDedup} skipped (dedup), ${skippedAlreadyQueued} skipped (already queued).`);
  } else {
    console.log(`Harvest complete. Queued: ${queuedCount}. Skipped (dedup): ${skippedDedup}. Skipped (already queued): ${skippedAlreadyQueued}.`);
    if (queuedCount > 0) {
      console.log(`\nReview with: bun FeedbackHarvester.ts queue`);
      console.log(`Approve with: bun FeedbackHarvester.ts approve <slug>`);
    }
  }
}

function cmdQueue(): void {
  const candidates = loadQueue();

  if (candidates.length === 0) {
    console.log("Feedback queue is empty. Run: bun FeedbackHarvester.ts harvest");
    return;
  }

  const pending = candidates.filter(c => c.status === "pending");
  const approved = candidates.filter(c => c.status === "approved");
  const rejected = candidates.filter(c => c.status === "rejected");

  console.log("FeedbackHarvester -- review queue");
  console.log("-".repeat(50));
  console.log(`  Total: ${candidates.length} (${pending.length} pending, ${approved.length} approved, ${rejected.length} rejected)\n`);

  if (pending.length > 0) {
    console.log("PENDING (awaiting approval):");
    for (const c of pending) {
      console.log(`\n  slug: ${c.slug}`);
      console.log(`  theme: ${c.theme}`);
      console.log(`  evidence: ${c.evidenceCount} signals, ${c.sessions.length} sessions, ${c.projects.length} projects`);
      console.log(`  dedup: ${c.dedupNote}`);
      console.log(`  proposed rule name: ${c.proposedRuleName}`);
      console.log(`\n  --- proposed rule body ---`);
      for (const line of c.proposedRuleBody.split("\n").slice(0, 10)) {
        console.log(`  ${line}`);
      }
      if (c.proposedRuleBody.split("\n").length > 10) {
        console.log(`  ... (${c.proposedRuleBody.split("\n").length - 10} more lines)`);
      }
      console.log(`  ---`);
      console.log(`\n  To approve: bun FeedbackHarvester.ts approve ${c.slug}`);
      console.log(`  To reject:  bun FeedbackHarvester.ts reject ${c.slug}`);
    }
  }

  if (approved.length > 0) {
    console.log("\nAPPROVED:");
    for (const c of approved) {
      console.log(`  ${c.slug} (${c.evidenceCount} signals)`);
    }
  }

  if (rejected.length > 0) {
    console.log("\nREJECTED:");
    for (const c of rejected) {
      console.log(`  ${c.slug}`);
    }
  }
}

function cmdApprove(slug: string): void {
  const filepath = path.join(FEEDBACK_QUEUE_DIR, `${slug}.json`);
  if (!fs.existsSync(filepath)) {
    console.error(`No queued candidate with slug: ${slug}`);
    console.error(`Run: bun FeedbackHarvester.ts queue -- to see what is queued.`);
    process.exit(1);
  }

  const candidate = JSON.parse(fs.readFileSync(filepath, "utf-8")) as FeedbackCandidate;

  if (candidate.status === "approved") {
    console.log(`Already approved: ${slug}`);
    return;
  }
  if (candidate.status === "rejected") {
    console.error(`${slug} was rejected. To re-approve, manually set status back to pending in ${filepath}`);
    process.exit(1);
  }

  const ruleFilePath = promoteToRule(candidate);
  updateCandidateStatus(slug, "approved");

  console.log(`Approved and promoted: ${candidate.proposedRuleName}`);
  console.log(`Rule written to: ${ruleFilePath}`);
  console.log(`MEMORY.md index updated.`);
  console.log(`Queue status updated: ${filepath}`);
}

function cmdReject(slug: string): void {
  const candidate = updateCandidateStatus(slug, "rejected");
  if (!candidate) {
    console.error(`No queued candidate with slug: ${slug}`);
    process.exit(1);
  }
  console.log(`Rejected: ${slug}`);
  console.log(`Queue file kept for audit: ${path.join(FEEDBACK_QUEUE_DIR, `${slug}.json`)}`);
}

function cmdStatus(): void {
  console.log("FeedbackHarvester -- corpus status");
  console.log("-".repeat(50));

  const algorithmFiles = walkDirForMonthFiles(ALGORITHM_LEARNING_DIR).filter(f => f.endsWith(".md"));
  const systemFiles = walkDirForMonthFiles(SYSTEM_LEARNING_DIR).filter(f => f.endsWith(".md"));
  const failureDirs = walkFailureDirs(FAILURES_DIR);
  const existingRules = loadExistingRules();
  const queue = loadQueue();

  let ratingsTotal = 0;
  let ratingsFiltered = 0;
  if (fs.existsSync(RATINGS_FILE)) {
    try {
      const lines = fs.readFileSync(RATINGS_FILE, "utf-8").trim().split("\n").filter(l => l.trim());
      ratingsTotal = lines.length;
      ratingsFiltered = lines.filter(l => {
        try {
          const row = JSON.parse(l) as RatingRow;
          return row.confidence > CONFIDENCE_FILTER_THRESHOLD && !row.sentiment_summary.startsWith("Inference failed");
        } catch { return false; }
      }).length;
    } catch { /* skip */ }
  }

  console.log(`  Algorithm learning signals: ${algorithmFiles.length}`);
  console.log(`  System learning signals: ${systemFiles.length}`);
  console.log(`  Failure captures: ${failureDirs.length}`);
  console.log(`  Ratings total: ${ratingsTotal} (${ratingsFiltered} usable, confidence > ${CONFIDENCE_FILTER_THRESHOLD})`);
  console.log(`  Existing feedback rules: ${existingRules.length}`);

  if (existingRules.length > 0) {
    console.log("\n  Current rules:");
    for (const r of existingRules) {
      console.log(`    ${r.slug}`);
    }
  }

  const pending = queue.filter(c => c.status === "pending");
  const approved = queue.filter(c => c.status === "approved");
  const rejected = queue.filter(c => c.status === "rejected");
  console.log(`\n  Queue: ${pending.length} pending, ${approved.length} approved, ${rejected.length} rejected`);
  if (pending.length > 0) {
    console.log(`  Run: bun FeedbackHarvester.ts queue -- to review pending candidates`);
  }
}

// ============================================================================
// CLI entry point
// ============================================================================

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    "dry-run": { type: "boolean" },
    help: { type: "boolean", short: "h" },
  },
  allowPositionals: true,
  strict: false,
});

const command = positionals[0] || "status";

if (values.help) {
  console.log(`
FeedbackHarvester -- Mine LEARNING signals for recurring patterns, queue for Nick's approval

Commands:
  harvest              Scan corpus and queue new candidates
  harvest --dry-run    Preview candidates without writing
  queue                List all queued candidates (pending/approved/rejected)
  approve <slug>       Promote a pending candidate to a live feedback-*.md rule
  reject <slug>        Mark a candidate as rejected (kept for audit)
  status               Corpus + rule summary

Examples:
  bun FeedbackHarvester.ts harvest --dry-run
  bun FeedbackHarvester.ts harvest
  bun FeedbackHarvester.ts queue
  bun FeedbackHarvester.ts approve verify-before-claiming
  bun FeedbackHarvester.ts status

Notes:
  - Never auto-writes feedback rules. Queue-then-approve is the only path.
  - Ratings rows with confidence <= ${CONFIDENCE_FILTER_THRESHOLD} are filtered (inference timeout noise).
  - A theme must appear across ${MIN_RECURRENCE}+ distinct sessions/projects to survive clustering.
`);
  process.exit(0);
}

switch (command) {
  case "harvest":
    cmdHarvest(!!values["dry-run"]);
    break;
  case "queue":
    cmdQueue();
    break;
  case "approve": {
    const slug = positionals[1];
    if (!slug) {
      console.error("Usage: bun FeedbackHarvester.ts approve <slug>");
      process.exit(1);
    }
    cmdApprove(slug);
    break;
  }
  case "reject": {
    const slug = positionals[1];
    if (!slug) {
      console.error("Usage: bun FeedbackHarvester.ts reject <slug>");
      process.exit(1);
    }
    cmdReject(slug);
    break;
  }
  case "status":
    cmdStatus();
    break;
  default:
    console.error(`Unknown command: ${command}. Use --help for usage.`);
    process.exit(1);
}
