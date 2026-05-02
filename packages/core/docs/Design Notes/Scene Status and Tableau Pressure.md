# Design Note: Scene Statuses and Tableau Pressure

Status: Exploratory  
Area: Narrative Design / Scene Tableau  
Criticality: Useful but not on critical path

## Summary

The scene tableau should eventually communicate more than a flat list of available scenes.

A scene being available is not the same as a scene being urgent, risky, emotionally charged, profitable, fragile, or about to expire. Adding lightweight scene statuses may help the player understand the dramatic shape of their options without turning the tableau into an admin checklist.

This is not yet an ADR-level commitment. It is a promising design direction to preserve for future experimentation.

## Problem

A flat tableau can make the game feel like narrative task management:

```text
Available scenes:
- Stablehand at the Counter
- Moon-Tonic Order
- Apprentice Hiding a Mistake
- Gift at the Door
````

This risks creating an “Inbox Zero” play pattern where the player scans available cards, resolves them quickly, and returns to the list.

The tableau should instead feel like a set of living pressures competing for the player’s attention.

## Design Intent

Scene statuses should help the player feel:

```text
These are not just options.
These are pressures.
Choosing one means neglecting another.
Some can wait. Some cannot.
Some are safe. Some are tempting. Some may bite later.
```

A status is a player-facing hint about the nature of a scene’s pressure, not a full explanation of consequences.

## Possible Status Types

Examples:

| Status         | Meaning                                              |
| -------------- | ---------------------------------------------------- |
| `Urgent`       | This scene needs attention soon.                     |
| `Expires Soon` | This opportunity may disappear if ignored.           |
| `Risky`        | The scene has visible downside or uncertainty.       |
| `Profitable`   | The scene may help materially, often with tradeoffs. |
| `Relationship` | The scene primarily affects a person or bond.        |
| `Quiet`        | Lower-pressure reflective or atmospheric scene.      |
| `Volatile`     | The situation may escalate or transform.             |
| `Follow-up`    | This scene exists because of a previous choice.      |
| `Intrusion`    | This pressure is interrupting another focus.         |
| `Opportunity`  | This may open a new path, resource, or relationship. |

These are examples, not a fixed taxonomy.

## Example

Flat version:

```text
The Desperate Stablehand
A young stablehand asks for fever draught.
```

Status-enhanced version:

```text
The Desperate Stablehand
Status: Urgent / Relationship
A young stablehand asks for fever draught. He has almost no coin.
```

Another example:

```text
Moon-Tonic Order
Status: Profitable / Risky / Expires Tonight
The observatory courier needs a Moon-Tonic before sunset.
```

Another:

```text
Apprentice Hiding a Mistake
Status: Relationship / Volatile
Something broke in the back room. Your apprentice has not mentioned it.
```

## Design Guidelines

Statuses should be:

```text
Suggestive, not explanatory.
Fictionally grounded.
Few in number.
Useful for attention and tone.
Not a replacement for good scene writing.
```

Avoid status clutter. A scene should usually have one to three visible statuses.

Bad:

```text
Urgent / Risky / Profitable / Relationship / Volatile / Follow-up / Expires Soon
```

Better:

```text
Risky / Profitable / Expires Tonight
```

The player should not need to decode a dashboard.

## Relationship to Scene Writing

Statuses should support scene presentation, not carry the drama alone.

Weak:

```text
Status: Urgent
Description: Someone needs help.
```

Better:

```text
Status: Urgent
Description: A stablehand waits by the counter, soaked through, asking for fever draught before the fever breaks his sister.
```

The status helps orient the player. The fiction should still do the emotional work.

## Relationship to Mechanics

A status may be derived from content metadata, game state, or both.

Possible sources:

```text
Authored scene metadata
Scene clocks or expiry rules
Availability conditions
Reactive pressure rules
Resource scarcity
Relationship state
Previous resolved scenes
```

For the first implementation, statuses should probably be authored manually.

Example sketch:

```ts
type SceneStatus =
  | "urgent"
  | "expiresSoon"
  | "risky"
  | "profitable"
  | "relationship"
  | "quiet"
  | "volatile"
  | "followUp"
  | "opportunity";

type Scene = {
  id: string;
  title: string;
  description: string;
  statuses?: SceneStatus[];
};
```

Later, some statuses could become computed.

Example:

```text
If a scene expires at end of current day, show `Expires Tonight`.
If a scene was added by a previous choice, show `Follow-up`.
If stock is low and the scene consumes stock, show `Risky`.
```

## Risks

Scene statuses could make the tableau feel more gamey if overused.

They may also encourage optimisation if they become too mechanical:

```text
Profitable = always pick
Risky = avoid
Relationship = optional
```

To avoid this, statuses should describe pressure, not guarantee reward.

Good:

```text
Risky
```

Less good:

```text
-2 Stock, +3 Reputation
```

Statuses should also avoid naming the underlying theme too directly. They are not design questions or moral labels.

Avoid:

```text
Moral Choice
Compassion Test
Prudence Scene
```

Prefer:

```text
Urgent
Relationship
Volatile
```

## Open Questions

* Should statuses be authored manually, computed, or both?
* Should statuses be visible on all scenes or only certain scene types?
* Should statuses affect sorting or only presentation?
* Should ignored statuses produce stronger consequences?
* Should statuses be part of core runtime, content metadata, or authoring-only data?
* Should statuses support custom game-specific labels?

## Current Recommendation

Do not prioritise this until the scene beat model, consequence feedback, and day phase loop are stronger.

When revisited, start with a minimal authored metadata field on scenes and use statuses only as presentation hints.

The goal is not to make the tableau more complex.

The goal is to make the tableau feel less like a task list and more like a set of dramatic pressures.

```
