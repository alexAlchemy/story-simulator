Yes — this is the hard thinking worth doing now.

I’d challenge only the implementation scope, not the design concern. The current system already has the right instincts but the wrong author-facing words: effects mutate `entityGauge`, `entityQuantity`, `relationshipDimension`, and `setFlag` using numeric deltas or booleans , while semantics define `boundedGauge`, `signedGauge`, and `openQuantity` with thresholds and labels . That is the shape of a property system wearing mechanic-y names.

## My recommendation: replace “gauge” with “property”

Use **Property** as the umbrella term.

An entity has properties. A property has a definition. A property value lives in runtime state.

```text
Entity
  └── properties
        ├── coins
        ├── fatigue
        ├── swordSkill
        ├── generosity
        ├── hygiene
        └── hasShopKey
```

Then the core primitive types are:

| Property kind | Meaning                     | Examples                                      |
| ------------- | --------------------------- | --------------------------------------------- |
| `quantity`    | Open-ended numeric amount   | coins, experience, salesMade, stock           |
| `scale`       | Bounded one-direction value | fatigue, trust, swordSkill, hygiene, strength |
| `spectrum`    | Bounded two-pole value      | greedy ↔ generous, cautious ↔ bold            |
| `flag`        | Boolean true/false fact     | hasMetApprentice, rentPaid, knowsSecret       |

This gives you a much more intuitive naming set:

```ts
PropertyDefinition
PropertyValue
PropertyEffect
PropertyCondition
```

Instead of:

```ts
GaugeKey
QuantityKey
RelationshipDimensionKey
```

The current key files are basically all string aliases anyway , so this is more of a conceptual/naming consolidation than a huge type-system leap.

## I would make flags properties too

Yes, I think flags should become properties.

Current state has global `flags` and entity `flags`, while numeric things live under `gauges` and `quantities`. That makes sense mechanically, but conceptually it splits “state facts” across separate places.

A cleaner model:

```ts
type PropertyValue =
  | { kind: "quantity"; value: number }
  | { kind: "scale"; value: number }
  | { kind: "spectrum"; value: number }
  | { kind: "flag"; value: boolean };
```

Or, for runtime simplicity:

```ts
type PropertyRuntimeValue = number | boolean;

type EntityState = {
  id: EntityId;
  kind: EntityKind;
  displayName: string;
  properties: Record<PropertyKey, PropertyRuntimeValue>;
};
```

Then definitions explain what those values mean.

```ts
type PropertyDefinition =
  | QuantityPropertyDefinition
  | ScalePropertyDefinition
  | SpectrumPropertyDefinition
  | FlagPropertyDefinition;
```

This keeps the state simple while letting the definitions carry the meaning.

## The self-describing part is crucial

This is where I strongly agree with you. The property definition should not just say “this is a number.” It should explain the property well enough that a human author and an AI assistant can reason about it.

Something like:

```ts
const swordSkill = {
  key: "swordSkill",
  kind: "scale",
  label: "Sword Skill",
  description:
    "How capable this character is with a sword in practical combat.",
  range: { min: 0, max: 1 },
  thresholds: [
    {
      label: "Untrained",
      min: 0,
      description: "Can hold a sword but has no useful combat skill."
    },
    {
      label: "Beginner",
      min: 0.2,
      description: "Can survive simple drills and clumsy opponents."
    },
    {
      label: "Competent",
      min: 0.45,
      description: "Can fight ordinary threats without embarrassing themselves."
    },
    {
      label: "Expert",
      min: 0.75,
      description: "A serious combatant by local standards."
    },
    {
      label: "Master",
      min: 0.92,
      description: "Exceptionally skilled; ordinary fights teach little."
    }
  ]
};
```

The repo already has threshold-based descriptors that clamp values and map numbers to labels/descriptions . That part is good. I’d keep that idea and rename it away from `SemanticGaugeDefinition` toward `PropertyDefinition`.

## Naming convention I’d use

I would use these terms:

```text
Property
PropertyDefinition
PropertyValue
PropertyEffect
PropertyCondition
PropertyChangePolicy
```

And these property kinds:

```text
quantity
scale
spectrum
flag
```

I would avoid:

```text
gauge
dimension
stat
meter
score
```

Why?

`Gauge` sounds like implementation/UI.

`Dimension` sounds abstract and graphy.

`Stat` sounds too RPG/combat/optimisation.

`Meter` sounds like UI.

`Score` implies points.

`Property` is boring, broad, and intuitive. Good boring.

## Scale vs spectrum

I’d be quite careful here.

This is a `scale`:

```text
Inexperienced → Experienced
Weak → Strong
Dirty → Clean
Distrustful → Trusting
```

This is a `spectrum`:

```text
Greedy ↔ Generous
Cautious ↔ Bold
Merciful ↔ Ruthless
Conventional ↔ Rebellious
```

A `scale` measures more or less of one thing.

A `spectrum` measures movement between poles.

So I’d probably model `experienced/unexperienced` as:

```ts
kind: "scale",
key: "experience"
```

But `greedy/generous` as:

```ts
kind: "spectrum",
key: "greedGenerosity",
leftPole: "Greedy",
rightPole: "Generous"
```

That said, I’d use spectrums sparingly. They are narratively useful, but they imply the poles are true opposites. Often they are not. “Generosity” as a scale may be cleaner than “greedy/generous” as a spectrum.

## Natural-ish mutations

This is the big change I’d make.

Right now effects say things like:

```ts
{ kind: "entityGauge", entityId: "player", key: "compassion", delta: 0.2 }
```

That works, but it is author-hostile. It also gives AI very little semantic grip.

I’d rather author effects like this:

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

Or:

```ts
{
  kind: "changeProperty",
  entityId: "player",
  property: "swordSkill",
  mode: "practice",
  challenge: "weakGoblin",
  outcome: "success"
}
```

Or:

```ts
{
  kind: "setProperty",
  entityId: "shop",
  property: "rentPaid",
  value: true
}
```

The author-facing language becomes:

```text
increase compassion meaningfully
practice sword skill against a weak goblin
set rent paid to true
```

The engine-facing structure is still typed, safe, and testable.

The key is: **do not make prose the source of truth yet.** Make the source of truth a small typed DSL that reads naturally.

## Natural-ish conditionals

Same idea for conditions.

Avoid this where possible:

```ts
{
  kind: "property",
  entityId: "apprentice",
  property: "trust",
  min: 0.7
}
```

Prefer:

```ts
{
  kind: "property",
  entityId: "apprentice",
  property: "trust",
  atLeast: "Trusting"
}
```

Or:

```ts
{
  kind: "property",
  entityId: "player",
  property: "swordSkill",
  below: "Competent"
}
```

For quantities:

```ts
{
  kind: "property",
  entityId: "shop",
  property: "coins",
  atLeastValue: 30
}
```

Or, better when context exists:

```ts
{
  kind: "property",
  entityId: "shop",
  property: "coins",
  atLeastLabel: "Can Pay Rent",
  context: { rentDue: 30 }
}
```

The current system already supports label-based semantic comparisons in scene availability, but still under `entityGauge` and `relationshipDimension` terms. That is the right feature under the wrong conceptual names.

## The magnitude / threshold problem

This is the most important part.

You’re describing a very real issue: flat deltas make worlds grindable and dramatically stupid.

```text
Open door 10,000 times → saint
Kill weak goblin 10,000 times → sword master
Do ten pushups forever → Olympic athlete
```

That is exactly the kind of thing a generic property system should prevent.

But I would not solve it by making every property mathematically complex. I’d solve it with **property change policies**.

Each property can declare how it responds to change.

```ts
type PropertyChangePolicy =
  | { kind: "direct" }
  | { kind: "boundedLinear" }
  | { kind: "moveToward" }
  | { kind: "challengeWeighted" }
  | { kind: "decaysOverTime" };
```

Then the property definition says which policy applies.

## Policy 1: direct

For simple quantities:

```ts
coins + 5
salesMade + 1
stock - 1
```

This is boring and should stay boring.

```ts
{
  key: "coins",
  kind: "quantity",
  changePolicy: { kind: "direct", minimum: 0 }
}
```

## Policy 2: bounded linear

For simple bounded properties where a flat nudge is okay:

```text
fatigue increases by small/medium/large
trust increases slightly
stock quality decreases
```

But even here, use semantic strength rather than raw deltas:

```ts
{
  kind: "changeProperty",
  property: "fatigue",
  direction: "increase",
  strength: "small"
}
```

The property definition maps `small` to a number.

```ts
changeAmounts: {
  tiny: 0.03,
  small: 0.08,
  meaningful: 0.15,
  major: 0.3
}
```

## Policy 3: move toward a ceiling

This solves the “opening doors makes me a saint” problem.

Opening a door is not a saintly act. It is a politeness act. So it can move you toward “Polite”, but not past it.

```ts
{
  kind: "changeProperty",
  entityId: "player",
  property: "politeness",
  direction: "increase",
  strength: "small",
  ceiling: "Polite",
  reason: "Held the door for a customer"
}
```

Policy:

```text
Move current value toward the ceiling.
The closer you are to the ceiling, the smaller the effect.
Never cross the ceiling from this kind of act.
```

So if the player is rude, opening doors helps.

If the player is already polite, opening doors barely matters.

If the player is saintly, opening a door does nothing.

That feels right.

## Policy 4: significance gates

This is the dramatic version.

Some thresholds should require a sufficiently meaningful act to cross them.

Example:

```ts
thresholds: [
  { label: "Neutral", min: 0 },
  { label: "Polite", min: 0.35 },
  { label: "Kind", min: 0.55 },
  { label: "Selfless", min: 0.75, requiresMagnitude: "major" },
  { label: "Saintly", min: 0.9, requiresMagnitude: "defining" }
]
```

Then:

```ts
{
  property: "generosity",
  direction: "increase",
  strength: "small",
  magnitude: "minor",
  reason: "Held a door open"
}
```

Can never push the player into `Selfless`.

But:

```ts
{
  property: "generosity",
  direction: "increase",
  strength: "major",
  magnitude: "defining",
  reason: "Risked death to save a stranger"
}
```

Can.

This is probably the heart of your requirement.

I’d name these **significance gates** or **threshold gates**.

They prevent trivial repeated actions from crossing narratively important boundaries.

## Policy 5: challenge-weighted learning

This solves sword skill.

```ts
{
  kind: "changeProperty",
  entityId: "player",
  property: "swordSkill",
  mode: "practice",
  challenge: {
    kind: "combatOpponent",
    label: "Weak Goblin",
    rank: "novice"
  },
  outcome: "success"
}
```

The `swordSkill` property can say:

```ts
changePolicy: {
  kind: "challengeWeighted",
  challengeThresholds: [
    {
      challenge: "novice",
      usefulUntil: "Beginner"
    },
    {
      challenge: "competent",
      usefulUntil: "Expert"
    },
    {
      challenge: "master",
      usefulUntil: "Master"
    }
  ]
}
```

So killing a weak goblin teaches a beginner something, teaches a competent fighter little, and teaches a master almost nothing.

Again: the scene/effect declares the challenge. The property policy decides how much that matters based on current state.

## Policy 6: decay and maintenance

For strength, looks, hygiene, confidence, fatigue, etc., decay matters.

But different properties decay differently.

```ts
{
  key: "hygiene",
  kind: "scale",
  changePolicy: {
    kind: "decaysOverTime",
    cadence: "daily",
    direction: "decrease",
    amount: "small",
    floor: "Dirty"
  }
}
```

Strength might decay slowly:

```ts
{
  key: "strength",
  kind: "scale",
  changePolicy: {
    kind: "decaysOverTime",
    cadence: "weekly",
    direction: "decrease",
    amount: "tiny",
    floor: "Average"
  }
}
```

Exercise then does not simply add infinite strength. It moves toward a training-specific ceiling:

```ts
{
  property: "strength",
  direction: "increase",
  mode: "training",
  strength: "small",
  ceiling: "Fit",
  reason: "Did basic exercise"
}
```

Olympic strength requires Olympic-level training, not repetition of basic exercise.

```ts
{
  property: "strength",
  direction: "increase",
  mode: "training",
  strength: "meaningful",
  ceiling: "Elite",
  requires: ["structuredTraining", "recovery", "nutrition"]
}
```

That may be beyond the SLC mechanically, but the model is correct.

## Where this belongs architecturally

I would put this in the property definition layer, not in scene logic and not in AI.

```text
Scene effect says:
  "This was a meaningful generous act."

Property definition says:
  "Meaningful generous acts can move generosity this much,
   and can cross these thresholds but not those."

Engine says:
  "Apply the policy deterministically."

AI says:
  "Describe the result in human language."
```

That keeps truth out of the AI.

## Minimal TypeScript shape

Something like this:

```ts
type PropertyKind = "quantity" | "scale" | "spectrum" | "flag";

type ChangeStrength =
  | "trace"
  | "minor"
  | "small"
  | "meaningful"
  | "major"
  | "defining";

type PropertyThreshold = {
  label: string;
  min: number;
  description: string;
  requiresMagnitude?: ChangeStrength;
};

type BasePropertyDefinition = {
  key: string;
  kind: PropertyKind;
  label: string;
  description: string;
  aliases?: string[];
};

type QuantityPropertyDefinition = BasePropertyDefinition & {
  kind: "quantity";
  minimumValue?: number;
  maximumValue?: number;
  unit?: string;
};

type ScalePropertyDefinition = BasePropertyDefinition & {
  kind: "scale";
  minimumValue: number;
  maximumValue: number;
  thresholds: PropertyThreshold[];
  changePolicy?: PropertyChangePolicy;
};

type SpectrumPropertyDefinition = BasePropertyDefinition & {
  kind: "spectrum";
  minimumValue: -1;
  maximumValue: 1;
  leftPole: string;
  rightPole: string;
  thresholds: PropertyThreshold[];
  changePolicy?: PropertyChangePolicy;
};

type FlagPropertyDefinition = BasePropertyDefinition & {
  kind: "flag";
  trueLabel?: string;
  falseLabel?: string;
};

type PropertyChangePolicy =
  | { kind: "direct" }
  | {
      kind: "bounded";
      amounts: Partial<Record<ChangeStrength, number>>;
    }
  | {
      kind: "moveToward";
      amounts: Partial<Record<ChangeStrength, number>>;
    }
  | {
      kind: "challengeWeighted";
      amounts: Partial<Record<ChangeStrength, number>>;
    }
  | {
      kind: "decaysOverTime";
      cadence: "scene" | "day" | "week";
      direction: "increase" | "decrease";
      amount: ChangeStrength;
      floorLabel?: string;
      ceilingLabel?: string;
    };
```

Then an effect:

```ts
type PropertyEffect =
  | {
      kind: "changeProperty";
      entityId: string;
      property: string;
      direction: "increase" | "decrease";
      strength: ChangeStrength;
      magnitude?: ChangeStrength;
      ceilingLabel?: string;
      floorLabel?: string;
      reason?: string;
    }
  | {
      kind: "setProperty";
      entityId: string;
      property: string;
      value: number | boolean;
      reason?: string;
    };
```

And condition:

```ts
type PropertyCondition =
  | {
      kind: "property";
      entityId: string;
      property: string;
      atLeastLabel?: string;
      belowLabel?: string;
      equalsLabel?: string;
      atLeastValue?: number;
      belowValue?: number;
      equalsValue?: number | boolean;
    };
```

## Example: politeness

```ts
const politeness = {
  key: "politeness",
  kind: "scale",
  label: "Politeness",
  description:
    "How habitually considerate and socially courteous the character is.",
  minimumValue: 0,
  maximumValue: 1,
  thresholds: [
    { label: "Rude", min: 0, description: "Often inconsiderate." },
    { label: "Civil", min: 0.25, description: "Meets basic expectations." },
    { label: "Polite", min: 0.45, description: "Usually courteous." },
    {
      label: "Kind",
      min: 0.65,
      description: "Courtesy is backed by care.",
      requiresMagnitude: "meaningful"
    },
    {
      label: "Selfless",
      min: 0.85,
      description: "Regularly accepts personal cost for others.",
      requiresMagnitude: "major"
    }
  ],
  changePolicy: {
    kind: "moveToward",
    amounts: {
      small: 0.08,
      meaningful: 0.18,
      major: 0.35
    }
  }
};
```

Opening doors:

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

Life-risking sacrifice:

```ts
{
  kind: "changeProperty",
  entityId: "player",
  property: "politeness",
  direction: "increase",
  strength: "major",
  magnitude: "defining",
  reason: "Risked death to save a stranger"
}
```

## What to implement for the vertical slice

I would absolutely not build the full skill/training/magnitude simulator right now.

But I **would** make the naming and extension points correct now.

For the SLC, implement only:

```text
quantity
scale
flag
```

Maybe defer:

```text
spectrum
challengeWeighted
decay
```

But design the definitions so they can arrive naturally.

Minimum viable property engine:

```text
PropertyDefinition
Entity.properties
changeProperty
setProperty
property condition
threshold labels
change strengths: small / meaningful / major
optional ceilingLabel
optional threshold requiresMagnitude
```

That alone gives you the important anti-grind behaviour without building a giant RPG simulation.

## ADR framing

I’d capture the decision like this:

```md
### Decision: use a property system instead of gauges

The core state model will use `Property` as the umbrella concept for mutable values attached to entities. The previous terms `gauge`, `quantity`, and `flag` are consolidated into property kinds. A property may be a `quantity` for open-ended numeric values, a `scale` for bounded one-direction values, a `spectrum` for bounded two-pole values, or a `flag` for boolean facts.

Property definitions describe what a value means, including its label, description, thresholds, optional natural-language aliases, and mutation policy. Runtime entity state stores only current property values. This keeps game state compact while making the content model self-describing for authors, UI, tests, and AI narration.

Mutations and conditions should be authorable in natural-ish semantic terms rather than raw numeric deltas wherever possible. Authors should be able to express changes such as “increase apprentice trust meaningfully” or conditions such as “apprentice trust is at least Trusting.” The engine resolves these semantic effects through the relevant property definition.

Some properties may define change policies that prevent trivial repeated actions from producing absurd results. For example, holding a door open may move politeness toward `Polite`, but cannot make a character `Selfless`; killing weak goblins may improve sword skill for a beginner, but not for a master. This is handled through property-level policies such as bounded change, move-toward-ceiling, significance gates, decay, or challenge-weighted learning. For the initial vertical slice, only the simplest policies are required, but the model should leave room for richer policies later.
```

## My actual position

You are not overthinking the concept.

You would be overbuilding if you implemented the full model now.

The right move is:

```text
Think deeply now.
Rename correctly now.
Model properties cleanly now.
Implement only simple quantity / scale / flag behaviour now.
Add richer mutation policies only when content demands them.
```

The name `gauge` should go. `Property` is the right umbrella. `quantity`, `scale`, `spectrum`, and `flag` are the right primitive family. And the magnitude/threshold issue should live in property definitions as mutation policy, not as ad hoc scene math and not as AI vibes.


Alex (user):

I agree with you on deferring challengeWeighted and decay. Spectrum I would say you would use that in a story pretty quick and its absence forces you to use scale.

The policy stuff is very heavy weight but at the same time I can see how its actually very clean, configurable and grokable.

AI (assistant):
Agreed. I’d include `spectrum` in the initial primitive set.

Without it, authors will misuse `scale` for things that are really identity/stance/value-tension axes, and that will leak weirdness upward.

## Initial property primitives

I’d set the first supported set as:

```text
quantity
scale
spectrum
flag
```

Where:

```text
quantity = open amount
scale    = bounded amount of one thing
spectrum = bounded position between two named poles
flag     = boolean fact
```

Examples:

```text
quantity
- coins
- stock
- salesMade
- experience

scale
- fatigue
- trust
- swordSkill
- hygiene
- confidence
- reputation

spectrum
- greedy ↔ generous
- cautious ↔ bold
- merciful ↔ ruthless
- obedient ↔ rebellious
- practical ↔ idealistic

flag
- rentPaid
- hasMetApprentice
- knowsGiftGiver
```

The distinction matters because “generous” is not just “more generosity” in some stories. It may be one side of a value axis where moving toward generosity means moving away from greed, caution, selfishness, or pragmatism. That is story-useful immediately.

## Policy heaviness

Yeah — the policy stuff feels heavy because it is abstract. But it is also clean because it gives the complexity a named home.

The alternative is worse:

```ts
delta: 0.2
```

everywhere, followed by five months of “why did this tiny action make the player saintly?” and “why does this goblin still train sword skill at level 9?”

Policy is heavy if we build all of it now.

Policy is sensible if we define the seam now and implement only the lightest cases.

## I’d make policy optional and minimal

For the first implementation:

```ts
type PropertyChangePolicy =
  | { kind: "direct" }
  | { kind: "bounded"; amounts: ChangeAmounts }
  | { kind: "moveToward"; amounts: ChangeAmounts };
```

That’s enough.

Defer:

```text
challengeWeighted
decay
complex formulas
training regimes
contextual wealth scaling
```

But keep the architecture open to them.

## The elegant compromise

Every property gets a `kind`.

Only some properties get a `changePolicy`.

If no policy is defined, the engine uses a simple default for that kind.

```ts
type PropertyDefinition = {
  key: string;
  kind: "quantity" | "scale" | "spectrum" | "flag";
  label: string;
  description: string;
  thresholds?: PropertyThreshold[];
  changePolicy?: PropertyChangePolicy;
};
```

So boring properties stay boring:

```ts
{
  key: "coins",
  kind: "quantity",
  label: "Coins",
  description: "Money currently available to the shop."
}
```

But narratively sensitive properties can opt into policy:

```ts
{
  key: "generosity",
  kind: "spectrum",
  leftPole: "Greedy",
  rightPole: "Generous",
  label: "Greed / Generosity",
  description: "Where the character tends to fall between self-protection and giving freely.",
  thresholds: [...],
  changePolicy: {
    kind: "moveToward",
    amounts: {
      small: 0.05,
      meaningful: 0.15,
      major: 0.3
    }
  }
}
```

Then an author can say:

```ts
{
  kind: "changeProperty",
  entityId: "player",
  property: "generosity",
  direction: "towardRight",
  strength: "meaningful",
  ceiling: "Generous",
  reason: "Gave away medicine despite needing rent money"
}
```

That is actually pretty grokable.

## Spectrum mutation wording

For `scale`, direction can be:

```text
increase
decrease
```

For `spectrum`, I would avoid `increase` and `decrease`, because it is not obvious which way is “up”.

Use pole-relative direction:

```text
towardLeft
towardRight
```

or even better:

```ts
{
  direction: "toward",
  pole: "Generous"
}
```

Example:

```ts
{
  kind: "changeProperty",
  entityId: "player",
  property: "greedGenerosity",
  direction: "toward",
  pole: "Generous",
  strength: "meaningful"
}
```

That reads well and avoids sign confusion.

For a mercy/ruthlessness axis:

```ts
{
  kind: "changeProperty",
  entityId: "player",
  property: "mercyRuthlessness",
  direction: "toward",
  pole: "Ruthless",
  strength: "small"
}
```

Very author-friendly.

## Policy as “mutation behaviour”

Tiny naming thought: `changePolicy` is fine, but `mutationPolicy` may sound too codey.

For author/docs language, I’d call it:

```text
change behaviour
```

In code:

```ts
changePolicy
```

In ADR:

> Properties may define change behaviour.

That reads better.

## ADR refinement

I’d phrase the decision as:

```md
The initial property system will support four primitive kinds: `quantity`, `scale`, `spectrum`, and `flag`.

`quantity` represents open-ended numeric values such as money, stock, experience, or sales made.

`scale` represents a bounded amount of a single quality, such as fatigue, confidence, trust, skill, hygiene, or reputation.

`spectrum` represents a bounded position between two named poles, such as Greedy ↔ Generous, Cautious ↔ Bold, or Merciful ↔ Ruthless. Spectrum is included from the start because value tensions and character stance axes appear early in story-heavy play, and forcing them into one-direction scales makes authoring less intuitive.

`flag` represents a boolean fact.

Properties may optionally define change behaviour. The first implementation should support only simple direct changes, bounded changes, and move-toward changes with semantic strengths such as `small`, `meaningful`, and `major`. More advanced behaviours such as challenge-weighted learning, decay, maintenance, or contextual scaling are deferred.
```

## My take

This is the sweet spot:

```text
Do now:
- property umbrella
- quantity / scale / spectrum / flag
- threshold labels
- natural-ish effects
- simple bounded + moveToward policy

Defer:
- challengeWeighted
- decay
- contextual wealth/significance calculations
- complex formulas
- AI-authored property definitions
```

So yes: the policy idea is heavy, but not bloated if it is treated as an extension seam. It lets the content stay human-readable while stopping the model from becoming “numbers go brrr”.
