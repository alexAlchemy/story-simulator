import { describe, expect, it } from "vitest";
import {
  decreaseEntityGauge,
  gainQuantity,
  increaseEntityGauge,
  spendQuantity
} from "../effects";

describe("semantic effect helpers", () => {
  it("turns human-sized entity gauge changes into numeric effects", () => {
    expect(increaseEntityGauge("player", "compassion", "strongly")).toEqual({
      kind: "changeProperty",
      entityId: "player",
      property: "compassion",
      direction: "increase",
      amount: 0.3,
      strength: "major"
    });

    expect(decreaseEntityGauge("player", "prudence", "moderately")).toEqual({
      kind: "changeProperty",
      entityId: "player",
      property: "prudence",
      direction: "decrease",
      amount: 0.2,
      strength: "meaningful"
    });
  });

  it("keeps material quantities explicit", () => {
    expect(gainQuantity("shop", "coins", 4)).toEqual({
      kind: "changeProperty",
      entityId: "shop",
      property: "coins",
      direction: "increase",
      amount: 4
    });

    expect(spendQuantity("shop", "stock", 2)).toEqual({
      kind: "changeProperty",
      entityId: "shop",
      property: "stock",
      direction: "decrease",
      amount: 2
    });
  });

});
