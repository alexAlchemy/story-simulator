# ADR: Tokens

## Decision

Terminology note: [ADR: Properties](./ADR-Properties.md) supersedes the `gauge` and standalone `flag` vocabulary used in examples here. Read continuous state as `scale` or `spectrum` properties, and rule-relevant booleans as `flag` properties. The token decision still stands.

> The initial core will not include first-class relationship tokens.

> Continuous emotional state is represented with gauges. Rule-relevant qualitative facts are represented with flags. Narrative history remains available through resolved scenes and log entries.

> A token or memory model may be introduced later if flags become too flat, repeated narrative facts need typed metadata, or AI narration needs structured remembered facts beyond simple booleans.

## Rationale

Many social or drama-focused tabletop RPGs use token-like mechanics to represent social leverage, emotional charge, or unresolved relational pressure. For example, *Masks: A New Generation* uses **Influence** to show that one character's opinion matters to another, while games descended from *Apocalypse World* often use ideas like **Strings**, **Hold**, **Debt**, or similar currencies to represent leverage, obligation, intimacy, or power.

These are not simply numeric relationship scores. They are discrete dramatic handles that can be spent, invoked, or referenced by rules. A token such as "Mara knows you lied to the healer" or "The apprentice owes you a favour" can be more narratively expressive than `trust +1`, because it captures a specific remembered fact with social consequence.

Aphebis may eventually benefit from a similar concept, especially if the engine needs structured memories, promises, debts, secrets, wounds, or social leverage that can be referenced by later scenes or AI narration. However, first-class tokens are deliberately deferred for the initial vertical slice. They add a new modelling primitive with questions of ownership, duration, stacking, visibility, spending, expiry, and scene availability semantics.

For now, the simpler split is:

- gauges represent intensity
- flags represent rule-relevant discrete facts
- resolved scenes and log entries represent narrative history

## Thin-slice model

For now, player-facing social state can stay inside the system-level disposition facet described in [ADR: Relationship-Like State](./ADR-Relationships.md):

```ts
type DispositionToPlayer = {
  gauges: Partial<Record<RelationshipDimensionKey, number>>;
  flags: Record<string, boolean>;
};
```

There is no token collection in the thin-slice model. A remembered fact that matters to rules should be represented as a flag:

```ts
dispositionToPlayer: {
  gauges: {
    trust: 0.4,
    affection: 0.2
  },
  flags: {
    owesFavour: true
  }
}
```

Then effects stay simple:

```ts
{ kind: "entityGauge", entityId: "apprentice", key: "confidence", delta: 0.1 }

{ kind: "dispositionToPlayerGauge", entityId: "apprentice", key: "trust", delta: 0.1 }

{ kind: "entityFlag", entityId: "apprentice", key: "hidMistake", value: true }

{ kind: "dispositionToPlayerFlag", entityId: "apprentice", key: "owesFavour", value: true }
```

That gives you 80% of the expressive power with 20% of the model.

## Revisit triggers

Introduce a token or memory model when:

- flags need typed metadata such as source, visibility, strength, owner, or expiry
- repeated narrative facts need stacking, counting, or independent identities
- rules need to spend, invoke, transfer, reveal, or consume remembered facts
- scene availability needs richer matching than boolean flag checks
- AI narration needs structured remembered facts beyond resolved scenes and log entries

## Summary

Gauges represent intensity. Flags represent rule-relevant discrete facts. Resolved scenes and logs represent narrative history. Tokens are deferred until discrete facts need richer structure.
