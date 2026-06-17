// loop-runner — the general execution engine behind loop-to-goal.
//
// One engine, any project. It reads a LOOP.md (per ../LOOP-CONTRACT.md) and runs each
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

  // independent verifier — a DIFFERENT fresh agent that did not build — only if there are verifier criteria
  const vcrit = open.filter(c => c.tiers.includes('verifier'))
  let verdict = null
  if (build && !build.stuck && vcrit.length) {
    verdict = await agent(
      `You are an INDEPENDENT verifier. You did NOT build this. Try to REFUTE that item "${item.title}" is done.
Inspect the real diff / artifacts in ${projectDir}. For each criterion, hunt for faults; default to NOT-passed if unsure:
${vcrit.map(c => `- ${c.text}`).join('\n')}
Return allConfirmed=true ONLY if every one genuinely holds, plus findings.`,
      { label: `verify:${item.title.slice(0, 28)}`, phase: 'Execute', schema: VERDICT },
    )
  }

  const ok = !!build && !build.stuck && build.criteria.every(c => c.passed) && (!verdict || verdict.allConfirmed)
  done.push({ item: item.title, ok, build, verdict, humanGates: (build && build.humanGatesHit) || [] })
  log(`${ok ? '✓' : '✗'} ${item.title}` +
      `${build && build.stuck ? ' — stuck, needs you' : ''}` +
      `${verdict && !verdict.allConfirmed ? ' — verifier refuted' : ''}`)

  if (!ok) {
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
