---
name: idea-to-shipped
description: >
  Front door and router for the taste-driven build pipeline (idea-to-prototype → prototype-to-roadmap
  → roadmap-to-loop → loop-to-goal, with taste-to-rubric capturing taste throughout). Use when the
  owner wants to build, make, or ship something and you need to enter the pipeline at the right stage
  — a vague idea starts at the front; an already-firm concept, an existing roadmap, or an existing
  LOOP.md enters later. Also use to explain or run "the pipeline / the build loop / my dev process"
  as one system. It dispatches to the member skills; it does not do their work. Its job is to start
  at the correct stage (never skip the front on a vague idea), keep RUBRIC.md flowing through every
  stage, and protect the principles the pipeline is built on.
---

# Idea to Shipped — the pipeline front door

The router for a five-skill pipeline that takes a half-formed idea all the way to a self-running
build that converges on the owner's taste. It does not implement any stage — it picks the right
stage to enter and hands off.

```
 idea
   │
   ▼
 idea-to-prototype     ugly-fast prototype → provoke "no, not that" → capture rules
   │  firm concept + RUBRIC.md
   ▼
 prototype-to-roadmap  slice into shippable increments, load RUBRIC.md as gates/seeds
   │  roadmap
   ▼
 roadmap-to-loop       write LOOP.md with criteria tagged 机器 / 评委 / 本人
   │  LOOP.md
   ▼
 loop-to-goal          agent writes its own goal from criteria, builds, independent verify
   │
   ▼
 shipped

 taste-to-rubric  —  cross-cutting: every time the owner reacts to anything concrete,
                     capture it into the project's RUBRIC.md (front prototype, every 本人
                     stop, acceptance). The taste record that flows through all stages.
```

## Route to the right stage (do not skip the front)

Look at what already exists, and enter there:

| What the owner has now | Enter at |
|---|---|
| A vague idea, a feeling, "I want something that…" | **idea-to-prototype** |
| A concept they've stopped saying "no" to, + a RUBRIC.md | **prototype-to-roadmap** |
| A prioritized roadmap of items, no LOOP.md | **roadmap-to-loop** |
| A LOOP.md ready to run | **loop-to-goal** |
| The owner reacting to any concrete artifact, at any time | **taste-to-rubric** (alongside) |

The one rule that matters: **on a vague idea, you MUST start at idea-to-prototype.** Jumping
straight to roadmap-to-loop because an idea "sounds clear enough" is the waterfall trap — you'd
build a confident guess and find out it's wrong at the end. If in doubt about firmness, you are not
firm: start at the front.

## The contract: RUBRIC.md

Every project has one `RUBRIC.md`, created on the first captured reaction and appended to forever.
It is the project's living taste, in checkable form. Each stage reads it (to respect settled taste)
and writes to it (via taste-to-rubric, whenever the owner reacts). It is the single thread that
makes the whole pipeline converge on what the owner actually wants. Never let a stage run without
it; never let a reaction go uncaptured.

## Principles this pipeline is built on (protect them)

- **Taste is revealed on contact, not specified up front.** Prototype to provoke it; don't mine it
  all cold. The owner reacting to a rough thing is the engine, not a formality.
- **The human is never removed from the loop, only promoted up it.** Their irreducible job is taste
  — reacting at the front and at 【本人】 gates. Everything below taste gets automated.
- **Automate the taste-free middle; instrument the taste-heavy ends.** loop-to-goal runs hard and
  unattended; the front and the gates exist to capture taste cheaply.
- **Context rots and self-evaluation is unreliable** — so isolate each item's context, and let an
  independent verifier judge, never the implementer. Don't defeat these.

## What this front door does NOT do

- It doesn't implement any stage — it dispatches. Each member skill owns its own work.
- It doesn't build the cross-project master rubric (a later pass over many RUBRIC.md files, gated on
  several existing) or any auto-load/scoring machinery (shape revealed by real runs).

## Boundaries

- Never skip the front on a vague idea. When unsure of firmness, start at idea-to-prototype.
- Never run a stage without its RUBRIC.md in the loop.
- Never let the front door make a taste call itself — surface it to the owner. That is the one thing
  the whole pipeline exists to keep in human hands.
