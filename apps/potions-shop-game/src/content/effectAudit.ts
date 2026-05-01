import type { Effect, GameContent, GameState, Scene } from "@aphebis/core";

export type AuditedEffectKind =
  | "entityGauge"
  | "entityQuantity"
  | "relationshipDimension";

export type EffectAuditTarget = {
  id: string;
  kind: AuditedEffectKind;
  ownerId: string;
  key: string;
  label: string;
  initialValue: number;
  increments: number;
  decrements: number;
  unchanged: number;
  positiveDeltaTotal: number;
  negativeDeltaTotal: number;
  totalChanges: number;
  totalDelta: number;
  totalAbsoluteDelta: number;
  potentialMinimum: number;
  potentialNegative50: number;
  potentialNegative75: number;
  potentialPositive50: number;
  potentialPositive75: number;
  potentialMaximum: number;
  averageDelta: number;
  averageAbsoluteDelta: number;
  minDelta: number;
  maxDelta: number;
  sceneIds: string[];
  choiceIds: string[];
};

export type EffectAuditSummary = {
  targets: EffectAuditTarget[];
  totalScenes: number;
  totalChoices: number;
  totalAuditedEffects: number;
};

type MutableEffectAuditTarget = Omit<
  EffectAuditTarget,
  | "averageDelta"
  | "averageAbsoluteDelta"
  | "sceneIds"
  | "choiceIds"
> & {
  sceneIds: Set<string>;
  choiceIds: Set<string>;
};

export function auditSceneChoiceEffects(
  content: GameContent,
  baselineState?: GameState
): EffectAuditSummary {
  const targets = new Map<string, MutableEffectAuditTarget>();
  let totalChoices = 0;
  let totalAuditedEffects = 0;

  if (baselineState) {
    seedBaselineTargets(targets, baselineState);
  }

  for (const scene of Object.values(content.scenes)) {
    for (const choice of scene.choices) {
      totalChoices += 1;

      for (const effect of choice.effects) {
        const target = getAuditedEffectTarget(effect);

        if (!target) {
          continue;
        }

        totalAuditedEffects += 1;
        recordDelta(targets, target, scene, choice.id);
      }
    }
  }

  return {
    targets: [...targets.values()]
      .map(finalizeTarget)
      .sort((left, right) => left.id.localeCompare(right.id)),
    totalScenes: Object.keys(content.scenes).length,
    totalChoices,
    totalAuditedEffects
  };
}

function getAuditedEffectTarget(effect: Effect): AuditedEffectTargetSeed | undefined {
  switch (effect.kind) {
    case "entityGauge":
      return {
        id: `entity:${effect.entityId}.gauge:${effect.key}`,
        kind: effect.kind,
        ownerId: effect.entityId,
        key: effect.key,
        label: `${effect.entityId}.${effect.key}`,
        delta: effect.delta
      };
    case "entityQuantity":
      return {
        id: `entity:${effect.entityId}.quantity:${effect.key}`,
        kind: effect.kind,
        ownerId: effect.entityId,
        key: effect.key,
        label: `${effect.entityId}.${effect.key}`,
        delta: effect.delta
      };
    case "relationshipDimension":
      return {
        id: `relationship:${effect.relationshipId}.dimension:${effect.key}`,
        kind: effect.kind,
        ownerId: effect.relationshipId,
        key: effect.key,
        label: `${effect.relationshipId}.${effect.key}`,
        delta: effect.delta
      };
    default:
      return undefined;
  }
}

type AuditedEffectTargetSeed = {
  id: string;
  kind: AuditedEffectKind;
  ownerId: string;
  key: string;
  label: string;
  delta: number;
};

function seedBaselineTargets(
  targets: Map<string, MutableEffectAuditTarget>,
  state: GameState
): void {
  for (const entity of Object.values(state.world.entities)) {
    for (const [key, value] of Object.entries(entity.gauges)) {
      const id = `entity:${entity.id}.gauge:${key}`;
      targets.set(
        id,
        createEmptyTarget(id, "entityGauge", entity.id, key, value ?? 0)
      );
    }

    for (const [key, value] of Object.entries(entity.quantities)) {
      const id = `entity:${entity.id}.quantity:${key}`;
      targets.set(
        id,
        createEmptyTarget(id, "entityQuantity", entity.id, key, value ?? 0)
      );
    }
  }

  for (const relationship of Object.values(state.world.relationships)) {
    for (const [key, value] of Object.entries(relationship.dimensions)) {
      const id = `relationship:${relationship.id}.dimension:${key}`;
      targets.set(
        id,
        createEmptyTarget(
          id,
          "relationshipDimension",
          relationship.id,
          key,
          value ?? 0
        )
      );
    }
  }
}

function createEmptyTarget(
  id: string,
  kind: AuditedEffectKind,
  ownerId: string,
  key: string,
  initialValue = 0
): MutableEffectAuditTarget {
  return {
    id,
    kind,
    ownerId,
    key,
    label: `${ownerId}.${key}`,
    initialValue,
    increments: 0,
    decrements: 0,
    unchanged: 0,
    positiveDeltaTotal: 0,
    negativeDeltaTotal: 0,
    totalChanges: 0,
    totalDelta: 0,
    totalAbsoluteDelta: 0,
    potentialMinimum: initialValue,
    potentialNegative50: initialValue,
    potentialNegative75: initialValue,
    potentialPositive50: initialValue,
    potentialPositive75: initialValue,
    potentialMaximum: initialValue,
    minDelta: 0,
    maxDelta: 0,
    sceneIds: new Set<string>(),
    choiceIds: new Set<string>()
  };
}

function recordDelta(
  targets: Map<string, MutableEffectAuditTarget>,
  target: AuditedEffectTargetSeed,
  scene: Scene,
  choiceId: string
): void {
  const { delta } = target;
 const existing =
    targets.get(target.id) ??
    {
      ...target,
      initialValue: 0,
      increments: 0,
      decrements: 0,
      unchanged: 0,
      positiveDeltaTotal: 0,
      negativeDeltaTotal: 0,
      totalChanges: 0,
      totalDelta: 0,
      totalAbsoluteDelta: 0,
      potentialMinimum: 0,
      potentialNegative50: 0,
      potentialNegative75: 0,
      potentialPositive50: 0,
      potentialPositive75: 0,
      potentialMaximum: 0,
      minDelta: delta,
      maxDelta: delta,
      sceneIds: new Set<string>(),
      choiceIds: new Set<string>()
    };

  if (delta > 0) {
    existing.increments += 1;
    existing.positiveDeltaTotal += delta;
  } else if (delta < 0) {
    existing.decrements += 1;
    existing.negativeDeltaTotal += delta;
  } else {
    existing.unchanged += 1;
  }

  existing.totalChanges += 1;
  existing.totalDelta += delta;
  existing.totalAbsoluteDelta += Math.abs(delta);
  existing.minDelta = Math.min(existing.minDelta, delta);
  existing.maxDelta = Math.max(existing.maxDelta, delta);
  existing.sceneIds.add(scene.id);
  existing.choiceIds.add(`${scene.id}:${choiceId}`);

  targets.set(target.id, existing);
}

function finalizeTarget(target: MutableEffectAuditTarget): EffectAuditTarget {
  const potentialMinimum = target.initialValue + target.negativeDeltaTotal;
  const potentialMaximum = target.initialValue + target.positiveDeltaTotal;

  return {
    ...target,
    initialValue: formatAuditNumber(target.initialValue),
    positiveDeltaTotal: formatAuditNumber(target.positiveDeltaTotal),
    negativeDeltaTotal: formatAuditNumber(target.negativeDeltaTotal),
    totalDelta: formatAuditNumber(target.totalDelta),
    totalAbsoluteDelta: formatAuditNumber(target.totalAbsoluteDelta),
    potentialMinimum: formatAuditNumber(potentialMinimum),
    potentialNegative50: formatAuditNumber(
      target.initialValue + target.negativeDeltaTotal * 0.5
    ),
    potentialNegative75: formatAuditNumber(
      target.initialValue + target.negativeDeltaTotal * 0.75
    ),
    potentialPositive50: formatAuditNumber(
      target.initialValue + target.positiveDeltaTotal * 0.5
    ),
    potentialPositive75: formatAuditNumber(
      target.initialValue + target.positiveDeltaTotal * 0.75
    ),
    potentialMaximum: formatAuditNumber(potentialMaximum),
    averageDelta:
      target.totalChanges === 0
        ? 0
        : formatAuditNumber(target.totalDelta / target.totalChanges),
    averageAbsoluteDelta:
      target.totalChanges === 0
        ? 0
        : formatAuditNumber(target.totalAbsoluteDelta / target.totalChanges),
    minDelta: formatAuditNumber(target.minDelta),
    maxDelta: formatAuditNumber(target.maxDelta),
    sceneIds: [...target.sceneIds].sort(),
    choiceIds: [...target.choiceIds].sort()
  };
}

function formatAuditNumber(value: number): number {
  return Number(value.toFixed(3));
}
