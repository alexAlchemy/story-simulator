# Feature Brief: System-Level Transitions

Status: Proposed  
Area: Core / System Runtime  
Criticality: Medium  
Decision level: Feature brief, not ADR  
Related concepts: scenes, choices, effects, semantic summaries, phase changes

## Summary

Aphebis should support an optional concept of **Transitions**: named, system-defined phase changes that apply effects and move the game from one frame of play to another.

A transition is not a universal time engine. It is not a hardcoded `Day` model. It is a generic runtime affordance for moments such as:

- closing the shop
- advancing the day
- travelling
- resting
- ending a chapter
- resolving downtime
- surfacing delayed consequences
- opening the next phase of play

The purpose is to give system packages a low-friction, semantically clear way to model phase movement without forcing every game to invent its own ad hoc transition plumbing.

## Problem

The current prototype has an `advanceDay` style loop, but `day` is not a universal Aphebis concept.

Different systems may organise play around different rhythms:

```text
Potion shop:
  open shop → serve customers → close shop → advance day

Journey drama:
  travel → make camp → rest → continue journey

Court intrigue:
  audience → downtime → next week → public event

Mystery:
  investigate scene → regroup → night passes → pressure escalates

Chapter-based visual novel:
  scene → interlude → chapter break → new act
````

If core hardcodes `Day`, `Time`, or a specific calendar model too early, it risks becoming overly opinionated and unsuitable for other game systems.

At the same time, if every system package implements its own transition approach from scratch, repeated concepts will fragment:

```text
apply effects
add/remove scenes
set flags
advance pressures
produce summaries
surface changed state
return to tableau
```

A generic transition model can occupy this design space without over-defining it.

## Design Intent

Transitions should provide a standard way to say:

> The player has finished one frame of play. The system now moves the world forward, applies authored/system effects, and presents what changed.

Transitions are especially useful for the space between scenes.

They should help systems model:

```text
what changes while time/attention passes
what new scenes become available
what pressures escalate
what consequences surface
what state changes should be summarised
```

They should not prescribe what “time” means.

## What a Transition Is

A transition is a named phase change.

Examples:

```text
close-shop
open-next-day
make-camp
travel-to-town
end-chapter
resolve-downtime
battle-aftermath
night-passes
```

A transition may:

```text
apply effects
set flags
add scenes
remove scenes
write log entries
produce narration
produce a state-change summary
check availability conditions
```

A transition does not need to contain player choices.

## What a Transition Is Not

A transition is not:

```text
a scene
a player choice
a universal clock
a calendar system
a simulation tick engine
a replacement for authored consequence
a generic drama generator
```

A transition should not decide what is dramatically appropriate on its own.

The system or content package defines the transition’s meaning.

Core merely provides a standard shape and supporting machinery.

## Why Not Just Use Scenes?

A transition could technically be represented as a scene with one choice:

```text
Scene: Close Shop
Choice: Continue
```

But this blurs the model.

Scenes are for inhabited dramatic situations. Choices are for player stance and action. Transitions are for moving the larger frame forward.

Using scenes for transitions risks:

```text
polluting the scene list with operational controls
creating fake choices
mixing drama moments with runtime phase changes
making tableau management feel more like admin
```

A transition deserves a separate semantic space.

## Why Not Leave This Entirely to System Packages?

System packages can still build their own transitions from primitives. That should remain possible.

However, core support has advantages:

```text
shared effect application
shared summary generation
standardised return shape
easier authoring/tooling support
less repeated boilerplate
clearer conceptual boundary against hardcoded Day/Time concepts
```

The strongest reason to include transitions in core is defensive clarity:

> Core should not own “Day” or “Time” as universal concepts. A generic Transition primitive occupies that space and makes the intended abstraction explicit.

This lowers the chance that future work accidentally bakes a shop-specific day cycle into core.

## Relationship to Time

Transitions are how a system may express the passage of time, but they are not themselves a time model.

A transition may represent:

```text
one night passing
a week passing
a journey segment
a chapter break
a shift at work
a rest period
a scene aftermath
```

But core should not assume that all transitions involve time.

Some transitions may represent spatial, narrative, procedural, or emotional movement instead:

```text
entering a new location
moving from trial to verdict
ending a battle
cutting to aftermath
returning to the map
```

## Relationship to Scenes and Choices

```text
Scene:
  An inhabited dramatic situation.

Choice:
  A player action, stance, or commitment inside a scene.

Transition:
  A system-defined phase movement between frames of play.
```

Example:

```text
Scene:
  The stablehand asks for medicine.

Choice:
  You give the last fever draught, but ask him to return with the truth.

Transition:
  The shop closes. Word travels overnight. The temple healer arrives in the morning.
```

## Relationship to Effects

Transitions should reuse the existing effect model wherever possible.

A transition can apply the same kinds of effects as a scene choice:

```text
change property
set property / flag
add scene
remove scene
write log
```

This keeps transitions boring and compatible with the rest of core.

## Possible Data Shape

Initial sketch:

```ts
type Transition = {
  id: string;
  type: string;
  title: string;
  description?: string;

  availability?: SceneAvailability;

  effects: Effect[];

  narration?: string;

  spotlightProperties?: Array<{
    entityId: string;
    property: string;
  }>;

  futureEchoText?: string[];
};
```

Possible content shape:

```ts
type GameContent = {
  scenes: Record<string, Scene>;
  transitions?: Record<string, Transition>;
  // existing fields omitted
};
```

Possible runtime function:

```ts
resolveTransition(
  state: GameState,
  transitionId: string,
  content: GameContent
): TransitionResult
```

Possible result shape:

```ts
type TransitionResult = {
  state: GameState;
  transitionId: string;
  narration?: string;
  semanticChanges: SemanticChangeSummary[];
  addedScenes: string[];
  removedScenes: string[];
  futureEchoText?: string[];
};
```

The exact API is not decided.

## Multiple Transition Types

Core should support multiple transition types, but only as labels.

Examples:

```text
shop.closeDay
shop.openDay
journey.travel
journey.rest
chapter.end
scene.aftermath
```

Core should not contain special behaviour for each type.

Systems define what the types mean.

Core should only provide common handling:

```text
check availability
apply effects
compare before/after state
produce result summary
```

## Example: Potion Shop Close Day

```ts
const closeShopDay: Transition = {
  id: "close-shop-day-1",
  type: "shop.closeDay",
  title: "Close the Shop",

  narration:
    "You count the till twice before locking the door. The shop is quieter than it was this morning, but not unchanged.",

  effects: [
    {
      kind: "log",
      text: "The shop closes for the night."
    },
    {
      kind: "changeProperty",
      entityId: "shop",
      property: "fatigue",
      direction: "decrease",
      strength: "small"
    },
    {
      kind: "addScene",
      sceneId: "temple-healer-visits"
    }
  ],

  spotlightProperties: [
    { entityId: "shop", property: "coins" },
    { entityId: "shop", property: "stock" },
    { entityId: "village", property: "reputation" }
  ],

  futureEchoText: [
    "Word of today may travel before morning."
  ]
};
```

## Example: Journey Rest

```ts
const makeCamp: Transition = {
  id: "make-camp",
  type: "journey.rest",
  title: "Make Camp",

  narration:
    "The fire catches reluctantly. Beyond the trees, something moves and then thinks better of it.",

  effects: [
    {
      kind: "changeProperty",
      entityId: "party",
      property: "fatigue",
      direction: "decrease",
      strength: "meaningful"
    },
    {
      kind: "changeProperty",
      entityId: "party",
      property: "rations",
      direction: "decrease",
      amount: 1
    }
  ],

  spotlightProperties: [
    { entityId: "party", property: "fatigue" },
    { entityId: "party", property: "rations" }
  ]
};
```

## Presentation

A transition may produce a player-facing summary similar to a scene aftermath.

Example:

```text
The shop closes.

You count the till twice before locking the door. The shop is quieter than it was this morning, but not unchanged.

What changed:
- Stock: Comfortable → Running Low
- Village Reputation: Unknown → Talked About

Future echoes:
- Word of today may travel before morning.
```

This keeps transitions visible and meaningful without pretending they are scenes.

## Risks

### Risk: Abstraction creep

Transitions could grow into a universal time/phase engine.

Mitigation:

```text
Keep transitions generic.
Do not add calendar logic to core.
Do not add built-in day/week/month semantics.
Let systems define transition meaning.
```

### Risk: Fake gameplay

Transitions could become scenes with no choices and too much text.

Mitigation:

```text
Use transitions for frame movement and summary.
Use scenes for dramatic play.
Keep transition narration compact.
```

### Risk: Duplicating system logic

System packages may still need custom behaviour.

Mitigation:

```text
Core transitions should be optional.
Systems may bypass them and use primitives directly.
Transitions are convenience and standardisation, not a cage.
```

### Risk: Spoiling delayed consequences

Transition summaries may reveal too much.

Mitigation:

```text
Use restrained future echo text.
Avoid listing exact future scene names unless intended.
Prefer “word may travel” over “Temple Healer Visits unlocked.”
```

## Open Questions

* Should transitions live in `@aphebis/core` or a higher-level runtime package?
* Should transitions share `SceneAvailability`, or have a separate condition model?
* Should transition results include computed semantic summaries by default?
* Should transitions support authored `futureEchoText`, computed affected scene counts, or both?
* Should scene aftermath itself be modelled as a transition?
* Should transitions be invoked explicitly by the app/system, or can scenes trigger transitions directly?
* Should transitions support player choice later, or would that collapse them back into scenes?

## Current Recommendation

Prototype transitions first as a small optional model.

Do not build a universal time engine.

Do not hardcode days into core.

Use transitions as a generic, semantic way for system packages to express phase movement while reusing core primitives for effects, scene mutation, and summaries.

The simplest useful definition:

> A Transition is a named, optional, system-defined phase change that applies effects and produces a summary between scenes.

```

That gives the idea enough shape to preserve, without pretending we’ve settled the final API.
```
