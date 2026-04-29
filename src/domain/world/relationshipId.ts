import type { EntityId, RelationshipId } from "../ids";

export function relationshipId(from: EntityId, to: EntityId): RelationshipId {
  return `${from}->${to}`;
}

