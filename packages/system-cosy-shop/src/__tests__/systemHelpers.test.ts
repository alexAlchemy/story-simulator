import { describe, expect, it } from "vitest";

import {
  apprentice,
  createCosyShopWorld,
  flags,
  log,
  player,
  relation,
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

  it("turns shop grammar into core quantity effects", () => {
    expect(shop.spendStock(2)).toEqual({
      kind: "entityQuantity",
      entityId: "shop",
      key: "stock",
      delta: -2
    });
    expect(shop.gainCoins(3)).toEqual({
      kind: "entityQuantity",
      entityId: "shop",
      key: "coins",
      delta: 3
    });
  });

  it("turns character and town grammar into core gauge effects", () => {
    expect(player.gainCompassion("moderately")).toEqual({
      kind: "entityGauge",
      entityId: "player",
      key: "compassion",
      delta: 0.2
    });
    expect(player.recoverFatigue("slightly")).toEqual({
      kind: "entityGauge",
      entityId: "player",
      key: "fatigue",
      delta: -0.1
    });
    expect(apprentice.loseConfidence("strongly")).toEqual({
      kind: "entityGauge",
      entityId: "apprentice",
      key: "confidence",
      delta: -0.3
    });
    expect(town.gainGossipHeat("moderately")).toEqual({
      kind: "entityGauge",
      entityId: "town",
      key: "gossipHeat",
      delta: 0.2
    });
  });

  it("turns relationship grammar into core relationship effects and tokens", () => {
    expect(relation("town", "shop").gainTrust("slightly")).toEqual({
      kind: "relationshipDimension",
      relationshipId: "town->shop",
      key: "trust",
      delta: 0.1
    });
    expect(
      relation("apprentice", "player").addDebt({
        id: "borrowed-potion",
        label: "Borrowed a potion",
        sourceSceneId: "sample"
      })
    ).toEqual({
      kind: "addRelationshipToken",
      relationshipId: "apprentice->player",
      token: {
        id: "borrowed-potion",
        kind: "debt",
        label: "Borrowed a potion",
        sourceSceneId: "sample"
      }
    });
  });

  it("exports scene, flag, and log constructors", () => {
    expect(scenes.add("gift-giver-revealed")).toEqual({
      kind: "addScene",
      sceneId: "gift-giver-revealed"
    });
    expect(scenes.remove("gift-at-door")).toEqual({
      kind: "removeScene",
      sceneId: "gift-at-door"
    });
    expect(flags.set("stablehand_grateful", true)).toEqual({
      kind: "setFlag",
      key: "stablehand_grateful",
      value: true
    });
    expect(log("A thing happened.")).toEqual({ kind: "log", text: "A thing happened." });
  });

  it("creates the reusable cosy shop world template", () => {
    const world = createCosyShopWorld();

    expect(world.entities.shop.quantities).toMatchObject({ coins: 18, stock: 3 });
    expect(world.entities.player.gaugeRanges).toMatchObject({
      compassion: { minimumValue: -1, maximumValue: 1 }
    });
    expect(world.relationships["apprentice->player"].dimensions).toMatchObject({
      trust: 0,
      affection: 0,
      fear: 0
    });
    expect(world.relationships["town->shop"].dimensions).toMatchObject({
      trust: 0,
      goodwill: 0
    });
  });
});
