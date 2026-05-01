import { describe, expect, it } from "vitest";
import { createInitialState } from "../content/initialState";
import {
  changeEntityProperty,
  getNumericProperty,
  setEntityProperty
} from "@aphebis/core";
import { propertyDefinitions } from "@aphebis/system-cosy-shop";

describe("worldAccess", () => {
  it("clones state immutably when updating entities", () => {
    const state = createInitialState();
    const next = setEntityProperty(state, "shop", "coins", 22);

    expect(next).not.toBe(state);
    expect(next.world).not.toBe(state.world);
    expect(next.world.entities.shop).not.toBe(state.world.entities.shop);
    expect(getNumericProperty(state, "shop", "coins")).toBe(18);
    expect(getNumericProperty(next, "shop", "coins")).toBe(22);
  });

  it("clamps quantity properties at zero and bounded scales to 0..1", () => {
    let state = createInitialState();

    state = changeEntityProperty(
      state,
      "shop",
      "stock",
      { direction: "decrease", amount: 99 },
      propertyDefinitions.stock
    );
    state = changeEntityProperty(
      state,
      "player",
      "fatigue",
      { direction: "increase", amount: 2 },
      propertyDefinitions.fatigue
    );
    state = changeEntityProperty(
      state,
      "shop",
      "shopStanding",
      { direction: "increase", amount: 2 },
      propertyDefinitions.shopStanding
    );

    expect(getNumericProperty(state, "shop", "stock")).toBe(0);
    expect(getNumericProperty(state, "player", "fatigue")).toBe(1);
    expect(getNumericProperty(state, "shop", "shopStanding")).toBe(1);

    state = changeEntityProperty(
      state,
      "player",
      "fatigue",
      { direction: "decrease", amount: 99 },
      propertyDefinitions.fatigue
    );
    state = changeEntityProperty(
      state,
      "shop",
      "shopStanding",
      { direction: "decrease", amount: 99 },
      propertyDefinitions.shopStanding
    );

    expect(getNumericProperty(state, "player", "fatigue")).toBe(0);
    expect(getNumericProperty(state, "shop", "shopStanding")).toBe(0);
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

    expect(() => getNumericProperty(state, "ghost", "fatigue")).toThrow(
      "Unknown entity id: ghost"
    );
  });
});
