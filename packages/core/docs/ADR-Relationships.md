# ADR: Relationship-Like State

## Decision

> For the initial vertical slice, Aphebis assumes a single player character. Relationship-like state is modelled as local disposition toward the player, not as first-class graph edges.

> This avoids prematurely introducing general relationship graphs, edge semantics, and graph database thinking. A first-class relationship model may be introduced later if the engine needs non-player-to-non-player relationships, many-to-many social graphs, directional relationship asymmetry, or reusable relationship occurrences.

> This should be a system-level shape, not a generic core requirement. Core entities should not be forced to carry a `dispositionToPlayer` property just because one game needs player-facing social state. The potions-shop system can define the facet it expects for character or faction entities, while the core engine remains generic.

## Suggested model

For now, a system can model player-facing social state as a typed facet on the entities that need it:

```ts
type DispositionToPlayer = {
  gauges: Partial<Record<RelationshipDimensionKey, number>>;
  flags: Record<string, boolean>;
};
```

A potions-shop entity can then opt into that facet:

```ts
type PotionsShopEntityState = EntityState & {
  dispositionToPlayer?: DispositionToPlayer;
};
```

If this becomes common enough, the system can define its own world state view or alias without changing the core entity contract:

```ts
type PotionsShopWorldState = {
  entities: Record<EntityId, PotionsShopEntityState>;
};
```

The core shape can stay simpler:

```ts
type EntityState = {
  id: EntityId;
  kind: EntityKind;
  displayName: string;
  tags: string[];
  gauges: Partial<Record<GaugeKey, number>>;
  quantities: Partial<Record<QuantityKey, number>>;
  flags: Record<string, boolean>;
};
```

Then `WorldState` no longer needs first-class relationship edges for this slice:

```ts
type WorldState = {
  entities: Record<EntityId, EntityState>;
};
```

That is much simpler.

## My only caution

Do not bury all emotional/social state in generic `gauges`.

This:

```ts
gauges: {
  confidence: 0.35,
  trustToPlayer: 0.4,
  affectionToPlayer: 0.2,
  fearToPlayer: 0
}
```

works, but it blurs “who this character is” with “how this character relates to the player”.

I’d prefer:

```ts
gauges: {
  confidence: 0.35
},
dispositionToPlayer: {
  gauges: {
    trust: 0.4,
    affection: 0.2,
    fear: 0
  },
  flags: {}
}
```

It preserves the simplification while keeping the conceptual boundary.

## Revisit triggers

Introduce a first-class relationship model when:

- non-player-to-non-player relationships matter to scenes, effects, or endings
- one entity needs dispositions toward multiple targets
- relationship state needs independent lifecycle, history, or occurrences
- social state needs to be queried independently of entities
- relationship effects become awkward because they must infer the target from a field name

So yes: cut first-class relationships for now. Keep relationship-style information as an explicit system-level disposition facet on the entities that need it.
