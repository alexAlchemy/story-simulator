import { describe, expect, it } from "vitest";
import {
  compareLabels,
  describeGauge,
  entityGaugeDefinitions,
  fatigueDefinition,
  coinsDefinition,
  stockDefinition,
  signedGaugeDefinition,
  trustDefinition
} from "../semantics/definitions";
import type { CosyShopGaugeKey } from "../keys";
import {
  describeBoundedGauge,
  describeOpenQuantity,
  describeSignedGauge,
  validateThresholdScale
} from "@aphebis/core";
import type { SemanticThreshold } from "@aphebis/core";

describe("semantic primitives", () => {
  it("maps bounded gauge boundaries deterministically", () => {
    expect(describeBoundedGauge(fatigueDefinition, 0)).toMatchObject({
      label: "Rested",
      rank: 0
    });
    expect(describeBoundedGauge(fatigueDefinition, 0.2)).toMatchObject({
      label: "Tired",
      rank: 1
    });
    expect(describeBoundedGauge(fatigueDefinition, 0.449)).toMatchObject({
      label: "Tired",
      rank: 1
    });
    expect(describeBoundedGauge(fatigueDefinition, 0.45)).toMatchObject({
      label: "Strained",
      rank: 2
    });
    expect(describeBoundedGauge(fatigueDefinition, 0.7)).toMatchObject({
      label: "Exhausted",
      rank: 3
    });
    expect(describeBoundedGauge(fatigueDefinition, 0.9)).toMatchObject({
      label: "Spent",
      rank: 4
    });
  });

  it("keeps trust reusable as a social gauge", () => {
    expect(describeBoundedGauge(trustDefinition, 0.1).label).toBe("Distrustful");
    expect(describeBoundedGauge(trustDefinition, 0.5).label).toBe("Tentative");
    expect(describeBoundedGauge(trustDefinition, 0.95).label).toBe("Devoted");
  });

  it("defines semantic descriptions for every world gauge", () => {
    const gaugeKeys = [
      "fatigue",
      "compassion",
      "prudence",
      "ambition",
      "confidence",
      "gossipHeat",
      "trust",
      "affection",
      "fear",
      "shopStanding",
      "goodwill"
    ] satisfies CosyShopGaugeKey[];

    expect(Object.keys(entityGaugeDefinitions).sort()).toEqual([...gaugeKeys].sort());

    for (const definition of Object.values(entityGaugeDefinitions)) {
      const described =
        definition.family === "signedGauge"
          ? describeSignedGauge(definition, 0)
          : describeBoundedGauge(definition, 0.5);

      expect(described.label).toBeTruthy();
      expect(described.description).toBeTruthy();
    }
  });

  it("treats signed descriptors as axes with neutral at zero", () => {
    expect(describeSignedGauge(entityGaugeDefinitions.compassion, 0)).toMatchObject({
      label: "Neutral",
      description: "Compassion and detachment are still in ordinary balance."
    });
    expect(describeSignedGauge(entityGaugeDefinitions.compassion, -0.5).label).toBe("Cold");
    expect(describeSignedGauge(entityGaugeDefinitions.compassion, 0.7).label).toBe(
      "Compassionate"
    );

    expect(describeSignedGauge(entityGaugeDefinitions.prudence, 0)).toMatchObject({
      label: "Neutral",
      description: "Prudence and impulse are still in ordinary balance."
    });
    expect(describeSignedGauge(entityGaugeDefinitions.ambition, 0)).toMatchObject({
      label: "Neutral",
      description: "Ambition and contentment are still in ordinary balance."
    });
  });

  it("validates threshold scales", () => {
    expect(() =>
      validateThresholdScale([], 0)
    ).toThrow("Semantic threshold scale must not be empty.");

    expect(() =>
      validateThresholdScale(
        [
          { rank: 0, min: 0.1, label: "A", description: "" },
          { rank: 1, min: 0.5, label: "B", description: "" }
        ],
        0
      )
    ).toThrow("First threshold must start at 0, received 0.1.");

    expect(() =>
      validateThresholdScale(
        [
          { rank: 0, min: 0, label: "A", description: "" },
          { rank: 1, min: 0.4, label: "B", description: "" },
          { rank: 2, min: 0.4, label: "C", description: "" }
        ],
        0
      )
    ).toThrow("Semantic thresholds must be strictly ascending by min.");

    expect(() =>
      validateThresholdScale(
        [
          { rank: 0, min: 0, label: "A", description: "" },
          { rank: 0, min: 0.4, label: "B", description: "" }
        ],
        0
      )
    ).toThrow("Semantic thresholds must be strictly ascending by rank.");
  });

  it("describes open quantities relative to context", () => {
    expect(describeOpenQuantity(coinsDefinition, 18, { rentAmount: 30 })).toMatchObject({
      label: "Close"
    });
    expect(describeOpenQuantity(coinsDefinition, 18, { rentAmount: 300 })).toMatchObject({
      label: "Desperate"
    });
    expect(describeOpenQuantity(stockDefinition, 3, { expectedDemand: 4 })).toMatchObject({
      label: "Manageable"
    });
    expect(describeOpenQuantity(stockDefinition, 5, { expectedDemand: 4 })).toMatchObject({
      label: "WellStocked"
    });
  });

  it("supports signed gauges in the primitive layer", () => {
    const stanceDefinition = signedGaugeDefinition("stance", [
      { rank: 0, min: -1, label: "Hostile", description: "Actively against the other side." },
      { rank: 1, min: -0.2, label: "Cold", description: "The distance remains obvious." },
      { rank: 2, min: 0, label: "Neutral", description: "Neither side is pulling hard." },
      { rank: 3, min: 0.4, label: "Warm", description: "Inclined toward goodwill." },
      { rank: 4, min: 0.8, label: "Aligned", description: "Strongly leaning together." }
    ] as const satisfies readonly SemanticThreshold<string>[]);

    const described = describeSignedGauge(stanceDefinition, -0.1);

    expect(described.label).toBe("Cold");
  });

  it("describes known system gauges by key without deciding effects", () => {
    expect(describeGauge("fatigue", 0.7)).toMatchObject({
      key: "fatigue",
      label: "Exhausted",
      rank: 3
    });
    expect(describeGauge("trust", 0.5)).toMatchObject({
      key: "trust",
      label: "Tentative",
      rank: 2
    });
  });

  it("compares labels by threshold rank", () => {
    expect(compareLabels("trust", "Tentative", "Wary")).toBe(1);
    expect(compareLabels("trust", "Wary", "Tentative")).toBe(-1);
    expect(compareLabels("trust", "Tentative", "Tentative")).toBe(0);
    expect(() => compareLabels("trust", "Tentative", "Missing")).toThrow(
      "Cannot compare labels that are not present in the same threshold scale."
    );
  });
});
