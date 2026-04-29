import { describe, expect, it } from "vitest";
import { createInitialState } from "./initialState";

describe("createInitialState", () => {
  it("seeds the canonical world entities and relationships", () => {
    const state = createInitialState();

    expect(Object.keys(state.world.entities).sort()).toEqual([
      "apprentice",
      "player",
      "shop",
      "town"
    ]);
    expect(Object.keys(state.world.relationships).sort()).toEqual([
      "apprentice->player",
      "town->shop"
    ]);
    expect(state.world.entities.shop.quantities).toMatchObject({
      coins: 18,
      stock: 3
    });
    expect(state.world.entities.player.gauges).toMatchObject({
      fatigue: 0,
      compassion: 0,
      prudence: 0,
      ambition: 0
    });
  });
});
