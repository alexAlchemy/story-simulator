import { describe, expect, it } from "vitest";
import { createInitialState } from "../content/initialState";
import { applyEffects } from "@aphebis/core";
import {
  getBooleanProperty,
  getNumericProperty
} from "@aphebis/core";
import { propertyDefinitions } from "@aphebis/system-cosy-shop";

describe("applyEffects", () => {
  it("applies all supported effect kinds", () => {
    const state = createInitialState();

    const next = applyEffects(
      state,
      [
        {
          kind: "changeProperty",
          entityId: "shop",
          property: "coins",
          direction: "increase",
          amount: 5
        },
        {
          kind: "changeProperty",
          entityId: "player",
          property: "compassion",
          direction: "increase",
          amount: 0.2
        },
        {
          kind: "changeProperty",
          entityId: "shop",
          property: "shopStanding",
          direction: "increase",
          amount: 0.1
        },
        { kind: "setProperty", entityId: "story", property: "sample_flag", value: true },
        { kind: "addScene", sceneId: "counting-coins" },
        { kind: "removeScene", sceneId: "gift-at-door" },
        { kind: "log", text: "A test consequence happened." }
      ],
      { day: 1, sceneId: "test-scene", propertyDefinitions }
    );

    expect(getNumericProperty(next, "shop", "coins")).toBe(23);
    expect(getNumericProperty(next, "player", "compassion")).toBe(0.2);
    expect(getNumericProperty(next, "shop", "shopStanding")).toBe(0.1);
    expect(getBooleanProperty(next, "story", "sample_flag")).toBe(true);
    expect(next.sceneTableau).toContain("counting-coins");
    expect(next.sceneTableau).not.toContain("gift-at-door");
    expect(next.log.at(-1)?.text).toBe("A test consequence happened.");
  });

  it("does not duplicate added scene ids", () => {
    const state = createInitialState();

    const next = applyEffects(
      state,
      [
        { kind: "addScene", sceneId: "counting-coins" },
        { kind: "addScene", sceneId: "counting-coins" }
      ],
      { day: 1 }
    );

    expect(next.sceneTableau.filter((id) => id === "counting-coins")).toHaveLength(1);
  });

  it("clamps quantity properties at zero", () => {
    const next = applyEffects(
      createInitialState(),
      [
        {
          kind: "changeProperty",
          entityId: "shop",
          property: "stock",
          direction: "decrease",
          amount: 99
        }
      ],
      { day: 1, propertyDefinitions }
    );

    expect(getNumericProperty(next, "shop", "stock")).toBe(0);
  });
});
