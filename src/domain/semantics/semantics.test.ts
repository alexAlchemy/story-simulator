import { describe, expect, it } from "vitest";
import { applyBoundedGaugeChange, applySignedGaugeChange } from "./change";
import {
  fatigueDefinition,
  coinsDefinition,
  stockDefinition,
  signedGaugeDefinition,
  trustDefinition
} from "./definitions";
import {
  describeBoundedGauge,
  describeOpenQuantity,
  describeSignedGauge,
  validateThresholdScale
} from "./describe";
import type { SemanticThreshold } from "./types";

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

  it("keeps trust reusable as a generic relationship dimension", () => {
    expect(describeBoundedGauge(trustDefinition, 0.1).label).toBe("Distrustful");
    expect(describeBoundedGauge(trustDefinition, 0.5).label).toBe("Tentative");
    expect(describeBoundedGauge(trustDefinition, 0.95).label).toBe("Devoted");
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

  it("applies saturating changes with diminishing returns near extremes", () => {
    const midGain = applyBoundedGaugeChange(fatigueDefinition, 0.5, 0.2);
    const edgeGain = applyBoundedGaugeChange(fatigueDefinition, 0.95, 0.2);
    const midLoss = applyBoundedGaugeChange(fatigueDefinition, 0.5, -0.2);
    const edgeLoss = applyBoundedGaugeChange(fatigueDefinition, 0.05, -0.2);

    expect(Math.abs(edgeGain.actualDelta)).toBeLessThan(Math.abs(midGain.actualDelta));
    expect(Math.abs(edgeLoss.actualDelta)).toBeLessThan(Math.abs(midLoss.actualDelta));
    expect(midGain.changedLabel).toBe(false);
    expect(edgeGain.absorbed).toBe(true);
    expect(midGain.previous.value).toBe(0.5);
    expect(midGain.next.value).toBeGreaterThan(0.5);
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
    const changed = applySignedGaugeChange(stanceDefinition, -0.1, 0.6);

    expect(described.label).toBe("Cold");
    expect(changed.previous.label).toBe("Cold");
    expect(changed.next.value).toBeGreaterThan(changed.previous.value);
  });
});
