import type { EntityId } from "../ids";
import type { GaugeKey, PropertyKey, QuantityKey } from "./keys";
import type { PropertyValue } from "../properties";

export type EntityKind = string;

export type EntityState = {
  id: EntityId;
  kind: EntityKind;
  displayName: string;
  tags: string[];
  properties: Partial<Record<PropertyKey, PropertyValue>>;
  gauges?: Partial<Record<GaugeKey, number>>;
  gaugeRanges?: Partial<Record<GaugeKey, { minimumValue: number; maximumValue: number }>>;
  quantities?: Partial<Record<QuantityKey, number>>;
  flags?: Record<string, boolean>;
};

export type WorldState = {
  entities: Record<EntityId, EntityState>;
};
