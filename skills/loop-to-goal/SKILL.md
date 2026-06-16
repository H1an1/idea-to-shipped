---
name: loop-to-goal
description: >
  The executor that drives a LOOP.md authored by roadmap-to-loop. Reads the loop, takes the first
  unchecked item, writes a concrete development goal for it derived from that item's acceptance
  criteria, builds it in an isolated context, verifies with the machine + independent-verifier
  tiers, checks it off and logs, and continues — stopping at every 【human】 gate (where it captures
  the owner's reaction via taste-to-rubric). This is the "agent writes its own goal" / auto-goal
  pattern, but leashed: the goal is pinned to owner-authored criteria so it cannot drift. It is the
  skill behind the /goal (one item) and /loop (keep taking items) runners. Use to actually run an
  existing LOOP.md unattended. The lowest-taste, most mechanical piece of the pipeline — it executes
  the plan, it does not decide what is good.
---

# Loop to Goal

The engine that turns a static `LOOP.md` into autonomous iteration. roadmap-to-loop *authored* the
loop (queue, criteria, protocol); loop-to-goal *runs* it. The protocol lives in `LOOP.md` and is
the single source of truth — **follow it, never re-invent or override it.**

This is the "auto-goal" move — the agent writing its own development goal — but tamed. The goal is
not invented freely; it is **derived from the item's acceptance criteria**. The criteria are the
goal's definition of done. That leash is what stops a long-running agent from drifting, flattering
itself, or wandering off the owner's intent: it cannot declare success except by passing checks it
did not write.

## Why this architecture exists (don't defeat it)

Every mechanic below exists to dodge two physical constraints. Keep them in view:
- **Context rots over a long run** → each item is built in a fresh, isolated context / worktree, not
  one ballooning session.
- **A model's judgment of its own work is not trustworthy** → the thing that judges is never the
  thing that built. Verification is independent, by design.

If you ever reuse one context across many items, or let the implementer grade itself, you've
defeated the whole point.

## The run loop

For each round:

1. **Take the first unchecked item** from `LOOP.md`. Work in an isolated worktree / clean context.
2. **Write the goal.** Turn the item's criteria into one concrete, bounded development goal: "make
   <the item's observable behavior> real, such that every 【machine】 and 【verifier】 criterion on
   it passes." Load the project's `RUBRIC.md` first so the goal respects already-settled taste.
   Nothing in the goal may exceed the item's criteria — no scope it didn't ask for.
3. **Build** to that goal.
4. **Verify in tiers:**
   - Pass all 【machine】 criteria (tests / scripts) first — cheapest and most reliable.
   - Then dispatch an **independent 【verifier】 subagent** that did NOT implement the change. Give
     it the artifacts, the references, and the criteria; brief it to **find faults, not confirm
     success**. Use it for the taste-adjacent criteria seeded from `RUBRIC.md`.
5. **All pass** → check the box, append a log entry (date / item / what was tried / result / rule
   distilled), commit locally. Do not push.
6. **Hit a 【human】 gate** → stop. State plainly what the owner must do or look at. When they react,
   run it through **taste-to-rubric**: append any standing preference to `RUBRIC.md`, and where
   checkable, have roadmap-to-loop promote it to a 【verifier】 criterion so the gate stops needing
   them next time.
7. **Any criterion fails 3 rounds running** → stop and ask. **Never** weaken, bypass, or reinterpret
   a criterion to get unstuck. A criterion you can't pass honestly is information for the owner, not
   an obstacle to route around.

`/goal` runs this loop for a single item until its criteria pass; `/loop` keeps taking the next item
until it hits a 【human】 gate or the queue is done.

## Calibration knobs (tune from real runs, not up front)

These have no correct value in the abstract — set them by watching real loops:
- How finely to decompose one item's goal before building.
- How many independent verifier passes a taste-adjacent criterion needs before you trust a pass.
- When to escalate to the owner early instead of burning the full 3-strike budget.

Start simple (one goal per item, one verifier pass, full 3 strikes) and adjust as real runs show
where it's too loose or too eager.

## Boundaries

- The protocol in `LOOP.md` is law — follow it, don't override it.
- The implementer never grades itself — verification is always independent.
- Never weaken, skip, or reinterpret a criterion to make progress.
- Never push, publish, or touch anything `LOOP.md`'s boundaries mark off-limits.
- Never walk through a 【human】 gate unattended — stop, wait, and capture what comes back.
- Remember what this skill is: the taste-free executor. It runs the plan well; it never decides what
  "good" is. That decision lives upstream, with the owner and the `RUBRIC.md`.
