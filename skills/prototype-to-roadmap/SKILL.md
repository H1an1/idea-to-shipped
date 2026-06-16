---
name: prototype-to-roadmap
description: >
  Turn a firmed-up concept from idea-to-prototype (the picture the owner has stopped saying "no" to,
  plus its RUBRIC.md of captured taste rules) into a prioritized roadmap that roadmap-to-loop can
  consume. Slices the validated concept into the smallest shippable increments, orders them
  (surfacing the order as a proposal, never deciding scope silently), and wires every captured taste
  rule into the roadmap as a global gate or a per-item criterion seed so settled taste enters the
  loop as 【verifier】 checks rather than 【human】 stops. Use right after idea-to-prototype reaches
  "firm" and before roadmap-to-loop. Do NOT re-mine or re-prototype — the picture is already stable;
  this only slices, sequences, and loads the rules.
---

# Prototype to Roadmap

The seam between a validated concept and an executable plan. Its input is something the owner has
*stopped reacting against* — the picture is firm, the taste is (largely) surfaced and written into
`RUBRIC.md`. Its output is a roadmap in the shape roadmap-to-loop expects: prioritized items, each
carrying the owner's intent, with the captured rules already wired in.

This is a thin, mostly-mechanical transformation. The heavy lifting — scanning the repo for
feedback signals, writing acceptance criteria — is roadmap-to-loop's job, not yours. Don't
duplicate it. Your two jobs are **slice** and **load**.

## Step 1 — Confirm the input is actually firm

Don't start from a vague idea — that's idea-to-prototype's job, and starting here would mean
slicing a guess. Confirm:
- The concept came back from idea-to-prototype as "firm" (reactions were confirmations + one-off
  tweaks, no new standing-preference revelations).
- A `RUBRIC.md` exists with the rules captured so far.

If either is missing, stop and send it back to idea-to-prototype. Slicing an un-firmed concept just
sequences the wrong thing neatly.

## Step 2 — Slice into the smallest shippable increments

Break the one firmed concept into the fewest, smallest pieces that can each be built and judged on
their own. Bias to a thin first slice that makes the core thing real, then layers.

- Quote the owner's intent for each slice in their words (same as roadmap-to-loop expects).
- Prefer "one observable thing works end to end" over "a layer is built" — a slice should be
  demoable, not architectural.

## Step 3 — Order, and surface the order as a proposal

Propose a sequence (MVP-first, or riskiest-unknown-first — pick one, say which and why). **Never
decide scope or order silently** — present the ordering as your proposal for the owner to rule on,
exactly the way roadmap-to-loop surfaces decisions. The first slice is a taste call; offer it,
don't impose it.

## Step 4 — Load the RUBRIC.md rules into the roadmap

Walk every rule in `RUBRIC.md` and place it:
- **Standing principle** (applies everywhere, e.g. "destructive actions always confirm") → a
  **global gate** for roadmap-to-loop, checked on every item.
- **Item-specific** (about one feature) → a **criterion seed** attached to that slice.
- Carry each rule's `revealed`/`known` tag and provenance through — lose nothing.

This is the whole point of the seam: the taste the owner already revealed enters the loop as
pre-written 【verifier】 criteria, so roadmap-to-loop doesn't re-ask what's already settled.

## Step 5 — Hand to roadmap-to-loop

Emit the roadmap (prioritized slices + owner intent + the loaded gates/criteria-seeds) in plain
product language, and hand to `roadmap-to-loop`, which scans for signals and turns each slice into
fully-tagged acceptance criteria. Keep `RUBRIC.md` alongside — it stays the project's living taste
record through the loop and beyond.

## Example

idea-to-prototype firmed this up:

> "A review screen that surfaces ONE clip as 'today's', never a backlog."

…with `RUBRIC.md` holding:
```
- [revealed] One clip is surfaced as "today's", never a backlog. — from: "I want one clip waiting for me, not a backlog" (prototype)
- [known] Never lose the owner's place if they close mid-review. — from: "where did it go when I came back?" (prototype)
```

Becomes a roadmap:
```markdown
### 1. Today's-clip review screen  (MVP slice)
**Owner's intent**: open the app, see one clip waiting for me, replay it.
- seed: surfaces exactly one clip as "today's", never a list 【from RUBRIC: revealed】

### 2. Resume where I left off
**Owner's intent**: if I close mid-review, I come back to the same place.
- seed: place is preserved across close/reopen 【from RUBRIC: known】
```
…plus a global gate lifted from the standing rule, handed to roadmap-to-loop to finish into
tagged criteria.

## Boundaries

- Never re-mine or re-prototype — if the picture isn't firm, it goes back, it doesn't get sliced.
- Never decide the slice or the order silently — propose, let the owner rule.
- Never drop a RUBRIC.md rule on the floor — every rule lands as a gate or a seed.
- Don't write the acceptance criteria yourself — that's roadmap-to-loop's job; you seed, it writes.
- This is v0. The slicing heuristics (how thin is too thin, MVP-first vs risk-first) get tuned by
  watching real roadmaps run — expect to react and adjust.
