import type {
  BeatChoice,
  GameContent,
  GameState,
  PropertyDefinition,
  PropertyThreshold,
  PropertyValue,
  Scene,
  SceneAftermathPropertyChange,
  SceneAftermathSpotlightProperty,
  SceneAftermathViewModel
} from "../domain";
import type { AppliedEffectChange } from "./applyEffects";

export function buildSceneAftermath(
  scene: Scene,
  choice: BeatChoice,
  beforeState: GameState,
  afterState: GameState,
  changes: AppliedEffectChange[],
  content: GameContent
): SceneAftermathViewModel | undefined {
  if (!choice.aftermath) {
    return undefined;
  }

  const spotlightKeys = new Set(
    (choice.aftermath.spotlightProperties ?? []).map(toSpotlightKey)
  );

  return {
    title: "Scene Aftermath",
    sceneId: scene.id,
    sceneTitle: scene.title,
    narration: choice.aftermath.narration,
    changes: changes
      .filter((change): change is Extract<AppliedEffectChange, { kind: "propertyChanged" }> =>
        change.kind === "propertyChanged"
      )
      .map((change) =>
        describePropertyChange(change, beforeState, afterState, content, spotlightKeys)
      )
      .filter((change): change is SceneAftermathPropertyChange => Boolean(change)),
    futureEchoText: choice.aftermath.futureEchoText ?? []
  };
}

function describePropertyChange(
  change: Extract<AppliedEffectChange, { kind: "propertyChanged" }>,
  beforeState: GameState,
  afterState: GameState,
  content: GameContent,
  spotlightKeys: Set<string>
): SceneAftermathPropertyChange | undefined {
  const entity = afterState.world.entities[change.entityId] ?? beforeState.world.entities[change.entityId];
  if (!entity) {
    return undefined;
  }

  const definition = content.semantics?.propertyDefinitions?.[change.property];
  const beforeLabel = describePropertyValue(change.before, definition);
  const afterLabel = describePropertyValue(change.after, definition);
  const spotlighted = spotlightKeys.has(toSpotlightKey(change));
  const semanticLabelChanged =
    beforeLabel.semantic !== undefined &&
    afterLabel.semantic !== undefined &&
    beforeLabel.semantic !== afterLabel.semantic;

  if (!spotlighted && !semanticLabelChanged) {
    return undefined;
  }

  const shouldUseSemanticLabels = semanticLabelChanged || typeof change.before === "boolean";

  return {
    entityId: change.entityId,
    entityName: entity.displayName,
    property: change.property,
    label: definition?.label ?? formatLabel(change.property),
    before: shouldUseSemanticLabels ? beforeLabel.display : formatRawValue(change.before),
    after: shouldUseSemanticLabels ? afterLabel.display : formatRawValue(change.after),
    beforeValue: change.before,
    afterValue: change.after,
    spotlighted
  };
}

function describePropertyValue(
  value: PropertyValue | undefined,
  definition: PropertyDefinition | undefined
): { display: string; semantic?: string } {
  if (typeof value === "boolean") {
    const label = value
      ? definition?.kind === "flag" ? definition.trueLabel : undefined
      : definition?.kind === "flag" ? definition.falseLabel : undefined;
    const display = label ?? (value ? "Yes" : "No");
    return { display, semantic: display };
  }

  if (typeof value !== "number") {
    return { display: "Unset" };
  }

  const threshold = findThreshold(definition, value);
  if (threshold) {
    return {
      display: formatLabel(threshold.label),
      semantic: threshold.label
    };
  }

  return { display: formatNumber(value) };
}

function findThreshold(
  definition: PropertyDefinition | undefined,
  value: number
): PropertyThreshold | undefined {
  if (!hasThresholds(definition)) {
    return undefined;
  }

  return [...definition.thresholds]
    .reverse()
    .find((threshold) => value >= threshold.min) ?? definition.thresholds[0];
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

function toSpotlightKey(value: SceneAftermathSpotlightProperty): string {
  return `${value.entityId}:${value.property}`;
}

function formatLabel(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatNumber(value: number): string {
  return Number(value.toFixed(3)).toString();
}

function formatRawValue(value: PropertyValue | undefined): string {
  if (typeof value === "number") {
    return formatNumber(value);
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return "Unset";
}
