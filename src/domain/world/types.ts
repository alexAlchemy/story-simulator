import type { EntityId, RelationshipId } from "../ids";
import type { GaugeKey, QuantityKey, RelationshipDimensionKey } from "./keys";

export type EntityKind = "person" | "group" | "shop" | "place";

export type RelationshipToken = {
  id: string;
  kind: "debt" | "promise" | "wound" | "secret" | "favour" | "obligation";
  label: string;
  description?: string;
  sourceSceneId?: string;
};

export type EntityState = {
  id: EntityId;
  kind: EntityKind;
  displayName: string;
  tags: string[];
  gauges: Partial<Record<GaugeKey, number>>;
  quantities: Partial<Record<QuantityKey, number>>;
  flags: Record<string, boolean>;
};

export type RelationshipState = {
  id: RelationshipId;
  from: EntityId;
  to: EntityId;
  dimensions: Partial<Record<RelationshipDimensionKey, number>>;
  flags: Record<string, boolean>;
  tokens: RelationshipToken[];
};

export type WorldState = {
  entities: Record<EntityId, EntityState>;
  relationships: Record<RelationshipId, RelationshipState>;
};

