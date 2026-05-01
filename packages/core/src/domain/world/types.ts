import type { EntityId } from "../ids";
import type { PropertyValue } from "../properties";
import type { PropertyKey } from "../properties";

export type EntityKind = string;

export type EntityState = {
  id: EntityId;
  kind: EntityKind;
  displayName: string;
  tags: string[];
  properties: Partial<Record<PropertyKey, PropertyValue>>;
};

export type WorldState = {
  entities: Record<EntityId, EntityState>;
};
