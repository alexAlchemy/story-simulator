# AGENTS.md — Aphebis Potions Shop Prototype

## Project identity

This project is a lightweight prototype for Aphebis.

Aphebis is an authored solo drama engine where stories unfold through a tableau of stateful scenes, each with its own emotional rules, risks, and consequences.

This prototype explores that idea through a slice-of-life fantasy potions shop game.

The goal is not to build a full RPG engine, visual novel engine, open-world sandbox, or production SaaS platform. The goal is to prove the core play loop:

> Start day → view shop/global state → choose a scene from the tableau → resolve dramatic/shop choices → mutate state → advance clocks/day → repeat.

The prototype should answer:

> Is this fun and emotionally interesting to play for five in-game days?

## Current product direction

The game is a cosy fantasy shop sim with Drama Play at its core.

The player runs a small potions shop in a magical town. Customers, staff, suppliers, neighbours, and town events create scenes. Those scenes test values such as compassion, prudence, and ambition while also affecting practical shop state such as coins, stock, fatigue, rent, and reputation.

The shop sim creates pressure.
The scene tableau creates guidance.
The drama mechanics create meaning.

## Design principles

1. Drama Play comes before Progress Play.
2. Progress systems exist to create pressure, not to replace drama.
3. Scenes should usually be enterable when fictionally plausible.
4. Use boons and banes instead of hard unlocks wherever possible.
5. Values are dramatic gravity, not handcuffs.
6. Global state tracks continuity.
7. Scene-local state creates moment-to-moment play.
8. AI, if added, performs and narrates within constraints. It does not own the rules or rewrite truth.
9. Keep the prototype simple, lovable, and complete.
10. Prefer working play loop over architecture purity.

## Target SLC

Build a local-only five-day prototype.

Minimum experience:

- Player can complete five in-game days.
- Each day presents a small tableau of scene opportunities.
- Player chooses scenes to resolve.
- Each scene offers meaningful choices.
- Choices mutate global state.
- Global state affects later scenes.
- Rent is due on Day 5.
- Ending reflects both shop outcome and dramatic identity.

## Out of scope

Do not build these unless explicitly asked:

- backend
- database
- auth
- multiplayer
- full AI memory system
- creator/editor UI
- open world map
- combat system
- full potion brewing mini-game
- procedural town generator
- marketplace
- save cloud sync
- large framework architecture
- generic ECS engine
- complex branching dialogue framework

## Preferred technical approach

Use a lightweight frontend.

Preferred shape:

- TypeScript for engine/domain logic
- Alpine.js or similarly light UI binding
- plain CSS or very small styling layer
- local in-memory state first
- localStorage only if useful
- no backend initially

Avoid tightly coupling game rules to UI components.

The important part is the engine/domain layer. UI should be replaceable.

## Architecture rules

Use a clear separation between:

1. **Domain model**
   - Types and data structures.
   - GameState, SceneCard, Choice, Effect, Clock, Boon, Bane.

2. **Engine/services layer**
   - Pure or mostly pure functions.
   - Applies effects.
   - Resolves choices.
   - Advances day.
   - Updates scene tableau.
   - Evaluates clocks.
   - Produces derived view models.

3. **Content layer**
   - Scene definitions.
   - Initial game state.
   - Day plans.
   - Scene libraries.

4. **UI layer**
   - Displays state.
   - Displays scene tableau.
   - Handles user interaction.
   - Calls engine/services.
   - Does not contain core game rules.

Do not put business/game logic directly inside Alpine markup or UI components.

Good:

```ts
resolveChoice(state, sceneId, choiceId, content)
advanceDay(state, content)
getVisibleScenes(state, content)
```

## State model principles

Do not add new global meters for people or groups.

Bad:
- apprenticeTrust
- townTrust
- rivalHate

Good:
- relationship apprentice->player dimension trust
- relationship town->shop dimension trust
- relationship rival->player dimension resentment

People, groups, shops, and places should be entities.

Material quantities belong to entities:
- shop.coins
- shop.stock
- player.fatigue

Relationship qualities belong to relationships:
- trust
- affection
- respect
- fear
- resentment
- obligation

Semantic primitives describe what state means. They must not fire events, add scenes, or decide NPC behaviour.

Scene orchestration and NPC/agent behaviour may read semantic state later, but semantic state must not depend on scenes or agents.
