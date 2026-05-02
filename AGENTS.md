# AGENTS.md - Aphebis Workspace

## What This Repo Is

This is a pnpm monorepo for Aphebis: a story/game simulator built around authored scenes, world state, effects, and dramatic consequences.

Think in three levels:

1. **Core** - the engine and primitives at the heart of Aphebis.
2. **System** - reusable implementations of core for a particular play experience.
3. **Apps** - end-user games built from one or more systems plus concrete content and UI.

Keep dependency flow one-way:

```text
apps -> systems -> core
```

Core must not import systems, apps, content, UI, or game-specific fiction.

## Level 1: Core

Location: `packages/core`

Core owns generic runtime contracts and engine functions:

- domain types for worlds, scenes, choices, effects, properties, semantics, and game state
- pure or mostly pure engine functions such as applying effects, resolving choices, advancing days, and evaluating scene availability
- descriptive semantic helpers that explain state but do not create game-specific behavior

Core should only know Aphebis primitives. It should not know what a cosy shop, D&D party, Skyrim hold, Fate aspect, apprentice, rent, or potion is.

Put code here when it accepts and returns generic core domain objects and would still make sense across many different systems.

## Level 2: Systems

Location pattern: `packages/system-*`

Systems are reusable translations of core into a specific experience or rules grammar.

Examples:

- `packages/system-cosy-shop` for cosy apothecary/shopkeeping stories
- future systems such as D&D, Skyrim-like, FateCore, investigation, political drama, etc.

Systems may define:

- named properties and property helpers
- archetypes, world templates, and reusable entity shapes
- domain-specific effect helpers that compile to core-compatible effects
- semantic definitions for interpreting state in that system

Systems should stay reusable. They should not own one app's scene content, endings, UI, save flow, or product-specific play loop.

## Level 3: Apps

Location: `apps/*`

Apps are playable end-user implementations.

Apps own:

- concrete game content, scenes, day plans, endings, and initial state
- UI and interaction flow
- app-specific selectors, simulations, metrics, and tests
- product decisions for one playable experience

Current app:

- `apps/potions-shop-game` - a cosy fantasy potions shop prototype.

When working inside an app, read its local `AGENTS.md` if present. App-level instructions are more specific than this root file for files under that app.

## Content Guidance

Scene content should usually live in an app, not in core or a system. Use system helpers where possible; drop to raw core effects only for uncommon cases.

For scene authoring and audits in `apps/potions-shop-game/src/content/scenes`, use the local `scene-quality` skill/instructions when available.

## Commands

Common workspace commands:

```sh
pnpm test
pnpm build
```

Run package/app-specific scripts from the package when you only need a narrower check.

## Working Rules

- Preserve the level boundaries before adding abstractions.
- Prefer existing package patterns over new architecture.
- Keep core generic, systems reusable, and apps concrete.
- Add tests near the behavior changed.
- Do not move app-specific fiction into core or system packages just to share it.
