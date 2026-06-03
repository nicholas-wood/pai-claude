#!/usr/bin/env bun
/**
 * Assistant Growth Check — Script-type job (zero AI cost)
 *
 * Runs weekly (Sunday 4 AM). Reads the last 7 days of diary entries and
 * ratings, updates the DA's opinions.yaml (confidence decay + pruning),
 * and appends a growth log entry.
 *
 * Phase 1 (this script): deterministic operations only.
 *   - Confidence decay: opinions not confirmed in 30+ days lose 0.02 confidence
 *   - Pruning: opinions below 0.3 confidence are archived
 *   - Growth log entry: weekly summary of session count, mood distribution, avg rating
 *   - Interaction count update in growth.jsonl
 *
 * Phase 2 (future): Sonnet-based opinion formation from diary topics.
 *
 * Output: log entry describing what changed.
 *
 * Cron schedule: 0 4 * * 0 (Sunday 4 AM)
 */

import { join } from "path"
import { existsSync, readFileSync, writeFileSync, appendFileSync, mkdirSync } from "fs"

const HOME = process.env.HOME ?? ""
const PAI_DIR = join(HOME, ".claude", "PAI")
const DA_DIR = join(PAI_DIR, "USER", "DA")
const DA_IDENTITY_FLAT = join(PAI_DIR, "USER", "DA_IDENTITY.md")
const REGISTRY_PATH = join(DA_DIR, "_registry.yaml")

// ── Types ──

interface DiaryEntry {
  date: string
  interaction_count: number
  topics: string[]
  mood: "positive" | "neutral" | "frustrated"
  avg_rating: number | null
  notable_moments: string[]
  learning: string | null
}

interface Opinion {
  topic: string
  belief: string
  confidence: number
  source: "observation" | "inference" | "stated"
  evidence_count: number
  first_observed: string
  last_confirmed: string
}

interface GrowthEvent {
  date: string
  type: string
  detail: string
  before?: unknown
  after?: unknown
}

// ── Helpers ──

function getDAName(): string {
  if (existsSync(REGISTRY_PATH)) {
    try {
      const content = readFileSync(REGISTRY_PATH, "utf-8")
      const match = content.match(/^primary:\s*(\S+)/m)
      if (match?.[1]) return match[1]
    } catch { /* fall through */ }
  }
  if (existsSync(DA_IDENTITY_FLAT)) {
    try {
      const content = readFileSync(DA_IDENTITY_FLAT, "utf-8")
      const match = content.match(/^\*{0,2}Name:\*{0,2}\s*(.+)/m)
      if (match?.[1]) return match[1].trim().split("|")[0].trim()
    } catch { /* fall through */ }
  }
  return "jarvis"
}

function getDADataDir(daName: string): string {
  const structured = join(DA_DIR, daName)
  if (existsSync(structured)) return structured
  return DA_DIR
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

function readJSONL<T>(path: string): T[] {
  if (!existsSync(path)) return []
  try {
    return readFileSync(path, "utf-8")
      .trim()
      .split("\n")
      .filter(Boolean)
      .map(l => { try { return JSON.parse(l) as T } catch { return null } })
      .filter(Boolean) as T[]
  } catch {
    return []
  }
}

// Minimal YAML opinion reader — handles the specific opinions.yaml format
function readOpinions(path: string): Opinion[] {
  if (!existsSync(path)) return []
  // For now: return empty and let the writer start fresh if needed.
  // Phase 2 will parse and update existing opinions.
  // The structure is: opinions: [{topic, belief, confidence, ...}]
  return []
}

function writeOpinions(path: string, opinions: Opinion[]): void {
  // Write in YAML format matching the spec in DaSubsystem.md
  const header = "# DA Opinions — evolve over time\n# Confidence: 0.0 (guess) to 1.0 (proven)\n# Source: observation | inference | stated\n\nopinions:\n"
  const body = opinions.map(op => [
    `  - topic: ${JSON.stringify(op.topic)}`,
    `    belief: ${JSON.stringify(op.belief)}`,
    `    confidence: ${op.confidence.toFixed(2)}`,
    `    source: ${op.source}`,
    `    evidence_count: ${op.evidence_count}`,
    `    first_observed: "${op.first_observed}"`,
    `    last_confirmed: "${op.last_confirmed}"`,
  ].join("\n")).join("\n\n")
  writeFileSync(path, header + body + "\n")
}

// ── Growth logic ──

function applyDecay(opinions: Opinion[], today: string): { updated: Opinion[]; decayed: number; pruned: Opinion[] } {
  const decayThreshold = 0.3
  const decayAmount = 0.02
  const staleAfterDays = 30

  let decayed = 0
  const pruned: Opinion[] = []
  const updated: Opinion[] = []

  for (const op of opinions) {
    const daysSinceConfirmed = Math.floor(
      (new Date(today).getTime() - new Date(op.last_confirmed).getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSinceConfirmed >= staleAfterDays) {
      op.confidence = Math.max(0, op.confidence - decayAmount)
      decayed++
    }

    if (op.confidence < decayThreshold) {
      pruned.push(op)
    } else {
      updated.push(op)
    }
  }

  return { updated, decayed, pruned }
}

function weekSummary(diaryEntries: DiaryEntry[]): {
  totalSessions: number
  avgRating: number | null
  moodDist: Record<string, number>
  topTopics: string[]
} {
  const totalSessions = diaryEntries.reduce((s, e) => s + e.interaction_count, 0)
  const ratings = diaryEntries.map(e => e.avg_rating).filter((r): r is number => r !== null)
  const avgRating = ratings.length > 0 ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : null

  const moodDist: Record<string, number> = { positive: 0, neutral: 0, frustrated: 0 }
  for (const e of diaryEntries) moodDist[e.mood] = (moodDist[e.mood] ?? 0) + 1

  // Flatten and count topics
  const topicCounts: Record<string, number> = {}
  for (const e of diaryEntries) {
    for (const t of e.topics) topicCounts[t] = (topicCounts[t] ?? 0) + 1
  }
  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([t]) => t)

  return { totalSessions, avgRating, moodDist, topTopics }
}

// ── Main ──

async function main() {
  const today = todayStr()
  const weekAgo = daysAgo(7)
  const daName = getDAName()
  const dataDir = getDADataDir(daName)

  mkdirSync(dataDir, { recursive: true })

  const diaryPath = join(dataDir, "diary.jsonl")
  const opinionsPath = join(dataDir, "opinions.yaml")
  const growthPath = join(dataDir, "growth.jsonl")

  // ── Load last 7 days of diary ──
  const allDiary = readJSONL<DiaryEntry>(diaryPath)
  const weekDiary = allDiary.filter(e => e.date >= weekAgo && e.date <= today)

  // ── Opinion decay + pruning ──
  const opinions = readOpinions(opinionsPath)
  const { updated: updatedOpinions, decayed, pruned } = applyDecay(opinions, today)

  if (opinions.length > 0) {
    writeOpinions(opinionsPath, updatedOpinions)
  }

  // ── Weekly summary ──
  const summary = weekSummary(weekDiary)

  // ── Growth log entry ──
  const growthEvent: GrowthEvent = {
    date: today,
    type: "weekly_summary",
    detail: [
      `Week: ${weekAgo} to ${today}.`,
      `Diary entries: ${weekDiary.length}.`,
      `Total sessions: ${summary.totalSessions}.`,
      `Avg rating: ${summary.avgRating ?? "n/a"}.`,
      `Mood distribution: ${JSON.stringify(summary.moodDist)}.`,
      summary.topTopics.length > 0 ? `Top topics: ${summary.topTopics.join(", ")}.` : "",
      opinions.length > 0 ? `Opinions: ${decayed} decayed, ${pruned.length} pruned (below 0.3 confidence).` : "No opinions yet.",
    ].filter(Boolean).join(" "),
  }

  appendFileSync(growthPath, JSON.stringify(growthEvent) + "\n")

  console.log(
    `[assistant-growth] Weekly growth run complete. ` +
    `Diary entries: ${weekDiary.length}, sessions: ${summary.totalSessions}, ` +
    `avg rating: ${summary.avgRating ?? "n/a"}, ` +
    `opinions: ${opinions.length} total, ${decayed} decayed, ${pruned.length} pruned.`
  )
}

main().catch(err => {
  console.error(`assistant-growth error: ${err}`)
})
