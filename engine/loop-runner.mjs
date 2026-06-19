// loop-runner — the general execution engine behind loop-to-goal.
//
// One engine, any project. It reads a LOOP.md (the standard format roadmap-to-loop writes) and runs each
// still-unfinished item in its OWN FRESH AGENT (fresh context per item — the entire reason this
// exists), sequentially, in the project repo. Each item is built to pass its own criteria, then
// independently verified, committed locally, and logged. It stops at human gates and never fakes
// a criterion.
//
// This is a Claude Code *workflow* script, run via the Workflow tool — NOT `node`:
//   Workflow({
//     scriptPath: "/Users/han1/idea-to-shipped/engine/loop-runner.mjs",
//     args: { loopPath: "/abs/path/to/PROJECT/LOOP.md", projectDir: "/abs/path/to/PROJECT", maxItems: 1 }
//   })
// projectDir defaults to the LOOP.md's folder. maxItems is optional — set it to 1 for a safe
// first run (do one item, watch it, then remove the cap).

export const meta = {
  name: 'loop-runner',
  description: 'General executor for any LOOP.md: parse it, then run each unfinished item with its own fresh agent (fresh context per item), independently verify, commit, log — sequentially in the project repo. Stops at human gates; never fakes a criterion.',
  phases: [
    { title: 'Parse', detail: 'read + parse the LOOP.md per LOOP-CONTRACT.md' },
    { title: 'Execute', detail: 'one fresh agent per unfinished item, then an independent verifier' },
  ],
}

if (!args || !args.loopPath) {
  throw new Error('loop-runner requires args.loopPath (absolute path to a LOOP.md)')
}
const loopPath = args.loopPath
const projectDir = args.projectDir || loopPath.replace(/\/[^/]*$/, '')

// ---------- Phase 1 — parse the LOOP.md into structured items / gates / boundaries ----------
phase('Parse')

const PARSED = {
  type: 'object',
  required: ['items', 'gates', 'boundaries'],
  properties: {
    items: {
      type: 'array',
      items: {
        type: 'object',
        required: ['title', 'criteria'],
        properties: {
          title: { type: 'string' },
          criteria: {
            type: 'array',
            items: {
              type: 'object',
              required: ['text', 'done', 'tiers'],
              properties: {
                text: { type: 'string' },
                done: { type: 'boolean' },
                tiers: { type: 'array', items: { enum: ['machine', 'verifier', 'human'] } },
              },
            },
          },
        },
      },
    },
    gates: { type: 'array', items: { type: 'string' } },
    boundaries: { type: 'array', items: { type: 'string' } },
  },
}

const parsed = await agent(
  `Read the file at ${loopPath}. It is a LOOP.md. Parse it by ROLE (headers vary in language):
- Work-queue section aliases: 工作队列 / Work queue. Global-gates aliases: 全局门槛 / Global gates / 全域 gate / 全局闸门. Boundaries aliases: 边界 / 邊界 / Boundaries.
- items = every "###" heading inside the Work-queue section ("### 1. ...", "### 阶段 0 ...", "### 14.5 ..." all count).
- For each item, criteria = every "- [ ]" / "- [x]" line under it, until the next "###" or "##". For each:
  - text: the check, with the 【...】 tag and trailing decorations (✅<sha>, [Codex #..], ★, ⏸) stripped.
  - done: true iff "[x]".
  - tiers: from the 【...】 tag — 机器/machine -> "machine", 评委/verifier -> "verifier", 本人/human -> "human"; a tag may list several (e.g. "评委/本人" -> ["verifier","human"]); an UNTAGGED criterion -> ["human"].
- gates = the "- [ ]"/"- [x]" lines under Global-gates (just their text).
- boundaries = the bullet lines under Boundaries (just their text).
Read only — build nothing. If the file doesn't look like a LOOP.md, return empty arrays.`,
  { label: 'parse-loop', phase: 'Parse', schema: PARSED }
)

if (!parsed) throw new Error('loop-runner: failed to parse the LOOP.md')

const pending = parsed.items.filter(it => it.criteria.some(c => !c.done))
log(`Parsed ${parsed.items.length} item(s); ${pending.length} still have open criteria.`)
if (!pending.length) {
  return { loop: loopPath, project: projectDir, ran: 0, note: 'Nothing to do — every item is fully checked.' }
}
const queue = args.maxItems ? pending.slice(0, args.maxItems) : pending
if (queue.length < pending.length) log(`maxItems=${args.maxItems}: running only the first ${queue.length}.`)

// ---------- Phase 2 — run each item sequentially, each in its OWN fresh agent ----------
phase('Execute')

// dual-review knob: how many INDEPENDENT verifiers must ALL confirm a 【verifier】 criterion
// (default 1; set args.verifiers:2 for the Han1_ai-style dual review). Sequential mode honors this;
// parallel-mode dual-review lands with parallel mode's first real run.
const verifiers = Math.max(1, Number(args.verifiers) || 1)

const BUILD = {
  type: 'object',
  required: ['summary', 'criteria', 'humanGatesHit', 'stuck'],
  properties: {
    summary: { type: 'string' },
    criteria: {
      type: 'array',
      items: {
        type: 'object',
        required: ['text', 'passed', 'how'],
        properties: { text: { type: 'string' }, passed: { type: 'boolean' }, how: { type: 'string' } },
      },
    },
    humanGatesHit: { type: 'array', items: { type: 'string' } },
    stuck: { type: 'boolean' },
  },
}
const VERDICT = {
  type: 'object',
  required: ['allConfirmed', 'findings'],
  properties: { allConfirmed: { type: 'boolean' }, findings: { type: 'array', items: { type: 'string' } } },
}

const gatesText = parsed.gates.length ? parsed.gates.join('\n- ') : '(none)'
const boundsText = parsed.boundaries.length ? parsed.boundaries.join('\n- ') : '(none)'

// ===== PARALLEL MODE — opt-in via args.parallel. Informed-v0: the guardrails below come from
// real failure data (Drawell's log: parallel worktrees collided on a shared OUTPUT dir and on
// shared SOURCE files), but this path has never run through the engine yet. The default below
// stays the validated sequential engine, untouched. =====
if (args.parallel) {
  phase('Plan')
  const WAVES = {
    type: 'object', required: ['waves'],
    properties: {
      waves: { type: 'array', items: { type: 'array', items: { type: 'integer' } } },
      notes: { type: 'string' },
    },
  }
  const planList = pending.map((it, i) =>
    `[${i}] ${it.title} :: ${it.criteria.filter(c => !c.done).map(c => c.text).join('  |  ')}`).join('\n')
  const plan = await agent(
    `Group these work items into ordered PARALLEL WAVES. Two items may share a wave ONLY if BOTH: ` +
    `(a) FILE-DISJOINT — predict the files each touches; they must not overlap; (b) INDEPENDENT — neither needs the other's output. ` +
    `Be CONSERVATIVE: if unsure, separate waves. Anything that edits SHARED files (registries, app shell, shared config, a test harness, shared docs) goes ALONE. ` +
    `Earlier waves are prerequisites for later ones.\nItems:\n${planList}\n` +
    `Return "waves": an ordered array of arrays of item indices; every index 0..${pending.length - 1} appears exactly once; a length-1 array runs alone.`,
    { label: 'plan-waves', phase: 'Plan', schema: WAVES },
  )
  const waves = (plan && Array.isArray(plan.waves) && plan.waves.length) ? plan.waves : pending.map((_, i) => [i])
  log(`Plan: ${pending.length} item(s) → ${waves.length} wave(s) (${waves.filter(w => w.length > 1).length} parallel).`)

  phase('Execute')
  const PBUILD = {
    type: 'object', required: ['ok', 'needsShared', 'branch', 'summary'],
    properties: {
      ok: { type: 'boolean' }, needsShared: { type: 'boolean' }, branch: { type: 'string' },
      filesTouched: { type: 'array', items: { type: 'string' } }, summary: { type: 'string' },
    },
  }
  const MERGE = {
    type: 'object', required: ['merged', 'needsSequential', 'verifierConfirmed', 'gatesPass'],
    properties: {
      merged: { type: 'array', items: { type: 'string' } },
      needsSequential: { type: 'array', items: { type: 'string' } },
      verifierConfirmed: { type: 'array', items: { type: 'string' } },
      gatesPass: { type: 'boolean' }, notes: { type: 'string' },
    },
  }
  const done = []
  let halted = false
  for (let w = 0; w < waves.length && !halted; w++) {
    const wave = waves[w].map(i => pending[i]).filter(Boolean)
    if (!wave.length) continue
    log(`Wave ${w + 1}/${waves.length}: ${wave.length} item(s)${wave.length > 1 ? ' in parallel worktrees' : ''}.`)

    const builds = await parallel(wave.map((item, k) => () => agent(
      `Build ONE item in ISOLATION. Project: ${projectDir}. You run CONCURRENTLY with sibling agents — obey strictly:
1. git -C "${projectDir}" worktree add "${projectDir}/.loopwt/w${w}_${k}" -b loop/w${w}/${k} HEAD ; do ALL work inside that worktree and commit there.
2. Edit ONLY files unique to THIS item. Do NOT touch shared files (registries, app shell, shared config, the test harness, shared docs). If passing your criteria REQUIRES editing a shared file, STOP: set needsShared=true, explain, commit nothing — this item is not safely parallel.
3. Send any test/build OUTPUT or scratch to a path unique to you (include "w${w}_${k}" or your PID) — NEVER a shared/timestamped dir a sibling could overwrite.
4. Respect RUBRIC.md if present. Confirm machine criteria with the project's REAL checks, run INSIDE your worktree. Try ~3x honestly; never fake or weaken a criterion.

ITEM: ${item.title}
Pass these: ${item.criteria.filter(c => !c.done && (c.tiers.includes('machine') || c.tiers.includes('verifier'))).map(c => c.text).join('  ||  ') || '(none)'}
NEVER do: ${boundsText}
Return ok, needsShared, branch (loop/w${w}/${k}), filesTouched, summary.`,
      { label: `build:w${w}.${k}:${item.title.slice(0, 16)}`, phase: 'Execute', schema: PBUILD },
    )))

    const okBranches = wave.map((item, k) => ({ title: item.title, branch: `loop/w${w}/${k}`, ok: !!builds[k] && builds[k].ok && !builds[k].needsShared }))
    const vcrit = wave.flatMap(it => it.criteria.filter(c => !c.done && c.tiers.includes('verifier')).map(c => `(${it.title}) ${c.text}`))
    const merge = await agent(
      `You are the serialized INTEGRATOR for ${projectDir}. You did NOT build any of this, so you are also the independent verifier. Work strictly IN ORDER, never concurrently:
A. Confirm you are on the base branch: git -C "${projectDir}" branch --show-current.
B. For each OK branch below, in order: git -C "${projectDir}" merge --no-ff <branch>. On CONFLICT → git -C "${projectDir}" merge --abort, add that item to needsSequential, move on (NEVER force). If a branch changed a shared file it shouldn't have, note it.
   OK branches: ${okBranches.filter(b => b.ok).map(b => `${b.branch} ("${b.title}")`).join(' ; ') || '(none)'}
C. Run the project's full checks / global gates on the merged tree → gatesPass. Gates: ${gatesText || '(none)'}.
D. As the independent verifier, try to REFUTE each 【verifier】 criterion below against the merged result; put in verifierConfirmed only the item titles whose verifier-criteria genuinely all hold:
   ${vcrit.join('\n   ') || '(none)'}
E. Clean up: git -C "${projectDir}" worktree remove --force each "${projectDir}/.loopwt/w${w}_*", and delete the merged loop/w${w}/* branches.
Return merged (titles merged clean), needsSequential (titles), verifierConfirmed (titles), gatesPass, notes.`,
      { label: `integrate:w${w}`, phase: 'Execute', schema: MERGE },
    )

    const merged = (merge && merge.merged) || []
    const vok = (merge && merge.verifierConfirmed) || []
    for (let k = 0; k < wave.length; k++) {
      const item = wave[k], b = builds[k]
      const hasV = item.criteria.some(c => !c.done && c.tiers.includes('verifier'))
      const ok = !!b && b.ok && !b.needsShared && merged.includes(item.title) && !!(merge && merge.gatesPass) && (!hasV || vok.includes(item.title))
      done.push({ item: item.title, ok, build: b })
      log(`${ok ? '✓' : '✗'} ${item.title}` +
          (b && b.needsShared ? ' (needs shared file → sequential)' : '') +
          (merge && merge.needsSequential && merge.needsSequential.includes(item.title) ? ' (merge conflict → sequential)' : ''))
    }
    if (!(merge && merge.gatesPass)) { halted = true; log(`Halting: wave ${w + 1} gates failed after merge — over to you.`); break }
    const recordTitles = wave.filter((it, k) => done[done.length - wave.length + k].ok).map(it => it.title)
    if (recordTitles.length) await agent(
      `In the LOOP.md at ${loopPath}, for these items tick their passed criteria "- [ ]" → "- [x]" (leave 【本人/human】 unchecked): ${recordTitles.join(' ; ')}. Append one Log line per item ("<run \`date +%F\`> / <item> / done (parallel wave ${w + 1})"). Commit ONLY the LOOP.md (message "loop: wave ${w + 1} done"); never push; touch nothing else.`,
      { label: `record:w${w}`, phase: 'Execute' },
    )
    const fellBack = wave.filter((it, k) => (builds[k] && builds[k].needsShared) || (merge && merge.needsSequential && merge.needsSequential.includes(it.title)))
    if (fellBack.length) log(`Fell back (re-run these in sequential mode): ${fellBack.map(i => i.title).join(' ; ')}`)
  }
  return { loop: loopPath, project: projectDir, mode: 'parallel', waves: waves.length, ran: done.length, passed: done.filter(d => d.ok).length, results: done }
}

const done = []

for (let i = 0; i < queue.length; i++) {
  const item = queue[i]
  const open = item.criteria.filter(c => !c.done)
  const buildable = open.filter(c => c.tiers.includes('machine') || c.tiers.includes('verifier'))
  const humanOnly = open.filter(c => c.tiers.length === 1 && c.tiers[0] === 'human')

  // fresh agent, fresh context — builds ONLY this item, in the real project repo
  const build = await agent(
    `Build ONE item to verifiable completion. Project repo: ${projectDir}

ITEM: ${item.title}

Definition of done — make every criterion below PASS, and nothing beyond them:
${buildable.map(c => `- (${c.tiers.join('+')}) ${c.text}`).join('\n') || '(no machine/verifier criteria on this item — see human gates below)'}

Global gates that must ALSO still hold afterward:
- ${gatesText}

Boundaries — NEVER do these:
- ${boundsText}

Rules:
- If a RUBRIC.md exists in the project, load it and respect every rule.
- Confirm machine criteria by running the project's REAL checks (build / test / lint) — don't self-declare.
- Loop until the criteria pass, or you've honestly tried ~3 times; if still stuck, set stuck=true and explain. NEVER weaken, skip, or reinterpret a criterion to claim victory.
- Commit locally as you go; NEVER push.
- Human-only criteria — do NOT attempt or fake them. List them in humanGatesHit and stop short:
  ${humanOnly.map(c => c.text).join(' | ') || '(none)'}`,
    { label: `build:${item.title.slice(0, 28)}`, phase: 'Execute', schema: BUILD },
  )

  // independent verifier(s) — DIFFERENT fresh agents that did not build. With verifiers>1 this is
  // dual-review (Han1_ai practice): N independent reviewers, each a distinct lens, ALL must confirm.
  const vcrit = open.filter(c => c.tiers.includes('verifier'))
  let verdict = null
  if (build && !build.stuck && vcrit.length) {
    const lenses = [
      'correctness — does it truly do what each criterion says',
      'robustness — edge cases, failure paths, silently-swallowed errors',
      'evidence — each claim backed by something runnable, not just asserted',
    ]
    const verdicts = await parallel(Array.from({ length: verifiers }, (_, vi) => () => agent(
      `You are INDEPENDENT verifier ${vi + 1}/${verifiers}. You did NOT build this. Try to REFUTE that item "${item.title}" is done${verifiers > 1 ? ` — your lens: ${lenses[vi % lenses.length]}` : ''}.
Inspect the real diff / artifacts in ${projectDir}. For each criterion, hunt for faults; default to NOT-passed if unsure:
${vcrit.map(c => `- ${c.text}`).join('\n')}
Return allConfirmed=true ONLY if every one genuinely holds, plus findings.`,
      { label: `verify${verifiers > 1 ? ` ${vi + 1}/${verifiers}` : ''}:${item.title.slice(0, 22)}`, phase: 'Execute', schema: VERDICT },
    )))
    const got = verdicts.filter(Boolean)
    // conservative AND-gate: every reviewer must have run AND confirmed
    verdict = { allConfirmed: got.length === verifiers && got.every(v => v.allConfirmed), findings: got.flatMap(v => v.findings || []) }
  }

  const ok = !!build && !build.stuck && build.criteria.every(c => c.passed) && (!verdict || verdict.allConfirmed)
  done.push({ item: item.title, ok, build, verdict, humanGates: (build && build.humanGatesHit) || [] })
  log(`${ok ? '✓' : '✗'} ${item.title}` +
      `${build && build.stuck ? ' — stuck, needs you' : ''}` +
      `${verdict && !verdict.allConfirmed ? ' — verifier refuted' : ''}`)

  if (ok) {
    // Persist progress INTO the LOOP.md so a disconnect/crash is recoverable: on restart the engine
    // re-parses, sees the ticked criteria, and skips them. (The build agent already committed the
    // code; this records it in the ledger too — code first, ledger second, so a crash in between
    // just makes the item re-run and find itself already done.)
    await agent(
      `In the LOOP.md at ${loopPath}, find the item titled "${item.title}". Change the criteria that ` +
      `passed this round from "- [ ]" to "- [x]", but LEAVE any 【本人/human】 criterion unchecked ` +
      `(it still needs the owner). Then append one line under the Log section in the form ` +
      `"<TODAY> / ${item.title} / done / <one line on what was done>", where <TODAY> is the output of ` +
      `running \`date +%F\`. Commit ONLY the LOOP.md change locally (message "loop: ${item.title} done"); ` +
      `never push; touch nothing else.`,
      { label: `record:${item.title.slice(0, 22)}`, phase: 'Execute' },
    )
  } else {
    log(`Halting: "${item.title}" did not pass cleanly. Per protocol the loop stops rather than push forward on a shaky item — over to you.`)
    break
  }
}

return {
  loop: loopPath,
  project: projectDir,
  ran: done.length,
  passed: done.filter(d => d.ok).length,
  results: done,
  humanGates: done.flatMap(d => d.humanGates),
}
