# Idea to Shipped — a taste-driven build pipeline

A package of five skills that take a half-formed idea all the way to a self-running build — without
asking you to write a spec, and without losing the parts of "what you want" that you can only
recognize once you see them.

It's built on one fact about how you actually work: **your taste shows up when you react to
something concrete, not when you're asked to describe it in advance.** So the pipeline never makes
you specify everything up front. It makes you *react*, and it writes down what your reactions reveal.

## The pipeline

```
 idea
   ↓
 1. idea-to-prototype     → an ugly, fast mock-up to react to. You say "no, not that"; it learns.
   ↓
 2. prototype-to-roadmap  → once the picture's firm, it slices it into a buildable, ordered plan.
   ↓
 3. roadmap-to-loop       → turns the plan into LOOP.md: what "done" means, and who checks it.
   ↓
 4. loop-to-goal          → the agent writes its own goals and builds, unattended, checking itself
                            against your criteria, stopping only when it needs your eye.
   ↓
 shipped

 taste-to-rubric          → runs underneath all of it. Every time you react to something — the first
                            mock-up, a mid-build check, final sign-off — it captures the preference
                            into RUBRIC.md so nobody has to ask you twice.
```

## RUBRIC.md — your taste, written down

Each project grows one file, `RUBRIC.md`. Every "no, not that" that turns out to be a *standing*
preference (not a one-off tweak) gets distilled into one checkable line. Over a project it becomes
the rulebook the agent checks itself against. Over many projects, those rulebooks can be compared to
distill the constants of your taste — but that's later, once a few exist.

## How to use it

You don't pick a stage. Just say what you want — "I want something that…" — and the front door
(`idea-to-shipped`) figures out where you are and starts you at the right place. A vague idea starts
at the mock-up; if you already have a firm concept or a plan, it jumps in further down.

Your job, start to end, is small and only yours: **react** (at the first mock-up) and **judge** (at
the gates the agent stops you for). Everything in between is the machine's.

## What's intentionally not built yet

- The cross-project master rubric (needs several projects' RUBRIC.md to compare).
- Auto-loading rules back in / scoring — its shape will reveal itself once real rules pile up.

These come with mileage, not design. Run the pipeline on real things first; the next pieces will
show you their shape.

## The skills in this package

| Skill | What it does |
|---|---|
| **idea-to-shipped** | the front door — routes you to the right stage |
| **idea-to-prototype** | vague idea → cheapest rough prototype that provokes your taste |
| **prototype-to-roadmap** | firm concept → sliced, ordered roadmap with your rules loaded in |
| **roadmap-to-loop** | roadmap → LOOP.md with criteria tagged machine / verifier / you |
| **loop-to-goal** | LOOP.md → unattended build that writes its own goals and verifies itself |
| **taste-to-rubric** | any reaction, anywhere → a written rule in RUBRIC.md |
