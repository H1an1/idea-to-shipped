---
name: idea-to-prototype
description: >
  Take a vague, half-formed idea and produce the cheapest, roughest, disposable prototype
  whose only job is to provoke the owner's tacit taste — "no, not that, I want X". Built for
  people whose taste is revealed on contact ("I'll know it when I see it"), not specifiable up
  front. Runs a short warm-up only until the next question would be better answered by pointing
  at a screen than by talking, then builds an ugly-fast mockup (one screen, fake data,
  deliberately incomplete) to react to, harvests every reaction, and distills the generalizable
  ones into reusable rules. Use this at the very FRONT of a build — whenever the owner says
  "I have an idea for…", "help me figure out what I actually want", "mock something up so I can
  react", "I'll know it when I see it", or keeps telling agents "no, redo it" because outputs
  don't match a picture they can't describe. The step before roadmap-to-loop: this firms up the
  picture, then roadmap-to-loop makes it runnable.
---

# Idea to Prototype

Turn a vague idea into the **cheapest possible thing the owner can react to** — so the taste
that lives in their gut, the taste they can recognize but not describe, gets dragged out into
the open where it can be written down.

The owner is not under-specifying because they're lazy or unclear. A large part of what they
want **does not exist yet** — it only comes into being the moment they see a concrete version
and their gut says "no, not like that." Your prototype is not a draft of the answer. It is
**bait for the answer.**

> This skill's success metric is unusual. A first cut the owner immediately *likes* is
> **suspicious — probe it before you bank it.** Sometimes you genuinely nailed it in one shot;
> sometimes "yeah, fine" just means it was too safe to surface anything, or they didn't look
> closely. When you get an easy yes, push once to find out which it is. A cut that draws a
> **"no, not that — I want…"** is gold either way — the "no" is where the real spec hides.
> You're not trying to fail; you're making sure an easy yes is a *real* yes.

## The one rule that defines this skill

**You are FORBIDDEN to make the prototype good.**

The instant you start making it polished, complete, robust, or pretty, you have betrayed the
job. Polish costs time, and worse, polish makes the owner *polite* — a nice-looking screen gets
"yeah that's fine," an obviously-rough one gets honest reactions. Your prototype must be ugly
and fast enough that nobody could mistake it for a finished thing, so the owner feels free to
tear it apart.

If you ever catch yourself adding error handling, real data, responsiveness, edge cases, or a
second feature — stop. That is not your job. Your job is one rough screen, today, that earns a
"no".

## Step 1 — Warm up: mine as deep as the floor allows

This is more than a minimum-to-build interview. Being questioned **sharpens the owner's own
thinking** — vague ideas genuinely get clearer under good questions, so mine for real. Keep
going as long as each question is still producing clarity. The warm-up stops on a signal, not a
question budget:

> **Stop when either (a) the next question would be answered more accurately by the owner
> pointing at a screen than by talking, or (b) the owner starts straining or making answers up
> ("uh… I guess?"). Signal (b) is the floor — past it, more questions just manufacture
> preferences the owner doesn't really have and will then feel obliged to defend.**

Mine deep on what's answerable cold: what this is for, who uses it, the one thing it must do,
what would make you abandon it, and what's the closest thing that already exists and what's
wrong with it. Do NOT mine how it should *feel* or *look*, or whether a flow is "right" — those
are recognised, not recalled; build them instead. The rule is "mine until it stops paying" —
not a fixed three questions, and not forever.

End the warm-up by **announcing every gap you're about to guess**: "To get this on screen I had
to make up X, Y, Z. I'm guessing — react to them." Guessing is fine and necessary; hiding that
you guessed is not.

## Step 2 — Pick the cheapest medium that targets the fork

Match the medium to the *kind* of taste you're trying to provoke:

- Look / feel / "样子" → a static visual mockup (HTML or an image). One screen.
- Flow / interaction → a clickable click-through with hardcoded fake data, no backend.
- "Does this even make sense" → a wireframe or a narrated walkthrough; don't build pixels yet.

Always pick the cheapest medium that still provokes the *specific* fork. Don't build a clickable
app to settle a question about a color.

## Step 3 — Build the rough cut

Constraints, all mandatory:

- **Time-box it to minutes.** If it's taking hours, you're polishing. Cut scope.
- **One screen, or one flow.** Not the app. The single place the contested taste lives.
- **Fake, hardcoded data.** No backend, no integration, no real account.
- **Deliberately incomplete.** Leave the unguessed parts blank or stubbed.
- **For a contested fork, show two versions side by side.** Contrast provokes faster than a
  single option — "this one or that one?" pulls a sharper reaction than "is this right?".
- **Forbidden:** visual polish, error states, responsiveness, edge cases, a second feature.

## Step 4 — Provoke the reaction

Put it in front of the owner and make them **point, not imagine**. Every question here must be
answerable by reacting to what's on screen, never by abstract description:

- "Which of these two feels right?" (not "what feeling do you want?")
- "What's the first thing your eye wants to change?"
- "Point at the part that's wrong."

If the owner says "that's basically fine," **don't bank it yet — probe once:** "what's the first
thing you'd change?" If a real change falls out, that's the reaction you came for. If they look
again and it still holds, you may genuinely have hit it — take the win. The rule is *never accept
an easy yes without one probe*, not *never accept a yes*.

## Step 5 — Harvest every reaction

Every "no" is a piece of taste surfacing. Don't let any of it evaporate — run each reaction
through the **taste-to-rubric** skill, which is the canonical capture procedure: gate it (one-off
edit vs standing preference), and append every standing preference to the project's `RUBRIC.md`
with its type (`revealed` vs `known`) and the reaction it came from.

Capture is not exclusive to this skill — taste-to-rubric is wired into the back of the pipeline
too (roadmap-to-loop's 【本人】 stops, final acceptance), so preferences the owner reveals during
development are recorded the same way, into the same `RUBRIC.md`. Here at the front you produce
the first rules; the file keeps filling for the life of the project.

These rules are the point of the whole exercise — tacit taste becoming transmissible. Phrased
checkably, a preference captured today becomes a 【评委】 criterion tomorrow instead of a 【本人】
stop, in the LOOP.md that roadmap-to-loop builds next.

## Step 6 — Loop, then hand off

- **Loop:** build the next rough cut, cheaper and sharper, aimed only at the forks still open.
  Each round should provoke fewer *new* "no"s than the last. That falloff is your progress bar.
- **Hand off when the picture is firm.** "Firm" means a cut comes back with mostly confirmations
  and only one-off tweaks, no new standing-preference revelations. At that point the picture has
  stopped being tacit. Bundle the firmed-up intent **plus the project's `RUBRIC.md`** and hand to
  `roadmap-to-loop`, which turns it into a runnable LOOP.md and keeps appending to the same file.
- Do **not** keep prototyping past firmness, and do **not** start building the real thing here.
  This skill ends where roadmap-to-loop begins.

## Example

Owner's idea (vague, plain words):

> "I want a thing that shows me the clips I've saved, in a way that actually makes me want to
> review them."

The trap: "makes me want to review them" is pure feel — un-mineable. Do not ask "what would make
you want to review them?" (the owner can't say). Instead:

- **Warm-up to the floor:** confirm only the cold facts — these are saved video clips, the owner
  reviews to practice a language, the one must-do is "see a clip and replay it." Stop there.
  Announce the guesses: "I'm making up the card layout, that we show a thumbnail, and that newest
  is on top — react to those."
- **Cheapest medium:** the question is feel, so a static one-screen HTML mockup, fake clips.
- **Rough cut, with a contrast:** two versions of the same screen side by side — (A) a dense grid
  of small clip cards, (B) one big clip front-and-center with the rest as a queue. Hardcoded
  data, no playback, deliberately ugly.
- **Provoke:** "Which one makes you want to hit play — A or B? Point at what's wrong with the one
  you didn't pick."
- **Harvest:** owner says "B, but not a queue — I want it to feel like *one clip is waiting for
  me today*, not a backlog." → Standing preference, and the revealed-by-seeing kind. Capture:
  *"Review surfaces ONE clip as today's, never a backlog — backlogs make the owner avoid it."*
  That single rule, which no amount of up-front questioning would have produced, now drives the
  whole feature — and becomes a 本人/评委 criterion when this reaches roadmap-to-loop.

## Boundaries

- Never build the real thing. Never polish. Never add a second feature "while you're at it."
- Never make a product decision silently to avoid an ugly prototype — show the fork instead.
- Never accept an easy "it's fine" without one probe — but if it survives the probe, a one-shot
  win is allowed.
- Don't record one-off tweaks as rules; you'll bloat the rule set with noise.
- Stop at firmness and hand to roadmap-to-loop. Prototyping past firmness is just procrastination
  with extra steps.
