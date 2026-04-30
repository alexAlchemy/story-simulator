# Cosy Shop System

`@aphebis/system-cosy-shop` is the reusable system layer for cosy apothecary/shopkeeping stories.

- Core owns primitive runtime contracts and engines: effects, conditions, scenes, world state, and resolution. It does not know what "low gold", "trust", a shop, or an apprentice means.
- System owns reusable game grammar: named scales, archetypes, relationship dimensions, world templates, and helper functions that compile to core-compatible primitives.
- Content owns authored scenes, day plans, endings, and story choices. Content should use system helpers where possible, and only drop to raw core effects for uncommon cases.
