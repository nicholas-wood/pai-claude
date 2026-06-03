#!/usr/bin/env bun
/**
 * Assistant Diary Check — Script-type job (zero AI cost)
 *
 * Runs daily at 11 PM. Writes a diary entry for today to the DA's diary.jsonl.
 * Reads context from:
 *   - MEMORY/LEARNING/SIGNALS/ratings.jsonl (today's ratings)
 *   - MEMORY/WORK/ (ISA files modified today — topics worked on)
 *
 * Output: log entry (not voice) describing what was written.
 *
 * Cron schedule: 0 23 * * *
 */

import { join } from "path"
import { existsSync, readFileSync, readdirSync, statSync, mkdirSync, appendFileSync } from "fs"

const HOME = process.env.HOME ?? ""
const PAI_DIR = join(HOME, ".claude", "PAI")
const DA_DIR = join(PAI_DIR, "USER", "DA")
const DA_IDENTITY_FLAT = join(PAI_DIR, "USER", "DA_IDENTITY.md")
const REGISTRY_PATH = join(DA_DIR, "_registry.yaml")
const RATINGS_PATH = join(PAI_DIR, "MEMORY", "LEARNING", "SIGNALS", "ratings.jsonl")
const WORK_DIR = join(PAI_DIR, "MEMORY", "WORK")

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

interface Rating {
  timestamp: string
  rating: number
  session_id: string
  source: string
  sentiment_summary?: string
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

function getDiaryPath(daName: string): string {
  // Prefer structured DA directory
  const structuredPath = join(DA_DIR, daName, "diary.jsonl")
  if (existsSync(join(DA_DIR, daName))) return structuredPath
  // Fall back to flat DA directory structure
  return join(DA_DIR, "diary.jsonl")
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10)
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

function todaysRatings(ratings: Rating[], today: string): Rating[] {
  return ratings.filter(r => r.timestamp.startsWith(today))
}

function moodFromAvg(avg: number | null): DiaryEntry["mood"] {
  if (avg === null) return "neutral"
  if (avg >= 7) return "positive"
  if (avg <= 4) return "frustrated"
  return "neutral"
}

function getTopicsFromWork(today: string): string[] {
  if (!existsSync(WORK_DIR)) return []
  const topics: string[] = []

  try {
    const entries = readdirSync(WORK_DIR)
    for (const entry of entries) {
      const entryPath = join(WORK_DIR, entry)
      try {
        const stat = statSync(entryPath)
        if (!stat.isDirectory()) continue
        // Check if any file in this work dir was modified today
        const isaPath = join(entryPath, "ISA.md")
        if (!existsSync(isaPath)) continue
        const isaStat = statSync(isaPath)
        const modDate = isaStat.mtime.toISOString().slice(0, 10)
        if (modDate !== today) continue
        // Extract readable topic name from directory slug
        // Slug format: YYYYMMDD-HHMMSS_topic-name
        const match = entry.match(/^\d{8}-\d{6}_(.+)$/)
        const topicSlug = match ? match[1] : entry
        // Convert slug to readable: replace hyphens with spaces, capitalise first word
        const readable = topicSlug.replace(/-/g, " ").replace(/^\w/, c => c.toUpperCase())
        topics.push(readable)
      } catch { /* skip inaccessible */ }
    }
  } catch { /* skip */ }

  return topics.slice(0, 5) // Cap at 5 topics
}

function countUniqueSessions(ratings: Rating[]): number {
  return new Set(ratings.map(r => r.session_id)).size
}

function checkAlreadyWritten(diaryPath: string, today: string): boolean {
  const entries = readJSONL<DiaryEntry>(diaryPath)
  return entries.some(e => e.date === today)
}

// ── Main ──

async function main() {
  const today = todayStr()
  const daName = getDAName()
  const diaryPath = getDiaryPath(daName)

  // Idempotent: skip if already written today
  if (existsSync(diaryPath) && checkAlreadyWritten(diaryPath, today)) {
    console.log(`[assistant-diary] Entry for ${today} already exists — skipping`)
    return
  }

  const allRatings = readJSONL<Rating>(RATINGS_PATH)
  const todayRatings = todaysRatings(allRatings, today)
  const sessionCount = countUniqueSessions(todayRatings)
  const topics = getTopicsFromWork(today)

  const avgRating = todayRatings.length > 0
    ? Math.round(
        (todayRatings.reduce((s, r) => s + r.rating, 0) / todayRatings.length) * 10
      ) / 10
    : null

  const mood = moodFromAvg(avgRating)

  // Notable moments: any sentiment summaries from ratings (filter out timeout/error messages)
  const notableMoments = todayRatings
    .map(r => r.sentiment_summary)
    .filter((s): s is string => !!s && !s.toLowerCase().includes("failed") && !s.toLowerCase().includes("timeout"))
    .slice(0, 3)

  const entry: DiaryEntry = {
    date: today,
    interaction_count: sessionCount,
    topics,
    mood,
    avg_rating: avgRating,
    notable_moments: notableMoments,
    learning: null, // Phase 2: LLM-derived learning extraction
  }

  // Ensure diary directory exists
  const diaryDir = join(diaryPath, "..")
  mkdirSync(diaryDir, { recursive: true })

  appendFileSync(diaryPath, JSON.stringify(entry) + "\n")

  console.log(
    `[assistant-diary] Wrote diary entry for ${today}: ` +
    `${sessionCount} session(s), ${topics.length} topic(s), mood: ${mood}, avg rating: ${avgRating ?? "n/a"}`
  )
}

main().catch(err => {
  console.error(`assistant-diary error: ${err}`)
})
