# ADR: Properties

## Decision

The core state model will use `Property` as the umbrella concept for mutable values attached to entities.

The current split between `gauges`, `quantities`, and `flags` is a useful prototype shape, but it exposes mechanical words to authors and spreads state facts across separate concepts. The next core model should consolidate these into properties with four primitive kinds:

- `quantity` for open-ended numeric amounts
- `scale` for bounded one-direction values
- `spectrum` for bounded values between two named poles
- `flag` for boolean facts

Property definitions describe what a value means. Runtime entity state stores the current property values. Effects and conditions should refer to properties in semantic, author-facing language wherever possible, while the engine applies those changes deterministically through the relevant property definition.

This ADR supersedes the older core terminology of `GaugeKey`, `QuantityKey`, `entityGauge`, `entityQuantity`, `setFlag`, `SemanticGaugeDefinition`, `boundedGauge`, `signedGauge`, and `openQuantity` as the desired destination model. Those names may remain temporarily during migration.

## Rationale

The existing implementation already has the shape of a property system. Entities have numeric gauges, numeric quantities, entity flags, and global flags. Semantics define bounded gauges, signed gauges, open quantities, thresholds, labels, and descriptions. Scene availability can already compare some state using semantic labels.

The problem is not the underlying capability. The problem is the author-facing and conceptual model.

`Gauge` sounds like implementation detail or UI. `Quantity` is useful, but too narrow to stand beside gauges and flags as a separate top-level state family. `Dimension` sounds graph-like and abstract. `Stat`, `meter`, and `score` imply RPG optimisation, UI, or points. `Property` is broad, boring, and intuitive: an entity has properties; a property has a definition; a property value changes during play.

The model should also help authors and AI assistants reason about state. A property definition should not only say that a value is numeric. It should explain the value with labels, descriptions, thresholds, poles, aliases, and optional change behaviour. This keeps the source of truth in authored definitions and deterministic engine code, not in ad hoc scene math or AI interpretation.

## Property Kinds

`quantity` represents an open-ended numeric amount. Examples: coins, stock, sales made, experience, debt, ingredients.

`scale` represents a bounded amount of one quality. Examples: fatigue, confidence, trust, hygiene, reputation, sword skill, strength.

`spectrum` represents a bounded position between two named poles. Examples: greedy to generous, cautious to bold, merciful to ruthless, obedient to rebellious, practical to idealistic.

`flag` represents a boolean fact. Examples: rent paid, has met apprentice, knows secret, gift accepted.

`spectrum` should be supported from the initial property model. Story-heavy content quickly needs stance, values, and identity tensions where neither pole is simply "more" of a single quality. Without `spectrum`, authors will force two-pole concepts into `scale` and create confusing language around increase/decrease.

## Definitions And Runtime State

Definitions carry meaning. Runtime state carries current values.

```ts
type PropertyKind = "quantity" | "scale" | "spectrum" | "flag";

type PropertyValue = number | boolean;

type EntityState = {
  id: EntityId;
  kind: EntityKind;
  displayName: string;
  tags: string[];
  properties: Record<PropertyKey, PropertyValue>;
};
```

A property definition should be self-describing enough for authors, UI, tests, validation, and AI narration:

```ts
type PropertyDefinition = {
  key: PropertyKey;
  kind: PropertyKind;
  label: string;
  description: string;
  aliases?: string[];
};
```

Numeric property kinds extend this with ranges and semantic thresholds:

```ts
type PropertyThreshold = {
  label: string;
  min: number;
  description: string;
  requiresMagnitude?: ChangeStrength;
};
```

Flags extend this with optional labels for the two boolean states:

```ts
type FlagPropertyDefinition = PropertyDefinition & {
  kind: "flag";
  trueLabel?: string;
  falseLabel?: string;
};
```

For `scale`, directions are naturally `increase` and `decrease`.

For `spectrum`, directions should be pole-relative, not numeric. Authors should say "toward Generous" or "toward Ruthless", not "increase" or "decrease".

## Effects And Conditions

Effects should move from raw mechanical operations toward a small typed DSL that reads naturally while remaining deterministic.

Instead of:

```ts
{ kind: "entityGauge", entityId: "player", key: "compassion", delta: 0.2 }
```

Prefer:

```ts
{
  kind: "changeProperty",
  entityId: "player",
  property: "compassion",
  direction: "increase",
  strength: "meaningful",
  reason: "Gave medicine away despite rent pressure"
}
```

For spectra:

```ts
{
  kind: "changeProperty",
  entityId: "player",
  property: "greedGenerosity",
  direction: "toward",
  pole: "Generous",
  strength: "meaningful",
  reason: "Gave away medicine despite needing rent money"
}
```

For flags and direct values:

```ts
{
  kind: "setProperty",
  entityId: "shop",
  property: "rentPaid",
  value: true
}
```

Conditions should also support semantic labels:

```ts
{
  kind: "property",
  entityId: "apprentice",
  property: "trust",
  atLeastLabel: "Trusting"
}
```

Quantities may still compare against numeric values:

```ts
{
  kind: "property",
  entityId: "shop",
  property: "coins",
  atLeastValue: 30
}
```

The source of truth remains structured data, not free prose. Prose-like authoring can be layered on later, but the first target is a small typed model that reads well.

## Change Behaviour

Flat deltas are too weak for story simulation. They make trivial repeated actions produce absurd long-term results:

```text
Hold a door open 10,000 times -> saint
Defeat a weak opponent 10,000 times -> master swordsman
Do basic exercise forever -> elite athlete
```

This should not be solved by scattering custom math into scene logic or asking AI to judge every change. The named home for this complexity is property-level change behaviour.

In code, this can be represented as `changePolicy`. In author-facing docs, call it change behaviour.

For the first implementation, support only:

- `direct` for simple quantities and explicit set operations
- `bounded` for simple bounded changes using semantic strengths
- `moveToward` for changes that approach a threshold or pole without crossing an inappropriate ceiling or floor

Example:

```ts
type ChangeStrength = "trace" | "minor" | "small" | "meaningful" | "major" | "defining";

type PropertyChangePolicy =
  | { kind: "direct" }
  | { kind: "bounded"; amounts: Partial<Record<ChangeStrength, number>> }
  | { kind: "moveToward"; amounts: Partial<Record<ChangeStrength, number>> };
```

The effect declares the narrative significance. The property definition decides what that means numerically.

```ts
{
  kind: "changeProperty",
  entityId: "player",
  property: "politeness",
  direction: "increase",
  strength: "small",
  magnitude: "minor",
  ceilingLabel: "Polite",
  reason: "Held the door open"
}
```

The policy can move a rude character toward politeness, barely affect an already polite character, and never turn a polite character selfless through repetition of a minor courtesy.

## Significance Gates

Some thresholds are narratively important and should require sufficiently significant actions to cross them.

```ts
thresholds: [
  { label: "Neutral", min: 0, description: "Neither notable nor deficient." },
  { label: "Polite", min: 0.35, description: "Usually courteous." },
  {
    label: "Selfless",
    min: 0.75,
    description: "Accepts meaningful personal cost for others.",
    requiresMagnitude: "major"
  },
  {
    label: "Saintly",
    min: 0.9,
    description: "Defined by extraordinary sacrifice.",
    requiresMagnitude: "defining"
  }
]
```

A minor action can improve the underlying number but cannot cross a threshold whose `requiresMagnitude` is greater than the effect's `magnitude`. This is the key anti-grind requirement. Trivial repeated actions must not cross dramatically important boundaries.

## Architecture

Scene effects should say what happened in semantic terms:

```text
This was a meaningful generous act.
```

Property definitions should say how that kind of change behaves:

```text
Meaningful generous acts can move generosity this much and can cross these thresholds but not those.
```

The engine should apply the policy deterministically.

AI narration may describe the result, but AI should not be the authority for whether a threshold was crossed or how much a property changed.

## Required Outcomes

The destination codebase should have:

- `PropertyKey`, `PropertyKind`, `PropertyDefinition`, `PropertyThreshold`, `PropertyValue`, `PropertyEffect`, and `PropertyCondition` types.
- Entity state shaped around `properties` rather than separate `gauges`, `quantities`, and entity `flags`.
- Property definitions replacing semantic gauge and quantity definitions.
- Support for `quantity`, `scale`, `spectrum`, and `flag` from the first property implementation.
- Scene effects for `changeProperty` and `setProperty`.
- Scene availability conditions that can compare properties by value and by semantic threshold label.
- Semantic strengths such as `small`, `meaningful`, and `major` for authored changes.
- Optional `ceilingLabel` and `floorLabel` on property changes where move-toward behaviour is needed.
- Optional threshold `requiresMagnitude` for significance gates.
- Deterministic engine tests for bounded changes, spectrum pole movement, label-based conditions, flag properties, and threshold gates.

Global flags should either become properties on an explicit world/system entity or remain as a temporary compatibility layer during migration. The long-term model should avoid keeping boolean state facts in a separate top-level concept while entity facts live under properties.

Relationship-like state remains a system-level concern, as described in [ADR: Relationship-Like State](./ADR-Relationships.md). The property model does not require core to introduce first-class relationship edges. A system may still define a `dispositionToPlayer` facet, but that facet should use properties once the property model exists.

The token decision in [ADR: Tokens](./ADR-Tokens.md) still stands. Flags-as-properties remain the simple representation for rule-relevant discrete facts. A richer token or memory model is still deferred until boolean facts need metadata, ownership, expiry, stacking, spending, visibility, or independent lifecycle.

## Initial Implementation Scope

Do now:

- Introduce the property vocabulary and types.
- Support all four primitive property kinds.
- Keep definitions self-describing with labels, descriptions, thresholds, and poles.
- Implement direct, bounded, and move-toward change behaviour.
- Implement label-based property conditions.
- Implement significance gates.
- Provide compatibility helpers or migration aliases so existing content can move incrementally.

Defer:

- Challenge-weighted learning.
- Decay, maintenance, and scheduled property drift.
- Contextual wealth scaling and complex formulas.
- AI-authored property definitions.
- Free-prose property effects as source of truth.
- First-class relationship graphs.
- First-class tokens or memories.

## Migration Sequence

Implement this as an incremental migration, not a flag-day rewrite:

1. Add property domain types alongside the existing gauge, quantity, and flag types.
2. Add property definitions and adapters that can describe existing semantic gauge and quantity definitions as properties.
3. Add `changeProperty`, `setProperty`, and property availability conditions while keeping existing effects and conditions working.
4. Move system helper APIs to emit property effects, with temporary wrappers for old helper names.
5. Migrate content and initial state from `gauges`, `quantities`, and flags to `properties`.
6. Replace UI selectors and audits with property-aware versions.
7. Remove legacy gauge, quantity, and standalone flag APIs after content and tests no longer depend on them.

## Revisit Triggers

Revisit change behaviour when:

- repeated low-significance actions still cross important story thresholds
- scene authors need to express training, practice, maintenance, decay, or challenge quality
- property effects require scene-specific math to feel correct
- content needs a richer distinction between action strength, dramatic magnitude, cost, risk, and context

Revisit the property/state split when:

- property definitions and runtime values are hard to validate against each other
- multiple games need to share property definitions while initialising different values
- generated content needs to propose new properties and have them reviewed before becoming definitions

Revisit tokens when:

- boolean flags need metadata or independent lifecycle
- repeated facts need stacking or identities
- rules need to spend, transfer, reveal, or consume remembered facts

## Summary

Think deeply now, rename correctly now, and implement narrowly.

`Property` is the right umbrella. `quantity`, `scale`, `spectrum`, and `flag` are the right primitive family. The first property engine should be small, deterministic, and semantic enough to prevent obvious grind problems without becoming a general RPG simulation framework.
