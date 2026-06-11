# LOOP — night garden: spookier nights, dreamy fireflies, wind, and the save bug
> Source: ROADMAP.md (this folder). This file is the loop's single source of truth.
> Out of scope by owner's word: seasons, trading with the fox npc ("later maybe").

## Purpose

In the owner's words: "honestly just vibes i want" — night should feel spooky instead
of just dark, firefly trails should be dreamy like the reference shot, wind should
swell in the open field, and planted flowers must never silently vanish from the save.

The vibes items are judged against the owner's own reference images in `ref/`
(night-ref-1.jpg, night-ref-2.jpg, fireflies-good.jpg) — never against the
implementer's taste — and nothing ships without the owner's final look.

## Protocol — how each round runs

1. Take the FIRST unchecked item in the work queue. Work in an isolated git worktree
   (item 0 creates the repo; until then, item 0 itself works in place).
2. Make all 【machine】 criteria pass first. Then spawn an **independent verifier
   subagent** — one that did NOT write the change — for every 【verifier】 criterion.
   Give it the fresh QA screenshots AND the matching `ref/` image side by side, and
   brief it to find faults and list every difference it sees, not to confirm success.
3. All criteria pass → check the box, append a log entry, commit locally. Never push.
4. On reaching a 【human】 criterion:
   - If it is a *prerequisite* at the top of an item (marked "prerequisite"), write
     plainly in the log what the owner needs to answer or provide, then move on to the
     next item in the queue and come back once the owner responds.
   - Otherwise (final sign-offs), stop the loop, state plainly what the owner should
     look at, and wait.
5. Any criterion failing 3 rounds in a row → stop and ask the owner. Never bypass,
   weaken, or reinterpret a criterion to get unstuck.
6. Log entries must distill rules, not just record events: "X failed because Y, so
   from now on Z."

## Global gates — checked every round, for every item

- `node qa/screenshot.mjs` runs without errors and writes qa/day.png, qa/night.png,
  qa/field.png (this exists once item 0 lands — it is currently a stub).
- The save round-trip check passes: a planted flower survives save → reload, every
  round, no exceptions (exists once item 0 lands).
- qa/day.png matches the pinned golden day screenshot (diff ≤ 1%) unless the current
  item explicitly changes the day scene. The owner's complaint is about *night*; day
  must not drift as a side effect.
- No console errors during the scripted runs.
- The save format (`localStorage "night-garden-save"` = `{ flowers: [{x,y,kind}], day: n }`)
  is never changed without a written proposal in the log AND the owner's explicit OK.
  Existing planted gardens must survive any change.
- Files in `ref/` are read-only. They are the owner's taste references — never edit,
  replace, or regenerate them, and never swap a golden baseline just to make a diff pass.

## Work queue

### 0. Make the project verifiable (must come first)
**Why**: today there is no working automated signal at all — `qa/screenshot.mjs` is a
3-line stub, there are no tests, and the folder isn't a git repo. A loop without
verification is just unattended mistakes.
- [ ] `git init` done, everything committed as a baseline 【machine】
- [ ] `node qa/screenshot.mjs` actually works: launches the game (Playwright),
      captures day, night, and open-field scenes to qa/day.png, qa/night.png,
      qa/field.png as its own header comment promises 【machine】
- [ ] A save round-trip script exists (e.g. `node qa/save-roundtrip.mjs`): plant a
      flower via script → save → reload the page → the flower is still there 【machine】
- [ ] The current qa/day.png is pinned as the golden baseline (e.g. qa/golden/day.png)
      for the "day didn't change" gate 【machine】

### 1. BUG: save sometimes loses planted flowers — investigation, not yet a fix
**Owner's intent**: "the save sometimes loses planted flowers?? happened to me twice,
no idea how to reproduce."
This is an *investigation* item: you cannot verify a fix for something you cannot
reproduce, so no speculative "fixes" — first a tripwire and a reproduction hunt.
- [ ] 【human — prerequisite】 Owner answers what they remember about the two losses:
      which browser? did it happen after closing the tab, refreshing, or coming back
      next day? was the whole garden gone or just some flowers? more than one tab open?
      (Loop: ask, log it, move on to item 2 while waiting.)
- [ ] Tripwire instrumentation: every save logs flower count; on load, if the loaded
      flower count is lower than the last-saved count, the game shows a visible warning
      and dumps both payloads to the console — so the next real occurrence is caught
      with evidence instead of a shrug 【machine: scripted check that the warning fires
      on a deliberately corrupted save】
- [ ] A reproduction-hunt script exists and has run ≥ 500 cycles across the usual
      suspects: rapid plant/save/reload, closing mid-write, two tabs open at once, day
      rollover during save, localStorage near quota 【machine】
- [ ] Outcome recorded in the log — exactly one of: (a) a reliable reproduction exists
      (script or exact recorded steps that lose a flower every time), in which case a
      NEW "fix the save bug" item is appended to this queue with the repro as its first
      criterion; or (b) no repro found after the hunt, the attempts are logged, and the
      tripwire stays in permanently to catch it in real play 【machine + log】

### 2. Spookier nights
**Owner's intent**: "the garden should feel spookier at night. right now night looks
just like day but darker." References: ref/night-ref-1.jpg, ref/night-ref-2.jpg.
- [ ] Night differs from day by more than darkness: a scripted comparison of
      qa/day.png vs qa/night.png shows the difference is not just uniform brightness
      (e.g. hue/palette shift), and at least two distinct night-only elements exist
      (implementer's pick — fog, moon, longer shadows, eyes in the hedge… — each one
      named in the log so the owner can veto) 【machine】
- [ ] Independent verifier puts qa/night.png side by side with night-ref-1.jpg and
      night-ref-2.jpg, scores the mood match ≥ 7/10, and lists every difference it
      still sees 【verifier】
- [ ] Day scene untouched: golden day diff gate passes 【machine】
- [ ] Owner looks at the new night and says "yes, spookier" 【human】

### 3. Dreamy firefly trails
**Owner's intent**: "the firefly trails look cheap. want them dreamy like
ref/fireflies-good.jpg."
- [ ] The screenshot script gains a firefly close-up capture (qa/fireflies.png) so
      trails are actually visible to judge 【machine】
- [ ] Independent verifier compares qa/fireflies.png side by side with
      ref/fireflies-good.jpg — softness, glow, trail persistence — scores ≥ 7/10 and
      lists every difference 【verifier】
- [ ] Performance guard: with the normal number of fireflies on screen the game holds
      ≥ 30 fps, measured via requestAnimationFrame timing in the QA script — dreamy
      trails usually mean more blending, which usually means jank 【machine】
- [ ] Owner sign-off: "dreamy, not cheap" 【human】

### 4. Wind swells in the open field
**Owner's intent**: "sound: wind should get louder when you walk into the open field."
- [ ] Wind loudness is exposed for QA (e.g. `window.__qa.windGain`) 【machine】
- [ ] Scripted walk garden → field → garden: wind gain in the field is clearly higher
      (proposed: ≥ 2× the garden level — owner may tune this number) and drops back on
      the way out 【machine: Playwright eval during a scripted walk】
- [ ] The change is a ramp, not a switch: gain sampled along the walk rises smoothly
      across the field boundary, no single-step jump to full volume 【machine】
- [ ] Owner walks into the field with sound on and it feels right 【human】

## Boundaries — what this loop must NOT do

- **Out of scope**: seasons; trading with the fox npc. Owner said "later maybe" —
  that means not now, no matter how tempting.
- **No speculative save-bug fixes.** Until a reliable reproduction exists, item 1 is
  instrumentation and investigation only. No rewriting the save system "to be safe".
- **Never touch the save format or stored player data** without a logged proposal and
  the owner's OK (also a global gate — it bears repeating).
- **Never modify anything in `ref/`** and never replace golden baselines to make a
  failing comparison pass.
- **No new frameworks or build steps.** This is a tiny single-file canvas game;
  keep it one.
- **Never push or publish.** Commits stay local.

## Log

Entry format: `date / item / what was tried / result / rule distilled`.

- 2026-06-11 / setup / Converted ROADMAP.md into this loop. Baselines at creation:
  zero automated tests; qa/screenshot.mjs is a stub (import only); no git repo;
  3 reference images present in ref/; save format per src/game.js comment is
  `localStorage "night-garden-save" = { flowers: [{x,y,kind}], day: n }`.
  Golden day.png to be pinned by item 0. / LOOP.md created / Rule: vibes items are
  judged against the owner's ref images plus owner sign-off — never against the
  implementer's own taste; the unreproducible save bug gets a tripwire and a repro
  hunt before any fix is attempted.
