---
name: loop-to-goal
description: >
  Launcher for executing a LOOP.md. Use whenever the owner wants to run or execute a loop, work
  through a LOOP.md item by item, "run my loop", "start the build loop", or autonomously develop the
  items in an existing LOOP.md. It does NOT do the work itself — it fires the loop-runner engine (a
  workflow that runs each item in its own fresh agent, verifies independently, commits locally, and
  stops at 【human】 gates). The execute stage of the idea-to-shipped pipeline, after roadmap-to-loop.
---

# Loop to Goal — the launcher

This skill is just the doorbell. The actual work lives in the **loop-runner engine** — a Claude Code
workflow at `<your idea-to-shipped>/engine/loop-runner.mjs` (on this machine:
`/Users/han1/idea-to-shipped/engine/loop-runner.mjs`). Do not re-implement the run logic here, and
do not grind a LOOP.md by hand in one context — that throws away the engine's whole point: a fresh
context per item.

## To run a LOOP.md — fire the engine via the Workflow tool

```
Workflow({
  scriptPath: "/Users/han1/idea-to-shipped/engine/loop-runner.mjs",
  args: {
    loopPath:   "<abs path to the project's LOOP.md>",
    projectDir: "<abs path to the project repo>",   // optional — defaults to the LOOP.md's folder
    maxItems:   1                                    // FIRST run only: do one item, let the owner watch
  }
})
```

- **First time on any loop, set `maxItems: 1`** — run one item, show the owner, confirm it behaved,
  then re-run without the cap to grind the rest.
- The engine does everything else: per item it derives a goal from that item's criteria, builds in a
  fresh agent, runs the machine checks, has an **independent** verifier try to refute the 【verifier】
  criteria, commits locally (never pushes), and **stops at 【human】 gates or a stuck item** — handing
  back to the owner. It never fakes or weakens a criterion.

## Before launching

- The project must be a git repo (the engine commits per item).
- The LOOP.md must follow the format roadmap-to-loop produces (sections by role; items = `###`;
  criteria = `- [ ]` with 【机器/评委/本人】 tiers). If it won't parse, fix the LOOP.md, not the engine.

## What this skill is NOT

Not the executor — `loop-runner.mjs` is. Not the place to describe the run protocol — that lives in
the engine. This is only the trigger that launches the engine with the right args.
