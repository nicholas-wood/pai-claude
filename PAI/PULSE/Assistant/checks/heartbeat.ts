#!/usr/bin/env bun
/**
 * Assistant Heartbeat Check — Script-type job (zero AI cost by default)
 *
 * Runs every 30 minutes. Gathers context from available local sources and
 * determines whether a voice notification is warranted.
 *
 * Context gathered (all free, deterministic):
 *   - Recent ratings (last 3, from MEMORY/LEARNING/SIGNALS/ratings.jsonl)
 *   - Active work session count (MEMORY/WORK/ ISA files modified today)
 *   - DA identity name (from DA registry or flat DA_IDENTITY.md)
 *   - Pending scheduled tasks due in the next 15 minutes
 *   - Pulse state: last known job failures
 *
 * Decision logic (deterministic, no LLM):
 *   - Any job with 3 consecutive failures → alert
 *   - Pending task due in < 15 min → remind
 *   - All else → NO_ACTION (silent heartbeat)
 *
 * Output: notification text or NO_ACTION
 *
 * Cron schedule: every 30 minutes ("*\/30 * * * *")
 *
 * Note: LLM-based evaluation (Haiku) is described in DaSubsystem.md Section 3.
 * That is Phase 2. This script handles Phase 1: deterministic context + rules.
 */

import { join } from "path"
import { existsSync, readFileSync } from "fs"

const HOME = process.env.HOME ?? ""
const PAI_DIR = join(HOME, ".claude", "PAI")
const PULSE_DIR = join(PAI_DIR, "Pulse")
const STATE_PATH = join(PULSE_DIR, "state", "state.json")
const RATINGS_PATH = join(PAI_DIR, "MEMORY", "LEARNING", "SIGNALS", "ratings.jsonl")
const DA_DIR = join(PAI_DIR, "USER", "DA")
const DA_IDENTITY_FLAT = join(PAI_DIR, "USER", "DA_IDENTITY.md")
const REGISTRY_PATH = join(DA_DIR, "_registry.yaml")
const TASKS_PATH = join(PULSE_DIR, "state", "da", "scheduled-tasks.jsonl")

// ── Helpers ──

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
  return "Jarvis"
}

interface Rating {
  timestamp: string
  rating: number
  session_id: string
  source: string
}

interface ScheduledTask {
  id: string
  description: string
  status: string
  schedule: { type: string; at?: string; cron?: string }
  action: { type: string; message?: string; channel?: string }
  fire_count: number
}

interface JobState {
  lastRun: number
  lastResult: "ok" | "error"
  consecutiveFailures: number
}

interface PulseState {
  jobs: Record<string, JobState>
}

function matchesCron(expr: string, now: Date): boolean {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) return false
  const [minF, hourF, domF, monF, dowF] = parts

  function matchField(field: string, value: number): boolean {
    if (field === "*") return true
    if (field.includes("/")) {
      const [rangeStr, stepStr] = field.split("/")
      const step = parseInt(stepStr, 10)
      if (isNaN(step)) return false
      const start = rangeStr === "*" ? 0 : parseInt(rangeStr, 10)
      return value >= start && (value - start) % step === 0
    }
    return field.split(",").map(s => parseInt(s, 10)).includes(value)
  }

  return (
    matchField(minF, now.getMinutes()) &&
    matchField(hourF, now.getHours()) &&
    matchField(domF, now.getDate()) &&
    matchField(monF, now.getMonth() + 1) &&
    matchField(dowF, now.getDay())
  )
}

function getTasksDueSoon(minutesAhead: number): ScheduledTask[] {
  const tasks = readJSONL<ScheduledTask>(TASKS_PATH)
  const activeTasks = tasks.filter(t => t.status === "active")
  const now = new Date()
  const cutoff = new Date(now.getTime() + minutesAhead * 60_000)

  return activeTasks.filter(task => {
    if (task.schedule.type === "once" && task.schedule.at) {
      const atMs = new Date(task.schedule.at).getTime()
      return atMs >= now.getTime() && atMs <= cutoff.getTime()
    }
    // For recurring tasks, check if they fire in the next <minutesAhead> minutes
    if (task.schedule.type === "recurring" && task.schedule.cron) {
      for (let offset = 1; offset <= minutesAhead; offset++) {
        const future = new Date(now.getTime() + offset * 60_000)
        if (matchesCron(task.schedule.cron, future)) return true
      }
    }
    return false
  })
}

// ── Main ──

async function main() {
  const daName = getDAName()
  const alerts: string[] = []

  // ── Check 1: Pulse job failures ──
  if (existsSync(STATE_PATH)) {
    try {
      const state = JSON.parse(readFileSync(STATE_PATH, "utf-8")) as PulseState
      for (const [jobName, jobState] of Object.entries(state.jobs ?? {})) {
        if (jobState.consecutiveFailures >= 3) {
          alerts.push(`Job "${jobName}" has failed ${jobState.consecutiveFailures} times in a row.`)
        }
      }
    } catch { /* non-critical */ }
  }

  // ── Check 2: Scheduled tasks due soon ──
  const upcoming = getTasksDueSoon(15)
  for (const task of upcoming) {
    const msg = task.action.message ?? task.description
    alerts.push(`Reminder in 15 minutes: ${msg}`)
  }

  // ── Check 3: Low recent ratings signal (optional signal, non-alerting) ──
  const ratings = readJSONL<Rating>(RATINGS_PATH)
  const recent = ratings.slice(-3)
  const avgRating = recent.length > 0
    ? recent.reduce((s, r) => s + r.rating, 0) / recent.length
    : null

  if (alerts.length === 0) {
    console.log("NO_ACTION")
    return
  }

  // Format as a concise voice notification
  const intro = `${daName} heartbeat:`
  const body = alerts.join(" Also: ")
  console.log(`${intro} ${body}`)
}

main().catch(err => {
  console.error(`assistant-heartbeat error: ${err}`)
  console.log("NO_ACTION")
})
