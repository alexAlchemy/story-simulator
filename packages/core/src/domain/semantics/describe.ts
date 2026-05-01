import type { SemanticThreshold, SemanticValue } from "./types";

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

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function findThresholdByLabel<TLabel extends string>(
  thresholds: readonly SemanticThreshold<TLabel>[],
  label: TLabel
): SemanticThreshold<TLabel> | undefined {
  return thresholds.find((threshold) => threshold.label === label);
}
