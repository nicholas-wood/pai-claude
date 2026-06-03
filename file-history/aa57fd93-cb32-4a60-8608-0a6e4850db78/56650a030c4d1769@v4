#!/usr/bin/env bun
// Daily git auto-commit for knowledge/docs repos only. Explicit allowlist.
// Commits any working-tree changes, then pushes whenever the repo is ahead of
// its upstream (so previously-unpushed commits also land). Always exits 0 so it
// can never trip Pulse's consecutive-failure breaker.
import { $ } from "bun"

const HOME = process.env.HOME ?? ""
// ALLOWLIST: notes/docs/config repos only. NOT code repos, NOT worktrees.
const REPOS = [
  `${HOME}/Documents/workspace`,        // life-os
  `${HOME}/.claude`,                    // pai-claude (host repo)
]
const SECRET = /(^|\/)\.env|\.key$|\.pem$|\.p12$|id_rsa|\.secrets\/|\.claude\.json|credentials\.json/
const stamp = new Date().toISOString().slice(0, 16).replace("T", " ")
const host = (await $`hostname -s`.quiet().text()).trim()

for (const dir of REPOS) {
  try {
    await $`git -C ${dir} rev-parse --git-dir`.quiet()

    // Skip if mid-merge/rebase — never auto-commit a conflicted tree.
    const inMerge = await $`git -C ${dir} rev-parse -q --verify MERGE_HEAD`.quiet().nothrow()
    if (inMerge.exitCode === 0) { console.log(`SKIP ${dir}: mid-merge`); continue }

    // 1. Commit working-tree changes, if any.
    const dirty = (await $`git -C ${dir} status --porcelain`.quiet().text()).trim()
    if (dirty) {
      await $`git -C ${dir} add -A`.quiet()
      const staged = (await $`git -C ${dir} diff --cached --name-only`.quiet().text()).trim().split("\n")
      const leak = staged.find((f) => SECRET.test(f))
      if (leak) { await $`git -C ${dir} reset`.quiet(); console.log(`ABORT ${dir}: secret staged (${leak})`); continue }
      await $`git -C ${dir} commit -m ${`chore: daily auto-commit ${stamp} (${host})`}`.quiet()
    }

    // 2. Push if there is an upstream and we are ahead (covers new + old unpushed commits).
    const hasUpstream = await $`git -C ${dir} rev-parse --abbrev-ref --symbolic-full-name @{u}`.quiet().nothrow()
    if (hasUpstream.exitCode !== 0) { console.log(`${dir}: ${dirty ? "committed" : "clean"}, no upstream`); continue }

    await $`git -C ${dir} fetch -q`.quiet().nothrow()
    const ahead = (await $`git -C ${dir} rev-list --count @{u}..HEAD`.quiet().nothrow().text()).trim()
    if (ahead === "0") { console.log(`clean ${dir}`); continue }

    await $`git -C ${dir} pull --rebase --autostash`.quiet().nothrow()
    const push = await $`git -C ${dir} push`.quiet().nothrow()
    console.log(push.exitCode === 0 ? `pushed ${dir} (${ahead} commit[s])` : `commit kept, push FAILED — retry next run: ${dir}`)
  } catch (e) { console.log(`ERROR ${dir}: ${e}`) }
}
process.exit(0)   // never fail the Pulse job
