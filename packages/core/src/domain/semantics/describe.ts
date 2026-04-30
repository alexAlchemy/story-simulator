import type {
  OpenQuantityDefinition,
  OpenQuantityContext,
  SemanticThreshold,
  SemanticValue,
  SignedGaugeDefinition,
  BoundedGaugeDefinition
} from "./types";

export function validateThresholdScale<TLabel extends string>(
  thresholds: readonly SemanticThreshold<TLabel>[],
  minimumValue: number
): void {
  if (thresholds.length === 0) {
    throw new Error("Semantic threshold scale must not be empty.");
  }

  if (thresholds[0].min !== minimumValue) {
    throw new Error(
      `First threshold must start at ${minimumValue}, received ${thresholds[0].min}.`
    );
  }

  for (let index = 1; index < thresholds.length; index += 1) {
    const previous = thresholds[index - 1];
    const current = thresholds[index];

    if (current.min <= previous.min) {
      throw new Error("Semantic thresholds must be strictly ascending by min.");
    }

    if (current.rank <= previous.rank) {
      throw new Error("Semantic thresholds must be strictly ascending by rank.");
    }
  }
}

export function describeByThresholds<TKey extends string, TLabel extends string>(
  key: TKey,
  value: number,
  thresholds: readonly SemanticThreshold<TLabel>[],
  minimumValue: number,
  maximumValue: number
): SemanticValue<TKey, TLabel> {
  validateThresholdScale(thresholds, minimumValue);

  const clamped = clamp(value, minimumValue, maximumValue);
  const selected = [...thresholds].reverse().find((threshold) => clamped >= threshold.min);

  if (!selected) {
    throw new Error(`No semantic threshold matched value ${value}.`);
  }

  return {
    key,
    value: clamped,
    label: selected.label,
    rank: selected.rank,
    description: selected.description
  };
}

export function describeBoundedGauge<TKey extends string, TLabel extends string>(
  definition: BoundedGaugeDefinition<TKey, TLabel>,
  value: number
): SemanticValue<TKey, TLabel> {
  return describeByThresholds(
    definition.key,
    value,
    definition.thresholds,
    definition.minimumValue,
    definition.maximumValue
  );
}

export function describeSignedGauge<TKey extends string, TLabel extends string>(
  definition: SignedGaugeDefinition<TKey, TLabel>,
  value: number
): SemanticValue<TKey, TLabel> {
  return describeByThresholds(
    definition.key,
    value,
    definition.thresholds,
    definition.minimumValue,
    definition.maximumValue
  );
}

export function describeGauge<TKey extends string, TLabel extends string>(
  definition: BoundedGaugeDefinition<TKey, TLabel> | SignedGaugeDefinition<TKey, TLabel>,
  value: number
): SemanticValue<TKey, TLabel> {
  return definition.family === "signedGauge"
    ? describeSignedGauge(definition, value)
    : describeBoundedGauge(definition, value);
}

export function compareLabels<TLabel extends string>(
  thresholds: readonly SemanticThreshold<TLabel>[],
  left: TLabel,
  right: TLabel
): number {
  const leftThreshold = findThresholdByLabel(thresholds, left);
  const rightThreshold = findThresholdByLabel(thresholds, right);

  if (!leftThreshold || !rightThreshold) {
    throw new Error("Cannot compare labels that are not present in the same threshold scale.");
  }

  return Math.sign(leftThreshold.rank - rightThreshold.rank);
}

export function describeOpenQuantity<
  TKey extends string,
  TLabel extends string,
  TContext
>(
  definition: OpenQuantityDefinition<TKey, TLabel, TContext>,
  quantity: number,
  context: TContext
): SemanticValue<TKey, TLabel> {
  const semanticContext = definition.describeContext(context);
  validateThresholdScale(definition.thresholds, 0);

  const normalizedQuantity =
    semanticContext.referenceValue <= 0
      ? Math.max(0, quantity)
      : Math.max(0, quantity / semanticContext.referenceValue);
  const selected = [...definition.thresholds]
    .reverse()
    .find((threshold) => normalizedQuantity >= threshold.min);

  if (!selected) {
    throw new Error(`No semantic threshold matched value ${quantity}.`);
  }

  return {
    key: definition.key,
    value: quantity,
    label: selected.label,
    rank: selected.rank,
    description: selected.description
  };
}

export function describeContextSignal(context: OpenQuantityContext): string {
  return `${context.contextLabel}:${context.referenceValue}`;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function findThresholdByLabel<TLabel extends string>(
  thresholds: readonly SemanticThreshold<TLabel>[],
  label: TLabel
): SemanticThreshold<TLabel> | undefined {
  return thresholds.find((threshold) => threshold.label === label);
}
