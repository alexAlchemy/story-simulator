import type {
  EntityId,
  EntityState,
  GameState,
  GaugeKey,
  QuantityKey,
  RelationshipDimensionKey,
  RelationshipId,
  RelationshipState,
  RelationshipToken
} from "../domain/types";

export function getEntity(state: GameState, entityId: EntityId): EntityState {
  const entity = state.world.entities[entityId];
  if (!entity) {
    throw new Error(`Unknown entity id: ${entityId}`);
  }

  return entity;
}

export function getEntityGauge(
  state: GameState,
  entityId: EntityId,
  key: GaugeKey
): number {
  return getEntity(state, entityId).gauges[key] ?? 0;
}

export function getEntityQuantity(
  state: GameState,
  entityId: EntityId,
  key: QuantityKey
): number {
  return getEntity(state, entityId).quantities[key] ?? 0;
}

export function getRelationship(
  state: GameState,
  relationshipId: RelationshipId
): RelationshipState {
  const relationship = state.world.relationships[relationshipId];
  if (!relationship) {
    throw new Error(`Unknown relationship id: ${relationshipId}`);
  }

  return relationship;
}

export function getRelationshipDimension(
  state: GameState,
  relationshipId: RelationshipId,
  key: RelationshipDimensionKey
): number {
  return getRelationship(state, relationshipId).dimensions[key] ?? 0;
}

export function setEntityGauge(
  state: GameState,
  entityId: EntityId,
  key: GaugeKey,
  value: number
): GameState {
  const entity = getEntity(state, entityId);

  return {
    ...state,
    world: {
      ...state.world,
      entities: {
        ...state.world.entities,
        [entityId]: {
          ...entity,
          gauges: {
            ...entity.gauges,
            [key]: clamp01(value)
          }
        }
      }
    }
  };
}

export function adjustEntityGauge(
  state: GameState,
  entityId: EntityId,
  key: GaugeKey,
  delta: number
): GameState {
  return setEntityGauge(state, entityId, key, getEntityGauge(state, entityId, key) + delta);
}

export function setEntityQuantity(
  state: GameState,
  entityId: EntityId,
  key: QuantityKey,
  value: number
): GameState {
  const entity = getEntity(state, entityId);

  return {
    ...state,
    world: {
      ...state.world,
      entities: {
        ...state.world.entities,
        [entityId]: {
          ...entity,
          quantities: {
            ...entity.quantities,
            [key]: Math.max(0, value)
          }
        }
      }
    }
  };
}

export function adjustEntityQuantity(
  state: GameState,
  entityId: EntityId,
  key: QuantityKey,
  delta: number
): GameState {
  return setEntityQuantity(
    state,
    entityId,
    key,
    getEntityQuantity(state, entityId, key) + delta
  );
}

export function adjustRelationshipDimension(
  state: GameState,
  relationshipId: RelationshipId,
  key: RelationshipDimensionKey,
  delta: number
): GameState {
  const relationship = getRelationship(state, relationshipId);

  return {
    ...state,
    world: {
      ...state.world,
      relationships: {
        ...state.world.relationships,
        [relationshipId]: {
          ...relationship,
          dimensions: {
            ...relationship.dimensions,
            [key]: clamp01((relationship.dimensions[key] ?? 0) + delta)
          }
        }
      }
    }
  };
}

export function addRelationshipToken(
  state: GameState,
  relationshipId: RelationshipId,
  token: RelationshipToken
): GameState {
  const relationship = getRelationship(state, relationshipId);
  if (relationship.tokens.some((existing) => existing.id === token.id)) {
    return state;
  }

  return {
    ...state,
    world: {
      ...state.world,
      relationships: {
        ...state.world.relationships,
        [relationshipId]: {
          ...relationship,
          tokens: [...relationship.tokens, token]
        }
      }
    }
  };
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}
