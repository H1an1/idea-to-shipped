# LOOP.md contract

The interface between **roadmap-to-loop** (which *writes* a LOOP.md) and **loop-to-goal** /
the **loop-runner** engine (which *executes* it). Any LOOP.md that follows this contract can be
run by the general engine, on any project. Lock this — the engine trusts it.

Derived from the five real LOOP.md files in the wild (han1.ai, personal-flywheel, MeM_Universe,
Drawell, Englisher); they already share this shape.

## Sections — matched by ROLE, not exact name

A LOOP.md has these sections, in order. Headers vary in language (中/英, 简/繁), so the engine
matches by **role** via the alias lists below, never by exact string.

| Role | Header aliases (any of) | Engine uses it? |
|---|---|---|
| Title | `# LOOP — <name>` (H1, first line) | identifies the file |
| Purpose | 目的 · Purpose · 目標 | no (human context only) |
| Protocol | 协议 · Protocol · 执行协定 · 运行协议 · 每轮怎么跑 | no — engine implements the canonical protocol; project-specific notes here are advisory |
| Global gates | 全局门槛 · Global gates · 全域 gate · 全局闸门 | **yes** — re-checked after every item |
| Work queue | 工作队列 · Work queue | **yes** — the items |
| Boundaries | 边界 · 邊界 · Boundaries | **yes** — hard "never do", passed into every item |
| Log | 日志 · 日誌 · Log | appended after each item |

## Items

Inside the Work-queue section, **each `###` heading is one item** — `### 1. …`, `### 阶段 0 …`,
`### 14.5 …` all count. Items run in priority order, **one at a time** (sequential).

## Criteria — an item's definition of done

Under each item, every checkbox line is one acceptance criterion:

```
- [ ] <observable, decidable check> 【<tier>[:detail]】
- [x] <already done>               【<tier>】   ✅ <sha>  [Codex #5]
```

- `[ ]` = open, `[x]` = done. The engine only works items that still have open criteria.
- **Tier** (inside 【】) = who verifies it:
  - **machine** — 机器 / machine → checkable by tests/scripts. Most reliable; prefer it.
  - **verifier** — 评委 / verifier → an independent subagent (that did NOT build it) judges.
  - **human** — 本人 / human → only the owner can decide. A STOP point, never auto-passed.
  - A tag may list several (`评委/本人` → both apply).
  - **Untagged criterion → treated as `human`** (never let an unverifiable check auto-pass).
- Trailing decorations (`✅ <sha>`, `[Codex #5]`, `★先做`, `⏸`) are stripped/ignored.

## Global gates

Checkbox lines under the Global-gates section (same `- [ ] … 【tier】` format). Re-verified after
**every** item — e.g. "full check command passes", "test count never drops below the baseline".

## Boundaries

Bullet lines under the Boundaries section, plain text. Passed verbatim into every item's build as
the "never do this" list.

## What the engine guarantees (and needs this contract for)

- It reads **Work queue + Global gates + Boundaries**; it implements **Protocol** itself.
- It runs each item in its **own fresh agent** (fresh context — the whole point), **sequentially**,
  in the project repo (shared filesystem, so later items build on earlier ones' commits).
- It never marks a criterion done without **independent** confirmation (machine checks, or a
  verifier subagent that didn't build it). Human-tier criteria are never auto-passed.

If a LOOP.md deviates from this shape, fix the LOOP.md — don't make the engine guess. The engine
will flag a file it can't parse rather than improvise.
