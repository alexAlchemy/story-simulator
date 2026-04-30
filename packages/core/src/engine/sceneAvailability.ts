import type {
  GameContent,
  GameState,
  SceneNumericComparison,
  SceneSemanticComparison,
  SceneAvailabilityCondition,
  SceneCard,
  SemanticGaugeDefinition,
  WorldState
} from "../domain";
import {
  describeBoundedGauge,
  describeSignedGauge
} from "../domain/semantics";
import {
  getEntityGauge,
  getEntityQuantity,
  getRelationship,
  getRelationshipDimension
} from "./worldAccess";

export function canSeeScene(
  scene: SceneCard,
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
  scene: SceneCard,
  content: GameContent,
  world?: WorldState
): string[] {
  const issues: string[] = [];
  const conditions = [...(scene.availability?.all ?? []), ...(scene.availability?.any ?? [])];

  for (const condition of conditions) {
    switch (condition.kind) {
      case "resolvedScene":
        if (!content.scenes[condition.sceneId]) {
          issues.push(
            `${scene.id}: availability references unknown scene "${condition.sceneId}"`
          );
        }
        break;
      case "entityGauge":
        if (world && !world.entities[condition.entityId]) {
          issues.push(
            `${scene.id}: entityGauge availability references unknown entity "${condition.entityId}"`
          );
        }
        issues.push(
          ...validateSemanticComparison(
            scene.id,
            condition.kind,
            condition.key,
            condition,
            content.semantics?.entityGaugeDefinitions
          )
        );
        break;
      case "entityQuantity":
        if (world && !world.entities[condition.entityId]) {
          issues.push(
            `${scene.id}: entityQuantity availability references unknown entity "${condition.entityId}"`
          );
        }
        break;
      case "relationshipDimension":
        if (world && !world.relationships[condition.relationshipId]) {
          issues.push(
            `${scene.id}: relationshipDimension availability references unknown relationship "${condition.relationshipId}"`
          );
        }
        issues.push(
          ...validateSemanticComparison(
            scene.id,
            condition.kind,
            condition.key,
            condition,
            content.semantics?.relationshipDimensionDefinitions
          )
        );
        break;
      case "relationshipToken":
        if (world && !world.relationships[condition.relationshipId]) {
          issues.push(
            `${scene.id}: relationshipToken availability references unknown relationship "${condition.relationshipId}"`
          );
        }
        break;
      case "day":
      case "flag":
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
    case "flag":
      return state.flags[condition.key] === (condition.value ?? true);
    case "entityGauge":
      return matchesSemanticState(
        getEntityGauge(state, condition.entityId, condition.key),
        condition,
        content.semantics?.entityGaugeDefinitions?.[condition.key]
      );
    case "entityQuantity":
      return matchesNumericComparison(
        getEntityQuantity(state, condition.entityId, condition.key),
        condition
      );
    case "relationshipDimension":
      return matchesSemanticState(
        getRelationshipDimension(state, condition.relationshipId, condition.key),
        condition,
        content.semantics?.relationshipDimensionDefinitions?.[condition.key]
      );
    case "relationshipToken":
      return matchesRelationshipToken(state, condition);
    default:
      assertNever(condition);
  }
}

function matchesSemanticState(
  value: number,
  condition: SceneSemanticComparison & SceneNumericComparison,
  definition: SceneDefinitionLike | undefined
): boolean {
  if (!definition) {
    return !condition.equalsLabel && !condition.minLabel && !condition.maxLabel
      ? matchesNumericComparison(value, condition)
      : false;
  }

  const described = definition.family === "signedGauge"
    ? describeSignedGauge(definition, value)
    : describeBoundedGauge(definition, value);

  if (condition.equals !== undefined && described.value !== condition.equals) {
    return false;
  }

  if (condition.min !== undefined && described.value < condition.min) {
    return false;
  }

  if (condition.max !== undefined && described.value > condition.max) {
    return false;
  }

  if (condition.equalsLabel !== undefined && !labelsMatch(described.label, condition.equalsLabel)) {
    return false;
  }

  if (condition.minLabel !== undefined) {
    const threshold = findThresholdByLabel(definition, condition.minLabel);
    if (!threshold || described.rank < threshold.rank) {
      return false;
    }
  }

  if (condition.maxLabel !== undefined) {
    const threshold = findThresholdByLabel(definition, condition.maxLabel);
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

function matchesRelationshipToken(
  state: GameState,
  condition: Extract<SceneAvailabilityCondition, { kind: "relationshipToken" }>
): boolean {
  const relationship = getRelationship(state, condition.relationshipId);
  const token = relationship.tokens.find((candidate) => {
    if (condition.tokenId !== undefined && candidate.id !== condition.tokenId) {
      return false;
    }

    if (condition.tokenKind !== undefined && candidate.kind !== condition.tokenKind) {
      return false;
    }

    if (
      condition.tokenLabelIncludes !== undefined &&
      !candidate.label.toLowerCase().includes(condition.tokenLabelIncludes.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const present = condition.present ?? true;
  return present ? Boolean(token) : !token;
}

function validateSemanticComparison<
  TCondition extends SceneSemanticComparison
>(
  sceneId: string,
  kind: SceneAvailabilityCondition["kind"],
  key: string,
  condition: TCondition,
  definitions: Record<string, SceneDefinitionLike> | undefined
): string[] {
  const labels = [condition.minLabel, condition.maxLabel, condition.equalsLabel].filter(
    (label): label is string => Boolean(label)
  );
  if (labels.length === 0) {
    return [];
  }

  if (!definitions) {
    return [`${sceneId}: ${kind} availability has semantic labels but no semantic definitions`];
  }

  const definition = definitions[key];
  if (!definition) {
    return [`${sceneId}: ${kind} availability references unknown semantic key "${key}"`];
  }

  const issues: string[] = [];

  for (const label of labels) {
    if (!findThresholdByLabel(definition, label)) {
      issues.push(`${sceneId}: ${kind} availability references unknown label "${label}"`);
    }
  }

  return issues;
}

function findThresholdByLabel(
  definition: SceneDefinitionLike,
  label: string
): { rank: number; label: string } | undefined {
  return definition.thresholds.find((threshold) => labelsMatch(threshold.label, label));
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

type SceneDefinitionLike = SemanticGaugeDefinition;
