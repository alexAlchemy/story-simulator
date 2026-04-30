# @aphebis/core

Internal Aphebis runtime package. It is private and consumed through the pnpm workspace.

Dependency direction:

- `@aphebis/core` owns generic domain contracts and engine/runtime functions.
- Apps, systems, content, simulations, and UI may import `@aphebis/core`.
- `@aphebis/core` must not import app, content, UI, narrative tooling, or system-specific modules.

Runtime code that only accepts and returns core domain objects belongs here.
