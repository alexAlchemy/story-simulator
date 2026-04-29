import type {
  BoundedGaugeDefinition,
  SemanticChangeResult,
  SemanticValue,
  SignedGaugeDefinition
} from "./types";
import { describeBoundedGauge, describeSignedGauge } from "./describe";

export function applyBoundedGaugeChange<TKey extends string, TLabel extends string>(
  definition: BoundedGaugeDefinition<TKey, TLabel>,
  currentValue: number,
  intendedDelta: number
): SemanticChangeResult<TKey, TLabel> {
  return applySaturatingChange(definition, currentValue, intendedDelta, describeBoundedGauge);
}

export function applySignedGaugeChange<TKey extends string, TLabel extends string>(
  definition: SignedGaugeDefinition<TKey, TLabel>,
  currentValue: number,
  intendedDelta: number
): SemanticChangeResult<TKey, TLabel> {
  return applySaturatingChange(definition, currentValue, intendedDelta, describeSignedGauge);
}

function applySaturatingChange<TKey extends string, TLabel extends string, TDefinition extends {
  key: TKey;
  minimumValue: number;
  maximumValue: number;
  curve?: { power?: number; minimumFactor?: number };
}>(
  definition: TDefinition,
  currentValue: number,
  intendedDelta: number,
  describeValue: (definition: TDefinition, value: number) => SemanticValue<TKey, TLabel>
): SemanticChangeResult<TKey, TLabel> {
  const previous = describeValue(definition, currentValue);
  const power = definition.curve?.power ?? 1.35;
  const minimumFactor = definition.curve?.minimumFactor ?? 0.1;
  const direction = Math.sign(intendedDelta);
  const distanceToEdge =
    direction >= 0
      ? definition.maximumValue - previous.value
      : previous.value - definition.minimumValue;
  const saturation = minimumFactor + (1 - minimumFactor) * Math.pow(clamp01(distanceToEdge), power);
  const actualValue = clampRange(
    previous.value + intendedDelta * saturation,
    definition.minimumValue,
    definition.maximumValue
  );
  const next = describeValue(definition, actualValue);
  const actualDelta = next.value - previous.value;
  const changedLabel = previous.rank !== next.rank;
  const absorbed = Math.abs(actualDelta) < Math.abs(intendedDelta) * 0.5;

  return {
    key: definition.key,
    previous,
    next,
    intendedDelta,
    actualDelta,
    changedLabel,
    absorbed,
    explanation: buildExplanation(previous, next, intendedDelta, actualDelta, absorbed)
  };
}

function buildExplanation(
  previous: SemanticValue<string, string>,
  next: SemanticValue<string, string>,
  intendedDelta: number,
  actualDelta: number,
  absorbed: boolean
): string {
  if (intendedDelta === 0) {
    return "No change was applied.";
  }

  if (previous.rank === next.rank) {
    return absorbed
      ? "The change mostly disappeared into the current state and did not cross a new label."
      : "The value changed but stayed within the same semantic label.";
  }

  return actualDelta > 0
    ? "The change carried the value into a new, more intense label."
    : "The change softened the value into a lower semantic label.";
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function clampRange(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}
