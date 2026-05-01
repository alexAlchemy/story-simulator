# ADR: Definitions, State, and Occurrences

## Decision

For now, authored definitions are immutable content; runtime state stores mutable facts and references definitions by id.

The current names `Scene` and `GameContent` are good enough for this stage. `Scene` is acting as an authored scene definition, and `GameContent` is acting as the authored game definition, but renaming them now would add churn without clarifying the current vertical slice.

This ADR uses "occurrence" for the future runtime appearance of authored content, rather than "instance", because "instance" is too loose across code, domain, and persistence discussions.

## Phase 1: Definitions initialise runtime state

For the thin vertical slice:

```text
Authored definitions + initialisation helpers + runtime state
```

So you have:

```ts
Scene
GameContent
createInitialState()
GameState
WorldState
```

This is basically where the repo already is. Scenes live as authored content; the game run has mutable state; initialisation creates the first `GameState`.

This is enough for the potions-shop SLC because the prototype thesis is explicitly “a small set of authored, stateful scenes combined with lightweight shop sim state”: not a full simulation framework.

## Phase 2: Definition/state pairs

Once the world model starts creaking, split things like:

```ts
WorldDefinition / WorldState
EntityDefinition / EntityState
RelationshipDefinition / RelationshipState
GaugeDefinition / GaugeValue
```

This matters when mutable state and authored truth are getting tangled.

Example:

```text
The apprentice is a person called X = definition
The apprentice currently trusts you at 0.35 = state
```

Revisit this split when:

- initial state construction starts copying large parts of authored content into runtime state
- engine code has to ask whether a value is authored truth or mutable run state
- validation needs to compare authored definitions against runtime values
- multiple games or scenarios need to share definitions but initialise different world states

## Phase 3: Occurrence model

Only add this when definitions can appear multiple times or carry per-appearance lifecycle:

```ts
SceneDefinition / SceneOccurrence
CustomerRequestDefinition / CustomerRequestOccurrence
EncounterDefinition / EncounterOccurrence
```

This is the “same thing can happen more than once, with different runtime facts” phase.

Revisit this model when:

- the same authored scene can be active more than once in a run
- a scene, request, or encounter needs per-appearance lifecycle such as spawned, available, selected, resolved, expired, or abandoned
- repeatable content needs distinct runtime facts, timers, costs, rewards, or participants each time it appears
- the tableau needs to hold generated or scheduled entries that are more specific than a definition id

## So yes

For the thin-ish vertical slice, I’d run with:

```text
Definitions + GameState + initial state factory
```

Not full definition/state pairs everywhere.

Not occurrences yet.

Keep it boring, explicit, and slightly under-abstracted until the repeated pain is real.
