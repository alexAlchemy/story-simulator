import { describe, expect, it } from "vitest";
import { createInitialState } from "../content/initialState";
import { applyEffects } from "./applyEffects";
import {
  getEntityGauge,
  getEntityQuantity,
  getRelationshipDimension
} from "./worldAccess";

describe("applyEffects", () => {
  it("applies all supported effect kinds", () => {
    const state = createInitialState();

    const next = applyEffects(
      state,
      [
        { kind: "entityQuantity", entityId: "shop", key: "coins", delta: 5 },
        { kind: "entityGauge", entityId: "player", key: "compassion", delta: 0.2 },
        {
          kind: "relationshipDimension",
          relationshipId: "town->shop",
          key: "trust",
          delta: 0.1
        },
        { kind: "setFlag", key: "sample_flag", value: true },
        { kind: "addScene", sceneId: "counting-coins" },
        { kind: "removeScene", sceneId: "gift-at-door" },
        { kind: "log", text: "A test consequence happened." }
      ],
      { day: 1, sceneId: "test-scene" }
    );

    expect(getEntityQuantity(next, "shop", "coins")).toBe(23);
    expect(getEntityGauge(next, "player", "compassion")).toBe(0.2);
    expect(getRelationshipDimension(next, "town->shop", "trust")).toBe(0.1);
    expect(next.flags.sample_flag).toBe(true);
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

  it("clamps quantities at zero", () => {
    const next = applyEffects(
      createInitialState(),
      [{ kind: "entityQuantity", entityId: "shop", key: "stock", delta: -99 }],
      { day: 1 }
    );

    expect(getEntityQuantity(next, "shop", "stock")).toBe(0);
  });

  it("applies relationship tokens", () => {
    const next = applyEffects(
      createInitialState(),
      [
        {
          kind: "addRelationshipToken",
          relationshipId: "apprentice->player",
          token: {
            id: "test-token",
            kind: "promise",
            label: "A test promise"
          }
        }
      ],
      { day: 1, sceneId: "test-scene" }
    );

    expect(next.world.relationships["apprentice->player"].tokens).toContainEqual({
      id: "test-token",
      kind: "promise",
      label: "A test promise"
    });
  });
});
