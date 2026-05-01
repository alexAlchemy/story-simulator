import { describe, expect, it } from "vitest";
import { createInitialState } from "./initialState";

describe("createInitialState", () => {
  it("seeds the canonical world entities", () => {
    const state = createInitialState();

    expect(Object.keys(state.world.entities).sort()).toEqual([
      "apprentice",
      "player",
      "shop",
      "story",
      "town"
    ]);
    expect(state.world.entities.shop.properties).toMatchObject({
      coins: 18,
      stock: 3
    });
    expect(state.world.entities.shop.properties).toMatchObject({
      shopStanding: 0,
      goodwill: 0
    });
    expect(state.world.entities.player.properties).toMatchObject({
      fatigue: 0,
      compassion: 0,
      prudence: 0,
      ambition: 0
    });
    expect(state.world.entities.apprentice.properties).toMatchObject({
      confidence: 0.35,
      trust: 0,
      affection: 0,
      fear: 0
    });
    expect(state.world.entities.story.properties).toEqual({});
  });
});
