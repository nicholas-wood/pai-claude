#!/usr/bin/env bun
/**
 * Assistant Tasks Check — Script-type job (zero AI cost)
 *
 * Runs every minute. Reads Pulse/state/da/scheduled-tasks.jsonl, finds tasks
 * due now, fires their notify actions, and updates task status.
 *
 * Task types supported:
 *   action.type = "notify"  → outputs message text (Pulse routes to voice/telegram)
 *   action.type = "script"  → executes command via Bun.spawn
 *   action.type = "prompt"  → logs intent only (LLM execution not implemented here)
 *
 * Output: notification text or NO_ACTION
 *
 * Cron schedule: * * * * * (every minute)
 */

import { join } from "path"
import { existsSync, readFileSync, writeFileSync } from "fs"

const HOME = process.env.HOME ?? ""
const PAI_DIR = join(HOME, ".claude", "PAI")
const TASKS_DIR = join(PAI_DIR, "Pulse", "state", "da")
const TASKS_PATH = join(TASKS_DIR, "scheduled-tasks.jsonl")
const HISTORY_PATH = join(TASKS_DIR, "task-history.jsonl")

// ── Types ──

interface ScheduledTask {
  id: string
  created_at: string
  created_by: string
  description: string
  schedule: {
    type: "once" | "recurring"
    at?: string       // ISO timestamp for one-time tasks
    cron?: string     // 5-field cron for recurring tasks
    until?: string    // Optional expiry for recurring
  }
  action: {
    type: "notify" | "prompt" | "script"
    message?: string
    channel?: string
    prompt?: string
    model?: string
    command?: string
  }
  status: "active" | "completed" | "cancelled"
  last_fired?: string
  fire_count: number
  tags?: string[]
}

// ── Cron matcher (5-field: min hour dom mon dow) ──

function matchesCron(expr: string, now: Date): boolean {
  const parts = expr.trim().split(/\s+/)
  if (parts.length !== 5) return false
  const [minF, hourF, domF, monF, dowF] = parts

  function matchField(field: string, value: number, min: number, max: number): boolean {
    if (field === "*") return true
    if (field.includes("/")) {
      const [rangeStr, stepStr] = field.split("/")
      const step = parseInt(stepStr, 10)
      if (isNaN(step)) return false
      if (rangeStr === "*") return (value - min) % step === 0
      const start = parseInt(rangeStr, 10)
      return value >= start && (value - start) % step === 0
    }
    const values = field.split(",").map(s => {
      if (s.includes("-")) {
        const [lo, hi] = s.split("-").map(Number)
        const r: number[] = []
        for (let i = lo; i <= hi; i++) r.push(i)
        return r
      }
      return [parseInt(s, 10)]
    }).flat()
    return values.includes(value)
  }

  return (
    matchField(minF, now.getMinutes(), 0, 59) &&
    matchField(hourF, now.getHours(), 0, 23) &&
    matchField(domF, now.getDate(), 1, 31) &&
    matchField(monF, now.getMonth() + 1, 1, 12) &&
    matchField(dowF, now.getDay(), 0, 6)
  )
}

// ── Task store I/O ──

function loadTasks(): ScheduledTask[] {
  if (!existsSync(TASKS_PATH)) return []
  try {
    const lines = readFileSync(TASKS_PATH, "utf-8").trim().split("\n").filter(Boolean)
    return lines.map(l => {
      try { return JSON.parse(l) as ScheduledTask } catch { return null }
    }).filter(Boolean) as ScheduledTask[]
  } catch {
    return []
  }
}

function saveTasks(tasks: ScheduledTask[]): void {
  writeFileSync(TASKS_PATH, tasks.map(t => JSON.stringify(t)).join("\n") + "\n")
}

function appendHistory(task: ScheduledTask): void {
  try {
    const line = JSON.stringify({ ...task, archived_at: new Date().toISOString() }) + "\n"
    const { appendFileSync, mkdirSync } = require("fs") as typeof import("fs")
    mkdirSync(TASKS_DIR, { recursive: true })
    appendFileSync(HISTORY_PATH, line)
  } catch { /* history is non-critical */ }
}

// ── Execute a script action ──

async function runScript(command: string): Promise<void> {
  try {
    const proc = Bun.spawn(["sh", "-c", command], {
      stdout: "pipe",
      stderr: "pipe",
    })
    await proc.exited
  } catch { /* best-effort */ }
}

// ── Main ──

async function main() {
  if (!existsSync(TASKS_PATH)) {
    console.log("NO_ACTION")
    return
  }

  const now = new Date()
  const nowMs = now.getTime()
  const tasks = loadTasks()
  const activeTasks = tasks.filter(t => t.status === "active")

  const fired: string[] = []
  let modified = false

  for (const task of activeTasks) {
    const { schedule, action } = task

    // Check expiry for recurring tasks
    if (schedule.until && new Date(schedule.until).getTime() < nowMs) {
      task.status = "cancelled"
      modified = true
      appendHistory(task)
      continue
    }

    let isDue = false

    if (schedule.type === "once" && schedule.at) {
      // Fire if within the current minute window and not already fired
      const atMs = new Date(schedule.at).getTime()
      const windowStart = nowMs - 60_000
      isDue = atMs >= windowStart && atMs <= nowMs
    } else if (schedule.type === "recurring" && schedule.cron) {
      isDue = matchesCron(schedule.cron, now)
    }

    if (!isDue) continue

    // Fire the action
    if (action.type === "notify" && action.message) {
      fired.push(action.message)
    } else if (action.type === "script" && action.command) {
      await runScript(action.command)
      fired.push(`Ran: ${task.description}`)
    } else if (action.type === "prompt") {
      // Log intent only — prompt execution requires LLM integration
      fired.push(`[prompt task] ${task.description}`)
    }

    task.last_fired = now.toISOString()
    task.fire_count = (task.fire_count ?? 0) + 1

    if (schedule.type === "once") {
      task.status = "completed"
      appendHistory(task)
    }

    modified = true
  }

  if (modified) {
    saveTasks(tasks)
  }

  if (fired.length === 0) {
    console.log("NO_ACTION")
    return
  }

  // Output first fired message (Pulse routes this to voice/telegram based on job config)
  console.log(fired.join(" | "))
}

main().catch(err => {
  console.error(`assistant-tasks error: ${err}`)
  console.log("NO_ACTION")
})
