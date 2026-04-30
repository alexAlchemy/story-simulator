import type {
  Effect,
  EntityId,
  GaugeKey,
  QuantityKey,
  RelationshipDimensionKey,
  RelationshipId
} from "@aphebis/core";

export type ShiftAmount = "slightly" | "moderately" | "strongly";

const amountDeltas = {
  slightly: 0.1,
  moderately: 0.2,
  strongly: 0.3
} satisfies Record<ShiftAmount, number>;

export function increaseEntityGauge(
  entityId: EntityId,
  key: GaugeKey,
  amount: ShiftAmount
): Effect {
  return {
    kind: "entityGauge",
    entityId,
    key,
    delta: amountDeltas[amount]
  };
}

export function decreaseEntityGauge(
  entityId: EntityId,
  key: GaugeKey,
  amount: ShiftAmount
): Effect {
  return {
    kind: "entityGauge",
    entityId,
    key,
    delta: -amountDeltas[amount]
  };
}

export function increaseRelationshipDimension(
  relationshipId: RelationshipId,
  key: RelationshipDimensionKey,
  amount: ShiftAmount
): Effect {
  return {
    kind: "relationshipDimension",
    relationshipId,
    key,
    delta: amountDeltas[amount]
  };
}

export function decreaseRelationshipDimension(
  relationshipId: RelationshipId,
  key: RelationshipDimensionKey,
  amount: ShiftAmount
): Effect {
  return {
    kind: "relationshipDimension",
    relationshipId,
    key,
    delta: -amountDeltas[amount]
  };
}

export function gainQuantity(
  entityId: EntityId,
  key: QuantityKey,
  amount: number
): Effect {
  return { kind: "entityQuantity", entityId, key, delta: amount };
}

export function spendQuantity(
  entityId: EntityId,
  key: QuantityKey,
  amount: number
): Effect {
  return { kind: "entityQuantity", entityId, key, delta: -amount };
}
