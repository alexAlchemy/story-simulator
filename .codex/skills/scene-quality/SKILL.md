---
name: scene-quality
description: Audit, write, and improve authored game Scene objects for story-simulator / Aphebis-style scene content. Use when working on Scene files, beat graphs, choice outcomes, aftermath text, intra-scene structure, scripted scene validators, or qualitative prose/consequence review for scenes stored as TypeScript objects.
---

# Scene Quality

## Overview

Use this skill to review or create individual Scene objects as playable drama. Treat a Scene as both a small graph of beats and a written dramatic unit with choices, consequences, and aftermath.

Stay intra-scene unless the user explicitly asks for continuity across preceding/following scenes. Do not infer requirements from surrounding scenes, day plans, or broader arcs except to avoid breaking local references.

## Workflow

1. Inspect the Scene type and local content conventions before judging a scene.
   - In story-simulator, start with `packages/core/src/domain/scenes/types.ts`.
   - For current examples, inspect `apps/potions-shop-game/src/content/scenes/*.ts`.
   - Follow project guidance in `apps/potions-shop-game/AGENTS.md` when present.

2. Run or add deterministic audits before qualitative edits.
   - In story-simulator, use `apps/potions-shop-game/src/content/sceneQualityAudit.ts`.
   - Run: `pnpm --filter @aphebis/potions-shop-game test sceneQualityAudit`.
   - For all app tests, run: `pnpm --filter @aphebis/potions-shop-game test`.
   - If a repo has no audit module yet, create one near the content layer with `info`, `warning`, and `error` severities.

3. Report deterministic findings first.
   - Include severity, code, scene id, beat id, choice id, and exact issue.
   - Treat missing references, impossible transitions, missing ending aftermath, unreachable beats, and local-state type errors as `error`.
   - Treat shallow/long paths, missing choice descriptions, missing beat titles, missing future echo text, and weak consequence visibility as `warning` unless the project options say otherwise.
   - Use `info` for non-blocking notes such as changed properties that are not spotlighted.

4. Then review qualitative quality.
   - Read `references/qualitative-scene-review.md` when writing prose, judging creative quality, or revising outcomes.
   - Preserve mechanics unless the user asks for design changes. Do not silently change effects, properties, or availability gates while improving text.
   - Keep aftermath faithful to the actual choice and effects.

5. When writing or revising a Scene, work in this order:
   - State the dramatic premise in one sentence.
   - Sketch the beat path and terminal choices.
   - Define each choice's intent, cost, benefit, and likely aftermath.
   - Write beat text, labels, descriptions, effects, aftermath, and future echoes.
   - Run the scripted audit and revise until errors are gone.

## Deterministic Audit Checklist

Check these intra-scene rules:

- `startBeatId` exists and points to a beat.
- every `nextBeatId` exists.
- every reachable path eventually reaches an `endsScene` choice.
- no choice both advances and ends; no choice does neither.
- no reachable beat cycles unless the engine explicitly supports loops.
- every beat id matches its record key.
- every beat has text and at least one choice.
- every ending choice has aftermath narration.
- every ending choice usually has effects or a log consequence.
- local effects and local availability reference declared `localProperties`.
- numeric local comparisons only target numeric local properties.
- unreachable beats are flagged.
- path depth is checked with configurable thresholds, commonly warning below 2 beats, error at 1 beat, warning above 5 beats, and error above 7 beats.

## Output Shape

For reviews, lead with findings grouped by severity. Keep qualitative comments concrete and actionable.

For rewrites, include a short note about what changed mechanically. If mechanics are unchanged, say so explicitly.
