---
name: roadmap-to-loop
description: >
  Convert a product roadmap, backlog, feature wishlist, or TODO list into an executable
  LOOP.md that drives autonomous agent iteration (loop engineering). The user writes what
  they want in plain product language; this skill scans the project for feedback signals
  (tests, CI, QA scripts), translates each roadmap item into observable acceptance
  criteria tagged by judge (machine / verifier subagent / human), and writes the loop
  file with global gates, boundaries, a run protocol, and a log. Use this whenever the
  user shares a roadmap, plan, or wishlist and wants a loop, rubric, acceptance criteria,
  a /goal setup, or "something Claude can work through on its own" — even if they only
  say "write me a loop" or "turn my roadmap into tasks you can run unattended".
  Especially valuable when the user is a non-coder describing features in product terms.
---

# Roadmap to Loop

Turn a product roadmap written in plain product language into `LOOP.md` — a single
self-contained file that an autonomous agent loop can execute: work queue, acceptance
criteria, global quality gates, boundaries, a run protocol, and a log.

The person giving you the roadmap may not code. They are the product owner: they know
what they want and why, but not how to verify it mechanically. Your job is the
translation layer:

> "I want X" → "When X is done, here is what anyone could observe" → "and here is who checks each observation"

A loop is only as good as its feedback signals. Most of the work below is finding or
creating those signals — writing the file itself is the easy part.

## Step 1 — Read the roadmap, choose the loop's scope

- Identify the actionable horizon (the "soon" / near-term / highest-priority section)
  and loop ONLY that. Mid/long-term items go into Boundaries as explicitly out of
  scope — unattended agents love to do "just one more thing".
- Sections like "known limitations", "working agreements", "key fixes / postmortems"
  are gold: they become global gates and boundaries (Step 4), not queue items.
- If the roadmap has no priorities, propose an order and flag it as your proposal in
  the handoff rather than presenting it as the owner's.

## Step 2 — Scan the project for feedback signals

Before writing any criteria, find out what can actually be verified in this repo:

- Check commands: package.json scripts, Makefile, pyproject, CI workflow files
- QA infrastructure: Playwright/screenshot scripts, smoke tests, visual regression,
  lint, typecheck
- Reference artifacts: ref images, fixtures, golden files, design specs
- Baselines worth pinning: test count, coverage thresholds — record the actual numbers

Cite the real commands you found; never invent a `npm run ci` that doesn't exist.

If the project has **no automated signals at all**, say so honestly and make the FIRST
queue item "establish a minimal feedback signal" (e.g. one smoke script that proves the
app still starts and renders). Do not write a loop that pretends to verify — an
unattended loop without verification is just unattended mistakes.

## Step 3 — Translate each roadmap item into acceptance criteria

For each item, keep the owner's voice: quote one line of their product intent first.
Then write 2–5 criteria. Each criterion must be:

1. **Observable** — a visible phenomenon, not a feeling.
   ("loads fast" ✗ → "first sentence appears within 10s of pasting a link" ✓)
2. **Decidable** — answerable yes/no.
3. **Tagged with its judge**:
   - 【机器】/【machine】 — checkable by tests or scripts. Most reliable; prefer it.
   - 【评委】/【verifier】 — an independent subagent that did NOT implement the change
     judges screenshots/diffs/copy, ideally against a reference artifact. Its job is to
     find faults, not to confirm success.
   - 【本人】/【human】 — only the owner can judge: taste calls, real devices, real
     accounts, providing materials (recordings, VPN toggling). These are explicit STOP
     points in the loop.

Translation rules that matter:

- **Subjective goals get a referee and a reference, not false objectivity.**
  "make it spookier" → "verifier compares new screenshots side-by-side against
  ref/night-ref-1.jpg, scores ≥7/10, and lists every difference it sees". Pair the
  verifier score with a final 【human】 sign-off — never pretend a number alone
  captures taste.
- **Every user-visible item gets a "nothing else broke" criterion** wired to the
  project's full check command from Step 2.
- **Surface product decisions; never make them silently.** If implementing an item
  forces a choice the roadmap doesn't answer (what happens to old data? where does the
  button live?), write the criterion as "a confirm dialog explains what will happen"
  and/or raise the question in the handoff. Silent decisions are how loops drift away
  from their owners.
- **Unreproducible bugs become investigation items**, not fix items: the first
  criterion is "a reliable reproduction exists (script or recorded steps)" — you can't
  verify a fix for something you can't reproduce.
- **Items needing owner-provided materials** (recordings, devices, accounts) start
  with a 【human】 prerequisite criterion, so the loop can schedule around them
  instead of stalling on them.

## Step 4 — Global gates and boundaries

**Global gates** (checked every round, for every item):
- The project's full check command passes — cite the real command
- Pinned baselines never regress (e.g. "test count ≥ N; update N as it grows")
- The owner's standing principles lifted from the roadmap (e.g. "provider failures
  must be visible, never silent")

**Boundaries** (what the loop must NOT do):
- Out-of-scope horizons, named explicitly
- Known past regressions never to reintroduce (from "key fixes" sections)
- Untouchables: secrets, schema/data migrations without a logged proposal first,
  pushing/publishing, core algorithm constants
- Anything the owner said "later" about

## Step 5 — Write LOOP.md

Write it **in the same language as the roadmap**. Place it next to the roadmap
(normally the project root). If a LOOP.md already exists, read it first and update it —
preserve its log; never clobber history.

Skeleton (section names in the roadmap's language):

```markdown
# LOOP — <project>: <scope name>
> Source: <roadmap path>. This file is the loop's single source of truth.

## Purpose            — why, in the owner's words
## Protocol           — how each round runs (see required mechanics below)
## Global gates       — from Step 4
## Work queue         — items in priority order: checkbox + owner's intent + criteria
## Boundaries         — from Step 4
## Log                — seeded with a creation entry
```

The protocol must include these mechanics — they are what make the loop safe to leave
alone:

1. Take the FIRST unchecked item; work in an isolated worktree.
2. Pass all 【machine】 criteria, then have an independent verifier subagent judge the
   【verifier】 criteria (give it the artifacts and references, brief it to find faults).
3. All pass → check the box, append a log entry, commit locally (don't push).
4. On hitting a 【human】 criterion → stop, state plainly what the owner must do or
   look at, and wait.
5. Any criterion failing 3 rounds in a row → stop and ask. Never bypass, weaken, or
   reinterpret a criterion to get unstuck.

Seed the log with one entry: date, pinned baselines, and the entry format
(date / item / what was tried / result / rule distilled). Log entries should distill
rules, not just record events — "X failed" is worth little; "X failed because Y, so
from now on Z" compounds across rounds.

## Step 6 — Hand off to the owner

End your reply by telling the owner, in plain language:

- **Their checkpoints**: list every 【human】 item — that's the part only they can do
- **Decisions you surfaced** instead of making — ask them to rule before the first run
- **How to start**: the one-line `/goal` invocation (work one item until its criteria
  pass) and the `/loop` variant (keep taking items)
- Invite them to red-pencil: "If any 'done means' line doesn't match what's in your
  head, fixing it now is far cheaper than after a run."

## Example transformation

Roadmap item (owner's words):

> "Re-ingest button: old clips were split with the old logic, I want to re-fetch them
> with one click instead of delete-and-re-add."

Becomes:

```markdown
### 2. Library card Re-ingest button
**Owner's intent**: re-fetch old clips with the current splitting logic, one click,
no delete-and-re-add.
- [ ] Card shows a Re-ingest button; clicking re-fetches with current logic 【machine: e2e】
- [ ] Confirm dialog explains in plain words what will change and what happens to
      practice history 【verifier: copy + screenshot】
- [ ] A failed re-fetch leaves the original clip intact, with a clear error 【machine: failure-path test】
- [ ] Owner re-ingests one real old clip and accepts the result 【human】
```

Note what happened: "what happens to practice history" was an unanswered product
decision — it became a visible dialog plus a handoff question, not a silent choice.
