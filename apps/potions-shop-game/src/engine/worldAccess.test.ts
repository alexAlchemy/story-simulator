import { describe, expect, it } from "vitest";
import { createInitialState } from "../content/initialState";
import {
  adjustEntityGauge,
  adjustEntityQuantity,
  changeEntityProperty,
  getEntityGauge,
  getEntityQuantity,
  getNumericProperty
} from "@aphebis/core";
import { propertyDefinitions } from "@aphebis/system-cosy-shop";

describe("worldAccess", () => {
  it("clones state immutably when updating entities", () => {
    const state = createInitialState();
    const next = adjustEntityQuantity(state, "shop", "coins", 4);

    expect(next).not.toBe(state);
    expect(next.world).not.toBe(state.world);
    expect(next.world.entities.shop).not.toBe(state.world.entities.shop);
    expect(getEntityQuantity(state, "shop", "coins")).toBe(18);
    expect(getEntityQuantity(next, "shop", "coins")).toBe(22);
  });

  it("clamps quantities at zero and bounded gauges to 0..1", () => {
    let state = createInitialState();

    state = adjustEntityQuantity(state, "shop", "stock", -99);
    state = adjustEntityGauge(state, "player", "fatigue", 2);
    state = adjustEntityGauge(state, "shop", "shopStanding", 2);

    expect(getEntityQuantity(state, "shop", "stock")).toBe(0);
    expect(getEntityGauge(state, "player", "fatigue")).toBe(1);
    expect(getEntityGauge(state, "shop", "shopStanding")).toBe(1);

    state = adjustEntityGauge(state, "player", "fatigue", -99);
    state = adjustEntityGauge(state, "shop", "shopStanding", -99);

    expect(getEntityGauge(state, "player", "fatigue")).toBe(0);
    expect(getEntityGauge(state, "shop", "shopStanding")).toBe(0);
  });

  it("preserves negative values for spectrum properties", () => {
    let state = createInitialState();

    state = changeEntityProperty(
      state,
      "player",
      "compassion",
      { direction: "decrease", amount: 0.75 },
      propertyDefinitions.compassion
    );
    expect(getNumericProperty(state, "player", "compassion")).toBe(-0.75);

    state = changeEntityProperty(
      state,
      "player",
      "compassion",
      { direction: "decrease", amount: 99 },
      propertyDefinitions.compassion
    );
    expect(getNumericProperty(state, "player", "compassion")).toBe(-1);
  });

  it("throws clear errors for missing ids", () => {
    const state = createInitialState();

    expect(() => getEntityGauge(state, "ghost", "fatigue")).toThrow(
      "Unknown entity id: ghost"
    );
  });
});
