# Cosy Shop System

`@aphebis/system-cosy-shop` is the reusable system layer for cosy apothecary/shopkeeping stories.

- Core owns primitive runtime contracts and engines: effects, conditions, scenes, world state, and resolution. It does not know what "low gold", "trust", a shop, or an apprentice means.
- System owns reusable game grammar: named scales, archetypes, shop standing, entity social gauges, world templates, and helper functions that compile to core-compatible primitives.
- Semantic definitions are descriptors for interpreting resulting state. They provide labels, thresholds, descriptions, rank comparisons, and context-aware quantity descriptions such as coins relative to rent. They do not apply effects, dampen deltas, or decide scene significance.
- Content owns authored scenes, day plans, endings, and story choices. Content should use system helpers where possible, and only drop to raw core effects for uncommon cases.
