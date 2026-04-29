import { describe, expect, it } from "vitest";
import { createInitialState } from "../domain/initialState";
import {
  adjustEntityGauge,
  adjustEntityQuantity,
  adjustRelationshipDimension,
  getEntityGauge,
  getEntityQuantity,
  getRelationshipDimension
} from "./worldAccess";

describe("worldAccess", () => {
  it("clones state immutably when updating entities and relationships", () => {
    const state = createInitialState();
    const next = adjustEntityQuantity(state, "shop", "coins", 4);

    expect(next).not.toBe(state);
    expect(next.world).not.toBe(state.world);
    expect(next.world.entities.shop).not.toBe(state.world.entities.shop);
    expect(getEntityQuantity(state, "shop", "coins")).toBe(18);
    expect(getEntityQuantity(next, "shop", "coins")).toBe(22);
  });

  it("clamps quantities at zero and gauges/dimensions to 0..1", () => {
    let state = createInitialState();

    state = adjustEntityQuantity(state, "shop", "stock", -99);
    state = adjustEntityGauge(state, "player", "compassion", 2);
    state = adjustRelationshipDimension(state, "town->shop", "trust", 2);

    expect(getEntityQuantity(state, "shop", "stock")).toBe(0);
    expect(getEntityGauge(state, "player", "compassion")).toBe(1);
    expect(getRelationshipDimension(state, "town->shop", "trust")).toBe(1);

    state = adjustEntityGauge(state, "player", "compassion", -99);
    state = adjustRelationshipDimension(state, "town->shop", "trust", -99);

    expect(getEntityGauge(state, "player", "compassion")).toBe(0);
    expect(getRelationshipDimension(state, "town->shop", "trust")).toBe(0);
  });

  it("throws clear errors for missing ids", () => {
    const state = createInitialState();

    expect(() => getEntityGauge(state, "ghost", "fatigue")).toThrow(
      "Unknown entity id: ghost"
    );
    expect(() => getRelationshipDimension(state, "ghost->shop", "trust")).toThrow(
      "Unknown relationship id: ghost->shop"
    );
  });
});
