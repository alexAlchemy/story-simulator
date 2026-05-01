import { describe, expect, it } from "vitest";

import {
  apprentice,
  createCosyShopWorld,
  story,
  log,
  player,
  scenes,
  shiftAmountDeltas,
  shop,
  town
} from "../index";

describe("cosy shop system helpers", () => {
  it("exports the shared dramatic shift scale", () => {
    expect(shiftAmountDeltas).toEqual({
      slightly: 0.1,
      moderately: 0.2,
      strongly: 0.3
    });
  });

  it("turns shop grammar into property effects", () => {
    expect(shop.spendStock(2)).toEqual({
      kind: "changeProperty",
      entityId: "shop",
      property: "stock",
      direction: "decrease",
      amount: 2
    });
    expect(shop.gainCoins(3)).toEqual({
      kind: "changeProperty",
      entityId: "shop",
      property: "coins",
      direction: "increase",
      amount: 3
    });
  });

  it("turns character and town grammar into property effects", () => {
    expect(player.gainCompassion("moderately")).toEqual({
      kind: "changeProperty",
      entityId: "player",
      property: "compassion",
      direction: "increase",
      amount: 0.2,
      strength: "meaningful"
    });
    expect(player.recoverFatigue("slightly")).toEqual({
      kind: "changeProperty",
      entityId: "player",
      property: "fatigue",
      direction: "decrease",
      amount: 0.1,
      strength: "small"
    });
    expect(apprentice.loseConfidence("strongly")).toEqual({
      kind: "changeProperty",
      entityId: "apprentice",
      property: "confidence",
      direction: "decrease",
      amount: 0.3,
      strength: "major"
    });
    expect(town.gainGossipHeat("moderately")).toEqual({
      kind: "changeProperty",
      entityId: "town",
      property: "gossipHeat",
      direction: "increase",
      amount: 0.2,
      strength: "meaningful"
    });
  });

  it("turns standing grammar into core entity effects", () => {
    expect(shop.gainStanding("slightly")).toEqual({
      kind: "changeProperty",
      entityId: "shop",
      property: "shopStanding",
      direction: "increase",
      amount: 0.1,
      strength: "small"
    });
    expect(apprentice.gainTrust("moderately")).toEqual({
      kind: "changeProperty",
      entityId: "apprentice",
      property: "trust",
      direction: "increase",
      amount: 0.2,
      strength: "meaningful"
    });
  });

  it("exports scene, story fact, and log constructors", () => {
    expect(scenes.add("gift-giver-revealed")).toEqual({
      kind: "addScene",
      sceneId: "gift-giver-revealed"
    });
    expect(scenes.remove("gift-at-door")).toEqual({
      kind: "removeScene",
      sceneId: "gift-at-door"
    });
    expect(story.setFact("stablehand_grateful", true)).toEqual({
      kind: "setProperty",
      entityId: "story",
      property: "stablehand_grateful",
      value: true
    });
    expect(log("A thing happened.")).toEqual({ kind: "log", text: "A thing happened." });
  });

  it("creates the reusable cosy shop world template", () => {
    const world = createCosyShopWorld();

    expect(world.entities.shop.properties).toMatchObject({ coins: 18, stock: 3 });
    expect(world.entities.player.properties).toMatchObject({
      compassion: 0,
      prudence: 0,
      ambition: 0
    });
    expect(world.entities.apprentice.properties).toMatchObject({
      trust: 0,
      affection: 0,
      fear: 0
    });
    expect(world.entities.shop.properties).toMatchObject({
      shopStanding: 0,
      goodwill: 0
    });
    expect(world.entities.story.properties).toEqual({});
  });
});
