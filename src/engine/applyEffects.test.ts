import { describe, expect, it } from "vitest";
import { createInitialState } from "../domain/initialState";
import { applyEffects } from "./applyEffects";

describe("applyEffects", () => {
  it("applies all supported effect kinds", () => {
    const state = createInitialState();

    const next = applyEffects(
      state,
      [
        { kind: "resource", key: "coins", delta: 5 },
        { kind: "value", key: "compassion", delta: 2 },
        { kind: "relationship", key: "townTrust", delta: 1 },
        { kind: "setFlag", key: "sample_flag", value: true },
        { kind: "addScene", sceneId: "counting-coins" },
        { kind: "removeScene", sceneId: "gift-at-door" },
        { kind: "log", text: "A test consequence happened." }
      ],
      { day: 1, sceneId: "test-scene" }
    );

    expect(next.resources.coins).toBe(23);
    expect(next.values.compassion).toBe(2);
    expect(next.relationships.townTrust).toBe(1);
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

  it("clamps resources at zero", () => {
    const next = applyEffects(
      createInitialState(),
      [{ kind: "resource", key: "stock", delta: -99 }],
      { day: 1 }
    );

    expect(next.resources.stock).toBe(0);
  });
});
