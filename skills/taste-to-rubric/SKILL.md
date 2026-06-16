---
name: taste-to-rubric
description: >
  The canonical taste-capture procedure for the build pipeline. Whenever the owner reacts to a
  concrete artifact anywhere in the process — a rough prototype, an intermediate build, a 【本人】
  stop in a loop, a final acceptance — this turns that reaction into a written, checkable rule and
  records it in the project's RUBRIC.md, so taste is captured completely and consistently from the
  front of the pipeline to the back, not just at idea time. Other skills (idea-to-prototype,
  roadmap-to-loop) call this rather than each reinventing capture. Use whenever an owner says
  "no, not that" or "yes, like this" about something concrete and the preference should be
  remembered. Does NOT cover distilling the cross-project master rubric — that is a later pass over
  many projects' RUBRIC.md files, gated on several existing.
---

# Taste to Rubric

The single place the pipeline turns a reaction into a rule. Taste is revealed on contact: every
time the owner sees a concrete thing and reacts, a piece of their tacit standard surfaces. This
skill's only job is to catch that piece before it evaporates and write it where it will be reused.

It is called from **every stage that shows the owner something** — capturing only at the front
leaks every preference revealed later:

- **idea-to-prototype** — reactions to the rough cut (front of the pipeline)
- **roadmap-to-loop** — every 【本人】 stop, and final acceptance (the back of the pipeline)
- **loop-to-goal** — any mid-build checkpoint the owner judges (future)

This is a file plus one shared rule, not a system. Any skill runs it inline; it lives here so all
of them run it the same way.

## The carrier: RUBRIC.md (one per project)

Each project owns a `RUBRIC.md`, created on the first capture and appended to forever after. It is
the project's accumulated taste, in checkable form. Minimal format:

```markdown
# RUBRIC — <project>
> Taste rules distilled from the owner's reactions. Each line was a "no, not that" that generalized.

- [revealed] One clip is surfaced as "today's", never a backlog. — from: "I want one clip waiting for me, not a backlog" (prototype, 2026-06-16)
- [known] Destructive actions always confirm first. — from: "wait, that deleted without asking" (本人 stop, 2026-06-17)
```

- **type** — `revealed` (owner only knew it on sight — the majority) or `known` (could have been
  said up front). Tagging this is how you learn, over projects, how much is genuinely un-mineable.
- **the rule** — one line, phrased so someone *else* (a 【评委】 subagent) could check it. If you
  can't phrase it checkably yet, write it anyway and mark it `(本人-only)` — it's still a real rule.
- **provenance** — the actual reaction it came from, and where in the pipeline. This is what later
  lets a cross-project pass diff rules and distill the master rubric.

## The procedure (this IS taste-to-rubric)

For each owner reaction to a concrete artifact:

1. **Gate it.** One-off ("move that button left") → just apply it, do not record. Standing
   preference ("I always want X") → continue.
2. **Distill** the standing preference into one checkable line.
3. **Append** it to the project's `RUBRIC.md` with its type and provenance.
4. **Aim to graduate it.** Phrase it so a 【评委】 subagent could judge it. A rule that starts as a
   【本人】 stop ("only the owner can tell") should, once captured, become a 【评委】 criterion next
   round — that is how the loop stops needing the owner for that fork. Moving rules from 本人 → 评委
   over time is the point.

## Reading it back

At the start of a run, load the project's `RUBRIC.md` and feed it forward: let idea-to-prototype
skip asking about things already settled, and let roadmap-to-loop pre-seed its criteria from the
rules (settled taste enters as 【评委】, not 【本人】). For a brand-new project with no RUBRIC.md
yet, also load the master rubric (below) if one exists, as a starting prior.

## Deliberately NOT built yet

- **The master / global rubric (level 2).** Distilled by diffing many projects' RUBRIC.md files to
  find the owner's cross-project constants. **Gated by data**: you cannot diff across projects until
  several `RUBRIC.md` files exist. It is a later pass over those files, not a thing to design now.
- **Auto-loading / scoring machinery.** Its shape is revealed by watching real rules get captured
  and reused. Run a couple of real projects first; let the need define the tool.

## Boundaries

- Never record a one-off tweak as a rule — it bloats the file into noise.
- Never invent a rule the owner didn't actually react to. No reaction, no rule.
- Never build the cross-project synthesis layer before multiple RUBRIC.md files exist.
- This is v0. Expect the first real run to make the owner say "no, the format should be…" — when it
  does, that reaction is itself a taste-to-rubric event about taste-to-rubric. Catch it.
