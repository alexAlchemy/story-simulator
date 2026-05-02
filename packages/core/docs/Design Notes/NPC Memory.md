Agreed. I’d park it as a **Design Note**, not an ADR.

For now, explicit NPC memory can be handled perfectly well as ordinary boolean properties / flags:

```ts
stablehand_helped_with_boundary: true
apprentice_felt_shamed: true
temple_healer_heard_about_free_draught: true
```

That keeps the runtime boring and avoids inventing a “memory system” too early.

A good note title would be:

```text
Design Note: NPC Memory as Future Scene Pressure
```

Or:

```text
Design Note: Remembered Choices and NPC-Specific Consequences
```

The key framing:

```text
Status: Exploratory
Current approach: model remembered events as boolean properties/flags
Future possibility: promote repeated patterns into a first-class memory/token model if authored content demands it
```

The useful design principle is:

> The important thing is not that memory has a special model. The important thing is that later scenes can prove specific people remember specific choices.

So for now:

```text
Do not create a memory subsystem.
Use boolean properties/flags for concrete remembered facts.
Let scene availability and text variants reference those flags.
Revisit only when flags become too numerous, too hard to query, or need richer metadata like source scene, valence, target NPC, or decay.
```

Definitely design-note goblin territory. Useful, not load-bearing yet.
