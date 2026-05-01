import { describe, expect, it } from "vitest";
import { compareLabels, validateThresholdScale } from "@aphebis/core";
import type { PropertyDefinition, PropertyThreshold } from "@aphebis/core";
import { propertyDefinitions } from "../semantics/definitions";
import type { CosyShopPropertyKey } from "../keys";

describe("property semantics", () => {
  it("defines property descriptions for every cosy shop property", () => {
    const propertyKeys = [
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
      "goodwill",
      "coins",
      "stock",
      "stablehand_helped",
      "stablehand_grateful",
      "stablehand_refused",
      "mistake_handled_gently",
      "mysterious_gift_accepted",
      "left_thanks_for_gift"
    ] satisfies CosyShopPropertyKey[];

    expect(Object.keys(propertyDefinitions).sort()).toEqual([...propertyKeys].sort());

    for (const definition of Object.values(propertyDefinitions)) {
      expect(definition.label).toBeTruthy();
      expect(definition.description).toBeTruthy();
    }
  });

  it("maps scale property boundaries deterministically", () => {
    expect(describeProperty(propertyDefinitions.fatigue, 0)).toMatchObject({
      label: "Rested",
      rank: 0
    });
    expect(describeProperty(propertyDefinitions.fatigue, 0.2)).toMatchObject({
      label: "Tired",
      rank: 1
    });
    expect(describeProperty(propertyDefinitions.fatigue, 0.449)).toMatchObject({
      label: "Tired",
      rank: 1
    });
    expect(describeProperty(propertyDefinitions.fatigue, 0.45)).toMatchObject({
      label: "Strained",
      rank: 2
    });
    expect(describeProperty(propertyDefinitions.fatigue, 0.9)).toMatchObject({
      label: "Spent",
      rank: 4
    });
  });

  it("keeps spectra as axes with neutral at zero", () => {
    expect(propertyDefinitions.compassion).toMatchObject({
      kind: "spectrum",
      negativePole: { label: "Cold" },
      positivePole: { label: "Compassionate" }
    });
    expect(describeProperty(propertyDefinitions.compassion, 0)).toMatchObject({
      label: "Neutral",
      description: "Compassion and detachment are still in ordinary balance."
    });
    expect(describeProperty(propertyDefinitions.compassion, -0.5).label).toBe("Cold");
    expect(describeProperty(propertyDefinitions.compassion, 0.7).label).toBe(
      "Compassionate"
    );
  });

  it("describes quantity properties relative to a reference value", () => {
    expect(describeQuantityProperty(propertyDefinitions.coins, 18, 30)).toMatchObject({
      label: "Close"
    });
    expect(describeQuantityProperty(propertyDefinitions.coins, 18, 300)).toMatchObject({
      label: "Desperate"
    });
    expect(describeQuantityProperty(propertyDefinitions.stock, 3, 4)).toMatchObject({
      label: "Manageable"
    });
    expect(describeQuantityProperty(propertyDefinitions.stock, 5, 4)).toMatchObject({
      label: "WellStocked"
    });
  });

  it("defines story facts as flag properties", () => {
    expect(propertyDefinitions.stablehand_helped).toMatchObject({
      kind: "flag",
      trueLabel: "Yes",
      falseLabel: "No"
    });
  });

  it("validates and compares threshold labels", () => {
    expect(() => validateThresholdScale([], 0)).toThrow(
      "Semantic threshold scale must not be empty."
    );
    expect(compareLabels(propertyDefinitions.trust.thresholds, "Tentative", "Wary")).toBe(1);
    expect(compareLabels(propertyDefinitions.trust.thresholds, "Wary", "Tentative")).toBe(-1);
    expect(compareLabels(propertyDefinitions.trust.thresholds, "Tentative", "Tentative")).toBe(0);
    expect(() =>
      compareLabels(propertyDefinitions.trust.thresholds, "Tentative", "Missing")
    ).toThrow("Cannot compare labels that are not present in the same threshold scale.");
  });
});

function describeProperty(definition: PropertyDefinition, value: number): PropertyThreshold {
  if (!("thresholds" in definition) || !definition.thresholds?.length) {
    throw new Error(`Property "${definition.key}" does not have thresholds.`);
  }

  return [...definition.thresholds]
    .reverse()
    .find((threshold) => value >= threshold.min) ?? definition.thresholds[0];
}

function describeQuantityProperty(
  definition: PropertyDefinition,
  value: number,
  referenceValue: number
): PropertyThreshold {
  const normalizedValue = referenceValue <= 0 ? Math.max(0, value) : Math.max(0, value / referenceValue);
  return describeProperty(definition, normalizedValue);
}
