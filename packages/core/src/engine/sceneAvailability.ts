import type {
  GameContent,
  GameState,
  SceneNumericComparison,
  SceneAvailabilityCondition,
  Scene,
  PropertyDefinition,
  PropertyThreshold,
  WorldState
} from "../domain";
import { getEntityProperty } from "./worldAccess";

export function canSeeScene(
  scene: Scene,
  state: GameState,
  content: GameContent
): boolean {
  const issues = validateSceneAvailability(scene, content, state.world);
  if (issues.length > 0) {
    throw new Error(issues.join("; "));
  }

  const allConditions = scene.availability?.all ?? [];
  const anyConditions = scene.availability?.any;

  const allPass = allConditions.every((condition) =>
    matchesSceneAvailabilityCondition(condition, state, content)
  );
  const anyPass =
    anyConditions === undefined
      ? true
      : anyConditions.length > 0 &&
        anyConditions.some((condition) =>
          matchesSceneAvailabilityCondition(condition, state, content)
        );

  return allPass && anyPass;
}

export function validateSceneAvailability(
  scene: Scene,
  content: GameContent,
  world?: WorldState
): string[] {
  const issues: string[] = [];
  const conditions = [...(scene.availability?.all ?? []), ...(scene.availability?.any ?? [])];

  for (const condition of conditions) {
    switch (condition.kind) {
      case "property":
        if (world && !world.entities[condition.entityId]) {
          issues.push(
            `${scene.id}: property availability references unknown entity "${condition.entityId}"`
          );
        }
        issues.push(
          ...validatePropertyComparison(
            scene.id,
            condition.property,
            condition,
            content.semantics?.propertyDefinitions
          )
        );
        break;
      case "resolvedScene":
        if (!content.scenes[condition.sceneId]) {
          issues.push(
            `${scene.id}: availability references unknown scene "${condition.sceneId}"`
          );
        }
        break;
      case "day":
        break;
      default:
        assertNever(condition);
    }
  }

  if (scene.availability?.any && scene.availability.any.length === 0) {
    issues.push(`${scene.id}: availability.any must not be empty`);
  }

  return issues;
}

function matchesSceneAvailabilityCondition(
  condition: SceneAvailabilityCondition,
  state: GameState,
  content: GameContent
): boolean {
  switch (condition.kind) {
    case "day":
      return matchesNumericComparison(state.day, condition);
    case "resolvedScene":
      return (condition.present ?? true)
        ? state.resolvedScenes.includes(condition.sceneId)
        : !state.resolvedScenes.includes(condition.sceneId);
    case "property":
      return matchesPropertyState(
        getEntityProperty(state, condition.entityId, condition.property),
        condition,
        content.semantics?.propertyDefinitions?.[condition.property]
      );
    default:
      assertNever(condition);
  }
}

function matchesPropertyState(
  value: string | number | boolean | undefined,
  condition: Extract<SceneAvailabilityCondition, { kind: "property" }>,
  definition: PropertyDefinition | undefined
): boolean {
  if (condition.value !== undefined) {
    return value === condition.value;
  }

  if (typeof value === "boolean") {
    return value === true;
  }

  if (typeof value !== "number") {
    return false;
  }

  if (!matchesNumericComparison(value, condition)) {
    return false;
  }

  if (!condition.equalsLabel && !condition.minLabel && !condition.maxLabel) {
    return true;
  }

  if (!hasThresholds(definition)) {
    return false;
  }

  const described = describePropertyByThreshold(definition, value);

  if (condition.equalsLabel !== undefined && !labelsMatch(described.label, condition.equalsLabel)) {
    return false;
  }

  if (condition.minLabel !== undefined) {
    const threshold = findPropertyThresholdByLabel(definition, condition.minLabel);
    if (!threshold || described.rank < threshold.rank) {
      return false;
    }
  }

  if (condition.maxLabel !== undefined) {
    const threshold = findPropertyThresholdByLabel(definition, condition.maxLabel);
    if (!threshold || described.rank > threshold.rank) {
      return false;
    }
  }

  return true;
}

function matchesNumericComparison(
  value: number,
  condition: SceneNumericComparison
): boolean {
  if (condition.equals !== undefined && value !== condition.equals) {
    return false;
  }

  if (condition.min !== undefined && value < condition.min) {
    return false;
  }

  if (condition.max !== undefined && value > condition.max) {
    return false;
  }

  return true;
}

function validatePropertyComparison(
  sceneId: string,
  key: string,
  condition: Extract<SceneAvailabilityCondition, { kind: "property" }>,
  definitions: Record<string, PropertyDefinition> | undefined
): string[] {
  const labels = [condition.minLabel, condition.maxLabel, condition.equalsLabel].filter(
    (label): label is string => Boolean(label)
  );
  if (labels.length === 0) {
    return [];
  }

  if (!definitions) {
    return [`${sceneId}: property availability has semantic labels but no property definitions`];
  }

  const definition = definitions[key];
  if (!definition) {
    return [`${sceneId}: property availability references unknown property "${key}"`];
  }

  if (!hasThresholds(definition)) {
    return [`${sceneId}: property availability references labels on non-threshold property "${key}"`];
  }

  const issues: string[] = [];
  for (const label of labels) {
    if (!findPropertyThresholdByLabel(definition, label)) {
      issues.push(`${sceneId}: property availability references unknown label "${label}"`);
    }
  }

  return issues;
}

function findPropertyThresholdByLabel(
  definition: PropertyDefinition & { thresholds: readonly PropertyThreshold[] },
  label: string
): { rank: number; min: number; label: string } | undefined {
  return definition.thresholds.find((threshold) => labelsMatch(threshold.label, label));
}

function describePropertyByThreshold(
  definition: PropertyDefinition & { thresholds: readonly PropertyThreshold[] },
  value: number
): { label: string; rank: number } {
  const selected = [...definition.thresholds]
    .reverse()
    .find((threshold) => value >= threshold.min);

  if (!selected) {
    const first = definition.thresholds[0];
    return { label: first.label, rank: first.rank };
  }

  return { label: selected.label, rank: selected.rank };
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

function labelsMatch(left: string, right: string): boolean {
  return normalizeLabel(left) === normalizeLabel(right);
}

function normalizeLabel(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function assertNever(value: never): never {
  throw new Error(`Unexpected scene availability condition: ${JSON.stringify(value)}`);
}
