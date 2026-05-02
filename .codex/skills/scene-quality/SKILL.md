---
name: scene-quality
description: Audit, write, and improve authored game Scene objects for story-simulator / Aphebis-style scene content. Use when working on Scene files, beat graphs, choice outcomes, aftermath text, intra-scene structure, scripted scene validators, or qualitative prose/consequence review for scenes stored as TypeScript objects.
---

# Scene Quality

## Overview

Use this skill to review or create individual Scene objects as playable drama. Treat a Scene as both a small graph of beats and a written dramatic unit with choices, consequences, and aftermath.

Stay intra-scene unless the user explicitly asks for continuity across preceding/following scenes. Do not infer requirements from surrounding scenes, day plans, or broader arcs except to avoid breaking local references.

## Required Single-Scene Loop

When the user asks to review, improve, or fix multiple scene files, do not begin with a broad qualitative pass. Work one scene file at a time.

For each scene file:

1. Select exactly one target file.
   - Use the order in `apps/potions-shop-game/src/content/scenes/index.ts` unless the user gives another order.
   - Announce the file currently under review.

2. Run the single-scene deterministic audit before editing.
   - Preferred command:
     `SCENE_FILE=apps/potions-shop-game/src/content/scenes/<file>.ts pnpm --filter @aphebis/potions-shop-game audit:scene`
   - Equivalent id command:
     `SCENE_ID=<scene-id> pnpm --filter @aphebis/potions-shop-game audit:scene`
   - The command must print actionable findings and fail when issues at or above the configured threshold exist.
   - Default threshold is `warning`, meaning warnings and errors must be addressed before the scene passes.
   - To focus only on hard blockers, use:
     `SCENE_QUALITY_FAIL_ON=error SCENE_ID=<scene-id> pnpm --filter @aphebis/potions-shop-game audit:scene`

3. Treat the audit output as the first source of truth.
   - Report or summarize deterministic findings before qualitative comments.
   - Include severity, code, scene id, beat id, choice id, and exact message when reporting findings.
   - Do not inspect or edit other scene files while the current scene still has failing deterministic findings.

4. Edit only the current scene file unless the audit tool itself is missing or broken.
   - Preserve mechanics unless the user asks for design changes.
   - If fixing the audit tool, finish and verify the tool first, then restart the current scene from step 2.

5. Re-run the same single-scene audit after edits.
   - Repeat edit and rerun until it passes.
   - Only after the current scene passes should you move to the next scene file.

6. After all requested scene files pass their single-scene audits, run:
   `pnpm --filter @aphebis/potions-shop-game test`

## Workflow

1. Inspect the Scene type and local content conventions before judging a scene.
   - In story-simulator, start with `packages/core/src/domain/scenes/types.ts`.
   - For current examples, inspect only the current scene file and nearby conventions needed for that file; do not bulk-read every scene before the per-file loop is working.
   - Follow project guidance in `apps/potions-shop-game/AGENTS.md` when present.

2. Run or add deterministic audits before qualitative edits.
   - In story-simulator, use `apps/potions-shop-game/src/content/sceneQualityAudit.ts`.
   - For one scene, run: `SCENE_FILE=apps/potions-shop-game/src/content/scenes/<file>.ts pnpm --filter @aphebis/potions-shop-game audit:scene`.
   - For the audit unit tests, run: `pnpm --filter @aphebis/potions-shop-game audit:scenes`.
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
