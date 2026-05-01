import { describe, expect, it } from "vitest";
import {
  decreaseProperty,
  gainPropertyAmount,
  increaseProperty,
  spendPropertyAmount
} from "../effects";

describe("semantic effect helpers", () => {
  it("turns human-sized property changes into property effects", () => {
    expect(increaseProperty("player", "compassion", "strongly")).toEqual({
      kind: "changeProperty",
      entityId: "player",
      property: "compassion",
      direction: "increase",
      amount: 0.3,
      strength: "major"
    });

    expect(decreaseProperty("player", "prudence", "moderately")).toEqual({
      kind: "changeProperty",
      entityId: "player",
      property: "prudence",
      direction: "decrease",
      amount: 0.2,
      strength: "meaningful"
    });
  });

  it("keeps material property amounts explicit", () => {
    expect(gainPropertyAmount("shop", "coins", 4)).toEqual({
      kind: "changeProperty",
      entityId: "shop",
      property: "coins",
      direction: "increase",
      amount: 4
    });

    expect(spendPropertyAmount("shop", "stock", 2)).toEqual({
      kind: "changeProperty",
      entityId: "shop",
      property: "stock",
      direction: "decrease",
      amount: 2
    });
  });

});
