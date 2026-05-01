import type {
  ChangeStrength,
  EntityId,
  EntityState,
  GameState,
  GaugeKey,
  PropertyDefinition,
  PropertyKey,
  PropertyThreshold,
  PropertyValue,
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
  const entity = getEntity(state, entityId);
  const propertyValue = entity.properties[key];
  if (typeof propertyValue === "number") {
    return propertyValue;
  }

  return entity.gauges?.[key] ?? 0;
}

export function getEntityQuantity(
  state: GameState,
  entityId: EntityId,
  key: QuantityKey
): number {
  const entity = getEntity(state, entityId);
  const propertyValue = entity.properties[key];
  if (typeof propertyValue === "number") {
    return propertyValue;
  }

  return entity.quantities?.[key] ?? 0;
}

export function getEntityProperty(
  state: GameState,
  entityId: EntityId,
  key: PropertyKey
): PropertyValue | undefined {
  const entity = getEntity(state, entityId);
  return entity.properties[key] ?? entity.gauges?.[key] ?? entity.quantities?.[key] ?? entity.flags?.[key];
}

export function getNumericProperty(
  state: GameState,
  entityId: EntityId,
  key: PropertyKey
): number {
  const value = getEntityProperty(state, entityId, key);
  return typeof value === "number" ? value : 0;
}

export function getBooleanProperty(
  state: GameState,
  entityId: EntityId,
  key: PropertyKey
): boolean {
  const value = getEntityProperty(state, entityId, key);
  return value === true;
}

export function setEntityProperty(
  state: GameState,
  entityId: EntityId,
  key: PropertyKey,
  value: PropertyValue
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
          properties: {
            ...entity.properties,
            [key]: value
          }
        }
      }
    }
  };
}

export function changeEntityProperty(
  state: GameState,
  entityId: EntityId,
  key: PropertyKey,
  change: {
    direction: "increase" | "decrease" | "toward";
    strength?: ChangeStrength;
    magnitude?: ChangeStrength;
    amount?: number;
    pole?: string;
    ceilingLabel?: string;
    floorLabel?: string;
  },
  definition?: PropertyDefinition
): GameState {
  const current = getNumericProperty(state, entityId, key);
  const amount = change.amount ?? getPolicyAmount(definition, change.strength ?? "small");
  const signedAmount = getSignedAmount(definition, change, amount);
  let nextValue = current + signedAmount;

  nextValue = applyRange(definition, nextValue);
  nextValue = applyLabelBounds(definition, nextValue, change.floorLabel, change.ceilingLabel);
  nextValue = applySignificanceGates(
    definition,
    current,
    nextValue,
    change.magnitude ?? change.strength ?? "small"
  );

  if (definition?.kind === "quantity") {
    nextValue = Math.max(definition.minimumValue ?? 0, nextValue);
  }

  return setEntityProperty(state, entityId, key, nextValue);
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
          properties: {
            ...entity.properties,
            [key]: clampEntityGauge(entity, key, value)
          },
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
          properties: {
            ...entity.properties,
            [key]: Math.max(0, value)
          },
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

function getPolicyAmount(
  definition: PropertyDefinition | undefined,
  strength: ChangeStrength
): number {
  if (!definition || definition.kind === "flag") {
    return 0;
  }

  const policy = definition.changePolicy ?? { kind: "direct" };
  if (policy.kind === "direct") {
    return 0;
  }

  return policy.amounts[strength] ?? 0;
}

function getSignedAmount(
  definition: PropertyDefinition | undefined,
  change: {
    direction: "increase" | "decrease" | "toward";
    pole?: string;
  },
  amount: number
): number {
  if (change.direction === "increase") {
    return amount;
  }

  if (change.direction === "decrease") {
    return -amount;
  }

  if (definition?.kind === "spectrum") {
    const targetPole = normalizeLabel(change.pole ?? "");
    if (targetPole === normalizeLabel(definition.negativePole.label)) {
      return -amount;
    }
    if (targetPole === normalizeLabel(definition.positivePole.label)) {
      return amount;
    }
  }

  return amount;
}

function applyRange(definition: PropertyDefinition | undefined, value: number): number {
  if (!definition || definition.kind === "flag" || definition.kind === "quantity") {
    return value;
  }

  return clampRange(value, definition.minimumValue, definition.maximumValue);
}

function applyLabelBounds(
  definition: PropertyDefinition | undefined,
  value: number,
  floorLabel: string | undefined,
  ceilingLabel: string | undefined
): number {
  if (!hasThresholds(definition)) {
    return value;
  }

  let next = value;
  const floor = floorLabel ? findThresholdByLabel(definition, floorLabel) : undefined;
  const ceiling = ceilingLabel ? findThresholdByLabel(definition, ceilingLabel) : undefined;

  if (floor) {
    next = Math.max(next, floor.min);
  }
  if (ceiling) {
    next = Math.min(next, ceiling.min);
  }

  return next;
}

function applySignificanceGates(
  definition: PropertyDefinition | undefined,
  current: number,
  next: number,
  magnitude: ChangeStrength
): number {
  if (!hasThresholds(definition)) {
    return next;
  }

  if (next > current) {
    for (const threshold of definition.thresholds) {
      if (
        threshold.requiresMagnitude &&
        current < threshold.min &&
        next >= threshold.min &&
        compareStrength(magnitude, threshold.requiresMagnitude) < 0
      ) {
        return Math.min(next, threshold.min - Number.EPSILON);
      }
    }
  }

  if (next < current) {
    for (const threshold of [...definition.thresholds].reverse()) {
      if (
        threshold.requiresMagnitude &&
        current >= threshold.min &&
        next < threshold.min &&
        compareStrength(magnitude, threshold.requiresMagnitude) < 0
      ) {
        return Math.max(next, threshold.min);
      }
    }
  }

  return next;
}

function findThresholdByLabel(
  definition: PropertyDefinition & { thresholds: readonly PropertyThreshold[] },
  label: string
): { min: number; label: string } | undefined {
  return definition.thresholds.find((threshold) =>
    normalizeLabel(threshold.label) === normalizeLabel(label)
  );
}

function hasThresholds(
  definition: PropertyDefinition | undefined
): definition is PropertyDefinition & { thresholds: readonly PropertyThreshold[] } {
  return Boolean(
    definition &&
      "thresholds" in definition &&
      Array.isArray(definition.thresholds) &&
      definition.thresholds.length > 0
  );
}

function compareStrength(left: ChangeStrength, right: ChangeStrength): number {
  return strengthRank(left) - strengthRank(right);
}

function strengthRank(value: ChangeStrength): number {
  return ["trace", "minor", "small", "meaningful", "major", "defining"].indexOf(value);
}

function normalizeLabel(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}
