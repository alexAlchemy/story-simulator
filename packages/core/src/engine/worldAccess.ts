import type {
  EntityId,
  EntityState,
  GameState,
  GaugeKey,
  QuantityKey
} from "../domain";

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
            [key]: clampEntityGauge(entity, key, value)
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

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function clampEntityGauge(entity: EntityState, key: GaugeKey, value: number): number {
  const range = entity.gaugeRanges?.[key] ?? { minimumValue: 0, maximumValue: 1 };

  return clampRange(value, range.minimumValue, range.maximumValue);
}

function clampRange(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}
