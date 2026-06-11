# roadmap-to-loop

A [Claude Code](https://claude.com/claude-code) skill that turns a product roadmap into an
executable `LOOP.md` — a loop file an agent can work through on its own, safely.

You write **what you want** in plain product language. The skill does the translation:

> "I want X" → "When X is done, here is what anyone could observe" → "and here is who checks each observation"

It scans your project for *real* feedback signals (tests, CI, QA scripts — it never invents
commands that don't exist), converts each roadmap item into observable, yes/no acceptance
criteria, and tags every criterion with its judge:

| Tag | Judge | Used for |
|---|---|---|
| 【machine】/【机器】 | tests & scripts | anything automatable — most reliable, preferred |
| 【verifier】/【评委】 | an independent subagent that did **not** implement the change | screenshots, diffs, copy — judged against reference artifacts, briefed to find faults |
| 【human】/【本人】 | you, the owner | taste calls, real devices, materials only you can provide — explicit stop points |

The generated `LOOP.md` contains: purpose, a run protocol (isolated worktrees, maker/checker
separation, stop at human checkpoints, stop-and-ask after 3 failed rounds — never weaken a
criterion to get unstuck), global quality gates, the work queue, boundaries (what the loop
must NOT touch), and a log that distills rules across rounds.

Designed especially for **non-coders** supervising coding agents: everything you need to
judge is expressed as visible behavior, never as code.

## Install

```bash
git clone https://github.com/H1an1/roadmap-to-loop.git ~/.claude/skills/roadmap-to-loop
```

## Use

In Claude Code, inside your project:

```
turn my ROADMAP.md into a loop
```

Review the generated LOOP.md (especially the 【human】 checkpoints and any product decisions
it surfaced for you), then start the loop:

```
/goal follow LOOP.md's protocol: complete the first unchecked item until its criteria pass
```

or let it keep taking items with `/loop`.

## Example

[`examples/garden-game/`](examples/garden-game/) shows a full transformation of a deliberately
hard roadmap — pure-vibes goals ("the garden should feel spookier at night") and an
unreproducible save bug:

- subjective goals get an independent verifier judging fresh screenshots against the owner's
  own reference images, plus a final human sign-off — never an unmeasured vibe, never a number alone
- the unreproducible bug becomes an *investigation* item: a fix only counts after a reliable
  reproduction exists
- "later maybe" wishes are fenced off in boundaries so the loop can't wander into them

## Does it actually help?

Benchmarked on 3 scenarios (rich test infra / zero test infra / subjective goals), 9 assertions
each, against a no-skill baseline of the same model:

| | pass rate |
|---|---|
| with skill | **27/27 (100%)** |
| without skill | 12/27 (44%) |

The baseline's consistent misses: no judge separation (implementer grades its own work), scope
creep (queuing the whole roadmap instead of the near-term horizon), pretending to verify in
projects with no checks, and no escalation rule for getting stuck.

## 中文说明

这是一个把产品 roadmap 翻译成可执行 LOOP.md 的 Claude Code 技能,为不写代码的产品负责人设计:
你用产品语言描述想要什么,技能负责扫描项目里真实存在的检查手段,把每条愿望翻译成"做好了会看到
什么"的可勾选验收标准,并标注谁来判(【机器】/【评委】/【本人】),再配上全局门槛、边界、运行
协议和日志。主观目标会被指派独立评委对照你的参考素材打分,最终仍由你过目;无法复现的 bug 会先
变成"建立稳定复现"的调查项。灵感来自 Addy Osmani 的 *Loop Engineering* 与 Lance Martin 的
*Designing loops with Fable 5*。

## Credits

Method distilled from Addy Osmani's *Loop Engineering* and Lance Martin's *Designing loops
with Fable 5* (June 2026), plus lessons learned running real loops: the judge tiers exist
because models grading their own work is how plausible-but-wrong ships.
