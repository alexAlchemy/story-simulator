import { describe, expect, it } from "vitest";
import {
  decreaseEntityGauge,
  decreaseRelationshipDimension,
  gainQuantity,
  increaseEntityGauge,
  increaseRelationshipDimension,
  spendQuantity
} from "./effects";

describe("semantic effect helpers", () => {
  it("turns human-sized entity gauge changes into numeric effects", () => {
    expect(increaseEntityGauge("player", "compassion", "strongly")).toEqual({
      kind: "entityGauge",
      entityId: "player",
      key: "compassion",
      delta: 0.3
    });

    expect(decreaseEntityGauge("player", "prudence", "moderately")).toEqual({
      kind: "entityGauge",
      entityId: "player",
      key: "prudence",
      delta: -0.2
    });
  });

  it("turns human-sized relationship dimension changes into numeric effects", () => {
    expect(increaseRelationshipDimension("apprentice->player", "trust", "moderately")).toEqual({
      kind: "relationshipDimension",
      relationshipId: "apprentice->player",
      key: "trust",
      delta: 0.2
    });

    expect(decreaseRelationshipDimension("apprentice->player", "fear", "slightly")).toEqual({
      kind: "relationshipDimension",
      relationshipId: "apprentice->player",
      key: "fear",
      delta: -0.1
    });
  });

  it("keeps material quantities explicit", () => {
    expect(gainQuantity("shop", "coins", 4)).toEqual({
      kind: "entityQuantity",
      entityId: "shop",
      key: "coins",
      delta: 4
    });

    expect(spendQuantity("shop", "stock", 2)).toEqual({
      kind: "entityQuantity",
      entityId: "shop",
      key: "stock",
      delta: -2
    });
  });

});
